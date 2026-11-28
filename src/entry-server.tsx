/* eslint-disable react/only-export-components -- entrada de build, no participa en fast refresh */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { SERVICIOS, KIND_LABEL } from './content/servicios'
import { DIRECCION, PSICOLOGA, SITE } from './lib/content'
import { escena } from './lib/escena'
import { registrarEscena } from './lib/escena-ssr'
import { NOT_FOUND, ROUTES, type Route } from './lib/routes'
import { headHtml } from './lib/seo'

// el paisaje del hero se dibuja solo aquí, en el build
registrarEscena(escena)

/** Usado solo en el build por scripts/prerender.mjs */
export function render(route: Route) {
  return {
    html: renderToString(
      <StrictMode>
        <App route={route} />
      </StrictMode>,
    ),
    head: headHtml(route),
  }
}

export { DIRECCION, KIND_LABEL, NOT_FOUND, PSICOLOGA, ROUTES, SERVICIOS, SITE }
