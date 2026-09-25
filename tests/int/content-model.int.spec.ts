import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

// 1x1 transparent PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)
const png = (name: string) => ({ data: PNG, mimetype: 'image/png', name, size: PNG.length })

// Payload's generated types make `slug` mandatory on create, but the slug hook fills it in when it is missing.
const autoSlug = undefined as unknown as string

const run = Date.now().toString(36)
const created: { collection: string; id: number }[] = []

let payload: Payload
let categoryId: number

const remember = <T extends { id: number }>(collection: string, doc: T): T => {
  created.push({ collection, id: doc.id })
  return doc
}

describe('content model', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = await payload.create({
      collection: 'program-categories',
      data: { slug: autoSlug, name: `Test category ${run}` },
    })
    categoryId = remember('program-categories', category).id
  })

  afterAll(async () => {
    for (const { collection, id } of created.reverse()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.delete({ collection: collection as any, id }).catch(() => undefined)
    }
  })

  describe('slugs', () => {
    it('are generated from the name when left empty', async () => {
      const program = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          data: {
            slug: autoSlug,
            name: `Tahsin & Tahfizh ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            _status: 'published',
          },
        }),
      )
      expect(program.slug).toBe(`tahsin-dan-tahfizh-${run}`)
    })

    it('are cleaned when typed by hand', async () => {
      const program = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          data: {
            name: `Manual slug ${run}`,
            slug: `  Program Baru ${run}!  `,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            _status: 'published',
          },
        }),
      )
      expect(program.slug).toBe(`program-baru-${run}`)
    })

    it('must be unique', async () => {
      await expect(
        payload.create({
          collection: 'programs',
          data: {
            name: `Duplicate ${run}`,
            slug: `tahsin-dan-tahfizh-${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            _status: 'published',
          },
        }),
      ).rejects.toThrow()
    })
  })

  describe('public access', () => {
    it('shows published programs and hides drafts', async () => {
      const published = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          data: {
            slug: autoSlug,
            name: `Public ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            _status: 'published',
          },
        }),
      )
      const draft = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          draft: true,
          data: {
            slug: autoSlug,
            name: `Draft ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
          },
        }),
      )

      const visible = await payload.find({
        collection: 'programs',
        overrideAccess: false,
        where: { id: { in: [published.id, draft.id] } },
      })
      expect(visible.docs.map((d) => d.id)).toEqual([published.id])

      const asAdmin = await payload.find({
        collection: 'programs',
        draft: true,
        where: { id: { in: [published.id, draft.id] } },
      })
      expect(asAdmin.totalDocs).toBe(2)
    })

    it('refuses writes from visitors', async () => {
      await expect(
        payload.create({
          collection: 'programs',
          overrideAccess: false,
          data: {
            slug: autoSlug,
            name: `Nope ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
          },
        }),
      ).rejects.toThrow()
    })

    it('hides inactive impact statistics from visitors', async () => {
      const on = remember(
        'impact-statistics',
        await payload.create({
          collection: 'impact-statistics',
          data: { label: `On ${run}`, value: '100+', active: true },
        }),
      )
      const off = remember(
        'impact-statistics',
        await payload.create({
          collection: 'impact-statistics',
          data: { label: `Off ${run}`, value: '5', active: false },
        }),
      )
      const visible = await payload.find({
        collection: 'impact-statistics',
        overrideAccess: false,
        where: { id: { in: [on.id, off.id] } },
      })
      expect(visible.docs.map((d) => d.id)).toEqual([on.id])
    })

    it('hides unpublished legal documents from visitors', async () => {
      const shown = remember(
        'legal-documents',
        await payload.create({
          collection: 'legal-documents',
          data: { name: `Shown ${run}`, year: 2020, published: true },
          file: png(`shown-${run}.png`),
        }),
      )
      const hidden = remember(
        'legal-documents',
        await payload.create({
          collection: 'legal-documents',
          data: { name: `Hidden ${run}`, year: 2021, published: false },
          file: png(`hidden-${run}.png`),
        }),
      )
      const visible = await payload.find({
        collection: 'legal-documents',
        overrideAccess: false,
        where: { id: { in: [shown.id, hidden.id] } },
      })
      expect(visible.docs.map((d) => d.id)).toEqual([shown.id])
    })
  })

  describe('validation', () => {
    it('rejects non-web registration links', async () => {
      await expect(
        payload.create({
          collection: 'programs',
          data: {
            slug: autoSlug,
            name: `Bad link ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            registrationLink: 'javascript:alert(1)',
            _status: 'published',
          },
        }),
      ).rejects.toThrow()
    })

    it('rejects legal documents of the wrong type', async () => {
      await expect(
        payload.create({
          collection: 'legal-documents',
          data: { name: `Bad file ${run}` },
          file: {
            data: Buffer.from('MZ not really a program'),
            mimetype: 'application/x-msdownload',
            name: 'x.exe',
            size: 20,
          },
        }),
      ).rejects.toThrow()
    })
  })

  describe('gallery', () => {
    it('fills in alt text and links photos to programs and events', async () => {
      const program = remember(
        'programs',
        await payload.create({
          collection: 'programs',
          data: {
            slug: autoSlug,
            name: `With photos ${run}`,
            shortDescription: 'x',
            programStatus: 'active',
            category: categoryId,
            _status: 'published',
          },
        }),
      )
      const event = remember(
        'events',
        await payload.create({
          collection: 'events',
          data: {
            slug: autoSlug,
            name: `Event ${run}`,
            eventDate: '2026-03-01T00:00:00.000Z',
            _status: 'published',
          },
        }),
      )
      const photo = remember(
        'gallery-images',
        await payload.create({
          collection: 'gallery-images',
          data: { title: 'Santunan yatim', program: program.id, event: event.id },
          file: png(`santunan-${run}.png`),
        }),
      )
      expect(photo.alt).toBe('Santunan yatim')

      const bare = remember(
        'gallery-images',
        await payload.create({
          collection: 'gallery-images',
          data: {},
          file: png(`rihlah-yatim-${run}.png`),
        }),
      )
      expect(bare.alt).toBe(`rihlah yatim ${run}`)

      const withGallery = await payload.findByID({
        collection: 'programs',
        id: program.id,
        depth: 1,
      })
      const docs = (withGallery.gallery?.docs ?? []) as { id: number }[]
      expect(docs.map((d) => d.id)).toContain(photo.id)
      expect(docs.map((d) => d.id)).not.toContain(bare.id)

      const eventWithGallery = await payload.findByID({
        collection: 'events',
        id: event.id,
        depth: 1,
      })
      expect(
        ((eventWithGallery.gallery?.docs ?? []) as { id: number }[]).map((d) => d.id),
      ).toContain(photo.id)
    })
  })

  describe('globals', () => {
    it('normalise WhatsApp numbers and reject unsafe map embeds', async () => {
      const before = await payload.findGlobal({ slug: 'contact-info' })
      try {
        const saved = await payload.updateGlobal({
          slug: 'contact-info',
          data: { whatsapp: '0812-3456-7890' },
        })
        expect(saved.whatsapp).toBe('6281234567890')

        await expect(
          payload.updateGlobal({
            slug: 'contact-info',
            data: { mapsEmbedUrl: 'https://evil.example.com/embed' },
          }),
        ).rejects.toThrow()
      } finally {
        await payload.updateGlobal({
          slug: 'contact-info',
          data: {
            whatsapp: before.whatsapp ?? null,
            mapsEmbedUrl: before.mapsEmbedUrl ?? null,
          },
        })
      }
    })

    it('are readable by visitors', async () => {
      for (const slug of [
        'home-page',
        'foundation-profile',
        'donation-info',
        'contact-info',
        'site-settings',
      ] as const) {
        await expect(payload.findGlobal({ slug, overrideAccess: false })).resolves.toBeDefined()
      }
    })
  })
})
