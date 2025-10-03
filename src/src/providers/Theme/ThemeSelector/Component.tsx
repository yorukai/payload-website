import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { allThemes } from '@/providers/Theme/shared'
import { ThemeSelectorClient } from '@/providers/Theme/ThemeSelector/Component.client'
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
        {allThemes.map((theme) => (
          <SelectItem value={theme} key={theme}>
            {t(`theme-${theme}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </ThemeSelectorClient>
  )
}
