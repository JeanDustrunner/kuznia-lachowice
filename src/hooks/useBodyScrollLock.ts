import { useEffect } from 'react'

/** Stops the page behind a modal from scrolling while the calling component is mounted. */
export function useBodyScrollLock(): void {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])
}
