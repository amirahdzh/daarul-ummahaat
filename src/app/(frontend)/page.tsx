import Link from 'next/link'

import { EventCard, ProgramCard } from '@/components/Cards'
import { DonatePanel } from '@/components/DonatePanel'
import { GalleryGrid } from '@/components/GalleryGrid'
import { ArrowRight } from '@/components/icons'
import { JsonLd } from '@/components/JsonLd'
import { Photo } from '@/components/Photo'
import {
  countProgramsByCategory,
  getContactInfo,
  getFeaturedPrograms,
  getHomeGallery,
  getHomePage,
  getImpactStatistics,
  getLatestEvents,
  getProgramCategories,
  getSiteSettings,
} from '@/lib/data'
import { toGalleryItems } from '@/lib/gallery'
import { asDoc } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, DEFAULT_SITE_NAME } from '@/lib/site'

export const generateMetadata = () => pageMetadata({ path: '/' })

const DEFAULT_HEADLINE = 'Membina, mendidik, dan memberdayakan masyarakat.'
const DEFAULT_SUBHEADLINE =
  'Yayasan Daarul Ummahaat menjalankan program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat.'
const DEFAULT_DONATION_TEXT =
  'Dukung misi kami dalam membina, mendidik, dan memberdayakan masyarakat.'

export default async function HomePageRoute() {
  const [home, settings, contact, categories, programs, stats, events, gallery] = await Promise.all(
    [
      getHomePage(),
      getSiteSettings(),
      getContactInfo(),
      getProgramCategories(),
      getFeaturedPrograms(6),
      getImpactStatistics(),
      getLatestEvents(3),
      getHomeGallery(8),
    ],
  )
  const counts = await countProgramsByCategory(categories)
  const siteName = settings.siteName || DEFAULT_SITE_NAME
  const heroImage = asDoc(home.hero?.image)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NonProfitOrganization',
          name: siteName,
          url: absoluteUrl('/'),
          logo: absoluteUrl('/brand/logo-emerald.png'),
          ...(contact.email ? { email: contact.email } : {}),
          ...(contact.phone ? { telephone: contact.phone } : {}),
          ...(contact.address ? { address: contact.address } : {}),
        }}
      />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="eyebrow">{siteName}</p>
            <h1 id="hero-title" className="title-xl">
              {home.hero?.headline || DEFAULT_HEADLINE}
            </h1>
            <p className="lead">{home.hero?.subheadline || DEFAULT_SUBHEADLINE}</p>
            <div className="actions" style={{ marginTop: 8 }}>
              <Link href="/donate" className="btn btn--donate btn--lg">
                Donasi Sekarang
              </Link>
              <Link href="/programs" className="btn btn--outline btn--lg">
                Lihat Program
              </Link>
            </div>
          </div>
          <div className="arch">
            <div className={`arch__frame ${heroImage ? '' : 'motif'}`}>
              {heroImage ? (
                <Photo
                  media={heroImage}
                  prefer="large"
                  sizes="(min-width: 900px) 470px, 90vw"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/brand/emblem-emerald.png"
                  alt=""
                  width={480}
                  height={432}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    margin: 'auto',
                    width: '46%',
                    height: 'auto',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="about-title">
        <div className="container split">
          <div className="stack" style={{ '--stack': '16px' } as React.CSSProperties}>
            <p className="eyebrow">Tentang kami</p>
            <h2 id="about-title" className="title-lg">
              Siapa kami dan apa yang kami kerjakan
            </h2>
            {home.aboutSummary && <p className="lead">{home.aboutSummary}</p>}
            <p style={{ paddingTop: 8 }}>
              <Link href="/about" className="btn btn--outline">
                Pelajari Lebih Lanjut
              </Link>
            </p>
          </div>
          {categories.length > 0 && (
            <ul className="pillars" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {categories.map((category, index) => (
                <li key={category.id} className="pillar">
                  <span className="pillar__no" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="title-md">
                    <Link
                      href={`/programs?category=${category.slug}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <span className="pillar__count">{counts.get(category.id) ?? 0} program</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {programs.length > 0 && (
        <section className="section" aria-labelledby="programs-title">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="eyebrow">Program</p>
                <h2 id="programs-title" className="title-lg">
                  Program unggulan
                </h2>
              </div>
              <Link href="/programs" className="link-arrow">
                Lihat semua program <ArrowRight />
              </Link>
            </div>
            <ul className="grid grid--cards">
              {programs.map((program) => (
                <li key={program.id}>
                  <ProgramCard program={program} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section
          className="section section--dark motif motif--light on-dark"
          aria-labelledby="impact-title"
          style={{ overflow: 'hidden' }}
        >
          <div className="container">
            <h2 id="impact-title" className="eyebrow" style={{ marginBottom: 28 }}>
              Dampak kami
            </h2>
            <ul className="stats">
              {stats.map((stat) => (
                <li key={stat.id} className="stat">
                  <div className="stat__value">{stat.value}</div>
                  <div className="stat__label">{stat.label}</div>
                  {stat.description && <div className="stat__desc">{stat.description}</div>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="section" aria-labelledby="events-title">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="eyebrow">Acara</p>
                <h2 id="events-title" className="title-lg">
                  Acara terbaru
                </h2>
              </div>
              <Link href="/events" className="link-arrow">
                Lihat semua acara <ArrowRight />
              </Link>
            </div>
            <ul className="grid grid--cards">
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="section section--mist" aria-labelledby="gallery-title">
          <div className="container">
            <div className="section__head">
              <div>
                <p className="eyebrow">Galeri</p>
                <h2 id="gallery-title" className="title-lg">
                  Momen kebersamaan
                </h2>
              </div>
              <Link href="/gallery" className="link-arrow">
                Lihat galeri <ArrowRight />
              </Link>
            </div>
            <GalleryGrid items={toGalleryItems(gallery)} />
          </div>
        </section>
      )}

      <DonatePanel text={home.donationCtaText || DEFAULT_DONATION_TEXT} />
    </>
  )
}
