'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, MapPin, BadgeCheck, Heart, GitCompare, ChevronLeft, ChevronRight } from 'lucide-react'
import { propertyTypeLabels, listingTypeLabels } from '@/data/properties'
import { useFavorites } from '@/context/FavoritesContext'
import type { Property } from '@/types/property'

function formatPrice(price: number, label?: string) {
  const formatted = new Intl.NumberFormat('th-TH').format(price)
  return label ? `${formatted} ${label}` : `${formatted} บาท`
}

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function formatLeaseDateShort(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!d || !m || !y) return ymd
  return `${d} ${TH_MONTHS[(m - 1) % 12] ?? ''} ${y + 543}`
}

const PLACEHOLDER_IMG = 'https://placehold.co/600x400/f4f1de/1c1917?text=ไม่มีรูป'

export function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare } = useFavorites()
  const images = Array.isArray(property.images) ? property.images : []
  const hasMultiple = images.length > 1
  const [slideIndex, setSlideIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const currentSrc = images[slideIndex] || images[0] || PLACEHOLDER_IMG
  const useImgTag = currentSrc.startsWith('data:') || currentSrc.startsWith('/')
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

  return (
    <Link
      href={`/listings/${property.id}`}
      className="group block bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {useImgTag ? (
          <img
            src={effectiveSrc}
            alt={`${property.title} - รูป ${slideIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={effectiveSrc}
            alt={`${property.title} - รูป ${slideIndex + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            {listingTypeLabels[property.listingType]}
          </span>
          {property.isOwnerListing && (
            <span className="px-2.5 py-1 bg-accent-coral/90 text-white text-xs font-medium rounded-md flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              ฝากกับเรา
            </span>
          )}
        </div>
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
          {propertyTypeLabels[property.propertyType]}
          {(property.propertyType === 'condo' || property.propertyType === 'apartment') && (property.floor != null || property.roomNumber) && (
            <> · {[property.floor != null ? `ชั้น ${property.floor}` : null, property.roomNumber ? `ห้อง ${property.roomNumber}` : null].filter(Boolean).join(' ')}</>
          )}
          {(property.propertyType === 'house' || property.propertyType === 'villa') && property.floors != null && (
            <> · {property.floors} ชั้น</>
          )}
          {' · '}{property.location}
        </p>
        <h3 className="font-semibold text-stone-900 line-clamp-2 group-hover:text-primary-600 transition">
          {property.title}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary-600">
          {formatPrice(property.price, property.priceLabel)}
        </p>
        {property.listingType === 'rent' && property.rentOccupied && (property.rentLeaseEnd || property.rentLeaseStart) && (
          <p className="mt-1 text-xs text-amber-700">
            เช่าอยู่แล้ว
            {property.rentLeaseEnd ? ` · ว่าง ${formatLeaseDateShort(property.rentLeaseEnd)}` : property.rentLeaseStart ? ` · เริ่ม ${formatLeaseDateShort(property.rentLeaseStart)}` : ''}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4" />
            {property.area} ตร.ม.
          </span>
        </div>
      </div>
    </Link>
  )
}
