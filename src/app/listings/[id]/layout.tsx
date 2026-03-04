import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl, SITE_NAME } from '@/config/site'
import { JsonLdProperty } from './JsonLdProperty'

type Props = { children: React.ReactNode; params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const p = await prisma.property.findUnique({
      where: { id },
      select: { title: true, description: true, listingType: true, price: true, priceLabel: true, status: true, images: true },
    })
    if (!p || p.status !== 'published') return { title: 'ไม่พบรายการ' }
    const typeLabel = p.listingType === 'rent' ? 'เช่า' : 'ขาย'
    const priceStr = new Intl.NumberFormat('th-TH').format(p.price) + (p.priceLabel || '')
    const title = `${p.title} | ${typeLabel} ${priceStr} | ${SITE_NAME}`
    const desc = p.description.slice(0, 160).replace(/\n/g, ' ')
    const url = `${getSiteUrl()}/listings/${id}`
    let ogImage: string | undefined
    try {
      const imgs = JSON.parse(p.images)
      if (Array.isArray(imgs) && imgs[0] && typeof imgs[0] === 'string' && imgs[0].startsWith('http')) {
        ogImage = imgs[0]
      }
    } catch {
      // ignore
    }
    return {
      title: `${p.title} | ${typeLabel}`,
      description: desc,
      alternates: { canonical: url },
      openGraph: {
        title,
        description: desc,
        url,
        type: 'website',
        ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: p.title }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: p.title,
        description: desc,
      },
      robots: { index: true, follow: true },
    }
  } catch {
    return { title: 'รายการทรัพย์' }
  }
}

export default async function ListingDetailLayout({ children, params }: Props) {
  const { id } = await params
  return (
    <>
      <JsonLdProperty id={id} />
      {children}
    </>
  )
}
