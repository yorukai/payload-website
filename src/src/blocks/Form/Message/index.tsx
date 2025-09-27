import RichText from '@/components/RichText'
import React from 'react'

import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Width } from '../Width'

export const Message: React.FC<{ message: SerializedEditorState }> = ({ message }) => {
  return (
    <Width className='my-12' width='100'>
      {/* @ts-expect-error TS2322 - SerializedEditorState is not assignable to type DefaultTypedEditorState */}
      {message && <RichText data={message} />}
    </Width>
  )
}
