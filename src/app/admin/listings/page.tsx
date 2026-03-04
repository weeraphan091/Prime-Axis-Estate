import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { prismaToProperty } from '@/lib/property-db'
import { propertyTypeLabels, listingTypeLabels } from '@/data/properties'
import type { Property } from '@/types/property'
import { Pencil, Trash2 } from 'lucide-react'
import { AdminDeleteButton } from './AdminDeleteButton'

function formatPrice(price: number) {
  return new Intl.NumberFormat('th-TH').format(price)
}

export default async function AdminListingsPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  let properties: Property[] = []
  let dbError = false
  try {
    const list = await prisma.property.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    properties = list.map(prismaToProperty)
  } catch (e) {
    console.error('[Admin listings] DB error:', e)
    dbError = true
  }

  if (dbError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-900">
        <h2 className="font-semibold text-lg mb-2">โหลดฐานข้อมูลไม่ได้</h2>
        <p className="text-sm mb-4">
          บน Vercel ใช้ SQLite ไม่ได้ ต้องใช้ PostgreSQL แทน — ไปที่ Vercel Postgres หรือ Supabase สร้างฐานข้อมูล แล้วตั้งค่า <strong>DATABASE_URL</strong> ใน Environment Variables แล้วเปลี่ยน prisma/schema.prisma เป็น provider = &quot;postgresql&quot;
        </p>
        <p className="text-sm text-amber-700">หรือรันเว็บในเครื่อง (npm run dev) จะใช้ SQLite ได้ตามปกติ</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-stone-900">จัดการรายการ</h1>
        <Link
          href="/admin/listings/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
        >
          + ลงลิสใหม่
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left p-3 font-semibold text-stone-700">หัวข้อ</th>
                <th className="text-left p-3 font-semibold text-stone-700">ประเภท</th>
                <th className="text-left p-3 font-semibold text-stone-700">ราคา</th>
                <th className="text-left p-3 font-semibold text-stone-700">ทำเล</th>
                <th className="text-left p-3 font-semibold text-stone-700">อัปเดต</th>
                <th className="text-right p-3 font-semibold text-stone-700">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-3">
                    <Link href={`/admin/listings/${p.id}/edit`} className="font-medium text-stone-900 hover:text-primary-600 line-clamp-2">
                      {p.title}
                    </Link>
                  </td>
                  <td className="p-3">{listingTypeLabels[p.listingType]} · {propertyTypeLabels[p.propertyType]}</td>
                  <td className="p-3">{formatPrice(p.price)}{p.priceLabel ? ` ${p.priceLabel}` : ''}</td>
                  <td className="p-3">{p.location}</td>
                  <td className="p-3 text-stone-500">{p.createdAt}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/listings/${p.id}/edit`}
                        className="p-2 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-800"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminDeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {properties.length === 0 && (
          <div className="p-12 text-center text-stone-500">
            ยังไม่มีรายการ — <Link href="/admin/listings/new" className="text-primary-600 hover:underline">ลงลิสแรก</Link>
          </div>
        )}
      </div>
    </div>
  )
}
