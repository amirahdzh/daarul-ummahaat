/**
 * Everything the public pages read from Payload.
 *
 * All queries use `overrideAccess: false` with no user, so Payload's access rules apply:
 * visitors only ever get published programs and events, active statistics and published
 * legal documents. Never drop that option here.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import type {
  ContactInfo,
  DonationInfo,
  Event,
  FoundationProfile,
  GalleryImage,
  HomePage,
  ImpactStatistic,
  LegalDocument,
  Program,
  ProgramCategory,
  SiteSetting,
} from '@/payload-types'

const client = async () => getPayload({ config: await config })

export const PAGE_SIZE = 12
export const GALLERY_PAGE_SIZE = 24

export type Paged<T> = { docs: T[]; page: number; totalPages: number; totalDocs: number }

const paged = <T>(result: {
  docs: T[]
  page?: number
  totalPages: number
  totalDocs: number
}): Paged<T> => ({
  docs: result.docs,
  page: result.page ?? 1,
  totalPages: Math.max(1, result.totalPages),
  totalDocs: result.totalDocs,
})

/* ---------- Globals ---------- */

export const getSiteSettings = async (): Promise<SiteSetting> =>
  (await client()).findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false })

export const getHomePage = async (): Promise<HomePage> =>
  (await client()).findGlobal({ slug: 'home-page', depth: 1, overrideAccess: false })

export const getFoundationProfile = async (): Promise<FoundationProfile> =>
  (await client()).findGlobal({ slug: 'foundation-profile', depth: 1, overrideAccess: false })

export const getDonationInfo = async (): Promise<DonationInfo> =>
  (await client()).findGlobal({ slug: 'donation-info', depth: 1, overrideAccess: false })

export const getContactInfo = async (): Promise<ContactInfo> =>
  (await client()).findGlobal({ slug: 'contact-info', depth: 0, overrideAccess: false })

/* ---------- Programs ---------- */

export const getProgramCategories = async () =>
  (
    await (
      await client()
    ).find({
      collection: 'program-categories',
      sort: 'sortOrder',
      limit: 100,
      depth: 0,
      overrideAccess: false,
    })
  ).docs

/** Number of published programs in each category, keyed by category id. */
export const countProgramsByCategory = async (
  categories: ProgramCategory[],
): Promise<Map<number, number>> => {
  const payload = await client()
  const counts = await Promise.all(
    categories.map(async (category) => {
      const { totalDocs } = await payload.count({
        collection: 'programs',
        where: { category: { equals: category.id } },
        overrideAccess: false,
      })
      return [category.id, totalDocs] as const
    }),
  )
  return new Map(counts)
}

export const listPrograms = async ({
  categorySlug,
  page = 1,
  limit = PAGE_SIZE,
}: {
  categorySlug?: string
  page?: number
  limit?: number
}): Promise<Paged<Program>> =>
  paged(
    await (
      await client()
    ).find({
      collection: 'programs',
      where: categorySlug ? { 'category.slug': { equals: categorySlug } } : undefined,
      sort: 'name',
      page,
      limit,
      depth: 1,
      overrideAccess: false,
    }),
  )

