/**
 * Una entrada = una página dedicada (/<slug>/) + resultado en el buscador "¿Qué estás viviendo?".
 *
 * Escribir para personas primero: `lead` responde la pregunta en 2-3 frases (es lo que citan Google
 * y las IA), `sientes` usa palabras de quien lo vive, `keywords` son las palabras con las que alguien
 * lo buscaría (sinónimos, coloquialismos, síntomas).
 *
 * Contenido de salud (YMYL): `revisado` pasa a una fecha ISO solo cuando la Mtra. Lidia lo haya leído.
 */

import { SITE } from '@/lib/content'

export type Kind = 'enfoque' | 'publico' | 'area' | 'modalidad' | 'empresa'

export type Faq = { q: string; a: string }

export type Servicio = {
  slug: string
  kind: Kind
  /** Etiqueta corta para tarjetas, menús y buscador */
  nombre: string
  /** h1 de la página */
  titulo: string
  /** <title> (≈60 caracteres) */
  seoTitle: string
  /** meta description (≈150 caracteres) */
  description: string
  keywords: string[]
  /** Respuesta directa, 2-3 frases */
  lead: string
  /** "¿Te pasa esto?" */
  sientes?: string[]
  /** "Cómo lo trabajamos": párrafos */
  como: string[]
  /** Lista de lo que incluye (empresas, modalidades) */
  incluye?: string[]
  enfoques?: string[]
  faqs: Faq[]
  /** Aviso clínico o de seguridad */
  nota?: string
  revisado: string | false
}

export const KIND_LABEL: Record<Kind, string> = {
  enfoque: 'Enfoque',
  publico: 'Para quién',
  area: 'Lo que atendemos',
  modalidad: 'Modalidad',
  empresa: 'Empresas',
}

const CRISIS =
  'Si tienes pensamientos de quitarte la vida o estás en peligro, no esperes a una cita: llama al 911 o a la Línea de la Vida, 800 911 2000, disponible las 24 horas.'

