import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'
import { getPropertiesFromDb } from '@/lib/property-db'
import { locales } from '@/config/i18n'

const STATIC_PATHS = ['', 'listings', 'list-your-property', 'contact', 'login', 'register', 'how-to-list', 'terms', 'privacy', 'favorites', 'compare', 'my-listings']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const prefix = `${base}/${locale}`
    entries.push({ url: prefix, lastModified: new Date(), changeFrequency: 'daily', priority: 1 })
    for (const path of STATIC_PATHS) {
      if (path === '') continue
      entries.push({
        url: `${prefix}/${path}`,
        lastModified: new Date(),
        changeFrequency: path === 'listings' ? 'daily' : 'monthly',
        priority: path === 'listings' ? 0.9 : path === 'list-your-property' ? 0.7 : 0.5,
      })
    }
  }

  let properties: Awaited<ReturnType<typeof getPropertiesFromDb>> = []
  try {
    properties = await getPropertiesFromDb(true)
  } catch {
    // DB not available at build or edge
  }

  for (const locale of locales) {
    const prefix = `${base}/${locale}/listings`
    for (const p of properties) {
      entries.push({
        url: `${prefix}/${p.id}`,
        lastModified: new Date(p.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }
  }

  return entries
}
