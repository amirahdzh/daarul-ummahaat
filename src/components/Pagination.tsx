import Link from 'next/link'

import { ChevronLeft, ChevronRight } from './icons'

export function Pagination({
  base,
  page,
  totalPages,
  params,
}: {
  base: string
  page: number
  totalPages: number
  params?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null
  const href = (target: number) => {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params ?? {})) if (value) query.set(key, value)
    if (target > 1) query.set('page', String(target))
    const qs = query.toString()
    return qs ? `${base}?${qs}` : base
  }
  return (
    <nav className="pagination" aria-label="Halaman">
      {page > 1 ? (
        <Link className="btn btn--outline" href={href(page - 1)} rel="prev">
          <ChevronLeft width={18} height={18} /> Sebelumnya
        </Link>
      ) : null}
      <span className="pagination__status" aria-current="page">
        Halaman {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Link className="btn btn--outline" href={href(page + 1)} rel="next">
          Berikutnya <ChevronRight width={18} height={18} />
        </Link>
      ) : null}
    </nav>
  )
}