export const SERVICIOS: Servicio[] = [
  /* ───────────── Enfoques ───────────── */
  {
    slug: 'hipnosis-ericksoniana',
    kind: 'enfoque',
    nombre: 'Hipnosis ericksoniana',
    titulo: 'Psicoterapia con hipnosis ericksoniana',
    seoTitle: 'Hipnosis ericksoniana en Tultitlán y en línea | Soma',
    description:
      'Psicoterapia con hipnosis ericksoniana con la Mtra. Lidia Dorantes, maestra en Psicoterapia Ericksoniana. Presencial en Tultitlán y en línea.',
    keywords: ['hipnosis', 'hipnoterapia', 'erickson', 'ericksoniana', 'trance', 'relajación', 'inconsciente', 'metáforas'],
    lead:
      'La hipnosis ericksoniana es una forma de psicoterapia que usa la conversación, las metáforas y un estado de calma concentrada para que encuentres recursos que ya tienes. Estás despierta o despierto y presente todo el tiempo.',
    sientes: [
      'Ya lo entiendes con la cabeza, pero algo por dentro no cambia.',
      'Tienes un miedo, un hábito o una reacción que se repite aunque no quieras.',
      'Hablar del tema una y otra vez ya no te ayuda.',
      'Buscas una forma de terapia más vivencial y menos de diagnóstico.',
    ],
    como: [
      'Milton H. Erickson, psiquiatra estadounidense, desarrolló una forma de trabajar con la hipnosis que no da órdenes: acompaña. En sesión platicamos, y en algunos momentos te invito a un estado de atención tranquila en el que las historias, las imágenes y las sugerencias abiertas ayudan a mirar el problema desde otro lugar.',
      'No es un espectáculo ni pierdes el control: puedes hablar, moverte y terminar cuando quieras. La hipnosis se integra dentro de un proceso de psicoterapia, con objetivos que acordamos juntos.',
    ],
    enfoques: ['psicoterapia-clinica'],
    faqs: [
      {
        q: '¿Me pueden hacer decir o hacer algo que no quiero?',
        a: 'No. En la hipnosis ericksoniana sigues consciente y decides en todo momento. Nada ocurre en contra de tu voluntad.',
      },
      {
        q: '¿Y si no soy “hipnotizable”?',
        a: 'El enfoque ericksoniano se adapta a cada persona: no hay una sola forma correcta de entrar en ese estado. Aun así, en la primera sesión valoramos si es la herramienta adecuada para ti.',
      },
      {
        q: '¿Funciona en línea?',
        a: 'Sí. Al ser un trabajo basado en la conversación, puede hacerse por videollamada desde un lugar tranquilo y privado.',
      },
    ],
    nota: 'La hipnosis no sustituye un tratamiento médico o psiquiátrico. En la primera sesión se valora si es adecuada para tu situación.',
    revisado: false,
  },
  {
    slug: 'constelaciones-familiares',
    kind: 'enfoque',
    nombre: 'Constelaciones familiares',
    titulo: 'Constelaciones familiares',
    seoTitle: 'Constelaciones familiares en Tultitlán | Soma',
    description:
      'Constelaciones familiares para mirar patrones que se repiten en tu familia, conflictos y lealtades invisibles. En Tultitlán, Estado de México.',
    keywords: ['constelaciones', 'constelar', 'familia', 'sistémica', 'patrones familiares', 'ancestros', 'lealtades', 'herencia familiar'],
    lead:
      'Las constelaciones familiares son un trabajo vivencial que mira a la familia como un sistema: lo que se repite entre generaciones, el lugar que ocupa cada quien y lo que necesita reconocerse para seguir adelante.',
    sientes: [
      'En tu familia se repiten historias: separaciones, pleitos, enfermedades, silencios.',
      'Sientes que cargas algo que no es tuyo.',
      'Hay una relación familiar que te duele y no sabes cómo acomodarla.',
      'Quieres tomar una decisión importante y algo te detiene.',
    ],
    como: [
      'En una constelación se representa a los miembros de tu familia, con personas o con objetos, para observar cómo se relacionan y qué está pidiendo ser visto. A menudo aparece una imagen nueva de la historia familiar que ayuda a ordenar lo que sientes.',
      'En Soma lo usamos como un enfoque complementario, dentro de un acompañamiento psicoterapéutico, nunca como sustituto de él.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Las constelaciones son en grupo o individuales?',
        a: 'TODO: confirmar si Soma las ofrece en grupo, individuales o ambas, y con qué frecuencia.',
      },
      {
        q: '¿Tiene que venir mi familia?',
        a: 'No. Trabajas tú; tu familia no necesita estar presente ni enterarse.',
      },
    ],
    revisado: false,
  },
  {
    slug: 'psicoterapia-clinica',
    kind: 'enfoque',
    nombre: 'Psicoterapia clínica',
    titulo: 'Psicoterapia clínica',
    seoTitle: 'Psicoterapia en Tultitlán y en línea | Soma',
    description:
      'Psicoterapia clínica con una psicóloga con cédula profesional: ansiedad, depresión, duelo y más. Presencial en Tultitlán, Estado de México, y en línea.',
    keywords: ['psicoterapia', 'terapia', 'psicólogo', 'psicóloga', 'terapia psicológica', 'consulta psicológica', 'hablar con alguien'],
    lead:
      'La psicoterapia es un espacio confidencial, con una profesional de la salud mental, para entender lo que te pasa, aliviar el malestar y construir otras formas de estar contigo y con los demás.',
    sientes: [
      'Hay algo que te pesa y no sabes cómo nombrarlo.',
      'Lo que antes te funcionaba ya no te alcanza.',
      'Quieres hablar con alguien que te escuche sin juzgar.',
    ],
    como: [
      'Empezamos con una evaluación: qué te trae, desde cuándo, cómo afecta tu vida. Con eso definimos objetivos y un plan, y revisamos juntos cómo vas avanzando.',
      'Según lo que necesites, la psicoterapia puede integrar hipnosis ericksoniana o constelaciones familiares, y coordinarse con psiquiatría o medicina cuando hace falta.',
    ],
    enfoques: ['hipnosis-ericksoniana', 'constelaciones-familiares'],
    faqs: [
      {
        q: '¿Cuántas sesiones voy a necesitar?',
        a: 'Depende de lo que estés viviendo y de tus objetivos. En las primeras sesiones podemos estimarlo y lo revisamos en el camino.',
      },
      {
        q: '¿Qué diferencia hay entre psicólogo y psiquiatra?',
        a: 'El psicólogo trabaja con psicoterapia; el psiquiatra es médico y puede recetar medicamento. Muchas veces lo mejor es trabajar en conjunto.',
      },
    ],
    revisado: false,
  },

  /* ───────────── Para quién ───────────── */
  {
    slug: 'terapia-infantil',
    kind: 'publico',
    nombre: 'Terapia infantil',
    titulo: 'Terapia infantil',
    seoTitle: 'Psicóloga infantil en Tultitlán | Soma',
    description:
      'Terapia psicológica para niñas y niños en Tultitlán: emociones, conducta, escuela, duelos y cambios familiares. Acompañamiento también para madres y padres.',
    keywords: ['niños', 'niñas', 'hijo', 'hija', 'infantil', 'berrinches', 'conducta', 'escuela', 'psicólogo infantil', 'mi hijo'],
    lead:
      'La terapia infantil ayuda a niñas y niños a expresar lo que sienten, muchas veces a través del juego, y acompaña a la familia para entender qué está pasando y cómo apoyar.',
    sientes: [
      'Tu hija o hijo cambió: está más irritable, callado o con miedo.',
      'En la escuela hay quejas de conducta o de atención.',
      'La familia pasó por un cambio: separación, mudanza, una pérdida.',
      'No sabes si lo que ves es “normal para su edad”.',
    ],
    como: [
      'Con los niños se trabaja con el lenguaje que ellos usan: juego, dibujo, cuentos. Las metáforas del enfoque ericksoniano encajan de forma natural con su manera de pensar.',
      'Madres, padres o tutores son parte del proceso: hay sesiones para orientarles y acordar cómo acompañar en casa.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Desde qué edad atienden?',
        a: 'TODO: confirmar la edad mínima de atención.',
      },
      {
        q: '¿Tengo que estar en la sesión?',
        a: 'Depende de la edad y del momento del proceso. Siempre hay espacios para madres, padres o tutores.',
      },
    ],
    revisado: false,
  },
  {
    slug: 'terapia-adolescentes',
    kind: 'publico',
    nombre: 'Terapia para adolescentes',
    titulo: 'Terapia para adolescentes',
    seoTitle: 'Psicóloga para adolescentes en Tultitlán | Soma',
    description:
      'Terapia psicológica para adolescentes: ansiedad, tristeza, autoestima, conflictos en casa o en la escuela. Presencial en Tultitlán y en línea.',
    keywords: ['adolescente', 'adolescentes', 'jóvenes', 'joven', 'secundaria', 'prepa', 'rebeldía', 'mi hijo adolescente', 'autolesiones'],
    lead:
      'La adolescencia es una etapa de cambios intensos. La terapia ofrece a las y los adolescentes un espacio propio, confidencial, para entender lo que sienten, y orienta a la familia para acompañarlos.',
    sientes: [
      'Se encierra, no habla o todo termina en pelea.',
      'Notas tristeza, ansiedad o cambios en su forma de comer o dormir.',
      'Bajó en la escuela o perdió interés en lo que le gustaba.',
      'No sabe qué estudiar o qué quiere para su vida.',
    ],
    como: [
      'Trabajamos con respeto a su privacidad: lo que dice en sesión es confidencial, salvo que haya un riesgo para su seguridad. Eso construye la confianza que hace funcionar la terapia.',
      'Con la familia acordamos cómo acompañar en casa, sin que la terapia se vuelva un castigo o una vigilancia.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Qué pasa si mi hijo no quiere ir?',
        a: 'Es común al principio. Escríbenos y platicamos cómo proponérselo; a veces una primera sesión sin presión cambia su disposición.',
      },
    ],
    nota: CRISIS,
    revisado: false,
  },
  {
    slug: 'terapia-individual',
    kind: 'publico',
    nombre: 'Terapia individual',
    titulo: 'Terapia individual para adultos',
    seoTitle: 'Terapia individual para adultos en Tultitlán y en línea | Soma',
    description:
      'Terapia psicológica individual para adultos: ansiedad, depresión, duelo, relaciones y autoestima. En Tultitlán, Estado de México, y en línea.',
    keywords: ['adulto', 'adultos', 'individual', 'yo', 'para mí', 'autoestima', 'crecimiento personal', 'estrés', 'trabajo'],
    lead:
      'La terapia individual es un espacio para ti: para entender lo que sientes, salir de lo que te tiene atorado y cuidar tu salud mental con acompañamiento profesional.',
    sientes: [
      'Te sientes cansado, triste o ansioso sin saber bien por qué.',
      'Estás pasando por una pérdida, una ruptura o un cambio grande.',
      'Repites patrones en tus relaciones.',
      'Quieres conocerte mejor y vivir con más calma.',
    ],
    como: [
      'Cada proceso es distinto. Partimos de lo que te trae y lo trabajamos con psicoterapia clínica, hipnosis ericksoniana o constelaciones familiares, según lo que tenga sentido para ti.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana', 'constelaciones-familiares'],
    faqs: [],
    revisado: false,
  },
  {
    slug: 'terapia-de-pareja',
    kind: 'publico',
    nombre: 'Terapia de pareja',
    titulo: 'Terapia de pareja',
    seoTitle: 'Terapia de pareja en Tultitlán y en línea | Soma',
    description:
      'Terapia de pareja para mejorar la comunicación, atravesar crisis, infidelidad o decidir con claridad. Presencial en Tultitlán, Estado de México, y en línea.',
    keywords: ['pareja', 'matrimonio', 'novio', 'novia', 'esposo', 'esposa', 'infidelidad', 'divorcio', 'separación', 'peleas', 'comunicación'],
    lead:
      'La terapia de pareja ayuda a dos personas a entender qué les está pasando, a hablar sin lastimarse y a decidir con claridad qué quieren construir, juntas o por separado.',
    sientes: [
      'Discuten por lo mismo una y otra vez.',
      'Sienten distancia, como si vivieran con alguien desconocido.',
      'Hubo una infidelidad o una crisis de confianza.',
      'No saben si seguir o separarse.',
    ],
    como: [
      'La terapeuta no toma partido: el paciente es la relación. Buscamos que cada quien pueda decir lo que necesita y escuchar al otro.',
      'Las constelaciones familiares ayudan a ver lo que cada uno trae de su propia familia a la pareja.',
    ],
    enfoques: ['psicoterapia-clinica', 'constelaciones-familiares'],
    faqs: [
      {
        q: '¿Y si mi pareja no quiere ir?',
        a: 'Puedes empezar en terapia individual. Muchas veces el cambio de una persona mueve la dinámica de la pareja.',
      },
    ],
    nota: 'Si en la relación hay violencia física, sexual o amenazas, lo primero es tu seguridad: llama al 911.',
    revisado: false,
  },
  {
    slug: 'terapia-familiar',
    kind: 'publico',
    nombre: 'Terapia familiar',
    titulo: 'Terapia familiar',
    seoTitle: 'Terapia familiar en Tultitlán | Soma',
    description:
      'Terapia familiar para mejorar la convivencia, atravesar cambios y conflictos, y acompañar a hijos y padres. En Tultitlán, Estado de México.',
    keywords: ['familia', 'familiar', 'hijos', 'padres', 'hermanos', 'conflictos familiares', 'convivencia', 'crianza', 'orientación a padres'],
    lead:
      'La terapia familiar trabaja con la familia como un equipo: cómo se comunican, qué lugar ocupa cada quien y cómo atravesar juntos un cambio o un conflicto.',
    sientes: [
      'En casa hay tensión constante.',
      'Un integrante está pasando por algo difícil y afecta a todos.',
      'Hubo una separación, una pérdida o una nueva familia que acomodar.',
    ],
    como: [
      'Las sesiones pueden incluir a toda la familia o a algunos de sus miembros, según lo que haga falta. La mirada sistémica de las constelaciones familiares es una herramienta natural aquí.',
    ],
    enfoques: ['constelaciones-familiares', 'psicoterapia-clinica'],
    faqs: [],
    revisado: false,
  },

  /* ───────────── Lo que atendemos ───────────── */
  {
    slug: 'depresion',
    kind: 'area',
    nombre: 'Depresión',
    titulo: 'Terapia para la depresión',
    seoTitle: 'Psicóloga para la depresión en Tultitlán y en línea | Soma',
    description:
      'Terapia para la depresión: tristeza persistente, falta de energía, pérdida de interés. Acompañamiento profesional en Tultitlán, Estado de México, y en línea.',
    keywords: ['depresión', 'deprimido', 'deprimida', 'tristeza', 'triste', 'sin ganas', 'no tengo ganas de nada', 'llorar', 'vacío', 'apatía', 'desmotivación', 'cansancio', 'depre'],
    lead:
      'La depresión es más que estar triste: es una tristeza o un vacío que dura semanas, quita la energía y el interés por lo que antes importaba. Tiene tratamiento, y la psicoterapia es parte central de él.',
    sientes: [
      'Te despiertas cansado aunque hayas dormido.',
      'Ya nada te emociona como antes.',
      'Te cuesta concentrarte, decidir o hacer cosas sencillas.',
      'Te sientes culpable o sin valor.',
      'Lloras con facilidad o no sientes nada.',
    ],
    como: [
      'Primero entendemos cómo se ha ido formando lo que sientes y qué lo mantiene. Después trabajamos en recuperar rutinas, actividades y vínculos que sostienen, y en cambiar la forma en que te hablas.',
      'Cuando la depresión es intensa, la psicoterapia se coordina con valoración psiquiátrica: combinar ambas suele dar mejores resultados.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Cómo sé si es depresión o solo tristeza?',
        a: 'Si el malestar dura más de dos semanas, afecta tu trabajo, tus relaciones o tu cuidado personal, vale la pena consultarlo. Solo una valoración profesional puede decirlo.',
      },
      {
        q: '¿Voy a necesitar medicamento?',
        a: 'No siempre. Si en la valoración se ve conveniente, te orientamos para consultar a psiquiatría, que es quien puede indicarlo.',
      },
    ],
    nota: CRISIS,
    revisado: false,
  },
  {
    slug: 'ansiedad-y-ataques-de-panico',
    kind: 'area',
    nombre: 'Ansiedad y ataques de pánico',
    titulo: 'Terapia para la ansiedad y los ataques de pánico',
    seoTitle: 'Terapia para la ansiedad y ataques de pánico en Tultitlán | Soma',
    description:
      'Terapia para la ansiedad, la preocupación constante y los ataques de pánico. Psicoterapia e hipnosis ericksoniana en Tultitlán, Estado de México, y en línea.',
    keywords: ['ansiedad', 'ansioso', 'ansiosa', 'pánico', 'ataque de pánico', 'crisis de ansiedad', 'nervios', 'preocupación', 'angustia', 'taquicardia', 'no puedo respirar', 'estrés', 'miedo'],
    lead:
      'La ansiedad es la alarma del cuerpo encendida de más: preocupación que no para, tensión, el corazón acelerado. Un ataque de pánico es esa alarma al máximo, de golpe. Ambos se pueden tratar.',
    sientes: [
      'No puedes dejar de preocuparte, aunque sepas que exageras.',
      'Sientes el pecho apretado, el corazón acelerado o que te falta el aire.',
      'Has tenido episodios en los que creíste que te ibas a desmayar, volver loco o morir.',
      'Empiezas a evitar lugares o situaciones por miedo a sentirte así.',
    ],
    como: [
      'Aprendemos a reconocer cómo funciona tu ansiedad y qué la dispara, y practicamos formas de regular el cuerpo y la mente. La hipnosis ericksoniana es especialmente útil para entrenar estados de calma que luego puedes usar por tu cuenta.',
      'Si los síntomas físicos son nuevos o intensos, conviene una revisión médica para descartar otras causas.',
    ],
    enfoques: ['hipnosis-ericksoniana', 'psicoterapia-clinica'],
    faqs: [
      {
        q: '¿Un ataque de pánico es peligroso?',
        a: 'Se siente terrible, pero un ataque de pánico en sí no es peligroso y pasa en minutos. Si es la primera vez o hay dolor en el pecho, acude a urgencias para descartar otra causa.',
      },
    ],
    revisado: false,
  },
  {
    slug: 'duelo',
    kind: 'area',
    nombre: 'Duelo y pérdidas',
    titulo: 'Terapia de duelo y pérdidas',
    seoTitle: 'Terapia de duelo en Tultitlán y en línea | Soma',
    description:
      'Acompañamiento en el duelo por la muerte de un ser querido, una separación u otras pérdidas. Psicoterapia en Tultitlán, Estado de México, y en línea.',
    keywords: ['duelo', 'pérdida', 'muerte', 'falleció', 'murió', 'luto', 'extrañar', 'separación', 'divorcio', 'ruptura', 'perdí a mi', 'mascota'],
    lead:
      'El duelo es la forma natural en que respondemos a una pérdida. No hay una manera correcta de vivirlo, pero no tienes que atravesarlo en soledad.',
    sientes: [
      'Perdiste a alguien y el dolor no te deja seguir con tu día.',
      'Sientes culpa, enojo o cosas que no dijiste.',
      'Todos esperan que “ya lo superes” y tú no puedes.',
      'Viviste otra pérdida: una separación, un trabajo, tu salud.',
    ],
    como: [
      'Acompañamos el duelo a tu ritmo: dar lugar a lo que sientes, ordenar los recuerdos y encontrar una forma de seguir en relación con lo que perdiste.',
      'Las constelaciones familiares ayudan cuando la pérdida remueve historias familiares; la hipnosis ericksoniana, cuando lo que pesa es una imagen o un momento que no se va.',
    ],
    enfoques: ['psicoterapia-clinica', 'constelaciones-familiares', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Cuánto dura un duelo?',
        a: 'No hay un tiempo fijo. Si después de meses el dolor sigue igual de intenso o te impide funcionar, vale la pena buscar acompañamiento.',
      },
    ],
    nota: CRISIS,
    revisado: false,
  },
  {
    slug: 'toc-trastorno-obsesivo-compulsivo',
    kind: 'area',
    nombre: 'TOC (trastorno obsesivo compulsivo)',
    titulo: 'Terapia para el trastorno obsesivo compulsivo (TOC)',
    seoTitle: 'Psicóloga para TOC en Tultitlán y en línea | Soma',
    description:
      'Terapia para el TOC: pensamientos intrusivos, rituales y compulsiones que no puedes detener. Acompañamiento en Tultitlán, Estado de México, y en línea.',
    keywords: ['toc', 'obsesivo', 'compulsivo', 'obsesiones', 'compulsiones', 'manías', 'rituales', 'pensamientos intrusivos', 'revisar', 'lavarme las manos', 'orden'],
    lead:
      'El TOC combina pensamientos que aparecen sin querer y generan mucha angustia (obsesiones) con acciones o rituales para calmarla (compulsiones). Con tratamiento, ese ciclo puede romperse.',
    sientes: [
      'Te llegan pensamientos que te asustan y no puedes sacarlos de tu cabeza.',
      'Revisas, lavas, cuentas u ordenas una y otra vez para quedarte tranquilo.',
      'Sabes que no tiene sentido, pero si no lo haces la angustia crece.',
      'Los rituales te quitan horas del día.',
    ],
    como: [
      'Trabajamos para entender el ciclo obsesión-compulsión y reducir poco a poco el poder de los rituales, con técnicas psicoterapéuticas y de regulación de la ansiedad.',
      'En muchos casos el mejor resultado viene de combinar psicoterapia con tratamiento psiquiátrico; si hace falta, te orientamos.',
    ],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿Ser muy ordenado es tener TOC?',
        a: 'No necesariamente. Se habla de TOC cuando los pensamientos y rituales causan angustia, consumen mucho tiempo o afectan tu vida.',
      },
    ],
    revisado: false,
  },
  {
    slug: 'tlp-trastorno-limite-de-la-personalidad',
    kind: 'area',
    nombre: 'TLP (trastorno límite de la personalidad)',
    titulo: 'Terapia para el trastorno límite de la personalidad (TLP)',
    seoTitle: 'Terapia para TLP (trastorno límite) en Tultitlán | Soma',
    description:
      'Terapia para el trastorno límite de la personalidad: emociones intensas, miedo al abandono, relaciones inestables. En Tultitlán, Estado de México, y en línea.',
    keywords: ['tlp', 'límite', 'limítrofe', 'borderline', 'personalidad', 'emociones intensas', 'miedo al abandono', 'impulsividad', 'cambios de humor', 'autolesiones'],
    lead:
      'El trastorno límite de la personalidad se vive como emociones muy intensas que cambian rápido, miedo al abandono y relaciones que se sienten como una montaña rusa. Con un tratamiento constante, muchas personas logran mucha más estabilidad.',
    sientes: [
      'Tus emociones suben de cero a cien y te cuesta bajarlas.',
      'El miedo a que te dejen te hace reaccionar de formas que luego lamentas.',
      'Pasas de idealizar a alguien a sentirte decepcionado de golpe.',
      'Haces cosas impulsivas para calmar lo que sientes.',
    ],
    como: [
      'El trabajo se centra en regular las emociones, tolerar el malestar sin dañarte y construir relaciones más estables. Es un proceso que necesita constancia y un vínculo terapéutico de confianza.',
      'Con frecuencia se coordina con psiquiatría, sobre todo en momentos de crisis.',
    ],
    enfoques: ['psicoterapia-clinica'],
    faqs: [],
    nota: CRISIS,
    revisado: false,
  },
  {
    slug: 'anorexia-y-bulimia',
    kind: 'area',
    nombre: 'Anorexia y bulimia (TCA)',
    titulo: 'Terapia para trastornos de la conducta alimentaria: anorexia y bulimia',
    seoTitle: 'Terapia para anorexia y bulimia (TCA) en Tultitlán | Soma',
    description:
      'Terapia psicológica para trastornos de la conducta alimentaria: anorexia y bulimia. Acompañamiento a la persona y a su familia, en Tultitlán y en línea.',
    keywords: ['anorexia', 'bulimia', 'tca', 'conducta alimentaria', 'comer', 'no comer', 'vomitar', 'atracón', 'peso', 'imagen corporal', 'dieta', 'me veo gorda', 'me veo gordo'],
    lead:
      'La anorexia y la bulimia son trastornos de la conducta alimentaria: la comida, el peso y la imagen corporal se vuelven el centro de la vida y del sufrimiento. Son tratables, y entre antes se atienden, mejor.',
    sientes: [
      'Piensas en la comida, las calorías o tu peso casi todo el día.',
      'Te restringes, comes a escondidas o compensas después de comer.',
      'Lo que ves en el espejo te angustia, aunque otros te digan que estás bien.',
      'Te preocupa una hija o un hijo que dejó de comer o va al baño después de cada comida.',
    ],
    como: [
      'El tratamiento de un TCA es en equipo: psicoterapia, valoración médica y, cuando hace falta, nutrición y psiquiatría. Desde la psicoterapia trabajamos la relación con la comida y con el cuerpo, y lo que el trastorno está expresando.',
      'Con adolescentes, la familia es parte fundamental del tratamiento.',
    ],
    enfoques: ['psicoterapia-clinica', 'terapia-familiar'],
    faqs: [],
    nota: 'Desmayos, mareos, pérdida de peso rápida o vómito frecuente requieren valoración médica urgente. Si hay riesgo para la vida, llama al 911.',
    revisado: false,
  },
  {
    slug: 'tdah',
    kind: 'area',
    nombre: 'TDA y TDAH',
    titulo: 'Terapia para el TDA y TDAH',
    seoTitle: 'Psicóloga para TDAH en niños y adultos en Tultitlán | Soma',
    description:
      'Acompañamiento psicológico para el TDA y TDAH en niños, adolescentes y adultos: atención, organización, emociones y orientación a padres. En Tultitlán y en línea.',
    keywords: ['tdah', 'tda', 'déficit de atención', 'hiperactividad', 'hiperactivo', 'distraído', 'no se concentra', 'impulsivo', 'inquieto', 'no pone atención', 'escuela'],
    lead:
      'El TDA y el TDAH afectan la atención, la organización y, a veces, el control de los impulsos y del movimiento. La psicoterapia ayuda a desarrollar estrategias, manejar las emociones que vienen con él y orientar a la familia.',
    sientes: [
      'Tu hijo no se concentra, pierde cosas o no termina las tareas.',
      'En la escuela dicen que es inquieto o que interrumpe.',
      'De adulto, sientes que siempre llegas tarde, olvidas cosas o dejas todo a medias.',
      'La frustración y los regaños ya afectan la autoestima.',
    ],
    como: [
      'El diagnóstico de TDAH requiere una evaluación completa, a veces con paidopsiquiatría o neurología. Desde la psicoterapia trabajamos estrategias de organización, regulación emocional y autoestima.',
      'Con niñas y niños damos orientación a madres, padres y, si se requiere, a la escuela.',
    ],
    enfoques: ['psicoterapia-clinica', 'terapia-infantil'],
    faqs: [
      {
        q: '¿Los adultos también pueden tener TDAH?',
        a: 'Sí. Muchas personas reciben el diagnóstico de adultas. Si te identificas, una valoración puede ayudarte a entenderte mejor.',
      },
    ],
    revisado: false,
  },

  /* ───────────── Modalidades ───────────── */
  {
    slug: 'psicologa-en-tultitlan',
    kind: 'modalidad',
    nombre: 'Consulta presencial en Tultitlán',
    titulo: 'Psicóloga en Tultitlán, Estado de México',
    seoTitle: 'Psicóloga en Tultitlán, San Pablo de las Salinas | Soma',
    description:
      'Consultorio de psicología en San Pablo de las Salinas, Tultitlán. Psicoterapia, hipnosis ericksoniana y constelaciones familiares, cerca de Coacalco y Tultepec.',
    keywords: ['tultitlán', 'san pablo de las salinas', 'coacalco', 'tultepec', 'cuautitlán', 'ecatepec', 'presencial', 'consultorio', 'cerca de mí', 'estado de méxico'],
    lead:
      'Soma atiende en un consultorio en San Pablo de las Salinas, Tultitlán, a pocos minutos de Coacalco, Tultepec y Cuautitlán Izcalli. Un espacio tranquilo y privado para tu proceso.',
    como: [
      'La consulta presencial es para quienes prefieren el encuentro cara a cara, para la terapia infantil y familiar, y para el trabajo vivencial de las constelaciones familiares.',
    ],
    incluye: ['Psicoterapia clínica', 'Hipnosis ericksoniana', 'Constelaciones familiares', 'Terapia infantil, adolescente, individual, de pareja y familiar'],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana', 'constelaciones-familiares'],
    faqs: [
      { q: '¿Hay estacionamiento?', a: 'TODO: confirmar estacionamiento y referencias para llegar.' },
    ],
    revisado: false,
  },
  {
    slug: 'terapia-en-linea',
    kind: 'modalidad',
    nombre: 'Terapia en línea',
    titulo: 'Terapia psicológica en línea',
    seoTitle: 'Terapia psicológica en línea con psicóloga certificada | Soma',
    description:
      'Terapia psicológica en línea por videollamada con la Mtra. Lidia Dorantes, psicóloga con cédula profesional. Desde cualquier lugar de México o del mundo.',
    keywords: ['en línea', 'online', 'virtual', 'videollamada', 'a distancia', 'zoom', 'desde casa', 'otra ciudad', 'extranjero'],
    lead:
      'La terapia en línea es una sesión de psicoterapia por videollamada, con la misma profesional y la misma confidencialidad que en consultorio, desde donde estés.',
    como: [
      'Solo necesitas una conexión estable, audífonos y un lugar privado donde puedas hablar con libertad. La hipnosis ericksoniana y la psicoterapia clínica funcionan muy bien por videollamada.',
    ],
    incluye: ['Psicoterapia clínica', 'Hipnosis ericksoniana', 'Terapia individual, de pareja y para adolescentes'],
    enfoques: ['psicoterapia-clinica', 'hipnosis-ericksoniana'],
    faqs: [
      {
        q: '¿La terapia en línea funciona igual que la presencial?',
        a: 'Para muchas personas y motivos de consulta, sí. En la primera sesión valoramos si es la mejor opción para ti.',
      },
      { q: '¿Qué plataforma usan?', a: 'TODO: confirmar plataforma de videollamada.' },
    ],
    revisado: false,
  },

  /* ───────────── Empresas ───────────── */
  {
    slug: 'empresas-nom-035',
    kind: 'empresa',
    nombre: 'Empresas y NOM-035',
    titulo: 'Psicología para empresas y NOM-035',
    seoTitle: 'Psicóloga para empresas y NOM-035 en Estado de México | Soma',
    description:
      'Pláticas y talleres de estrés laboral y burnout, atención psicológica a trabajadores y apoyo en la aplicación de la NOM-035. Estado de México y en línea.',
    keywords: ['empresa', 'empresas', 'nom-035', 'nom 035', 'riesgo psicosocial', 'estrés laboral', 'burnout', 'capacitación', 'conferencia', 'taller', 'trabajadores', 'recursos humanos'],
    lead:
      'Soma acompaña a empresas en el cuidado de la salud mental de su gente: pláticas y talleres, atención clínica a trabajadores y apoyo para cumplir con la NOM-035.',
    como: [
      'La NOM-035-STPS-2018 pide a los centros de trabajo identificar y prevenir los factores de riesgo psicosocial, y canalizar a atención a quienes vivieron acontecimientos traumáticos severos. Te ayudamos a hacerlo de forma humana y ordenada.',
    ],
    incluye: [
      'Pláticas y talleres: estrés laboral, burnout, comunicación asertiva, prevención de la violencia laboral y manejo de emociones.',
      'Atención clínica a trabajadores expuestos a acontecimientos traumáticos severos (asaltos, accidentes graves).',
      'Aplicación e interpretación de los cuestionarios de las guías de referencia de la NOM-035 y propuesta de planes de acción.',
      'Constancias de participación para cada taller.',
    ],
    faqs: [
      {
        q: '¿Dan constancias DC-3?',
        a: SITE.dc3
          ? 'Sí. Además de constancias de participación, emitimos constancias DC-3 con validez ante la STPS.'
          : 'Por ahora entregamos constancias de participación emitidas por el consultorio.',
      },
      {
        q: '¿Los talleres pueden ser en línea?',
        a: 'Sí, pueden ser presenciales en tu centro de trabajo o en línea.',
      },
    ],
    revisado: false,
  },
]

export const bySlug = (slug: string) => SERVICIOS.find((s) => s.slug === slug)
export const byKind = (kind: Kind) => SERVICIOS.filter((s) => s.kind === kind)
