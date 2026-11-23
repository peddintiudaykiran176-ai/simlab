'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Atom,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Cpu,
  FlaskConical,
  Flame,
  House,
  Menu,
} from 'lucide-react'

import type { SimVerseSubjectLink } from './config'

const primaryLinks = [
  { label: 'Home', href: '/', Icon: House },
  { label: 'Explore', href: '/explore', Icon: Compass },
  { label: 'Popular', href: '/explore?sort=popular', Icon: Flame },
  { label: 'Recently Added', href: '/explore?sort=recent', Icon: Clock3 },
]

const subjectIcons = [
  Atom,
  FlaskConical,
  BookOpen,
  Calculator,
  Cpu,
  Cpu,
  Atom,
  Compass,
  BookOpen,
  Atom,
  BookOpen,
]

export const SimulationSidebar: React.FC<{
  subjects: SimVerseSubjectLink[]
}> = ({ subjects }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <aside
      className={`w-full shrink-0 lg:sticky lg:top-24 lg:self-start ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b border-border py-3 lg:border-0">
        <button
          aria-expanded={mobileOpen}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          <Menu aria-hidden="true" className="size-4" />
          {mobileOpen ? 'Hide navigation' : 'Browse subjects'}
        </button>
        <span className="hidden px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">
          {collapsed ? 'Menu' : 'Discover'}
        </span>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
          type="button"
        >
          {collapsed ? (
            <ChevronRight aria-hidden="true" className="size-4" />
          ) : (
            <ChevronLeft aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      <nav
        aria-label="Simulation navigation"
        className={`${mobileOpen ? 'block' : 'hidden'} space-y-5 py-3 lg:block lg:py-0`}
      >
        <div className="space-y-1">
          {primaryLinks.map(({ label, href, Icon }) => (
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              href={href}
              key={label}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
            </Link>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <h2
            className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${collapsed ? 'lg:sr-only' : ''}`}
          >
            Subjects
          </h2>
          <div className="space-y-1">
            {subjects.map(({ label, href }, index) => {
              const Icon = subjectIcons[index % subjectIcons.length]

              return (
                <Link
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
                  href={href}
                  key={label}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
