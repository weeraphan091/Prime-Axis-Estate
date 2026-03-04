'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'

export default function RegisterPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'th'
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next') || `/${locale}/list-your-property`
  const next = nextParam.startsWith('/') ? nextParam : `/${locale}/${nextParam}`
  const { refresh } = useAuth()
  const { t } = useLocale()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const base = `/${locale}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password) {
      alert(locale === 'th' ? 'กรุณากรอกข้อมูลให้ครบ' : 'Please fill all fields')
      return
    }
    if (form.password.length < 6) {
      alert(locale === 'th' ? 'รหัสผ่านอย่างน้อย 6 ตัว' : 'Password at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Registration failed')
        return
      }
      await refresh()
      setSubmitted(true)
    } catch {
      alert(locale === 'th' ? 'เกิดข้อผิดพลาด' : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-xl text-stone-900">{locale === 'th' ? 'สมัครสมาชิกสำเร็จ' : 'Signed up'}</h1>
          <p className="mt-2 text-stone-600 text-sm">{locale === 'th' ? 'เราได้เข้าสู่ระบบให้คุณแล้ว' : 'You are logged in.'}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={next || `${base}/list-your-property`} className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 text-center">{t('nav.listProperty')}</Link>
            <Link href={base} className="w-full py-3 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50 text-center">← {t('nav.home')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl text-stone-900">{t('nav.register')}</h1>
      <p className="mt-2 text-stone-600 text-sm">{locale === 'th' ? 'กรอกข้อมูลด้านล่าง เพื่อฝากขาย/ฝากเช่าทรัพย์กับเรา' : 'Fill in your details to list your property.'}</p>
      <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-xl border border-stone-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{locale === 'th' ? 'ชื่อ-นามสกุล' : 'Name'} *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{locale === 'th' ? 'เบอร์โทร' : 'Phone'} *</label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">{locale === 'th' ? 'รหัสผ่าน' : 'Password'} *</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60">{loading ? (locale === 'th' ? 'กำลังสมัคร...' : 'Loading...') : t('nav.register')}</button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-500">
        {locale === 'th' ? 'มีบัญชีแล้ว?' : 'Have an account?'} <Link href={`${base}/login`} className="text-primary-600 hover:underline">{t('nav.login')}</Link>
      </p>
      <Link href={base} className="block mt-6 text-center text-stone-500 hover:text-stone-700 text-sm">← {t('nav.home')}</Link>
    </div>
  )
}
