import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { createStarterContent } from '@/lib/starterContent'

// Fixed, real names (the same ones production loads), so this both proves correctness and
// exercises the exact data an admin will see. Cleaned up afterwards so a normal test run leaves
// no trace in a developer's local database.
const KNOWN_PROGRAM_CATEGORY_SLUGS = ['pendidikan', 'pembinaan-yatim', 'kesejahteraan-masyarakat']
const KNOWN_PROGRAM_SLUGS = [
  'beasiswa-kuliah',
  'tahsin-tahfizh-gratis-yatim-dhuafa',
  'bimbel-gratis',
  'sanlat-yatim-dan-santri-tahfizh',
  'wisuda-30-juz',
  'santunan-yatim',
  'bukber-bareng-yatim',
  'rihlah-yatim',
  'santunan-dhuafa',
  'pengajian-ibu-ibu',
  'sahur-i-tikaf',
]

let payload: Payload

const cleanUp = async () => {
  const existing = await payload.find({
    collection: 'programs',
    draft: true,
    where: { slug: { in: KNOWN_PROGRAM_SLUGS } },
    limit: 100,
  })
  for (const doc of existing.docs) await payload.delete({ collection: 'programs', id: doc.id })
  for (const collection of [
    'program-categories',
    'event-categories',
    'gallery-categories',
  ] as const) {
    const created = await payload.find({ collection, limit: 100 })
    const relevant =
      collection === 'program-categories'
        ? created.docs.filter((d) => KNOWN_PROGRAM_CATEGORY_SLUGS.includes(d.slug))
        : created.docs // event/gallery categories are entirely our own fixed set, safe to remove all
    for (const doc of relevant) await payload.delete({ collection, id: doc.id })
  }
}

describe('createStarterContent', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await cleanUp() // in case a previous run was interrupted before cleanup
  })

  afterAll(async () => {
    await cleanUp()
  })

  it('creates the categories and draft programs, and changes nothing on a second run', async () => {
    await createStarterContent(payload)

    const categories = await payload.find({
      collection: 'program-categories',
      where: { slug: { equals: 'pendidikan' } },
    })
    expect(categories.docs).toHaveLength(1)

    const programs = await payload.find({
      collection: 'programs',
      draft: true,
      where: { slug: { equals: 'beasiswa-kuliah' } },
    })
    expect(programs.docs).toHaveLength(1)
    expect(programs.docs[0]._status).toBe('draft')
    const category = programs.docs[0].category
    const categoryId = typeof category === 'object' && category !== null ? category.id : category
    expect(categoryId).toBe(categories.docs[0].id)

    // Running it again must not create duplicates or touch what is already there.
    await createStarterContent(payload)
    const again = await payload.find({
      collection: 'program-categories',
      where: { slug: { equals: 'pendidikan' } },
    })
    expect(again.docs).toHaveLength(1)
    expect(again.docs[0].id).toBe(categories.docs[0].id)

    const totalPrograms = await payload.count({
      collection: 'programs',
      where: { slug: { in: KNOWN_PROGRAM_SLUGS } },
    })
    expect(totalPrograms.totalDocs).toBe(KNOWN_PROGRAM_SLUGS.length)
  })

  it('leaves an admin-edited category alone (matched by slug, never overwritten)', async () => {
    const before = await payload.find({
      collection: 'program-categories',
      where: { slug: { equals: 'pendidikan' } },
    })
    await payload.update({
      collection: 'program-categories',
      id: before.docs[0].id,
      data: { name: 'Pendidikan (edited by admin)' },
    })

    await createStarterContent(payload)

    const after = await payload.findByID({
      collection: 'program-categories',
      id: before.docs[0].id,
    })
    expect(after.name).toBe('Pendidikan (edited by admin)')
  })
})
