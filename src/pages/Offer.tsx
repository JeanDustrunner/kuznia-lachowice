import { Link } from 'react-router-dom'
import { CONTACT, OFFER, SITE, categoriesInGroup, galleryPath, getCover } from '../content/site'
import type { Category, OfferGroup } from '../content/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function OfferCategory({ category }: { readonly category: Category }) {
  const cover = getCover(category)
  return (
    <li className="offer__item">
      {cover && (
        <img
          className="offer__img"
          src={cover.thumb}
          alt=""
          width={cover.width}
          height={cover.height}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="offer__text">
        <h3>{category.title}</h3>
        <p>{category.blurb}</p>
        <Link className="text-link" to={galleryPath(category.slug)}>
          Zdjęcia<span className="visually-hidden">: {category.title}</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
    </li>
  )
}

function OfferSection({ section }: { readonly section: OfferGroup }) {
  const headingId = `offer-${section.group}`
  return (
    <section className="offer__group" aria-labelledby={headingId}>
      <h2 id={headingId}>{section.title}</h2>
      <p className="offer__intro">{section.intro}</p>
      <ul className="offer__list">
        {categoriesInGroup(section.group).map((category) => (
          <OfferCategory key={category.slug} category={category} />
        ))}
        {section.extras.map((extra) => (
          <li key={extra.title} className="offer__item offer__item--plain">
            <div className="offer__text">
              <h3>{extra.title}</h3>
              <p>{extra.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function OfferPage() {
  useDocumentTitle(`Oferta | ${SITE.name}`)

  return (
    <>
      <section className="container page-head">
        <h1>Oferta</h1>
        <p className="page-head__lede">{OFFER.lede}</p>
      </section>
      <div className="container offer">
        {OFFER.groups.map((section) => (
          <OfferSection key={section.group} section={section} />
        ))}
        <section className="offer__how" aria-labelledby="offer-how">
          <h2 id="offer-how">Jak zamówić</h2>
          <ol>
            {OFFER.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="offer__actions">
            <Link className="btn btn--primary" to="/kontakt">
              Kontakt
            </Link>
            <a className="btn btn--ghost" href={CONTACT.phoneHref}>
              Zadzwoń: {CONTACT.phoneDisplay}
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
