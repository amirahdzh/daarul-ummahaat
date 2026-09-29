import type { CollectionConfig } from 'payload'

import { humaniseFilename, IMAGE_MIME_TYPES, imageSizes, photoCacheHeaders } from '../fields/upload'
import { mediaDir } from '../lib/mediaDir'

/**
 * Photos shown on the Gallery page. A photo can optionally be linked to a program and/or an event;
 * those pages then list their own photos automatically (see the `gallery` join field).
 */
export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: {
    singular: { en: 'Gallery photo', id: 'Foto galeri' },
    plural: { en: 'Gallery photos', id: 'Foto galeri' },
  },
  admin: {
    group: { en: 'Gallery', id: 'Galeri' },
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'category', 'program', 'event', 'featured'],
    listSearchableFields: ['title', 'caption', 'alt'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Alt text is required for accessibility, but forcing it on every photo makes bulk upload
        // painful. Fall back to the title, then the caption, then the file name.
        if (!data.alt) {
          data.alt =
            data.title || data.caption || humaniseFilename(String(data.filename ?? '')) || 'Photo'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: { en: 'Title', id: 'Judul' } },
    {
      name: 'caption',
      type: 'textarea',
      label: { en: 'Caption', id: 'Keterangan' },
      admin: {
        description: {
          en: 'Shown under the photo in the lightbox.',
          id: 'Ditampilkan di bawah foto pada tampilan lightbox.',
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: { en: 'Description (alt text)', id: 'Deskripsi (teks alt)' },
      admin: {
        description: {
          en: 'Optional. Filled in from the title or caption when left empty.',
          id: 'Opsional. Terisi dari judul atau keterangan jika dikosongkan.',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'gallery-categories',
      label: { en: 'Category', id: 'Kategori' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      label: { en: 'Program', id: 'Program' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Optional. Shows this photo on that program page.',
          id: 'Opsional. Menampilkan foto ini di halaman program tersebut.',
        },
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      label: { en: 'Event', id: 'Acara' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Optional. Shows this photo on that event page.',
          id: 'Opsional. Menampilkan foto ini di halaman acara tersebut.',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Show on the home page', id: 'Tampilkan di halaman beranda' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Display order', id: 'Urutan tampilan' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Lower numbers come first. Photos with the same number show newest first.',
          id: 'Angka lebih kecil ditampilkan lebih dulu. Foto dengan angka sama diurutkan dari yang terbaru.',
        },
      },
    },
  ],
  upload: {
    staticDir: mediaDir('gallery-images'),
    mimeTypes: IMAGE_MIME_TYPES,
    imageSizes,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    modifyResponseHeaders: photoCacheHeaders,
  },
}
