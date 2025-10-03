import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector/Component'
import { TypedLocale } from 'payload'

type Props = {
  locale: TypedLocale
}

export async function Footer({ locale }: Readonly<Props>) {
  const footerData: Footer = await getCachedGlobal('footer', locale, 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className='border-border dark:bg-card mt-auto border-t bg-black text-white'>
      <div className='container flex flex-col gap-8 py-8 md:flex-row md:justify-between'>
        <Link className='flex items-center' href={`/${locale}`}>
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
