'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ChevronDown, SearchIcon, UserRound, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  return (
    <nav aria-label="Primary navigation" className="flex items-center gap-2 sm:gap-4">
      {navItems.length > 0 && (
        <>
          <div className="hidden items-center gap-3 2xl:flex">
            {navItems.map(({ link }, i) => (
              <CMSLink key={i} {...link} appearance="link" />
            ))}
          </div>
          <details className="relative 2xl:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent">
              More <ChevronDown aria-hidden="true" className="size-4" />
            </summary>
            <div className="absolute right-0 top-full z-40 mt-2 min-w-44 space-y-2 rounded-xl border border-border bg-card p-3 shadow-lg">
              {navItems.map(({ link }, i) => (
                <div key={i}>
                  <CMSLink {...link} appearance="link" />
                </div>
              ))}
            </div>
          </details>
        </>
      )}

      <button
        aria-controls="mobile-simulation-search"
        aria-expanded={searchOpen}
        aria-label={searchOpen ? 'Close search' : 'Open search'}
        className="inline-flex size-9 items-center justify-center rounded-full hover:bg-accent md:hidden"
        onClick={() => setSearchOpen((open) => !open)}
        type="button"
      >
        {searchOpen ? (
          <X aria-hidden="true" className="size-5 text-muted-foreground" />
        ) : (
          <SearchIcon aria-hidden="true" className="size-5 text-muted-foreground" />
        )}
      </button>

      {searchOpen && (
        <form
          action="/explore"
          className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background p-4 shadow-lg md:hidden"
          id="mobile-simulation-search"
          role="search"
        >
          <label className="sr-only" htmlFor="mobile-simulation-search-input">
            Search simulations
          </label>
          <div className="mx-auto flex max-w-xl">
            <input
              autoComplete="off"
              className="h-11 min-w-0 flex-1 rounded-l-full border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              id="mobile-simulation-search-input"
              name="q"
              placeholder="Search simulations and subjects"
              ref={searchInputRef}
              type="search"
            />
            <button
              aria-label="Search"
              className="inline-flex h-11 w-14 items-center justify-center rounded-r-full border border-l-0 border-border bg-muted text-foreground hover:bg-accent"
              type="submit"
            >
              <SearchIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        </form>
      )}

      <Link
        aria-label="Sign in to Payload"
        className="inline-flex h-9 items-center gap-2 rounded-full bg-[#2563EB] px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4"
        href="/admin/login"
      >
        <UserRound aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    </nav>
  )
}
