'use client'
import { Footer } from '@/payload-types'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Footer['navItems']>[number]>()

  const label = data?.link?.label
    ? `Nav item ${rowNumber !== undefined ? rowNumber + 1 : ''}: ${data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}
