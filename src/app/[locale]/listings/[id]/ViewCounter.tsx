'use client'

import { useEffect } from 'react'

export function ViewCounter({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/api/properties/${id}/view`, { method: 'POST' }).catch(() => {})
  }, [id])
  return null
}
