/**
 * Datos del negocio en un solo lugar: los usan las páginas, el JSON-LD, el sitemap y llms.txt.
 * Lo marcado TODO debe confirmarlo Soma antes de salir a producción.
 */

// Dominio: en pruebas es GitHub Pages. Al comprar el dominio basta con definir VITE_SITE_URL en el build.
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://mariord.github.io/soma'

export const SITE = {
  name: 'Soma',
  legalName: 'Soma Psicología',
  url: SITE_URL.replace(/\/$/, ''),
  whatsapp: '525634026000',
  telefono: '56 3402 6000',
  email: 'contacto@example.com', // TODO: correo real cuando exista el dominio
  address: {
    street: 'Calle Gruta', // TODO: número exterior / interior
    colonia: 'Unidad Morelos 3ra Sección, San Pablo de las Salinas',
    city: 'Tultitlán',
    region: 'Estado de México',
    postalCode: '54930',
    country: 'MX',
  },
  geo: { lat: 19.6765695, lng: -99.0855066 },
  mapsUrl: 'https://maps.app.goo.gl/8WtT53pfwD4DcDp79',
  hours: '', // TODO: horario de atención
  costo: '', // TODO: costo y duración de la sesión
  areaServed: ['Tultitlán', 'San Pablo de las Salinas', 'Coacalco', 'Tultepec', 'Cuautitlán Izcalli', 'Ecatepec'],
  social: {
    facebook: '', // TODO
    instagram: '', // TODO
  },
  /** Constancias DC-3: activar solo cuando haya registro como Agente Capacitador Externo ante la STPS. */
  dc3: false,
} as const

export const PSICOLOGA = {
  nombre: 'Lidia Yamina Dorantes Estrada',
  corto: 'Mtra. Lidia Dorantes',
  completo: 'Mtra. Lidia Yamina Dorantes Estrada',
  cedula: '4800043',
  verificarCedula: 'https://www.cedulaprofesional.sep.gob.mx/',
  formacion: [
    { grado: 'Maestría en Psicoterapia Ericksoniana', institucion: 'Centro Ericksoniano de México', anio: 2012 },
    { grado: 'Licenciatura en Psicología', institucion: 'Universidad del Valle de México, Campus Hispano', anio: 2005 },
  ],
} as const

export const DIRECCION = `${SITE.address.street}, ${SITE.address.colonia}, ${SITE.address.city}, ${SITE.address.region}, C.P. ${SITE.address.postalCode}`

export function whatsappUrl(texto = 'Hola, me gustaría agendar una sesión en Soma.') {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`
}

/** Preguntas generales (página /preguntas y FAQPage del inicio). */
export const PREGUNTAS: { q: string; a: string }[] = [
  {
    q: '¿Cómo sé qué terapia es para mí?',
    a: 'No necesitas saberlo antes de llegar. En la primera sesión platicamos lo que estás viviendo y elegimos juntos el camino: psicoterapia clínica, hipnosis ericksoniana, constelaciones familiares o una combinación.',
  },
  {
    q: '¿Las sesiones son presenciales o en línea?',
    a: 'Las dos. Puedes venir al consultorio en San Pablo de las Salinas, Tultitlán, o tomar tu sesión por videollamada desde cualquier lugar.',
  },
  {
    q: '¿Con la hipnosis pierdo el control?',
    a: 'No. En la hipnosis ericksoniana estás despierto, escuchas todo y puedes abrir los ojos cuando quieras. Se parece más a estar muy concentrado y tranquilo que a dormir.',
  },
  {
    q: '¿Atienden a niños y adolescentes?',
    a: 'Sí. Hay terapia infantil, para adolescentes, individual, de pareja y familiar. Con niños y adolescentes también se acompaña a madres, padres o tutores.',
  },
  {
    q: '¿Lo que hable es confidencial?',
    a: 'Sí. Lo que compartes en sesión es confidencial, con las excepciones que marca la ley cuando hay riesgo para tu vida o la de otras personas.',
  },
  {
    q: '¿Cuánto cuesta y cuánto dura una sesión?',
    a: 'TODO: confirmar costo y duración de la sesión.',
  },
]
