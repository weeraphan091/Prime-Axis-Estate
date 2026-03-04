export type ListingType = 'sale' | 'rent'

export type PropertyType =
  | 'condo'
  | 'house'
  | 'villa'
  | 'apartment'
  | 'land'
  | 'commercial'

export interface Property {
  id: string
  title: string
  listingType: ListingType
  propertyType: PropertyType
  price: number
  priceLabel?: string // e.g. "ต่อเดือน" for rent
  location: string
  /** ลิงก์ Google Map (คัดลอกจาก Google Maps ใส่ได้เลย) */
  mapUrl?: string
  area: number // sqm
  bedrooms?: number
  bathrooms?: number
  images: string[]
  description: string
  features: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  /** Line ID เจ้าของทรัพย์ (เช่น @xxx) — ใช้ในแอดมิน */
  contactLine?: string
  /** เบอร์ WhatsApp เจ้าของทรัพย์ — ใช้ในแอดมิน */
  contactWhatsapp?: string
  isFeatured?: boolean
  isOwnerListing?: boolean
  /** draft | published | sold_rented */
  status?: string
  /** id ของพนักงานรับผิดชอบ */
  agentId?: string
  createdAt: string
}

export interface ListPropertyForm {
  listingType: ListingType
  propertyType: PropertyType
  title: string
  description: string
  price: number
  priceLabel?: string
  location: string
  area: number
  bedrooms?: number
  bathrooms?: number
  features: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  contactLine?: string
  contactWhatsapp?: string
  images?: File[] | string[]
}
