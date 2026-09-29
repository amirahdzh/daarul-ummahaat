import { afterEach, describe, expect, it } from 'vitest'

import { isSafePreviewPath, previewSecret, previewUrl } from '@/lib/preview'

describe('previewSecret', () => {
  const original = { preview: process.env.PREVIEW_SECRET, payload: process.env.PAYLOAD_SECRET }

  afterEach(() => {
    if (original.preview === undefined) delete process.env.PREVIEW_SECRET
    else process.env.PREVIEW_SECRET = original.preview
    if (original.payload === undefined) delete process.env.PAYLOAD_SECRET
    else process.env.PAYLOAD_SECRET = original.payload
  })

  it('prefers PREVIEW_SECRET when set', () => {
    process.env.PREVIEW_SECRET = 'the-preview-secret'
    process.env.PAYLOAD_SECRET = 'the-payload-secret'
    expect(previewSecret()).toBe('the-preview-secret')
  })

  it('falls back to PAYLOAD_SECRET so no new required configuration is needed', () => {
    delete process.env.PREVIEW_SECRET
    process.env.PAYLOAD_SECRET = 'the-payload-secret'
    expect(previewSecret()).toBe('the-payload-secret')
  })

  it('never returns an empty string, even with nothing configured', () => {
    delete process.env.PREVIEW_SECRET
    delete process.env.PAYLOAD_SECRET
    expect(previewSecret()).toBeTruthy()
  })
})

describe('previewUrl', () => {
  it('builds a /preview link carrying the secret and an encoded path', () => {
    process.env.PREVIEW_SECRET = 'topsecret'
    const url = previewUrl('/programs/beasiswa kuliah')
    expect(url).toBe('/preview?secret=topsecret&path=%2Fprograms%2Fbeasiswa%20kuliah')
  })
})

describe('isSafePreviewPath', () => {
  it('accepts a normal site-relative path', () => {
    expect(isSafePreviewPath('/programs/beasiswa-kuliah')).toBe(true)
    expect(isSafePreviewPath('/')).toBe(true)
  })

  it('rejects anything that could redirect off-site or is missing', () => {
    expect(isSafePreviewPath(null)).toBe(false)
    expect(isSafePreviewPath('')).toBe(false)
    expect(isSafePreviewPath('//evil.example.com')).toBe(false)
    expect(isSafePreviewPath('https://evil.example.com')).toBe(false)
    expect(isSafePreviewPath('programs/beasiswa-kuliah')).toBe(false)
  })
})
