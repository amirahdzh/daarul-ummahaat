import Link from 'next/link'

export type FilterItem = { label: string; value: string }

/** Server-rendered filter links. `value` is put in the `param` query parameter; empty means "all". */
export function FilterChips({
  base,
  param,
  items,
  active,
  allLabel = 'Semua',
  extra,
  label,
}: {
  base: string
  param: string
  items: FilterItem[]
  active?: string
  allLabel?: string
  extra?: Record<string, string | undefined>
  label: string
}) {
  const href = (value: string) => {
    const query = new URLSearchParams()
    for (const [key, v] of Object.entries(extra ?? {})) if (v) query.set(key, v)
    if (value) query.set(param, value)
    const qs = query.toString()
    return qs ? `${base}?${qs}` : base
  }
  const all = [{ label: allLabel, value: '' }, ...items]
  return (
    <nav aria-label={label}>
      <ul className="filters">
        {all.map((item) => (
          <li key={item.value || 'all'}>
            <Link
              href={href(item.value)}
              className="filter"
              aria-current={(active ?? '') === item.value ? 'true' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
