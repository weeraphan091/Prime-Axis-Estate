import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { prismaToProperty } from '@/lib/property-db'

/** รายการทรัพย์ที่สมาชิกฝากไว้ + สถิติ (คนสนใจ, จำนวนการดู) */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  }
  try {
    const list = await prisma.property.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: 'desc' },
    })
    const leadCounts = await prisma.lead.groupBy({
      by: ['propertyId'],
      where: { propertyId: { in: list.map((p) => p.id) } },
      _count: { id: true },
    })
    const leadMap = new Map(leadCounts.map((l) => [l.propertyId, l._count.id]))
    const result = list.map((p) => {
      const prop = prismaToProperty(p)
      return {
        ...prop,
        leadCount: leadMap.get(p.id) ?? 0,
        viewCount: p.viewCount ?? 0,
      }
    })
    return NextResponse.json(result)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'โหลดรายการไม่สำเร็จ' }, { status: 500 })
  }
}
