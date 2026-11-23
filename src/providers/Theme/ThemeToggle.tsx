'use client'

import { SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './index'

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      aria-label="Toggle light and dark theme"
      className="shrink-0"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      size="icon"
      type="button"
      variant="ghost"
    >
      <SunMoon aria-hidden="true" className="size-5" />
    </Button>
  )
}
