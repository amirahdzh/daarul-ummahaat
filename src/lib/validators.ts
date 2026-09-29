import type { PayloadRequest } from 'payload'

import { t } from './i18n'

type ValidateContext = { req?: Pick<PayloadRequest, 'i18n'> }

/** Optional web address. Only http and https are accepted, which blocks `javascript:` and similar. */
export const validateHttpUrl = (
  value: string | null | undefined,
  { req }: ValidateContext = {},
): true | string => {
  if (!value) return true
  const language = req?.i18n?.language
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') return true
    return t(
      language,
      'The address must start with http:// or https://',
      'Alamat harus dimulai dengan http:// atau https://',
    )
  } catch {
    return t(
      language,
      'Enter a full web address, for example https://example.com',
      'Masukkan alamat web lengkap, misalnya https://contoh.com',
    )
  }
}

const MAPS_EMBED_PREFIX = 'https://www.google.com/maps/embed'

/** Optional Google Maps embed address (the `src` of the iframe Google gives you). Nothing else is allowed. */
export const validateMapsEmbedUrl = (
  value: string | null | undefined,
  { req }: ValidateContext = {},
): true | string => {
  if (!value) return true
  if (value.startsWith(MAPS_EMBED_PREFIX)) return true
  return t(
    req?.i18n?.language,
    `In Google Maps choose Share, then Embed a map, and paste only the address that starts with ${MAPS_EMBED_PREFIX}`,
    `Di Google Maps pilih Bagikan, lalu Sematkan peta, dan tempel hanya alamat yang dimulai dengan ${MAPS_EMBED_PREFIX}`,
  )
}

/** Optional four-digit year. */
export const validateYear = (
  value: number | null | undefined,
  { req }: ValidateContext = {},
): true | string => {
  if (value === null || value === undefined) return true
  if (Number.isInteger(value) && value >= 1900 && value <= 2100) return true
  return t(
    req?.i18n?.language,
    'Enter a four-digit year, for example 2024',
    'Masukkan tahun empat digit, misalnya 2024',
  )
}
