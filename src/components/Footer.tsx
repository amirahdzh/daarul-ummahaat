import Link from 'next/link'

import { telHref, whatsappUrl } from '@/lib/format'
import { DEFAULT_SITE_NAME, NAV_ITEMS } from '@/lib/site'
import type { ContactInfo, SiteSetting } from '@/payload-types'

export function Footer({ settings, contact }: { settings: SiteSetting; contact: ContactInfo }) {
  const name = settings.siteName || DEFAULT_SITE_NAME
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        <div>
          <div className="site-footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/emblem-light.png" alt="" width={480} height={432} />
            <span>{name}</span>
          </div>
          {settings.tagline && <p className="site-footer__blurb">{settings.tagline}</p>}
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="site-footer__title">Navigasi</h2>
          <ul className="site-footer__list">
            {NAV_ITEMS.filter((item) => item.href !== '/').map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">Kontak</h2>
          <ul className="site-footer__list">
            {contact.address && <li style={{ whiteSpace: 'pre-line' }}>{contact.address}</li>}
            {contact.phone && (
              <li>
                <a href={telHref(contact.phone)}>{contact.phone}</a>
              </li>
            )}
            {contact.whatsapp && (
              <li>
                <a href={whatsappUrl(contact.whatsapp)} rel="noopener noreferrer" target="_blank">
                  WhatsApp
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            )}
            {!contact.address && !contact.phone && !contact.whatsapp && !contact.email && (
              <li>
                <Link href="/contact">Hubungi kami</Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__title">Donasi</h2>
          <Link href="/donate" className="btn btn--donate">
            Donasi Sekarang
          </Link>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container">
          © {new Date().getFullYear()} {name}
        </div>
      </div>
    </footer>
  )
}
