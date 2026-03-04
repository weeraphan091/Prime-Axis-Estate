import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(agents)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const now = new Date().toISOString().slice(0, 19)
    const agent = await prisma.agent.create({
      data: {
        name: String(body.name ?? ''),
        phone: String(body.phone ?? ''),
        email: String(body.email ?? ''),
        lineId: body.lineId ? String(body.lineId) : null,
        isActive: body.isActive !== false,
        createdAt: now,
        updatedAt: now,
      },
    })
    return NextResponse.json(agent)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
