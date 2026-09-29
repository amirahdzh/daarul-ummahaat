import { getPayload, type Payload, type Where } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { createStarterContent } from '@/lib/starterContent'

// Fixed, real names (the same ones production loads), so this both proves correctness and
// exercises the exact data an admin will see. Cleaned up afterwards so a normal test run leaves
// no trace in a developer's local database.
//
// Critically, this means a *real*, already-seeded database (an admin's own `pnpm seed`) can look
// identical to this test's own content, by design. Cleanup must never rely on name-matching
// alone: every deletion below is also scoped to rows created no earlier than `testRunStartedAt`,
// so real content created before this test file ran is never touched, no matter what it is named.
// (Found the hard way: an earlier version of this file wiped a real seeded database's content.)
const testRunStartedAt = new Date().toISOString()
const createdDuringThisRun = (where: Where): Where => ({
  and: [where, { createdAt: { greater_than_equal: testRunStartedAt } }],
})
const KNOWN_PROGRAM_CATEGORY_SLUGS = ['pendidikan', 'pembinaan-yatim', 'kesejahteraan-masyarakat']
const KNOWN_EVENT_CATEGORY_SLUGS = [
  'kajian',
  'pelatihan',
  'santunan',
  'ramadhan',
  'wisuda',
  'kegiatan-yatim',
]
const KNOWN_GALLERY_CATEGORY_SLUGS = ['program', 'acara', 'ramadhan', 'wisuda', 'yatim', 'umum']
const KNOWN_PROGRAM_NAMES = [
  'Beasiswa Kuliah',
  'Tahsin Tahfizh Gratis Yatim Dhuafa',
  'Bimbel Gratis',
  'Sanlat Yatim dan Santri Tahfizh',
  'Wisuda 30 Juz',
  'Santunan Yatim',
  'Bukber Bareng Yatim',
  'Rihlah Yatim',
  'Santunan Dhuafa',
  'Pengajian Ibu-Ibu',
  "Sahur I'tikaf",
]
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
const KNOWN_EVENT_NAMES = [
  'Kajian Ahad Pagi',
  'Pelatihan Guru Tahfizh',
  'Santunan Yatim Bulanan',
  'Buka Puasa Bersama Yatim',
  'Wisuda Tahfizh 30 Juz',
  'Rihlah dan Outbound Yatim',
]
const KNOWN_EVENT_SLUGS = [
  'kajian-ahad-pagi',
  'pelatihan-guru-tahfizh',
  'santunan-yatim-bulanan',
  'buka-puasa-bersama-yatim',
  'wisuda-tahfizh-30-juz',
  'rihlah-dan-outbound-yatim',
]
const KNOWN_GALLERY_TITLES = [
  'Kegiatan Beasiswa Kuliah',
  'Kegiatan Tahsin Tahfizh',
  'Santunan Yatim Bulanan',
  'Rihlah Yatim Bersama',
  'Santunan Dhuafa',
  'Kajian Ahad Pagi',
  'Pelatihan Guru Tahfizh',
  'Buka Puasa Bersama Yatim',
  "Sahur I'tikaf Bersama",
  'Wisuda Tahfizh 30 Juz',
  'Wisuda 30 Juz Tahun Lalu',
  'Rihlah dan Outbound Yatim',
  'Kebersamaan di Yayasan',
  'Kegiatan Yayasan',
]
const KNOWN_IMPACT_LABELS = [
  'Yatim Dibina',
  'Mahasiswa Mendapat Beasiswa',
  'Huffazh Lulus Wisuda',
  'Penerima Manfaat',
]
const KNOWN_LEGAL_NAME = 'Akta Pendirian Yayasan (Contoh)'
// One Media document is created per program/event featuredImage, plus a handful of singleton
// images for the globals. Alt text doubles as the identifying, cleanable label for each.
const KNOWN_MEDIA_ALTS = [
  ...KNOWN_PROGRAM_NAMES,
  ...KNOWN_EVENT_NAMES,
  'Foto Utama Yayasan (Contoh)',
  'Kegiatan Yayasan (Contoh)',
  'Tim Yayasan (Contoh)',
  'QRIS (Contoh)',
  'Logo Yayasan Daarul Ummahaat',
]

/**
 * Payload treats an `undefined` field on update as "leave it alone", but an explicit `null` as
 * "clear it". A captured snapshot of a field that was never set comes back as `undefined`, so
 * restoring a global by writing that snapshot straight back silently fails to clear anything a
 * test subsequently wrote — proven the hard way once already; see the restore logic below.
 */
