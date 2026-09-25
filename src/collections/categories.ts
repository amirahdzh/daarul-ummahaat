import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

const category = (
  slug: string,
  singular: string,
  plural: string,
  group: string,
): CollectionConfig => ({
  slug,
  labels: { singular, plural },
  admin: {
    group,
    useAsTitle: 'name',
    defaultColumns: ['name', 'sortOrder'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    slugField('name'),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first in filters and menus.',
      },
    },
  ],
})

export const ProgramCategories = category(
  'program-categories',
  'Program category',
  'Program categories',
  'Programs',
)
export const EventCategories = category(
  'event-categories',
  'Event category',
  'Event categories',
  'Events',
)
export const GalleryCategories = category(
  'gallery-categories',
  'Gallery category',
  'Gallery categories',
  'Gallery',
)
