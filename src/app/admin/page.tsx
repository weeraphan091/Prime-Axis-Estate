import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession, canManageAdminUsers } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { List, PlusCircle, Phone, Users, MessageSquare, Download, UserCheck, UserCog, Eye, TrendingUp } from 'lucide-react'

export default async function AdminHomePage() {
  if (!(await hasAdminSession())) redirect('/admin/login')
  const showAdminUsers = await canManageAdminUsers()

  let totalListings = 0
  let publishedListings = 0
  let totalLeads = 0
  let newLeadsThisWeek = 0
  let totalAgents = 0
  let totalMembers = 0
  let topByViews: { id: string; title: string; viewCount: number }[] = []
  let topByLeads: { id: string; title: string; leadCount: number }[] = []
  let dbSchemaError = false

  // query แต่ละส่วนแยกกัน — ถ้าตัวใดล้ม ตัวอื่นยังแสดงได้
  try {
    const listings = await prisma.property.findMany({ select: { id: true, status: true, createdAt: true } })
    totalListings = listings.length
    publishedListings = listings.filter((p) => p.status === 'published').length
  } catch (e) {
    const msg = (e as Error)?.message ?? ''
    if (msg.includes('does not exist') || msg.includes('column')) dbSchemaError = true
  }

  try {
    const leads = await prisma.lead.findMany({ select: { id: true, createdAt: true, propertyId: true } })
    totalLeads = leads.length
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekAgoStr = oneWeekAgo.toISOString().slice(0, 19)
    newLeadsThisWeek = leads.filter((l) => l.createdAt >= weekAgoStr).length
  } catch { /* Lead ตารางอาจยังไม่มี */ }

  try { totalAgents = await prisma.agent.count() } catch { /* */ }
  try { totalMembers = await prisma.user.count() } catch { /* */ }

  try {
    const allProps = await prisma.property.findMany({
      where: { status: 'published' },
      select: { id: true, title: true, viewCount: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    })
    topByViews = allProps.map((p) => ({ id: p.id, title: p.title, viewCount: p.viewCount ?? 0 }))
  } catch { /* */ }

  try {
    const leadCounts = await prisma.lead.groupBy({
      by: ['propertyId'],
      _count: { id: true },
    })
    const sortedLeads = [...leadCounts].sort((a, b) => b._count.id - a._count.id).slice(0, 5)
    const topLeadIds = sortedLeads.map((l) => l.propertyId)
    if (topLeadIds.length > 0) {
      const props = await prisma.property.findMany({
        where: { id: { in: topLeadIds } },
        select: { id: true, title: true },
      })
      const byId = new Map(props.map((p) => [p.id, p.title]))
      topByLeads = sortedLeads.map((l) => ({
        id: l.propertyId,
        title: byId.get(l.propertyId) ?? '(ลบแล้ว)',
        leadCount: l._count.id,
      }))
    }
  } catch { /* */ }

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900">แดชบอร์ด</h1>
      <p className="mt-1 text-stone-600">ภาพรวมรายการ ลีด และพนักงานขาย</p>

      {dbSchemaError && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
          <p className="font-semibold mb-1">ฐานข้อมูลยังไม่ตรงกับโค้ดล่าสุด</p>
          <p>
            รันคำสั่ง <code className="bg-amber-100 px-1 rounded">npx prisma db push</code> ในเครื่อง
            (ใช้ Direct connection พอร์ต 5432) หรือดับเบิลคลิก{' '}
            <code className="bg-amber-100 px-1 rounded">รัน-prisma-db-push.bat</code> แล้ว Redeploy
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">รายการทั้งหมด</p>
          <p className="text-2xl font-bold text-stone-900">{totalListings}</p>
          <p className="text-xs text-stone-400">เผยแพร่ {publishedListings} รายการ</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">ลีดทั้งหมด</p>
          <p className="text-2xl font-bold text-stone-900">{totalLeads}</p>
          <p className="text-xs text-stone-400">สัปดาห์นี้ +{newLeadsThisWeek}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">พนักงานขาย</p>
          <p className="text-2xl font-bold text-stone-900">{totalAgents}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">สมาชิก</p>
          <p className="text-2xl font-bold text-stone-900">{totalMembers}</p>
        </div>
      </div>

      {/* ความเคลื่อนไหวแต่ละทรัพย์ */}
      <div className="mt-8">
        <h2 className="font-display text-lg text-stone-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          ความเคลื่อนไหวรายการ
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2 text-sm font-semibold text-stone-700">
              <Eye className="w-4 h-4 text-stone-500" />
              รายการที่ถูกดูมากที่สุด
            </div>
            <ul className="divide-y divide-stone-100">
              {topByViews.length === 0 ? (
                <li className="px-4 py-6 text-center text-stone-500 text-sm">ยังไม่มีข้อมูล</li>
              ) : (
                topByViews.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/listings/${p.id}/edit`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 text-sm"
                    >
                      <span className="text-stone-800 line-clamp-1 pr-2">{p.title}</span>
                      <span className="text-stone-500 shrink-0">{p.viewCount} ครั้ง</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <div className="px-4 py-2 border-t border-stone-100 text-right">
              <Link href="/admin/listings" className="text-xs text-primary-600 hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2 text-sm font-semibold text-stone-700">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              รายการที่มีคนสนใจมากที่สุด
            </div>
            <ul className="divide-y divide-stone-100">
              {topByLeads.length === 0 ? (
                <li className="px-4 py-6 text-center text-stone-500 text-sm">ยังไม่มีลีด</li>
              ) : (
                topByLeads.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/leads?propertyId=${p.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 text-sm"
                    >
                      <span className="text-stone-800 line-clamp-1 pr-2">{p.title}</span>
                      <span className="text-primary-600 shrink-0 font-medium">{p.leadCount} คน</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <div className="px-4 py-2 border-t border-stone-100 text-right">
              <Link href="/admin/leads" className="text-xs text-primary-600 hover:underline">
                ดูลีดทั้งหมด →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/listings"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <List className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">จัดการรายการ</h2>
            <p className="text-sm text-stone-500">ดู แก้ไข ลบ รายการทั้งหมด</p>
          </div>
        </Link>
        <Link
          href="/admin/listings/new"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">ลงลิสใหม่</h2>
            <p className="text-sm text-stone-500">เพิ่มรายการขาย/เช่าใหม่</p>
          </div>
        </Link>
        <Link
          href="/admin/leads"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">ลีด</h2>
            <p className="text-sm text-stone-500">ดู/อัปเดตสถานะลูกค้าสนใจทรัพย์</p>
          </div>
        </Link>
        <Link
          href="/admin/agents"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">พนักงานขาย</h2>
            <p className="text-sm text-stone-500">จัดการโปรไฟล์พนักงาน</p>
          </div>
        </Link>
        <Link
          href="/admin/members"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">สมาชิก</h2>
            <p className="text-sm text-stone-500">รายการลูกค้าที่สมัครสมาชิก</p>
          </div>
        </Link>
        {showAdminUsers && (
          <Link
            href="/admin/settings"
            className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">ข้อมูลติดต่อ</h2>
              <p className="text-sm text-stone-500">แก้เบอร์/Line/อีเมล — เปลี่ยนจุดเดียวทั้งเว็บ</p>
            </div>
          </Link>
        )}
        {showAdminUsers && (
          <Link
            href="/admin/users"
            className="flex items-center gap-4 p-6 bg-white rounded-xl border border-stone-200 hover:border-primary-300 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">บัญชีผู้ใช้หลังบ้าน</h2>
              <p className="text-sm text-stone-500">สร้างบัญชีพนักงาน เลือกสิทธิ์ admin / staff</p>
            </div>
          </Link>
        )}
        <div className="flex flex-col gap-2 p-6 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
              <Download className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Export Excel</h2>
              <p className="text-sm text-stone-500">ดาวน์โหลด CSV เปิดใน Excel ได้</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <a
              href="/api/export/listings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              รายการทรัพย์
            </a>
            <span className="text-stone-300">|</span>
            <a
              href="/api/export/leads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              ลีด
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
