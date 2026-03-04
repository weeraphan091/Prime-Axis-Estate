import type { Property } from '@/types/property'
import type { Property as PrismaProperty } from '@prisma/client'
import type { Locale } from '@/config/i18n'

type PrismaPropertyRow = PrismaProperty & {
  titleEn?: string | null
  descriptionEn?: string | null
  titleZh?: string | null
  descriptionZh?: string | null
  titleRu?: string | null
  descriptionRu?: string | null
}

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function prismaToProperty(p: PrismaPropertyRow): Property {
  const row = p as PrismaPropertyRow
  return {
    id: p.id,
    title: p.title,
    projectName: p.projectName ?? undefined,
    listingType: p.listingType as Property['listingType'],
    propertyType: p.propertyType as Property['propertyType'],
    price: p.price,
    priceLabel: p.priceLabel ?? undefined,
    location: p.location,
    mapUrl: p.mapUrl ?? undefined,
    area: p.area,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    images: parseJsonArray(p.images),
    description: p.description,
    features: parseJsonArray(p.features),
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    contactLine: p.contactLine ?? undefined,
    contactWhatsapp: p.contactWhatsapp ?? undefined,
    isFeatured: p.isFeatured,
    isOwnerListing: p.isOwnerListing,
    status: p.status ?? 'published',
    agentId: p.agentId ?? undefined,
    rentOccupied: p.rentOccupied ?? false,
    rentLeaseStart: p.rentLeaseStart ?? undefined,
    rentLeaseEnd: p.rentLeaseEnd ?? undefined,
    floor: p.floor ?? undefined,
    roomNumber: p.roomNumber ?? undefined,
    floors: p.floors ?? undefined,
    viewCount: p.viewCount ?? 0,
    userId: p.userId ?? undefined,
    titleEn: row.titleEn ?? undefined,
    descriptionEn: row.descriptionEn ?? undefined,
    titleZh: row.titleZh ?? undefined,
    descriptionZh: row.descriptionZh ?? undefined,
    titleRu: row.titleRu ?? undefined,
    descriptionRu: row.descriptionRu ?? undefined,
    createdAt: p.createdAt,
  }
}

export function propertyToPrisma(p: Omit<Property, 'id'> & { id?: string }) {
  return {
    title: p.title,
    projectName: p.projectName ?? null,
    listingType: p.listingType,
    propertyType: p.propertyType,
    price: p.price,
    priceLabel: p.priceLabel ?? null,
    location: p.location,
    mapUrl: p.mapUrl ?? null,
    area: p.area,
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    images: JSON.stringify(Array.isArray(p.images) ? p.images : []),
    description: p.description,
    features: JSON.stringify(Array.isArray(p.features) ? p.features : []),
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    contactLine: p.contactLine ?? null,
    contactWhatsapp: p.contactWhatsapp ?? null,
    isFeatured: p.isFeatured ?? false,
    isOwnerListing: p.isOwnerListing ?? false,
    status: p.status ?? 'published',
    agentId: p.agentId ?? null,
    rentOccupied: p.rentOccupied ?? false,
    rentLeaseStart: p.rentLeaseStart ?? null,
    rentLeaseEnd: p.rentLeaseEnd ?? null,
    floor: p.floor ?? null,
    roomNumber: p.roomNumber ?? null,
    floors: p.floors ?? null,
    viewCount: p.viewCount ?? 0,
    userId: p.userId ?? null,
    titleEn: p.titleEn ?? null,
    descriptionEn: p.descriptionEn ?? null,
    titleZh: p.titleZh ?? null,
    descriptionZh: p.descriptionZh ?? null,
    titleRu: p.titleRu ?? null,
    descriptionRu: p.descriptionRu ?? null,
    createdAt: p.createdAt,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

/** คืน title/description ตาม locale (fallback เป็นภาษาไทย) */
export function propertyForLocale(p: Property, locale: Locale): Property {
  if (locale === 'th') return p
  const title =
    (locale === 'en' && p.titleEn) ||
    (locale === 'zh' && p.titleZh) ||
    (locale === 'ru' && p.titleRu) ||
    p.title
  const description =
    (locale === 'en' && p.descriptionEn) ||
    (locale === 'zh' && p.descriptionZh) ||
    (locale === 'ru' && p.descriptionRu) ||
    p.description
  return { ...p, title, description }
}

/** สำหรับส่งกลับให้ลูกค้า/สาธารณะ — ไม่ส่งข้อมูลติดต่อเจ้าของทรัพย์ (ติดต่อผ่านนายหน้าเท่านั้น) */
export function propertyForPublic(p: Property): Property {
  const { contactName, contactPhone, contactEmail, contactLine, contactWhatsapp, userId, ...rest } = p
  return {
    ...rest,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactLine: undefined,
    contactWhatsapp: undefined,
    userId: undefined,
  }
}

/** onlyPublished: true = หน้าเว็บทั่วไป (เฉพาะ published), false = หลังบ้าน (ทุกสถานะ). locale = แปล title/description ตามภาษาที่เลือก */
export async function getPropertiesFromDb(onlyPublished = true, locale?: Locale): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const list = await prisma.property.findMany({
      where: onlyPublished ? { status: 'published' } : undefined,
      orderBy: { updatedAt: 'desc' },
    })
    const mapped = list.map(prismaToProperty)
    if (locale) return mapped.map((p) => propertyForLocale(p, locale))
    return mapped
  } catch {
    return []
  }
}
