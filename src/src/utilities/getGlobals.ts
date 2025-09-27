import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, TypedLocale } from 'payload'
import type { Config } from 'src/payload-types'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, locale: TypedLocale, depth = 0) {
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
export const getCachedGlobal = (slug: Global, locale: TypedLocale, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, locale, depth), [slug, locale], {
    tags: [`global_${slug}`],
  })
