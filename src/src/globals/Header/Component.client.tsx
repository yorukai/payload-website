'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import localization from '@/i18n/localization'
import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { TypedLocale } from 'payload'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className='container relative z-20 flex justify-end gap-2 py-8'
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <Link href='/' className='me-auto'>
        <Logo loading='eager' priority='high' className='invert dark:invert-0' />
      </Link>
      <LocaleSwitcher />
      <HeaderNav data={data} />
    </header>
  )
}

function LocaleSwitcher() {
  // inspired by https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/components/LocaleSwitcherSelect.tsx
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value },
      )
    })
  }

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger className='w-auto gap-2 border-none bg-transparent pl-0 text-sm text-primary md:pl-3'>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectContent>
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label)) // Ordenar por label
          .map((locale) => (
            <SelectItem value={locale.code} key={locale.code}>
              {locale.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
