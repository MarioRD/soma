import { DIRECCION, PREGUNTAS, PSICOLOGA, SITE } from './content'
import type { Route } from './routes'
import { abs } from './url'

/**
 * <head> de cada página (lo inyecta scripts/prerender.mjs en el HTML estático):
 * título, descripción, canonical, Open Graph y JSON-LD para buscadores y agentes de IA.
 */

const ORG_ID = `${SITE.url}/#soma`
const PERSON_ID = `${SITE.url}/#lidia`

function negocio() {
  return {
    '@type': ['MedicalBusiness', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.legalName,
    url: `${SITE.url}/`,
    logo: abs('/og-soma.jpg'),
    image: abs('/og-soma.jpg'),
    description:
      'Consultorio de psicología en Tultitlán, Estado de México, con terapia en línea: psicoterapia clínica, hipnosis ericksoniana y constelaciones familiares.',
    telephone: `+${SITE.whatsapp}`,
    ...(SITE.email.endsWith('example.com') ? {} : { email: SITE.email }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsUrl,
    areaServed: [...SITE.areaServed.map((name) => ({ '@type': 'City', name })), { '@type': 'Country', name: 'México' }],
    founder: { '@id': PERSON_ID },
    employee: { '@id': PERSON_ID },
    sameAs: Object.values(SITE.social).filter(Boolean),
  }
}

function persona() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PSICOLOGA.nombre,
    honorificPrefix: 'Mtra.',
    jobTitle: 'Psicóloga y psicoterapeuta ericksoniana',
    url: abs('/mtra-lidia-dorantes/'),
    worksFor: { '@id': ORG_ID },
    knowsAbout: ['Psicoterapia', 'Hipnosis ericksoniana', 'Constelaciones familiares', 'Terapia de pareja', 'Terapia infantil'],
    alumniOf: PSICOLOGA.formacion.map((f) => ({ '@type': 'EducationalOrganization', name: f.institucion })),
    hasCredential: [
      ...PSICOLOGA.formacion.map((f) => ({
        '@type': 'EducationalOccupationalCredential',
        name: f.grado,
        credentialCategory: f.grado.startsWith('Maestría') ? 'Maestría' : 'Licenciatura',
        recognizedBy: { '@type': 'EducationalOrganization', name: f.institucion },
      })),
      {
        '@type': 'EducationalOccupationalCredential',
        name: `Cédula profesional ${PSICOLOGA.cedula}`,
        credentialCategory: 'Cédula profesional',
        recognizedBy: { '@type': 'GovernmentOrganization', name: 'Secretaría de Educación Pública (SEP)' },
      },
    ],
  }
}

function faqPage(faqs: { q: string; a: string }[]) {
  const ok = faqs.filter((f) => !f.a.includes('TODO'))
  if (!ok.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: ok.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

function breadcrumbs(route: Route) {
  if (!route.crumbs?.length) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', path: '/' }, ...route.crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  }
}

export function jsonLd(route: Route) {
  const graph: object[] = [negocio(), persona()]
  const s = route.servicio
  const page: Record<string, unknown> = {
    '@type': s && s.kind !== 'empresa' && s.kind !== 'modalidad' ? 'MedicalWebPage' : 'WebPage',
    '@id': `${abs(route.path)}#page`,
    url: abs(route.path),
    name: route.title,
    description: route.description,
    inLanguage: 'es-MX',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE.url}/#web`, name: SITE.name, url: `${SITE.url}/` },
    publisher: { '@id': ORG_ID },
  }

  if (s) {
    page.about = { '@type': 'Service', name: s.titulo, provider: { '@id': ORG_ID }, areaServed: DIRECCION }
    if (s.revisado) {
      page.reviewedBy = { '@id': PERSON_ID }
      page.lastReviewed = s.revisado
    }
    const f = faqPage(s.faqs)
    if (f) graph.push(f)
  }
  if (route.page === 'home' || route.page === 'preguntas') {
    const f = faqPage(PREGUNTAS)
    if (f) graph.push(f)
  }
  if (route.page === 'sobre') page['@type'] = 'ProfilePage'
  if (route.page === 'sobre') page.mainEntity = { '@id': PERSON_ID }

  graph.push(page)
  const b = breadcrumbs(route)
  if (b) graph.push(b)
  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headHtml(route: Route) {
  const url = abs(route.path)
  const img = abs('/og-soma.jpg')
  return [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    route.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="es_MX" />',
    '<meta property="og:site_name" content="Soma" />',
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Árbol en flor bajo la luna, logotipo de Soma" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${JSON.stringify(jsonLd(route)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}
