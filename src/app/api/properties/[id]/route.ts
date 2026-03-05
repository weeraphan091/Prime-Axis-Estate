import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { prismaToProperty, propertyToPrisma, propertyForPublic, propertyForLocale } from '@/lib/property-db'
import { hasAdminSession } from '@/lib/admin-auth'
import { isValidLocale, type Locale } from '@/config/i18n'
import { translatePropertyContent, type ContentLang } from '@/lib/translate'

const CONTENT_LANGS: ContentLang[] = ['th', 'en', 'zh', 'ru']
function toContentLang(v: unknown): ContentLang {
  return CONTENT_LANGS.includes(v as ContentLang) ? (v as ContentLang) : 'th'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = request.url ? new URL(request.url) : null
  const localeParam = url?.searchParams?.get('locale')
  const locale: Locale | undefined = localeParam && isValidLocale(localeParam) ? localeParam : undefined
  try {
    const p = await prisma.property.findUnique({ where: { id } })
    if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (p.status !== 'published') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    let prop = propertyForPublic(prismaToProperty(p))
    if (locale) prop = propertyForLocale(prop, locale)
    const res = NextResponse.json(prop)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res
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
    const contentLang = toContentLang(body.contentLanguage ?? 'th')
    const translated = await translatePropertyContent(
      body.title ?? '',
      body.description ?? '',
      contentLang
    )
    const data = propertyToPrisma({ ...body, ...translated })
    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    })
    revalidatePath('/', 'layout')
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
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
