import { useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ALL_GALLERIES, CONTACT } from '../content/site'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { keepFocusInside } from '../lib/focusTrap'
import { isSameTabLinkClick } from '../lib/links'
import { CategoryLinks } from './CategoryLinks'
import { CloseIcon, PhoneIcon } from './Icons'

interface MenuDrawerProps {
  readonly id: string
  readonly onClose: () => void
}

/**
 * Phone menu: a modal panel sliding in from the right, next to the menu icon.
 * Closes with its close button, a tap on the darkened page, Escape, or choosing a link.
 */
export function MenuDrawer({ id, onClose }: MenuDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyScrollLock()

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'Tab') keepFocusInside(event, panelRef.current)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function closeOnLink(event: ReactMouseEvent<HTMLDivElement>) {
    if (isSameTabLinkClick(event)) onClose()
  }

  return (
    <div id={id} className="drawer">
      <div className="drawer__scrim" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={closeOnLink}
      >
        <div className="drawer__top">
          <span className="drawer__label" aria-hidden="true">
            Menu
          </span>
          <button ref={closeRef} type="button" className="icon-button" aria-label="Zamknij menu" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Strony" className="drawer__nav">
          <p className="drawer__heading">Galeria</p>
          <Link className="drawer__all" to={ALL_GALLERIES}>
            Wszystkie galerie
          </Link>
          <CategoryLinks className="cat-links cat-links--stacked" />
          <Link className="drawer__page" to="/oferta">
            Oferta
          </Link>
          <Link className="drawer__page" to="/kontakt">
            Kontakt
          </Link>
        </nav>

        <div className="drawer__contact">
          <a className="btn btn--primary btn--wide" href={CONTACT.phoneHref}>
            <PhoneIcon /> Zadzwoń: {CONTACT.phoneDisplay}
          </a>
          <a className="btn btn--ghost btn--wide" href={`mailto:${CONTACT.email}`}>
            E-mail: {CONTACT.email}
          </a>
          <a className="btn btn--ghost btn--wide" href={CONTACT.facebookPage} target="_blank" rel="noopener noreferrer">
            Facebook kuźni
            <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
          </a>
        </div>
      </div>
    </div>
  )
}
