import { AgendarCta } from '@/components/sections/AgendarCta'
import { Comunidad } from '@/components/sections/Comunidad'
import { Hero } from '@/components/sections/Hero'
import { ButtonLink } from '@/components/ui/Button'
import { FaqList } from '@/components/ui/FaqList'
import { Retrato } from '@/components/ui/Retrato'
import { ServicioLink } from '@/components/ui/ServicioLink'
import { byKind } from '@/content/servicios'
import { DIRECCION, PREGUNTAS, PSICOLOGA, SITE } from '@/lib/content'
import { HUB_PATH } from '@/lib/routes'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

const H2 = 'text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal'
const SECTION = 'py-24 sm:py-32'

function Enfoques() {
  return (
    <section aria-labelledby="enfoques-titulo" className={SECTION}>
      <div className={CONTAINER}>
        <h2 id="enfoques-titulo" className={`${H2} max-w-[18ch]`}>
          Tres formas de acompañarte, una misma calma
        </h2>
        <ol className="mt-14 grid gap-5">
          {byKind('enfoque').map((t, i) => (
            <li key={t.slug}>
              <a
                href={to(`/${t.slug}/`)}
                className="lantern group grid gap-8 rounded-[2rem] p-7 sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12"
              >
                <div>
                  <p className="font-serif text-5xl leading-none text-candle-200/70 tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-6 text-[clamp(1.75rem,3vw,2.4rem)] leading-tight font-normal">{t.titulo}</h3>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <p className="text-[1.05rem] leading-relaxed text-moon-100">{t.lead}</p>
                  <span className="text-candle-200 transition-transform duration-300 group-hover:translate-x-1">
                    Conocer {t.nombre.toLowerCase()}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ParaQuien() {
  return (
    <section aria-labelledby="quien-titulo" className={SECTION}>
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="quien-titulo" className={`${H2} max-w-[16ch]`}>
            Para cada etapa y cada vínculo
          </h2>
          <a href={to(HUB_PATH)} className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
            Ver todo lo que atendemos
          </a>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byKind('publico').map((s) => (
            <li key={s.slug}>
              <ServicioLink s={s} />
            </li>
          ))}
          <li>
            <ServicioLink s={byKind('modalidad').find((m) => m.slug === 'terapia-en-linea')!} />
          </li>
        </ul>
      </div>
    </section>
  )
}

function Lidia() {
  return (
    <section aria-labelledby="lidia-titulo" className={SECTION}>
      <div className={`${CONTAINER} grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20`}>
        <Retrato className="mx-auto w-full max-w-sm" />
        <div>
          <h2 id="lidia-titulo" className={`${H2} max-w-[16ch]`}>
            Quien te acompaña
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-moon-100">
            Soma es el consultorio de la {PSICOLOGA.completo}, psicóloga y maestra en Psicoterapia Ericksoniana.
          </p>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            {PSICOLOGA.formacion.map((f) => (
              <div key={f.grado} className="border-l-2 border-candle-500/60 pl-5">
                <dt className="font-serif text-xl leading-snug">{f.grado}</dt>
                <dd className="mt-1 text-[0.95rem] text-mist">
                  {f.institucion}, {f.anio}
                </dd>
              </div>
            ))}
            <div className="border-l-2 border-candle-500/60 pl-5">
              <dt className="font-serif text-xl leading-snug">Cédula profesional</dt>
              <dd className="mt-1 text-[0.95rem] text-mist tabular-nums">{PSICOLOGA.cedula}, SEP</dd>
            </div>
          </dl>
          <div className="mt-10">
            <ButtonLink href={to('/mtra-lidia-dorantes/')} variant="ghost">
              Conocer a Lidia
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Donde() {
  return (
    <section aria-labelledby="donde-titulo" className={SECTION}>
      <div className={CONTAINER}>
        <h2 id="donde-titulo" className={`${H2} max-w-[18ch]`}>
          En el consultorio o desde donde estés
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="lantern flex flex-col gap-5 rounded-[2rem] p-7 sm:p-10">
            <h3 className="text-3xl font-normal">Presencial en Tultitlán</h3>
            <p className="leading-relaxed text-moon-100">{DIRECCION}.</p>
            <p className="text-[0.95rem] text-mist">Cerca de Coacalco, Tultepec y Cuautitlán Izcalli.</p>
            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
                Abrir en Google Maps
              </a>
              <a href={to('/psicologa-en-tultitlan/')} className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
                Sobre la consulta presencial
              </a>
            </div>
          </article>
          <article className="lantern flex flex-col gap-5 rounded-[2rem] p-7 sm:p-10">
            <h3 className="text-3xl font-normal">En línea</h3>
            <p className="leading-relaxed text-moon-100">
              Sesiones por videollamada, con la misma profesional y la misma confidencialidad, desde cualquier lugar.
            </p>
            <div className="mt-auto pt-2">
              <a href={to('/terapia-en-linea/')} className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
                Cómo funciona la terapia en línea
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function PreguntasInicio() {
  return (
    <section aria-labelledby="preguntas-titulo" className={SECTION}>
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
        <div>
          <h2 id="preguntas-titulo" className={`${H2} max-w-[14ch]`}>
            Lo que suelen preguntarnos
          </h2>
          <a href={to('/preguntas/')} className="mt-6 inline-block text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
            Todas las preguntas
          </a>
        </div>
        <FaqList faqs={PREGUNTAS.slice(0, 5)} />
      </div>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Enfoques />
      <ParaQuien />
      <Lidia />
      <Donde />
      <PreguntasInicio />
      <Comunidad />
      <AgendarCta />
    </>
  )
}
