import type { CollectionConfig } from 'payload'

import { publishedOrAdmin } from '../access'
import { advancedSection } from '../fields/advanced'
import { seoGroup } from '../fields/seo'
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
        // A new document has nothing to attach photos to yet; the box would only show "no results".
        condition: (data) => Boolean(data?.id),
        description: {
          en: 'Photos linked to this event. Use the add button here to upload a photo: it is linked to this event automatically.',
          id: 'Foto yang tertaut ke acara ini. Tekan tombol tambah di sini untuk mengunggah foto: foto otomatis tertaut ke acara ini.',
        },
      },
    },
    advancedSection([slugField('name'), seoGroup]),
  ],
}
