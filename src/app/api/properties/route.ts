import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
  prismaToProperty,
  propertyToPrisma,
  propertyForPublic,
  propertyForLocale,
  getPublishedPropertiesByIds,
  buildPublishedPropertyWhere,
  DEFAULT_API_LISTINGS_TAKE,
  MAX_LISTINGS_TAKE,
  PROPERTY_PUBLIC_LIST_SELECT,
  prismaToPropertyFromListRow,
  type PropertyListFilters,
} from '@/lib/property-db'
import { hasAdminSession } from '@/lib/admin-auth'
import { isValidLocale, type Locale } from '@/config/i18n'
import { translatePropertyContent, type ContentLang } from '@/lib/translate'
import type { Property } from '@/types/property'

const CONTENT_LANGS: ContentLang[] = ['th', 'en', 'zh', 'ru']
function toContentLang(v: unknown): ContentLang {
  return CONTENT_LANGS.includes(v as ContentLang) ? (v as ContentLang) : 'th'
}

export async function GET(request: Request) {
  try {
    const url = request.url ? new URL(request.url) : null
    const localeParam = url?.searchParams?.get('locale')
    const locale: Locale | undefined = localeParam && isValidLocale(localeParam) ? localeParam : undefined

    const idsRaw = url?.searchParams?.get('ids')
    if (idsRaw?.trim()) {
      const ids = idsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 50)
      const list = await getPublishedPropertiesByIds(ids, locale)
      const properties: Property[] = list.map((p) => propertyForPublic(p))
      const res = NextResponse.json(properties)
      res.headers.set('Cache-Control', 'private, no-store')
      return res
    }

    const takeParam = url?.searchParams?.get('limit')
    const takeParsed = takeParam != null ? Number(takeParam) : DEFAULT_API_LISTINGS_TAKE
    const take = Math.min(Math.max(Number.isFinite(takeParsed) ? takeParsed : DEFAULT_API_LISTINGS_TAKE, 1), MAX_LISTINGS_TAKE)

    const type = url?.searchParams?.get('type')
    const property = url?.searchParams?.get('property')
    const location = url?.searchParams?.get('location')
    const minP = url?.searchParams?.get('minPrice')
    const maxP = url?.searchParams?.get('maxPrice')
    const minPrice = minP != null && minP !== '' ? Number(minP) : null
    const maxPrice = maxP != null && maxP !== '' ? Number(maxP) : null

    const filters: PropertyListFilters = {
      listingType: type === 'sale' || type === 'rent' ? type : null,
      propertyType:
        property === 'condo' ||
        property === 'house' ||
        property === 'villa' ||
        property === 'apartment' ||
        property === 'land' ||
        property === 'commercial'
          ? property
          : null,
      location: location?.trim() || null,
      minPrice: minPrice != null && Number.isFinite(minPrice) ? minPrice : null,
      maxPrice: maxPrice != null && Number.isFinite(maxPrice) ? maxPrice : null,
    }

    const rows = await prisma.property.findMany({
      where: buildPublishedPropertyWhere(filters),
      orderBy: { updatedAt: 'desc' },
      take,
      select: PROPERTY_PUBLIC_LIST_SELECT,
    })
    const properties: Property[] = rows.map((row) => {
      let prop = prismaToPropertyFromListRow(row)
      if (locale) prop = propertyForLocale(prop, locale)
      return propertyForPublic(prop)
    })
    const res = NextResponse.json(properties)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
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
    const body = (await request.json()) as Omit<Property, 'id' | 'createdAt'> & { createdAt?: string; contentLanguage?: string }
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
    const contentLang = toContentLang(body.contentLanguage ?? 'th')
    const rawFeat = body.features as unknown
    const features: string[] = Array.isArray(rawFeat) ? rawFeat : (typeof rawFeat === 'string' ? rawFeat.split(',').map((s: string) => s.trim()).filter(Boolean) : [])
    const translated = await translatePropertyContent(
      body.title ?? '',
      body.description ?? '',
      contentLang,
      features,
      body.location ?? ''
    )
    const data = propertyToPrisma({
      ...body,
      ...translated,
      createdAt: body.createdAt || now,
    })
    const created = await prisma.property.create({
      data: data as Parameters<typeof prisma.property.create>[0]['data'],
    })
    revalidatePath('/', 'layout')
    return NextResponse.json(prismaToProperty(created))
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
