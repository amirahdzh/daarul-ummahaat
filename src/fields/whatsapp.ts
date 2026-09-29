import type { Field, StaticLabel } from 'payload'

import { normalizeWhatsAppNumber, validateWhatsAppNumber } from '../lib/whatsapp'

type Options = {
  name: string
  label?: StaticLabel
  admin?: { description?: Record<string, string> | string }
}

/** A phone number stored in the form wa.me links need: international, digits only. */
export const whatsappNumberField = ({ name, label, admin }: Options): Field => ({
  name,
  label,
  admin,
  type: 'text',
  validate: validateWhatsAppNumber,
  hooks: {
    beforeValidate: [
      ({ value }) => (typeof value === 'string' && value ? normalizeWhatsAppNumber(value) : value),
    ],
  },
})
