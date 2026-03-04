import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

function formatDate(s: string) {
  try {
    const d = new Date(s)
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}

export default async function AdminMembersPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  let users: { id: string; email: string; name: string; phone: string | null; createdAt: string }[] = []
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, phone: true, createdAt: true },
    })
  } catch {
    // DB error
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900">รายการสมาชิก</h1>
      <p className="text-sm text-stone-500 mt-1 mb-6">
        ลูกค้าที่สมัครสมาชิก (ใช้สำหรับฝากขาย/ฝากเช่า)
      </p>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
          ยังไม่มีสมาชิกสมัคร
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="px-4 py-3 font-semibold text-stone-700">ชื่อ</th>
                  <th className="px-4 py-3 font-semibold text-stone-700">อีเมล</th>
                  <th className="px-4 py-3 font-semibold text-stone-700">เบอร์โทร</th>
                  <th className="px-4 py-3 font-semibold text-stone-700">สมัครเมื่อ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                    <td className="px-4 py-3 text-stone-900">{u.name}</td>
                    <td className="px-4 py-3 text-stone-700">{u.email}</td>
                    <td className="px-4 py-3 text-stone-600">{u.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
