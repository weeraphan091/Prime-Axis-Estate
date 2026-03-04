'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { locales, localeNames, type Locale } from '@/config/i18n'
import { useState } from 'react'
import { Globe } from 'lucide-react'

function getLocalizedPath(pathname: string, newLocale: Locale): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return `/${newLocale}`
  const first = parts[0]
  if (locales.includes(first as Locale)) {
    parts[0] = newLocale
    return '/' + parts.join('/')
  }
  return `/${newLocale}/${pathname.replace(/^\//, '')}`
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const { locale: currentLocale } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-stone-600 hover:bg-stone-100 text-sm font-medium min-h-[44px] touch-manipulation"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[currentLocale]}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
          <ul
            className="absolute right-0 top-full mt-1 py-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 min-w-[140px]"
            role="menu"
          >
            {locales.map((loc) => (
              <li key={loc} role="none">
                <Link
                  href={getLocalizedPath(pathname, loc)}
                  role="menuitem"
                  className={`block px-4 py-2 text-sm hover:bg-stone-50 ${currentLocale === loc ? 'text-primary-600 font-medium' : 'text-stone-700'}`}
                  onClick={() => setOpen(false)}
                >
                  {localeNames[loc]}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
