import { redirect } from 'next/navigation'
import { canManageAdminUsers } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { AdminUsersClient } from './AdminUsersClient'

function formatDate(s: string) {
  try {
    const d = new Date(s)
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}

export default async function AdminUsersPage() {
  if (!(await canManageAdminUsers())) redirect('/admin')

  let list: { id: string; email: string; name: string; role: string; isActive: boolean; createdAt: string }[] = []
  try {
    const rows = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    })
    list = rows
  } catch {
    // DB error
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900">บัญชีผู้ใช้หลังบ้าน</h1>
      <p className="text-sm text-stone-500 mt-1 mb-6">
        สร้างบัญชีให้พนักงานเข้าใช้งานหลังบ้านได้ — เลือกสิทธิ์ ระบบหลัก (admin) หรือ พนักงาน (staff)
      </p>

      <AdminUsersClient />

      <div className="mt-8 bg-white rounded-xl border border-stone-200 overflow-hidden">
        <h2 className="px-4 py-3 bg-stone-50 border-b border-stone-200 font-semibold text-stone-800">
          รายการบัญชีทั้งหมด
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="px-4 py-3 font-semibold text-stone-700">ชื่อ</th>
                <th className="px-4 py-3 font-semibold text-stone-700">อีเมล</th>
                <th className="px-4 py-3 font-semibold text-stone-700">สิทธิ์</th>
                <th className="px-4 py-3 font-semibold text-stone-700">สถานะ</th>
                <th className="px-4 py-3 font-semibold text-stone-700">สร้างเมื่อ</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                  <td className="px-4 py-3 text-stone-900">{u.name}</td>
                  <td className="px-4 py-3 text-stone-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.role === 'admin'
                          ? 'px-2 py-0.5 rounded bg-primary-100 text-primary-800 text-xs font-medium'
                          : 'px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs'
                      }
                    >
                      {u.role === 'admin' ? 'ระบบหลัก' : 'พนักงาน'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{u.isActive ? 'ใช้งาน' : 'ปิดใช้'}</td>
                  <td className="px-4 py-3 text-stone-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-stone-500">ยังไม่มีบัญชีผู้ใช้หลังบ้าน</div>
        )}
      </div>
    </div>
  )
}
