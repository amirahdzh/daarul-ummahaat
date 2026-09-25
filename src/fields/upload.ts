import type { ImageSize } from 'payload'

/** Image formats accepted for photos. SVG is deliberately excluded because it can carry scripts. */
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Responsive sizes generated once at upload time, so the small VPS never resizes on demand
 * and Cloudflare can cache the results.
 */
export const imageSizes: ImageSize[] = [
  { name: 'thumbnail', width: 480, formatOptions: { format: 'webp', options: { quality: 78 } } },
  { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
  { name: 'large', width: 1920, formatOptions: { format: 'webp', options: { quality: 80 } } },
]

/**
 * Photos keep the same address for good (a new upload gets a new name), so browsers and Cloudflare may
 * keep them for a week. Set here rather than in the web server so it only applies to successful responses.
 */
export const photoCacheHeaders = ({ headers }: { headers: Headers }): Headers => {
  headers.set('Cache-Control', 'public, max-age=604800')
  return headers
}
