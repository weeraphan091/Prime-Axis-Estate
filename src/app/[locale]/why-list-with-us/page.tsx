import type { Metadata } from 'next'
import Link from 'next/link'
import { FilePlus, Globe, CreditCard, Briefcase, BarChart3, Zap, ShieldCheck, BadgePercent, Users, CheckCircle, Phone } from 'lucide-react'
import { getT } from '@/messages'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale, type Locale } from '@/config/i18n'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SITE_NAME } from '@/config/site'
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
              <a
                href={`https://line.me/ti/p/@187umoiw`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-[#06C755] text-white rounded-xl font-semibold hover:bg-[#05b34d] transition w-full justify-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                {t('whyList.chatLine')}
              </a>
              <a
                href="https://wa.me/66812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition w-full justify-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                {t('whyList.chatWhatsApp')}
              </a>
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
