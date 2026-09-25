import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/site'

// Built on request so the address comes from SITE_URL at runtime, not at build time.
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
