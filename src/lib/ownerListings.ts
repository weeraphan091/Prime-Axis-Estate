import type { Property } from '@/types/property'

const STORAGE_KEY = 'pattaya_owner_listings'

export function getOwnerListings(): Property[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as Property[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveOwnerListing(property: Property): void {
  const list = getOwnerListings()
  list.unshift(property)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getPropertyById(
  id: string,
  staticList: Property[]
): Property | undefined {
  const fromStatic = staticList.find((p) => p.id === id)
  if (fromStatic) return fromStatic
  return getOwnerListings().find((p) => p.id === id)
}
