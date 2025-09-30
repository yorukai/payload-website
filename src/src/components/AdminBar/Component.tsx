import { AdminBarClient } from '@/components/AdminBar/Component.client'
import type { PayloadAdminBarProps } from '@payloadcms/admin-bar'

import React, { Suspense } from 'react'

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  return (
    <Suspense>
      <AdminBarClient {...props} />
    </Suspense>
  )
}
