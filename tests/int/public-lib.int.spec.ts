import { describe, expect, it } from 'vitest'

import {
  checkContact,
  contactEmailSubject,
  contactEmailText,
  type ContactInput,
} from '@/lib/contact'
import {
  dateBadge,
  formatLongDate,
  isoDay,
  isUpcoming,
  parsePage,
  safeJsonLd,
  telHref,
  whatsappUrl,
} from '@/lib/format'
import { imageSource } from '@/lib/media'
import { createRateLimiter } from '@/lib/rateLimit'

const NOW = new Date('2026-03-14T10:00:00Z').getTime()

const valid = (overrides: Partial<ContactInput> = {}): ContactInput => ({
  name: 'Siti Rahma',
  email: 'siti@example.com',
  whatsapp: '0812-3456-7890',
  message: 'Assalamu’alaikum, saya ingin menanyakan program beasiswa.',
  website: '',
  startedAt: String(NOW - 20_000),
  ...overrides,
})

describe('checkContact', () => {
  it('accepts a good submission and normalises the WhatsApp number', () => {
    const result = checkContact(valid(), NOW)
    expect(result).toMatchObject({
      ok: true,
      data: { name: 'Siti Rahma', whatsapp: '6281234567890' },
    })
  })

  it('treats the WhatsApp number as optional', () => {
    const result = checkContact(valid({ whatsapp: '' }), NOW)
    expect(result).toMatchObject({ ok: true, data: { whatsapp: '' } })
  })

  it('flags the honeypot as spam', () => {
    expect(checkContact(valid({ website: 'http://spam.example' }), NOW)).toEqual({
      ok: false,
      reason: 'spam',
    })
  })

  it('flags instant and stale submissions as spam', () => {
    expect(checkContact(valid({ startedAt: String(NOW - 500) }), NOW)).toEqual({
      ok: false,
      reason: 'spam',
    })
    expect(checkContact(valid({ startedAt: String(NOW - 7 * 60 * 60 * 1000) }), NOW)).toEqual({
      ok: false,
      reason: 'spam',
    })
    expect(checkContact(valid({ startedAt: '' }), NOW)).toEqual({ ok: false, reason: 'spam' })
  })

  it('reports each invalid field in Indonesian', () => {
    const result = checkContact(
      valid({ name: 'A', email: 'nope', whatsapp: '12', message: 'pendek' }),
      NOW,
    )
    expect(result.ok).toBe(false)
    if (!result.ok && result.reason === 'invalid') {
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name', 'whatsapp'])
      expect(result.errors.email).toContain('email')
    }
  })

  it('rejects over-long input', () => {
    const result = checkContact(valid({ message: 'x'.repeat(2001), name: 'y'.repeat(101) }), NOW)
    expect(result).toMatchObject({ ok: false, reason: 'invalid' })
  })

  it('strips line breaks from single-line fields so headers cannot be injected', () => {
    const result = checkContact(valid({ name: 'Budi\r\nBcc: victim@example.com' }), NOW)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.name).not.toMatch(/[\r\n]/)
      expect(contactEmailSubject(result.data.name)).not.toMatch(/[\r\n]/)
    }
  })

  it('builds a plain-text email body', () => {
    const text = contactEmailText({
      name: 'Siti',
      email: 's@example.com',
      whatsapp: '',
      message: 'Halo',
    })
    expect(text).toContain('Nama: Siti')
    expect(text).toContain('WhatsApp: -')
    expect(text).toContain('Halo')
  })
})

describe('createRateLimiter', () => {
  it('allows up to the limit, then blocks until the window passes', () => {
    const allow = createRateLimiter(2, 1000)
    expect(allow('a', 0)).toBe(true)
    expect(allow('a', 100)).toBe(true)
    expect(allow('a', 200)).toBe(false)
    expect(allow('a', 1001)).toBe(true)
  })

  it('counts visitors separately', () => {
    const allow = createRateLimiter(1, 1000)
    expect(allow('a', 0)).toBe(true)
    expect(allow('b', 0)).toBe(true)
    expect(allow('a', 10)).toBe(false)
  })
})

describe('format helpers', () => {
  it('formats dates in Indonesian, in Jakarta time', () => {
    expect(formatLongDate('2026-03-14T00:00:00Z')).toBe('Sabtu, 14 Maret 2026')
    // 17:30 UTC is already the next morning in Jakarta.
    expect(isoDay('2026-03-14T17:30:00Z')).toBe('2026-03-15')
  })

  it('builds the date badge', () => {
    expect(dateBadge('2026-03-14T00:00:00Z')).toEqual({ day: '14', month: 'MAR' })
  })

  it('decides whether an event is upcoming by calendar day', () => {
    const now = new Date('2026-03-14T10:00:00Z')
    expect(isUpcoming('2026-03-14T00:00:00Z', now)).toBe(true)
    expect(isUpcoming('2026-03-20T00:00:00Z', now)).toBe(true)
    expect(isUpcoming('2026-03-13T00:00:00Z', now)).toBe(false)
  })

  it('builds WhatsApp and phone links', () => {
    expect(whatsappUrl('6281234567890')).toBe('https://wa.me/6281234567890')
    expect(whatsappUrl('6281234567890', 'Halo & terima kasih')).toBe(
      'https://wa.me/6281234567890?text=Halo%20%26%20terima%20kasih',
    )
    expect(telHref('(021) 555-1234')).toBe('tel:0215551234')
    expect(telHref('+62 21 555 1234')).toBe('tel:+62215551234')
  })

  it('parses page numbers defensively', () => {
    expect(parsePage(undefined)).toBe(1)
    expect(parsePage('3')).toBe(3)
    expect(parsePage('0')).toBe(1)
    expect(parsePage('-2')).toBe(1)
    expect(parsePage('abc')).toBe(1)
    expect(parsePage(['4', '5'])).toBe(4)
  })

  it('escapes < in JSON-LD so it cannot close the script tag', () => {
    expect(safeJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>')
  })
})

describe('imageSource', () => {
  const media = {
    url: '/api/media/file/a.png',
    width: 2400,
    height: 1600,
    alt: 'Foto',
    sizes: {
      thumbnail: { url: '/api/media/file/a-480.webp', width: 480, height: 320 },
      card: { url: '/api/media/file/a-960.webp', width: 960, height: 640 },
      large: { url: '/api/media/file/a-1920.webp', width: 1920, height: 1280 },
    },
  }

  it('uses the preferred size for src and lists all sizes in srcSet, smallest first', () => {
    const image = imageSource(media, 'card')
    expect(image?.src).toBe('/api/media/file/a-960.webp')
    expect(image?.srcSet).toBe(
      '/api/media/file/a-480.webp 480w, /api/media/file/a-960.webp 960w, /api/media/file/a-1920.webp 1920w, /api/media/file/a.png 2400w',
    )
    expect(image?.alt).toBe('Foto')
  })

  it('falls back to the original when no sizes exist, and to null when there is no file', () => {
    expect(imageSource({ url: '/x.png', width: 10, height: 10, alt: 'x' })?.srcSet).toBeUndefined()
    expect(imageSource({ url: null, alt: 'x' })).toBeNull()
    expect(imageSource(null)).toBeNull()
  })
})
