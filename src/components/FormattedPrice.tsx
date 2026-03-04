'use client'

import { useLocale } from '@/context/LocaleContext'

type Props = {
  amountThb: number
  priceLabel?: string | null
  /** ถ้า true แสดงแค่ ฿ ไม่แสดงสกุลอื่น */
  thbOnly?: boolean
}

export function FormattedPrice({ amountThb, priceLabel, thbOnly }: Props) {
  const { formatPrice } = useLocale()
  const text = thbOnly
    ? new Intl.NumberFormat('th-TH').format(amountThb) + ' ฿' + (priceLabel ? ` ${priceLabel}` : '')
    : formatPrice(amountThb, priceLabel ?? undefined)
  return <span>{text}</span>
}
