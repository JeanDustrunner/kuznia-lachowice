import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SITE } from '../content/site'
import { GalleryMenu } from './GalleryMenu'
import { MenuIcon } from './Icons'
import { Logo } from './Logo'
import { MenuDrawer } from './MenuDrawer'

/** id of the big anvil on the home page; the header shows its own small anvil once this has scrolled away. */
export const HOME_EMBLEM_ID = 'emblem'

/** Tallest header (wide screens): the big anvil counts as gone once it has slid under it. */
const HEADER_OFFSET = '-72px 0px 0px 0px'
/** Where the phone layout (menu icon and drawer) ends; matches the 720px breakpoint in layout.css. */
const WIDE_SCREEN = '(min-width: 721px)'

/** True while the home page's big anvil is on screen. Without IntersectionObserver it counts as visible. */
function useEmblemVisible(isHome: boolean): boolean {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === 'undefined') return
    const emblem = document.getElementById(HOME_EMBLEM_ID)
    if (!emblem) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsVisible(entry.isIntersecting)
      },
      { rootMargin: HEADER_OFFSET },
    )
    observer.observe(emblem)
    return () => {
      observer.disconnect()
      // Leaving the home page: start from "visible" next time, so the small anvil doesn't flash.
      setIsVisible(true)
    }
  }, [isHome])

  return isVisible
}

/** Calls `onWide` when the screen grows past the phone layout while `isActive` (e.g. a phone is rotated). */
function useOnWideScreen(isActive: boolean, onWide: () => void): void {
  useEffect(() => {
    if (!isActive || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(WIDE_SCREEN)
    function onChange(event: { readonly matches: boolean }) {
      if (event.matches) onWide()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [isActive, onWide])
}

export function Header() {
  const isHome = useLocation().pathname === '/'
  const isEmblemVisible = useEmblemVisible(isHome)
  const showMark = !isHome || !isEmblemVisible

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerId = useId()
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])
  // On a wide screen the menu icon is hidden, so focus goes to the page content instead.
  const closeMenuForWideScreen = useCallback(() => {
    setIsMenuOpen(false)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [])
  useOnWideScreen(isMenuOpen, closeMenuForWideScreen)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          {showMark && <Logo className="logo logo--header" />}
          <span className="brand__name">
            Kuźnia Tradycyjna
            <span className="brand__place">Lachowice</span>
          </span>
          <span className="visually-hidden">{`: ${SITE.tagline}`}</span>
        </Link>
        <nav aria-label="Główna" className="site-nav">
          <GalleryMenu />
          <Link to="/oferta">Oferta</Link>
          <Link to="/kontakt">Kontakt</Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="icon-button menu-button"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          aria-controls={isMenuOpen ? drawerId : undefined}
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>
      {isMenuOpen && <MenuDrawer id={drawerId} onClose={closeMenu} />}
    </header>
  )
}
