'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import type { Property } from '@/types/property'

const InterestFormLazy = dynamic(
  () => import('@/components/InterestForm').then((m) => ({ default: m.InterestForm })),
  { ssr: false }
)

export function InterestButton({ property, label }: { property: Property; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="w-full py-3.5 px-4 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition shadow-md"
      >
        <Heart className="w-5 h-5" />
        {label}
      </button>
      {show && <InterestFormLazy property={property} onClose={() => setShow(false)} />}
    </>
  )
}
