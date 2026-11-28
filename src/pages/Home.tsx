import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Buscador } from '@/components/Buscador'
import { AgendarCta } from '@/components/sections/AgendarCta'
import { Enfoques } from '@/components/sections/Enfoques'
import { Comunidad } from '@/components/sections/Comunidad'
import { Hero } from '@/components/sections/Hero'
import { ButtonLink } from '@/components/ui/Button'
import { FaqList } from '@/components/ui/FaqList'
import { Retrato } from '@/components/ui/Retrato'
import { ServicioLink } from '@/components/ui/ServicioLink'
import { byKind } from '@/content/servicios'
import { useScrollEffect } from '@/hooks/useScrollEffect'
import { DIRECCION, PREGUNTAS, PSICOLOGA, SITE, whatsappUrl } from '@/lib/content'
import { HUB_PATH } from '@/lib/routes'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

const H2 = 'text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal'
const SECTION = 'py-24 sm:py-32'

/* Luciérnagas del buscador: posiciones fijas (mismo HTML en servidor y cliente) */
const LUCES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 97}%`,
  top: `${35 + ((i * 53) % 60)}%`,
  '--d': `${10 + (i % 5) * 2.5}s`,
  '--delay': `${-(i * 1.7)}s`,
  '--dx': `${i % 2 ? 24 : -18}px`,
})) as CSSProperties[]

/** Buscador a pantalla completa: la parte más oscura de la noche, con una vela y luciérnagas. */
function Busqueda() {
  return (
    <section aria-label="Buscador" className="relative grid min-h-svh place-items-center overflow-clip py-24">
      <div aria-hidden="true" className="absolute inset-0">
        {LUCES.map((st, i) => (
          <span key={i} className="luciernaga" style={st} />
        ))}
      </div>
      <div className={`${CONTAINER} relative`}>
        <Buscador id="buscador" grande />
        <p className="mt-12 text-center text-[0.95rem] text-mist">
          ¿Prefieres contarlo?{' '}
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
            Escríbenos por WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}

/** Del buscador (lo más oscuro) a las tarjetas (más claro, con luces de aurora alrededor). */
function Amanecer({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-clip bg-[linear-gradient(180deg,var(--color-night-950)_0%,var(--color-night-950)_42%,var(--color-night-850)_72%,var(--color-night-800)_100%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] [mask-image:linear-gradient(to_bottom,var(--color-night-950)_45%,transparent)]">
        <div className="absolute top-[10%] -left-[10%] size-[36rem] rounded-full bg-aurora-500/20 blur-[120px]" />
        <div className="absolute top-0 -right-[8%] size-[34rem] rounded-full bg-glacier-500/25 blur-[120px]" />
        <div className="absolute -right-[4%] bottom-[5%] size-[22rem] rounded-full bg-moon-300/20 blur-[100px]" />
      </div>
      {children}
    </div>
  )
}

/* "Para cada etapa y cada vínculo": llega borroso y pequeño, se vuelve nítido y sigue hacia ti hasta atravesar la pantalla */
function zoom(el: HTMLElement, r: DOMRect, vh: number) {
  const h = el.querySelector<HTMLElement>('[data-zoom]')
  if (!h) return
  const p = Math.min(Math.max((vh - r.top) / (r.height), 0), 1)
  let scale: number, blur: number, op: number
  if (p < 0.42) {
    const e = 1 - (1 - p / 0.42) ** 3
    scale = 0.6 + 0.4 * e
    blur = 14 * (1 - e)
    op = 0.1 + 0.9 * e
  } else if (p < 0.6) {
    scale = 1 + (p - 0.42) * 0.4
    blur = 0
    op = 1
  } else {
    const e = (p - 0.6) / 0.4
    scale = 1.07 + 1.4 * e * e
    blur = 8 * e * e
    op = 1 - e ** 1.6
  }
  h.style.transform = `scale(${scale.toFixed(3)})`
  h.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none'
  h.style.opacity = op.toFixed(3)
}

function ParaQuien() {
  const ref = useRef<HTMLDivElement>(null)
  useScrollEffect(ref, zoom)
  return (
    <section aria-labelledby="quien-titulo" className="bg-[linear-gradient(180deg,var(--color-night-800)_0%,var(--color-night-900)_30%,var(--color-night-950)_100%)]">
      <div ref={ref} className="relative motion-safe:h-[240svh]">
        <div className="sticky top-0 grid h-svh place-items-center overflow-clip px-5">
          <h2
            id="quien-titulo"
            data-zoom
            className="shine max-w-[16ch] text-center text-[clamp(2.2rem,5.4vw,4.75rem)] leading-[1.04] font-normal tracking-[-0.015em] will-change-[transform,filter,opacity]"
          >
            Para cada etapa y cada vínculo
          </h2>
        </div>
      </div>
      <div className={`${CONTAINER} pb-24 sm:pb-32`}>
        <div className="flex justify-end">
          <a href={to(HUB_PATH)} className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
            Ver todo lo que atendemos
          </a>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <Amanecer>
        <Busqueda />
        <Enfoques />
      </Amanecer>
      <ParaQuien />
      {/* lo de abajo se maqueta y pinta hasta acercarse a la pantalla */}
      <div className="[contain-intrinsic-size:auto_3200px] [content-visibility:auto]">
        <Lidia />
        <Donde />
        <PreguntasInicio />
        <Comunidad />
        <AgendarCta />
      </div>
    </>
  )
}
