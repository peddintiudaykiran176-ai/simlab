import type { Category, Post } from '@/payload-types'

export const simVerseSubjects = [
  { label: 'Physics', slug: 'physics' },
  { label: 'Chemistry', slug: 'chemistry' },
  { label: 'Biology', slug: 'biology' },
  { label: 'Mathematics', slug: 'mathematics' },
  { label: 'Engineering', slug: 'engineering' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Robotics', slug: 'robotics' },
  { label: 'Drone Technology', slug: 'drone-technology' },
  { label: 'Computer Science', slug: 'computer-science' },
  { label: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { label: 'Environmental Science', slug: 'environmental-science' },
]

export type SimVerseSubjectLink = {
  label: string
  slug: string
  href: string
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ')

export const getSubjectLinks = (
  categories: Pick<Category, 'slug' | 'title'>[],
): SimVerseSubjectLink[] =>
  simVerseSubjects.map((subject) => {
    const category = categories.find(
      (item) =>
        normalize(item.title) === normalize(subject.label) ||
        normalize(item.slug) === normalize(subject.slug),
    )

    return {
      ...subject,
      href: `/explore?category=${encodeURIComponent(category?.slug || subject.label)}`,
    }
  })

export const postHasSubject = (categories: Post['categories'], slugs: string[]): boolean => {
  const expected = new Set(slugs.map(normalize))

  return Boolean(
    categories?.some(
      (category) =>
        category !== null &&
        typeof category === 'object' &&
        (expected.has(normalize(category.slug)) || expected.has(normalize(category.title))),
    ),
  )
}
