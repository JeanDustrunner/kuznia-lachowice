import { Link } from 'react-router-dom'
import { CATEGORIES, SITE, galleryPath } from '../content/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__about">
          <Logo className="logo logo--footer" />
          <p className="site-footer__name">{SITE.name}</p>
          <p className="site-footer__tagline">{SITE.tagline}</p>
        </div>
        <nav aria-label="Kategorie" className="site-footer__nav">
          {CATEGORIES.map((category) => (
            <Link key={category.slug} to={galleryPath(category.slug)}>
              {category.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
