import Link from 'next/link'

export function PageHead({
  title,
  eyebrow,
  lead,
  crumbs = [],
}: {
  title: string
  eyebrow?: string
  lead?: string | null
  crumbs?: { label: string; href?: string }[]
}) {
  return (
    <div className="page-head">
      <div className="container">
        <nav aria-label="Jejak halaman">
          <ol className="breadcrumb">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label}>
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="title-xl">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </div>
  )
}
