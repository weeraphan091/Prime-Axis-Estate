import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { propertyToPrisma, prismaToProperty } from '@/lib/property-db'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const now = new Date().toISOString().slice(0, 10)
    const payload = {
      title: body.title,
      listingType: body.listingType || 'sale',
      propertyType: body.propertyType || 'condo',
      price: Number(body.price) || 0,
      priceLabel: body.priceLabel || (body.listingType === 'rent' ? 'ต่อเดือน' : undefined),
      location: body.location || '',
      mapUrl: body.mapUrl || undefined,
      area: Number(body.area) || 0,
      bedrooms: body.bedrooms != null ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms != null ? Number(body.bathrooms) : undefined,
      images: Array.isArray(body.images) ? body.images : [],
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : [],
      contactName: body.contactName || '',
      contactPhone: body.contactPhone || '',
      contactEmail: body.contactEmail || '',
      isFeatured: false,
      isOwnerListing: true,
      createdAt: now,
    }
    const data = propertyToPrisma(payload)
    const created = await prisma.property.create({
      data: data as Parameters<typeof prisma.property.create>[0]['data'],
    })
    return NextResponse.json(prismaToProperty(created))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'บันทึกรายการไม่สำเร็จ' }, { status: 500 })
  }
}
