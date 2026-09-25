'use client'

/* eslint-disable @next/next/no-img-element -- see Photo.tsx */
import { useCallback, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, CloseIcon } from './icons'

export type GalleryItem = {
  id: number
  alt: string
  caption?: string | null
  thumb: { src: string; srcSet?: string; width?: number; height?: number }
  large: { src: string; width?: number; height?: number }
}

/** A grid of photos that open in an accessible lightbox (native <dialog>, arrow keys, Escape). */
export function GalleryGrid({
  items,
  sizes = '(min-width: 1040px) 25vw, (min-width: 720px) 33vw, 50vw',
}: {
  items: GalleryItem[]
  sizes?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const close = useCallback(() => {
    dialog.current?.close()
    setIndex(null)
  }, [])
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  )

  const current = index === null ? null : items[index]

  return (
    <>
      <ul className="gallery">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className="gallery__item"
              onClick={() => open(i)}
              aria-label={`Perbesar foto: ${item.alt}`}
            >
              <img
                src={item.thumb.src}
                srcSet={item.thumb.srcSet}
                sizes={sizes}
                width={item.thumb.width}
                height={item.thumb.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
            {item.caption && <p className="gallery__caption">{item.caption}</p>}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox on-dark"
        aria-label="Tampilan foto"
        onClose={() => setIndex(null)}
        onClick={(event) => event.target === dialog.current && close()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') step(-1)
          if (event.key === 'ArrowRight') step(1)
        }}
      >
        {current && (
          <div className="lightbox__inner">
            <figure className="lightbox__figure">
              <img
                src={current.large.src}
                width={current.large.width}
                height={current.large.height}
                alt={current.alt}
              />
              <figcaption className="lightbox__caption" aria-live="polite">
                {current.caption || current.alt}
                <span className="visually-hidden">
                  {' '}
                  (foto {(index ?? 0) + 1} dari {items.length})
                </span>
              </figcaption>
            </figure>
            <button
              type="button"
              className="lightbox__btn lightbox__btn--close"
              onClick={close}
              aria-label="Tutup"
            >
              <CloseIcon />
            </button>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox__btn lightbox__btn--prev"
                  onClick={() => step(-1)}
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="lightbox__btn lightbox__btn--next"
                  onClick={() => step(1)}
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
