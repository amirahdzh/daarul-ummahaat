const TIME_ZONE = 'Asia/Jakarta'
const LOCALE = 'id-ID'

const parts = (value: string | Date, options: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options }).format(new Date(value))

/** "Sabtu, 14 Maret 2026" */
export const formatLongDate = (value: string | Date): string =>
  parts(value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** "14 Mar 2026" */
export const formatShortDate = (value: string | Date): string =>
  parts(value, { day: 'numeric', month: 'short', year: 'numeric' })

/** { day: "14", month: "MAR" } for the date badge on event cards. */
export const dateBadge = (value: string | Date): { day: string; month: string } => ({
  day: parts(value, { day: 'numeric' }),
  month: parts(value, { month: 'short' }).replace('.', '').toUpperCase(),
})

/** "2026-03-14": the calendar day in Jakarta time. */
export const isoDay = (value: string | Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date(value))

/** True when the event day is today or later, in Jakarta time. */
export const isUpcoming = (eventDate: string | Date, now: Date = new Date()): boolean =>
  isoDay(eventDate) >= isoDay(now)

/** wa.me link from a stored number (digits only, international format). */
export const whatsappUrl = (number: string, message?: string | null): string => {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** tel: link that keeps only digits and a leading plus. */
export const telHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`

/** Escapes `<` so JSON can sit safely inside a <script> tag. */
export const safeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c')

/** Positive integer from a query-string value, defaulting to 1. */
export const parsePage = (value: string | string[] | undefined): number => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(page) && page > 0 && page < 10_000 ? page : 1
}
