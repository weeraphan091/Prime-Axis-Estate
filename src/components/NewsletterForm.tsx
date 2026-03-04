'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <div>
      <h3 className="font-semibold text-white mb-2">รับข่าวสารรายการ คอนโด และบ้าน ราคาโดนใจ</h3>
      {sent ? (
        <p className="text-sm text-primary-300">ขอบคุณที่สมัครรับข่าวสาร</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="อีเมล"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-stone-800 border border-stone-600 text-white placeholder-stone-500 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500"
          >
            สมัคร
          </button>
        </form>
      )}
    </div>
  )
}
