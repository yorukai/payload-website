import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThemeSelectorClient } from '@/providers/Theme/ThemeSelector/ThemeSelector.client'
import React from 'react'

import { getTranslations } from 'next-intl/server'

export const ThemeSelector: React.FC = async () => {
  const t = await getTranslations()

  return (
    <ThemeSelectorClient>
      <SelectTrigger
        className='w-auto gap-2 border-none bg-transparent pl-0 md:pl-3'
        aria-label={t('select-theme')}
      >
        <SelectValue placeholder={t('theme')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='auto'>{t('theme-auto')}</SelectItem>
        <SelectItem value='light'>{t('theme-light')}</SelectItem>
        <SelectItem value='dark'>{t('theme-dark')}</SelectItem>
      </SelectContent>
    </ThemeSelectorClient>
  )
}
