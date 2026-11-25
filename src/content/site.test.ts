import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  CONTACT,
  categoriesInGroup,
  getAboutPortrait,
  getCategory,
  getCover,
  getPhotos,
} from './site'

const PUBLIC_DIR = join(process.cwd(), 'public')

describe('categories', () => {
  it('has unique slugs', () => {
    const slugs = CATEGORIES.map((category) => category.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every category at least one photo', () => {
    for (const category of CATEGORIES) {
      expect(getPhotos(category.slug).length, category.slug).toBeGreaterThan(0)
    }
  })

  it('points every cover at a photo that exists in its gallery', () => {
    for (const category of CATEGORIES) {
      const photos = getPhotos(category.slug)
      expect(category.cover, category.slug).toBeGreaterThanOrEqual(1)
      expect(category.cover, category.slug).toBeLessThanOrEqual(photos.length)
      expect(getCover(category), category.slug).toBeDefined()
    }
  })

  it('has image files on disk for every photo', () => {
    for (const category of CATEGORIES) {
      for (const photo of getPhotos(category.slug)) {
        expect(existsSync(join(PUBLIC_DIR, photo.src)), photo.src).toBe(true)
        expect(existsSync(join(PUBLIC_DIR, photo.thumb)), photo.thumb).toBe(true)
        expect(photo.width).toBeGreaterThan(0)
        expect(photo.height).toBeGreaterThan(0)
      }
    }
  })

  it('splits categories into groups without losing any', () => {
    const total =
      categoriesInGroup('kowalstwo').length +
      categoriesInGroup('drewno').length +
      categoriesInGroup('kuznia').length
    expect(total).toBe(CATEGORIES.length)
  })
})

describe('about portrait', () => {
  it('resolves to an existing photo so a re-import cannot silently drop it', () => {
    expect(getAboutPortrait()).toBeDefined()
  })
})

describe('getCategory', () => {
  it('finds a category by slug', () => {
    expect(getCategory('okucia')?.title).toBe('Okucia')
  })

  it('returns undefined for an unknown or missing slug', () => {
    expect(getCategory('nie-ma-takiej')).toBeUndefined()
    expect(getCategory(undefined)).toBeUndefined()
  })
})

describe('getPhotos', () => {
  it('returns an empty list for an unknown slug', () => {
    expect(getPhotos('nie-ma-takiej')).toEqual([])
  })
})

describe('contact details', () => {
  it('uses a dialable tel link that matches the displayed number', () => {
    expect(CONTACT.phoneHref).toMatch(/^tel:\+48\d{9}$/)
    expect(CONTACT.phoneDisplay.replace(/\s/g, '')).toBe(CONTACT.phoneHref.replace('tel:', ''))
  })

  it('has an email address', () => {
    expect(CONTACT.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  })
})
