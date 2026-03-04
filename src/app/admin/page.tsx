import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { List, PlusCircle, Phone, Users, MessageSquare, Download } from 'lucide-react'

export default async function AdminHomePage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  let totalListings = 0
  let publishedListings = 0
  let totalLeads = 0
  let newLeadsThisWeek = 0
  let totalAgents = 0
  try {
    const [listings, leads, agents] = await Promise.all([
      prisma.property.findMany({ select: { id: true, status: true, createdAt: true } }),
      prisma.lead.findMany({ select: { id: true, createdAt: true } }),
      prisma.agent.count(),
    ])
    totalListings = listings.length
    publishedListings = listings.filter((p) => p.status === 'published').length
    totalLeads = leads.length
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekAgoStr = oneWeekAgo.toISOString().slice(0, 19)
    newLeadsThisWeek = leads.filter((l) => l.createdAt >= weekAgoStr).length
    totalAgents = agents
  } catch {
    // DB error - show 0
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900">แดชบอร์ด</h1>
      <p className="mt-1 text-stone-600">ภาพรวมรายการ ลีด และพนักงานขาย</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
