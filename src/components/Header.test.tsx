import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { CATEGORIES, CONTACT } from '../content/site'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

const header = () => screen.getByRole('banner')
const mainNav = () => screen.getByRole('navigation', { name: 'Główna' })

describe('main navigation (wide screens)', () => {
  it('has Galeria, Oferta and Kontakt, with Z życia kuźni moved into Galeria', () => {
    renderAt('/kontakt')
    expect(within(mainNav()).getByRole('button', { name: 'Galeria' })).toHaveAttribute('aria-expanded', 'false')
    expect(within(mainNav()).getByRole('link', { name: 'Oferta' })).toHaveAttribute('href', '/oferta')
    expect(within(mainNav()).getByRole('link', { name: 'Kontakt' })).toHaveAttribute('href', '/kontakt')
    expect(within(mainNav()).queryByRole('link', { name: 'Z życia kuźni' })).not.toBeInTheDocument()
  })

  it('opens the Galeria panel with every gallery, grouped, and a link to all of them', async () => {
    const user = renderAt('/kontakt')
    const toggle = within(mainNav()).getByRole('button', { name: 'Galeria' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '') as HTMLElement
    expect(panel).not.toBeNull()
    expect(within(panel).getByRole('link', { name: 'Wszystkie galerie' })).toHaveAttribute('href', '/#galeria')
    for (const category of CATEGORIES) {
      expect(within(panel).getByRole('link', { name: category.title })).toHaveAttribute(
        'href',
        `/galeria/${category.slug}`,
      )
    }
    expect(panel).toHaveTextContent('Kowalstwo')
    expect(panel).toHaveTextContent('Kuźnia od środka')
  })

  it('closes the panel with Escape and returns focus to the toggle', async () => {
    const user = renderAt('/kontakt')
    const toggle = within(mainNav()).getByRole('button', { name: 'Galeria' })
    await user.click(toggle)
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the panel on a click outside it', async () => {
    const user = renderAt('/kontakt')
    const toggle = within(mainNav()).getByRole('button', { name: 'Galeria' })
    await user.click(toggle)
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the panel after choosing a gallery', async () => {
    const user = renderAt('/kontakt')
    const toggle = within(mainNav()).getByRole('button', { name: 'Galeria' })
    await user.click(toggle)
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '') as HTMLElement
    await user.click(within(panel).getByRole('link', { name: 'Okucia' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Okucia' })).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('menu drawer (phones)', () => {
  it('opens from the menu icon as a dialog with galleries, the offer and contact', async () => {
    const user = renderAt('/kontakt')
    const menuButton = within(header()).getByRole('button', { name: 'Menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    const drawer = screen.getByRole('dialog', { name: 'Menu' })
    for (const category of CATEGORIES) {
      expect(within(drawer).getByRole('link', { name: category.title })).toHaveAttribute(
        'href',
        `/galeria/${category.slug}`,
      )
    }
    expect(within(drawer).getByRole('link', { name: 'Oferta' })).toHaveAttribute('href', '/oferta')
    expect(within(drawer).getByRole('link', { name: /Zadzwoń/ })).toHaveAttribute('href', CONTACT.phoneHref)
    expect(within(drawer).getByRole('link', { name: /E-mail/ })).toHaveAttribute('href', `mailto:${CONTACT.email}`)
    expect(within(drawer).getByRole('link', { name: /Facebook/ })).toHaveAttribute('target', '_blank')
  })

  it('moves focus into the drawer and locks the page behind it', async () => {
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    expect(screen.getByRole('button', { name: 'Zamknij menu' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('keeps Tab inside the drawer', async () => {
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    const close = screen.getByRole('button', { name: 'Zamknij menu' })
    await user.tab({ shift: true })
    expect(screen.getByRole('dialog', { name: 'Menu' })).toContainElement(document.activeElement as HTMLElement)
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('closes with Escape and returns focus to the menu icon', async () => {
    const user = renderAt('/kontakt')
    const menuButton = within(header()).getByRole('button', { name: 'Menu' })
    await user.click(menuButton)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
    expect(menuButton).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes with the close button and with a tap on the darkened page', async () => {
    const user = renderAt('/kontakt')
    const menuButton = within(header()).getByRole('button', { name: 'Menu' })
    await user.click(menuButton)
    await user.click(screen.getByRole('button', { name: 'Zamknij menu' }))
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()

    await user.click(menuButton)
    await user.click(document.querySelector('.drawer__scrim') as HTMLElement)
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
  })

  it('moves focus to the page content after choosing a link', async () => {
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', { name: 'Okucia' }))
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('keeps a new-tab click (Ctrl+click) from closing the drawer', async () => {
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    const link = within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', { name: 'Okucia' })
    link.addEventListener('click', (event) => event.preventDefault()) // the browser would open a tab instead
    await user.keyboard('{Control>}')
    await user.click(link)
    await user.keyboard('{/Control}')
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
  })

  it('closes when the screen becomes wide (phone rotated, window resized)', async () => {
    let onChange: ((event: { matches: boolean }) => void) | undefined
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (_type: string, listener: typeof onChange) => {
        onChange = listener
      },
      removeEventListener: () => {},
    }))
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    act(() => onChange?.({ matches: true }))
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    vi.unstubAllGlobals()
  })

  it('closes after choosing a link', async () => {
    const user = renderAt('/kontakt')
    await user.click(within(header()).getByRole('button', { name: 'Menu' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', { name: 'Prezenty' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Prezenty' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })
})

describe('anvil in the header', () => {
  type ObserverCallback = (entries: ReadonlyArray<{ isIntersecting: boolean }>) => void
  let observerCallback: ObserverCallback | undefined

  afterEach(() => {
    vi.unstubAllGlobals()
    observerCallback = undefined
  })

  function stubObserver() {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: ObserverCallback) {
          observerCallback = callback
        }
        observe() {}
        disconnect() {}
      },
    )
  }

  const headerLogo = () => header().querySelector('img[src="/img/logo.png"]')

  it('shows the anvil on inner pages', () => {
    renderAt('/kontakt')
    expect(headerLogo()).not.toBeNull()
  })

  it('on the home page, shows it only after the big anvil has scrolled away', () => {
    stubObserver()
    renderAt('/')
    expect(headerLogo()).toBeNull()
    act(() => observerCallback?.([{ isIntersecting: false }]))
    expect(headerLogo()).not.toBeNull()
    act(() => observerCallback?.([{ isIntersecting: true }]))
    expect(headerLogo()).toBeNull()
  })

  it('does not flash the small anvil when coming back to the home page', async () => {
    stubObserver()
    const user = renderAt('/')
    act(() => observerCallback?.([{ isIntersecting: false }]))
    await user.click(within(mainNav()).getByRole('link', { name: 'Oferta' }))
    await user.click(within(header()).getByRole('link', { name: /Kuźnia Tradycyjna/ }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kuźnia Tradycyjna w Lachowicach')
    expect(headerLogo()).toBeNull()
  })
})
