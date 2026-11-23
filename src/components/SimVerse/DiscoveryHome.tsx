import Link from 'next/link'
import React from 'react'
import { ArrowRight, Atom, Search } from 'lucide-react'

import type { Category } from '@/payload-types'
import { getSubjectLinks, postHasSubject, simVerseSubjects } from './config'
import { SimulationCard, SimulationThumbnail, type SimulationCardPost } from './SimulationCard'
import { SimulationSidebar } from './Sidebar'

const categorySections = [
  { title: 'Physics Simulations', subjectSlugs: ['physics'], href: 'physics' },
  { title: 'Chemistry Simulations', subjectSlugs: ['chemistry'], href: 'chemistry' },
  { title: 'Biology Simulations', subjectSlugs: ['biology'], href: 'biology' },
  { title: 'Engineering Simulations', subjectSlugs: ['engineering'], href: 'engineering' },
  {
    title: 'Robotics and Drone Technology',
    subjectSlugs: ['robotics', 'drone-technology'],
    href: 'robotics',
  },
]

const EmptySection: React.FC<{ message?: string; subject?: string }> = ({ message, subject }) => (
  <div className="rounded-xl border border-dashed border-border bg-card/60 px-5 py-8 text-sm text-muted-foreground">
    {message ||
      (subject
        ? `No published ${subject} simulations yet.`
        : 'No published simulations yet. Check back soon.')}
  </div>
)

const SimulationSection: React.FC<{
  href: string
  id: string
  posts: SimulationCardPost[]
  title: string
  emptySubject?: string
  note?: string
}> = ({ emptySubject, href, id, note, posts, title }) => (
  <section className="scroll-mt-24 space-y-4" id={id}>
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      </div>
      <Link
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#2563EB] hover:underline"
        href={href}
      >
        View all <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
    {posts.length > 0 ? (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <SimulationCard key={post.id} post={post} />
        ))}
      </div>
    ) : (
      <EmptySection subject={emptySubject} />
    )}
  </section>
)

export const SimulationDiscoveryHome: React.FC<{
  categories: Pick<Category, 'slug' | 'title'>[]
  recentPosts: SimulationCardPost[]
  trendingPosts: SimulationCardPost[]
}> = ({ categories, recentPosts, trendingPosts }) => {
  const subjects = getSubjectLinks(categories)
  const featured = trendingPosts[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[86rem]">
        <div className="flex flex-col gap-6 py-5 lg:flex-row lg:gap-8 lg:py-8">
          <SimulationSidebar subjects={subjects} />

          <main className="min-w-0 flex-1 space-y-10 sm:space-y-12">
            <section className="space-y-2" id="explore">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                SimVerse
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore interactive simulations
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Discover experiments and ideas across science, technology, and engineering.
              </p>
            </section>

            <section aria-labelledby="featured-simulation-title" className="space-y-4">
              <h2
                className="text-xl font-bold tracking-tight sm:text-2xl"
                id="featured-simulation-title"
              >
                Featured Simulation
              </h2>
              {featured ? (
                <article className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[1.15fr_1fr]">
                  <SimulationThumbnail
                    className="aspect-video min-h-56 lg:aspect-auto lg:min-h-[22rem]"
                    post={featured}
                  />
                  <div className="flex flex-col items-start justify-center gap-4 p-5 sm:p-8">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2563EB] dark:bg-blue-950 dark:text-blue-300">
                      Featured Simulation
                    </span>
                    <div className="space-y-2">
                      {featured.categories?.some(
                        (category) => category && typeof category === 'object',
                      ) && (
                        <p className="text-sm font-medium text-[#2563EB]">
                          {featured.categories
                            .filter((category) => category && typeof category === 'object')
                            .map((category) =>
                              category && typeof category === 'object' ? category.title : null,
                            )
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                        {featured.title}
                      </h2>
                      {featured.meta?.description && (
                        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-base">
                          {featured.meta.description}
                        </p>
                      )}
                    </div>
                    <Link
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                      href={`/posts/${featured.slug}`}
                    >
                      <Atom aria-hidden="true" className="size-4" />
                      Start Experiment
                    </Link>
                  </div>
                </article>
              ) : (
                <EmptySection />
              )}
            </section>

            <SimulationSection
              href="/explore?sort=popular"
              id="trending"
              note="Showing the newest published simulations; view counts are not currently tracked."
              posts={trendingPosts}
              title="Trending Simulations"
            />

            <SimulationSection
              href="/explore?sort=recent"
              id="recently-added"
              posts={recentPosts}
              title="Recently Added"
            />

            {categorySections.map((section) => {
              const posts = trendingPosts.filter((post) =>
                postHasSubject(post.categories, section.subjectSlugs),
              )
              const subjectLabel =
                simVerseSubjects.find((subject) => subject.slug === section.href)?.label ||
                section.title.replace(' Simulations', '')

              return (
                <SimulationSection
                  emptySubject={subjectLabel}
                  href={`/explore?category=${encodeURIComponent(section.subjectSlugs.join(','))}`}
                  id={`subject-${section.href}`}
                  key={section.title}
                  posts={posts}
                  title={section.title}
                />
              )
            })}
          </main>
        </div>
      </div>
    </div>
  )
}

export const SimulationExplorePage: React.FC<{
  categories: Pick<Category, 'slug' | 'title'>[]
  category?: string
  posts: SimulationCardPost[]
  query?: string
  sort: 'popular' | 'recent'
}> = ({ categories, category, posts, query, sort }) => {
  const subjects = getSubjectLinks(categories)
  const categoryLabels = category
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const match = categories.find(
        (item) =>
          item.slug.toLowerCase() === value.toLowerCase() ||
          item.title.toLowerCase() === value.toLowerCase(),
      )
      return (
        match?.title ||
        simVerseSubjects.find(
          (subject) =>
            subject.slug.toLowerCase() === value.toLowerCase() ||
            subject.label.toLowerCase() === value.toLowerCase(),
        )?.label ||
        value
      )
    })
  const categoryTitle = categoryLabels?.join(' + ')
  const pageTitle = categoryTitle || (sort === 'recent' ? 'Recently Added' : 'Popular Simulations')

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[86rem]">
        <div className="flex flex-col gap-6 py-5 lg:flex-row lg:gap-8 lg:py-8">
          <SimulationSidebar subjects={subjects} />
          <main className="min-w-0 flex-1 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                SimVerse Explore
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
              {sort === 'popular' && !category && (
                <p className="text-sm text-muted-foreground">
                  Sorted by newest published. View counts are not currently tracked.
                </p>
              )}
              {query && (
                <p className="text-sm text-muted-foreground">
                  Results for <span className="font-medium text-foreground">{query}</span>
                </p>
              )}
            </div>

            <form action="/explore" className="flex max-w-xl" role="search">
              {category && <input name="category" type="hidden" value={category} />}
              {sort === 'recent' && <input name="sort" type="hidden" value="recent" />}
              <label className="sr-only" htmlFor="simulation-explore-search">
                Search simulations
              </label>
              <input
                className="h-10 min-w-0 flex-1 rounded-l-full border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                defaultValue={query}
                id="simulation-explore-search"
                name="q"
                placeholder="Search simulations"
                type="search"
              />
              <button
                aria-label="Search simulations"
                className="inline-flex h-10 w-12 items-center justify-center rounded-r-full border border-l-0 border-border bg-muted hover:bg-accent"
                type="submit"
              >
                <Search aria-hidden="true" className="size-4" />
              </button>
            </form>

            {posts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <SimulationCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptySection
                message={query ? `No simulations matched "${query}".` : undefined}
                subject={categoryTitle?.toLowerCase()}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
