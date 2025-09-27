import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

import type { Header } from '@/payload-types'
import { TypedLocale } from 'payload'

type Props = {
  locale: TypedLocale
}

export async function Header({ locale }: Readonly<Props>) {
  const header: Header = await getCachedGlobal('header', locale, 1)()

  return <HeaderClient data={header} />
}
