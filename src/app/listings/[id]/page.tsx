'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { properties as staticProperties, propertyTypeLabels, listingTypeLabels } from '@/data/properties'
import { Bed, Bath, Maximize2, MapPin, BadgeCheck, ChevronLeft, ChevronRight, MapPinned, Heart } from 'lucide-react'
import { AgentContact } from '@/components/AgentContact'
import { InterestForm } from '@/components/InterestForm'
import type { Property } from '@/types/property'

function formatPrice(price: number, label?: string) {
  const formatted = new Intl.NumberFormat('th-TH').format(price)
  return label ? `${formatted} ${label}` : `${formatted} บาท`
}

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function formatLeaseDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!d || !m || !y) return ymd
  const day = d
  const month = TH_MONTHS[(m - 1) % 12] ?? ymd
  const year = y + 543
  return `${day} ${month} ${year}`
}

const PLACEHOLDER = 'https://placehold.co/800x600/f4f1de/1c1917?text=ไม่มีรูป'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null | 'loading'>('loading')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showInterest, setShowInterest] = useState(false)

  useEffect(() => {
    if (!id) {
      setProperty(null)
      return
    }
    let cancelled = false
    fetch(`/api/properties/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return
        if (data) {
          setProperty(data)
          fetch(`/api/properties/${id}/view`, { method: 'POST' }).catch(() => {})
          return
        }
        const fromStatic = staticProperties.find((p) => p.id === id)
        setProperty(fromStatic ?? null)
      })
      .catch(() => {
        if (!cancelled) setProperty(staticProperties.find((p) => p.id === id) ?? null)
      })
    return () => { cancelled = true }
  }, [id])

  if (property === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-stone-500">
        กำลังโหลด...
      </div>
    )
  }
  if (!property) notFound()

  const images = property.images?.length ? property.images : [PLACEHOLDER]
  const currentImg = images[currentIndex] || images[0]
  const isDataUrl = currentImg.startsWith('data:')
  const hasMultiple = images.length > 1

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const goNext = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/listings"
        className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-6 inline-block"
      >
        ← กลับไปรายการทั้งหมด
      </Link>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 bg-primary-600 text-white text-sm font-semibold rounded-md">
          {listingTypeLabels[property.listingType]}
        </span>
        <span className="px-2.5 py-1 bg-stone-200 text-stone-800 text-sm rounded-md">
          {propertyTypeLabels[property.propertyType]}
        </span>
        {property.isOwnerListing && (
          <span className="px-2.5 py-1 bg-accent-coral/90 text-white text-sm font-medium rounded-md flex items-center gap-1 w-fit">
            <BadgeCheck className="w-4 h-4" />
            ฝากขาย/เช่ากับเรา
          </span>
        )}
      </div>

      {property.projectName && (
        <p className="text-primary-600 font-medium mb-1">{property.projectName}</p>
      )}
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900 mb-2">
        {property.title}
      </h1>
      {property.listingType === 'rent' && property.rentOccupied && (property.rentLeaseStart || property.rentLeaseEnd) && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
          <p className="font-medium">เช่าอยู่แล้ว</p>
          <p className="text-sm mt-0.5">
            {property.rentLeaseStart && property.rentLeaseEnd
              ? `ระยะสัญญา ${formatLeaseDate(property.rentLeaseStart)} – ${formatLeaseDate(property.rentLeaseEnd)}`
              : property.rentLeaseEnd
                ? `ว่างวันที่ ${formatLeaseDate(property.rentLeaseEnd)}`
                : property.rentLeaseStart
                  ? `เริ่มสัญญา ${formatLeaseDate(property.rentLeaseStart)}`
                  : 'ระบุระยะสัญญาในรายการ'}
          </p>
          <p className="text-xs text-amber-700 mt-1">ลูกค้าสามารถวางแผนหาห้องล่วงหน้าได้</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-stone-500 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property.location}
        </p>
        {property.mapUrl && (
          <a
            href={property.mapUrl.startsWith('http') ? property.mapUrl : `https://${property.mapUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <MapPinned className="w-4 h-4" />
            ดูตำแหน่งบนแผนที่
          </a>
        )}
      </div>

      <div className="mt-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
          {isDataUrl ? (
            <img
              src={currentImg}
              alt={`${property.title} - รูป ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={currentImg}
              alt={`${property.title} - รูป ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          )}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white transition"
                aria-label="รูปก่อนหน้า"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white transition"
                aria-label="รูปถัดไป"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        {hasMultiple && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((src, i) => {
              const isData = src.startsWith('data:')
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    i === currentIndex ? 'border-primary-600 ring-2 ring-primary-200' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {isData ? (
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={src} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price, property.priceLabel)}
          </p>
          <div className="flex flex-wrap gap-4 text-stone-600">
            {(property.propertyType === 'condo' || property.propertyType === 'apartment') && (property.floor != null || property.roomNumber) && (
              <span className="flex items-center gap-2">
                {property.floor != null && <>ชั้น {property.floor}</>}
                {property.floor != null && property.roomNumber && ' · '}
                {property.roomNumber && <>ห้อง {property.roomNumber}</>}
              </span>
            )}
            {(property.propertyType === 'house' || property.propertyType === 'villa') && property.floors != null && (
              <span className="flex items-center gap-2">
                บ้าน {property.floors} ชั้น
              </span>
            )}
            {property.bedrooms != null && (
              <span className="flex items-center gap-2">
                <Bed className="w-5 h-5" /> {property.bedrooms} ห้องนอน
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-2">
                <Bath className="w-5 h-5" /> {property.bathrooms} ห้องน้ำ
              </span>
            )}
            <span className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5" /> {property.area} ตร.ม.
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900 mb-2">รายละเอียด</h2>
            <p className="text-stone-600 whitespace-pre-line">{property.description}</p>
          </div>
          {property.features.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 mb-2">จุดเด่น</h2>
              <ul className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <li
                    key={f}
                    className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <button
            type="button"
            onClick={() => setShowInterest(true)}
            className="w-full py-3.5 px-4 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition shadow-md"
          >
            <Heart className="w-5 h-5" />
            สนใจทรัพย์นี้ — สอบถาม/นัดชม
          </button>
          <AgentContact variant="card" />
        </div>
      </div>

      {showInterest && property && (
        <InterestForm property={property} onClose={() => setShowInterest(false)} />
      )}
    </div>
  )
}
