import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { CATEGORIES, CONTACT, SITE } from './content/site'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('home page', () => {
  it('introduces the forge', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kuźnia Tradycyjna w Lachowicach')
    expect(screen.getByText(/mam na imię Adam/)).toBeInTheDocument()
  })

  it('puts the anvil and the name on the photo', () => {
    renderAt('/')
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')
    expect(hero).not.toBeNull()
    const photo = within(hero as HTMLElement).getByRole('img', { name: 'Kute zwoje balustrady z bliska' })
    expect(photo).toHaveAttribute('src', '/img/hero.webp')
    expect((hero as HTMLElement).querySelector('img[src="/img/logo.png"]')).not.toBeNull()
  })

  it('offers the gallery, a call button for phones and the contact page for computers', () => {
    renderAt('/')
    const hero = screen.getByRole('heading', { level: 1 }).closest('section') as HTMLElement
    expect(within(hero).getByRole('link', { name: 'Zobacz galerię' })).toHaveAttribute('href', '/#galeria')
    expect(within(hero).getByRole('link', { name: 'Zadzwoń' })).toHaveAttribute('href', CONTACT.phoneHref)
    expect(within(hero).getByRole('link', { name: 'Napisz lub zadzwoń' })).toHaveAttribute('href', '/kontakt')
  })

  it('links to every gallery, with its photo count, from the gallery section', () => {
    renderAt('/')
    const gallery = screen.getByRole('region', { name: 'Galeria' })
    for (const category of CATEGORIES) {
      const link = within(gallery).getByRole('link', { name: new RegExp(category.title) })
      expect(link).toHaveAttribute('href', `/galeria/${category.slug}`)
      expect(link).toHaveTextContent(/\d+ zdję/)
    }
  })

  it("places the gallery after Adam's introduction", () => {
    renderAt('/')
    const about = screen.getByRole('heading', { name: 'Kuźnia w Lachowicach' })
    const gallery = screen.getByRole('heading', { level: 2, name: 'Galeria' })
    expect(about.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('sets the document title', () => {
    renderAt('/')
    expect(document.title).toBe(SITE.name)
  })
})

describe('category page', () => {
  it('shows the category heading, blurb and gallery', () => {
    renderAt('/galeria/okucia')
    expect(screen.getByRole('heading', { level: 1, name: 'Okucia' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Powiększ zdjęcie/ }).length).toBeGreaterThan(0)
    expect(document.title).toBe(`Okucia | ${SITE.name}`)
  })

  it('redirects the old /prace/ address to the gallery', () => {
    renderAt('/prace/okucia')
    expect(screen.getByRole('heading', { level: 1, name: 'Okucia' })).toBeInTheDocument()
  })

  it('lets you switch to another gallery and marks the current one', () => {
    renderAt('/galeria/okucia')
    const switcher = screen.getByRole('navigation', { name: 'Galerie' })
    expect(within(switcher).getAllByRole('link')).toHaveLength(CATEGORIES.length)
    expect(within(switcher).getByRole('link', { name: 'Okucia' })).toHaveAttribute('aria-current', 'page')
    expect(within(switcher).getByRole('link', { name: 'Prezenty' })).not.toHaveAttribute('aria-current')
  })

  it('offers a call button', () => {
    renderAt('/galeria/okucia')
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Zadzwoń' })).toHaveAttribute(
      'href',
      CONTACT.phoneHref,
    )
  })

  it('links back to all galleries', () => {
    renderAt('/galeria/okucia')
    expect(screen.getByRole('link', { name: 'Wszystkie galerie' })).toHaveAttribute('href', '/#galeria')
  })

  it('shows a not-found page for an unknown category', () => {
    renderAt('/galeria/nie-ma-takiej')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Nie ma takiej strony/)
    expect(screen.getByRole('link', { name: /Wróć na stronę główną/ })).toHaveAttribute('href', '/')
  })
})

describe('offer page', () => {
  it('describes the work and links each kind of work to its gallery', () => {
    renderAt('/oferta')
    expect(screen.getByRole('heading', { level: 1, name: 'Oferta' })).toBeInTheDocument()
    expect(document.title).toBe(`Oferta | ${SITE.name}`)
    for (const category of CATEGORIES.filter((c) => c.group !== 'kuznia')) {
      expect(screen.getByRole('link', { name: `Zdjęcia: ${category.title}` })).toHaveAttribute(
        'href',
        `/galeria/${category.slug}`,
      )
    }
  })

  it('ends with a way to get in touch', () => {
    renderAt('/oferta')
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Kontakt' })).toHaveAttribute(
      'href',
      '/kontakt',
    )
  })
})

describe('contact page', () => {
  it('shows a dialable phone number and the email address', () => {
    renderAt('/kontakt')
    expect(screen.getByRole('link', { name: CONTACT.phoneDisplay })).toHaveAttribute('href', CONTACT.phoneHref)
    expect(screen.getByRole('link', { name: CONTACT.email })).toHaveAttribute('href', `mailto:${CONTACT.email}`)
  })

  it('opens Facebook links in a new tab safely', () => {
    renderAt('/kontakt')
    const link = within(screen.getByRole('main')).getByRole('link', { name: /Facebook/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})

describe('navigation', () => {
  it('closes an open lightbox when the route changes to another category', async () => {
    const user = userEvent.setup()
    renderAt('/galeria/prezenty')
    await user.click(screen.getByRole('button', { name: /Powiększ zdjęcie 2 z/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Navigate while the lightbox is still open (what browser Back does).
    await user.click(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Okucia' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('moves focus to the main content after navigating to a new page', async () => {
    const user = userEvent.setup()
    renderAt('/kontakt')
    await user.click(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Okucia' }))
    expect(screen.getByRole('main')).toHaveFocus()
  })
})

describe('site chrome', () => {
  it('renders the navigation and a footer on every page', () => {
    renderAt('/kontakt')
    expect(screen.getByRole('navigation', { name: 'Główna' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
