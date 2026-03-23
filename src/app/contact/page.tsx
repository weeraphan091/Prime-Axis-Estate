'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { AgentContact } from '@/components/AgentContact'
import { LocaleProvider } from '@/context/LocaleContext'
import { defaultLocale } from '@/config/i18n'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch { /* still show thank-you */ }
    setLoading(false)
    setSent(true)
  }

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <LocaleProvider locale={defaultLocale}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl text-stone-900">ติดต่อเรา</h1>
        <p className="mt-2 text-stone-600">
          สนใจรายการไหน ต้องการฝากขาย/ฝากเช่า หรือมีคำถาม ติดต่อเราได้เลย
        </p>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-stone-900 mb-4">ช่องทางติดต่อเรา (นายหน้า)</h3>
            <AgentContact variant="inline" />
          </div>
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
            {sent ? (
              <p className="text-stone-600 text-center py-8">ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็ว</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">ชื่อ *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">เบอร์โทร</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">ข้อความ *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </LocaleProvider>
  )
}
