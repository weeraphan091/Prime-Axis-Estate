'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, MapPin, BadgeCheck, Heart, GitCompare } from 'lucide-react'
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

export function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare } = useFavorites()
  const imgSrc = property.images[0] || 'https://placehold.co/600x400/f4f1de/1c1917?text=ไม่มีรูป'
  const isDataUrl = imgSrc.startsWith('data:')
  const fav = isFavorite(property.id)
  const comp = isCompare(property.id)

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
        {isDataUrl ? (
          <img
            src={imgSrc}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
