import type { Property } from '@/types/property'
import type { Property as PrismaProperty } from '@prisma/client'

export function prismaToProperty(p: PrismaProperty): Property {
  return {
    id: p.id,
    title: p.title,
    listingType: p.listingType as Property['listingType'],
    propertyType: p.propertyType as Property['propertyType'],
    price: p.price,
    priceLabel: p.priceLabel ?? undefined,
    location: p.location,
    mapUrl: p.mapUrl ?? undefined,
    area: p.area,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    images: JSON.parse(p.images) as string[],
    description: p.description,
    features: JSON.parse(p.features) as string[],
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    isFeatured: p.isFeatured,
    isOwnerListing: p.isOwnerListing,
    createdAt: p.createdAt,
  }
}

export function propertyToPrisma(p: Omit<Property, 'id'> & { id?: string }) {
  return {
    title: p.title,
    listingType: p.listingType,
    propertyType: p.propertyType,
    price: p.price,
    priceLabel: p.priceLabel ?? null,
    location: p.location,
    mapUrl: p.mapUrl ?? null,
    area: p.area,
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    images: JSON.stringify(p.images || []),
    description: p.description,
    features: JSON.stringify(p.features || []),
    contactName: p.contactName,
    contactPhone: p.contactPhone,
    contactEmail: p.contactEmail,
    isFeatured: p.isFeatured ?? false,
    isOwnerListing: p.isOwnerListing ?? false,
    createdAt: p.createdAt,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

export async function getPropertiesFromDb(): Promise<Property[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const list = await prisma.property.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return list.map(prismaToProperty)
  } catch {
    return []
  }
}
