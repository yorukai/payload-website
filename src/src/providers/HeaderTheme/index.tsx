'use client'

import { useTheme } from '@/providers/Theme'

import React, { createContext, use, useEffect, useMemo, useState } from 'react'

import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  headerTheme?: string | undefined
  setHeaderTheme: (theme: string | undefined) => void
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  const [headerTheme, setHeaderTheme] = useState<string | undefined>(canUseDOM ? theme : undefined)

  useEffect(() => {
    setMounted(true)
  }, [])

  const headerThemeMemo = useMemo(
    () => ({
      headerTheme,
      setHeaderTheme,
    }),
    [headerTheme],
  )

  // Prevents hydration mismatch
  if (!mounted) return null

  return <HeaderThemeContext value={headerThemeMemo}>{children}</HeaderThemeContext>
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
