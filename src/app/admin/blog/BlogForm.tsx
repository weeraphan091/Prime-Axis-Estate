'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { BlogPost } from '@prisma/client'

type Props = { initial?: BlogPost | null }

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function BlogForm({ initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    contentLanguage: 'th' as 'th' | 'en' | 'zh' | 'ru',
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    titleEn: initial?.titleEn ?? '',
    titleZh: initial?.titleZh ?? '',
    titleRu: initial?.titleRu ?? '',
    excerpt: initial?.excerpt ?? '',
    excerptEn: initial?.excerptEn ?? '',
    excerptZh: initial?.excerptZh ?? '',
    excerptRu: initial?.excerptRu ?? '',
    content: initial?.content ?? '',
    contentEn: initial?.contentEn ?? '',
    contentZh: initial?.contentZh ?? '',
    contentRu: initial?.contentRu ?? '',
    coverImage: initial?.coverImage ?? '',
    category: initial?.category ?? 'tips',
    tags: initial?.tags ?? '[]',
    status: initial?.status ?? 'published',
  })

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleTitleChange = (value: string) => {
    update('title', value)
    if (!initial) {
      update('slug', slugify(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = initial ? `/api/blog/${initial.id}` : '/api/blog'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm'
  const labelCls = 'block text-sm font-medium text-stone-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">ข้อมูลบทความ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className={`${inputCls} font-mono`} required placeholder="buying-condo-pattaya-guide" />
          </div>
          <div>
            <label className={labelCls}>หมวดหมู่</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputCls}>
              <option value="guide">คู่มือ (Guide)</option>
              <option value="market">ตลาด (Market)</option>
              <option value="legal">กฎหมาย (Legal)</option>
              <option value="tips">เคล็ดลับ (Tips)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>ภาษาที่เขียนหลัก</label>
            <select value={form.contentLanguage} onChange={(e) => update('contentLanguage', e.target.value)} className={inputCls}>
              <option value="th">ไทย</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          💡 ภาษาอื่นที่ไม่ได้กรอกจะถูกแปลอัตโนมัติ — ชื่อสถานที่ (พัทยา, จอมเทียน ฯลฯ) จะถูกทับศัพท์ถูกต้อง ไม่แปลมั่ว
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>รูปปก (URL)</label>
            <input value={form.coverImage} onChange={(e) => update('coverImage', e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>สถานะ</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputCls}>
              <option value="published">เผยแพร่</option>
              <option value="draft">แบบร่าง</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className={inputCls} placeholder='["pattaya","condo"]' />
        </div>
      </div>

      {(['th', 'en', 'zh', 'ru'] as const).map((lang) => {
        const suffix = lang === 'th' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1)
        const titleKey = lang === 'th' ? 'title' : `title${suffix}`
        const excerptKey = lang === 'th' ? 'excerpt' : `excerpt${suffix}`
        const contentKey = lang === 'th' ? 'content' : `content${suffix}`
        const langLabels: Record<string, string> = { th: 'ไทย (หลัก)', en: 'English', zh: '中文', ru: 'Русский' }
        const required = lang === 'th'
        return (
          <div key={lang} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">{langLabels[lang]}</h2>
            <div>
              <label className={labelCls}>หัวข้อ {required && '*'}</label>
              <input
                value={(form as Record<string, string>)[titleKey] ?? ''}
                onChange={(e) => lang === 'th' ? handleTitleChange(e.target.value) : update(titleKey, e.target.value)}
                className={inputCls}
                required={required}
              />
            </div>
            <div>
              <label className={labelCls}>เกริ่น (excerpt)</label>
              <textarea
                value={(form as Record<string, string>)[excerptKey] ?? ''}
                onChange={(e) => update(excerptKey, e.target.value)}
                className={inputCls}
                rows={2}
              />
            </div>
            <div>
              <label className={labelCls}>เนื้อหา {required && '*'}</label>
              <textarea
                value={(form as Record<string, string>)[contentKey] ?? ''}
                onChange={(e) => update(contentKey, e.target.value)}
                className={inputCls}
                rows={10}
                required={required}
              />
            </div>
          </div>
        )
      })}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'กำลังบันทึก...' : initial ? 'บันทึกการแก้ไข' : 'เผยแพร่บทความ'}
        </button>
        <Link href="/admin/blog" className="px-6 py-2.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
