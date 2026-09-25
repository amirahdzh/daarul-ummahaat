import { normalizeWhatsAppNumber } from './whatsapp'

export type ContactFields = 'name' | 'email' | 'whatsapp' | 'message'

export type ContactInput = {
  name: string
  email: string
  whatsapp: string
  message: string
  /** Honeypot. Real visitors never see or fill it. */
  website: string
  /** When the form was shown, in milliseconds since epoch. */
  startedAt: string
}

export type ContactResult =
  | { ok: true; data: { name: string; email: string; whatsapp: string; message: string } }
  | { ok: false; reason: 'spam' }
  | { ok: false; reason: 'invalid'; errors: Partial<Record<ContactFields, string>> }

const MIN_FILL_MS = 3_000
const MAX_AGE_MS = 6 * 60 * 60 * 1000

// Removes control characters (including newlines) so a value can never inject mail headers.
const singleLine = (value: string) =>
  value
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const multiLine = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const readContactForm = (form: FormData): ContactInput => {
  const get = (key: string) => {
    const value = form.get(key)
    return typeof value === 'string' ? value : ''
  }
  return {
    name: get('name'),
    email: get('email'),
    whatsapp: get('whatsapp'),
    message: get('message'),
    website: get('website'),
    startedAt: get('startedAt'),
  }
}

/** Validates a submission and runs the cheap anti-spam checks. Pure, so it is easy to test. */
export const checkContact = (input: ContactInput, now: number = Date.now()): ContactResult => {
  // Bots fill every field, including the hidden one, and submit instantly.
  if (input.website.trim() !== '') return { ok: false, reason: 'spam' }
  const started = Number(input.startedAt)
  if (!Number.isFinite(started) || now - started < MIN_FILL_MS || now - started > MAX_AGE_MS) {
    return { ok: false, reason: 'spam' }
  }

  const name = singleLine(input.name)
  const email = singleLine(input.email)
  const whatsappRaw = singleLine(input.whatsapp)
  const message = multiLine(input.message)
  const errors: Partial<Record<ContactFields, string>> = {}

  if (name.length < 2) errors.name = 'Nama wajib diisi (minimal 2 huruf).'
  else if (name.length > 100) errors.name = 'Nama terlalu panjang (maksimal 100 huruf).'

  if (!email) errors.email = 'Email wajib diisi.'
  else if (email.length > 254 || !EMAIL.test(email))
    errors.email = 'Alamat email belum benar. Contoh: nama@domain.com'

  let whatsapp = ''
  if (whatsappRaw) {
    whatsapp = normalizeWhatsAppNumber(whatsappRaw)
    if (!/^\d{9,15}$/.test(whatsapp))
      errors.whatsapp = 'Nomor WhatsApp belum benar. Contoh: 0812 3456 7890'
  }

  if (message.length < 10) errors.message = 'Pesan wajib diisi (minimal 10 huruf).'
  else if (message.length > 2000) errors.message = 'Pesan terlalu panjang (maksimal 2000 huruf).'

  if (Object.keys(errors).length > 0) return { ok: false, reason: 'invalid', errors }
  return { ok: true, data: { name, email, whatsapp, message } }
}

/** Plain-text body for the notification email. */
export const contactEmailText = (data: {
  name: string
  email: string
  whatsapp: string
  message: string
}): string =>
  [
    `Nama: ${data.name}`,
    `Email: ${data.email}`,
    `WhatsApp: ${data.whatsapp || '-'}`,
    '',
    data.message,
    '',
    '-- Pesan ini dikirim dari formulir kontak di website.',
  ].join('\n')

export const contactEmailSubject = (name: string): string =>
  `Pesan baru dari website: ${singleLine(name).slice(0, 60)}`
