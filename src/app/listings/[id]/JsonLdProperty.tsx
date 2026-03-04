import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/config/site'

async function JsonLdProperty({ id }: { id: string }) {
  try {
    const p = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        listingType: true,
        propertyType: true,
        price: true,
        priceLabel: true,
        location: true,
        area: true,
        bedrooms: true,
        bathrooms: true,
        images: true,
        mapUrl: true,
        status: true,
      },
    })
    if (!p || p.status !== 'published') return null
    const base = getSiteUrl()
    let imageUrl: string | undefined
    try {
      const imgs = JSON.parse(p.images)
      if (Array.isArray(imgs) && imgs[0]) {
        const first = imgs[0]
        imageUrl = typeof first === 'string' && first.startsWith('http') ? first : `${base}${first.startsWith('/') ? '' : '/'}${first}`
      }
    } catch {
      // ignore
    }
    const listingType = p.listingType === 'rent' ? 'ForRent' : 'ForSale'
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: p.title,
      description: p.description.slice(0, 500),
      url: `${base}/listings/${p.id}`,
      ...(imageUrl && { image: imageUrl }),
      listingType: listingType,
      ...(p.price && { price: p.price, priceCurrency: 'THB' }),
      address: { '@type': 'Place', name: p.location },
      numberOfRooms: p.bedrooms ?? undefined,
      floorSize: p.area ? { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' } : undefined,
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  } catch {
    return null
  }
}

export { JsonLdProperty }
