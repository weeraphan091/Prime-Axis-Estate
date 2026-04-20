'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { shouldUseNextImage } from '@/lib/remote-image'

const PLACEHOLDER = 'https://placehold.co/800x600/f4f1de/1c1917?text=No+Image'

export function PropertyImageCarousel({ images, title, locale }: { images: string[]; title: string; locale: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => { setImgError(false) }, [currentIndex])

  const imgLabel = locale === 'en' ? 'Photo' : locale === 'zh' ? '照片' : locale === 'ru' ? 'Фото' : 'รูป'
  const list = images.length > 0 ? images : [PLACEHOLDER]
  const currentImg = list[currentIndex] || list[0]
  const useNextMain = shouldUseNextImage(currentImg) && !imgError
  const displayImg = imgError ? PLACEHOLDER : currentImg
  const hasMultiple = list.length > 1

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? list.length - 1 : i - 1))
  const goNext = () => setCurrentIndex((i) => (i === list.length - 1 ? 0 : i + 1))

  return (
    <div className="mt-6">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
        {!useNextMain ? (
          <img
            src={displayImg}
            alt={`${title} - ${imgLabel} ${currentIndex + 1}`}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={displayImg}
            alt={`${title} - ${imgLabel} ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 1024px) 100vw, 1024px"
            onError={() => setImgError(true)}
          />
        )}
        {hasMultiple && (
          <>
            <button type="button" onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button type="button" onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white transition">
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {list.length}
            </div>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                i === currentIndex ? 'border-primary-600 ring-2 ring-primary-200' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {!shouldUseNextImage(src) ? (
                <img src={src} alt={`${title} ${imgLabel} ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              ) : (
                <Image src={src} alt={`${title} ${imgLabel} ${i + 1}`} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
