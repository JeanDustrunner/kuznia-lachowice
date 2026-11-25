import type { ReactNode } from 'react'

/** Small line icons. All are decorative: the button or link around them carries the name. */

interface IconProps {
  readonly size?: number
}

function Svg({ size = 22, children }: IconProps & { readonly children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
    </Svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
    </Svg>
  )
}

export function CaretIcon(props: IconProps) {
  return (
    <Svg size={14} {...props}>
      <path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </Svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg size={18} {...props}>
      <path
        d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"
        fill="currentColor"
      />
    </Svg>
  )
}
