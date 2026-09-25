/* eslint-disable @next/next/no-img-element -- Payload already generates responsive WebP sizes at upload, so the Next.js image optimiser is not needed (and would cost CPU on a small server). */
import { imageSource } from '@/lib/media'

type Props = Parameters<typeof imageSource>[0] & object

/** A responsive, lazy-loaded image built from a Payload upload. Renders nothing if there is no image. */
export function Photo({
  media,
  prefer = 'card',
  sizes = '(min-width: 1040px) 33vw, 100vw',
  priority = false,
  className,
}: {
  media: Props | null | undefined
  prefer?: 'thumbnail' | 'card' | 'large'
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const image = imageSource(media, prefer)
  if (!image) return null
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
    />
  )
}
