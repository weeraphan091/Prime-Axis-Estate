import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bed, Bath, Maximize2, MapPin, BadgeCheck, MapPinned, Tag } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { prismaToProperty, propertyForLocale } from '@/lib/property-db'
import { properties as staticProperties } from '@/data/properties'
import { getT } from '@/messages'
import { isValidLocale, type Locale } from '@/config/i18n'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AgentContact } from '@/components/AgentContact'
import { FormattedPrice } from '@/components/FormattedPrice'
import { PropertyImageCarousel } from './PropertyImageCarousel'
import { InterestButton } from './InterestButton'
import { ViewCounter } from './ViewCounter'
import type { Property } from '@/types/property'

type Props = { params: Promise<{ locale: string; id: string }> }

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
function formatLeaseDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!d || !m || !y) return ymd
  return `${d} ${TH_MONTHS[(m - 1) % 12] ?? ymd} ${y + 543}`
}

export const dynamic = 'force-dynamic'

export default async function PropertyDetailPage({ params }: Props) {
  const { locale, id } = await params
  if (!isValidLocale(locale)) notFound()
  const t = getT(locale as Locale)

  let property: Property | null = null
  try {
    const row = await prisma.property.findUnique({ where: { id } })
    if (row) {
      const mapped = prismaToProperty(row)
      property = propertyForLocale(mapped, locale as Locale)
    }
  } catch { /* DB unavailable */ }

  if (!property) {
    const fromStatic = staticProperties.find((p) => p.id === id)
    if (!fromStatic) notFound()
    property = fromStatic
  }

  const base = `/${locale}`
  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'
  const listLabel = locale === 'th' ? 'ค้นหาทรัพย์' : locale === 'en' ? 'Listings' : locale === 'zh' ? '房源列表' : 'Объекты'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ViewCounter id={id} />
      <Breadcrumbs
        locale={locale}
        items={[
          { label: homeLabel, href: base },
          { label: listLabel, href: `${base}/listings` },
          { label: property.title },
        ]}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 bg-primary-600 text-white text-sm font-semibold rounded-md">
          {t(`listing.${property.listingType}`)}
        </span>
        <span className="px-2.5 py-1 bg-stone-200 text-stone-800 text-sm rounded-md">
          {t(`listing.${property.propertyType}`)}
        </span>
        {property.isOwnerListing && (
          <span className="px-2.5 py-1 bg-accent-coral/90 text-white text-sm font-medium rounded-md flex items-center gap-1 w-fit">
            <BadgeCheck className="w-4 h-4" />
            {locale === 'th' ? 'ฝากขาย/เช่ากับเรา' : locale === 'en' ? 'Listed with us' : locale === 'zh' ? '委托挂牌' : 'У нас'}
          </span>
        )}
        {(property.listingSource === 'owner_direct' || property.listingSource === 'from_agent') && (
          <span className="px-2.5 py-1 bg-stone-300 text-stone-800 text-sm rounded-md">
            {property.listingSource === 'owner_direct' ? t('listing.ownerDirect') : t('listing.fromAgent')}
          </span>
        )}
        {property.quotaType && (
          <span className={`px-2.5 py-1 text-white text-sm font-semibold rounded-md ${property.quotaType === 'FQ' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {property.quotaType === 'FQ'
              ? (locale === 'th' ? 'โควต้าต่างชาติ (FQ)' : locale === 'en' ? 'Foreign Quota' : locale === 'zh' ? '外籍配额' : 'Иностр. квота')
              : (locale === 'th' ? 'โควต้าไทย (TH)' : locale === 'en' ? 'Thai Quota' : locale === 'zh' ? '泰籍配额' : 'Тайская квота')}
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
          <p className="font-medium">{t('listing.rented')}</p>
          <p className="text-sm mt-0.5">
            {property.rentLeaseStart && property.rentLeaseEnd
              ? `${t('listing.leasePeriod')} ${formatLeaseDate(property.rentLeaseStart)} – ${formatLeaseDate(property.rentLeaseEnd)}`
              : property.rentLeaseEnd
                ? `${t('listing.availableFrom')} ${formatLeaseDate(property.rentLeaseEnd)}`
                : property.rentLeaseStart
                  ? formatLeaseDate(property.rentLeaseStart)
                  : ''}
          </p>
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
            {locale === 'th' ? 'ดูตำแหน่งบนแผนที่' : locale === 'en' ? 'View on map' : locale === 'zh' ? '查看地图' : 'На карте'}
          </a>
        )}
      </div>

      <PropertyImageCarousel images={property.images} title={property.title} locale={locale} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-2xl font-bold text-primary-600">
              <FormattedPrice amountThb={property.price} priceLabel={property.priceLabel ?? undefined} />
            </p>
            {property.originalPrice && property.originalPrice > property.price && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {new Intl.NumberFormat('th-TH').format(property.originalPrice)} ฿
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-sm font-bold rounded-md">
                  <Tag className="w-3.5 h-3.5" />
                  -{Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          {property.listingType === 'rent' && property.rentMinLease && (
            <p className="text-sm text-stone-500">
              {locale === 'th' ? `สัญญาเช่าขั้นต่ำ ${property.rentMinLease} เดือน` : locale === 'en' ? `Minimum lease: ${property.rentMinLease} months` : locale === 'zh' ? `最短租期：${property.rentMinLease} 个月` : `Мин. срок аренды: ${property.rentMinLease} мес.`}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-stone-600">
            {(property.propertyType === 'condo' || property.propertyType === 'apartment') && (property.floor != null || property.roomNumber) && (
              <span className="flex items-center gap-2">
                {property.floor != null && <>{t('listing.floor')} {property.floor}</>}
                {property.floor != null && property.roomNumber && ' · '}
                {property.roomNumber && <>{t('listing.room')} {property.roomNumber}</>}
              </span>
            )}
            {(property.propertyType === 'house' || property.propertyType === 'villa') && property.floors != null && (
              <span className="flex items-center gap-2">
                {property.floors} {t('listing.floors')}
              </span>
            )}
            {property.bedrooms != null && (
              <span className="flex items-center gap-2">
                <Bed className="w-5 h-5" /> {property.bedrooms} {t('listing.bed')}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-2">
                <Bath className="w-5 h-5" /> {property.bathrooms} {t('listing.bath')}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5" /> {property.area} {t('listing.sqm')}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900 mb-2">{t('listing.description')}</h2>
            <p className="text-stone-600 whitespace-pre-line">{property.description}</p>
          </div>
          {property.features.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 mb-2">{t('listing.features')}</h2>
              <ul className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <li key={f} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <InterestButton property={property} label={t('listing.interestedInProperty')} />
          <AgentContact variant="card" />
        </div>
      </div>
    </div>
  )
}
