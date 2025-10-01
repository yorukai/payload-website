import {
  unstable_cacheLife as cacheLife,
  unstable_noStore as noStore,
  unstable_cacheTag,
} from 'next/cache'

const cacheTags = {
  page: (slug: string): string => `page:${slug}`,
  posts: 'posts',
  post: (slug: string): string => `post:${slug}`,
} as const

export type CacheTagKey = keyof typeof cacheTags

export type FunctionCacheTagKeys = {
  [K in keyof typeof cacheTags]: (typeof cacheTags)[K] extends (identifier: string) => string
    ? K
    : never
}[keyof typeof cacheTags]

export type StringCacheTagKeys = Exclude<CacheTagKey, FunctionCacheTagKeys>

export function cacheTag(key: StringCacheTagKeys): void
export function cacheTag(key: FunctionCacheTagKeys, identifier: string): void
export function cacheTag<K extends StringCacheTagKeys | FunctionCacheTagKeys>(
  key: K,
  ...args: K extends FunctionCacheTagKeys ? [identifier: string] : []
): void {
  const tag = cacheTags[key]
  if (typeof tag === 'function') {
    const identifier = args[0]
    if (!identifier) {
      throw new Error(`Identifier is required for cache tag function "${key}"`)
    }

    unstable_cacheTag(tag(identifier))
    return
  }

  unstable_cacheTag(tag)
}

export { cacheLife, noStore }
