import type { PayloadRequest } from 'payload'

import { t } from './i18n'

/**
 * Normalises an Indonesian WhatsApp number to the international digits-only form that wa.me links need.
 * "0812-3456-7890", "+62 812 3456 7890" and "62812345678890" all become "6281234567890"-style values.
 */
export const normalizeWhatsAppNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  return digits
}

export const validateWhatsAppNumber = (
  value: string | null | undefined,
  { req }: { req?: Pick<PayloadRequest, 'i18n'> } = {},
): true | string => {
  if (!value) return true
  const normalised = normalizeWhatsAppNumber(value)
  if (/^\d{9,15}$/.test(normalised)) return true
  return t(
    req?.i18n?.language,
    'Enter a valid phone number, for example 0812 3456 7890',
    'Masukkan nomor telepon yang valid, misalnya 0812 3456 7890',
  )
}