const deepNullify = (value: unknown): unknown => {
  if (value === undefined) return null
  if (Array.isArray(value)) return value.map(deepNullify)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, deepNullify(v)]))
  }
  return value
}

const GLOBAL_SLUGS = [
  'home-page',
  'foundation-profile',
  'donation-info',
  'contact-info',
  'site-settings',
] as const

let payload: Payload
const originalGlobals = new Map<(typeof GLOBAL_SLUGS)[number], Record<string, unknown>>()

const deleteMatching = async (
  collection:
    'programs' | 'events' | 'gallery-images' | 'impact-statistics' | 'legal-documents' | 'media',
  where: Where,
  draft = false,
) => {
  const found = await payload.find({
    collection,
    draft,
    where: createdDuringThisRun(where),
    limit: 100,
  })
  for (const doc of found.docs) await payload.delete({ collection, id: doc.id })
}

const cleanUpCollections = async () => {
  await deleteMatching('programs', { slug: { in: KNOWN_PROGRAM_SLUGS } }, true)
  await deleteMatching('events', { slug: { in: KNOWN_EVENT_SLUGS } }, true)
  await deleteMatching('gallery-images', { title: { in: KNOWN_GALLERY_TITLES } })
  await deleteMatching('impact-statistics', { label: { in: KNOWN_IMPACT_LABELS } })
  await deleteMatching('legal-documents', { name: { equals: KNOWN_LEGAL_NAME } })
  await deleteMatching('media', { alt: { in: KNOWN_MEDIA_ALTS } })

  for (const [collection, slugs] of [
    ['program-categories', KNOWN_PROGRAM_CATEGORY_SLUGS],
    ['event-categories', KNOWN_EVENT_CATEGORY_SLUGS],
    ['gallery-categories', KNOWN_GALLERY_CATEGORY_SLUGS],
  ] as const) {
    const found = await payload.find({
      collection,
      where: createdDuringThisRun({ slug: { in: slugs } }),
      limit: 100,
    })
    for (const doc of found.docs) await payload.delete({ collection, id: doc.id })
  }
}

const countMediaByAlt = async (alt: string) =>
  (await payload.find({ collection: 'media', where: { alt: { equals: alt } } })).totalDocs

