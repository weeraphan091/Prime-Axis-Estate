/** ภาษาที่รองรับ */
export const locales = ['th', 'en', 'zh', 'ru'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'th'

export const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ru: 'Русский',
}

export const localeHreflang: Record<Locale, string> = {
  th: 'th',
  en: 'en',
  zh: 'zh-Hans',
  ru: 'ru',
}

export function isValidLocale(s: string): s is Locale {
  return locales.includes(s as Locale)
}
