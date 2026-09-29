import type { CollectionConfig, StaticLabel } from 'payload'

import { slugField } from '../fields/slug'

const category = (
  slug: string,
  singular: StaticLabel,
  plural: StaticLabel,
  group: StaticLabel,
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
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: { en: 'Name', id: 'Nama' },
    },
    slugField('name'),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Display order', id: 'Urutan tampilan' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Lower numbers come first in filters and menus.',
          id: 'Angka lebih kecil ditampilkan lebih dulu di filter dan menu.',
        },
      },
    },
  ],
})

export const ProgramCategories = category(
  'program-categories',
  { en: 'Program category', id: 'Kategori program' },
  { en: 'Program categories', id: 'Kategori program' },
  { en: 'Programs', id: 'Program' },
)
export const EventCategories = category(
  'event-categories',
  { en: 'Event category', id: 'Kategori acara' },
  { en: 'Event categories', id: 'Kategori acara' },
  { en: 'Events', id: 'Acara' },
)
export const GalleryCategories = category(
  'gallery-categories',
  { en: 'Gallery category', id: 'Kategori galeri' },
  { en: 'Gallery categories', id: 'Kategori galeri' },
  { en: 'Gallery', id: 'Galeri' },
)
