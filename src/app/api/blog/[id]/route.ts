import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

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
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.slug != null && { slug: body.slug.trim() }),
        ...(body.title != null && { title: body.title.trim() }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn?.trim() || null }),
        ...(body.titleZh !== undefined && { titleZh: body.titleZh?.trim() || null }),
        ...(body.titleRu !== undefined && { titleRu: body.titleRu?.trim() || null }),
        ...(body.excerpt != null && { excerpt: body.excerpt.trim() }),
        ...(body.excerptEn !== undefined && { excerptEn: body.excerptEn?.trim() || null }),
        ...(body.excerptZh !== undefined && { excerptZh: body.excerptZh?.trim() || null }),
        ...(body.excerptRu !== undefined && { excerptRu: body.excerptRu?.trim() || null }),
        ...(body.content != null && { content: body.content.trim() }),
        ...(body.contentEn !== undefined && { contentEn: body.contentEn?.trim() || null }),
        ...(body.contentZh !== undefined && { contentZh: body.contentZh?.trim() || null }),
        ...(body.contentRu !== undefined && { contentRu: body.contentRu?.trim() || null }),
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
