import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'
import { translateBlogContent, type ContentLang } from '@/lib/translate'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params
  const isAdmin = await hasAdminSession()
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (post.status !== 'published' && !isAdmin) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (e) {
    console.error('[blog GET id]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const body = await request.json()
    const now = new Date().toISOString().slice(0, 10)

    const sourceLang: ContentLang = body.contentLanguage || 'th'
    const title = body.title?.trim() || ''
    const excerpt = body.excerpt?.trim() || ''
    const content = body.content?.trim() || ''

    let titleEn = body.titleEn?.trim() || null
    let titleZh = body.titleZh?.trim() || null
    let titleRu = body.titleRu?.trim() || null
    let excerptEn = body.excerptEn?.trim() || null
    let excerptZh = body.excerptZh?.trim() || null
    let excerptRu = body.excerptRu?.trim() || null
    let contentEn = body.contentEn?.trim() || null
    let contentZh = body.contentZh?.trim() || null
    let contentRu = body.contentRu?.trim() || null

    const needsTranslation = title && (!titleEn || !titleZh || !titleRu)
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
        console.warn('[blog PUT] auto-translate failed:', e)
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.slug != null && { slug: body.slug.trim() }),
        ...(body.title != null && { title }),
        titleEn, titleZh, titleRu,
        ...(body.excerpt != null && { excerpt }),
        excerptEn, excerptZh, excerptRu,
        ...(body.content != null && { content }),
        contentEn, contentZh, contentRu,
        ...(body.coverImage !== undefined && { coverImage: body.coverImage?.trim() || null }),
        ...(body.category != null && { category: body.category }),
        ...(body.tags != null && { tags: typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags) }),
        ...(body.status != null && { status: body.status }),
        updatedAt: now,
      },
    })
    return NextResponse.json(post)
  } catch (e) {
    console.error('[blog PUT]', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[blog DELETE]', e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
