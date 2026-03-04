import type { Property } from '@/types/property'
import type { Property as PrismaProperty } from '@prisma/client'

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function prismaToProperty(p: PrismaProperty): Property {
  return {
    id: p.id,
    title: p.title,
    projectName: p.projectName ?? undefined,
    listingType: p.listingType as Property['listingType'],
    propertyType: p.propertyType as Property['propertyType'],
    price: p.price,
    priceLabel: p.priceLabel ?? undefined,
    location: p.location,
    mapUrl: p.mapUrl ?? undefined,
    area: p.area,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    images: parseJsonArray(p.images),
    description: p.description,
    features: parseJsonArray(p.features),
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    contactLine: p.contactLine ?? undefined,
    contactWhatsapp: p.contactWhatsapp ?? undefined,
    isFeatured: p.isFeatured,
    isOwnerListing: p.isOwnerListing,
    status: p.status ?? 'published',
    agentId: p.agentId ?? undefined,
    rentOccupied: p.rentOccupied ?? false,
    rentLeaseStart: p.rentLeaseStart ?? undefined,
    rentLeaseEnd: p.rentLeaseEnd ?? undefined,
    floor: p.floor ?? undefined,
    roomNumber: p.roomNumber ?? undefined,
    floors: p.floors ?? undefined,
    viewCount: p.viewCount ?? 0,
    userId: p.userId ?? undefined,
    createdAt: p.createdAt,
  }
}

export function propertyToPrisma(p: Omit<Property, 'id'> & { id?: string }) {
  return {
    title: p.title,
    projectName: p.projectName ?? null,
    listingType: p.listingType,
    propertyType: p.propertyType,
    price: p.price,
    priceLabel: p.priceLabel ?? null,
    location: p.location,
    mapUrl: p.mapUrl ?? null,
    area: p.area,
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    images: JSON.stringify(Array.isArray(p.images) ? p.images : []),
    description: p.description,
    features: JSON.stringify(Array.isArray(p.features) ? p.features : []),
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    contactLine: p.contactLine ?? null,
    contactWhatsapp: p.contactWhatsapp ?? null,
    isFeatured: p.isFeatured ?? false,
    isOwnerListing: p.isOwnerListing ?? false,
    status: p.status ?? 'published',
    agentId: p.agentId ?? null,
    rentOccupied: p.rentOccupied ?? false,
    rentLeaseStart: p.rentLeaseStart ?? null,
    rentLeaseEnd: p.rentLeaseEnd ?? null,
    floor: p.floor ?? null,
    roomNumber: p.roomNumber ?? null,
    floors: p.floors ?? null,
    viewCount: p.viewCount ?? 0,
    userId: p.userId ?? null,
    createdAt: p.createdAt,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

/** onlyPublished: true = หน้าเว็บทั่วไป (เฉพาะ published), false = หลังบ้าน (ทุกสถานะ) */
export async function getPropertiesFromDb(onlyPublished = true): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const list = await prisma.property.findMany({
      where: onlyPublished ? { status: 'published' } : undefined,
      orderBy: { updatedAt: 'desc' },
    })
    return list.map(prismaToProperty)
  } catch {
    return []
  }
}
