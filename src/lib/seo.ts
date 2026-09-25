import type { Metadata } from 'next'

import { getSiteSettings } from './data'
import { asDoc } from './media'
import { DEFAULT_SITE_NAME } from './site'

type SeoGroup = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: unknown
  noIndex?: boolean | null
}

const ogUrl = (media: unknown): string | undefined => {
  const doc = asDoc<{
    url?: string | null
    sizes?: { large?: { url?: string | null } | null } | null
  }>(media as never)
  return doc?.sizes?.large?.url ?? doc?.url ?? undefined
}

/**
 * Page metadata: title, description, canonical address, Open Graph and robots.
 * Uses the page's own SEO group when filled in, then the given fallbacks, then the site defaults.
 */
export const pageMetadata = async ({
  title,
  description,
  path,
  seo,
  image,
}: {
  title?: string
  description?: string | null
  path: string
  seo?: SeoGroup | null
  image?: unknown
}): Promise<Metadata> => {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || DEFAULT_SITE_NAME
  const finalTitle = seo?.metaTitle || title
  const finalDescription =
    seo?.metaDescription || description || settings.defaultSeo?.metaDescription || undefined
  const shareImage =
    ogUrl(seo?.ogImage) ??
    ogUrl(image) ??
    ogUrl(settings.defaultSeo?.ogImage) ??
    '/brand/og-default.png'

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName,
      title: finalTitle ?? siteName,
      description: finalDescription,
      url: path,
      images: [{ url: shareImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle ?? siteName,
      description: finalDescription,
      images: [shareImage],
    },
  }
}
