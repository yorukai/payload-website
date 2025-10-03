import { Locale, routing } from '@/i18n/routing'
import { cacheLife, cacheTag } from '@/utilities/cache'
import config from '@payload-config'
import { getServerSideSitemap } from 'next-sitemap'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'
import { getPayload, TypedLocale } from 'payload'

const getPagesSitemap = async (locale: TypedLocale) => {
  'use cache'
  cacheTag('sitemap', 'pages')
  cacheLife('weeks')

  const payload = await getPayload({ config })
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'
  const localeUrl = `${SITE_URL}/${locale}`

  const results = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    locale,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const defaultSitemap = [
    {
      loc: `${localeUrl}/search`,
      lastmod: dateFallback,
    },
    {
      loc: `${localeUrl}/posts`,
      lastmod: dateFallback,
    },
  ]

  const sitemap = results.docs
    ? results.docs
        .filter((page) => Boolean(page?.slug))
        .map((page) => {
          return {
            loc: page?.slug === 'home' ? `${localeUrl}/` : `${localeUrl}/${page?.slug}`,
            lastmod: page.updatedAt || dateFallback,
          }
        })
    : []

  return [...defaultSitemap, ...sitemap]
}

type Args = {
  params: Promise<{
    locale: Locale
  }>
}

export async function GET(_: NextRequest, { params: paramsPromise }: Args) {
  const { locale: localeParam } = await paramsPromise

  if (!routing.locales.includes(localeParam)) {
    notFound()
  }
  const locale: TypedLocale = localeParam as TypedLocale

  const sitemap = await getPagesSitemap(locale)

  return getServerSideSitemap(sitemap)
}
