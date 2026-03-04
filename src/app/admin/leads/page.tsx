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

export default async function AdminLeadsPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  type LeadWithAgent = Awaited<ReturnType<typeof prisma.lead.findMany>>[0] & { agent: { id: string; name: string } | null }
  let leads: LeadWithAgent[] = []
  let agents: { id: string; name: string }[] = []
  try {
    const [leadsRes, agentsRes] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        include: { agent: { select: { id: true, name: true } } },
      }),
      prisma.agent.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    ])
    leads = leadsRes as LeadWithAgent[]
    agents = agentsRes
  } catch {
    // DB error
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-stone-900">ลีด</h1>
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
