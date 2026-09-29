import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { advancedSection } from '@/fields/advanced'
import { humaniseFilename } from '@/fields/upload'

// 1x1 transparent PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)
const png = (name: string) => ({ data: PNG, mimetype: 'image/png', name, size: PNG.length })
const autoSlug = undefined as unknown as string

const run = Date.now().toString(36)
const created: {
  collection: 'media' | 'legal-documents' | 'programs' | 'program-categories'
  id: number
}[] = []
let payload: Payload
let categoryId: number

const remember = <T extends { id: number }>(
  collection: (typeof created)[number]['collection'],
  doc: T,
): T => {
  created.push({ collection, id: doc.id })
  return doc
}

describe('advancedSection', () => {
  it('wraps fields in a collapsed-by-default section without adding a data key', () => {
    const inner = { name: 'x', type: 'text' as const }
    const section = advancedSection([inner])
    expect(section).toMatchObject({
      type: 'collapsible',
      label: { en: 'Advanced options', id: 'Opsi lanjutan' },
      admin: { initCollapsed: true },
      fields: [inner],
    })
    expect(section).not.toHaveProperty('name')
  })

  it('accepts a custom label', () => {
    const section = advancedSection([], 'Pengaturan lanjutan') as { label?: string }
    expect(section.label).toBe('Pengaturan lanjutan')
  })

  it('accepts a custom translated label', () => {
    const customLabel = { en: 'Advanced', id: 'Lanjutan' }
    const section = advancedSection([], customLabel) as { label?: unknown }
    expect(section.label).toEqual(customLabel)
  })
})

describe('humaniseFilename', () => {
  it('turns a file name into readable words', () => {
    expect(humaniseFilename('santunan-yatim_2024.jpg')).toBe('santunan yatim 2024')
    expect(humaniseFilename('Foto Kegiatan.png')).toBe('Foto Kegiatan')
  })

  it('handles a name with no extension or separators', () => {
    expect(humaniseFilename('logo')).toBe('logo')
  })
})

describe('admin UX (integration)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = remember(
      'program-categories',
      await payload.create({
        collection: 'program-categories',
        data: { name: `UX test category ${run}`, slug: autoSlug },
      }),
    )
    categoryId = category.id
  })

  afterAll(async () => {
    for (const { collection, id } of created.reverse()) {
      await payload.delete({ collection, id }).catch(() => undefined)
    }
  })

  describe('Media alt text', () => {
    it('fills alt text from the file name when left empty', async () => {
      const media = remember(
        'media',
        await payload.create({ collection: 'media', data: {}, file: png(`hero-photo-${run}.png`) }),
      )
      expect(media.alt).toBe(`hero photo ${run}`)
    })

    it('keeps an alt text the admin typed', async () => {
      const media = remember(
        'media',
        await payload.create({
          collection: 'media',
          data: { alt: 'Logo yayasan' },
          file: png(`x-${run}.png`),
        }),
      )
      expect(media.alt).toBe('Logo yayasan')
    })
  })

  describe('Legal document year', () => {
    it('defaults to the current year when not set', async () => {
      const doc = remember(
        'legal-documents',
        await payload.create({
          collection: 'legal-documents',
          data: { name: `Doc ${run}` },
          file: png(`legal-${run}.png`),
        }),
      )
      expect(doc.year).toBe(new Date().getFullYear())
    })

    it('keeps a year the admin chose', async () => {
      const doc = remember(
        'legal-documents',
        await payload.create({
          collection: 'legal-documents',
          data: { name: `Doc old ${run}`, year: 2019 },
          file: png(`legal-old-${run}.png`),
        }),
      )
      expect(doc.year).toBe(2019)
    })
  })

  describe('SEO fields inside the collapsed "Advanced options" section', () => {
    it('still read and write exactly as before (data shape unchanged by the UI wrapper)', async () => {
      const program = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          data: {
            name: `SEO test ${run}`,
            slug: autoSlug,
            shortDescription: 'x',
            category: categoryId,
            programStatus: 'active',
            seo: { metaTitle: 'Judul SEO', metaDescription: 'Ringkasan', noIndex: true },
            _status: 'published',
          },
        }),
      )
      expect(program.seo?.metaTitle).toBe('Judul SEO')
      expect(program.seo?.noIndex).toBe(true)

      const fetched = await payload.findByID({ collection: 'programs', id: program.id })
      expect(fetched.seo?.metaDescription).toBe('Ringkasan')
    })
  })
})
