'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-stone-200 p-8">
        <h1 className="font-display text-2xl text-stone-900 text-center">หลังบ้าน</h1>
        <p className="text-center text-stone-500 text-sm mt-1">PRIME AXIS ESTATE</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">รหัสผ่านแอดมิน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'กำลังเข้า...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="mt-6 text-center text-stone-400 text-xs">
          รหัสเริ่มต้น: ดูใน .env ตั้งค่า ADMIN_PASSWORD (ถ้าไม่มีใช้ admin123)
        </p>
        <Link href="/" className="block mt-4 text-center text-stone-500 hover:underline text-sm">
          ← กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
