import type { Property } from '@/types/property'
import type { ListingType, PropertyType } from '@/types/property'
import type { Property as PrismaProperty } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import type { Locale } from '@/config/i18n'
import { translateLocation } from '@/config/zones'

/** จำกัดจำนวนแถวสูงสุดต่อครั้งเพื่อกัน query โหลดทั้งตาราง */
export const MAX_LISTINGS_TAKE = 2000
// ค่าเริ่มต้นสำหรับหน้า public list (ลดเพื่อไม่ให้ ISR fallback หนาเกิน)
export const DEFAULT_API_LISTINGS_TAKE = 20

type PrismaPropertyRow = PrismaProperty & {
  titleEn?: string | null
  descriptionEn?: string | null
  titleZh?: string | null
  descriptionZh?: string | null
  titleRu?: string | null
  descriptionRu?: string | null
  featuresEn?: string | null
  featuresZh?: string | null
  featuresRu?: string | null
  locationEn?: string | null
  locationZh?: string | null
  locationRu?: string | null
  listingSource?: string | null
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (raw == null || String(raw).trim() === '') return []
  try {
    const v = JSON.parse(String(raw))
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
    listingSource: (row.listingSource === 'owner_direct' || row.listingSource === 'from_agent') ? row.listingSource : undefined,
    status: p.status ?? 'published',
    agentId: p.agentId ?? undefined,
    rentOccupied: p.rentOccupied ?? false,
    rentMinLease: p.rentMinLease ?? undefined,
    rentLeaseStart: p.rentLeaseStart ?? undefined,
    rentLeaseEnd: p.rentLeaseEnd ?? undefined,
    originalPrice: p.originalPrice ?? undefined,
    quotaType: (p.quotaType === 'TH' || p.quotaType === 'FQ') ? p.quotaType : undefined,
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
    featuresEn: parseJsonArray(row.featuresEn),
    featuresZh: parseJsonArray(row.featuresZh),
    featuresRu: parseJsonArray(row.featuresRu),
    locationEn: row.locationEn ?? undefined,
    locationZh: row.locationZh ?? undefined,
    locationRu: row.locationRu ?? undefined,
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
    listingSource: p.listingSource ?? null,
    status: p.status ?? 'published',
    agentId: p.agentId ?? null,
    rentOccupied: p.rentOccupied ?? false,
    rentMinLease: p.rentMinLease ?? null,
    rentLeaseStart: p.rentLeaseStart ?? null,
    rentLeaseEnd: p.rentLeaseEnd ?? null,
    originalPrice: p.originalPrice ?? null,
    quotaType: p.quotaType ?? null,
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
    featuresEn: p.featuresEn ? JSON.stringify(p.featuresEn) : null,
    featuresZh: p.featuresZh ? JSON.stringify(p.featuresZh) : null,
    featuresRu: p.featuresRu ? JSON.stringify(p.featuresRu) : null,
    locationEn: p.locationEn ?? null,
    locationZh: p.locationZh ?? null,
    locationRu: p.locationRu ?? null,
    createdAt: p.createdAt,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

/** คืน title/description/features/location ตาม locale (fallback เป็นภาษาไทย) */
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
  const pickFeatures = (): string[] => {
    const arr =
      (locale === 'en' && p.featuresEn?.length ? p.featuresEn : null) ??
      (locale === 'zh' && p.featuresZh?.length ? p.featuresZh : null) ??
      (locale === 'ru' && p.featuresRu?.length ? p.featuresRu : null)
    return arr ?? p.features
  }
  const location =
    (locale === 'en' && p.locationEn) ||
    (locale === 'zh' && p.locationZh) ||
    (locale === 'ru' && p.locationRu) ||
    translateLocation(p.location, locale)
  const RENT_LABEL: Record<string, string> = { th: '/เดือน', en: '/month', zh: '/月', ru: '/мес.' }
  const priceLabel =
    p.listingType === 'rent' ? (RENT_LABEL[locale] ?? RENT_LABEL.en) : p.priceLabel
  return { ...p, title, description, features: pickFeatures(), location, priceLabel }
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

/** Select เฉพาะฟิลด์ที่ใช้บนการ์ด/ลิสต์สาธารณะ — ไม่ดึง description หลัก (ข้อความยาว) */
export const PROPERTY_PUBLIC_LIST_SELECT = {
  id: true,
  title: true,
  projectName: true,
  listingType: true,
  propertyType: true,
  price: true,
  priceLabel: true,
  location: true,
  mapUrl: true,
  area: true,
  bedrooms: true,
  bathrooms: true,
  images: true,
  features: true,
  contactName: true,
  contactPhone: true,
  contactEmail: true,
  contactLine: true,
  contactWhatsapp: true,
  isFeatured: true,
  isOwnerListing: true,
  listingSource: true,
  status: true,
  agentId: true,
  rentOccupied: true,
  rentMinLease: true,
  rentLeaseStart: true,
  rentLeaseEnd: true,
  originalPrice: true,
  quotaType: true,
  floor: true,
  roomNumber: true,
  floors: true,
  viewCount: true,
  userId: true,
  titleEn: true,
  titleZh: true,
  titleRu: true,
  featuresEn: true,
  featuresZh: true,
  featuresRu: true,
  locationEn: true,
  locationZh: true,
  locationRu: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PropertySelect

type PropertyListRow = Prisma.PropertyGetPayload<{ select: typeof PROPERTY_PUBLIC_LIST_SELECT }>

/** แมปแถวจาก list-query (ไม่มี description หลัก) → Property */
export function prismaToPropertyFromListRow(row: PropertyListRow): Property {
  return prismaToProperty({
    ...row,
    description: '',
  } as unknown as PrismaPropertyRow)
}

export type PropertyListFilters = {
  listingType?: ListingType | null
  propertyType?: PropertyType | null
  location?: string | null
  minPrice?: number | null
  maxPrice?: number | null
}

const VALID_PROPERTY_TYPES: PropertyType[] = ['condo', 'house', 'villa', 'apartment', 'land', 'commercial']

export function buildPublishedPropertyWhere(filters: PropertyListFilters): Prisma.PropertyWhereInput {
  const and: Prisma.PropertyWhereInput[] = [{ status: 'published' }]
  if (filters.listingType === 'sale' || filters.listingType === 'rent') {
    and.push({ listingType: filters.listingType })
  }
  if (filters.propertyType && VALID_PROPERTY_TYPES.includes(filters.propertyType)) {
    and.push({ propertyType: filters.propertyType })
  }
  if (filters.minPrice != null && Number.isFinite(filters.minPrice)) {
    and.push({ price: { gte: filters.minPrice } })
  }
  if (filters.maxPrice != null && Number.isFinite(filters.maxPrice)) {
    and.push({ price: { lte: filters.maxPrice } })
  }
  const loc = filters.location?.trim()
  if (loc) {
    and.push({ location: { contains: loc, mode: 'insensitive' } })
  }
  return { AND: and }
}

export async function getPublishedPropertiesForPublicList(
  filters: PropertyListFilters,
  locale: Locale | undefined,
  opts: { take?: number; skip?: number }
): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const take = Math.min(Math.max(opts.take ?? DEFAULT_API_LISTINGS_TAKE, 1), MAX_LISTINGS_TAKE)
    const skip = Math.max(opts.skip ?? 0, 0)
    const rows = await prisma.property.findMany({
      where: buildPublishedPropertyWhere(filters),
      orderBy: { updatedAt: 'desc' },
      take,
      skip,
      select: PROPERTY_PUBLIC_LIST_SELECT,
    })
    let mapped = rows.map((r) => prismaToPropertyFromListRow(r))
    if (locale) mapped = mapped.map((p) => propertyForLocale(p, locale))
    // ลิสต์สาธารณะไม่ต้องส่งข้อมูลติดต่อเจ้าของทรัพย์ ลด payload สำหรับ ISR fallback
    return mapped.map(propertyForPublic)
  } catch {
    return []
  }
}

export async function getFeaturedPropertiesFromDb(limit: number, locale?: Locale): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.property.findMany({
      where: { status: 'published', isFeatured: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: PROPERTY_PUBLIC_LIST_SELECT,
    })
    const mapped = rows.map((r) => prismaToPropertyFromListRow(r))
    const localized = locale ? mapped.map((p) => propertyForLocale(p, locale)) : mapped
    return localized.map(propertyForPublic)
  } catch {
    return []
  }
}

