'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Home, Search, FilePlus, Phone, Heart, GitCompare } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const navKeys = [
  { path: '', key: 'nav.home', icon: Home },
  { path: 'listings', key: 'nav.search', icon: Search },
  { path: 'list-your-property', key: 'nav.listProperty', icon: FilePlus },
  { path: 'contact', key: 'nav.contact', icon: Phone },
] as const

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { favoriteIds, compareIds } = useFavorites()
  const { user, logout } = useAuth()
  const { locale, t } = useLocale()
  const base = `/${locale}`
  const navItems = navKeys.map(({ path, key, icon }) => ({
    href: path ? `${base}/${path}` : base,
    label: t(key),
    icon,
  }))
  const isActive = (href: string) => pathname === href || (href !== base && pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: ภาษา + สกุลเงิน + ล็อกอิน/สมาชิก */}
        <div className="hidden md:flex items-center justify-end gap-4 py-2 text-sm text-stone-500 border-b border-stone-100">
          <LanguageSwitcher />
          <span className="font-medium text-stone-700">THB ฿</span>
          {user ? (
            <>
              <Link href={`${base}/my-listings`} className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                {t('nav.myListings')}
              </Link>
              <span className="text-stone-600">{user.name || user.email}</span>
              <button type="button" onClick={() => logout()} className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href={`${base}/login`} className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                {t('nav.login')}
              </Link>
              <span className="text-stone-300">|</span>
              <Link href={`${base}/register`} className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center justify-between h-14 lg:h-16">
          <Link href={base} className="flex items-center gap-2 hover:opacity-90 transition">
            <Image src="/logo.png" alt="Pattaya Estate Hub" width={44} height={44} className="h-10 w-10 object-contain" />
            <span className="font-display text-lg lg:text-xl text-stone-800 hidden sm:inline">
              Pattaya Estate <span className="text-primary-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href={`${base}/favorites`}
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-red-500 transition"
              title={t('nav.favorites')}
            >
              <Heart className="w-5 h-5" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Link
              href={`${base}/compare`}
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-primary-600 transition"
              title={t('nav.compare')}
            >
              <GitCompare className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Link>
            <Link
              href={`${base}/list-your-property`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-coral text-white rounded-lg text-sm font-semibold hover:bg-accent-coral/90 transition shadow-sm"
            >
              <FilePlus className="w-4 h-4" />
              {t('nav.listProperty')}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="mb-3 pb-3 border-b border-stone-100">
              <div className="text-xs font-medium text-stone-500 mb-2 px-4">ภาษา / Language</div>
              <div className="px-2">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 text-sm">
              {user ? (
                <>
                  <Link
                    href={`${base}/my-listings`}
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    {t('nav.myListings')}
                  </Link>
                  <span className="text-stone-600 py-2 px-3">{user.name || user.email}</span>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`${base}/login`}
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    {t('nav.login')}
                  </Link>
                  <span className="text-stone-300">|</span>
                  <Link
                    href={`${base}/register`}
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                    isActive(href) ? 'bg-primary-50 text-primary-700' : 'text-stone-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <Link
                href={`${base}/favorites`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-stone-700"
              >
                <Heart className="w-4 h-4" />
                {t('nav.favorites')} {favoriteIds.length > 0 && `(${favoriteIds.length})`}
              </Link>
              <Link
                href={`${base}/compare`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-stone-700"
              >
                <GitCompare className="w-4 h-4" />
                {t('nav.compare')} {compareIds.length > 0 && `(${compareIds.length})`}
              </Link>
              <Link
                href={`${base}/list-your-property`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 mt-2 bg-accent-coral text-white rounded-lg font-semibold"
              >
                <FilePlus className="w-4 h-4" />
                {t('nav.listProperty')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
