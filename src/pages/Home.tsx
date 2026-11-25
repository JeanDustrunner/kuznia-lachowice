import { Link } from 'react-router-dom'
import { HOME_EMBLEM_ID } from '../components/Header'
import { Logo } from '../components/Logo'
import {
  ABOUT,
  ALL_GALLERIES,
  CATEGORY_GROUPS,
  CONTACT,
  GROUP_TITLES,
  SITE,
  categoriesInGroup,
  galleryPath,
  getAboutPortrait,
  getCover,
  getPhotos,
} from '../content/site'
import type { Category } from '../content/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { pluralPhotos } from '../lib/plural'

/** A screen-wide cover photo of one gallery, with its name and photo count in the corner. */
function GalleryFeature({ category }: { readonly category: Category }) {
  const cover = getCover(category)
  return (
    <li>
      <Link to={galleryPath(category.slug)} className="feature">
        {cover && (
          <img
            className="feature__img"
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="feature__caption">
          <span className="container feature__inner">
            <span className="feature__title">{category.title}</span>
            <span className="feature__blurb">{category.blurb}</span>
            <span className="feature__count">
              {pluralPhotos(getPhotos(category.slug).length)} <span aria-hidden="true">→</span>
            </span>
          </span>
        </span>
      </Link>
    </li>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero__img"
        src="/img/hero.webp"
        alt="Kute zwoje balustrady z bliska"
        width={2000}
        height={1330}
        fetchPriority="high"
      />
      <div className="container hero__content">
        <Logo id={HOME_EMBLEM_ID} className="logo logo--emblem" />
        <h1 id="hero-title">Kuźnia Tradycyjna w Lachowicach</h1>
        <p className="hero__tagline">{SITE.tagline}</p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to={ALL_GALLERIES}>
            Zobacz galerię
          </Link>
          <a className="btn btn--ghost only-narrow" href={CONTACT.phoneHref}>
            Zadzwoń
          </a>
          <Link className="btn btn--ghost only-wide" to="/kontakt">
            Napisz lub zadzwoń
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle(SITE.name)
  const portrait = getAboutPortrait()

  return (
    <>
      <Hero />

      <section className="container about" aria-labelledby="about-title">
        {portrait && (
          <figure className="about__figure">
            <img
              src={portrait.src}
              alt="Kowal przy kowadle, w tle palenisko"
              width={portrait.width}
              height={portrait.height}
              loading="lazy"
            />
          </figure>
        )}
        <div className="about__text">
          <h2 id="about-title">Kuźnia w Lachowicach</h2>
          {ABOUT.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <Link className="text-link" to="/oferta">
              Co robię: oferta
            </Link>
          </p>
        </div>
      </section>

      <section id="galeria" className="features" aria-labelledby="galeria-title">
        <div className="container">
          <h2 id="galeria-title">Galeria</h2>
        </div>
        {CATEGORY_GROUPS.map((group) => (
          <div key={group} className="features__group">
            <h3 className="container features__group-title">{GROUP_TITLES[group]}</h3>
            <ul className="features__list">
              {categoriesInGroup(group).map((category) => (
                <GalleryFeature key={category.slug} category={category} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <h2>Masz pomysł? Napisz lub zadzwoń.</h2>
          <p>Opisz, czego potrzebujesz, a Adam odpisze. Zadzwonić możesz pod numer {CONTACT.phoneDisplay}.</p>
          <Link className="btn btn--primary" to="/kontakt">
            Kontakt
          </Link>
        </div>
      </section>
    </>
  )
}
