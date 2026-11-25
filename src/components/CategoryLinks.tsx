import { Link } from 'react-router-dom'
import { CATEGORY_GROUPS, GROUP_TITLES, categoriesInGroup, galleryPath } from '../content/site'

interface CategoryLinksProps {
  readonly className: string
}

/** Every gallery, listed under its group title. Used by the Galeria panel and the phone menu. */
export function CategoryLinks({ className }: CategoryLinksProps) {
  return (
    <div className={className}>
      {CATEGORY_GROUPS.map((group) => (
        <div key={group} className="cat-links__group">
          <p className="cat-links__title">{GROUP_TITLES[group]}</p>
          <ul>
            {categoriesInGroup(group).map((category) => (
              <li key={category.slug}>
                <Link to={galleryPath(category.slug)}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
