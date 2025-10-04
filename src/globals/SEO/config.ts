import type { GlobalConfig } from 'payload'
import { revalidateSEO } from './hooks/revalidateSEO'

export const SEO: GlobalConfig = {
  slug: 'seo',
  typescript: {
    interface: 'SEO',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'metaTitle',
      label: {
        en: 'Meta title',
        de: 'Meta Titel',
      },
      type: 'text',
      defaultValue: 'Payload Website Template',
      required: true,
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateSEO],
  },
}
