import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { List, PlusCircle, Phone } from 'lucide-react'

export default async function AdminHomePage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900">หลังบ้าน</h1>
      <p className="mt-1 text-stone-600">จัดการรายการและเนื้อหาเว็บ</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/listings"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <List className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">จัดการรายการ</h2>
            <p className="text-sm text-stone-500">ดู แก้ไข ลบ รายการทั้งหมด</p>
          </div>
        </Link>
        <Link
          href="/admin/listings/new"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">ลงลิสใหม่</h2>
            <p className="text-sm text-stone-500">เพิ่มรายการขาย/เช่าใหม่</p>
          </div>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <Phone className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">ข้อมูลติดต่อ</h2>
            <p className="text-sm text-stone-500">แก้เบอร์/Line/อีเมล — เปลี่ยนจุดเดียวทั้งเว็บ</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
