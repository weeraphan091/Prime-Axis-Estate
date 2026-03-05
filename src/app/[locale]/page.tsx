import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { PropertyCard } from '@/components/PropertyCard'
import { properties as staticProperties } from '@/data/properties'
import { pattayaZones, getZoneLabel } from '@/config/zones'
import { LatestListings } from '@/components/LatestListings'
import { getPropertiesFromDb } from '@/lib/property-db'
import { getT } from '@/messages'
import { isValidLocale, type Locale } from '@/config/i18n'
import { redirect } from 'next/navigation'
import { FilePlus, Shield, Home, Zap, MapPin, Users } from 'lucide-react'
import { buildAlternates } from '@/lib/seo'
import { SITE_NAME } from '@/config/site'
import { StatsBar } from '@/components/StatsBar'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

const pageTitles: Record<string, string> = {
  th: `${SITE_NAME} | นายหน้าอสังหา พัทยา ขาย-เช่า คอนโด บ้าน วิลล่า ที่ดิน`,
  en: `${SITE_NAME} | Pattaya Real Estate Agent — Buy, Rent, List Property`,
  zh: `${SITE_NAME} | 芭堤雅房产中介 — 公寓·别墅·土地 买卖·租赁`,
  ru: `${SITE_NAME} | Недвижимость Паттайи — Покупка, аренда, размещение`,
}
const pageDescs: Record<string, string> = {
  th: 'ค้นหาคอนโด บ้าน วิลล่า ที่ดิน อพาร์ตเมนต์ในพัทยา ขาย-เช่า ฝากขายฝากเช่ากับเรา Pattaya Estate Hub',
  en: 'Find condos, houses, villas, land in Pattaya. Buy, rent, or list your property with Pattaya Estate Hub.',
  zh: '在芭堤雅搜索公寓、别墅、土地、公寓。买卖、租赁或委托挂牌 Pattaya Estate Hub。',
  ru: 'Ищите кондо, дома, виллы, землю в Паттайе. Покупка, аренда или размещение с Pattaya Estate Hub.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: pageTitles[locale] ?? pageTitles.th,
    description: pageDescs[locale] ?? pageDescs.th,
    alternates: buildAlternates(locale),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) redirect('/th')
  const t = getT(locale as Locale)
  const dbList = await getPropertiesFromDb(true, locale as Locale)
  const serverList = dbList.length > 0 ? dbList : staticProperties
  const featured = serverList.filter((p) => p.isFeatured).slice(0, 6)
  const base = `/${locale}`

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
              Pattaya Estate Hub
              <br />
              <span className="text-primary-200">{t('home.heroTitle')}</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-xl">
              {t('home.heroDesc')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${base}/list-your-property`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition shadow-lg"
              >
                <FilePlus className="w-5 h-5" />
                {t('home.listProperty')}
              </Link>
              <Link
                href={`${base}/listings`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500/80 text-white rounded-xl font-semibold hover:bg-primary-500 transition border border-primary-400"
              >
                {t('home.viewAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Suspense fallback={<div className="h-14 rounded-xl bg-stone-100 animate-pulse" />}>
          <SearchBar compact locale={locale} />
        </Suspense>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <StatsBar locale={locale} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-xl lg:text-2xl text-stone-900 mb-4">{t('home.popularZones')}</h2>
        <div className="flex flex-wrap gap-2">
          {pattayaZones.map((z) => (
            <Link
              key={z.id}
              href={`${base}/listings?location=${encodeURIComponent(z.slug)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition"
            >
              <MapPin className="w-4 h-4 text-stone-400" />
              {getZoneLabel(z, locale)}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FilePlus, titleKey: 'home.listTitle', textKey: 'home.listText' },
            { icon: Shield, titleKey: 'home.contactTitle', textKey: 'home.contactText' },
            { icon: Home, titleKey: 'home.searchTitle', textKey: 'home.searchText' },
            { icon: Zap, titleKey: 'home.viewSite', textKey: 'home.contactText' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition"
            >
              <item.icon className="w-10 h-10 text-primary-600 mb-3" />
              <h3 className="font-semibold text-stone-900">{t(item.titleKey)}</h3>
              <p className="mt-1 text-sm text-stone-600">{t(item.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-50 border-t border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl lg:text-3xl text-stone-900">
              {locale === 'th' ? 'รายการแนะนำ' : locale === 'en' ? 'Featured listings' : locale === 'zh' ? '推荐房源' : 'Рекомендуемые'}
            </h2>
            <Link
              href={`${base}/listings`}
              className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
            >
              {t('home.viewAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl lg:text-3xl text-stone-900">
            {locale === 'th' ? 'ประกาศล่าสุด' : locale === 'en' ? 'Latest listings' : locale === 'zh' ? '最新房源' : 'Новые объявления'}
          </h2>
          <Link
            href={`${base}/listings`}
            className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
          >
            {t('home.viewAll')} →
          </Link>
        </div>
        <LatestListings serverList={serverList} locale={locale} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="font-display text-2xl lg:text-3xl">
            {locale === 'th' ? 'มีทรัพย์อยู่ที่พัทยา? ฝากขาย-ฝากเช่ากับเรา' : locale === 'en' ? 'Got a property in Pattaya? List with us' : locale === 'zh' ? '在芭堤雅有房产？交给我们挂牌' : 'Есть недвижимость в Паттайе? Разместите у нас'}
          </h2>
          <p className="mt-3 text-primary-100 max-w-xl mx-auto">
            {locale === 'th' ? 'ส่งข้อมูลและรูปมาได้เลย หรือแชทผ่าน LINE สะดวกกว่า' : locale === 'en' ? 'Submit details online or chat with us on LINE — whichever is easier.' : locale === 'zh' ? '在线提交或通过LINE聊天——怎么方便怎么来。' : 'Отправьте данные онлайн или напишите нам в LINE.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`${base}/list-your-property`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition shadow-lg"
            >
              <FilePlus className="w-5 h-5" />
              {t('home.listProperty')}
            </Link>
            <a
              href="https://line.me/ti/p/@187umoiw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#06C755] text-white rounded-xl font-semibold hover:bg-[#05b34d] transition shadow-lg"
            >
              {locale === 'th' ? 'แชทผ่าน LINE' : locale === 'en' ? 'Chat on LINE' : locale === 'zh' ? 'LINE聊天' : 'Чат LINE'}
            </a>
          </div>
          <Link
            href={`${base}/why-list-with-us`}
            className="inline-block mt-4 text-primary-200 hover:text-white text-sm font-medium underline underline-offset-2"
          >
            {locale === 'th' ? 'ทำไมต้องฝากกับเรา?' : locale === 'en' ? 'Why list with us?' : locale === 'zh' ? '为什么选择我们？' : 'Почему мы?'}
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6">
          <Users className="w-12 h-12 text-amber-600 shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-stone-900 text-lg">{t('whyList.referralTitle')}</h3>
            <p className="text-sm text-stone-600 mt-1">{t('whyList.referralDesc')}</p>
          </div>
          <Link
            href={`${base}/contact`}
            className="shrink-0 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition"
          >
            {t('whyList.referralCta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
