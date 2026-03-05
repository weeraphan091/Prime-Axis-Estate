import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { Pencil } from 'lucide-react'
import { AdminBlogDeleteButton } from './AdminBlogDeleteButton'

const categoryLabels: Record<string, string> = {
  guide: 'คู่มือ',
  market: 'ตลาด',
  legal: 'กฎหมาย',
  tips: 'เคล็ดลับ',
}

export default async function AdminBlogPage() {
  if (!(await hasAdminSession())) redirect('/admin/login')

  let posts: { id: string; slug: string; title: string; category: string; status: string; createdAt: string }[] = []
  let dbError = false
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, title: true, category: true, status: true, createdAt: true },
    })
  } catch {
    dbError = true
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-stone-900">บล็อก</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            + เขียนบทความ
          </Link>
        </div>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm mb-6">
          <p>โหลดข้อมูลไม่ได้ — ตรวจสอบว่าตาราง <strong>BlogPost</strong> ถูกสร้างแล้ว</p>
          <p className="mt-1">รัน SQL ในไฟล์ <code className="bg-amber-100 px-1 rounded">sql-เพิ่มตาราง-BlogPost.sql</code> ใน Supabase SQL Editor</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left p-3 font-semibold text-stone-700">หัวข้อ</th>
                <th className="text-left p-3 font-semibold text-stone-700">Slug</th>
                <th className="text-left p-3 font-semibold text-stone-700">หมวด</th>
                <th className="text-left p-3 font-semibold text-stone-700">สถานะ</th>
                <th className="text-left p-3 font-semibold text-stone-700">วันที่</th>
                <th className="text-right p-3 font-semibold text-stone-700">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-3">
                    <Link href={`/admin/blog/${p.id}/edit`} className="font-medium text-stone-900 hover:text-primary-600 line-clamp-1">
                      {p.title}
                    </Link>
                  </td>
                  <td className="p-3 text-stone-500 font-mono text-xs">{p.slug}</td>
                  <td className="p-3">{categoryLabels[p.category] ?? p.category}</td>
                  <td className="p-3">
                    <span className={p.status === 'published' ? 'text-green-600' : 'text-amber-600'}>
                      {p.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-500">{p.createdAt}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${p.id}/edit`}
                        className="p-2 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-800"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminBlogDeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && !dbError && (
          <div className="p-12 text-center text-stone-500">
            ยังไม่มีบทความ — <Link href="/admin/blog/new" className="text-primary-600 hover:underline">เขียนบทความแรก</Link>
          </div>
        )}
      </div>
    </div>
  )
}