export async function getLatestPropertiesFromDb(limit: number, locale?: Locale): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.property.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: PROPERTY_PUBLIC_LIST_SELECT,
    })
    const mapped = rows.map((r) => prismaToPropertyFromListRow(r))
    const localized = locale ? mapped.map((p) => propertyForLocale(p, locale)) : mapped
    return localized.map(propertyForPublic)
  } catch {
    return []
  }
}

export async function getPublishedPropertiesByIds(ids: string[], locale?: Locale): Promise<Property[]> {
  const unique = Array.from(new Set(ids.filter(Boolean))).slice(0, 50)
  if (unique.length === 0) return []
  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.property.findMany({
      where: { id: { in: unique }, status: 'published' },
      orderBy: { updatedAt: 'desc' },
      select: PROPERTY_PUBLIC_LIST_SELECT,
    })
    let mapped = rows.map((r) => prismaToPropertyFromListRow(r))
    if (locale) mapped = mapped.map((p) => propertyForLocale(p, locale))
    mapped = mapped.map(propertyForPublic)
    const byId = new Map(mapped.map((p) => [p.id, p]))
    return unique.map((id) => byId.get(id)).filter((p): p is Property => p != null)
  } catch {
    return []
  }
}

export type SitemapPropertyRef = { id: string; createdAt: string }

export async function getPublishedPropertyRefsForSitemap(): Promise<SitemapPropertyRef[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    return await prisma.property.findMany({
      where: { status: 'published' },
      select: { id: true, createdAt: true },
      orderBy: { updatedAt: 'desc' },
      take: MAX_LISTINGS_TAKE,
    })
  } catch {
    return []
  }
}

/** onlyPublished: true = หน้าเว็บทั่วไป (เฉพาะ published), false = หลังบ้าน (ทุกสถานะ). locale = แปล title/description ตามภาษาที่เลือก */
export async function getPropertiesFromDb(onlyPublished = true, locale?: Locale): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    if (!onlyPublished) {
      const list = await prisma.property.findMany({
        orderBy: { updatedAt: 'desc' },
      })
      const mapped = list.map(prismaToProperty)
      if (locale) return mapped.map((p) => propertyForLocale(p, locale))
      return mapped
    }
    return getPublishedPropertiesForPublicList({}, locale, { take: MAX_LISTINGS_TAKE })
  } catch {
    return []
  }
}
