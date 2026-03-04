import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaToProperty, propertyToPrisma } from '@/lib/property-db'
import { hasAdminSession } from '@/lib/admin-auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const p = await prisma.property.findUnique({ where: { id } })
    if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (p.status !== 'published') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(prismaToProperty(p))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(
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
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'กรุณากรอกหัวข้อ' }, { status: 400 })
    }
    if (!body.contactName?.trim() || !body.contactPhone?.trim() || !body.contactEmail?.trim()) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลช่องทางติดต่อเจ้าของทรัพย์ (ชื่อ, เบอร์โทร, อีเมล)' }, { status: 400 })
    }
    const data = propertyToPrisma(body)
    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    })
    return NextResponse.json(prismaToProperty(updated))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    await prisma.property.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
