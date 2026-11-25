import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../content/types'
import { Gallery } from './Gallery'

const PHOTOS: readonly Photo[] = [
  { src: '/p/1.webp', thumb: '/p/1-t.webp', width: 1000, height: 700 },
  { src: '/p/2.webp', thumb: '/p/2-t.webp', width: 700, height: 1000 },
  { src: '/p/3.webp', thumb: '/p/3-t.webp', width: 1000, height: 700 },
]

function setup() {
  render(<Gallery photos={PHOTOS} label="Okucia" />)
  return userEvent.setup()
}

describe('Gallery', () => {
  it('shows one button per photo', () => {
    setup()
    expect(screen.getAllByRole('button', { name: /Powiększ zdjęcie/ })).toHaveLength(3)
  })

  it('gives thumbnails descriptive alt text and intrinsic size', () => {
    setup()
    const image = screen.getAllByRole('img')[1]
    expect(image).toHaveAttribute('alt', 'Okucia, zdjęcie 2 z 3')
    expect(image).toHaveAttribute('width', '700')
    expect(image).toHaveAttribute('height', '1000')
  })

  it('opens the lightbox on the clicked photo', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 2 z 3: Okucia' }))
    const dialog = screen.getByRole('dialog', { name: 'Okucia' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveTextContent('2 / 3')
  })

  it('moves forward and wraps around with the arrow keys', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 3 z 3: Okucia' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('dialog')).toHaveTextContent('1 / 3')
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('dialog')).toHaveTextContent('3 / 3')
  })

  it('moves with the on-screen buttons', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    await user.click(screen.getByRole('button', { name: 'Następne zdjęcie' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('2 / 3')
    await user.click(screen.getByRole('button', { name: 'Poprzednie zdjęcie' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('1 / 3')
  })

  it('closes with Escape and returns focus to the thumbnail', async () => {
    const user = setup()
    const opener = screen.getByRole('button', { name: 'Powiększ zdjęcie 2 z 3: Okucia' })
    await user.click(opener)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('closes with the close button', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    await user.click(screen.getByRole('button', { name: 'Zamknij' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps keyboard focus inside the open lightbox', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    const close = screen.getByRole('button', { name: 'Zamknij' })
    const lastButton = within(screen.getByRole('dialog')).getAllByRole('button').at(-1)
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(lastButton).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('pulls focus back into the lightbox when Tab is pressed from outside it', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    screen.getByRole('button', { name: 'Powiększ zdjęcie 2 z 3: Okucia' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Zamknij' })).toHaveFocus()
  })

  it('ignores arrow keys pressed with a modifier such as Alt+Left (browser Back)', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 2 z 3: Okucia' }))
    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}')
    expect(screen.getByRole('dialog')).toHaveTextContent('2 / 3')
  })

  it('closes when the backdrop is clicked but not when the photo is clicked', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('img'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when the empty space beside the photo is clicked', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    await user.click(screen.getByRole('figure'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locks page scrolling while open and restores it on close', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('shows a filmstrip of every photo under the zoomed photo, with the current one marked', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 2 z 3: Okucia' }))
    const strip = screen.getByRole('group', { name: 'Miniatury' })
    const thumbs = within(strip).getAllByRole('button', { name: /Pokaż zdjęcie/ })
    expect(thumbs).toHaveLength(3)
    expect(thumbs[1]).toHaveAttribute('aria-current', 'true')
    expect(thumbs[0]).not.toHaveAttribute('aria-current')
  })

  it('jumps to a photo when its filmstrip thumbnail is clicked', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    await user.click(screen.getByRole('button', { name: 'Pokaż zdjęcie 3' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('3 / 3')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('scrolls the filmstrip with its own arrows', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
    const strip = screen.getByRole('group', { name: 'Miniatury' }).querySelector('.filmstrip__track')
    expect(strip).not.toBeNull()
    const scrollBy = vi.fn()
    ;(strip as HTMLElement).scrollBy = scrollBy
    await user.click(screen.getByRole('button', { name: 'Przewiń miniatury w prawo' }))
    expect(scrollBy.mock.calls[0][0].left).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Przewiń miniatury w lewo' }))
    expect(scrollBy.mock.calls[1][0].left).toBeLessThan(0)
  })

  describe('swiping the zoomed photo', () => {
    function swipe(target: Element, from: [number, number], to: [number, number], fingers = 1) {
      const touches = (point: [number, number]) =>
        Array.from({ length: fingers }, () => ({ clientX: point[0], clientY: point[1] }))
      fireEvent.touchStart(target, { touches: touches(from), changedTouches: touches(from) })
      fireEvent.touchEnd(target, { touches: [], changedTouches: touches(to) })
    }

    async function openFirst() {
      const user = setup()
      await user.click(screen.getByRole('button', { name: 'Powiększ zdjęcie 1 z 3: Okucia' }))
      return within(screen.getByRole('dialog')).getByRole('img')
    }

    it('goes to the next photo on a swipe to the left', async () => {
      swipe(await openFirst(), [300, 200], [180, 210])
      expect(screen.getByRole('dialog')).toHaveTextContent('2 / 3')
    })

    it('goes to the previous photo on a swipe to the right', async () => {
      swipe(await openFirst(), [100, 200], [240, 190])
      expect(screen.getByRole('dialog')).toHaveTextContent('3 / 3')
    })

    it('ignores short or mostly vertical moves', async () => {
      const photo = await openFirst()
      swipe(photo, [200, 200], [180, 200])
      swipe(photo, [200, 100], [140, 300])
      expect(screen.getByRole('dialog')).toHaveTextContent('1 / 3')
    })

    it('leaves two-finger gestures (pinch-zoom) to the browser', async () => {
      swipe(await openFirst(), [300, 200], [100, 200], 2)
      expect(screen.getByRole('dialog')).toHaveTextContent('1 / 3')
    })
  })

  it('shows a friendly message when a category has no photos', () => {
    render(<Gallery photos={[]} label="Okucia" />)
    expect(screen.getByText(/Zdjęcia pojawią się wkrótce/)).toBeInTheDocument()
  })
})
