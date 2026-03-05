import { redirect, notFound } from 'next/navigation'
import { Suspense } from 'react'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { prismaToProperty } from '@/lib/property-db'
import { AdminListingForm } from '../../AdminListingForm'

export default async function AdminEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')
  const { id } = await params
  let p: Awaited<ReturnType<typeof prisma.property.findUnique>>
  try {
    p = await prisma.property.findUnique({ where: { id } })
  } catch {
    redirect('/admin/listings')
  }
  if (!p) notFound()
  const initial = prismaToProperty(p)

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">แก้ไขรายการ</h1>
      <Suspense fallback={<div className="animate-pulse bg-stone-200 h-40 rounded-xl" />}>
        <AdminListingForm initial={initial} />
      </Suspense>
    </div>
  )
}
