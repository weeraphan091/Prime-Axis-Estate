'use client'

import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { useContact } from '@/context/ContactContext'
import type { Property } from '@/types/property'

type Props = {
  property: Property
  onClose: () => void
}

export function InterestForm({ property, onClose }: Props) {
  const { getLineUrl, getWhatsAppUrl, getTelegramUrl, contact } = useContact()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<'idle' | 'ok' | 'chat'>('idle')
  const [sentVia, setSentVia] = useState<'telegram' | 'line' | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interestType: 'view' as 'view' | 'inquiry',
    contactWhen: '',
    viewWhen: '',
    message: '',
  })

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const buildMessage = () => {
    const lines = [
      `🏠 สนใจทรัพย์: ${property.title}`,
      `🔗 รายการ: /listings/${property.id}`,
      `---`,
      `ชื่อ: ${form.name}`,
      `โทร: ${form.phone}`,
      `อีเมล: ${form.email}`,
      `สนใจ: ${form.interestType === 'view' ? 'นัดชม' : 'สอบถามเพิ่ม'}`,
      form.contactWhen ? `เวลาสะดวกให้ติดต่อ: ${form.contactWhen}` : '',
      form.viewWhen ? `อยากนัดชมเมื่อ: ${form.viewWhen}` : '',
      form.message ? `หมายเหตุ: ${form.message}` : '',
    ]
    return lines.filter(Boolean).join('\n')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          ...form,
        }),
      })
      const data = await res.json()
      if (res.ok && data.sent === true) {
        setSentVia(data.via === 'telegram' ? 'telegram' : data.via === 'line' ? 'line' : null)
        setSent('ok')
      } else {
        setSent('chat')
      }
    } catch {
      setSent('chat')
    } finally {
      setLoading(false)
    }
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(buildMessage())
    alert('คัดลอกข้อความแล้ว ไปวางใน Line ได้เลย')
  }

  const openLineWithMessage = () => {
    copyMessage()
    window.open(getLineUrl(), '_blank', 'noopener')
  }

  const openWhatsAppWithMessage = () => {
    const text = encodeURIComponent(buildMessage())
    const num = contact.whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener')
  }

  const openTelegramWithMessage = () => {
    navigator.clipboard.writeText(buildMessage())
    alert('คัดลอกข้อความแล้ว เปิด Telegram ไปวางในแชทบอทแล้วกดส่ง')
    window.open(getTelegramUrl(), '_blank', 'noopener')
  }

  if (sent === 'ok') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-display text-xl text-stone-900">
            {sentVia === 'telegram'
              ? 'ส่งเข้า Telegram แล้ว'
              : sentVia === 'line'
                ? 'ส่งเข้า Line แล้ว'
                : 'ส่งข้อมูลแล้ว'}
          </h3>
          <p className="mt-2 text-stone-600 text-sm">
            เราได้รับแจ้งเตือนแล้ว จะติดต่อกลับตามเวลาที่คุณระบุ
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
          >
            ปิด
          </button>
        </div>
      </div>
    )
  }

  if (sent === 'chat') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <h3 className="font-display text-xl text-stone-900 text-center">ส่งผ่าน Line / WhatsApp / Telegram</h3>
          <p className="mt-2 text-stone-600 text-sm text-center">
            กดปุ่มด้านล่างเพื่อเปิดแชท ข้อความจะถูกคัดลอกไว้แล้ว ไปวางแล้วกดส่ง
            <br />
            <span className="text-stone-500 text-xs mt-1 block">
              ถ้าตั้งค่า Telegram ใน .env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) แล้วแต่ยังไม่ส่งอัตโนมัติ → บันทึก .env แล้วรีสตาร์ทเซิร์ฟเวอร์ (Ctrl+C แล้ว npm run dev ใหม่)
            </span>
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={openTelegramWithMessage}
              className="w-full py-3 px-4 bg-[#0088cc] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              คัดลอกข้อความแล้วเปิด Telegram
            </button>
            <button
              type="button"
              onClick={openLineWithMessage}
              className="w-full py-3 px-4 bg-[#06C755] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              คัดลอกข้อความแล้วเปิด Line
            </button>
            <button
              type="button"
              onClick={openWhatsAppWithMessage}
              className="w-full py-3 px-4 bg-[#25D366] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              เปิด WhatsApp ส่งให้เรา
            </button>
          </div>
          <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-stone-500 text-sm hover:text-stone-700">
            ยกเลิก
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="font-display text-xl text-stone-900">สนใจทรัพย์นี้</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-stone-600">
            กรอกรายละเอียดด้านล่าง เราจะติดต่อกลับตามเวลาที่คุณสะดวก
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อ-นามสกุล *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="ชื่อของคุณ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="08x-xxx-xxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">สนใจในเรื่อง *</label>
            <select
              value={form.interestType}
              onChange={(e) => update('interestType', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="view">นัดชมทรัพย์</option>
              <option value="inquiry">สอบถามเพิ่มเติม</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">เวลาที่สะดวกให้ติดต่อ</label>
            <input
              type="text"
              value={form.contactWhen}
              onChange={(e) => update('contactWhen', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="เช่น 9:00-18:00 จันทร์-ศุกร์, หรือช่วงบ่าย"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">อยากนัดชมเมื่อไหร่</label>
            <input
              type="text"
              value={form.viewWhen}
              onChange={(e) => update('viewWhen', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="เช่น พรุ่งนี้ 10:00, เสาร์-อาทิตย์"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">หมายเหตุ</label>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="ข้อความเพิ่มเติม (ถ้ามี)"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
