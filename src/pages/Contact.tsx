import { CONTACT, SITE } from '../content/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ContactPage() {
  useDocumentTitle(`Kontakt | ${SITE.name}`)

  return (
    <section className="container page-head">
      <h1>Kontakt</h1>
      <p className="page-head__lede">
        Napisz lub zadzwoń. Opisz, co ma powstać, a jeśli masz zdjęcie albo szkic, dołącz go do wiadomości.
      </p>
      <dl className="contact-list">
        <div>
          <dt>Telefon</dt>
          <dd>
            <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          </dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </dd>
        </div>
        <div>
          <dt>Facebook</dt>
          <dd>
            <a href={CONTACT.facebookPage} target="_blank" rel="noopener noreferrer">
              Facebook kuźni
              <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
            </a>
          </dd>
        </div>
        <div>
          <dt>Miejscowość</dt>
          <dd>Lachowice</dd>
        </div>
      </dl>
    </section>
  )
}
