import type { CollectionConfig } from 'payload'

import { publishedOrAdmin } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'
import { validateHttpUrl } from '../lib/validators'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: { en: 'Event', id: 'Acara' }, plural: { en: 'Events', id: 'Acara' } },
  admin: {
    group: { en: 'Events', id: 'Acara' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventDate', 'category', '_status'],
    listSearchableFields: ['name', 'location', 'shortDescription'],
    preview: (doc) => (typeof doc?.slug === 'string' ? previewUrl(`/events/${doc.slug}`) : null),
  },
  access: {
    read: publishedOrAdmin,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  defaultSort: '-eventDate',
  fields: [
    { name: 'name', type: 'text', required: true, label: { en: 'Event name', id: 'Nama acara' } },
    slugField('name'),
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      index: true,
      label: { en: 'Event date', id: 'Tanggal acara' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
    {
      name: 'eventTime',
      type: 'text',
      label: { en: 'Event time', id: 'Waktu acara' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Optional, for example 08.00 - 12.00 WIB.',
          id: 'Opsional, misalnya 08.00 - 12.00 WIB.',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'event-categories',
      label: { en: 'Category', id: 'Kategori' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      label: { en: 'Short description', id: 'Deskripsi singkat' },
      admin: {
        description: {
          en: 'Shown on event cards. Up to 200 characters.',
          id: 'Ditampilkan di kartu acara. Maksimal 200 karakter.',
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Featured image', id: 'Gambar unggulan' },
    },
    { name: 'location', type: 'text', label: { en: 'Location', id: 'Lokasi' } },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: { en: 'Google Maps link', id: 'Tautan Google Maps' },
      validate: validateHttpUrl,
    },
    { name: 'description', type: 'richText', label: { en: 'Description', id: 'Deskripsi' } },
    {
      name: 'registrationLink',
      type: 'text',
      label: { en: 'Registration link', id: 'Tautan pendaftaran' },
      validate: validateHttpUrl,
      admin: {
        description: {
          en: 'Optional. Leave empty if no registration is needed.',
          id: 'Opsional. Kosongkan jika tidak memerlukan pendaftaran.',
        },
      },
    },
    {
      name: 'videoLink',
      type: 'text',
      label: { en: 'Video link', id: 'Tautan video' },
      validate: validateHttpUrl,
      admin: {
        description: {
          en: 'Optional. For example a YouTube link.',
          id: 'Opsional. Misalnya tautan YouTube.',
        },
      },
    },
    {
      name: 'gallery',
      type: 'join',
      collection: 'gallery-images',
      on: 'event',
      defaultLimit: 60,
      defaultSort: 'sortOrder',
      label: { en: 'Gallery', id: 'Galeri' },
      admin: {
        description: {
          en: 'Photos linked to this event. To add one, open it in Gallery photos and choose this event.',
          id: 'Foto yang tertaut ke acara ini. Untuk menambahkan, buka di Foto galeri dan pilih acara ini.',
        },
      },
    },
    seoField,
  ],
}
