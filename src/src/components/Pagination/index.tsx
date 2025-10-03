import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { TypedLocale } from 'payload'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  locale: TypedLocale
  page: number
  totalPages: number
}> = (props) => {
  const { className, locale, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} url={`/${locale}/posts/page/${page - 1}`} />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink url={`/${locale}/posts/page/${page - 1}`}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive url={`/${locale}/posts/page/${page}`}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink url={`/${locale}/posts/page/${page + 1}`}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} url={`/${locale}/posts/page/${page + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
