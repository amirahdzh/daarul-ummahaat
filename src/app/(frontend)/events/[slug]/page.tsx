import { notFound } from 'next/navigation'

import { GalleryGrid } from '@/components/GalleryGrid'
import { CalendarIcon, ClockIcon, PinIcon } from '@/components/icons'
import { JsonLd } from '@/components/JsonLd'
import { PageHead } from '@/components/PageHead'
import { Photo } from '@/components/Photo'
import { RichText } from '@/components/RichText'
import { getEventBySlug } from '@/lib/data'
import { formatLongDate, isoDay, isUpcoming } from '@/lib/format'
import { toGalleryItems } from '@/lib/gallery'
import { asDoc, imageSource } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import type { EventCategory, GalleryImage } from '@/payload-types'

type Params = Promise<{ slug: string }>

export const generateMetadata = async ({ params }: { params: Params }) => {
  const event = await getEventBySlug((await params).slug)
  if (!event) return {}
  return pageMetadata({
    title: event.name,
    description: event.shortDescription,
    path: `/events/${event.slug}`,
    seo: event.seo,
    image: event.featuredImage,
  })
}

export default async function EventPage({ params }: { params: Params }) {
  const event = await getEventBySlug((await params).slug)
  if (!event) notFound()

  const category = asDoc<EventCategory>(event.category)
  const image = asDoc(event.featuredImage)
  const upcoming = isUpcoming(event.eventDate)
  const photos = (event.gallery?.docs ?? []).filter(
    (doc): doc is GalleryImage => typeof doc === 'object',
  )
  const shareImage = imageSource(image, 'large')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.name,
          startDate: isoDay(event.eventDate),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          url: absoluteUrl(`/events/${event.slug}`),
          ...(event.shortDescription ? { description: event.shortDescription } : {}),
          ...(event.location
            ? { location: { '@type': 'Place', name: event.location, address: event.location } }
            : {}),
          ...(shareImage ? { image: absoluteUrl(shareImage.src) } : {}),
        }}
      />

      <PageHead
        title={event.name}
        eyebrow={category?.name}
        lead={event.shortDescription}
        crumbs={[{ label: 'Acara', href: '/events' }, { label: event.name }]}
      />

      <section className="section" aria-label="Detail acara">
        <div className="container stack" style={{ '--stack': '40px' } as React.CSSProperties}>
          {image && (
            <div className="media media--hero" style={{ aspectRatio: '21 / 9' }}>
              <Photo
                media={image}
                prefer="large"
                sizes="(min-width: 1440px) 1280px, 100vw"
                priority
              />
            </div>
          )}

          <div className="detail">
            <div>
              <RichText data={event.description} />
              {!event.description && (
                <p className="muted">Keterangan lengkap acara ini akan segera ditambahkan.</p>
              )}
            </div>

            <aside
              className="stack"
              style={{ '--stack': '16px' } as React.CSSProperties}
              aria-label="Informasi acara"
            >
              <div className="info-card">
                <h2>Informasi acara</h2>
                <span
                  className={`chip ${upcoming ? 'chip--solid' : 'chip--done'}`}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {upcoming ? 'Akan datang' : 'Sudah berlangsung'}
                </span>
                <p className="meta">
                  <CalendarIcon />
                  <span>{formatLongDate(event.eventDate)}</span>
                </p>
                {event.eventTime && (
                  <p className="meta">
                    <ClockIcon />
                    <span>{event.eventTime}</span>
                  </p>
                )}
                {event.location && (
                  <p className="meta">
                    <PinIcon />
                    <span>{event.location}</span>
                  </p>
                )}
              </div>
              <div className="actions" style={{ flexDirection: 'column' }}>
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    className="btn btn--primary btn--lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Daftar
                  </a>
                )}
                {event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    className="btn btn--outline btn--lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka di Google Maps
                  </a>
                )}
                {event.videoLink && (
                  <a
                    href={event.videoLink}
                    className="btn btn--outline btn--lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tonton video
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section section--mist" aria-labelledby="galeri-acara">
          <div className="container">
            <h2 id="galeri-acara" className="title-lg" style={{ marginBottom: 32 }}>
              Galeri acara
            </h2>
            <GalleryGrid items={toGalleryItems(photos)} />
          </div>
        </section>
      )}
    </>
  )
}
