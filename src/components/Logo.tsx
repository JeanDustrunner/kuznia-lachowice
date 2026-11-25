import { assetUrl } from '../lib/assetUrl'
interface LogoProps {
  readonly className?: string
  readonly id?: string
}

/** Intrinsic size of public/img/logo.png; CSS sets the displayed width. */
const LOGO_WIDTH = 567
const LOGO_HEIGHT = 427

/**
 * The anvil, hammer and stump from the workshop's hand-drawn logo, without its
 * lettering and circle, drawn in wax colour on a transparent ground.
 * The name is set as real text next to it.
 */
export function Logo({ className = 'logo', id }: LogoProps) {
  return <img id={id} className={className} src={assetUrl('/img/logo.png')} alt="" width={LOGO_WIDTH} height={LOGO_HEIGHT} />
}
