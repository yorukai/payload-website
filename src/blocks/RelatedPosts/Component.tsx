import RichText from '@/components/RichText'
import clsx from 'clsx'
import React from 'react'

import type { Post } from '@/payload-types'

import { Card } from '@/components/Card'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {/* @ts-expect-error TS2322 - SerializedEditorState is not assignable to type DefaultTypedEditorState */}
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-8'>
        {docs?.map((doc, index) => {
          return <Card key={index} doc={doc} relationTo='posts' showCategories />
        })}
      </div>
    </div>
  )
}
