import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/config/i18n'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    const locale = request.cookies.get(LOCALE_COOKIE)?.value
    const preferred = locale && isValidLocale(locale) ? locale : defaultLocale
    return NextResponse.redirect(new URL(`/${preferred}`, request.url))
  }

  const frontPaths = ['listings', 'list-your-property', 'contact', 'login', 'register', 'terms', 'privacy', 'favorites', 'compare', 'how-to-list', 'my-listings', 'blog']
  const firstSeg = pathname.slice(1).split('/')[0]
  if (frontPaths.includes(firstSeg)) {
    const locale = request.cookies.get(LOCALE_COOKIE)?.value
    const preferred = locale && isValidLocale(locale) ? locale : defaultLocale
    return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url))
  }

  const seg = pathname.slice(1).split('/')[0]
  if (isValidLocale(seg)) {
    const res = NextResponse.next()
    res.cookies.set(LOCALE_COOKIE, seg, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:ico|png|jpg|jpeg|gif|webp)$).*)'],
}
