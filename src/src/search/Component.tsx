'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/utilities/useDebounce'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const t = useTranslations()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const query = debouncedValue ? `?q=${debouncedValue}` : ''
    router.push(`/search${query}`)
  }, [debouncedValue, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor='search' className='sr-only'>
          Search
        </Label>
        <Input
          id='search'
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={t('search')}
        />
        <button type='submit' className='sr-only'>
          submit
        </button>
      </form>
    </div>
  )
}
