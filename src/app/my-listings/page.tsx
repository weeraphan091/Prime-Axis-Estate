'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Eye, MessageCircle, FilePlus, List } from 'lucide-react'
import type { Property } from '@/types/property'

type MyListing = Property & { leadCount: number; viewCount: number }

function formatPrice(price: number, label?: string) {
  const formatted = new Intl.NumberFormat('th-TH').format(price)
  return label ? `${formatted} ${label}` : `${formatted} บาท`
}

const PLACEHOLDER = 'https://placehold.co/400x300/f4f1de/1c1917?text=ไม่มีรูป'

export default function MyListingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [list, setList] = useState<MyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login?next=/my-listings')
      return
    }
    fetch('/api/my-listings')
      .then((res) => {
        if (res.status === 401) {
          router.replace('/login?next=/my-listings')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data && Array.isArray(data)) setList(data)
        else if (data?.error) setError(data.error)
      })
      .catch(() => setError('โหลดรายการไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [user, authLoading, router])

  if (authLoading || (!user && !error)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-stone-900">รายการของฉัน</h1>
          <p className="text-sm text-stone-500 mt-1">
            รายการทรัพย์ที่คุณฝากไว้ และความเคลื่อนไหว (จำนวนคนสนใจ / จำนวนการดู)
          </p>
        </div>
        <Link
          href="/list-your-property"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
        >
          <FilePlus className="w-4 h-4" />
          ฝากขาย/เช่าเพิ่ม
        </Link>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <List className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600">ยังไม่มีรายการที่คุณฝากไว้</p>
          <Link
            href="/list-your-property"
            className="inline-flex items-center gap-2 mt-4 text-primary-600 font-medium hover:underline"
          >
            <FilePlus className="w-4 h-4" />
            ฝากขาย/เช่าทรัพย์
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {list.map((item) => {
            const img = Array.isArray(item.images) && item.images[0] ? item.images[0] : PLACEHOLDER
            const isExternalImg = typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:'))
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col sm:flex-row"
              >
                <Link href={`/listings/${item.id}`} className="block sm:w-56 shrink-0 aspect-video sm:aspect-square relative">
                  {isExternalImg ? (
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={img.startsWith('/') ? img : `/${img}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-stone-500 uppercase">
                        {item.listingType === 'rent' ? 'เช่า' : 'ขาย'} · {item.propertyType}
                      </span>
                      <h2 className="font-semibold text-stone-900 mt-0.5 line-clamp-2">
                        <Link href={`/listings/${item.id}`} className="hover:text-primary-600">
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-primary-600 font-medium mt-1">
                        {formatPrice(item.price, item.priceLabel)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'sold_rented'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'published' ? 'เผยแพร่' : item.status === 'sold_rented' ? 'ขาย/เช่าแล้ว' : 'แบบร่าง'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-sm text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-stone-400" />
                      <strong className="text-stone-800">{item.viewCount}</strong> ครั้งที่เปิดดู
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-stone-400" />
                      <strong className="text-stone-800">{item.leadCount}</strong> คนสนใจ
                    </span>
                  </div>
                  <div className="mt-auto pt-4 flex gap-2">
                    <Link
                      href={`/listings/${item.id}`}
                      className="text-sm text-primary-600 hover:underline font-medium"
                    >
                      ดูหน้ารายการ →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
