import type { GlobalConfig } from 'payload'

import { whatsappNumberField } from '../fields/whatsapp'
import { validateHttpUrl, validateMapsEmbedUrl } from '../lib/validators'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  label: { en: 'Contact information', id: 'Informasi kontak' },
  admin: { group: { en: 'Site content', id: 'Konten situs' } },
  access: { read: () => true },
  fields: [
    { name: 'address', type: 'textarea', label: { en: 'Address', id: 'Alamat' } },
    { name: 'phone', type: 'text', label: { en: 'Phone', id: 'Telepon' } },
    whatsappNumberField({
      name: 'whatsapp',
      label: { en: 'WhatsApp number', id: 'Nomor WhatsApp' },
      admin: {
        description: {
          en: 'Type it any way you like, for example 0812 3456 7890.',
          id: 'Ketik dengan cara apa pun, misalnya 0812 3456 7890.',
        },
      },
    }),
    { name: 'email', type: 'email', label: { en: 'Email', id: 'Email' } },
    {
      name: 'mapsUrl',
      type: 'text',
      label: { en: 'Google Maps link', id: 'Tautan Google Maps' },
      validate: validateHttpUrl,
      admin: {
        description: {
          en: 'The normal Google Maps link, used for the "open in Maps" button.',
          id: 'Tautan Google Maps biasa, digunakan untuk tombol "buka di Maps".',
        },
      },
    },
    {
      name: 'mapsEmbedUrl',
      type: 'text',
      label: { en: 'Google Maps embed address', id: 'Alamat sematan Google Maps' },
      validate: validateMapsEmbedUrl,
      admin: {
        description: {
          en: 'In Google Maps choose Share, then Embed a map, and paste only the address from src="...".',
          id: 'Di Google Maps pilih Bagikan, lalu Sematkan peta, dan tempel hanya alamat dari src="...".',
        },
      },
    },
  ],
}
