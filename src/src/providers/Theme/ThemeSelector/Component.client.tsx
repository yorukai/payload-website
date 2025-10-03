'use client'

import { Select } from '@/components/ui/select'
import React, { useEffect, useState } from 'react'

import type { Theme } from '../shared'

import { useTheme } from '..'

type Props = {
  children: React.ReactNode
}

export const ThemeSelectorClient: React.FC<Props> = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevents hydration mismatch
  if (!mounted) return null

  return (
    <Select onValueChange={(themeToSet: Theme) => setTheme(themeToSet)} value={theme}>
      {children}
    </Select>
  )
}
