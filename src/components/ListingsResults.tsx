'use client'

import { useSearchParams } from 'next/navigation'
import { PropertyCard } from '@/components/PropertyCard'
import type { ListingType, PropertyType } from '@/types/property'
import type { Property } from '@/types/property'

type Props = { serverProperties: Property[] }

export function ListingsResults({ serverProperties }: Props) {
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as ListingType) || null
  const property = (searchParams.get('property') as PropertyType) || null
  const location = searchParams.get('location')?.toLowerCase() || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null

  const allProperties = serverProperties

  const filtered = allProperties.filter((p) => {
    if (type && p.listingType !== type) return false
    if (property && p.propertyType !== property) return false
    if (location && !p.location.toLowerCase().includes(location)) return false
    if (minPrice != null && p.price < minPrice) return false
    if (maxPrice != null && p.price > maxPrice) return false
    return true
  })

  return (
    <div>
      <p className="text-stone-600 mb-6">
        พบ {filtered.length} รายการ
      </p>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-500">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          <p className="text-sm text-stone-400 mt-1">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
