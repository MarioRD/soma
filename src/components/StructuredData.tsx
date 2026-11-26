import { PREGUNTAS, SITE, TERAPIAS } from '@/lib/content'

/** JSON-LD para buscadores y agentes de IA: negocio, servicios y preguntas frecuentes. */
export function StructuredData() {
  const negocio = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'ProfessionalService'],
    '@id': `${SITE.url}/#soma`,
    name: SITE.name,
    alternateName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/og-soma.jpg`,
    image: `${SITE.url}/og-soma.jpg`,
    description:
      'Soma es un espacio de psicología: psicoterapia, psicoterapia con hipnosis ericksoniana y constelaciones familiares.',
    ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    ...(SITE.address ? { address: SITE.address } : {}),
    ...(SITE.city ? { areaServed: SITE.city } : {}),
    sameAs: Object.values(SITE.social).filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Terapias',
      itemListElement: TERAPIAS.map((t) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: t.nombre, description: t.descripcion, url: `${SITE.url}/#${t.id}` },
      })),
    },
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS.filter((p) => !p.a.includes('TODO')).map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(negocio) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}
