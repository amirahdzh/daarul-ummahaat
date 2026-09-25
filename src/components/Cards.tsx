import Link from 'next/link'

import { dateBadge, formatShortDate } from '@/lib/format'
import { PROGRAM_STATUS } from '@/lib/labels'
import { asDoc } from '@/lib/media'
import type { Event, EventCategory, Program, ProgramCategory } from '@/payload-types'

import { ArrowRight, CalendarIcon, PinIcon } from './icons'
import { Photo } from './Photo'

export function ProgramCard({ program }: { program: Program }) {
  const category = asDoc<ProgramCategory>(program.category)
  const image = asDoc(program.featuredImage)
  const status = PROGRAM_STATUS[program.programStatus]
  return (
    <article className="card">
      <div className={`card__media ${image ? '' : 'motif'}`}>
        <Photo media={image} />
      </div>
      <div className="card__body">
        <div className="actions" style={{ gap: 8 }}>
          {category && <span className="chip">{category.name}</span>}
          {program.programStatus !== 'active' && (
            <span className={`chip ${status.className}`}>{status.label}</span>
          )}
        </div>
        <h3 className="card__title">
          <Link href={`/programs/${program.slug}`}>{program.name}</Link>
        </h3>
        <p className="card__text">{program.shortDescription}</p>
        <span className="card__more">
          Baca selengkapnya <ArrowRight />
        </span>
      </div>
    </article>
  )
}

export function EventCard({ event }: { event: Event }) {
  const category = asDoc<EventCategory>(event.category)
  const image = asDoc(event.featuredImage)
  const badge = dateBadge(event.eventDate)
  return (
    <article className="card">
      <div className={`card__media ${image ? '' : 'motif'}`}>
        <Photo media={image} />
        <div className="date-badge" aria-hidden="true">
          <span className="date-badge__day">{badge.day}</span>
          <span className="date-badge__month">{badge.month}</span>
        </div>
      </div>
      <div className="card__body">
        {category && <span className="chip">{category.name}</span>}
        <h3 className="card__title">
          <Link href={`/events/${event.slug}`}>{event.name}</Link>
        </h3>
        <p className="meta">
          <CalendarIcon />
          <span>
            <span className="visually-hidden">Tanggal: </span>
            {formatShortDate(event.eventDate)}
            {event.eventTime ? ` · ${event.eventTime}` : ''}
          </span>
        </p>
        {event.location && (
          <p className="meta">
            <PinIcon />
            <span>
              <span className="visually-hidden">Lokasi: </span>
              {event.location}
            </span>
          </p>
        )}
        {event.shortDescription && <p className="card__text">{event.shortDescription}</p>}
        <span className="card__more">
          Lihat detail acara <ArrowRight />
        </span>
      </div>
    </article>
  )
}
