import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { AdminListingForm } from '../AdminListingForm'

export default async function AdminNewListingPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-6">ลงลิสใหม่</h1>
      <AdminListingForm />
    </div>
  )
}
