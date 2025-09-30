import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <div className='container py-28'>
      <div className='prose max-w-none'>
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className='mb-4'>{t('page-not-found')}</p>
      </div>
      <Button asChild variant='default'>
        <Link href='/src/public'>{t('go-home')}</Link>
      </Button>
    </div>
  )
}
