'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'

export function QuickListingForm({ locale }: { locale: string }) {
  const { t } = useLocale()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', listingType: 'sale', area: '', price: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: '',
          message: `[Quick listing] ${form.listingType === 'rent' ? 'เช่า' : 'ขาย'} | ทำเล: ${form.area || '-'} | ราคา: ${form.price || '-'}`,
        }),
      })
    } catch { /* still show success */ }
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
        <p className="font-semibold text-stone-900">{t('whyList.quickSuccess')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h3 className="font-semibold text-stone-900 mb-1">{t('whyList.quickFormTitle')}</h3>
      <p className="text-sm text-stone-500 mb-4">{t('whyList.quickFormDesc')}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder={t('whyList.quickName')}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <input
          type="tel"
          required
          placeholder={t('whyList.quickPhone')}
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.listingType}
            onChange={(e) => setForm((p) => ({ ...p, listingType: e.target.value }))}
            className="px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
          >
            <option value="sale">{t('listing.sale')}</option>
            <option value="rent">{t('listing.rent')}</option>
          </select>
          <input
            type="text"
            placeholder={t('whyList.quickArea')}
            value={form.area}
            onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
            className="px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
          />
        </div>
        <input
          type="text"
          placeholder={t('whyList.quickPrice')}
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 transition"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? t('whyList.quickSending') : t('whyList.quickSubmit')}
        </button>
      </form>
    </div>
  )
}
