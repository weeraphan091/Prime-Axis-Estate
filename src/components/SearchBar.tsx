'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Home, ChevronDown } from 'lucide-react'
import { propertyTypeLabels } from '@/data/properties'
import { pattayaZones, priceRangesSale, priceRangesRent } from '@/config/zones'
import type { ListingType, PropertyType } from '@/types/property'
import { useLocaleOptional } from '@/context/LocaleContext'

function getListingOptions(t: (k: string) => string): { value: ListingType; label: string }[] {
  return [
    { value: 'sale', label: t('listing.sale') },
    { value: 'rent', label: t('listing.rent') },
  ]
}

export function SearchBar({ compact = false, locale: localeProp }: { compact?: boolean; locale?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const localeContext = useLocaleOptional()
  const locale = localeProp ?? localeContext?.locale ?? 'th'
  const t = localeContext?.t ?? ((k: string) => k)
  const listingOptions = getListingOptions(t)
  const propertyTypes = [
    { value: 'condo' as PropertyType, label: t('listing.condo') },
    { value: 'house' as PropertyType, label: t('listing.house') },
    { value: 'villa' as PropertyType, label: t('listing.villa') },
    { value: 'apartment' as PropertyType, label: t('listing.apartment') },
    { value: 'land' as PropertyType, label: t('listing.land') },
    { value: 'commercial' as PropertyType, label: t('listing.commercial') },
  ]
  const [listingType, setListingType] = useState<ListingType>(
    (searchParams.get('type') as ListingType) || 'sale'
  )
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(
    (searchParams.get('property') as PropertyType) || ''
  )
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (listingType) params.set('type', listingType)
    if (propertyType) params.set('property', propertyType)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    const prefix = locale ? `/${locale}` : ''
    router.push(`${prefix}/listings?${params.toString()}`)
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-stone-200"
      >
        <div className="flex rounded-lg border border-stone-300 overflow-hidden">
          {listingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setListingType(opt.value)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                listingType === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-stone-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">{locale === 'th' ? 'ทุกโซน' : locale === 'en' ? 'All areas' : locale === 'zh' ? '全部区域' : 'Все районы'}</option>
              {pattayaZones.map((z) => (
                <option key={z.id} value={z.slug}>
                  {z.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
        >
          <Search className="w-4 h-4" />
          {t('search.search')}
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4"
    >
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('search.type')}</label>
          <div className="flex rounded-lg border border-stone-300 overflow-hidden">
            {listingOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setListingType(opt.value)}
                className={`px-4 py-2.5 text-sm font-medium transition ${
                  listingType === opt.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('search.propertyType')}</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
              className="w-full pl-10 pr-8 py-2.5 border border-stone-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">{locale === 'th' ? 'ทั้งหมด' : locale === 'en' ? 'All' : locale === 'zh' ? '全部' : 'Все'}</option>
              {propertyTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('search.location')}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-stone-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">{locale === 'th' ? 'ทุกโซน' : locale === 'en' ? 'All areas' : locale === 'zh' ? '全部区域' : 'Все районы'}</option>
              {pattayaZones.map((z) => (
                <option key={z.id} value={z.slug}>
                  {z.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{locale === 'th' ? 'ช่วงราคา' : locale === 'en' ? 'Price range' : locale === 'zh' ? '价格范围' : 'Цена'}</label>
          <select
            value={minPrice && maxPrice ? `${minPrice}-${maxPrice}` : ''}
            onChange={(e) => {
              const v = e.target.value
              if (!v) {
                setMinPrice('')
                setMaxPrice('')
                return
              }
              const [min, max] = v.split('-').map(Number)
              setMinPrice(String(min))
              setMaxPrice(String(max))
            }}
            className="w-48 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">{locale === 'th' ? 'ไม่ระบุ' : locale === 'en' ? 'Any' : locale === 'zh' ? '不限' : 'Любая'}</option>
            {(listingType === 'rent' ? priceRangesRent : priceRangesSale).map((r) => (
              <option key={r.label} value={`${r.min}-${r.max}`}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block text-stone-400 text-sm">หรือ</div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('search.minPrice')}</label>
          <input
            type="number"
            placeholder="กำหนดเอง"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-32 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('search.maxPrice')}</label>
          <input
            type="number"
            placeholder="กำหนดเอง"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-32 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition ml-auto"
        >
          <Search className="w-4 h-4" />
          {t('search.search')}
        </button>
      </div>
    </form>
  )
}
