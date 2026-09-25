export const DEFAULT_SITE_NAME = 'Yayasan Daarul Ummahaat'

/** Public origin of the site, without a trailing slash. */
export const siteUrl = (): string =>
  (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

export const absoluteUrl = (path: string): string =>
  `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/about' },
  { label: 'Program', href: '/programs' },
  { label: 'Acara', href: '/events' },
  { label: 'Galeri', href: '/gallery' },
  { label: 'Kontak', href: '/contact' },
] as const
