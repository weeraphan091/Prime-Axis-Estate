'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { isValidLocale } from '@/config/i18n'

const localeToLang: Record<string, string> = {
  th: 'th',
  en: 'en',
  zh: 'zh-Hans',
  ru: 'ru',
}

/**
 * อัปเดต <html lang> จาก segment แรกของ path (เช่น /en/...) โดยไม่ใช้ cookies() ใน RootLayout
 */
export function HtmlLangSync() {
  const pathname = usePathname()

  useEffect(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    const lang = seg && isValidLocale(seg) ? (localeToLang[seg] ?? 'th') : 'th'
    document.documentElement.lang = lang
  }, [pathname])

  return null
}
