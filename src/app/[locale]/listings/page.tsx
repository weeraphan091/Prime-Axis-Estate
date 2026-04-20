import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ListingsResults } from '@/components/ListingsResults'
import { getPublishedPropertiesForPublicList, type PropertyListFilters } from '@/lib/property-db'
import { properties as staticProperties } from '@/data/properties'
import { getT } from '@/messages'
import { isValidLocale, type Locale } from '@/config/i18n'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/seo'
import { SITE_NAME } from '@/config/site'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function parseListingFilters(sp: Record<string, string | string[] | undefined>): PropertyListFilters {
  const g = (k: string) => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }
  const type = g('type')
  const property = g('property')
  const location = g('location')
  const minP = g('minPrice')
  const maxP = g('maxPrice')
  const minPrice = minP != null && minP !== '' ? Number(minP) : null
  const maxPrice = maxP != null && maxP !== '' ? Number(maxP) : null
  return {
    listingType: type === 'sale' || type === 'rent' ? type : null,
    propertyType:
      property === 'condo' ||
      property === 'house' ||
      property === 'villa' ||
      property === 'apartment' ||
      property === 'land' ||
      property === 'commercial'
        ? property
        : null,
    location: location?.trim() || null,
    minPrice: minPrice != null && Number.isFinite(minPrice) ? minPrice : null,
    maxPrice: maxPrice != null && Number.isFinite(maxPrice) ? maxPrice : null,
  }
}

const titles: Record<string, string> = {
  th: 'ค้นหาทรัพย์ คอนโด บ้าน วิลล่า ที่ดินพัทยา',
  en: 'Find Property — Condos, Houses, Villas, Land in Pattaya',
  zh: '搜索房产 — 芭堤雅公寓·别墅·土地',
  ru: 'Поиск недвижимости — Кондо, дома, виллы в Паттайе',
}
const descs: Record<string, string> = {
  th: 'ค้นหาคอนโด บ้าน วิลล่า ที่ดิน อพาร์ตเมนต์ในพัทยา เลือกขาย-เช่า ทำเล ราคา ได้เลย',
  en: 'Search condos, houses, villas, land in Pattaya. Filter by type, price, area.',
  zh: '搜索芭堤雅公寓、别墅、土地。按类型、价格、区域筛选。',
  ru: 'Поиск кондо, домов, вилл, участков в Паттайе. Фильтр по типу, цене, району.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/listings'),
  }
}

export default async function ListingsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) redirect('/th')
  const t = getT(locale as Locale)
  const sp = await searchParams
  const filters = parseListingFilters(sp)
  const dbList = await getPublishedPropertiesForPublicList(filters, locale as Locale, {})
  const serverProperties = dbList.length > 0 ? dbList : staticProperties

  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'
  const listLabel = locale === 'th' ? 'ค้นหาทรัพย์' : locale === 'en' ? 'Listings' : locale === 'zh' ? '房源列表' : 'Объекты'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs locale={locale} items={[{ label: homeLabel, href: `/${locale}` }, { label: listLabel }]} />
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-900">{t('search.title')}</h1>
        <p className="mt-1 text-stone-600">
          {t('search.subtitle')}
        </p>
      </div>
      <div className="mb-8">
        <Suspense fallback={<div className="h-20 rounded-xl bg-stone-100 animate-pulse" />}>
          <SearchBar locale={locale} />
        </Suspense>
      </div>
      <Suspense fallback={<div className="text-stone-500">{t('common.loading')}</div>}>
        <ListingsResults serverProperties={serverProperties} locale={locale} />
      </Suspense>
    </div>
  )
}
