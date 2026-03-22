import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasAdminSession } from '@/lib/admin-auth'
import { blogPosts } from '@/data/blog-posts'

export async function POST() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    let created = 0
    let updated = 0
    const slugs = blogPosts.map((p) => p.slug)
    const existing = await prisma.blogPost.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, coverImage: true },
    })
    const bySlug = new Map(existing.map((e) => [e.slug, e]))
    for (const post of blogPosts) {
      const ex = bySlug.get(post.slug)
      if (!ex) {
        await prisma.blogPost.create({ data: post as Parameters<typeof prisma.blogPost.create>[0]['data'] })
        created++
      } else if (!ex.coverImage && post.coverImage) {
        await prisma.blogPost.update({
          where: { slug: post.slug },
          data: { coverImage: post.coverImage },
        })
        updated++
      }
    }
    return NextResponse.json({ ok: true, created, updated, total: blogPosts.length })
  } catch (e) {
    console.error('[blog seed]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
