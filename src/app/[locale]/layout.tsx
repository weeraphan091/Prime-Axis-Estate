import { redirect } from 'next/navigation'
import { locales, isValidLocale, defaultLocale } from '@/config/i18n'
import { LocaleProvider } from '@/context/LocaleContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { buildAlternates } from '@/lib/seo'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const titles: Record<string, string> = {
  th: 'นายหน้าอสังหา พัทยา ขาย-เช่า ฝากขายฝากเช่า',
  en: 'Pattaya Real Estate — Buy, Rent, List Property',
  zh: '芭堤雅房产 — 买卖·租赁·挂牌',
  ru: 'Недвижимость Паттайи — Покупка, аренда, размещение',
}
const descriptions: Record<string, string> = {
  th: 'Pattaya Estate Hub ค้นหาคอนโด บ้าน วิลล่า ที่ดินในพัทยา ขาย-เช่า ฝากขายฝากเช่า',
  en: 'Pattaya Estate Hub — Condos, houses, villas, land in Pattaya. Buy, rent, list with us.',
  zh: 'Pattaya Estate Hub — 芭堤雅公寓、别墅、土地。买卖、租赁、委托挂牌。',
  ru: 'Pattaya Estate Hub — Кондо, дома, виллы, участки в Паттайе. Покупка, аренда, размещение.',
}

export { titles as localeTitles, descriptions as localeDescriptions }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descriptions[locale] ?? descriptions.th,
    alternates: buildAlternates(locale),
    openGraph: {
      title: `Pattaya Estate Hub | ${titles[locale] ?? titles.th}`,
      description: descriptions[locale] ?? descriptions.th,
      url: buildAlternates(locale).canonical,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : locale,
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) {
    redirect(`/${defaultLocale}`)
  }
  return (
    <LocaleProvider locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </LocaleProvider>
  )
}
