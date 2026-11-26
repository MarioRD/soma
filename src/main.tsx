import '@fontsource-variable/fraunces'
import '@fontsource-variable/manrope'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { matchRoute } from './lib/routes'
import { stripBase } from './lib/url'

const route = matchRoute(stripBase(window.location.pathname))
const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App route={route} />
  </StrictMode>
)

// En producción cada página viene prerenderizada (SEO / agentes) y se hidrata. En dev se monta normal.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  document.title = route.title
  createRoot(root).render(app)
}
