import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { SimulationDiscoveryHome } from '@/components/SimVerse/DiscoveryHome'
import { getPublishedSimulations } from '@/utilities/getPublishedSimulations'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const [trending, recent, categories] = await Promise.all([
    getPublishedSimulations({ limit: 1000, sort: 'popular' }),
    getPublishedSimulations({ limit: 1000, sort: 'recent' }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
        slug: true,
      },
    }),
  ])

  return (
    <SimulationDiscoveryHome
      categories={categories.docs}
      recentPosts={recent.docs}
      trendingPosts={trending.docs}
    />
  )
}

export const metadata: Metadata = {
  title: 'SimVerse | Interactive Simulations',
  description: 'Explore interactive educational simulations across science and technology.',
}
