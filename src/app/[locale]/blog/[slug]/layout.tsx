import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl, SITE_NAME } from '@/config/site'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale } from '@/config/i18n'
import { blogPosts as staticPosts } from '@/data/blog-posts'

type Props = { children: React.ReactNode; params: Promise<{ locale: string; slug: string }> }

function pick(row: Record<string, unknown>, field: string, locale: string): string {
  if (locale === 'en' && row[`${field}En`]) return String(row[`${field}En`])
  if (locale === 'zh' && row[`${field}Zh`]) return String(row[`${field}Zh`])
  if (locale === 'ru' && row[`${field}Ru`]) return String(row[`${field}Ru`])
  return String(row[field] ?? '')
}

async function getPost(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } })
    if (p && p.status === 'published') return p as unknown as Record<string, unknown>
  } catch { /* */ }
  const fromStatic = staticPosts.find((p) => p.slug === slug && p.status === 'published')
  return fromStatic ? (fromStatic as unknown as Record<string, unknown>) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}
  const post = await getPost(slug)
  if (!post) return { title: 'Not found' }

  const title = pick(post, 'title', locale)
  const excerpt = pick(post, 'excerpt', locale)
  const base = getSiteUrl()
  const alternates = buildAlternates(locale, `/blog/${slug}`)

  return {
    title,
    description: excerpt.slice(0, 160),
    alternates,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: excerpt.slice(0, 160),
      url: `${base}/${locale}/blog/${slug}`,
      type: 'article',
      locale: locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : locale,
      ...(post.coverImage && { images: [{ url: String(post.coverImage), width: 1200, height: 630, alt: title }] }),
    },
    twitter: { card: 'summary_large_image', title, description: excerpt.slice(0, 160) },
  }
}

export default async function BlogDetailLayout({ children, params }: Props) {
  const { locale, slug } = await params
  const base = getSiteUrl()
  const post = await getPost(slug)

  let jsonLd = null
  if (post) {
    const title = pick(post, 'title', locale)
    const excerpt = pick(post, 'excerpt', locale)
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt.slice(0, 300),
      url: `${base}/${locale}/blog/${slug}`,
      datePublished: String(post.createdAt ?? ''),
      dateModified: String(post.updatedAt ?? post.createdAt ?? ''),
      author: { '@type': 'Organization', name: SITE_NAME, url: base },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: base },
      ...(post.coverImage && { image: String(post.coverImage) }),
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${base}/${locale}/blog/${slug}` },
    }
  }

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
