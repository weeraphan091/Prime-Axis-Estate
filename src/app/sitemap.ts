import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'
import { getPropertiesFromDb } from '@/lib/property-db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/listings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/list-your-property`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/how-to-list`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let listingPages: MetadataRoute.Sitemap = []
  try {
    const properties = await getPropertiesFromDb(true)
    listingPages = properties.map((p) => ({
      url: `${base}/listings/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available at build or edge
  }

  return [...staticPages, ...listingPages]
}
