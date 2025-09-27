import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

import type { Header } from '@/payload-types'
import { TypedLocale } from 'payload'

export async function Header({ locale }: { locale: TypedLocale }) {
  const header: Header = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={header} />
}
