import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '../../BlogForm'

type Props = { params: Promise<{ id: string }> }

export default async function AdminEditBlogPage({ params }: Props) {
  if (!(await hasAdminSession())) redirect('/admin/login')
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) redirect('/admin/blog')

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">แก้ไขบทความ</h1>
      <BlogForm initial={post} />
    </div>
  )
}
