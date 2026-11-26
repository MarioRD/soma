import { SITE } from './content'

const BASE = import.meta.env.BASE_URL // '/' en local, '/soma/' en GitHub Pages

/** Enlace interno respetando la base del sitio: to('/depresion/') → '/soma/depresion/' */
export function to(path: string) {
  return BASE + path.replace(/^\//, '')
}

/** URL absoluta canónica (SEO): abs('/depresion/') → 'https://…/depresion/' */
export function abs(path: string) {
  return SITE.url + (path.startsWith('/') ? path : `/${path}`)
}

/** Quita la base al leer location.pathname en el cliente */
export function stripBase(pathname: string) {
  return pathname.startsWith(BASE) ? `/${pathname.slice(BASE.length)}` : pathname
}
