'use client'

import { PropertyCard } from '@/components/PropertyCard'
import { useLocaleOptional } from '@/context/LocaleContext'
import type { Property } from '@/types/property'

type Props = { serverProperties: Property[]; locale?: string }

/** ผลลัพธ์ถูกกรองที่ server แล้ว (ตาม query string) — แสดงเฉพาะรายการที่ส่งมา */
export function ListingsResults({ serverProperties, locale: localeProp }: Props) {
  const localeContext = useLocaleOptional()
  const locale = localeProp ?? localeContext?.locale ?? 'th'
  const filtered = serverProperties

  const foundText = locale === 'th' ? `พบ ${filtered.length} รายการ` : locale === 'en' ? `${filtered.length} listing(s) found` : locale === 'zh' ? `找到 ${filtered.length} 条` : `Найдено ${filtered.length}`
  const noResults = locale === 'th' ? 'ไม่พบรายการที่ตรงกับเงื่อนไข' : locale === 'en' ? 'No listings match your criteria' : locale === 'zh' ? '没有符合条件的房源' : 'Нет подходящих объявлений'
  const tryChange = locale === 'th' ? 'ลองเปลี่ยนเงื่อนไขการค้นหา' : locale === 'en' ? 'Try changing your search' : locale === 'zh' ? '请调整搜索条件' : 'Измените параметры поиска'

  return (
    <div>
      <p className="text-stone-600 mb-6">
        {foundText}
      </p>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-500">{noResults}</p>
          <p className="text-sm text-stone-400 mt-1">{tryChange}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <PropertyCard key={prop.id} property={prop} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
