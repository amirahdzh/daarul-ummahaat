/** Optional web address. Only http and https are accepted, which blocks `javascript:` and similar. */
export const validateHttpUrl = (value: string | null | undefined): true | string => {
  if (!value) return true
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') return true
    return 'The address must start with http:// or https://'
  } catch {
    return 'Enter a full web address, for example https://example.com'
  }
}

const MAPS_EMBED_PREFIX = 'https://www.google.com/maps/embed'

/** Optional Google Maps embed address (the `src` of the iframe Google gives you). Nothing else is allowed. */
export const validateMapsEmbedUrl = (value: string | null | undefined): true | string => {
  if (!value) return true
  if (value.startsWith(MAPS_EMBED_PREFIX)) return true
  return `In Google Maps choose Share, then Embed a map, and paste only the address that starts with ${MAPS_EMBED_PREFIX}`
}

/** Optional four-digit year. */
export const validateYear = (value: number | null | undefined): true | string => {
  if (value === null || value === undefined) return true
  if (Number.isInteger(value) && value >= 1900 && value <= 2100) return true
  return 'Enter a four-digit year, for example 2024'
}
