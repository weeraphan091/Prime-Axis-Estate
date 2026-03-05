import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isValidLocale, type Locale } from '@/config/i18n'
import { buildAlternates } from '@/lib/seo'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getT } from '@/messages'
import { redirect } from 'next/navigation'
import { blogPosts as staticPosts } from '@/data/blog-posts'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  th: 'บล็อก — บทความอสังหาพัทยา คู่มือ เทคนิค กฎหมาย',
  en: 'Blog — Pattaya Real Estate Articles, Guides & Tips',
  zh: '博客 — 芭堤雅房产文章、指南与技巧',
  ru: 'Блог — Статьи о недвижимости Паттайи, гиды и советы',
}
const descs: Record<string, string> = {
  th: 'อ่านบทความอสังหาพัทยา คู่มือซื้อคอนโด กฎหมายต่างชาติ แนวโน้มตลาด เคล็ดลับฝากขาย',
  en: 'Read Pattaya real estate articles — buying guides, foreign ownership laws, market trends, listing tips.',
  zh: '阅读芭堤雅房产文章 — 购买指南、外国人法律、市场趋势、挂牌技巧。',
  ru: 'Статьи о недвижимости Паттайи — гиды по покупке, законы для иностранцев, тренды рынка, советы.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/blog'),
  }
}

function pickLocale<T extends Record<string, unknown>>(
  row: T, field: string, locale: string
): string {
  if (locale === 'en' && row[`${field}En`]) return String(row[`${field}En`])
  if (locale === 'zh' && row[`${field}Zh`]) return String(row[`${field}Zh`])
  if (locale === 'ru' && row[`${field}Ru`]) return String(row[`${field}Ru`])
  return String(row[field] ?? '')
}

const categoryLabels: Record<string, Record<string, string>> = {
  th: { guide: 'คู่มือ', market: 'ตลาด', legal: 'กฎหมาย', tips: 'เคล็ดลับ' },
  en: { guide: 'Guide', market: 'Market', legal: 'Legal', tips: 'Tips' },
  zh: { guide: '指南', market: '市场', legal: '法律', tips: '技巧' },
  ru: { guide: 'Гид', market: 'Рынок', legal: 'Закон', tips: 'Советы' },
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) redirect('/th')
  const t = getT(locale as Locale)
  const base = `/${locale}`
  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'
  const blogLabel = locale === 'th' ? 'บล็อก' : 'Blog'

  let posts: Record<string, unknown>[] = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })
  } catch { /* */ }

  if (posts.length === 0) {
    posts = staticPosts.filter((p) => p.status === 'published') as unknown as Record<string, unknown>[]
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs locale={locale} items={[{ label: homeLabel, href: base }, { label: blogLabel }]} />
      <h1 className="font-display text-3xl text-stone-900 mb-2">{blogLabel}</h1>
      <p className="text-stone-600 mb-8">{descs[locale] ?? descs.th}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const title = pickLocale(post, 'title', locale)
          const excerpt = pickLocale(post, 'excerpt', locale)
          const slug = String(post.slug)
          const category = String(post.category ?? 'tips')
          const catLabel = categoryLabels[locale]?.[category] ?? category
          return (
            <Link
              key={slug}
              href={`${base}/blog/${slug}`}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition"
            >
              {typeof post.coverImage === 'string' && post.coverImage ? (
                <img src={post.coverImage} alt={title} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary-300" />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {catLabel}
                </span>
                <h2 className="mt-2 font-semibold text-stone-900 group-hover:text-primary-600 line-clamp-2">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-stone-500 line-clamp-2">{excerpt}</p>
              </div>
            </Link>
          )
        })}
      </div>
      {posts.length === 0 && (
        <div className="p-16 text-center text-stone-500">
          {locale === 'th' ? 'ยังไม่มีบทความ' : 'No articles yet'}
        </div>
      )}
    </div>
  )
}
