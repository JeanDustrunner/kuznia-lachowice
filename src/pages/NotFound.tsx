import { Link } from 'react-router-dom'
import { SITE } from '../content/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
  useDocumentTitle(`Nie ma takiej strony | ${SITE.name}`)

  return (
    <section className="container page-head">
      <h1>Nie ma takiej strony</h1>
      <p className="page-head__lede">Adres jest nieaktualny albo zawiera literówkę.</p>
      <p>
        <Link className="btn btn--primary" to="/">
          Wróć na stronę główną
        </Link>
      </p>
    </section>
  )
}
