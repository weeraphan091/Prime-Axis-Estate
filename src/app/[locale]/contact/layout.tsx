import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale } from '@/config/i18n'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  th: 'ติดต่อเรา — Pattaya Estate Hub',
  en: 'Contact Us — Pattaya Estate Hub',
  zh: '联系我们 — Pattaya Estate Hub',
  ru: 'Контакты — Pattaya Estate Hub',
}
const descs: Record<string, string> = {
  th: 'ติดต่อ Pattaya Estate Hub โทร Line WhatsApp สอบถามทรัพย์ ฝากขาย ฝากเช่าในพัทยา',
  en: 'Contact Pattaya Estate Hub — call, Line, WhatsApp. Inquire about property, list for sale or rent in Pattaya.',
  zh: '联系 Pattaya Estate Hub — 电话、Line、WhatsApp。咨询房产、委托买卖租赁。',
  ru: 'Свяжитесь с Pattaya Estate Hub — звонок, Line, WhatsApp. Запрос о недвижимости, размещение.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/contact'),
  }
}

export default function ContactLayout({ children }: Props) {
  return children
}
