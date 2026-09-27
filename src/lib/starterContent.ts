import type { Payload } from 'payload'

import { slugify } from './slugify'

/**
 * The starting data listed in docs/requirements.md: categories and the initial programs.
 * Used by the `pnpm seed` CLI script (development) and by bootstrapStarterContent (production,
 * gated behind SEED_STARTER_CONTENT). Safe to run more than once: anything that already exists
 * (matched by slug) is left alone, and nothing is ever deleted or overwritten.
 */

const PROGRAM_CATEGORIES = ['Pendidikan', 'Pembinaan Yatim', 'Kesejahteraan Masyarakat']
const EVENT_CATEGORIES = ['Kajian', 'Pelatihan', 'Santunan', 'Ramadhan', 'Wisuda', 'Kegiatan Yatim']
// The requirements list these in English; the site itself is Indonesian, so they are seeded that way.
// Admins can rename them at any time.
const GALLERY_CATEGORIES = ['Program', 'Acara', 'Ramadhan', 'Wisuda', 'Yatim', 'Umum']

const PROGRAMS: Record<string, string[]> = {
  Pendidikan: [
    'Beasiswa Kuliah',
    'Tahsin Tahfizh Gratis Yatim Dhuafa',
    'Bimbel Gratis',
    'Sanlat Yatim dan Santri Tahfizh',
    'Wisuda 30 Juz',
  ],
  'Pembinaan Yatim': ['Santunan Yatim', 'Bukber Bareng Yatim', 'Rihlah Yatim'],
  'Kesejahteraan Masyarakat': ['Santunan Dhuafa', 'Pengajian Ibu-Ibu', "Sahur I'tikaf"],
}

type CategorySlug = 'program-categories' | 'event-categories' | 'gallery-categories'
type MinimalPayload = Pick<Payload, 'find' | 'create' | 'logger'>

const ensureCategories = async (
  payload: MinimalPayload,
  collection: CategorySlug,
  names: string[],
) => {
  const ids = new Map<string, number>()
  for (const [index, name] of names.entries()) {
    const slug = slugify(name)
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs[0]) {
      ids.set(name, existing.docs[0].id as number)
      continue
    }
    const created = await payload.create({ collection, data: { name, slug, sortOrder: index } })
    ids.set(name, created.id as number)
    payload.logger.info(`Created ${collection}: ${name}`)
  }
  return ids
}

export const createStarterContent = async (payload: MinimalPayload): Promise<void> => {
  const programCategoryIds = await ensureCategories(
    payload,
    'program-categories',
    PROGRAM_CATEGORIES,
  )
  await ensureCategories(payload, 'event-categories', EVENT_CATEGORIES)
  await ensureCategories(payload, 'gallery-categories', GALLERY_CATEGORIES)

  for (const [categoryName, names] of Object.entries(PROGRAMS)) {
    for (const name of names) {
      const slug = slugify(name)
      const existing = await payload.find({
        collection: 'programs',
        draft: true,
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) continue
      await payload.create({
        collection: 'programs',
        // Drafts, so nothing half-written is public. Admins fill in the details and publish.
        draft: true,
        data: {
          name,
          slug,
          category: programCategoryIds.get(categoryName)!,
          shortDescription: 'Deskripsi singkat akan ditambahkan.',
        },
      })
      payload.logger.info(`Created draft program: ${name}`)
    }
  }
}
