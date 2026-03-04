import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { Pencil, UserPlus } from 'lucide-react'
import { AgentsList } from './AgentsList'

export default async function AdminAgentsPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  let agents: Awaited<ReturnType<typeof prisma.agent.findMany>> = []
  try {
    agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' },
    })
  } catch {
    // DB error
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-stone-900">พนักงานขาย</h1>
        <Link
          href="/admin/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
        >
          <UserPlus className="w-4 h-4" />
          เพิ่มพนักงาน
        </Link>
      </div>
      <p className="text-sm text-stone-500 mb-4">
        จัดการโปรไฟล์พนักงาน — เลือกผู้รับผิดชอบได้ตอนลงลิสหรือแก้ไขรายการ
      </p>
      <AgentsList initialAgents={agents} />
    </div>
  )
}
