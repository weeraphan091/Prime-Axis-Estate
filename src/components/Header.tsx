'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Home, Search, FilePlus, Phone, Heart, GitCompare } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/', label: 'หน้าแรก', icon: Home },
  { href: '/listings', label: 'ค้นหาทรัพย์', icon: Search },
  { href: '/list-your-property', label: 'ฝากขาย/เช่า', icon: FilePlus },
  { href: '/contact', label: 'ติดต่อเรา', icon: Phone },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { favoriteIds, compareIds } = useFavorites()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: สกุลเงิน + ล็อกอิน/สมาชิก */}
        <div className="hidden md:flex items-center justify-end gap-4 py-2 text-sm text-stone-500 border-b border-stone-100">
          <span className="font-medium text-stone-700">THB ฿</span>
          {user ? (
            <>
              <span className="text-stone-600">{user.name || user.email}</span>
              <button type="button" onClick={() => logout()} className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                เข้าสู่ระบบ
              </Link>
              <span className="text-stone-300">|</span>
              <Link href="/register" className="hover:text-primary-600 py-1 px-2 -m-2 rounded">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <Image src="/logo.png" alt="PRIME AXIS ESTATE" width={44} height={44} className="h-10 w-10 object-contain" />
            <span className="font-display text-lg lg:text-xl text-stone-800 hidden sm:inline">
              PRIME AXIS <span className="text-primary-600">ESTATE</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === href
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
              href="/favorites"
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-red-500 transition"
              title="รายการโปรด"
            >
              <Heart className="w-5 h-5" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-primary-600 transition"
              title="เปรียบเทียบ"
            >
              <GitCompare className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Link>
            <Link
              href="/list-your-property"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-coral text-white rounded-lg text-sm font-semibold hover:bg-accent-coral/90 transition shadow-sm"
            >
              <FilePlus className="w-4 h-4" />
              ฝากขาย/เช่า
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
            <div className="flex items-center gap-2 mb-3 text-sm">
              {user ? (
                <>
                  <span className="text-stone-600 py-2 px-3">{user.name || user.email}</span>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <span className="text-stone-300">|</span>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 -mx-1"
                  >
                    สมัครสมาชิก
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
                    pathname === href ? 'bg-primary-50 text-primary-700' : 'text-stone-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <Link
                href="/favorites"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-stone-700"
              >
                <Heart className="w-4 h-4" />
                รายการโปรด {favoriteIds.length > 0 && `(${favoriteIds.length})`}
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-stone-700"
              >
                <GitCompare className="w-4 h-4" />
                เปรียบเทียบ {compareIds.length > 0 && `(${compareIds.length})`}
              </Link>
              <Link
                href="/list-your-property"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 mt-2 bg-accent-coral text-white rounded-lg font-semibold"
              >
                <FilePlus className="w-4 h-4" />
                ฝากขาย/เช่า
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
