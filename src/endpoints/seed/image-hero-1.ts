import type { Media } from '@/payload-types'

export const imageHero1 = (locale: 'de' | 'en'): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => ({
  alt:
    locale === 'de'
      ? 'Gerade metallische Formen mit einem blauen Farbverlauf'
      : 'Straight metallic shapes with a blue gradient',
})
