/**
 * Contenido de la página en un solo lugar: lo usan las secciones y el JSON-LD (SEO).
 * Todo lo marcado TODO debe confirmarlo Soma antes de publicar.
 */

export const SITE = {
  name: 'Soma',
  legalName: 'Soma Psicología', // TODO: confirmar nombre comercial
  url: 'https://example.com', // TODO: dominio real
  city: '', // TODO: ciudad (clave para SEO local: "psicólogo en <ciudad>")
  whatsapp: '', // TODO: número de WhatsApp en formato 521XXXXXXXXXX
  email: '', // TODO
  address: '', // TODO
  hours: '', // TODO: horario de atención
  modalidad: '', // TODO: presencial, en línea o ambas
  social: {
    facebook: '', // TODO
    instagram: '', // TODO
  },
} as const

export type Terapia = {
  id: string
  nombre: string
  corto: string
  descripcion: string
  paraQuien: string[]
}

export const TERAPIAS: Terapia[] = [
  {
    id: 'psicoterapia',
    nombre: 'Psicoterapia',
    corto: 'Hablar con alguien que sabe escuchar.',
    descripcion:
      'Un espacio confidencial para entender lo que sientes, ordenar lo que pesa y encontrar otra forma de estar contigo y con los demás.',
    paraQuien: ['Ansiedad y estrés', 'Duelos y pérdidas', 'Relaciones y pareja', 'Autoestima'],
  },
  {
    id: 'hipnosis-ericksoniana',
    nombre: 'Psicoterapia con hipnosis ericksoniana',
    corto: 'Un estado de calma para cambiar desde dentro.',
    descripcion:
      'La hipnosis ericksoniana usa la conversación, las metáforas y la relajación para acceder a recursos que ya tienes. Tú estás presente y consciente en todo momento.',
    paraQuien: ['Miedos y fobias', 'Hábitos que quieres soltar', 'Dolor emocional antiguo', 'Bloqueos'],
  },
  {
    id: 'constelaciones-familiares',
    nombre: 'Constelaciones familiares',
    corto: 'Ver a tu familia desde otro lugar.',
    descripcion:
      'Una mirada sistémica a los vínculos familiares: lo que se repite entre generaciones, los lugares que ocupamos y lo que necesita reconocerse para seguir adelante.',
    paraQuien: ['Patrones que se repiten', 'Conflictos familiares', 'Lealtades invisibles', 'Decisiones difíciles'],
  },
]

export const PREGUNTAS: { q: string; a: string }[] = [
  {
    q: '¿Con la hipnosis pierdo el control?',
    a: 'No. En la hipnosis ericksoniana estás despierto, escuchas todo y puedes abrir los ojos cuando quieras. Se parece más a estar muy concentrado y tranquilo que a dormir.',
  },
  {
    q: '¿Qué pasa en una constelación familiar?',
    a: 'Se representa a los miembros de tu sistema familiar para observar cómo se relacionan y qué está pidiendo ser visto. TODO: explicar si Soma las hace en grupo, individuales o ambas.',
  },
  {
    q: '¿Cómo sé qué terapia es para mí?',
    a: 'No necesitas saberlo antes de llegar. En la primera sesión platicamos lo que estás viviendo y elegimos juntos el camino.',
  },
  {
    q: '¿Las sesiones son en línea o presenciales?',
    a: 'TODO: confirmar modalidad, duración y costo de las sesiones.',
  },
  {
    q: '¿Lo que hable es confidencial?',
    a: 'Sí. Todo lo que compartes en sesión es confidencial, con las excepciones que marca la ley cuando hay riesgo para tu vida o la de otras personas.',
  },
]
