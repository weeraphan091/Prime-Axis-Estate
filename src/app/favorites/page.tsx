'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PropertyCard } from '@/components/PropertyCard'
import { properties as staticProperties } from '@/data/properties'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import type { Property } from '@/types/property'

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const [allProperties, setAllProperties] = useState<Property[]>([])
  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.ok ? r.json() : [])
      .then((db: Property[]) => {
        const list = Array.isArray(db) ? db : []
        setAllProperties(list.length > 0 ? list : staticProperties)
      })
      .catch(() => setAllProperties(staticProperties))
  }, [])
  const list = allProperties.filter((p) => favoriteIds.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900 flex items-center gap-2">
        <Heart className="w-8 h-8 text-red-500" />
        รายการโปรด
      </h1>
      <p className="mt-1 text-stone-600">
        {list.length > 0 ? `คุณเก็บไว้ ${list.length} รายการ` : 'ยังไม่มีรายการโปรด'}
      </p>
      {list.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-stone-200">
          <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">ยังไม่มีรายการที่บันทึกไว้</p>
          <Link
            href="/listings"
            className="inline-block mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            ไปค้นหาทรัพย์
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
