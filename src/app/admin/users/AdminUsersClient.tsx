'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminUsersClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'admin' | 'staff'>('staff')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() || undefined, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'สร้างบัญชีไม่สำเร็จ')
        return
      }
      setSuccess(`สร้างบัญชี ${data.email} เรียบร้อย`)
      setEmail('')
      setPassword('')
      setName('')
      setRole('staff')
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
      <h2 className="font-semibold text-stone-800 mb-4">สร้างบัญชีพนักงานใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="staff@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">รหัสผ่าน * (อย่างน้อย 6 ตัว)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="ชื่อผู้ใช้"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">สิทธิ์</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="staff">พนักงาน (staff) — จัดการรายการ/ลีด/พนักงานขาย/สมาชิก</option>
            <option value="admin">ระบบหลัก (admin) — สิทธิ์เต็ม รวมถึง ข้อมูลติดต่อ และบัญชีผู้ใช้</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังสร้าง...' : 'สร้างบัญชี'}
        </button>
      </form>
    </div>
  )
}
