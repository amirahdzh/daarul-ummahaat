'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'

import { NAV_ITEMS } from '@/lib/site'

import { CloseIcon, MenuIcon } from './icons'

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

export function SiteNav() {
  const pathname = usePathname()
  // The menu is open for one page only: navigating elsewhere closes it without extra state updates.
  const [openFor, setOpenFor] = useState<string | null>(null)
  const open = openFor === pathname
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenFor(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav className="nav" aria-label="Utama">
        <ul className="nav__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="nav__link"
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/donate" className="btn btn--donate" style={{ minHeight: 48 }}>
              Donasi
            </Link>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        onClick={() => setOpenFor(open ? null : pathname)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav id={panelId} className="mobile-nav" aria-label="Menu seluler" hidden={!open}>
        <div className="container">
          <ul className="mobile-nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-nav__link"
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: 8 }}>
              <Link href="/donate" className="btn btn--donate" style={{ width: '100%' }}>
                Donasi
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
