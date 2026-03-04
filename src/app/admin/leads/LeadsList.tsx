'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '@prisma/client'

type LeadWithAgent = Lead & { agent?: { id: string; name: string } | null }

type Props = {
  initialLeads: LeadWithAgent[]
  agents: { id: string; name: string }[]
  statusLabels: Record<string, string>
}

export function LeadsList({ initialLeads, agents, statusLabels }: Props) {
  const router = useRouter()
  const [leads, setLeads] = useState(initialLeads)

  const updateLead = async (id: string, data: { status?: string; agentId?: string }) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)))
      router.refresh()
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
        ยังไม่มีลีด — เมื่อลูกค้ากด &quot;สนใจทรัพย์นี้&quot; และส่งฟอร์ม จะแสดงที่นี่
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left p-3 font-semibold text-stone-700">วันที่</th>
              <th className="text-left p-3 font-semibold text-stone-700">ทรัพย์</th>
              <th className="text-left p-3 font-semibold text-stone-700">ชื่อ</th>
              <th className="text-left p-3 font-semibold text-stone-700">โทร</th>
              <th className="text-left p-3 font-semibold text-stone-700">สถานะ</th>
              <th className="text-left p-3 font-semibold text-stone-700">พนักงาน</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="p-3 text-stone-500 whitespace-nowrap">
                  {lead.createdAt.slice(0, 10)}
                </td>
                <td className="p-3 max-w-[200px] truncate" title={lead.propertyTitle ?? ''}>
                  {lead.propertyTitle ?? lead.propertyId}
                </td>
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                    className="border border-stone-300 rounded px-2 py-1 text-xs"
                  >
                    {Object.entries(statusLabels).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={lead.agentId ?? ''}
                    onChange={(e) => updateLead(lead.id, { agentId: e.target.value || undefined })}
                    className="border border-stone-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="">—</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
