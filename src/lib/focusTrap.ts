const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Call on Tab inside a modal: wraps focus at both ends of `container`
 * and pulls it back in if it ever sits outside.
 */
export function keepFocusInside(event: KeyboardEvent, container: HTMLElement | null): void {
  const items = container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
  if (items.length === 0) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const isOutside = !container?.contains(active)

  if (isOutside || (event.shiftKey && active === first)) {
    event.preventDefault()
    ;(event.shiftKey ? last : first).focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
