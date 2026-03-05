import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'
import { getPropertiesFromDb } from '@/lib/property-db'
import { prisma } from '@/lib/prisma'
import { locales } from '@/config/i18n'

const STATIC_PATHS = ['', 'listings', 'list-your-property', 'contact', 'how-to-list', 'blog', 'terms', 'privacy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const prefix = `${base}/${locale}`
    entries.push({ url: prefix, lastModified: new Date(), changeFrequency: 'daily', priority: 1 })
    for (const path of STATIC_PATHS) {
      if (path === '') continue
      const priority = path === 'listings' ? 0.9 : path === 'blog' ? 0.8 : path === 'list-your-property' ? 0.7 : 0.5
      const freq = (path === 'listings' || path === 'blog') ? 'daily' : 'monthly'
      entries.push({ url: `${prefix}/${path}`, lastModified: new Date(), changeFrequency: freq, priority })
    }
  }

  let properties: Awaited<ReturnType<typeof getPropertiesFromDb>> = []
  try {
    properties = await getPropertiesFromDb(true)
  } catch { /* */ }

  for (const locale of locales) {
    for (const p of properties) {
      entries.push({
        url: `${base}/${locale}/listings/${p.id}`,
        lastModified: new Date(p.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }
  }

  let blogSlugs: { slug: string; createdAt: string }[] = []
  try {
    blogSlugs = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { slug: true, createdAt: true },
    })
  } catch { /* */ }

  for (const locale of locales) {
    for (const b of blogSlugs) {
      entries.push({
        url: `${base}/${locale}/blog/${b.slug}`,
        lastModified: new Date(b.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    }
  }

  return entries
}
