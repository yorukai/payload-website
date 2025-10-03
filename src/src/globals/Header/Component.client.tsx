'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import { usePathname } from '@/i18n/routing'

interface HeaderClientProps {
  children: React.ReactNode
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ children }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className='relative z-20 container flex justify-end gap-2 py-8'
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {children}
    </header>
  )
}
