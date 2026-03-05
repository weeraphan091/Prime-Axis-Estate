import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { BlogForm } from '../BlogForm'

export default async function AdminNewBlogPage() {
  if (!(await hasAdminSession())) redirect('/admin/login')
  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">เขียนบทความใหม่</h1>
      <BlogForm />
    </div>
  )
}
