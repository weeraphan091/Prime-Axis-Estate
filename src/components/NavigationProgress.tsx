'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * แถบ progress ด้านบน — แสดงทันทีเมื่อคลิกลิงก์ในไซต์ แล้วหายเมื่อโหลดหน้าใหม่เสร็จ
 * ทำให้รู้สึกว่า "คลิกแล้วมี reaction ทันที" ลดความรู้สึกหน่วง
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest('a[href^="/"]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.href.startsWith('mailto:') || a.href.startsWith('tel:')) return
      const url = new URL(a.href, window.location.origin)
      if (url.pathname === pathname) return
      setShow(true)
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  if (!show) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-primary-500 animate-navigation-progress"
      role="presentation"
      aria-hidden
    />
  )
}
