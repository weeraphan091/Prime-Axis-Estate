import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaToProperty, propertyToPrisma } from '@/lib/property-db'
import { hasAdminSession } from '@/lib/admin-auth'
import type { Property } from '@/types/property'

export async function GET() {
  try {
    const list = await prisma.property.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    const properties: Property[] = list.map(prismaToProperty)
    return NextResponse.json(properties)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as Omit<Property, 'id' | 'createdAt'> & { createdAt?: string }
    const now = new Date().toISOString().slice(0, 10)
    const data = propertyToPrisma({
      ...body,
      createdAt: body.createdAt || now,
    })
    const created = await prisma.property.create({
      data: data as Parameters<typeof prisma.property.create>[0]['data'],
    })
    return NextResponse.json(prismaToProperty(created))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
