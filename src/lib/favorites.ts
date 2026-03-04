const FAV_KEY = 'pattaya_favorites'
const COMPARE_KEY = 'pattaya_compare'
const MAX_COMPARE = 4

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FAV_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function toggleFavorite(id: string): void {
  const list = getFavorites()
  const idx = list.indexOf(id)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(id)
  localStorage.setItem(FAV_KEY, JSON.stringify(list))
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}

export function getCompareIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(COMPARE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function toggleCompare(id: string): boolean {
  const list = getCompareIds()
  const idx = list.indexOf(id)
  if (idx >= 0) {
    list.splice(idx, 1)
  } else if (list.length < MAX_COMPARE) {
    list.push(id)
  } else {
    return false
  }
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list))
  return true
}

export function isCompare(id: string): boolean {
  return getCompareIds().includes(id)
}

export function removeCompare(id: string): void {
  const list = getCompareIds().filter((x) => x !== id)
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list))
}
