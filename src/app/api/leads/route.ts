import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { agent: { select: { id: true, name: true } } },
    })
    return NextResponse.json(leads)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}
