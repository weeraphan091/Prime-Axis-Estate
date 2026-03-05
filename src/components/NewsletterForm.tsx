'use client'

import { useState } from 'react'
import { useLocale } from '@/context/LocaleContext'

const labels = {
  th: { title: 'รับข่าวสารรายการ คอนโด และบ้าน ราคาโดนใจ', placeholder: 'อีเมล', subscribe: 'สมัคร', thanks: 'ขอบคุณที่สมัครรับข่าวสาร' },
  en: { title: 'Get updates on condos & houses at great prices', placeholder: 'Email', subscribe: 'Subscribe', thanks: 'Thank you for subscribing' },
  zh: { title: '订阅优质公寓和别墅最新资讯', placeholder: '邮箱', subscribe: '订阅', thanks: '感谢订阅' },
  ru: { title: 'Получайте лучшие предложения по недвижимости', placeholder: 'Email', subscribe: 'Подписка', thanks: 'Спасибо за подписку' },
} as const

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { locale } = useLocale()
  const l = labels[locale as keyof typeof labels] || labels.th

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
    } catch { /* still show thanks */ }
    setSent(true)
  }

  return (
    <div>
      <h3 className="font-semibold text-white mb-2">{l.title}</h3>
      {sent ? (
        <p className="text-sm text-primary-300">{l.thanks}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={l.placeholder}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-stone-800 border border-stone-600 text-white placeholder-stone-500 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500"
          >
            {l.subscribe}
          </button>
        </form>
      )}
    </div>
  )
}
