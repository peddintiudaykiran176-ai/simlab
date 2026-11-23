import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import Link from 'next/link'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { SimulationThumbnail, type SimulationCardPost } from '@/components/SimVerse/SimulationCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { SimulationViewer } from '@/components/SimulationFrame'
import { generateMeta } from '@/utilities/generateMeta'
import { getPublishedSimulations } from '@/utilities/getPublishedSimulations'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const simulationEnabled = Boolean(post.simulationHtmlPath)
  const relatedArticles =
    post.relatedPosts?.filter(
      (related): related is Post =>
        Boolean(related) && typeof related === 'object' && !related.simulationHtmlPath,
    ) || []

  const selectedRelatedSimulations =
    post.relatedPosts?.filter(
      (related): related is Post =>
        Boolean(related) && typeof related === 'object' && Boolean(related.simulationHtmlPath),
    ) || []

  let relatedSimulations: SimulationCardPost[] = []

  if (simulationEnabled) {
    if (selectedRelatedSimulations.length > 0) {
      relatedSimulations = selectedRelatedSimulations.slice(0, 5)
    } else {
      const categoryIDs =
        post.categories?.map((category) =>
          typeof category === 'object' ? category.id : category,
        ) || []
      const relatedByCategory = await getPublishedSimulations({
        categoryIDs,
        excludePostID: post.id,
        limit: 5,
      })

      relatedSimulations =
        relatedByCategory.docs.length > 0
          ? relatedByCategory.docs
          : (
              await getPublishedSimulations({
                excludePostID: post.id,
                limit: 5,
              })
            ).docs
    }
  }

  return (
    <article className={simulationEnabled ? 'pt-4 pb-16' : 'pt-16 pb-16'}>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {simulationEnabled && post.simulationHtmlPath ? (
        <div className="container grid max-w-[86rem] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,0.9fr)]">
          <main className="min-w-0 space-y-8">
            <SimulationViewer
              className="w-full max-w-none px-0"
              simulationHtmlPath={post.simulationHtmlPath}
              simulationTitle={post.title}
            />
            <PostHero post={post} simulationEnabled />
            <RichText className="max-w-none" data={post.content} enableGutter={false} />
            {relatedArticles.length > 0 && (
              <RelatedPosts className="mt-12" docs={relatedArticles} />
            )}
          </main>

          <aside aria-labelledby="related-simulations-title" className="space-y-4 lg:pt-1">
            <h2 className="text-lg font-semibold" id="related-simulations-title">
              Related simulations
            </h2>
            {relatedSimulations.length > 0 ? (
              <div className="space-y-4">
                {relatedSimulations.map((relatedPost) => {
                  const category = relatedPost.categories?.find(
                    (item) => item && typeof item === 'object',
                  )

                  return (
                    <Link
                      className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-accent"
                      href={`/posts/${relatedPost.slug}`}
                      key={relatedPost.id}
                    >
                      <SimulationThumbnail
                        className="aspect-[4/3] w-32 shrink-0 rounded-lg"
                        post={relatedPost}
                      />
                      <div className="min-w-0 py-1">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 group-hover:text-[#2563EB]">
                          {relatedPost.title}
                        </h3>
                        {category && typeof category === 'object' && (
                          <p className="mt-1 text-xs text-muted-foreground">{category.title}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                More related simulations will appear here as they are published.
              </p>
            )}
          </aside>
        </div>
      ) : (
        <>
          <PostHero post={post} />
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="container">
              <RichText
                className="max-w-[48rem] mx-auto"
                data={post.content}
                enableGutter={false}
              />
              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                  className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                  docs={post.relatedPosts.filter((related) => typeof related === 'object')}
                />
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
