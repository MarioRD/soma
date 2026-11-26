/* eslint-disable react/only-export-components -- entrada de build, no participa en fast refresh */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { SERVICIOS, KIND_LABEL } from './content/servicios'
import { DIRECCION, PSICOLOGA, SITE } from './lib/content'
import { NOT_FOUND, ROUTES, type Route } from './lib/routes'
import { headHtml } from './lib/seo'

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
