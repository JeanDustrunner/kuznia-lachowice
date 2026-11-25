import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './styles/base.css'
import './styles/layout.css'
import './styles/pages.css'
import './styles/gallery.css'

const container = document.getElementById('root')
if (!container) throw new Error('Brak elementu #root w index.html')

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
