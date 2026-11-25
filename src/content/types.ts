export interface Photo {
  readonly src: string
  readonly thumb: string
  readonly width: number
  readonly height: number
}

export type CategoryGroup = 'kowalstwo' | 'drewno' | 'kuznia'

export interface Category {
  readonly slug: string
  readonly title: string
  readonly blurb: string
  readonly group: CategoryGroup
  /** 1-based position of the cover photo inside the category gallery. */
  readonly cover: number
}

export interface OfferExtra {
  readonly title: string
  readonly text: string
}

export interface OfferGroup {
  readonly group: CategoryGroup
  readonly title: string
  readonly intro: string
  readonly extras: readonly OfferExtra[]
}

export interface Offer {
  readonly lede: string
  readonly groups: readonly OfferGroup[]
  readonly steps: readonly string[]
}

export interface Contact {
  readonly phoneDisplay: string
  readonly phoneHref: string
  readonly email: string
  readonly facebookPage: string
}
