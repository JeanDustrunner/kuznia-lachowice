import { useRef } from 'react'
import type { TouchEvent as ReactTouchEvent } from 'react'

/** Shortest horizontal move, in px, that counts as a swipe. */
const MIN_DISTANCE = 50
/** The move must be this many times wider than it is tall, so vertical scrolls are not swipes. */
const MIN_RATIO = 1.5

interface SwipeHandlers {
  readonly onTouchStart: (event: ReactTouchEvent) => void
  readonly onTouchEnd: (event: ReactTouchEvent) => void
}

/**
 * One-finger horizontal swipes. `onSwipe(1)` for a swipe to the left (next), `-1` to the right.
 * Any gesture that ever uses two fingers is left alone, so pinch-zoom keeps working.
 */
export function useSwipe(onSwipe: (direction: 1 | -1) => void): SwipeHandlers {
  const start = useRef<{ readonly x: number; readonly y: number } | null>(null)

  function onTouchStart(event: ReactTouchEvent) {
    const touch = event.touches[0]
    start.current = event.touches.length === 1 && touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  function onTouchEnd(event: ReactTouchEvent) {
    const from = start.current
    const touch = event.changedTouches[0]
    start.current = null
    if (!from || !touch) return
    const dx = touch.clientX - from.x
    const dy = touch.clientY - from.y
    if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * MIN_RATIO) return
    onSwipe(dx < 0 ? 1 : -1)
  }

  return { onTouchStart, onTouchEnd }
}
