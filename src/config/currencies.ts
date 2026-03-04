/**
 * อัตราแลกเปลี่ยนจาก THB (บาท) ไปสกุลอื่น — ใช้แสดงราคาคู่กับ ฿ ให้ลูกค้าเห็นภาพ
 * อัปเดตได้จาก env หรือ API ภายหลัง
 */
import type { Locale } from './i18n'

export type CurrencyCode = 'THB' | 'USD' | 'CNY' | 'RUB'

export const currencyByLocale: Record<Locale, { code: CurrencyCode; symbol: string; name: string }> = {
  th: { code: 'THB', symbol: '฿', name: 'บาท' },
  en: { code: 'USD', symbol: '$', name: 'US Dollar' },
  zh: { code: 'CNY', symbol: '¥', name: '人民币' },
  ru: { code: 'RUB', symbol: '₽', name: 'Рубль' },
}

/** อัตรา 1 THB = ? หน่วยสกุลปลายทาง (อัปเดตได้จาก env) */
const RATES: Record<CurrencyCode, number> = {
  THB: 1,
  USD: 1 / 36,
  CNY: 1 / 5,
  RUB: 1 / 0.35,
}

function getRate(): Record<CurrencyCode, number> {
  if (typeof process.env.NEXT_PUBLIC_RATE_USD === 'string' && process.env.NEXT_PUBLIC_RATE_USD) {
    const usd = parseFloat(process.env.NEXT_PUBLIC_RATE_USD)
    if (!Number.isNaN(usd)) RATES.USD = 1 / usd
  }
  if (typeof process.env.NEXT_PUBLIC_RATE_CNY === 'string' && process.env.NEXT_PUBLIC_RATE_CNY) {
    const cny = parseFloat(process.env.NEXT_PUBLIC_RATE_CNY)
    if (!Number.isNaN(cny)) RATES.CNY = 1 / cny
  }
  if (typeof process.env.NEXT_PUBLIC_RATE_RUB === 'string' && process.env.NEXT_PUBLIC_RATE_RUB) {
    const rub = parseFloat(process.env.NEXT_PUBLIC_RATE_RUB)
    if (!Number.isNaN(rub)) RATES.RUB = 1 / rub
  }
  return RATES
}

/** แปลงจำนวนเงินจากบาท เป็นสกุลปลายทาง */
export function convertFromThb(amountThb: number, toCode: CurrencyCode): number {
  const rates = getRate()
  return amountThb * (rates[toCode] ?? 1)
}

/** จัดรูปแบบตัวเลขตาม locale */
export function formatCurrency(amount: number, locale: Locale, options?: { compact?: boolean }): string {
  const { code, symbol } = currencyByLocale[locale]
  if (code === 'THB') {
    return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(amount) + ' ฿'
  }
  const localeFor = locale === 'zh' ? 'zh-CN' : locale === 'ru' ? 'ru-RU' : 'en-US'
  const formatted = new Intl.NumberFormat(localeFor, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted
}
