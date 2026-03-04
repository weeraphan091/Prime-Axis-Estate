import { Suspense } from 'react'

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">กำลังโหลด...</div>}>{children}</Suspense>
}
