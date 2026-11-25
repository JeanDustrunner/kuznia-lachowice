import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ALL_GALLERIES } from '../content/site'
import { isSameTabLinkClick } from '../lib/links'
import { CategoryLinks } from './CategoryLinks'
import { CaretIcon } from './Icons'

/**
 * "Galeria" in the main navigation: a button that opens a panel with every gallery.
 * Opens on click or keyboard (not hover only); closes on Escape, a click outside, or choosing a link.
 */
export function GalleryMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!isOpen) return
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return
      setIsOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  function closeOnLink(event: ReactMouseEvent<HTMLDivElement>) {
    if (isSameTabLinkClick(event)) setIsOpen(false)
  }

  return (
    <div ref={rootRef} className="gallery-menu">
      <button
        ref={toggleRef}
        type="button"
        className="gallery-menu__toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        Galeria
        <CaretIcon />
      </button>
      <div id={panelId} className="gallery-menu__panel" hidden={!isOpen} onClick={closeOnLink}>
        <Link className="gallery-menu__all" to={ALL_GALLERIES}>
          Wszystkie galerie
        </Link>
        <CategoryLinks className="cat-links cat-links--columns" />
      </div>
    </div>
  )
}
