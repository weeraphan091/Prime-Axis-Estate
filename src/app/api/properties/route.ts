import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaToProperty, propertyToPrisma, propertyForPublic, propertyForLocale } from '@/lib/property-db'
import { hasAdminSession } from '@/lib/admin-auth'
import { isValidLocale, type Locale } from '@/config/i18n'
import type { Property } from '@/types/property'

export async function GET(request: Request) {
  try {
    const list = await prisma.property.findMany({
      where: { status: 'published' },
      orderBy: { updatedAt: 'desc' },
    })
    const url = request.url ? new URL(request.url) : null
    const localeParam = url?.searchParams?.get('locale')
    const locale: Locale | undefined = localeParam && isValidLocale(localeParam) ? localeParam : undefined
    const properties: Property[] = list.map((p) => {
      let prop = prismaToProperty(p)
      if (locale) prop = propertyForLocale(prop, locale)
      return propertyForPublic(prop)
    })
    const res = NextResponse.json(properties)
    res.headers.set('Cache-Control', 'no-store, max-age=0')
    return res
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
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'กรุณากรอกหัวข้อ' }, { status: 400 })
    }
    if (!body.contactName?.trim() || !body.contactPhone?.trim() || !body.contactEmail?.trim()) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลช่องทางติดต่อเจ้าของทรัพย์ (ชื่อ, เบอร์โทร, อีเมล)' }, { status: 400 })
    }
    if (Number(body.price) < 0 || Number(body.area) < 0) {
      return NextResponse.json({ error: 'ราคาและพื้นที่ต้องไม่ต่ำกว่า 0' }, { status: 400 })
    }
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
