import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * On every navigation (including a repeated click on the same hash link):
 * scroll to the hash target, or to the top, and for a new page move focus to
 * the main content so keyboard and screen-reader users are not left on a stale link.
 */
function ScrollManager() {
  const { key, hash } = useLocation()
  const isFirstRun = useRef(true)

  useEffect(() => {
    const firstRun = isFirstRun.current
    isFirstRun.current = false

    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
    if (!firstRun) document.getElementById('main')?.focus({ preventScroll: true })
  }, [key, hash])

  return null
}

export function Layout() {
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
