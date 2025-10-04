import { revalidateTag } from '@/utilities/cache'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidateSEO: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating seo`)

    revalidateTag('global', 'seo')
  }

  return doc
}
