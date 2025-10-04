import configPromise from '@payload-config'
import { getPayload, TypedLocale } from 'payload'
import type { Config } from 'src/payload-types'
import { cacheLife, cacheTag } from './cache'

type Globals = Config['globals']
type Global = keyof Globals

async function getGlobal<TSlug extends Global>(
  slug: TSlug,
  locale: TypedLocale,
  depth = 0,
): Promise<Globals[TSlug]> {
  const payload = await getPayload({ config: configPromise })

  return await payload.findGlobal({
    slug,
    depth,
    locale,
  })
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export async function getCachedGlobal<TSlug extends Global>(
  slug: TSlug,
  locale: TypedLocale,
  depth = 0,
): Promise<Globals[TSlug]> {
  'use cache'
  cacheTag('global', slug)
  cacheLife('weeks')

  return await getGlobal(slug, locale, depth)
}
