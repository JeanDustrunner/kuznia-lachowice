import type { MouseEvent as ReactMouseEvent } from 'react'

/**
 * True when a click inside `event.currentTarget` landed on a link that navigates in this tab.
 * Ctrl/Cmd/Shift/Alt and middle clicks open a new tab or window, so menus should stay open for those.
 */
export function isSameTabLinkClick(event: ReactMouseEvent<HTMLElement>): boolean {
  const isModified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0
  if (isModified || !(event.target instanceof Element)) return false
  const link = event.target.closest('a')
  return link !== null && !link.hasAttribute('target')
}
