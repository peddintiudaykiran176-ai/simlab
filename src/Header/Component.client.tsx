'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Atom, Search } from 'lucide-react'

import type { Header } from '@/payload-types'

import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const resolvedTheme = pathname.startsWith('/posts/') ? 'light' : theme

  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur"
      {...(resolvedTheme ? { 'data-theme': resolvedTheme } : {})}
    >
      <div className="container flex h-16 max-w-[86rem] items-center gap-4">
        <Link
          aria-label="SimVerse home"
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight"
          href="/"
        >
          <Atom aria-hidden="true" className="size-7 text-[#2563EB]" strokeWidth={2.2} />
          <span>SimVerse</span>
        </Link>

        <form action="/explore" className="mx-auto hidden w-full max-w-xl md:flex" role="search">
          <label className="sr-only" htmlFor="simverse-header-search">
            Search simulations
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-l-full border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            id="simverse-header-search"
            name="q"
            placeholder="Search simulations and subjects"
            type="search"
          />
          <button
            aria-label="Search"
            className="inline-flex h-10 w-14 items-center justify-center rounded-r-full border border-l-0 border-border bg-muted text-foreground hover:bg-accent"
            type="submit"
          >
            <Search aria-hidden="true" className="size-4" />
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <HeaderNav data={data} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
