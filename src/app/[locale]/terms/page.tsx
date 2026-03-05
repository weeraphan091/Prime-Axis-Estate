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
    th: 'ข้อกำหนดและเงื่อนไข',
    en: 'Terms and Conditions',
    zh: '使用条款',
    ru: 'Условия использования',
  }
  return {
    title: titles[locale] ?? titles.th,
    alternates: buildAlternates(locale, '/terms'),
    robots: { index: false, follow: true },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const t = getT(locale as 'th' | 'en' | 'zh' | 'ru')
  const base = `/${locale}`
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">{t('terms.title')}</h1>
      <p className="mt-2 text-stone-500 text-sm">{t('terms.lastUpdated')}</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>{t('terms.intro')}</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">{t('terms.section1Title')}</h2>
        <p>{t('terms.section1Content')}</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">{t('terms.section2Title')}</h2>
        <p>{t('terms.section2Content')}</p>
      </div>
      <Link href={base} className="inline-block mt-8 text-primary-600 hover:underline">{t('terms.backToHome')}</Link>
    </div>
  )
}
