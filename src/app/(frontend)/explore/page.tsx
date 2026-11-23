import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { SimulationExplorePage } from '@/components/SimVerse/DiscoveryHome'
import { getPublishedSimulations } from '@/utilities/getPublishedSimulations'

type Args = {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ExplorePage({ searchParams: searchParamsPromise }: Args) {
  const { category, q, sort: requestedSort } = await searchParamsPromise
  const sort = requestedSort === 'recent' ? 'recent' : 'popular'
  const payload = await getPayload({ config: configPromise })
  const categoriesResult = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
    },
  })

  const matchingCategories = category
    ? category
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) =>
          categoriesResult.docs.find(
            (item) =>
              item.slug.toLowerCase() === value.toLowerCase() ||
              item.title.toLowerCase() === value.toLowerCase(),
          ),
        )
    : []
  const categoryNotFound =
    category && matchingCategories.length > 0 && matchingCategories.every((item) => !item)

  const posts = categoryNotFound
    ? []
    : (
        await getPublishedSimulations({
          categoryIDs: matchingCategories.flatMap((item) => (item ? [item.id] : [])),
          limit: 100,
          query: q?.trim() || undefined,
          sort,
        })
      ).docs

  return (
    <SimulationExplorePage
      categories={categoriesResult.docs}
      category={category}
      posts={posts}
      query={q?.trim() || undefined}
      sort={sort}
    />
  )
}

export const metadata: Metadata = {
  title: 'Explore Simulations | SimVerse',
  description: 'Search and discover interactive educational simulations.',
}
