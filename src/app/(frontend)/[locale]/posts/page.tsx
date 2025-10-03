import { cacheLife, cacheTag } from '@/utilities/cache'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload, TypedLocale } from 'payload'
import PageClient from './page.client'

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function Page({ params }: Args) {
  'use cache'
  cacheTag('posts')
  cacheLife('days')

  const { locale = 'de' } = await params
  const t = await getTranslations({ locale })
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className='pt-24 pb-24'>
      <PageClient />
      <div className='container mb-16'>
        <div className='prose dark:prose-invert max-w-none'>
          <h1>{t('posts')}</h1>
        </div>
      </div>

      <div className='container mb-8'>
        <PageRange
          locale={locale}
          collection='posts'
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className='container'>
        {posts.totalPages > 1 && posts.page && (
          <Pagination locale={locale} page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
