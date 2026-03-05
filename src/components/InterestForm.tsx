'use client'

import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { useContact } from '@/context/ContactContext'
import { useLocale } from '@/context/LocaleContext'
import type { Property } from '@/types/property'

type Props = {
  property: Property
  onClose: () => void
}

export function InterestForm({ property, onClose }: Props) {
  const { getLineUrl, getWhatsAppUrl, getTelegramUrl, contact } = useContact()
  const { t } = useLocale()
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

  /** ข้อความที่ลูกค้าคัดลอกส่งเอง (กรณี Bot ไม่ไป) — ห้ามใส่ข้อมูลเจ้าของทรัพย์เด็ดขาด ให้มีแค่ข้อมูลลูกค้า + ชื่อรายการเท่านั้น */
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
    alert(t('interestForm.copyDone'))
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
    alert(t('interestForm.copyDoneTelegram'))
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
              ? t('interestForm.successTelegram')
              : sentVia === 'line'
                ? t('interestForm.successLine')
                : t('interestForm.successDefault')}
          </h3>
          <p className="mt-2 text-stone-600 text-sm">
            {t('interestForm.successMessage')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
          >
            {t('interestForm.close')}
          </button>
        </div>
      </div>
    )
  }

  if (sent === 'chat') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <h3 className="font-display text-xl text-stone-900 text-center">{t('interestForm.fallbackTitle')}</h3>
          <p className="mt-2 text-stone-600 text-sm text-center">
            {t('interestForm.fallbackMessage')}
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={openTelegramWithMessage}
              className="w-full py-3 px-4 bg-[#0088cc] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('interestForm.copyAndTelegram')}
            </button>
            <button
              type="button"
              onClick={openLineWithMessage}
              className="w-full py-3 px-4 bg-[#06C755] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('interestForm.copyAndLine')}
            </button>
            <button
              type="button"
              onClick={openWhatsAppWithMessage}
              className="w-full py-3 px-4 bg-[#25D366] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('interestForm.openWhatsApp')}
            </button>
          </div>
          <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-stone-500 text-sm hover:text-stone-700">
            {t('interestForm.cancel')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="font-display text-xl text-stone-900">{t('interestForm.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label={t('interestForm.closeAria')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-stone-600">
            {t('interestForm.intro')}
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.nameLabel')}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t('interestForm.namePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.phoneLabel')}</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t('interestForm.phonePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.emailLabel')}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t('interestForm.emailPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.interestTypeLabel')}</label>
            <select
              value={form.interestType}
              onChange={(e) => update('interestType', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="view">{t('interestForm.optionView')}</option>
              <option value="inquiry">{t('interestForm.optionInquiry')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.contactWhenLabel')}</label>
            <input
              type="text"
              value={form.contactWhen}
              onChange={(e) => update('contactWhen', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t('interestForm.contactWhenPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.viewWhenLabel')}</label>
            <input
              type="text"
              value={form.viewWhen}
              onChange={(e) => update('viewWhen', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t('interestForm.viewWhenPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('interestForm.messageLabel')}</label>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder={t('interestForm.messagePlaceholder')}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? t('interestForm.sending') : t('interestForm.submit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
            >
              {t('interestForm.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
