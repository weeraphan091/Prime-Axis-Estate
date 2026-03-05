import type { Metadata } from 'next'
import { getPropertyById } from '@/lib/cached-queries'
import { getSiteUrl, SITE_NAME } from '@/config/site'
import { buildAlternates } from '@/lib/seo'
import { locales, localeHreflang } from '@/config/i18n'

type Props = { children: React.ReactNode; params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  try {
    const p = await getPropertyById(id)
    if (!p || p.status !== 'published') return { title: 'Not found' }

    const title =
      (locale === 'en' && p.titleEn) || (locale === 'zh' && p.titleZh) || (locale === 'ru' && p.titleRu) || p.title
    const description =
      (locale === 'en' && p.descriptionEn) || (locale === 'zh' && p.descriptionZh) || (locale === 'ru' && p.descriptionRu) || p.description

    const typeLabels: Record<string, Record<string, string>> = {
      th: { sale: 'ขาย', rent: 'เช่า' },
      en: { sale: 'Sale', rent: 'Rent' },
      zh: { sale: '出售', rent: '出租' },
      ru: { sale: 'Продажа', rent: 'Аренда' },
    }
    const typeLabel = typeLabels[locale]?.[p.listingType] ?? typeLabels.th[p.listingType]
    const priceStr = new Intl.NumberFormat('th-TH').format(p.price) + (p.priceLabel ? ` ${p.priceLabel}` : '')
    const desc = description.slice(0, 160).replace(/\n/g, ' ')
    const base = getSiteUrl()
    const alternates = buildAlternates(locale, `/listings/${id}`)

    let ogImage: string | undefined
    try {
      const imgs = JSON.parse(p.images)
      if (Array.isArray(imgs) && imgs[0] && typeof imgs[0] === 'string' && imgs[0].startsWith('http')) {
        ogImage = imgs[0]
      }
    } catch { /* */ }

    return {
      title: `${title} | ${typeLabel} ${priceStr}`,
      description: desc,
      alternates,
      openGraph: {
        title: `${title} | ${typeLabel} ${priceStr} | ${SITE_NAME}`,
        description: desc,
        url: `${base}/${locale}/listings/${id}`,
        type: 'website',
        locale: locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : locale,
        ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
      },
      robots: { index: true, follow: true },
    }
  } catch {
    return { title: 'Property' }
  }
}

export default async function ListingDetailLayout({ children, params }: Props) {
  const { locale, id } = await params
  const base = getSiteUrl()

  let jsonLd = null
  try {
    const p = await getPropertyById(id)
    if (p && p.status === 'published') {
      const title =
        (locale === 'en' && p.titleEn) || (locale === 'zh' && p.titleZh) || (locale === 'ru' && p.titleRu) || p.title
      const description =
        (locale === 'en' && p.descriptionEn) || (locale === 'zh' && p.descriptionZh) || (locale === 'ru' && p.descriptionRu) || p.description

      let imageUrl: string | undefined
      try {
        const imgs = JSON.parse(p.images)
        if (Array.isArray(imgs) && imgs[0]) {
          const first = imgs[0]
          imageUrl = typeof first === 'string' && first.startsWith('http') ? first : undefined
        }
      } catch { /* */ }

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: title,
        description: description.slice(0, 500),
        url: `${base}/${locale}/listings/${p.id}`,
        ...(imageUrl && { image: imageUrl }),
        listingType: p.listingType === 'rent' ? 'ForRent' : 'ForSale',
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
        },
        address: { '@type': 'Place', name: p.location },
        ...(p.bedrooms && { numberOfRooms: p.bedrooms }),
        ...(p.area && { floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' } }),
      }
    }
  } catch { /* */ }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
