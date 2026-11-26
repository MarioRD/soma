import { Buscador } from '@/components/Buscador'
import { AgendarCta } from '@/components/sections/AgendarCta'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { FaqList } from '@/components/ui/FaqList'
import { Retrato } from '@/components/ui/Retrato'
import { ServicioLink } from '@/components/ui/ServicioLink'
import { byKind, type Kind } from '@/content/servicios'
import { DIRECCION, PREGUNTAS, PSICOLOGA, SITE, whatsappUrl } from '@/lib/content'
import type { Route } from '@/lib/routes'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

const H1 = 'mt-8 max-w-[20ch] text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.04] font-normal tracking-[-0.015em]'
const H2 = 'text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-normal'
const LEAD = 'mt-6 max-w-[56ch] text-lg leading-relaxed text-moon-100 sm:text-xl'

function PageHeader({ route, title, lead }: { route: Route; title: string; lead?: string }) {
  return (
    <header className="pt-32 pb-12 sm:pt-40">
      <div className={CONTAINER}>
        {route.crumbs && <Breadcrumbs crumbs={route.crumbs} />}
        <h1 className={H1}>{title}</h1>
        {lead && <p className={LEAD}>{lead}</p>}
      </div>
    </header>
  )
}

/* ───────────── /como-te-ayudo/ ───────────── */

const GRUPOS: { kind: Kind; titulo: string; texto: string }[] = [
  { kind: 'area', titulo: 'Lo que atendemos', texto: 'Si reconoces lo que vives en alguno de estos temas, ahí te contamos cómo lo trabajamos.' },
  { kind: 'publico', titulo: 'Para quién', texto: 'Niñas, niños, adolescentes, adultos, parejas y familias.' },
  { kind: 'enfoque', titulo: 'Enfoques', texto: 'Las herramientas con las que trabaja Soma.' },
  { kind: 'modalidad', titulo: 'Modalidades', texto: 'En consultorio en Tultitlán o por videollamada.' },
  { kind: 'empresa', titulo: 'Empresas', texto: 'Salud mental en el trabajo y NOM-035.' },
]

