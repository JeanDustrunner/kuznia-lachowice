/** Polish plural for "zdjęcie": 1 zdjęcie, 2-4 zdjęcia, 5-21 zdjęć, 22-24 zdjęcia. */
export function pluralPhotos(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (count === 1) return '1 zdjęcie'
  const isFew = lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  return `${count} ${isFew ? 'zdjęcia' : 'zdjęć'}`
}
