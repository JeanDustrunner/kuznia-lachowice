import { describe, expect, test } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  test('returns the path unchanged at the site root', () => {
    expect(assetUrl('/img/logo.png', '/')).toBe('/img/logo.png')
  })

  test('adds the base path when the site lives in a subfolder', () => {
    expect(assetUrl('/img/logo.png', '/kuznia-lachowice/')).toBe('/kuznia-lachowice/img/logo.png')
  })
})