describe('createStarterContent', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })

    // Capture every global's real state before touching anything.
    for (const slug of GLOBAL_SLUGS) {
      originalGlobals.set(
        slug,
        (await payload.findGlobal({ slug })) as unknown as Record<string, unknown>,
      )
    }

    // Safe even on an already-seeded real database: cleanUpCollections only ever deletes rows
    // created no earlier than this file started running (see createdDuringThisRun), so real,
    // older content — including whatever these globals already point at — is never touched here.
    await cleanUpCollections() // in case a previous run was interrupted before cleanup
  })

  afterAll(async () => {
    // Globals first: a restored global may still point at a media doc created during the test,
    // and that document's own foreign key from e.g. organizationPhotos requires it to keep
    // existing until nothing references it any more.
    for (const slug of GLOBAL_SLUGS) {
      const original = originalGlobals.get(slug)
      if (!original) continue
      // Strip fields Payload manages itself and would reject being written back.
      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        globalType: _globalType,
        ...rest
      } = original
      await payload.updateGlobal({ slug, data: deepNullify(rest) as Record<string, unknown> })
    }
    await cleanUpCollections()
  })

  it('creates categories, programs, events, gallery photos, statistics and a legal document', async () => {
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
    expect(programs.docs[0].featuredImage).toBeTruthy()
    const category = programs.docs[0].category
    const categoryId = typeof category === 'object' && category !== null ? category.id : category
    expect(categoryId).toBe(categories.docs[0].id)

    const events = await payload.find({
      collection: 'events',
      draft: true,
      where: { slug: { equals: 'kajian-ahad-pagi' } },
    })
    expect(events.docs).toHaveLength(1)
    expect(events.docs[0]._status).toBe('draft')
    expect(events.docs[0].featuredImage).toBeTruthy()

    const gallery = await payload.find({
      collection: 'gallery-images',
      where: { title: { equals: 'Kegiatan Beasiswa Kuliah' } },
    })
    expect(gallery.docs).toHaveLength(1)
    expect(gallery.docs[0].program).toBeTruthy()

    const stats = await payload.count({
      collection: 'impact-statistics',
      where: { label: { in: KNOWN_IMPACT_LABELS } },
    })
    expect(stats.totalDocs).toBe(KNOWN_IMPACT_LABELS.length)

    const legal = await payload.find({
      collection: 'legal-documents',
      where: { name: { equals: KNOWN_LEGAL_NAME } },
    })
    expect(legal.docs).toHaveLength(1)
    expect(legal.docs[0].published).toBe(false)
  })

  it('changes nothing on a second run: no duplicate categories, programs or media', async () => {
    await createStarterContent(payload)

    const categories = await payload.count({
      collection: 'program-categories',
      where: { slug: { equals: 'pendidikan' } },
    })
    expect(categories.totalDocs).toBe(1)

    const programs = await payload.count({
      collection: 'programs',
      where: { slug: { in: KNOWN_PROGRAM_SLUGS } },
    })
    expect(programs.totalDocs).toBe(KNOWN_PROGRAM_SLUGS.length)

    const events = await payload.count({
      collection: 'events',
      where: { slug: { in: KNOWN_EVENT_SLUGS } },
    })
    expect(events.totalDocs).toBe(KNOWN_EVENT_SLUGS.length)

    const gallery = await payload.count({
      collection: 'gallery-images',
      where: { title: { in: KNOWN_GALLERY_TITLES } },
    })
    expect(gallery.totalDocs).toBe(KNOWN_GALLERY_TITLES.length)

    // Regression check: each program/event's featured image is one Media document, not a fresh
    // upload on every run (a real bug caught during development: the image was generated before
    // the "already exists" check, so it kept being generated even when nothing else changed).
    expect(await countMediaByAlt('Beasiswa Kuliah')).toBe(1)
    expect(await countMediaByAlt('Kajian Ahad Pagi')).toBe(1)
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

  describe('globals', () => {
    const heroImageAlt = 'Foto Utama Yayasan (Contoh)'

    it('fills the home page hero (headline and image) when genuinely empty', async () => {
      // A full clear, both fields: setting `hero` to only `{ headline: null }` would replace the
      // whole group and silently drop `image` too (Payload's group fields are not deep-merged),
      // which very nearly produced a false failure below. Both fields null is the real "empty".
      await payload.updateGlobal({
        slug: 'home-page',
        data: { hero: { headline: null, image: null } },
      })
      const countBefore = await countMediaByAlt(heroImageAlt)

      await createStarterContent(payload)

      const filled = await payload.findGlobal({ slug: 'home-page' })
      expect(filled.hero?.headline).toBe('Membina, mendidik, dan memberdayakan masyarakat.')
      expect(filled.hero?.image).toBeTruthy()
      expect(await countMediaByAlt(heroImageAlt)).toBe(countBefore + 1)
    })

    it('never re-creates the hero image once the home page is already filled', async () => {
      const before = await payload.findGlobal({ slug: 'home-page' })
      const countBefore = await countMediaByAlt(heroImageAlt)
      // An admin has since edited the headline; re-running must leave their edit and the image alone.
      await payload.updateGlobal({
        slug: 'home-page',
        data: { hero: { ...before.hero, headline: 'Judul buatan admin' } },
      })

      await createStarterContent(payload)

      const after = await payload.findGlobal({ slug: 'home-page' })
      expect(after.hero?.headline).toBe('Judul buatan admin')
      const imageId = (id: unknown) =>
        typeof id === 'object' && id !== null ? (id as { id: unknown }).id : id
      expect(imageId(after.hero?.image)).toBe(imageId(before.hero?.image))
      expect(await countMediaByAlt(heroImageAlt)).toBe(countBefore)
    })

    it('fills in donation info, contact info and foundation profile when empty', async () => {
      await payload.updateGlobal({ slug: 'donation-info', data: { bankAccounts: [] } })
      await payload.updateGlobal({ slug: 'contact-info', data: { address: null } })
      await payload.updateGlobal({ slug: 'foundation-profile', data: { vision: null } })

      await createStarterContent(payload)

      const donation = await payload.findGlobal({ slug: 'donation-info' })
      expect(donation.bankAccounts?.length).toBeGreaterThan(0)
      expect(donation.bankAccounts?.[0]?.bankName).toContain('Contoh')

      const contact = await payload.findGlobal({ slug: 'contact-info' })
      expect(contact.address).toContain('Contoh')
      expect(contact.whatsapp).toBe('6281234567890') // normalised by the WhatsApp field hook

      const profile = await payload.findGlobal({ slug: 'foundation-profile' })
      expect(profile.vision).toContain('Contoh')
      expect(profile.coreValues?.length).toBeGreaterThan(0)
    })
  })
})
