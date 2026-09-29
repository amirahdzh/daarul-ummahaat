import type { MetadataRoute } from 'next'

import { getSitemapEntries } from '@/lib/data'
import { absoluteUrl } from '@/lib/site'

// Built from the database on request, so the build never needs a database connection.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['/', '/about', '/programs', '/events', '/gallery', '/donate', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { programs, events } = await getSitemapEntries()
  const indexable = <T extends { seo?: { noIndex?: boolean | null } | null }>(doc: T) =>
    !doc.seo?.noIndex
  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...programs
      .filter(indexable)
      .map((p) => ({ url: absoluteUrl(`/programs/${p.slug}`), lastModified: p.updatedAt })),
    ...events
      .filter(indexable)
      .map((e) => ({ url: absoluteUrl(`/events/${e.slug}`), lastModified: e.updatedAt })),
  ]
}
