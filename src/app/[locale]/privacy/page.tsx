import type { Metadata } from 'next'
import Link from 'next/link'
import { getT } from '@/messages'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale } from '@/config/i18n'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const titles: Record<string, string> = {
    th: 'นโยบายความเป็นส่วนตัว',
    en: 'Privacy Policy',
    zh: '隐私政策',
    ru: 'Политика конфиденциальности',
  }
  return {
    title: titles[locale] ?? titles.th,
    alternates: buildAlternates(locale, '/privacy'),
    robots: { index: false, follow: true },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const t = getT(locale as 'th' | 'en' | 'zh' | 'ru')
  const base = `/${locale}`
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">{t('privacy.title')}</h1>
      <p className="mt-2 text-stone-500 text-sm">{t('privacy.lastUpdated')}</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>{t('privacy.intro')}</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">{t('privacy.section1Title')}</h2>
        <p>{t('privacy.section1Content')}</p>
      </div>
      <Link href={base} className="inline-block mt-8 text-primary-600 hover:underline">{t('privacy.backToHome')}</Link>
    </div>
  )
}
