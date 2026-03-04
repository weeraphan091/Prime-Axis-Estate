import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

/** รายการสมาชิก (ผู้สมัคร) — เฉพาะแอดมิน */
export async function GET() {
  const ok = await hasAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    })
    return NextResponse.json(users)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
