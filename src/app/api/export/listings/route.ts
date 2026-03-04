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
    const list = await prisma.property.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { agent: { select: { name: true } } },
    })
    const headers = [
      'id', 'title', 'listingType', 'propertyType', 'price', 'priceLabel', 'location', 'area',
      'bedrooms', 'bathrooms', 'status', 'agentName', 'contactName', 'contactPhone', 'contactEmail', 'createdAt',
    ]
    const rows = list.map((p) => [
      p.id,
      p.title,
      p.listingType,
      p.propertyType,
      p.price,
      p.priceLabel ?? '',
      p.location,
      p.area,
      p.bedrooms ?? '',
      p.bathrooms ?? '',
      p.status ?? 'published',
      p.agent?.name ?? '',
      p.contactName,
      p.contactPhone,
      p.contactEmail,
      p.createdAt,
    ].map(String).map(escapeCsv).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const bom = '\uFEFF'
    return new NextResponse(bom + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=listings.csv',
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