export function Hub({ route }: { route: Route }) {
  return (
    <>
      <PageHeader route={route} title="Cómo te puedo ayudar" />
      <div className={CONTAINER}>
        <Buscador id="buscador-hub" />
      </div>
      {GRUPOS.map((g) => (
        <section key={g.kind} aria-labelledby={`g-${g.kind}`} className="pt-20 sm:pt-24">
          <div className={CONTAINER}>
            <h2 id={`g-${g.kind}`} className={H2}>
              {g.titulo}
            </h2>
            <p className="mt-3 max-w-[56ch] text-moon-100">{g.texto}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byKind(g.kind).map((s) => (
                <li key={s.slug}>
                  <ServicioLink s={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <AgendarCta />
    </>
  )
}

/* ───────────── /mtra-lidia-dorantes/ ───────────── */

export function Sobre({ route }: { route: Route }) {
  return (
    <>
      <header className="pt-32 pb-12 sm:pt-40">
        <div className={`${CONTAINER} grid items-end gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]`}>
          <div>
            {route.crumbs && <Breadcrumbs crumbs={route.crumbs} />}
            <h1 className={H1}>{PSICOLOGA.completo}</h1>
            <p className={LEAD}>
              Psicóloga clínica y maestra en Psicoterapia Ericksoniana. En Soma acompaña a niñas, niños, adolescentes,
              adultos, parejas y familias, en consultorio en Tultitlán y en línea.
            </p>
          </div>
          <Retrato className="w-full max-w-xs justify-self-center md:justify-self-end" />
        </div>
      </header>

      <section aria-labelledby="formacion" className="py-16 sm:py-20">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
          <h2 id="formacion" className={`${H2} max-w-[12ch]`}>
            Formación
          </h2>
          <dl className="lantern grid gap-6 rounded-[2rem] p-7 sm:p-10">
            {PSICOLOGA.formacion.map((f) => (
              <div key={f.grado} className="grid gap-1 border-b border-starlight/10 pb-6">
                <dt className="font-serif text-2xl">{f.grado}</dt>
                <dd className="text-moon-100">
                  {f.institucion}, {f.anio}
                </dd>
              </div>
            ))}
            <div className="grid gap-1">
              <dt className="font-serif text-2xl">Cédula profesional {PSICOLOGA.cedula}</dt>
              <dd className="text-moon-100">
                Expedida por la Secretaría de Educación Pública.{' '}
                <a href={PSICOLOGA.verificarCedula} target="_blank" rel="noopener" className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
                  Verifícala en el Registro Nacional de Profesionistas
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="enfoque" className="py-16 sm:py-20">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
          <h2 id="enfoque" className={`${H2} max-w-[12ch]`}>
            Cómo trabaja
          </h2>
          <div className="grid gap-6">
            <p className="max-w-[62ch] text-[1.08rem] leading-relaxed text-moon-100">
              Su base es la psicoterapia clínica. Su especialidad, la psicoterapia ericksoniana: una forma de trabajar
              que parte de los recursos de cada persona y usa la conversación, las metáforas y la hipnosis para
              facilitar el cambio. También integra las constelaciones familiares para mirar los vínculos.
            </p>
            {/* TODO: unas líneas en primera persona de Lidia: por qué eligió esta profesión y qué cuida en cada sesión */}
            <ul className="flex flex-wrap gap-2">
              {byKind('enfoque').map((s) => (
                <li key={s.slug}>
                  <a href={to(`/${s.slug}/`)} className="inline-flex min-h-10 items-center rounded-full px-4 text-[0.95rem] ring-1 ring-starlight/20 ring-inset transition-colors duration-200 hover:bg-starlight/10">
                    {s.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <AgendarCta />
    </>
  )
}

/* ───────────── /preguntas/ ───────────── */

export function PreguntasPage({ route }: { route: Route }) {
  return (
    <>
      <PageHeader route={route} title="Preguntas frecuentes" lead="Lo que conviene saber antes de tu primera sesión." />
      <section aria-label="Preguntas" className="pb-8">
        <div className={CONTAINER}>
          <div className="max-w-3xl">
            <FaqList faqs={PREGUNTAS} />
          </div>
        </div>
      </section>
      <AgendarCta />
    </>
  )
}

/* ───────────── /agendar/ ───────────── */

export function AgendarPage({ route }: { route: Route }) {
  return (
    <>
      <PageHeader
        route={route}
        title="Agenda tu primera sesión"
        lead="La forma más rápida es WhatsApp: cuéntanos qué te gustaría trabajar y te proponemos horarios."
      />
      <section aria-label="Opciones para agendar" className="pb-24">
        <div className={`${CONTAINER} grid gap-5 md:grid-cols-2`}>
          <article className="lantern flex flex-col gap-5 rounded-[2rem] p-7 sm:p-10">
            <h2 className="text-3xl font-normal">WhatsApp</h2>
            <p className="font-serif text-4xl tabular-nums">{SITE.telefono}</p>
            <p className="text-moon-100">Te respondemos para encontrar un horario. Puedes escribir aunque aún no sepas qué terapia necesitas.</p>
            <div className="mt-auto pt-2">
              <ButtonLink href={whatsappUrl()} target="_blank" rel="noopener">
                Escribir por WhatsApp
              </ButtonLink>
            </div>
          </article>
          <article className="lantern flex flex-col gap-5 rounded-[2rem] p-7 sm:p-10">
            <h2 className="text-3xl font-normal">Consultorio</h2>
            <address className="leading-relaxed text-moon-100 not-italic">{DIRECCION}</address>
            <dl className="grid gap-3 text-[0.97rem]">
              <div>
                <dt className="text-mist">Horario</dt>
                <dd>{SITE.hours || 'Por confirmar'}</dd>
              </div>
              <div>
                <dt className="text-mist">Correo</dt>
                <dd>{SITE.email}</dd>
              </div>
            </dl>
            <div className="mt-auto pt-2">
              <ButtonLink href={SITE.mapsUrl} target="_blank" rel="noopener" variant="ghost">
                Abrir en Google Maps
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

/* ───────────── /aviso-de-privacidad/ ───────────── */

export function Privacidad({ route }: { route: Route }) {
  const P = 'max-w-[68ch] leading-relaxed text-moon-100'
  return (
    <>
      <PageHeader route={route} title="Aviso de privacidad" />
      <section aria-label="Aviso de privacidad" className="pb-24">
        <div className={`${CONTAINER} grid gap-6`}>
          <p role="note" className="max-w-[68ch] rounded-2xl bg-dusk-600/15 p-5 text-starlight ring-1 ring-dusk-400/30 ring-inset">
            Borrador de trabajo: debe revisarlo un profesional jurídico antes de publicar el sitio en su dominio definitivo.
          </p>
          <h2 className="mt-4 text-2xl font-normal">Responsable</h2>
          <p className={P}>
            {PSICOLOGA.completo} (Soma Psicología), con domicilio en {DIRECCION}, es responsable del tratamiento de tus datos
            personales.
          </p>
          <h2 className="mt-4 text-2xl font-normal">Datos que tratamos y para qué</h2>
          <p className={P}>
            Nombre y medios de contacto, y la información que decidas compartir sobre tu motivo de consulta, para agendar
            y brindarte atención psicológica. La información de salud se considera dato personal sensible y se trata con
            confidencialidad y medidas de seguridad reforzadas.
          </p>
          <h2 className="mt-4 text-2xl font-normal">Estadísticas del sitio</h2>
          <p className={P}>
            Si lo aceptas, usamos Google Analytics para conocer de forma agregada cómo se usa este sitio. Puedes rechazarlo
            sin que cambie tu experiencia.
          </p>
          <h2 className="mt-4 text-2xl font-normal">Tus derechos</h2>
          <p className={P}>
            Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos (derechos ARCO) escribiendo por
            WhatsApp al {SITE.telefono}. {/* TODO: correo para derechos ARCO y fecha de última actualización */}
          </p>
        </div>
      </section>
    </>
  )
}

/* ───────────── 404 ───────────── */

export function NotFound() {
  return (
    <section className="grid min-h-[80dvh] place-items-center pt-32 pb-16">
      <div className={`${CONTAINER} text-center`}>
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-normal">Esta página no existe</h1>
        <p className="mx-auto mt-5 max-w-[40ch] text-lg text-moon-100">Quizá buscabas algo de esto:</p>
        <div className="mx-auto mt-8 flex max-w-xl justify-center text-left">
          <Buscador id="buscador-404" />
        </div>
        <div className="mt-10">
          <ButtonLink href={to('/')} variant="ghost">
            Volver al inicio
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
