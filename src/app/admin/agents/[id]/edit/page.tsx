import { redirect, notFound } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { AgentForm } from '../../AgentForm'

export default async function AdminEditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')
  const { id } = await params
  let agent: Awaited<ReturnType<typeof prisma.agent.findUnique>>
  try {
    agent = await prisma.agent.findUnique({ where: { id } })
  } catch {
    redirect('/admin/agents')
  }
  if (!agent) notFound()

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">แก้ไขพนักงานขาย</h1>
      <AgentForm initial={agent} />
    </div>
  )
}
