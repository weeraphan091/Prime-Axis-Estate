'use client'

import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { Locale } from '@/config/i18n'
import { getT } from '@/messages'
import { formatCurrency, currencyByLocale } from '@/config/currencies'
type ExchangeRates = { USD: number; CNY: number; RUB: number }

type LocaleContextType = {
  locale: Locale
  t: (key: string) => string
  /** แสดงราคา: ฿ XXX (≈ $YYY ตาม locale) — ใช้อัตราแลกเปลี่ยนรายวัน */
  formatPrice: (amountThb: number, priceLabel?: string) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

const DEFAULT_RATES: ExchangeRates = { USD: 1 / 36, CNY: 1 / 5, RUB: 1 / 0.35 }

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const [rates, setRates] = useState<ExchangeRates | null>(null)

  useEffect(() => {
    fetch('/api/exchange-rates')
      .then((r) => r.ok ? r.json() : null)
      .then((data: { rates?: ExchangeRates } | null) => {
        if (data?.rates) setRates(data.rates)
      })
      .catch(() => {})
  }, [])

  const value = useMemo(() => {
    const t = getT(locale)
    const r = rates ?? DEFAULT_RATES
    const formatPrice = (amountThb: number, priceLabel?: string) => {
      const thbFormatted = new Intl.NumberFormat('th-TH').format(amountThb) + ' ฿'
      const { code } = currencyByLocale[locale]
      if (code === 'THB') return priceLabel ? `${thbFormatted} ${priceLabel}` : thbFormatted
      const rate = r[code as keyof ExchangeRates] ?? 1
      const converted = amountThb * rate
      const otherFormatted = formatCurrency(converted, locale)
      const approx = t('currency.approx')
      return `${thbFormatted} (${approx} ${otherFormatted})${priceLabel ? ` ${priceLabel}` : ''}`
    }
    return { locale, t, formatPrice }
  }, [locale, rates])
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
