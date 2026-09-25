import { describe, expect, it } from 'vitest'

import { slugify } from '@/lib/slugify'
import { validateHttpUrl, validateMapsEmbedUrl, validateYear } from '@/lib/validators'
import { normalizeWhatsAppNumber, validateWhatsAppNumber } from '@/lib/whatsapp'

describe('slugify', () => {
  it('lower-cases and joins words with hyphens', () => {
    expect(slugify('Beasiswa Kuliah')).toBe('beasiswa-kuliah')
  })

  it('handles ampersands, punctuation and apostrophes', () => {
    expect(slugify('Tahsin Tahfizh Gratis Yatim & Dhuafa')).toBe(
      'tahsin-tahfizh-gratis-yatim-dan-dhuafa',
    )
    expect(slugify("Sahur I'tikaf")).toBe('sahur-i-tikaf')
    expect(slugify('Pengajian Ibu-Ibu')).toBe('pengajian-ibu-ibu')
  })

  it('strips accents and trims stray hyphens', () => {
    expect(slugify('  Café — Ramadhān  ')).toBe('cafe-ramadhan')
  })

  it('returns an empty string when nothing usable is left', () => {
    expect(slugify('!!!')).toBe('')
  })
})

describe('validateHttpUrl', () => {
  it('accepts empty values and http(s) addresses', () => {
    expect(validateHttpUrl('')).toBe(true)
    expect(validateHttpUrl(undefined)).toBe(true)
    expect(validateHttpUrl('https://forms.gle/abc')).toBe(true)
    expect(validateHttpUrl('http://example.com/path?x=1')).toBe(true)
  })

  it('rejects script and other schemes', () => {
    expect(validateHttpUrl('javascript:alert(1)')).not.toBe(true)
    expect(validateHttpUrl('data:text/html,<script>1</script>')).not.toBe(true)
    expect(validateHttpUrl('ftp://example.com')).not.toBe(true)
  })

  it('rejects text that is not an address', () => {
    expect(validateHttpUrl('not a url')).not.toBe(true)
  })
})

describe('validateMapsEmbedUrl', () => {
  it('accepts only Google Maps embed addresses', () => {
    expect(validateMapsEmbedUrl('')).toBe(true)
    expect(validateMapsEmbedUrl('https://www.google.com/maps/embed?pb=!1m18')).toBe(true)
    expect(validateMapsEmbedUrl('https://evil.example.com/maps/embed')).not.toBe(true)
    expect(validateMapsEmbedUrl('https://www.google.com/maps/place/x')).not.toBe(true)
  })
})

describe('validateYear', () => {
  it('accepts four-digit years and empty values', () => {
    expect(validateYear(undefined)).toBe(true)
    expect(validateYear(2024)).toBe(true)
  })

  it('rejects nonsense', () => {
    expect(validateYear(24)).not.toBe(true)
    expect(validateYear(2024.5)).not.toBe(true)
    expect(validateYear(3000)).not.toBe(true)
  })
})

describe('WhatsApp numbers', () => {
  it('normalises common Indonesian formats to international digits', () => {
    expect(normalizeWhatsAppNumber('0812-3456-7890')).toBe('6281234567890')
    expect(normalizeWhatsAppNumber('+62 812 3456 7890')).toBe('6281234567890')
    expect(normalizeWhatsAppNumber('6281234567890')).toBe('6281234567890')
  })

  it('validates length after normalising', () => {
    expect(validateWhatsAppNumber('')).toBe(true)
    expect(validateWhatsAppNumber('0812 3456 7890')).toBe(true)
    expect(validateWhatsAppNumber('123')).not.toBe(true)
    expect(validateWhatsAppNumber('abc')).not.toBe(true)
  })
})
