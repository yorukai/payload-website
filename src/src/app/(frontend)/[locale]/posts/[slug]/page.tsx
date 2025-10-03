import { RelatedPosts } from '@/blocks/RelatedPosts/Component'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { PostHero } from '@/heros/PostHero'
import { cacheLife, cacheTag, noStore } from '@/utilities/cache'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload, TypedLocale } from 'payload'
import { cache } from 'react'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
    locale?: TypedLocale
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  'use cache'

  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale = 'de' } = await paramsPromise

  if (draft) {
    noStore()
  } else {
    cacheTag('post', slug)
    cacheLife('days')
  }

  const url = '/posts/' + slug
  const post = await queryPost({ slug, locale })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className='pt-16 pb-16'>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} locale={locale} />

      <div className='flex flex-col items-center gap-4 pt-8'>
        <div className='container'>
          <RichText className='mx-auto max-w-[48rem]' data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className='col-span-3 col-start-1 mt-12 max-w-[52rem] grid-rows-[2fr] lg:grid lg:grid-cols-subgrid'
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale = 'de' } = await paramsPromise
  const post = await queryPost({ slug, locale })

  return generateMeta({ doc: post })
}

const queryPost = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    locale,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
