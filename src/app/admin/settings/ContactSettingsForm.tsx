'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { saveContactSettings } from './actions'

type ContactData = {
  name: string
  phone: string
  email: string
  address: string
  line: string
  whatsapp: string
  wechat: string
  telegram: string
}

type Props = {
  initial: ContactData
  onSave: typeof saveContactSettings
}

export function ContactSettingsForm({ initial, onSave }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initial)

  const update = (key: keyof ContactData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await onSave(form)
      if (result.ok) {
        router.refresh()
        alert('บันทึกแล้ว — ข้อมูลติดต่อจะแสดงใหม่ทุกที่บนเว็บ')
      } else {
        const msg =
          result.error === 'Unauthorized'
            ? 'หมดอายุหรือไม่มีสิทธิ์ — กรุณาเข้าสู่ระบบใหม่'
            : result.error || 'บันทึกไม่สำเร็จ'
        alert(msg)
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">ข้อมูลช่องทางติดต่อ</h2>
        <p className="text-sm text-stone-500">
          ข้อมูลนี้จะแสดงใน Header, Footer, หน้ารายละเอียดทรัพย์ และฟอร์มสนใจทรัพย์
        </p>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อร้าน/ธุรกิจ *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร *</label>
          <input
            type="text"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="038-xxx-xxx หรือ 08x-xxx-xxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">ที่อยู่</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            placeholder="พัทยา ชลบุรี"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Line OA ID (ต้องมี @)</label>
            <input
              type="text"
              value={form.line}
              onChange={(e) => update('line', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              placeholder="@187umoiw"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">WhatsApp (ตัวเลขเท่านั้น)</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              placeholder="66812345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">WeChat ID</label>
            <input
              type="text"
              value={form.wechat}
              onChange={(e) => update('wechat', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Telegram</label>
            <input
              type="text"
              value={form.telegram}
              onChange={(e) => update('telegram', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              placeholder="username ไม่ต้องใส่ @"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลติดต่อ'}
        </button>
        <Link
          href="/admin"
          className="px-6 py-2.5 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50"
        >
          กลับ
        </Link>
      </div>
    </form>
  )
}
