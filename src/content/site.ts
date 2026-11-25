import galleryData from './gallery.json'
import type { Category, CategoryGroup, Contact, Offer, Photo } from './types'

export const SITE = {
  name: 'Kuźnia Tradycyjna Lachowice',
  tagline: 'Kowalstwo, metaloplastyka, spawalnictwo',
  description:
    'Kuźnia Tradycyjna w Lachowicach: ręcznie kute bramy, balustrady, okucia i prezenty oraz snycerstwo i meble z drewna.',
} as const

export const CONTACT: Contact = {
  phoneDisplay: '+48 507 336 352',
  phoneHref: 'tel:+48507336352',
  email: 'grindkomar@interia.pl',
  facebookPage: 'https://www.facebook.com/kuznialachowice',
}

/** Adam's own words, lightly corrected, from the old home page. */
export const ABOUT: readonly string[] = [
  'Cześć, mam na imię Adam. Zajmuję się kowalstwem oraz metaloplastyką. Zdarza mi się również popracować z drewnem, a ostatnio zacząłem odkrywać snycerstwo. Bardzo to lubię.',
  'Czasami pomagają mi w tym przyjaciele oraz moja narzeczona Natalia. Jeśli chcesz, żebyśmy coś dla Ciebie stworzyli, zapraszam do kontaktu.',
]

/** Order in which the groups appear on the home page, in menus and on the offer page. */
export const CATEGORY_GROUPS: readonly CategoryGroup[] = ['kowalstwo', 'drewno', 'kuznia']

/** Address of one gallery page. */
export function galleryPath(slug: string): string {
  return `/galeria/${slug}`
}

/** The gallery section on the home page, which lists every gallery. */
export const ALL_GALLERIES = { pathname: '/', hash: '#galeria' } as const

export const GROUP_TITLES: Readonly<Record<CategoryGroup, string>> = {
  kowalstwo: 'Kowalstwo',
  drewno: 'Drewno',
  kuznia: 'Kuźnia od środka',
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'bramy-i-ogrodzenia',
    title: 'Bramy i ogrodzenia',
    blurb: 'Bramy, furtki i ogrodzenia z kutymi detalami: słoneczniki, pajęczyna, małe figurki.',
    group: 'kowalstwo',
    cover: 8,
  },
  {
    slug: 'balustrady-i-kraty',
    title: 'Balustrady i kraty',
    blurb: 'Balustrady, barierki i kraty ze zwojami, różami i ręcznie wiązanymi splotami.',
    group: 'kowalstwo',
    cover: 10,
  },
  {
    slug: 'okucia',
    title: 'Okucia',
    blurb: 'Zawiasy, zasuwy, uchwyty i wieszaki do drzwi, skrzyń i wnętrz.',
    group: 'kowalstwo',
    cover: 3,
  },
  {
    slug: 'piece-i-grille',
    title: 'Piece, grille i przybory kominkowe',
    blurb: 'Piecyki, grille na trójnogu i narzędzia do kominka.',
    group: 'kowalstwo',
    cover: 11,
  },
  {
    slug: 'prezenty',
    title: 'Prezenty',
    blurb: 'Kute róże, serca z podków, świeczniki i drobne rzeczy na pamiątkę.',
    group: 'kowalstwo',
    cover: 6,
  },
  {
    slug: 'snycerstwo',
    title: 'Snycerstwo',
    blurb: 'Rzeźbione rozety i ornamenty w drewnie, belki, deski i świeczniki.',
    group: 'drewno',
    cover: 2,
  },
  {
    slug: 'meble-nowe',
    title: 'Meble nowe',
    blurb: 'Ławy, stoły, krzesła i regały z drewna i kutego żelaza.',
    group: 'drewno',
    cover: 1,
  },
  {
    slug: 'meble-rewitalizowane',
    title: 'Meble odnowione',
    blurb: 'Stare szafy, komody i kołyski przywrócone do życia.',
    group: 'drewno',
    cover: 9,
  },
  {
    slug: 'z-zycia-kuzni',
    title: 'Z życia kuźni',
    blurb: 'Pokazy, spotkania i zwykły dzień przy palenisku.',
    group: 'kuznia',
    cover: 14,
  },
]

/**
 * Offer page. DRAFT written for the demo from what the site already shows; Adam should read and correct it.
 * Each group lists its galleries automatically; `extras` are services without a gallery of their own.
 */
export const OFFER: Offer = {
  lede: 'Kuję, spawam i rzeźbię na zamówienie: od zawiasu do skrzyni po bramę wjazdową. Poniżej to, czym zajmuję się najczęściej. Jeśli Twojego pomysłu tu nie ma, po prostu zapytaj.',
  groups: [
    {
      group: 'kowalstwo',
      title: 'Kowalstwo i metaloplastyka',
      intro: 'Żelazo kute ręcznie, na gorąco, przy palenisku: duże rzeczy do domu i ogrodu oraz drobiazgi na prezent.',
      extras: [
        {
          title: 'Spawalnictwo',
          text: 'Prace spawalnicze przy konstrukcjach i naprawach metalowych rzeczy.',
        },
      ],
    },
    {
      group: 'drewno',
      title: 'Drewno',
      intro: 'Rzeźba w drewnie, nowe meble łączone z kutym żelazem i odnawianie starych.',
      extras: [],
    },
  ],
  steps: [
    'Zadzwoń albo napisz i opisz, czego potrzebujesz. Zdjęcie miejsca, wymiary albo szkic bardzo pomagają.',
    'Razem ustalimy wzór, wymiary i cenę.',
  ],
}

const GALLERY: Readonly<Record<string, readonly Photo[]>> = galleryData

/** Photo shown beside the intro text: gallery slug and 1-based position, like Category.cover. */
export const ABOUT_PORTRAIT = { slug: 'z-zycia-kuzni', position: 14 } as const

export function getAboutPortrait(): Photo | undefined {
  return getPhotos(ABOUT_PORTRAIT.slug)[ABOUT_PORTRAIT.position - 1]
}

export function getCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug)
}

export function getPhotos(slug: string): readonly Photo[] {
  return GALLERY[slug] ?? []
}

export function getCover(category: Category): Photo | undefined {
  return getPhotos(category.slug)[category.cover - 1]
}

export function categoriesInGroup(group: CategoryGroup): readonly Category[] {
  return CATEGORIES.filter((category) => category.group === group)
}
