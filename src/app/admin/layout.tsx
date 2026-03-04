import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { AdminNav } from './AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ok = await hasAdminSession()
  return (
    <div className="min-h-screen bg-stone-100">
      {ok && (
        <header className="bg-white border-b border-stone-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/admin" className="font-display text-xl text-stone-800">
              หลังบ้าน PRIME AXIS ESTATE
            </Link>
            <AdminNav />
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
