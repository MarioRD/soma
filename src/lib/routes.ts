import { bySlug, SERVICIOS, type Servicio } from '@/content/servicios'

export type PageKind = 'home' | 'servicio' | 'hub' | 'sobre' | 'preguntas' | 'agendar' | 'privacidad' | 'notfound'

export type Route = {
  /** Ruta canónica, con barra final: '/', '/depresion/' */
  path: string
  page: PageKind
  title: string
  description: string
  servicio?: Servicio
  /** Migas de pan (sin incluir Inicio) */
  crumbs?: { name: string; path: string }[]
  /** Fuera del sitemap y de los buscadores */
  noindex?: boolean
}

export const HUB_PATH = '/como-te-ayudo/'

const BASE_ROUTES: Route[] = [
  {
    path: '/',
    page: 'home',
    title: 'Soma | Psicóloga en Tultitlán y terapia en línea',
    description:
      'Psicología Soma: psicoterapia, hipnosis ericksoniana y constelaciones familiares con la Mtra. Lidia Dorantes. Presencial en Tultitlán, Edo. Méx., y en línea.',
  },
  {
    path: HUB_PATH,
    page: 'hub',
    title: 'Cómo te puedo ayudar: terapias y áreas de atención | Soma',
    description:
      'Ansiedad, depresión, duelo, TOC, TDAH, pareja, niños y adolescentes: encuentra lo que estás viviendo y cómo lo trabajamos en Soma.',
    crumbs: [{ name: 'Cómo te ayudo', path: HUB_PATH }],
  },
  {
    path: '/mtra-lidia-dorantes/',
    page: 'sobre',
    title: 'Mtra. Lidia Yamina Dorantes Estrada, psicoterapeuta | Soma',
    description:
      'Licenciada en Psicología (UVM, cédula 4800043) y maestra en Psicoterapia Ericksoniana por el Centro Ericksoniano de México. Conoce a quien te acompaña.',
    crumbs: [{ name: 'Sobre Lidia', path: '/mtra-lidia-dorantes/' }],
  },
  {
    path: '/preguntas/',
    page: 'preguntas',
    title: 'Preguntas frecuentes sobre la terapia | Soma',
    description:
      'Modalidades, confidencialidad, hipnosis ericksoniana, terapia para niños y más: respuestas claras antes de tu primera sesión en Soma.',
    crumbs: [{ name: 'Preguntas', path: '/preguntas/' }],
  },
  {
    path: '/agendar/',
    page: 'agendar',
    title: 'Agenda tu primera sesión | Soma',
    description:
      'Agenda tu sesión de psicoterapia por WhatsApp: presencial en San Pablo de las Salinas, Tultitlán, o en línea por videollamada.',
    crumbs: [{ name: 'Agendar', path: '/agendar/' }],
  },
  {
    path: '/aviso-de-privacidad/',
    page: 'privacidad',
    title: 'Aviso de privacidad | Soma',
    description: 'Aviso de privacidad de Soma: cómo tratamos tus datos personales.',
    crumbs: [{ name: 'Aviso de privacidad', path: '/aviso-de-privacidad/' }],
  },
]

const SERVICIO_ROUTES: Route[] = SERVICIOS.map((s) => ({
  path: `/${s.slug}/`,
  page: 'servicio',
  title: s.seoTitle,
  description: s.description,
  servicio: s,
  crumbs: [
    { name: 'Cómo te ayudo', path: HUB_PATH },
    { name: s.nombre, path: `/${s.slug}/` },
  ],
}))

export const NOT_FOUND: Route = {
  path: '/404/',
  page: 'notfound',
  title: 'Página no encontrada | Soma',
  description: 'Esta página no existe. Vuelve al inicio de Soma.',
  noindex: true,
}

export const ROUTES: Route[] = [...BASE_ROUTES, ...SERVICIO_ROUTES]

export function normalizePath(path: string) {
  let p = path.split(/[?#]/)[0] || '/'
  if (!p.startsWith('/')) p = `/${p}`
  if (!p.endsWith('/')) p = `${p}/`
  return p
}

export function matchRoute(path: string): Route {
  const p = normalizePath(path)
  return ROUTES.find((r) => r.path === p) ?? NOT_FOUND
}

export { bySlug }
