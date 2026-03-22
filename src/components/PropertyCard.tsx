'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, BadgeCheck, Heart, GitCompare, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useLocaleOptional } from '@/context/LocaleContext'
import { FormattedPrice } from '@/components/FormattedPrice'
import { shouldUseNextImage } from '@/lib/remote-image'
import type { Property } from '@/types/property'

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function formatLeaseDateShort(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!d || !m || !y) return ymd
  return `${d} ${TH_MONTHS[(m - 1) % 12] ?? ''} ${y + 543}`
}

const PLACEHOLDER_IMG = 'https://placehold.co/600x400/f4f1de/1c1917?text=No+Image'

export function PropertyCard({ property, locale: localeProp }: { property: Property; locale?: string }) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare } = useFavorites()
  const localeContext = useLocaleOptional()
  const locale = localeProp ?? localeContext?.locale ?? 'th'
  const t = localeContext?.t ?? ((k: string) => k)
  const listingLabel = t(`listing.${property.listingType}`)
  const propertyTypeLabel = t(`listing.${property.propertyType}`)
  const images = Array.isArray(property.images) ? property.images : []
  const hasMultiple = images.length > 1
  const [slideIndex, setSlideIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const currentSrc = images[slideIndex] || images[0] || PLACEHOLDER_IMG
  // ใช้ next/image เมื่อโดเมนอยู่ใน remotePatterns (เช่น Supabase, placehold.co)
  const useNextImg = shouldUseNextImage(currentSrc) && !imgError
  const useImgTag = !useNextImg || imgError
  const effectiveSrc = useImgTag && imgError ? PLACEHOLDER_IMG : currentSrc
  const fav = isFavorite(property.id)
  const comp = isCompare(property.id)

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSlideIndex((i) => (i === 0 ? images.length - 1 : i - 1))
    setImgError(false)
  }
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSlideIndex((i) => (i === images.length - 1 ? 0 : i + 1))
    setImgError(false)
  }

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(property.id)
  }

  const listingHref = locale ? `/${locale}/listings/${property.id}` : `/listings/${property.id}`
  const imgLabel = locale === 'en' ? 'Photo' : locale === 'zh' ? '照片' : locale === 'ru' ? 'Фото' : 'รูป'
  const imgAlt = `${property.title} - ${imgLabel} ${slideIndex + 1}`

  return (
    <Link
      href={listingHref}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {useImgTag ? (
          <img
            src={effectiveSrc}
            alt={imgAlt}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={effectiveSrc}
            alt={imgAlt}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 active:bg-black/70 transition z-10"
              aria-label="รูปก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 active:bg-black/70 transition z-10"
              aria-label="รูปถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSlideIndex(i)
                    setImgError(false)
                  }}
                  className={`w-2 h-2 rounded-full transition ${
                    i === slideIndex ? 'bg-white scale-110' : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`รูปที่ ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-md">
            {listingLabel}
          </span>
          {property.isOwnerListing && (
            <span className="px-2.5 py-1 bg-accent-coral/90 text-white text-xs font-medium rounded-md flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              {locale === 'th' ? 'ฝากกับเรา' : locale === 'en' ? 'Listed with us' : locale === 'zh' ? '委托挂牌' : 'У нас'}
            </span>
          )}
          {property.quotaType && (
            <span className={`px-2.5 py-1 text-white text-xs font-semibold rounded-md ${property.quotaType === 'FQ' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {property.quotaType === 'FQ' ? 'Foreign Quota' : 'Thai Quota'}
            </span>
          )}
        </div>
        {property.originalPrice && property.originalPrice > property.price && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              -{Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}%
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={handleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition ${
              fav ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-600 hover:bg-white'
            }`}
            aria-label={fav ? 'ยกเลิกรายการโปรด' : 'เพิ่มรายการโปรด'}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleCompare}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition ${
              comp ? 'bg-primary-600 text-white' : 'bg-white/90 text-stone-600 hover:bg-white'
            }`}
            aria-label={comp ? 'ยกเลิกเปรียบเทียบ' : 'เปรียบเทียบ'}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-stone-500 mb-1">
          {property.projectName && <>{property.projectName} · </>}
          {propertyTypeLabel}
          {(property.propertyType === 'condo' || property.propertyType === 'apartment') && (property.floor != null || property.roomNumber) && (
            <> · {[property.floor != null ? `${t('listing.floor')} ${property.floor}` : null, property.roomNumber ? `${t('listing.room')} ${property.roomNumber}` : null].filter(Boolean).join(' ')}</>
          )}
          {(property.propertyType === 'house' || property.propertyType === 'villa') && property.floors != null && (
            <> · {property.floors} {t('listing.floors')}</>
          )}
          {' · '}{property.location}
        </p>
        <h3 className="font-semibold text-stone-900 line-clamp-2 group-hover:text-primary-600 transition">
          {property.title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-primary-600">
            {localeContext ? <FormattedPrice amountThb={property.price} priceLabel={property.priceLabel ?? undefined} /> : new Intl.NumberFormat('th-TH').format(property.price) + ' ฿' + (property.priceLabel ? ` ${property.priceLabel}` : '')}
          </span>
          {property.originalPrice && property.originalPrice > property.price && (
            <span className="text-sm text-stone-400 line-through">
              {new Intl.NumberFormat('th-TH').format(property.originalPrice)} ฿
            </span>
          )}
        </div>
        {property.listingType === 'rent' && property.rentMinLease && (
          <p className="mt-1 text-xs text-stone-500">
            {locale === 'th' ? `สัญญาขั้นต่ำ ${property.rentMinLease} เดือน` : locale === 'en' ? `Min. lease ${property.rentMinLease} mo.` : locale === 'zh' ? `最短租期 ${property.rentMinLease} 个月` : `Мин. срок ${property.rentMinLease} мес.`}
          </p>
        )}
        {property.listingType === 'rent' && property.rentOccupied && (property.rentLeaseEnd || property.rentLeaseStart) && (
          <p className="mt-1 text-xs text-amber-700">
            {t('listing.rented')}
            {property.rentLeaseEnd ? ` · ${t('listing.availableFrom')} ${formatLeaseDateShort(property.rentLeaseEnd)}` : property.rentLeaseStart ? ` · ${formatLeaseDateShort(property.rentLeaseStart)}` : ''}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms} {t('listing.bed')}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} {t('listing.bath')}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4" />
            {property.area} {t('listing.sqm')}
          </span>
        </div>
      </div>
    </Link>
  )
}
