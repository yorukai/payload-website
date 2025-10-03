import { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  locale: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    locale,
    path: `/${locale}${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
