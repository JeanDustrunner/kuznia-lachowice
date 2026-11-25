import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Photo } from '../content/types'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useSwipe } from '../hooks/useSwipe'
import { keepFocusInside } from '../lib/focusTrap'

interface LightboxProps {
  readonly photos: readonly Photo[]
  readonly index: number
  readonly label: string
  readonly onClose: () => void
  readonly onIndexChange: (index: number) => void
}

/** Smallest distance, in px, the thumbnail row moves per arrow click. */
const MIN_SCROLL_STEP = 240

const hasModifier = (event: KeyboardEvent): boolean => event.altKey || event.ctrlKey || event.metaKey

interface FilmstripProps {
  readonly photos: readonly Photo[]
  readonly index: number
  readonly onSelect: (index: number) => void
}

/** A scrollable row of thumbnails under the big photo, with an arrow at each end. */
function Filmstrip({ photos, index, onSelect }: FilmstripProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [index])

  function scrollTrack(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const step = Math.max(track.clientWidth * 0.8, MIN_SCROLL_STEP)
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className="filmstrip" role="group" aria-label="Miniatury">
      <button
        type="button"
        className="filmstrip__arrow"
        aria-label="Przewiń miniatury w lewo"
        onClick={() => scrollTrack(-1)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div ref={trackRef} className="filmstrip__track">
        {photos.map((photo, position) => {
          const isCurrent = position === index
          return (
            <button
              key={photo.src}
              ref={isCurrent ? currentRef : undefined}
              type="button"
              className="filmstrip__thumb"
              aria-label={`Pokaż zdjęcie ${position + 1}`}
              aria-current={isCurrent ? 'true' : undefined}
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => onSelect(position)}
            >
              <img src={photo.thumb} alt="" width={photo.width} height={photo.height} loading="lazy" />
            </button>
          )
        })}
      </div>
      <button
        type="button"
        className="filmstrip__arrow"
        aria-label="Przewiń miniatury w prawo"
        onClick={() => scrollTrack(1)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  )
}

export function Lightbox({ photos, index, label, onClose, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = photos.length
  const photo = photos[index]

  const step = useCallback(
    (delta: number) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange],
  )

  const swipeHandlers = useSwipe(step)
  useBodyScrollLock()

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (hasModifier(event)) return
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
      else if (event.key === 'Tab') keepFocusInside(event, dialogRef.current)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, step])

  if (!photo) return null

  /** Anything that is not the photo, a button or the thumbnail row counts as backdrop. */
  function closeOnBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    const { target } = event
    if (target instanceof Element && target.closest('img, button, .filmstrip')) return
    onClose()
  }

  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={closeOnBackdrop}
    >
      <p className="lightbox__count" aria-live="polite">
        {index + 1} / {total}
      </p>
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose}>
        Zamknij
      </button>
      <div className="lightbox__stage" {...swipeHandlers}>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Poprzednie zdjęcie"
          onClick={() => step(-1)}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
            <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <figure className="lightbox__figure">
          <img
            className="lightbox__image"
            src={photo.src}
            alt={`${label}, zdjęcie ${index + 1} z ${total}`}
            width={photo.width}
            height={photo.height}
          />
        </figure>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          aria-label="Następne zdjęcie"
          onClick={() => step(1)}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
            <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <Filmstrip photos={photos} index={index} onSelect={onIndexChange} />
    </div>
  )
}
