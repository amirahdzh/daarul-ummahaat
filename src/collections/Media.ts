import type { CollectionConfig } from 'payload'

import { humaniseFilename, IMAGE_MIME_TYPES, imageSizes, photoCacheHeaders } from '../fields/upload'
import { mediaDir } from '../lib/mediaDir'

/**
 * General-purpose images: featured images, hero photo, logo, QR codes, organisation photos.
 * Gallery photos live in their own collection (see GalleryImages).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { en: 'Image', id: 'Gambar' }, plural: { en: 'Images', id: 'Gambar' } },
  admin: {
    group: { en: 'Files', id: 'Berkas' },
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      // Alt text matters for accessibility, but requiring it on every upload (a logo, a QR
      // code, a hero photo) makes the common case slower for no benefit. Fill in a reasonable
      // default from the file name instead; admins can still write a better one.
      ({ data }) => {
        if (!data.alt) data.alt = humaniseFilename(String(data.filename ?? '')) || 'Image'
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { en: 'Description (alt text)', id: 'Deskripsi (teks alt)' },
      admin: {
        description: {
          en: 'Describes the image for people who cannot see it, and for search engines. Filled in from the file name when left empty.',
          id: 'Menjelaskan gambar untuk orang yang tidak dapat melihatnya, dan untuk mesin pencari. Terisi dari nama berkas jika dikosongkan.',
        },
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
