'use client'

import { PropertyCard } from '@/components/PropertyCard'
import type { Property } from '@/types/property'

type Props = { serverList?: Property[] }

export function LatestListings({ serverList = [] }: Props) {
  const sorted = [...serverList].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
  const latest = sorted.slice(0, 6)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {latest.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
