import { useRef, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { Clinica, Constelaciones, Destellos, Hipnosis } from '@/components/effects/Ilustraciones'
import { ButtonLink } from '@/components/ui/Button'
import { byKind, type Servicio } from '@/content/servicios'
import { whatsappUrl } from '@/lib/content'
import { pausarScroll } from '@/lib/lenis'
import { TONOS } from '@/lib/tonos'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

/**
 * "Tres formas de acompañarte": tarjetas que se abren en una ventana.
 * - La tarjeta crece hasta ser la ventana (FLIP con Web Animations, funciona en todos los navegadores).
 * - Clic en cualquier parte de la tarjeta la abre; clic en cualquier parte fuera de ella la cierra.
 * - <dialog> nativo: foco atrapado, Esc cierra, el foco vuelve a la tarjeta.
 * - Sin JS, el "+" es un enlace normal a la página dedicada.
 */

const ILUSTRACION: Record<string, typeof Hipnosis> = {
  'hipnosis-ericksoniana': Hipnosis,
  'constelaciones-familiares': Constelaciones,
  'psicoterapia-clinica': Clinica,
}

/** Color principal de cada tarjeta: tiñe el degradado inferior de la ventana abierta. */
const COLOR: Record<string, string> = {
  'hipnosis-ericksoniana': '#7a4ff0',
  'constelaciones-familiares': '#10b89c',
  'psicoterapia-clinica': '#1a7fd1',
}

const num = (i: number) => String(i + 1).padStart(2, '0')
const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** FLIP: la ventana crece desde el rectángulo de la tarjeta, o se encoge hacia él y se desvanece. */
function morph(panel: HTMLElement, tarjeta: DOMRect, cerrar = false) {
  const aqui = panel.getBoundingClientRect()
  const alla = `translate(${tarjeta.left - aqui.left}px, ${tarjeta.top - aqui.top}px) scale(${tarjeta.width / aqui.width}, ${tarjeta.height / aqui.height})`
  const frames: Keyframe[] = cerrar
    ? // al cerrar el contenido viaja con la ventana (no queda un panel vacío) y se funde con la tarjeta al final
      [
        { transform: 'none', opacity: 1 },
        { transform: alla, opacity: 1, offset: 0.75 },
        { transform: alla, opacity: 0 },
      ]
    : [
        { transform: alla, opacity: 0.6, borderRadius: '1.75rem' },
        { transform: 'none', opacity: 1, borderRadius: '2rem' },
      ]
  return panel.animate(frames, { duration: cerrar ? 460 : 560, easing: EASE, fill: 'both' })
}

export function Enfoques() {
  const enfoques = byKind('enfoque')
  const [abierto, setAbierto] = useState<Servicio | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const origen = useRef<HTMLElement | null>(null)
  const cerrando = useRef(false)

  function abrir(e: MouseEvent, s: Servicio) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return // abrir en pestaña nueva sigue funcionando
    e.preventDefault()
    origen.current = (e.currentTarget as HTMLElement).closest('article')
    flushSync(() => setAbierto(s))
    dlg.current?.showModal()
    pausarScroll(true)
    const p = panel.current
    if (!p || !origen.current || quieto()) return
    morph(p, origen.current.getBoundingClientRect())
    p.querySelector<HTMLElement>('[data-contenido]')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 200, easing: EASE, fill: 'both' })
  }

  async function cerrar() {
    if (cerrando.current) return
    cerrando.current = true
    const p = panel.current
    if (p && origen.current && !quieto()) {
      origen.current.style.visibility = 'visible' // la tarjeta ya está en su lugar, debajo de la ventana que regresa
      dlg.current?.classList.add('cerrando')
      await morph(p, origen.current.getBoundingClientRect(), true).finished.catch(() => {})
    }
    dlg.current?.classList.remove('cerrando')
    dlg.current?.close()
    origen.current?.style.removeProperty('visibility')
    setAbierto(null)
    pausarScroll(false)
    cerrando.current = false
  }

  const i = abierto ? enfoques.indexOf(abierto) : -1
  const Ilus = abierto ? ILUSTRACION[abierto.slug] : null

  return (
    <section aria-labelledby="enfoques-titulo" className="relative pt-8 pb-24 sm:pb-32">
      <div className={CONTAINER}>
        <h2
          id="enfoques-titulo"
          className="shine mx-auto max-w-[30ch] text-center text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal"
        >
          Tres formas de acompañarte, una misma calma
        </h2>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {enfoques.map((s, n) => {
            const Ilustracion = ILUSTRACION[s.slug]
            return (
              <li key={s.slug}>
                <article
                  className="group lantern flex aspect-[4/3] cursor-pointer flex-col justify-end overflow-hidden rounded-[1.75rem] md:aspect-[4/5] lg:aspect-[5/6]"
                  style={{ visibility: abierto?.slug === s.slug ? 'hidden' : undefined }}
                >
                  {/* capas visuales detrás (z negativo dentro del farol aislado): el enlace "+" cubre toda la tarjeta */}
                  <div className="absolute inset-0 -z-10">
                    <Destellos tonos={TONOS[s.slug]} />
                    <Ilustracion className="absolute inset-0 size-full transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.04]" />
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-night-950/90 via-night-950/50 to-transparent" />
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5 sm:p-6">
                    <div>
                      <p className="font-serif text-lg text-candle-200/80 tabular-nums" aria-hidden="true">
                        {num(n)}
                      </p>
                      <h3 className="shine mt-1 text-[1.45rem] leading-tight font-normal">{s.titulo}</h3>
                    </div>
                    <a
                      href={to(`/${s.slug}/`)}
                      onClick={(e) => abrir(e, s)}
                      aria-label={`Ver más sobre ${s.titulo.toLowerCase()}`}
                      aria-haspopup="dialog"
                      className="block shrink-0 rounded-full text-starlight after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']"
                    >
                      {/* el vidrio va en un span: backdrop-filter o transform en el enlace encerrarían su área
                          clicable (::after, que cubre toda la tarjeta) dentro del botón */}
                      <span className="glass grid size-11 place-items-center rounded-full transition-colors duration-300 group-hover:bg-starlight/15">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 transition-transform duration-300 group-hover:rotate-90">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>

      <dialog
        ref={dlg}
        aria-labelledby="enfoque-modal-titulo"
        className="modal-enfoque"
        onCancel={(e) => {
          e.preventDefault()
          cerrar()
        }}
        onClick={(e) => {
          // cualquier clic fuera de la tarjeta abierta la cierra
          const r = panel.current?.getBoundingClientRect()
          if (!r) return
          const fuera = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
          if (fuera) cerrar()
        }}
      >
        {abierto && Ilus && (
          <div
            ref={panel}
            className="lantern grid max-h-[calc(100dvh-1.5rem)] origin-top-left overflow-hidden rounded-[2rem] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            {/* degradado inferior con el color de la tarjeta (morado, verde o azul) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3"
              style={{ background: `linear-gradient(to top, color-mix(in oklab, ${COLOR[abierto.slug]} 55%, transparent), color-mix(in oklab, ${COLOR[abierto.slug]} 18%, transparent) 45%, transparent)` }}
            />
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[28rem]">
              <Destellos tonos={TONOS[abierto.slug]} />
              <Ilus className="absolute inset-0 size-full" />
            </div>
            <div data-contenido className="flex flex-col gap-5 overflow-y-auto p-7 sm:p-10">
              <p className="font-serif text-lg text-candle-200/80 tabular-nums" aria-hidden="true">
                {num(i)}
              </p>
              <h2 id="enfoque-modal-titulo" className="-mt-3 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.08] font-normal">
                {abierto.titulo}
              </h2>
              <p className="leading-relaxed text-moon-100">{abierto.lead}</p>
              {abierto.sientes && (
                <ul className="grid gap-2.5">
                  {abierto.sientes.slice(0, 3).map((t) => (
                    <li key={t} className="border-l-2 border-candle-500/60 pl-4 text-[0.97rem] leading-snug">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <ButtonLink href={to(`/${abierto.slug}/`)}>Conocer más</ButtonLink>
                <ButtonLink
                  href={whatsappUrl(`Hola, me gustaría agendar una sesión en Soma. Me interesa: ${abierto.nombre}.`)}
                  target="_blank"
                  rel="noopener"
                  variant="ghost"
                >
                  Agendar por WhatsApp
                </ButtonLink>
              </div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={cerrar}
              aria-label="Cerrar"
              className="glass absolute top-4 right-4 grid size-11 place-items-center rounded-full text-starlight transition-colors duration-200 hover:bg-starlight/15"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </dialog>
    </section>
  )
}
