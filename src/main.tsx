import '@fontsource-variable/fraunces'
import '@fontsource-variable/manrope'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML viene prerenderizado (SEO / agentes): se hidrata. En dev se monta normal.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
