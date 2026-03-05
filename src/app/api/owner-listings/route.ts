import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { propertyToPrisma, prismaToProperty } from '@/lib/property-db'
import { translatePropertyContent, type ContentLang } from '@/lib/translate'

const CONTENT_LANGS: ContentLang[] = ['th', 'en', 'zh', 'ru']
function toContentLang(v: unknown): ContentLang {
  return CONTENT_LANGS.includes(v as ContentLang) ? (v as ContentLang) : 'th'
}

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
      projectName: body.projectName?.trim() || undefined,
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
      contactLine: body.contactLine?.trim() || undefined,
      contactWhatsapp: body.contactWhatsapp?.trim() || undefined,
      isFeatured: false,
      isOwnerListing: true,
      listingSource: 'owner_direct',
      status: 'published',
      rentOccupied: body.listingType === 'rent' ? !!body.rentOccupied : false,
      rentLeaseStart: body.listingType === 'rent' && body.rentLeaseStart ? String(body.rentLeaseStart).slice(0, 10) : undefined,
      rentLeaseEnd: body.listingType === 'rent' && body.rentLeaseEnd ? String(body.rentLeaseEnd).slice(0, 10) : undefined,
      floor: (body.propertyType === 'condo' || body.propertyType === 'apartment') && body.floor != null && body.floor !== '' ? Number(body.floor) : undefined,
      roomNumber: (body.propertyType === 'condo' || body.propertyType === 'apartment') && body.roomNumber ? String(body.roomNumber).trim() : undefined,
      floors: (body.propertyType === 'house' || body.propertyType === 'villa') && body.floors != null && body.floors !== '' ? Number(body.floors) : undefined,
      createdAt: now,
    }
    const contentLang = toContentLang(body.contentLanguage ?? 'th')
    const translated = await translatePropertyContent(
      payload.title ?? '',
      payload.description ?? '',
      contentLang
    )
    const data = { ...propertyToPrisma({ ...payload, ...translated }), userId: session.userId }
    const created = await prisma.property.create({
      data: data as Parameters<typeof prisma.property.create>[0]['data'],
    })
    return NextResponse.json(prismaToProperty(created))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'บันทึกรายการไม่สำเร็จ' }, { status: 500 })
  }
}
