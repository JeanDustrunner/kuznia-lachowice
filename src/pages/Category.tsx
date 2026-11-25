import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Gallery } from '../components/Gallery'
import { PhoneIcon } from '../components/Icons'
import { ALL_GALLERIES, CATEGORIES, CONTACT, SITE, galleryPath, getCategory, getPhotos } from '../content/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { pluralPhotos } from '../lib/plural'
import { NotFound } from './NotFound'

/** A sideways-scrolling row of every gallery, shown on phones, with the current one scrolled into view. */
function GallerySwitcher({ current }: { readonly current: string }) {
  const listRef = useRef<HTMLUListElement>(null)
  const currentRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const list = listRef.current
    const chip = currentRef.current
    if (!list || !chip) return
    // Only scroll the row sideways; scrollIntoView would also move the page.
    list.scrollLeft = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2
  }, [current])

  return (
    <nav aria-label="Galerie" className="chips">
      <ul ref={listRef} className="chips__list">
        {CATEGORIES.map((category) => {
          const isCurrent = category.slug === current
          return (
            <li key={category.slug}>
              <Link
                ref={isCurrent ? currentRef : undefined}
                className="chip"
                to={galleryPath(category.slug)}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {category.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  useDocumentTitle(category ? `${category.title} | ${SITE.name}` : `Nie ma takiej strony | ${SITE.name}`)

  if (!category) return <NotFound />

  const photos = getPhotos(category.slug)

  return (
    <>
      <GallerySwitcher current={category.slug} />
      <section className="container page-head">
        <p className="page-head__back">
          <Link to={ALL_GALLERIES}>Wszystkie galerie</Link>
        </p>
        <h1>{category.title}</h1>
        <p className="page-head__lede">{category.blurb}</p>
        <p className="page-head__count">{pluralPhotos(photos.length)}</p>
      </section>
      <section className="container gallery-section" aria-label={`Zdjęcia: ${category.title}`}>
        <Gallery key={category.slug} photos={photos} label={category.title} />
      </section>
      <a className="call-fab only-narrow" href={CONTACT.phoneHref}>
        <PhoneIcon /> Zadzwoń
      </a>
    </>
  )
}
