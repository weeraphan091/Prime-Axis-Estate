import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { ContactSettingsForm } from './ContactSettingsForm'

export default async function AdminSettingsPage() {
  const ok = await hasAdminSession()
  if (!ok) redirect('/admin/login')

  const row = await prisma.contactSettings.findUnique({
    where: { id: 'default' },
  })

  const initial = row
    ? {
        name: row.name,
        phone: row.phone,
        email: row.email,
        address: row.address,
        line: row.line,
        whatsapp: row.whatsapp,
        wechat: row.wechat,
        telegram: row.telegram,
      }
    : {
        name: 'PRIME AXIS ESTATE',
        phone: '038-xxx-xxx',
        email: 'contact@primeaxisestate.com',
        address: 'พัทยา ชลบุรี',
        line: '@187umoiw',
        whatsapp: '66812345678',
        wechat: 'pattayaproperty',
        telegram: 'pattayaproperty',
      }

  return (
    <div>
      <h1 className="font-display text-2xl text-stone-900 mb-2">ตั้งค่าเว็บ</h1>
      <p className="text-stone-600 text-sm mb-8">
        แก้ไขข้อมูลช่องทางติดต่อ — เปลี่ยนจุดเดียว จะอัปเดตทุกที่บนเว็บ (Header, Footer, หน้ารายละเอียด, ฟอร์มสนใจทรัพย์)
      </p>
      <ContactSettingsForm initial={initial} />
    </div>
  )
}
