'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import {
  checkContact,
  contactEmailSubject,
  contactEmailText,
  readContactForm,
  type ContactFields,
} from '@/lib/contact'
import { createRateLimiter } from '@/lib/rateLimit'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<ContactFields, string>>
  /** Echoed back so the visitor does not have to retype after an error. */
  values?: { name: string; email: string; whatsapp: string; message: string }
}

// 5 messages per visitor per 15 minutes.
const allow = createRateLimiter(5, 15 * 60 * 1000)

const GENERIC_ERROR =
  'Pesan belum terkirim. Silakan coba lagi sebentar lagi, atau hubungi kami lewat WhatsApp.'

export async function sendContactMessage(
  _previous: ContactState,
  form: FormData,
): Promise<ContactState> {
  const input = readContactForm(form)
  const values = {
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    message: input.message,
  }

  const result = checkContact(input)
  if (!result.ok) {
    if (result.reason === 'spam') {
      // Look successful to bots so they learn nothing, but send nothing.
      return { status: 'success', message: 'Terima kasih. Pesan Anda sudah kami terima.' }
    }
    return {
      status: 'error',
      message: 'Mohon periksa kembali isian yang ditandai.',
      errors: result.errors,
      values,
    }
  }

  const requestHeaders = await headers()
  const visitor =
    requestHeaders.get('cf-connecting-ip') ??
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (!allow(visitor)) {
    return {
      status: 'error',
      message: 'Terlalu banyak pesan dalam waktu singkat. Silakan coba lagi nanti.',
      values,
    }
  }

  try {
    const payload = await getPayload({ config: await config })
    const contact = await payload.findGlobal({
      slug: 'contact-info',
      depth: 0,
      overrideAccess: false,
    })
    const to = contact.email || process.env.CONTACT_TO_EMAIL
    if (!to) {
      payload.logger.error(
        'Contact form: no recipient. Set an email in Contact information or CONTACT_TO_EMAIL.',
      )
      return { status: 'error', message: GENERIC_ERROR, values }
    }
    await payload.sendEmail({
      to,
      replyTo: result.data.email,
      subject: contactEmailSubject(result.data.name),
      text: contactEmailText(result.data),
    })
    return {
      status: 'success',
      message: 'Terima kasih. Pesan Anda sudah kami terima dan akan segera kami balas.',
    }
  } catch (error) {
    console.error('Contact form: sending failed', error)
    return { status: 'error', message: GENERIC_ERROR, values }
  }
}
