'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function AdminBlogDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    if (!confirm(`ลบบทความ "${title}"?`)) return
    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    router.refresh()
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
      title="ลบ"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
