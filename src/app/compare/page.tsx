'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { properties as staticProperties } from '@/data/properties'
import { useFavorites } from '@/context/FavoritesContext'
import type { Property } from '@/types/property'
import { propertyTypeLabels, listingTypeLabels } from '@/data/properties'
import { GitCompare, X } from 'lucide-react'

function formatPrice(price: number, label?: string) {
  const formatted = new Intl.NumberFormat('th-TH').format(price)
  return label ? `${formatted} ${label}` : `${formatted} บาท`
}

export default function ComparePage() {
  const { compareIds, toggleCompare } = useFavorites()
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
  const list = allProperties.filter((p) => compareIds.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900 flex items-center gap-2">
        <GitCompare className="w-8 h-8 text-primary-600" />
        เปรียบเทียบรายการ
      </h1>
      <p className="mt-1 text-stone-600">
        เลือกได้สูงสุด 4 รายการ เพื่อเปรียบเทียบ
      </p>
      {list.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white rounded-xl border border-stone-200">
          <GitCompare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">ยังไม่มีรายการที่เลือกเปรียบเทียบ</p>
          <Link
            href="/listings"
            className="inline-block mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            ไปค้นหาทรัพย์
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px] bg-white rounded-xl border border-stone-200 overflow-hidden">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left p-4 font-semibold text-stone-700 w-32">รายการ</th>
                {list.map((p) => (
                  <th key={p.id} className="text-left p-4 font-semibold text-stone-700 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/listings/${p.id}`} className="line-clamp-2 hover:text-primary-600">
                        {p.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCompare(p.id)}
                        className="p-1 rounded text-stone-400 hover:bg-stone-200 hover:text-stone-700"
                        aria-label="ลบออกจากการเปรียบเทียบ"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">ประเภท</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{listingTypeLabels[p.listingType]} · {propertyTypeLabels[p.propertyType]}</td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">ราคา</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-primary-600">
                    {formatPrice(p.price, p.priceLabel)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">ทำเล</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{p.location}</td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="p-4 text-stone-500">พื้นที่</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">{p.area} ตร.ม.</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-stone-500">ห้องนอน/ห้องน้ำ</td>
                {list.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.bedrooms != null ? `${p.bedrooms} ห้องนอน` : '-'} / {p.bathrooms != null ? `${p.bathrooms} ห้องน้ำ` : '-'}
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
