import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isValidLocale, type Locale } from '@/config/i18n'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getT } from '@/messages'
import { blogPosts as staticPosts } from '@/data/blog-posts'
import { ArrowLeft, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; slug: string }> }

function pick(row: Record<string, unknown>, field: string, locale: string): string {
  if (locale === 'en' && row[`${field}En`]) return String(row[`${field}En`])
  if (locale === 'zh' && row[`${field}Zh`]) return String(row[`${field}Zh`])
  if (locale === 'ru' && row[`${field}Ru`]) return String(row[`${field}Ru`])
  return String(row[field] ?? '')
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  const t = getT(locale as Locale)
  const base = `/${locale}`
  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'
  const blogLabel = locale === 'th' ? 'บล็อก' : 'Blog'

  let post: Record<string, unknown> | null = null
  try {
    post = await prisma.blogPost.findUnique({ where: { slug } }) as Record<string, unknown> | null
  } catch { /* */ }

  if (!post || post.status !== 'published') {
    const fromStatic = staticPosts.find((p) => p.slug === slug && p.status === 'published')
    if (!fromStatic) notFound()
    post = fromStatic as unknown as Record<string, unknown>
  }

  const title = pick(post, 'title', locale)
  const content = pick(post, 'content', locale)
  const category = String(post.category ?? 'tips')
  const categoryLabels: Record<string, Record<string, string>> = {
    th: { guide: 'คู่มือ', market: 'ตลาด', legal: 'กฎหมาย', tips: 'เคล็ดลับ' },
    en: { guide: 'Guide', market: 'Market', legal: 'Legal', tips: 'Tips' },
    zh: { guide: '指南', market: '市场', legal: '法律', tips: '技巧' },
    ru: { guide: 'Гид', market: 'Рынок', legal: 'Закон', tips: 'Советы' },
  }
  const catLabel = categoryLabels[locale]?.[category] ?? category

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: homeLabel, href: base },
          { label: blogLabel, href: `${base}/blog` },
          { label: title },
        ]}
      />
      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
        {catLabel}
      </span>
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900 mt-3 mb-4">{title}</h1>
      <p className="text-sm text-stone-400 mb-6">{String(post.createdAt ?? '')}</p>
      {typeof post.coverImage === 'string' && post.coverImage && (
        <img src={post.coverImage} alt={title} className="w-full rounded-xl mb-8 max-h-96 object-cover" />
      )}
      <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-line leading-relaxed">
        {content}
      </div>
      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href={`${base}/blog`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          {locale === 'th' ? 'กลับหน้าบล็อก' : locale === 'en' ? 'Back to blog' : locale === 'zh' ? '返回博客' : 'Назад в блог'}
        </Link>
      </div>
    </article>
  )
}
