'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Agent } from '@prisma/client'

type Props = { initial?: Agent | null }

export function AgentForm({ initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    lineId: initial?.lineId ?? '',
    isActive: initial?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = initial ? `/api/agents/${initial.id}` : '/api/agents'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'บันทึกไม่สำเร็จ')
        return
      }
      router.push('/admin/agents')
      router.refresh()
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อ *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร *</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Line ID</label>
        <input
          type="text"
          value={form.lineId}
          onChange={(e) => setForm((p) => ({ ...p, lineId: e.target.value }))}
          placeholder="@username"
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
          className="rounded border-stone-300"
        />
        <span className="text-sm">ใช้งาน</span>
      </label>
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังบันทึก...' : initial ? 'บันทึกการแก้ไข' : 'เพิ่มพนักงาน'}
        </button>
        <Link
          href="/admin/agents"
          className="px-6 py-2.5 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
