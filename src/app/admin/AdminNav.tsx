'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AdminNav() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/admin/listings" className="text-stone-600 hover:text-primary-600">
        จัดการรายการ
      </Link>
      <Link href="/admin/listings/new" className="text-primary-600 font-medium">
        + ลงลิสใหม่
      </Link>
      <Link href="/admin/settings" className="text-stone-600 hover:text-primary-600">
        ข้อมูลติดต่อ
      </Link>
      <Link href="/" target="_blank" className="text-stone-500 hover:text-stone-700">
        ดูเว็บหลัก
      </Link>
      <button type="button" onClick={handleLogout} className="text-red-600 hover:underline">
        ออกจากระบบ
      </button>
    </div>
  )
}
