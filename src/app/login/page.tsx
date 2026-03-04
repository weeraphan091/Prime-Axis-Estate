'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const { refresh } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    login: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.login.trim() || !form.password) {
      setError('กรุณากรอกเบอร์โทรหรืออีเมล และรหัสผ่าน')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.login.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
        return
      }
      await refresh()
      router.push(next)
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด ลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl text-stone-900">เข้าสู่ระบบ</h1>
      <p className="mt-2 text-stone-600 text-sm">
        {next === '/list-your-property'
          ? 'กรุณาเข้าสู่ระบบเพื่อฝากขาย/ฝากเช่าทรัพย์'
          : 'กรอกอีเมลและรหัสผ่าน'}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-xl border border-stone-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
          <input
            type="email"
            required
            placeholder="อีเมล"
            value={form.login}
            onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">รหัสผ่าน *</label>
          <input
            type="password"
            required
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังเข้า...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-500">
        ยังไม่มีบัญชี?{' '}
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'} className="text-primary-600 hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
      <Link href="/" className="block mt-6 text-center text-stone-500 hover:text-stone-700 text-sm">
        ← กลับหน้าแรก
      </Link>
    </div>
  )
}
