/**
 * Loads the starting data listed in docs/requirements.md: categories and the initial programs.
 * Safe to run more than once: anything that already exists (matched by slug) is left alone.
 *
 *   pnpm seed
 */
import { getPayload } from 'payload'

import config from './payload.config'
import { slugify } from './lib/slugify'

const programCategories = ['Pendidikan', 'Pembinaan Yatim', 'Kesejahteraan Masyarakat']
const eventCategories = ['Kajian', 'Pelatihan', 'Santunan', 'Ramadhan', 'Wisuda', 'Kegiatan Yatim']
// The requirements list these in English; the site itself is Indonesian, so they are seeded that way.
// Admins can rename them at any time.
const galleryCategories = ['Program', 'Acara', 'Ramadhan', 'Wisuda', 'Yatim', 'Umum']

const programs: Record<string, string[]> = {
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

const payload = await getPayload({ config: await config })

type CategorySlug = 'program-categories' | 'event-categories' | 'gallery-categories'

const ensureCategories = async (collection: CategorySlug, names: string[]) => {
  const ids = new Map<string, number>()
  for (const [index, name] of names.entries()) {
    const slug = slugify(name)
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs[0]) {
      ids.set(name, existing.docs[0].id)
      continue
    }
    const created = await payload.create({ collection, data: { name, slug, sortOrder: index } })
    ids.set(name, created.id)
    payload.logger.info(`Created ${collection}: ${name}`)
  }
  return ids
}

const programCategoryIds = await ensureCategories('program-categories', programCategories)
await ensureCategories('event-categories', eventCategories)
await ensureCategories('gallery-categories', galleryCategories)

for (const [categoryName, names] of Object.entries(programs)) {
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

payload.logger.info('Seed complete.')
process.exit(0)
