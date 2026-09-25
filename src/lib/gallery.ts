import type { GalleryItem } from '@/components/GalleryGrid'
import type { GalleryImage } from '@/payload-types'

import { imageSource } from './media'

/** Turns gallery photos into the plain data the lightbox grid needs. Skips photos without a file. */
export const toGalleryItems = (docs: GalleryImage[]): GalleryItem[] =>
  docs.flatMap((doc) => {
    const thumb = imageSource(doc, 'card')
    const large = imageSource(doc, 'large')
    if (!thumb || !large) return []
    return [{ id: doc.id, alt: thumb.alt, caption: doc.caption, thumb, large }]
  })
