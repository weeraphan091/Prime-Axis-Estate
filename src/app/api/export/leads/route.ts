import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

function escapeCsv(s: string): string {
  if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET() {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const BATCH = 500
    const headers = [
      'id', 'propertyId', 'propertyTitle', 'name', 'phone', 'email',
      'interestType', 'contactWhen', 'viewWhen', 'message', 'status', 'agentName', 'createdAt',
    ]
    const rows: string[] = []
    let cursor: { id: string } | undefined
    for (;;) {
      const batch = await prisma.lead.findMany({
        take: BATCH,
        orderBy: { id: 'asc' },
        ...(cursor ? { skip: 1, cursor } : {}),
        include: { agent: { select: { name: true } } },
      })
      if (batch.length === 0) break
      for (const p of batch) {
        rows.push(
          [
            p.id,
            p.propertyId,
            p.propertyTitle ?? '',
            p.name,
            p.phone,
            p.email,
            p.interestType ?? '',
            p.contactWhen ?? '',
            p.viewWhen ?? '',
            (p.message ?? '').replace(/\n/g, ' '),
            p.status,
            p.agent?.name ?? '',
            p.createdAt,
          ]
            .map(String)
            .map(escapeCsv)
            .join(',')
        )
      }
      cursor = { id: batch[batch.length - 1].id }
      if (batch.length < BATCH) break
    }
    const csv = [headers.join(','), ...rows].join('\n')
    const bom = '\uFEFF'
    return new NextResponse(bom + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=leads.csv',
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
