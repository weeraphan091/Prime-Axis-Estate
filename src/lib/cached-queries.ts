import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export const getPropertyById = cache(async (id: string) => {
  return prisma.property.findUnique({ where: { id } })
})

export const getBlogBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findUnique({ where: { slug } })
})
