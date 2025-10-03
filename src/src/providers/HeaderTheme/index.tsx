'use client'

import { useTheme } from '@/providers/Theme'

import React, { createContext, use, useMemo, useState } from 'react'

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
  const { theme } = useTheme()

  const [headerTheme, setHeaderTheme] = useState<string | undefined>(canUseDOM ? theme : undefined)

  const headerThemeMemo = useMemo(
    () => ({
      headerTheme,
      setHeaderTheme,
    }),
    [headerTheme],
  )

  return <HeaderThemeContext value={headerThemeMemo}>{children}</HeaderThemeContext>
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