/** Programs the admin ticked for the home page. Falls back to the first few when none are ticked. */
export const getFeaturedPrograms = async (limit = 6): Promise<Program[]> => {
  const payload = await client()
  const featured = await payload.find({
    collection: 'programs',
    where: { featured: { equals: true } },
    sort: 'name',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  if (featured.docs.length > 0) return featured.docs
  return (
    await payload.find({
      collection: 'programs',
      sort: 'name',
      limit,
      depth: 1,
      overrideAccess: false,
    })
  ).docs
}

/**
 * `draft: true` is only for the preview route (see lib/preview.ts): it bypasses the published-only
 * access rule to show the latest draft. The public site must never pass it without that gate.
 */
export const getProgramBySlug = async (
  slug: string,
  { draft = false } = {},
): Promise<Program | null> => {
  const result = await (
    await client()
  ).find({
    collection: 'programs',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
  return result.docs[0] ?? null
}

/* ---------- Events ---------- */

export const getEventCategories = async () =>
  (
    await (
      await client()
    ).find({
      collection: 'event-categories',
      sort: 'sortOrder',
      limit: 100,
      depth: 0,
      overrideAccess: false,
    })
  ).docs

export const listEvents = async ({
  categorySlug,
  oldestFirst = false,
  page = 1,
  limit = PAGE_SIZE,
}: {
  categorySlug?: string
  oldestFirst?: boolean
  page?: number
  limit?: number
}): Promise<Paged<Event>> =>
  paged(
    await (
      await client()
    ).find({
      collection: 'events',
      where: categorySlug ? { 'category.slug': { equals: categorySlug } } : undefined,
      sort: oldestFirst ? 'eventDate' : '-eventDate',
      page,
      limit,
      depth: 1,
      overrideAccess: false,
    }),
  )

export const getLatestEvents = async (limit = 3): Promise<Event[]> =>
  (
    await (
      await client()
    ).find({
      collection: 'events',
      sort: '-eventDate',
      limit,
      depth: 1,
      overrideAccess: false,
    })
  ).docs

/** See the note on getProgramBySlug: `draft: true` is only for the gated preview route. */
export const getEventBySlug = async (
  slug: string,
  { draft = false } = {},
): Promise<Event | null> => {
  const result = await (
    await client()
  ).find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
  return result.docs[0] ?? null
}

/* ---------- Gallery ---------- */

export const getGalleryCategories = async () =>
  (
    await (
      await client()
    ).find({
      collection: 'gallery-categories',
      sort: 'sortOrder',
      limit: 100,
      depth: 0,
      overrideAccess: false,
    })
  ).docs

export const listGallery = async ({
  categorySlug,
  page = 1,
  limit = GALLERY_PAGE_SIZE,
}: {
  categorySlug?: string
  page?: number
  limit?: number
}): Promise<Paged<GalleryImage>> =>
  paged(
    await (
      await client()
    ).find({
      collection: 'gallery-images',
      where: categorySlug ? { 'category.slug': { equals: categorySlug } } : undefined,
      sort: ['sortOrder', '-createdAt'],
      page,
      limit,
      depth: 0,
      overrideAccess: false,
    }),
  )

/** Photos ticked "Show on the home page", topped up with the newest ones. */
export const getHomeGallery = async (limit = 6): Promise<GalleryImage[]> => {
  const payload = await client()
  const featured = await payload.find({
    collection: 'gallery-images',
    where: { featured: { equals: true } },
    sort: ['sortOrder', '-createdAt'],
    limit,
    depth: 0,
    overrideAccess: false,
  })
  if (featured.docs.length >= limit) return featured.docs
  const latest = await payload.find({
    collection: 'gallery-images',
    where: { id: { not_in: featured.docs.map((d) => d.id) } },
    sort: '-createdAt',
    limit: limit - featured.docs.length,
    depth: 0,
    overrideAccess: false,
  })
  return [...featured.docs, ...latest.docs]
}

/* ---------- Other content ---------- */

export const getImpactStatistics = async (): Promise<ImpactStatistic[]> =>
  (
    await (
      await client()
    ).find({
      collection: 'impact-statistics',
      sort: 'sortOrder',
      limit: 12,
      depth: 1,
      overrideAccess: false,
    })
  ).docs

export const getLegalDocuments = async (): Promise<LegalDocument[]> =>
  (
    await (
      await client()
    ).find({
      collection: 'legal-documents',
      sort: '-year',
      limit: 50,
      depth: 0,
      overrideAccess: false,
    })
  ).docs

/* ---------- Sitemap ---------- */

export const getSitemapEntries = async () => {
  const payload = await client()
  const select = { slug: true, updatedAt: true, seo: true } as const
  const [programs, events] = await Promise.all([
    payload.find({ collection: 'programs', limit: 1000, depth: 0, select, overrideAccess: false }),
    payload.find({ collection: 'events', limit: 1000, depth: 0, select, overrideAccess: false }),
  ])
  return { programs: programs.docs, events: events.docs }
}
