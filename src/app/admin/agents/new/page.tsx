import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { AgentForm } from '../AgentForm'

export default async function AdminNewAgentPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">เพิ่มพนักงานขาย</h1>
      <AgentForm />
    </div>
  )
}
