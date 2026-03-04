'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import type { Agent } from '@prisma/client'

type Props = { initialAgents: Agent[] }

export function AgentsList({ initialAgents }: Props) {
  if (initialAgents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
        ยังไม่มีพนักงาน — กด &quot;เพิ่มพนักงาน&quot; เพื่อเพิ่ม
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left p-3 font-semibold text-stone-700">ชื่อ</th>
              <th className="text-left p-3 font-semibold text-stone-700">โทร</th>
              <th className="text-left p-3 font-semibold text-stone-700">อีเมล</th>
              <th className="text-left p-3 font-semibold text-stone-700">Line</th>
              <th className="text-left p-3 font-semibold text-stone-700">สถานะ</th>
              <th className="text-right p-3 font-semibold text-stone-700">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {initialAgents.map((a) => (
              <tr key={a.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.phone}</td>
                <td className="p-3">{a.email}</td>
                <td className="p-3">{a.lineId ?? '—'}</td>
                <td className="p-3">
                  <span className={a.isActive ? 'text-green-600' : 'text-stone-400'}>
                    {a.isActive ? 'ใช้งาน' : 'ปิด'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/agents/${a.id}/edit`}
                    className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" /> แก้ไข
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
