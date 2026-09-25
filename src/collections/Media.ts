import type { CollectionConfig } from 'payload'

import { IMAGE_MIME_TYPES, imageSizes, photoCacheHeaders } from '../fields/upload'
import { mediaDir } from '../lib/mediaDir'

/**
 * General-purpose images: featured images, hero photo, logo, QR codes, organisation photos.
 * Gallery photos live in their own collection (see GalleryImages).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    group: 'Files',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description (alt text)',
      admin: {
        description: 'Describes the image for people who cannot see it, and for search engines.',
      },
    },
  ],
  upload: {
    staticDir: mediaDir('media'),
    mimeTypes: IMAGE_MIME_TYPES,
    imageSizes,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    modifyResponseHeaders: photoCacheHeaders,
  },
}
