import { useRef, useState } from 'react'
import type { Photo } from '../content/types'
import { Lightbox } from './Lightbox'

interface GalleryProps {
  readonly photos: readonly Photo[]
  readonly label: string
}

export function Gallery({ photos, label }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openers = useRef<(HTMLButtonElement | null)[]>([])

  if (photos.length === 0) {
    return <p className="gallery__empty">Zdjęcia pojawią się wkrótce.</p>
  }

  function closeLightbox() {
    const lastIndex = openIndex
    setOpenIndex(null)
    if (lastIndex !== null) openers.current[lastIndex]?.focus()
  }

  return (
    <>
      <ul className="gallery">
        {photos.map((photo, index) => (
          <li key={photo.src} className="gallery__cell">
            <button
              ref={(node) => {
                openers.current[index] = node
              }}
              type="button"
              className="gallery__item"
              aria-label={`Powiększ zdjęcie ${index + 1} z ${photos.length}: ${label}`}
              onClick={() => setOpenIndex(index)}
            >
              <img
                src={photo.thumb}
                alt={`${label}, zdjęcie ${index + 1} z ${photos.length}`}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          label={label}
          onClose={closeLightbox}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  )
}
