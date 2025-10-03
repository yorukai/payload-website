import { Locale, routing } from '@/i18n/routing'
import { cacheLife, cacheTag } from '@/utilities/cache'
import { getServerSideSitemap } from 'next-sitemap'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'
import { TypedLocale } from 'payload'

const getLocaleSitemap = async (locale: TypedLocale) => {
  'use cache'
  cacheTag('sitemap', 'locales')
  cacheLife('weeks')

  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const date = new Date().toISOString()

  const sitemaps = ['pages-sitemap.xml', 'posts-sitemap.xml']

  return sitemaps.map((sitemap) => ({
    loc: `${SITE_URL}/${locale}/${sitemap}`,
    lastmod: date,
  }))
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

  const sitemap = await getLocaleSitemap(locale)

  return getServerSideSitemap(sitemap)
}
