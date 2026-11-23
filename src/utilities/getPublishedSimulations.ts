import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'

type Options = {
  categoryIDs?: number[]
  excludePostID?: number
  limit?: number
  query?: string
  sort?: 'popular' | 'recent'
}

export const getPublishedSimulations = async ({
  categoryIDs,
  excludePostID,
  limit = 100,
  query,
  sort = 'popular',
}: Options = {}) => {
  const payload = await getPayload({ config: configPromise })
  const conditions: Where[] = [
    { _status: { equals: 'published' as const } },
    { simulationHtmlPath: { exists: true } },
    { simulationHtmlPath: { not_equals: '' } },
    ...(excludePostID !== undefined ? [{ id: { not_equals: excludePostID } }] : []),
    ...(categoryIDs?.length ? [{ categories: { in: categoryIDs } }] : []),
    ...(query
      ? [
          {
            or: [
              { title: { like: query } },
              { slug: { like: query } },
              { 'meta.title': { like: query } },
              { 'meta.description': { like: query } },
            ],
          },
        ]
      : []),
  ]

  return payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    pagination: false,
    select: {
      id: true,
      title: true,
      slug: true,
      simulationHtmlPath: true,
      heroImage: true,
      categories: true,
      meta: true,
      publishedAt: true,
      createdAt: true,
    },
    sort: sort === 'recent' ? '-createdAt' : '-publishedAt',
    where: {
      and: conditions,
    },
  })
}
