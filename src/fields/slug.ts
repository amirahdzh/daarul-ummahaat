import type { Field } from 'payload'

import { slugify } from '../lib/slugify'

/**
 * A unique, URL-safe slug. Generated from `sourceField` when left empty, and always cleaned
 * so that whatever an admin types ends up as a valid address.
 */
export const slugField = (sourceField = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Part of the page address. Filled in automatically from the name. Changing it after publishing breaks existing links.',
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
