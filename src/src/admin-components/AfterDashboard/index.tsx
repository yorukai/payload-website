'use client'

import { Card, toast } from '@payloadcms/ui'
import React, { useCallback, useState } from 'react'

const baseClass = 'after-dashboard'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target='_blank' href='/src/public'>
      visit your website
    </a>
  </div>
)

const AfterDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(async () => {
    if (seeded) {
      toast.info('Database already seeded.')
      return
    }
    if (loading) {
      toast.info('Seeding already in progress.')
      return
    }
    if (error) {
      toast.error(`An error occurred, please refresh and try again.`)
      return
    }

    setLoading(true)

    try {
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            fetch('/next/seed', { method: 'POST', credentials: 'include' })
              .then((res) => {
                if (res.ok) {
                  resolve(true)
                  setSeeded(true)
                } else {
                  reject('An error occurred while seeding.')
                }
              })
              .catch((error) => {
                reject(error)
              })
          } catch (error) {
            reject(error)
          }
        }),
        {
          loading: 'Seeding with data....',
          success: <SuccessMessage />,
          error: 'An error occurred while seeding.',
        },
      )
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      setError(error)
    }
  }, [loading, seeded, error])

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <div className={`${baseClass} dashboard__group`}>
      <h2 className={`dashboard__label`}>{'Tools'}</h2>
      <ul className={'dashboard__card-list'}>
        <li>
          <Card href={'/admin'} title={'Seed database' + message} onClick={handleClick} />
        </li>
      </ul>
    </div>
  )
}

export default AfterDashboard
