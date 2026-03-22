'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { properties as staticProperties } from '@/data/properties'
import { useFavorites } from '@/context/FavoritesContext'
import { useLocale } from '@/context/LocaleContext'
import { FormattedPrice } from '@/components/FormattedPrice'
import type { Property } from '@/types/property'
import { GitCompare, X } from 'lucide-react'

export default function ComparePage() {
  const { locale, t } = useLocale()
  const base = `/${locale}`
  const { compareIds, toggleCompare } = useFavorites()
  const [allProperties, setAllProperties] = useState<Property[]>([])

  useEffect(() => {
    if (compareIds.length === 0) {
      setAllProperties([])
      return
    }
    const q = encodeURIComponent(compareIds.join(','))
    fetch(`/api/properties?ids=${q}&locale=${locale}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((db: Property[]) => {
        const list = Array.isArray(db) ? db : []
        setAllProperties(list.length > 0 ? list : staticProperties.filter((p) => compareIds.includes(p.id)))
      })
      .catch(() => setAllProperties(staticProperties.filter((p) => compareIds.includes(p.id))))
  }, [locale, compareIds])

  const list = allProperties.filter((p) => compareIds.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900 flex items-center gap-2">
        <GitCompare className="w-8 h-8 text-primary-600" />
        {t('nav.compare')}
      </h1>
      <p className="mt-1 text-stone-600">{locale === 'th' ? 'เลือกได้สูงสุด 4 รายการ' : 'Compare up to 4 listings'}</p>
      {list.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-stone-200">
          <GitCompare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">{locale === 'th' ? 'ยังไม่มีรายการที่เลือกเปรียบเทียบ' : 'No listings to compare'}</p>
          <Link href={`${base}/listings`} className="inline-block mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
            {t('nav.search')}
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px] bg-white rounded-xl border border-stone-200 overflow-hidden">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left p-4 font-semibold text-stone-700 w-32">{locale === 'th' ? 'รายการ' : 'Listing'}</th>
                {list.map((p) => (
                  <th key={p.id} className="text-left p-4 font-semibold text-stone-700 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`${base}/listings/${p.id}`} className="line-clamp-2 hover:text-primary-600">
                        {p.title}
                      </Link>
                      <button type="button" onClick={() => toggleCompare(p.id)} className="p-1 rounded hover:bg-stone-200" aria-label="Remove">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">{t('listing.sale')}/{t('listing.rent')}</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{t(`listing.${p.listingType}`)}</td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">{t('listing.sqm')}</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{p.area}</td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">{t('listing.bed')}</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{p.bedrooms ?? '-'}</td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">{locale === 'th' ? 'ราคา' : 'Price'}</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-primary-600">
                    <FormattedPrice amountThb={p.price} priceLabel={p.priceLabel ?? undefined} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
