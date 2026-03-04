import type { Locale } from '@/config/i18n'
import type { Messages } from './th'
import { th } from './th'
import { en } from './en'
import { zh } from './zh'
import { ru } from './ru'

const messages: Record<Locale, Messages | Record<string, unknown>> = { th, en, zh, ru }

export function getMessages(locale: Locale): Messages {
  return (messages[locale] ?? th) as Messages
}

/** คืนฟังก์ชัน t('nav.home') => string (รองรับ nested key) */
export function getT(locale: Locale): (key: string) => string {
  const m = getMessages(locale)
  return (key: string) => {
    const parts = key.split('.')
    let cur: unknown = m
    for (const p of parts) {
      cur = (cur as Record<string, unknown>)?.[p]
    }
    return typeof cur === 'string' ? cur : key
  }
}

export { th, en, zh, ru }
export type { Messages }
