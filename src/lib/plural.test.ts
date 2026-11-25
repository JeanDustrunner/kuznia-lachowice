import { describe, expect, it } from 'vitest'
import { pluralPhotos } from './plural'

describe('pluralPhotos', () => {
  it.each([
    [1, '1 zdjęcie'],
    [2, '2 zdjęcia'],
    [4, '4 zdjęcia'],
    [5, '5 zdjęć'],
    [12, '12 zdjęć'],
    [14, '14 zdjęć'],
    [22, '22 zdjęcia'],
    [26, '26 zdjęć'],
    [119, '119 zdjęć'],
  ])('formats %i as "%s"', (count, expected) => {
    expect(pluralPhotos(count)).toBe(expected)
  })
})
