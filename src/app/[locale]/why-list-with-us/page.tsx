import type { Metadata } from 'next'
import Link from 'next/link'
import { FilePlus, Globe, CreditCard, Briefcase, BarChart3, Zap, ShieldCheck, BadgePercent, Users, CheckCircle, Phone } from 'lucide-react'
import { getT } from '@/messages'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale, type Locale } from '@/config/i18n'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SITE_NAME } from '@/config/site'
import { ChatButtonsBlock } from '@/components/ChatButtons'
import { QuickListingForm } from './QuickListingForm'
import { StatsBar } from '@/components/StatsBar'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  th: `ทำไมต้องฝากทรัพย์กับเรา | ${SITE_NAME}`,
  en: `Why List With Us | ${SITE_NAME}`,
  zh: `为什么选择我们 | ${SITE_NAME}`,
  ru: `Почему мы | ${SITE_NAME}`,
}
const descs: Record<string, string> = {
  th: 'ฝากขาย-ฝากเช่าทรัพย์ในพัทยากับ Pattaya Estate Hub ฟรี ไม่มีค่าใช้จ่ายล่วงหน้า เข้าถึงลูกค้า 4 ภาษา ปิดดีลเร็ว',
  en: 'List your Pattaya property for free with Pattaya Estate Hub. No upfront costs, 4-language reach, faster closing.',
  zh: '免费在 Pattaya Estate Hub 挂牌芭堤雅房产。无预付费用，4种语言覆盖，更快成交。',
  ru: 'Бесплатное размещение недвижимости в Паттайе с Pattaya Estate Hub. Без предоплаты, 4 языка, быстрое закрытие.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/why-list-with-us'),
  }
}

const benefitIcons = [Globe, CreditCard, Briefcase, BarChart3, Zap, ShieldCheck]

export default async function WhyListWithUsPage({ params }: Props) {
  const { locale } = await params
  const t = getT(locale as Locale)
  const base = `/${locale}`
  const homeLabel = locale === 'th' ? 'หน้าแรก' : locale === 'en' ? 'Home' : locale === 'zh' ? '首页' : 'Главная'

  const benefits = [1, 2, 3, 4, 5, 6].map((n) => ({
    icon: benefitIcons[n - 1],
    title: t(`whyList.benefit${n}Title`),
    desc: t(`whyList.benefit${n}Desc`),
  }))

  const steps = [1, 2, 3].map((n) => t(`whyList.process${n}`))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs locale={locale} items={[{ label: homeLabel, href: base }, { label: t('whyList.title') }]} />

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="font-display text-3xl lg:text-4xl text-stone-900">{t('whyList.title')}</h1>
        <p className="mt-3 text-lg text-stone-600 max-w-2xl mx-auto">{t('whyList.subtitle')}</p>
      </section>

      {/* Stats */}
      <StatsBar locale={locale} />

      {/* Benefits grid */}
      <section className="mt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition">
              <b.icon className="w-10 h-10 text-primary-600 mb-3" />
              <h3 className="font-semibold text-stone-900">{b.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-stone-900 text-center mb-8">{t('whyList.processTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-5 bg-primary-50 rounded-xl border border-primary-100">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-stone-700 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee summary */}
      <section className="mt-14 bg-gradient-to-br from-stone-50 to-primary-50 rounded-2xl border border-stone-200 p-6 lg:p-8">
        <h2 className="font-display text-xl text-stone-900 flex items-center gap-2 mb-2">
          <BadgePercent className="w-6 h-6 text-primary-600" />
          {t('howToList.feeTitle')}
        </h2>
        <p className="text-sm text-stone-600 mb-6">{t('howToList.feeIntro')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 mb-1">{t('howToList.feeRentTitle')}</h3>
            <p className="text-lg font-bold text-primary-700">{t('howToList.feeRentDesc')}</p>
            <p className="text-xs text-stone-500 mt-1">{t('howToList.feeRentNote')}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 mb-1">{t('howToList.feeSaleTitle')}</h3>
            <p className="text-lg font-bold text-primary-700">{t('howToList.feeSaleDesc')}</p>
            <p className="text-xs text-stone-500 mt-1">{t('howToList.feeSaleNote')}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {t('howToList.feeNoUpfront')}
        </div>
      </section>

      {/* Quick form + LINE/WhatsApp */}
      <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8" id="quick-submit">
        <QuickListingForm locale={locale} />
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-semibold text-stone-900 mb-2">{t('whyList.ctaTitle')}</h3>
            <p className="text-sm text-stone-600 mb-4">{t('whyList.ctaDesc')}</p>
            <div className="space-y-3">
              <ChatButtonsBlock lineLabel={t('whyList.chatLine')} whatsappLabel={t('whyList.chatWhatsApp')} />
              <Link
                href={`${base}/contact`}
                className="flex items-center gap-3 px-5 py-3 border border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition w-full justify-center"
              >
                <Phone className="w-5 h-5" />
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-stone-900">{t('whyList.referralTitle')}</h3>
            </div>
            <p className="text-sm text-stone-600 mb-3">{t('whyList.referralDesc')}</p>
            <Link
              href={`${base}/contact`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              {t('whyList.referralCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-14 bg-primary-600 rounded-2xl p-8 lg:p-12 text-center text-white">
        <h2 className="font-display text-2xl lg:text-3xl">{t('whyList.ctaTitle')}</h2>
        <p className="mt-3 text-primary-100 max-w-xl mx-auto">{t('whyList.ctaDesc')}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`${base}/list-your-property`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition shadow-lg"
          >
            <FilePlus className="w-5 h-5" />
            {t('nav.listProperty')}
          </Link>
        </div>
      </section>
    </div>
  )
}
