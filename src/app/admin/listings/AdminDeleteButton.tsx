'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function AdminDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`ลบรายการ "${title}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('ลบไม่สำเร็จ')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
      title="ลบ"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
