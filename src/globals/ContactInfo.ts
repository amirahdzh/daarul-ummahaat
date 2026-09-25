import type { GlobalConfig } from 'payload'

import { whatsappNumberField } from '../fields/whatsapp'
import { validateHttpUrl, validateMapsEmbedUrl } from '../lib/validators'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  label: 'Contact information',
  admin: { group: 'Site content' },
  access: { read: () => true },
  fields: [
    { name: 'address', type: 'textarea' },
    { name: 'phone', type: 'text' },
    whatsappNumberField({
      name: 'whatsapp',
      label: 'WhatsApp number',
      admin: { description: 'Type it any way you like, for example 0812 3456 7890.' },
    }),
    { name: 'email', type: 'email' },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Google Maps link',
      validate: validateHttpUrl,
      admin: { description: 'The normal Google Maps link, used for the "open in Maps" button.' },
    },
    {
      name: 'mapsEmbedUrl',
      type: 'text',
      label: 'Google Maps embed address',
      validate: validateMapsEmbedUrl,
      admin: {
        description:
          'In Google Maps choose Share, then Embed a map, and paste only the address from src="...".',
      },
    },
  ],
}
