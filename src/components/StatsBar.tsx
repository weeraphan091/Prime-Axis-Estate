import { Building2, Users, Handshake, Globe } from 'lucide-react'
import { getT } from '@/messages'
import type { Locale } from '@/config/i18n'

const stats = [
  { icon: Building2, valueKey: 'properties', value: '50+' },
  { icon: Users, valueKey: 'owners', value: '30+' },
  { icon: Handshake, valueKey: 'deals', value: '20+' },
  { icon: Globe, valueKey: 'languages', value: '4' },
]

export function StatsBar({ locale }: { locale: string }) {
  const t = getT(locale as Locale)
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.valueKey} className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
          <s.icon className="w-8 h-8 text-primary-600 shrink-0" />
          <div>
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{t(`stats.${s.valueKey}`)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
