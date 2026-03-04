import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LeadsList } from './LeadsList'

const statusLabels: Record<string, string> = {
  new: 'ใหม่',
  contacted: 'ติดต่อแล้ว',
  viewing_scheduled: 'นัดชมแล้ว',
  closed: 'ปิดการขาย',
}

type Props = { searchParams: Promise<{ propertyId?: string }> }

export default async function AdminLeadsPage({ searchParams }: Props) {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')
  const { propertyId } = await searchParams

  type LeadWithAgent = Awaited<ReturnType<typeof prisma.lead.findMany>>[0] & { agent: { id: string; name: string } | null }
  let leads: LeadWithAgent[] = []
  let agents: { id: string; name: string }[] = []
  let propertyTitle: string | null = null
  try {
    const [leadsRes, agentsRes, prop] = await Promise.all([
      prisma.lead.findMany({
        where: propertyId ? { propertyId } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { agent: { select: { id: true, name: true } } },
      }),
      prisma.agent.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      propertyId ? prisma.property.findUnique({ where: { id: propertyId }, select: { title: true } }) : null,
    ])
    leads = leadsRes as LeadWithAgent[]
    agents = agentsRes
    propertyTitle = prop?.title ?? null
  } catch {
    // DB error
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-stone-900">ลีด</h1>
          {propertyId && propertyTitle && (
            <p className="text-sm text-stone-500 mt-1">
              กรองตามรายการ: <strong className="text-stone-700">{propertyTitle}</strong>
              <Link href="/admin/leads" className="ml-2 text-primary-600 hover:underline">ล้างตัวกรอง</Link>
            </p>
          )}
        </div>
        <a
          href="/api/export/leads"
          className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
        >
          Export Excel
        </a>
      </div>
      <p className="text-sm text-stone-500 mb-4">
        ลูกค้าที่กด &quot;สนใจทรัพย์นี้&quot; — อัปเดตสถานะและผูกกับพนักงานรับผิดชอบ
      </p>
      <LeadsList initialLeads={leads} agents={agents} statusLabels={statusLabels} />
    </div>
  )
}
