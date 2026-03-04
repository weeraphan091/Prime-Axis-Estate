'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/list-your-property'
  const { refresh } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password) {
      alert('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    if (form.password.length < 6) {
      alert('รหัสผ่านอย่างน้อย 6 ตัว')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'สมัครไม่สำเร็จ')
        return
      }
      await refresh()
      setSubmitted(true)
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-xl text-stone-900">สมัครสมาชิกสำเร็จ</h1>
          <p className="mt-2 text-stone-600 text-sm">
            เราได้เข้าสู่ระบบให้คุณแล้ว กดปุ่มด้านล่างไปกรอกข้อมูลฝากขาย/เช่าได้เลย
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={next || '/list-your-property'}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 text-center"
            >
              ไปกรอกข้อมูลฝากขาย/เช่า
            </Link>
            <Link
              href="/"
              className="w-full py-3 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50 text-center"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl text-stone-900">สมัครสมาชิก</h1>
      <p className="mt-2 text-stone-600 text-sm">
        กรอกข้อมูลด้านล่าง เพื่อฝากขาย/ฝากเช่าทรัพย์กับเรา
      </p>
      <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-xl border border-stone-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อ-นามสกุล *</label>
          <input
            type="text"
            required
            placeholder="ชื่อ-นามสกุล"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร *</label>
          <input
            type="tel"
            required
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
          <input
            type="email"
            required
            placeholder="อีเมล"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">รหัสผ่าน * (อย่างน้อย 6 ตัว)</label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-500">
        มีบัญชีอยู่แล้ว?{' '}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="text-primary-600 hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
      <Link href="/" className="block mt-6 text-center text-stone-500 hover:text-stone-700 text-sm">
        ← กลับหน้าแรก
      </Link>
    </div>
  )
}
