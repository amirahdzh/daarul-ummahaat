import type { Field } from 'payload'

import { slugify } from '../lib/slugify'

/**
 * A unique, URL-safe slug. Generated from `sourceField` when left empty, and always cleaned
 * so that whatever an admin types ends up as a valid address.
 *
 * The admin panel also fills it in live as the admin types (SlugFieldClient.tsx), watching a
 * field named "name" specifically. If `sourceField` is ever something else, the live preview
 * just won't appear; the value below still fills it in correctly on save either way.
 */
export const slugField = (sourceField = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: {
      en: 'Part of the page address. Filled in automatically from the name. Changing it after publishing breaks existing links.',
      id: 'Bagian dari alamat halaman. Terisi otomatis dari nama. Mengubahnya setelah dipublikasikan akan merusak tautan yang sudah ada.',
    },
    components: {
      Field: './fields/SlugFieldClient.tsx#SlugFieldClient',
    },
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const typed = typeof value === 'string' ? slugify(value) : ''
        if (typed) return typed
        const source = data?.[sourceField]
        return typeof source === 'string' ? slugify(source) : undefined
      },
    ],
  },
})
