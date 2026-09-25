import Link from 'next/link'

import { asDoc } from '@/lib/media'
import { DEFAULT_SITE_NAME } from '@/lib/site'
import type { SiteSetting } from '@/payload-types'

import { Photo } from './Photo'
import { SiteNav } from './SiteNav'

export function Header({ settings }: { settings: SiteSetting }) {
  const name = settings.siteName || DEFAULT_SITE_NAME
  const logo = asDoc(settings.logo)
  const short = name.replace(/^Yayasan\s+/i, '')
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="brand" aria-label={`${name}, beranda`}>
          {logo ? (
            <Photo media={logo} prefer="thumbnail" sizes="160px" priority className="brand__mark" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/brand/emblem-emerald.png"
              alt=""
              width={480}
              height={432}
              className="brand__mark"
            />
          )}
          <span className="brand__name">
            {short !== name && <small>Yayasan</small>}
            {short}
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  )
}
