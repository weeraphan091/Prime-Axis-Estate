import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ListingsResults } from '@/components/ListingsResults'
import { getPublishedPropertiesForPublicList, type PropertyListFilters } from '@/lib/property-db'
import { getSiteUrl } from '@/config/site'

export const revalidate = 60

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function parseListingFilters(sp: Record<string, string | string[] | undefined>): PropertyListFilters {
  const g = (k: string) => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }
  const type = g('type')
  const property = g('property')
  const location = g('location')
  const minP = g('minPrice')
  const maxP = g('maxPrice')
  const minPrice = minP != null && minP !== '' ? Number(minP) : null
  const maxPrice = maxP != null && maxP !== '' ? Number(maxP) : null
  return {
    listingType: type === 'sale' || type === 'rent' ? type : null,
    propertyType:
      property === 'condo' ||
      property === 'house' ||
      property === 'villa' ||
      property === 'apartment' ||
      property === 'land' ||
      property === 'commercial'
        ? property
        : null,
    location: location?.trim() || null,
    minPrice: minPrice != null && Number.isFinite(minPrice) ? minPrice : null,
    maxPrice: maxPrice != null && Number.isFinite(maxPrice) ? maxPrice : null,
  }
}

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

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams
  const filters = parseListingFilters(sp)
  const serverProperties = await getPublishedPropertiesForPublicList(filters, undefined, {})

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
