import Link from 'next/link'
import React from 'react'
import { Atom, ArrowUpRight } from 'lucide-react'

import type { Media, Post } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export type SimulationCardPost = Pick<
  Post,
  'id' | 'title' | 'slug' | 'heroImage' | 'categories' | 'meta' | 'publishedAt' | 'createdAt'
>

const getImage = (post: SimulationCardPost): Media | null => {
  if (post.heroImage && typeof post.heroImage === 'object') return post.heroImage
  if (post.meta?.image && typeof post.meta.image === 'object') return post.meta.image
  return null
}

export const SimulationThumbnail: React.FC<{
  className?: string
  post: SimulationCardPost
}> = ({ className = '', post }) => {
  const image = getImage(post)

  return (
    <div className={`relative overflow-hidden bg-blue-950 ${className}`}>
      {image ? (
        <MediaComponent
          alt={image.alt || post.title}
          fill
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          pictureClassName="absolute inset-0"
          resource={image}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-600 text-white">
          <Atom aria-hidden="true" className="size-16 opacity-80" strokeWidth={1.2} />
        </div>
      )}
    </div>
  )
}

const categoryTitle = (post: SimulationCardPost) => {
  const category = post.categories?.find((item) => typeof item === 'object')
  return category && typeof category === 'object' ? category.title : null
}

export const SimulationCard: React.FC<{
  post: SimulationCardPost
}> = ({ post }) => {
  const description = post.meta?.description?.trim()
  const category = categoryTitle(post)
  const date = post.publishedAt || post.createdAt

  return (
    <article className="group min-w-0">
      <Link
        aria-label={`Read ${post.title}`}
        className="block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        href={`/posts/${post.slug}`}
      >
        <SimulationThumbnail className="aspect-video" post={post} />
        <div className="space-y-2 p-4">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
              {category}
            </p>
          )}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-card-foreground">
              {post.title}
            </h3>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[#2563EB]"
            />
          </div>
          {description && (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
          {date && (
            <p className="pt-1 text-xs text-muted-foreground">Published {formatDateTime(date)}</p>
          )}
        </div>
      </Link>
    </article>
  )
}
