import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'

import { DraftBanner } from '@/components/DraftBanner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getContactInfo, getSiteSettings } from '@/lib/data'
import { DEFAULT_SITE_NAME, siteUrl } from '@/lib/site'

import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Content is edited in the admin at any time, so pages are rendered per request.
// Cloudflare caching in front of the site keeps this cheap (see docs/architecture-decision.md).
export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: '#007150',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = settings.siteName || DEFAULT_SITE_NAME
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s | ${name}` },
    description: settings.defaultSeo?.metaDescription || settings.tagline || undefined,
    applicationName: name,
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, contact, draft] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    draftMode(),
  ])
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>
        {draft.isEnabled && <DraftBanner />}
        <a href="#isi" className="skip-link">
          Lewati ke isi halaman
        </a>
        <Header settings={settings} />
        <main id="isi">{children}</main>
        <Footer settings={settings} contact={contact} />
      </body>
    </html>
  )
}
