import { getTranslations } from 'next-intl/server'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

export const HeaderNav: React.FC<{ data: HeaderType }> = async ({ data }) => {
  const navItems = data?.navItems || []
  const t = await getTranslations()

  return (
    <nav className='flex items-center gap-3'>
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance='link' />
      })}
      <Link href='/search'>
        <span className='sr-only'>{t('search')}</span>
        <SearchIcon className='text-primary w-5' />
      </Link>
    </nav>
  )
}
