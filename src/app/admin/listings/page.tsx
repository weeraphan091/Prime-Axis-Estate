import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { prismaToProperty } from '@/lib/property-db'
import { propertyTypeLabels, listingTypeLabels } from '@/data/properties'
import type { Property } from '@/types/property'
import { Pencil, Trash2, Eye, MessageCircle } from 'lucide-react'
import { AdminDeleteButton } from './AdminDeleteButton'

function formatPrice(price: number) {
  return new Intl.NumberFormat('th-TH').format(price)
}

export default async function AdminListingsPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  let properties: (Property & { agentName?: string; viewCount?: number; leadCount?: number })[] = []
  let dbError: string | null = null
  try {
    const [list, leadCounts] = await Promise.all([
      prisma.property.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { agent: { select: { name: true } } },
      }),
      prisma.lead.groupBy({
        by: ['propertyId'],
        _count: { id: true },
      }),
    ])
    const leadMap = new Map(leadCounts.map((l) => [l.propertyId, l._count.id]))
    properties = list.map((p) => ({
      ...prismaToProperty(p),
      agentName: p.agent?.name,
      viewCount: p.viewCount ?? 0,
      leadCount: leadMap.get(p.id) ?? 0,
    }))
  } catch (e) {
    const err = e as Error & { code?: string }
    console.error('[Admin listings] DB error:', err)
    const msg = err?.message ?? String(e)
    const isConnectionError =
      !process.env.DATABASE_URL?.trim() ||
      msg.includes('DATABASE_URL') ||
      msg.includes('Environment variable') ||
      err?.code === 'P1001' ||
      msg.includes('connect') ||
      msg.includes('Connection')
    dbError = isConnectionError ? 'connection' : msg
  }

  if (dbError) {
    const isConnection = dbError === 'connection'
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-900 max-w-2xl">
        <h2 className="font-semibold text-lg mb-2">โหลดฐานข้อมูลไม่ได้</h2>
        {isConnection ? (
          <>
            <p className="text-sm mb-2">
              ตั้งค่า <strong>DATABASE_URL</strong> ใน Vercel (หรือในไฟล์ <code className="bg-amber-100 px-1 rounded">.env</code> เมื่อรันในเครื่อง)
            </p>
            <p className="text-sm mb-3 font-medium">Vercel:</p>
            <ul className="text-sm list-disc list-inside space-y-1 mb-3">
              <li>Settings → Environment Variables → เพิ่ม <strong>DATABASE_URL</strong></li>
              <li>ค่า = connection string ของ PostgreSQL</li>
              <li>จากนั้น Redeploy</li>
            </ul>
            <p className="text-sm mb-2 font-medium">Supabase (แนะนำสำหรับ Vercel):</p>
            <ul className="text-sm list-disc list-inside space-y-1 mb-4">
              <li>Supabase Dashboard → Project Settings → Database</li>
              <li>ใช้ <strong>Connection pooling</strong> (พอร์ต <strong>6543</strong>) — อย่าใช้ Direct connection (5432) บน Vercel</li>
              <li>ถ้าเป็น Transaction mode ให้ต่อท้าย URL ด้วย <code className="bg-amber-100 px-1 rounded">?pgbouncer=true</code></li>
              <li>คัดลอก URI ไปใส่ใน DATABASE_URL</li>
            </ul>
          </>
        ) : (
          <p className="text-sm mb-4">
            ข้อผิดพลาด: <code className="bg-amber-100 px-1 rounded break-all">{dbError.slice(0, 200)}</code>
          </p>
        )}
        <p className="text-sm text-amber-700">
          รันในเครื่อง: ใส่ DATABASE_URL ใน <code className="bg-amber-100 px-1 rounded">.env</code> แล้วรัน <code className="bg-amber-100 px-1 rounded">npm run dev</code>
        </p>
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
                <th className="text-left p-3 font-semibold text-stone-700">สถานะ</th>
                <th className="text-center p-3 font-semibold text-stone-700" title="จำนวนการดู">ดู</th>
                <th className="text-center p-3 font-semibold text-stone-700" title="คนกดสนใจ">สนใจ</th>
                <th className="text-left p-3 font-semibold text-stone-700">พนักงาน</th>
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
                  <td className="p-3">
                    <span className={p.status === 'published' ? 'text-green-600' : p.status === 'draft' ? 'text-amber-600' : 'text-stone-400'}>
                      {p.status === 'published' ? 'เผยแพร่' : p.status === 'draft' ? 'แบบร่าง' : 'ขาย/เช่าแล้ว'}
                    </span>
                  </td>
                  <td className="p-3 text-center text-stone-600" title="จำนวนครั้งที่เปิดดู">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      {p.viewCount ?? 0}
                    </span>
                  </td>
                  <td className="p-3 text-center text-stone-600" title="จำนวนคนกดสนใจทรัพย์">
                    {p.leadCount ? (
                      <Link href={`/admin/leads?propertyId=${p.id}`} className="inline-flex items-center gap-1 text-primary-600 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {p.leadCount}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-stone-300" />
                        0
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-stone-500">{p.agentName ?? '—'}</td>
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
