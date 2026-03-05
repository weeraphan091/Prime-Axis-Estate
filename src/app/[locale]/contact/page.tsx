'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { AgentContact } from '@/components/AgentContact'
import { useLocale } from '@/context/LocaleContext'

export default function ContactPage() {
  const { t } = useLocale()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl text-stone-900">{t('contactPage.title')}</h1>
      <p className="mt-2 text-stone-600">{t('contactPage.subtitle')}</p>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="font-semibold text-stone-900 mb-4">{t('contactPage.agentChannels')}</h3>
          <AgentContact variant="inline" />
        </div>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          {sent ? (
            <p className="text-stone-600 text-center py-8">{t('contactPage.thankYou')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('contactPage.nameLabel')}</label>
                <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('contactPage.emailLabel')}</label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('contactPage.phoneLabel')}</label>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('contactPage.messageLabel')}</label>
                <textarea required rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">
                <Send className="w-4 h-4" />
                {t('contactPage.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
