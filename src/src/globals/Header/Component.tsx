import { getCachedGlobal } from '@/utilities/getGlobals'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { HeaderClient } from './Component.client'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { TypedLocale } from 'payload'
import { LocaleSwitcher } from './LocaleSwitcher'
import { HeaderNav } from './Nav'

type Props = {
  locale: TypedLocale
}

export async function Header({ locale }: Readonly<Props>) {
  const header: Header = await getCachedGlobal('header', locale, 1)()
  const t = await getTranslations()

  return (
    <HeaderClient>
      <Link href={`/${locale}`} className='me-auto'>
        <Logo loading='eager' priority='high' className='invert dark:invert-0' />
      </Link>
      <LocaleSwitcher label={t('select-locale')} />
      <HeaderNav data={header} />
    </HeaderClient>
  )
}
