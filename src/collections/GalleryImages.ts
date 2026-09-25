import type { CollectionConfig } from 'payload'

import { IMAGE_MIME_TYPES, imageSizes, photoCacheHeaders } from '../fields/upload'
import { mediaDir } from '../lib/mediaDir'

const humanise = (filename: string): string =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()

/**
 * Photos shown on the Gallery page. A photo can optionally be linked to a program and/or an event;
 * those pages then list their own photos automatically (see the `gallery` join field).
 */
export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: { singular: 'Gallery photo', plural: 'Gallery photos' },
  admin: {
    group: 'Gallery',
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'category', 'program', 'event', 'featured'],
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
          data.alt = data.title || data.caption || humanise(String(data.filename ?? '')) || 'Photo'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'caption',
      type: 'textarea',
      admin: { description: 'Shown under the photo in the lightbox.' },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Description (alt text)',
      admin: {
        description: 'Optional. Filled in from the title or caption when left empty.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'gallery-categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: {
        position: 'sidebar',
        description: 'Optional. Shows this photo on that program page.',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        position: 'sidebar',
        description: 'Optional. Shows this photo on that event page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on the home page',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first. Photos with the same number show newest first.',
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
