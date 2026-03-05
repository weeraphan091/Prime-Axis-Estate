import Link from 'next/link'
import { getCurrentAdmin, type AdminSession } from '@/lib/admin-auth'
import { AdminNav } from './AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let currentAdmin: AdminSession | null = null
  try {
    currentAdmin = await getCurrentAdmin()
  } catch {
    // cookie หรือ JWT เสีย — ให้หน้าเด็กจัดการ redirect ไป login
  }
  return (
    <div className="min-h-screen bg-stone-100">
      {currentAdmin && (
        <header className="bg-white border-b border-stone-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <Link href="/admin" className="font-display text-xl text-stone-800">
              หลังบ้าน Pattaya Estate Hub
            </Link>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-stone-500" title={currentAdmin.email}>
                เข้าสู่ระบบในฐานะ: <strong className="text-stone-700">{currentAdmin.name || currentAdmin.email}</strong>
                {currentAdmin.role === 'admin' && (
                  <span className="ml-1 text-primary-600 text-xs">(ระบบหลัก)</span>
                )}
              </span>
              <AdminNav currentAdmin={currentAdmin} />
            </div>
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
