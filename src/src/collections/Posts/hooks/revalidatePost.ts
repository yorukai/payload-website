import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from '@/utilities/cache'

import type { Post } from '@/payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    if (doc._status === 'published') {
      const path = `/${locale}/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      if (doc.slug) revalidateTag('post', doc.slug)
      revalidateTag('sitemap', 'posts')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${locale}/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      if (previousDoc.slug) revalidateTag('post', previousDoc.slug)
      revalidateTag('sitemap', 'posts')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context, i18n },
}) => {
  if (!context.disableRevalidate) {
    const locale = i18n.language
    const path = `/${locale}/posts/${doc?.slug}`

    revalidatePath(path)
    if (doc?.slug) revalidateTag('post', doc.slug)
    revalidateTag('sitemap', 'posts')
  }

  return doc
}
