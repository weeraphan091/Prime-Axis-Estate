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
    for (const post of blogPosts) {
      const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
      if (!exists) {
        await prisma.blogPost.create({ data: post as Parameters<typeof prisma.blogPost.create>[0]['data'] })
        created++
      }
    }
    return NextResponse.json({ ok: true, created, total: blogPosts.length })
  } catch (e) {
    console.error('[blog seed]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
