import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await request.json()
    const status = body.status as string | undefined
    const agentId = body.agentId as string | undefined
    const data: { status?: string; agentId?: string | null; updatedAt: string } = {
      updatedAt: new Date().toISOString().slice(0, 19),
    }
    if (status !== undefined) data.status = status
    if (agentId !== undefined) data.agentId = agentId || null
    const updated = await prisma.lead.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}
