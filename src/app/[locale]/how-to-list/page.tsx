import type { Metadata } from 'next'
import Link from 'next/link'
import { FilePlus, Phone } from 'lucide-react'
import { getT } from '@/messages'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale } from '@/config/i18n'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  th: 'วิธีฝากขาย-ฝากเช่ากับเรา',
  en: 'How to List Your Property With Us',
  zh: '如何委托挂牌',
  ru: 'Как разместить недвижимость',
}
const descs: Record<string, string> = {
  th: 'ขั้นตอนง่ายๆ ฝากขาย-ฝากเช่าทรัพย์สินในพัทยากับ Pattaya Estate Hub',
  en: 'Simple steps to list your Pattaya property for sale or rent with Pattaya Estate Hub.',
  zh: '简单几步即可在 Pattaya Estate Hub 挂牌出售或出租您的芭堤雅房产。',
  ru: 'Простые шаги для размещения вашей недвижимости в Паттайе на Pattaya Estate Hub.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/how-to-list'),
  }
}

export default async function HowToListPage({ params }: Props) {
  const { locale } = await params
  const t = getT(locale as 'th' | 'en' | 'zh' | 'ru')
  const base = `/${locale}`

  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs locale={locale} items={[{ label: homeLabel, href: base }, { label: t('howToList.title') }]} />
      <h1 className="font-display text-3xl text-stone-900">{t('howToList.title')}</h1>
      <p className="mt-2 text-stone-600">{t('howToList.intro')}</p>
      <div className="mt-8 space-y-6">
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">1</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{t('howToList.step1Title')}</h2>
            <p className="mt-1 text-stone-600 text-sm">{t('howToList.step1Desc')}</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">2</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{t('howToList.step2Title')}</h2>
            <p className="mt-1 text-stone-600 text-sm">{t('howToList.step2Desc')}</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">3</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{t('howToList.step3Title')}</h2>
            <p className="mt-1 text-stone-600 text-sm">{t('howToList.step3Desc')}</p>
          </div>
        </div>
      </div>
      <Link href={`${base}/list-your-property`} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">
        <FilePlus className="w-5 h-5" />
        {t('nav.listProperty')}
      </Link>
      <p className="mt-4">
        <Link href={`${base}/contact`} className="inline-flex items-center gap-2 text-primary-600 hover:underline">
          <Phone className="w-5 h-5" />
          {t('nav.contact')}
        </Link>
      </p>
    </div>
  )
}
