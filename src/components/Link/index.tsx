'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { useLocale } from 'next-intl'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import NextLink from 'next/link'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props
  const locale = useLocale()

  const referencePath = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/${locale}${referencePath}/${reference.value.slug}`
      : url

  if (!href) return null

  const finalHref = href || url || ''
  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <NextLink className={cn(className)} href={finalHref} {...newTabProps}>
        {label && label}
        {children && children}
      </NextLink>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <NextLink className={cn(className)} href={finalHref} {...newTabProps}>
        {label && label}
        {children && children}
      </NextLink>
    </Button>
  )
}
