import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { TypedLocale } from 'payload'

type Props = {
  locale: TypedLocale
}

export async function Footer({ locale }: Readonly<{ locale: TypedLocale }>) {
  const footerData: Footer = await getCachedGlobal('footer', locale, 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className='mt-auto border-t border-border bg-black text-white dark:bg-card'>
      <div className='container flex flex-col gap-8 py-8 md:flex-row md:justify-between'>
        <Link className='flex items-center' href='/src/public'>
          <Logo />
        </Link>

        <div className='flex flex-col-reverse items-start gap-4 md:flex-row md:items-center'>
          <ThemeSelector />
          <nav className='flex flex-col gap-4 md:flex-row'>
            {navItems.map(({ link }, i) => {
              return <CMSLink className='text-white' key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
