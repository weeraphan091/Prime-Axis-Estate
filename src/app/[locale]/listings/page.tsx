import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ListingsResults } from '@/components/ListingsResults'
import { getPropertiesFromDb } from '@/lib/property-db'
import { properties as staticProperties } from '@/data/properties'
import { getT } from '@/messages'
import { isValidLocale, type Locale } from '@/config/i18n'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {}
}

export default async function ListingsPage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) redirect('/th')
  const t = getT(locale as Locale)
  const dbList = await getPropertiesFromDb(true, locale as Locale)
  const serverProperties = dbList.length > 0 ? dbList : staticProperties

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
