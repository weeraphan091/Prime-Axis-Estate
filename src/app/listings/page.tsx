import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ListingsResults } from '@/components/ListingsResults'
import { getPropertiesFromDb } from '@/lib/property-db'
import { properties as staticProperties } from '@/data/properties'
import { getSiteUrl } from '@/config/site'

// บังคับดึงข้อมูลใหม่ทุกครั้ง — แก้หลังบ้านแล้วหน้ารายการจะอัปเดต
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ค้นหาทรัพย์ ขาย-เช่า คอนโด บ้าน วิลล่า พัทยา',
  description:
    'ค้นหารายการขาย-เช่าคอนโด บ้าน วิลล่า ที่ดินพัทยา กรองตามประเภท ราคา โซน ทำเล',
  alternates: { canonical: `${getSiteUrl()}/listings` },
  openGraph: {
    title: 'ค้นหาทรัพย์ ขาย-เช่า พัทยา | Pattaya Estate Hub',
    description: 'ค้นหาคอนโด บ้าน วิลล่า ที่ดิน ขาย-เช่าในพัทยา',
    url: `${getSiteUrl()}/listings`,
  },
}

export default async function ListingsPage() {
  const dbList = await getPropertiesFromDb()
  const serverProperties = dbList.length > 0 ? dbList : staticProperties

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-900">ค้นหาทรัพย์</h1>
        <p className="mt-1 text-stone-600">
          เลือกประเภท ขาย/เช่า และพื้นที่ที่ต้องการ สนใจรายการไหน โทรหาเราได้เลย
        </p>
      </div>
      <div className="mb-8">
        <Suspense fallback={<div className="h-20 rounded-xl bg-stone-100 animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>
      <Suspense fallback={<div className="text-stone-500">กำลังโหลด...</div>}>
        <ListingsResults serverProperties={serverProperties} />
      </Suspense>
    </div>
  )
}
