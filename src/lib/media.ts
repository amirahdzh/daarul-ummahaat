import type { Media } from '@/payload-types'

type SizeKey = 'thumbnail' | 'card' | 'large'

export type ImageSource = {
  src: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
}

type WithSizes = Pick<Media, 'url' | 'width' | 'height'> & {
  alt?: string | null

  sizes?: Partial<
    Record<SizeKey, { url?: string | null; width?: number | null; height?: number | null }>
  > | null
}

/** Narrows a Payload upload relation (id or populated document) to a document, or null. */
export const asDoc = <T extends object>(value: number | T | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null

/**
 * Builds `src` and `srcSet` from the sizes generated at upload time.
 * `prefer` picks the size used for `src` (the rest go into `srcSet`).
 */
export const imageSource = (
  media: WithSizes | null | undefined,
  prefer: SizeKey = 'card',
): ImageSource | null => {
  if (!media?.url) return null
  const entries: { url: string; width: number }[] = []
  for (const size of Object.values(media.sizes ?? {})) {
    if (size?.url && size.width) entries.push({ url: size.url, width: size.width })
  }
  if (media.width) entries.push({ url: media.url, width: media.width })
  entries.sort((a, b) => a.width - b.width)
  const preferred = media.sizes?.[prefer]
  const src = preferred?.url ?? media.url
  return {
    src,
    srcSet: entries.length > 1 ? entries.map((e) => `${e.url} ${e.width}w`).join(', ') : undefined,
    width: preferred?.width ?? media.width ?? undefined,
    height: preferred?.height ?? media.height ?? undefined,
    alt: media.alt ?? '',
  }
}
