import type { Metadata } from 'next'

import type { Config, Media, Page, Post } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { getCachedGlobal } from './getGlobals'
import { getServerSideURL } from './getURL'
import { mergeOpenGraph } from './mergeOpenGraph'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  locale: TypedLocale
}): Promise<Metadata> => {
  const { doc, locale } = args

  const ogImage = getImageURL(doc?.meta?.image)
  const seo = await getCachedGlobal('seo', locale, 1)
  const metaTitle = seo.metaTitle

  const title = doc?.meta?.title ? doc?.meta?.title + ` | ${metaTitle}` : metaTitle

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
