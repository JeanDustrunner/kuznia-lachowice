import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { galleryPath } from './content/site'
import { CategoryPage } from './pages/Category'
import { ContactPage } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { OfferPage } from './pages/Offer'

/** Galleries used to live under /prace/; keep those addresses working. */
function LegacyGalleryRedirect() {
  const { slug = '' } = useParams()
  return <Navigate to={galleryPath(slug)} replace />
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="galeria/:slug" element={<CategoryPage />} />
        <Route path="prace/:slug" element={<LegacyGalleryRedirect />} />
        <Route path="oferta" element={<OfferPage />} />
        <Route path="kontakt" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
