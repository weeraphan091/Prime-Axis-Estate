import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'
import { translateBlogContent, type ContentLang } from '@/lib/translate'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, title: true, titleEn: true, titleZh: true, titleRu: true,
        excerpt: true, excerptEn: true, excerptZh: true, excerptRu: true,
        coverImage: true, category: true, tags: true, status: true,
        createdAt: true, updatedAt: true,
      },
    })
    const res = NextResponse.json(posts)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res
  } catch (e) {
    console.error('[blog GET]', e)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    if (!body.title?.trim() || !body.slug?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: 'กรุณากรอก title, slug, content' }, { status: 400 })
    }
    const now = new Date().toISOString().slice(0, 10)
    const title = body.title.trim()
    const excerpt = body.excerpt?.trim() || body.content.slice(0, 200)
    const content = body.content.trim()
    const sourceLang: ContentLang = body.contentLanguage || 'th'

    let titleEn = body.titleEn?.trim() || null
    let titleZh = body.titleZh?.trim() || null
    let titleRu = body.titleRu?.trim() || null
    let excerptEn = body.excerptEn?.trim() || null
    let excerptZh = body.excerptZh?.trim() || null
    let excerptRu = body.excerptRu?.trim() || null
    let contentEn = body.contentEn?.trim() || null
    let contentZh = body.contentZh?.trim() || null
    let contentRu = body.contentRu?.trim() || null

    const needsTranslation = !titleEn || !titleZh || !titleRu
    if (needsTranslation) {
      try {
        const translated = await translateBlogContent(title, excerpt, content, sourceLang)
        titleEn = titleEn || translated.titleEn || null
        titleZh = titleZh || translated.titleZh || null
        titleRu = titleRu || translated.titleRu || null
        excerptEn = excerptEn || translated.excerptEn || null
        excerptZh = excerptZh || translated.excerptZh || null
        excerptRu = excerptRu || translated.excerptRu || null
        contentEn = contentEn || translated.contentEn || null
        contentZh = contentZh || translated.contentZh || null
        contentRu = contentRu || translated.contentRu || null
      } catch (e) {
        console.warn('[blog POST] auto-translate failed:', e)
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug.trim(),
        title,
        titleEn, titleZh, titleRu,
        excerpt,
        excerptEn, excerptZh, excerptRu,
        content,
        contentEn, contentZh, contentRu,
        coverImage: body.coverImage?.trim() || null,
        category: body.category || 'tips',
        tags: typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags ?? []),
        status: body.status || 'published',
        createdAt: body.createdAt || now,
        updatedAt: now,
      },
    })
    return NextResponse.json(post)
  } catch (e) {
    console.error('[blog POST]', e)
    const msg = (e as Error)?.message ?? ''
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'slug นี้ถูกใช้แล้ว' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
