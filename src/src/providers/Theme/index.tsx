import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import React from 'react'
import { defaultTheme, themes } from './shared'

export const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <NextThemeProvider
    attribute='data-theme'
    defaultTheme={defaultTheme}
    themes={themes}
    storageKey={'payload-theme'}
  >
    {children}
  </NextThemeProvider>
)

export { useTheme }
