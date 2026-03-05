import Link from 'next/link'
import Image from 'next/image'
import { AgentContact } from '@/components/AgentContact'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getT } from '@/messages'
import type { Locale } from '@/config/i18n'

export function Footer({ locale }: { locale: Locale }) {
  const t = getT(locale)
  const base = `/${locale}`
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href={base} className="inline-flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Pattaya Estate Hub" width={36} height={36} className="object-contain" />
              <h3 className="font-display text-lg text-white">Pattaya Estate Hub</h3>
            </Link>
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${base}/listings`} className="hover:text-white transition">
                  {t('nav.search')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/list-your-property`} className="hover:text-white transition">
                  {t('footer.listProperty')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="hover:text-white transition">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/how-to-list`} className="hover:text-white transition">
                  {t('footer.howToList')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/why-list-with-us`} className="hover:text-white transition">
                  {locale === 'th' ? 'ทำไมต้องฝากกับเรา' : locale === 'en' ? 'Why list with us' : locale === 'zh' ? '为什么选择我们' : 'Почему мы'}
                </Link>
              </li>
              <li>
                <Link href={`${base}/blog`} className="hover:text-white transition">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/terms`} className="hover:text-white transition">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/privacy`} className="hover:text-white transition">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          <AgentContact variant="footer" />
          <NewsletterForm />
        </div>
        <div className="mt-10 pt-8 border-t border-stone-700 text-center text-sm">
          © {new Date().getFullYear()} Pattaya Estate Hub. {locale === 'th' ? 'สงวนลิขสิทธิ์' : locale === 'en' ? 'All rights reserved.' : locale === 'zh' ? '版权所有' : 'Все права защищены.'}
        </div>
      </div>
    </footer>
  )
}
