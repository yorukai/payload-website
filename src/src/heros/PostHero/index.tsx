import { TypedLocale } from 'payload'
import React from 'react'
import { formatDateTime } from 'src/utilities/formatDateTime'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { getTranslations } from 'next-intl/server'

export const PostHero: React.FC<{
  post: Post
  locale: TypedLocale
}> = async ({ post, locale }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post
  const t = await getTranslations({ locale })

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className='relative -mt-[10.5rem] flex items-end'>
      <div className='relative z-10 container pb-8 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]'>
        <div className='lg:col-span-1 lg:col-start-2'>
          <div className='mb-6 text-sm uppercase'>
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className=''>
            <h1 className='mb-6 text-3xl md:text-5xl lg:text-6xl'>{title}</h1>
          </div>

          <div className='flex flex-col gap-4 md:flex-row md:gap-16'>
            {hasAuthors && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm'>{t('author')}</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className='flex flex-col gap-1'>
                <p className='text-sm'>{t('date-published')}</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='min-h-[80vh] select-none'>
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName='-z-10 object-cover' resource={heroImage} />
        )}
        <div className='pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent' />
      </div>
    </div>
  )
}
