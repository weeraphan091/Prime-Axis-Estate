'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AdminSession } from '@/lib/admin-auth'

type Props = { currentAdmin: AdminSession }

export function AdminNav({ currentAdmin }: Props) {
  const router = useRouter()
  const isAdmin = currentAdmin.role === 'admin'

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4 text-sm flex-wrap">
      <Link href="/admin" className="text-stone-600 hover:text-primary-600">
        แดชบอร์ด
      </Link>
      <Link href="/admin/listings" className="text-stone-600 hover:text-primary-600">
        จัดการรายการ
      </Link>
      <Link href="/admin/listings/new" className="text-primary-600 font-medium">
        + ลงลิสใหม่
      </Link>
      <Link href="/admin/import" className="text-blue-600 hover:text-blue-700 font-medium">
        นำเข้า FB
      </Link>
      <Link href="/admin/leads" className="text-stone-600 hover:text-primary-600">
        ลีด
      </Link>
      <Link href="/admin/agents" className="text-stone-600 hover:text-primary-600">
        พนักงานขาย
      </Link>
      <Link href="/admin/members" className="text-stone-600 hover:text-primary-600">
        สมาชิก
      </Link>
      <Link href="/admin/blog" className="text-stone-600 hover:text-primary-600">
        บล็อก
      </Link>
      {isAdmin && (
        <Link href="/admin/settings" className="text-stone-600 hover:text-primary-600">
          ข้อมูลติดต่อ
        </Link>
      )}
      {isAdmin && (
        <Link href="/admin/users" className="text-stone-600 hover:text-primary-600">
          บัญชีผู้ใช้
        </Link>
      )}
      <Link href="/" target="_blank" className="text-stone-500 hover:text-stone-700">
        ดูเว็บหลัก
      </Link>
      <button type="button" onClick={handleLogout} className="text-red-600 hover:underline">
        ออกจากระบบ
      </button>
    </div>
  )
}
