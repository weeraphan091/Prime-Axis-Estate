'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { Eye, MessageCircle, FilePlus, List } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { FormattedPrice } from '@/components/FormattedPrice'
import type { Property } from '@/types/property'

type MyListing = Property & { leadCount: number; viewCount: number }

const PLACEHOLDER = 'https://placehold.co/400x300/f4f1de/1c1917?text=No+Image'

export default function MyListingsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'th'
  const base = `/${locale}`
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useLocale()
  const [list, setList] = useState<MyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`${base}/login?next=${base}/my-listings`)
      return
    }
    fetch('/api/my-listings')
      .then((res) => {
        if (res.status === 401) {
          router.replace(`${base}/login?next=${base}/my-listings`)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data && Array.isArray(data)) setList(data)
        else if (data?.error) setError(data.error)
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [user, authLoading, base, router])

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
          <h1 className="font-display text-2xl lg:text-3xl text-stone-900 flex items-center gap-2">
            <List className="w-8 h-8 text-primary-600" />
            {t('nav.myListings')}
          </h1>
          <p className="mt-1 text-stone-600">{locale === 'th' ? 'รายการที่คุณฝากขาย/เช่า' : 'Your listed properties'}</p>
        </div>
        <Link href={`${base}/list-your-property`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">
          <FilePlus className="w-5 h-5" />
          {t('nav.listProperty')}
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
          <p>{locale === 'th' ? 'ยังไม่มีรายการที่คุณฝาก' : 'No listings yet.'}</p>
          <Link href={`${base}/list-your-property`} className="inline-block mt-4 text-primary-600 font-medium hover:underline">{t('nav.listProperty')}</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((item) => {
            const imgs = Array.isArray(item.images) ? item.images : []
            const src = imgs[0] || PLACEHOLDER
            const useImgTag = src.startsWith('data:') || src.startsWith('/') || (src.startsWith('http') && !src.includes('placehold.co'))
            return (
              <li key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 bg-stone-100">
                  {useImgTag ? (
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Image src={src} alt="" fill className="object-cover" sizes="192px" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-stone-900 truncate">{item.title}</h2>
                    <p className="text-primary-600 font-medium mt-1">
                      <FormattedPrice amountThb={item.price} priceLabel={item.priceLabel ?? undefined} />
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {item.viewCount ?? 0} {t('listing.viewCount')}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {item.leadCount ?? 0} {t('listing.interested')}</span>
                    </div>
                  </div>
                  <Link href={`${base}/listings/${item.id}`} className="shrink-0 text-sm font-medium text-primary-600 hover:underline">{t('listing.viewDetail')}</Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
