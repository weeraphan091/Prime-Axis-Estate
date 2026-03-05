import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
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
    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug.trim(),
        title: body.title.trim(),
        titleEn: body.titleEn?.trim() || null,
        titleZh: body.titleZh?.trim() || null,
        titleRu: body.titleRu?.trim() || null,
        excerpt: body.excerpt?.trim() || body.content.slice(0, 200),
        excerptEn: body.excerptEn?.trim() || null,
        excerptZh: body.excerptZh?.trim() || null,
        excerptRu: body.excerptRu?.trim() || null,
        content: body.content.trim(),
        contentEn: body.contentEn?.trim() || null,
        contentZh: body.contentZh?.trim() || null,
        contentRu: body.contentRu?.trim() || null,
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
