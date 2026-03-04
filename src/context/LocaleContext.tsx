'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Locale } from '@/config/i18n'
import { getT } from '@/messages'
import { convertFromThb, formatCurrency, currencyByLocale } from '@/config/currencies'

type LocaleContextType = {
  locale: Locale
  t: (key: string) => string
  /** แสดงราคา: ฿ XXX (≈ $YYY ตาม locale) */
  formatPrice: (amountThb: number, priceLabel?: string) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const value = useMemo(() => {
    const t = getT(locale)
    const formatPrice = (amountThb: number, priceLabel?: string) => {
      const thbFormatted = new Intl.NumberFormat('th-TH').format(amountThb) + ' ฿'
      const { code } = currencyByLocale[locale]
      if (code === 'THB') return priceLabel ? `${thbFormatted} ${priceLabel}` : thbFormatted
      const converted = convertFromThb(amountThb, code)
      const otherFormatted = formatCurrency(converted, locale)
      const approx = t('currency.approx')
      return `${thbFormatted} (${approx} ${otherFormatted})${priceLabel ? ` ${priceLabel}` : ''}`
    }
    return { locale, t, formatPrice }
  }, [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useLocaleOptional() {
  return useContext(LocaleContext)
}
