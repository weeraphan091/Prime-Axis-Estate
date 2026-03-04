'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  getFavorites,
  getCompareIds,
  toggleFavorite as toggleFav,
  toggleCompare as toggleComp,
} from '@/lib/favorites'

type FavoritesContextType = {
  favoriteIds: string[]
  compareIds: string[]
  toggleFavorite: (id: string) => void
  toggleCompare: (id: string) => boolean
  isFavorite: (id: string) => boolean
  isCompare: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    setFavoriteIds(getFavorites())
    setCompareIds(getCompareIds())
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    toggleFav(id)
    setFavoriteIds(getFavorites())
  }, [])

  const toggleCompare = useCallback((id: string) => {
    const ok = toggleComp(id)
    setCompareIds(getCompareIds())
    return ok
  }, [])

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds])
  const isCompare = useCallback((id: string) => compareIds.includes(id), [compareIds])

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        compareIds,
        toggleFavorite,
        toggleCompare,
        isFavorite,
        isCompare,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
