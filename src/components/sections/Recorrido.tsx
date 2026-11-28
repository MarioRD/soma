import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import mascota from '@/assets/brand/web/mascota.webp'
import nube from '@/assets/brand/web/nube.webp'
import { Stars } from '@/components/effects/Stars'
import { bySlug, type Servicio } from '@/content/servicios'
import { HUB_PATH } from '@/lib/routes'
import { buttonClass } from '@/lib/ui'
import { to } from '@/lib/url'

/**
 * "El infinito": recorrido por una cinta 3D en forma de ∞ que atraviesa cinco escenas
 * (infantil, adolescentes, individual, pareja, familiar) y termina alejándose para verla completa.
 *
 * Todo el contenido (tarjetas, textos, enlaces) es HTML normal y prerenderizado. La parte viva
 * (cinta WebGL, fuegos artificiales, figuras que se lanzan, nubes, salto entre escenas) se carga
 * aparte (recorrido-vivo.ts) cuando el recorrido se acerca a la pantalla, y nunca con reduced-motion:
 * entonces quedan las escenas estáticas, una tras otra.
 */

type Tono = 'claro' | 'oscuro'

const TARJETA: Record<Tono, string> = {
  claro: 'bg-starlight/60 text-night-900 ring-1 ring-starlight/70 shadow-[0_20px_60px_-30px_var(--color-night-900)]',
  oscuro: 'bg-night-950/35 text-starlight ring-1 ring-starlight/20 shadow-[0_20px_60px_-30px_var(--color-night-950)]',
}

function Tarjeta({ s, tono, className }: { s: Servicio; tono: Tono; className: string }) {
  const claro = tono === 'claro'
  return (
    <article
      className={`absolute z-20 w-[min(26rem,calc(100%-2.5rem))] rounded-[1.75rem] p-6 backdrop-blur-xl sm:p-8 ${TARJETA[tono]} ${className}`}
    >
      <h3 className="text-[clamp(1.6rem,2.6vw,2.1rem)] leading-tight font-normal">{s.titulo}</h3>
      <p className={`mt-4 text-[1.02rem] leading-relaxed ${claro ? 'text-night-800' : 'text-moon-100'}`}>{s.lead}</p>
      <a
        href={to(`/${s.slug}/`)}
        className={`mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-1 underline-offset-4 ${claro ? 'text-moon-700 hover:text-night-900' : 'text-candle-200 hover:text-starlight'}`}
      >
        Leer más<span className="sr-only"> sobre {s.titulo.toLowerCase()}</span>
      </a>
    </article>
  )
}

function Tramo({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  return (
    <div data-tramo={id} className={`tramo relative h-svh min-h-[38rem] overflow-clip ${className}`}>
      {children}
    </div>
  )
}

/* ───────────── Figuras de la escena infantil (SVG con volumen; se pueden lanzar) ───────────── */

function Figura({ forma, style, className = '' }: { forma: keyof typeof FORMAS; style: CSSProperties; className?: string }) {
  return (
    <div data-cuerpo aria-hidden="true" className={`cuerpo absolute z-20 ${className}`} style={style}>
      <svg viewBox="0 0 100 100" className="size-full overflow-visible drop-shadow-[0_14px_18px_var(--color-kid-shadow)]">
        {FORMAS[forma]}
      </svg>
    </div>
  )
}

const rg = (id: string, a: string, b: string, c: string, cx = '35%', cy = '30%') => (
  <radialGradient id={id} cx={cx} cy={cy} r="75%">
    <stop offset="0" stopColor={a} />
    <stop offset="0.55" stopColor={b} />
    <stop offset="1" stopColor={c} />
  </radialGradient>
)
const lg = (id: string, a: string, b: string, c: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor={a} />
    <stop offset="0.55" stopColor={b} />
    <stop offset="1" stopColor={c} />
  </linearGradient>
)

const FORMAS = {
  esfera: (
    <>
      <defs>{rg('f-esfera', '#e2d4ff', '#9b7bf0', '#4f2fa8')}</defs>
      <circle cx="50" cy="50" r="46" fill="url(#f-esfera)" />
    </>
  ),
  pelota: (
    <>
      <defs>{rg('f-pelota', '#ffd0c8', '#f2857a', '#b8463f')}</defs>
      <circle cx="50" cy="50" r="40" fill="url(#f-pelota)" />
    </>
  ),
  cilindro: (
    <>
      <defs>{lg('f-cil', '#f7b2c8', '#e36d95', '#a83d68')}</defs>
      <path d="M14 26v48a36 13 0 0 0 72 0V26Z" fill="url(#f-cil)" />
      <ellipse cx="50" cy="26" rx="36" ry="13" fill="#ffc9da" />
    </>
  ),
  cubo: (
    <>
      <path d="M50 8 88 28 50 48 12 28Z" fill="#9dbcff" />
      <path d="M12 28 50 48v44L12 72Z" fill="#5679e3" />
      <path d="M88 28 50 48v44l38-20Z" fill="#3b5bc0" />
    </>
  ),
  cono: (
    <>
      <defs>{lg('f-cono', '#ffe3a3', '#ffb347', '#d9791c')}</defs>
      <path d="M50 6 88 80a38 13 0 0 1-76 0Z" fill="url(#f-cono)" />
    </>
  ),
  prisma: (
    <>
      <defs>{lg('f-prisma', '#b7f3ff', '#5cc8ef', '#2b86c0')}</defs>
      <path d="M50 10c4 0 7 2 9 6l30 52c4 8-1 16-10 16H21c-9 0-14-8-10-16l30-52c2-4 5-6 9-6Z" fill="url(#f-prisma)" />
      <path d="M50 10c4 0 7 2 9 6l30 52c4 8-1 16-10 16H50Z" fill="#2b86c0" opacity=".35" />
    </>
  ),
}

/* ───────────── Escena familiar: atardecer con aves ───────────── */

const AVES = Array.from({ length: 11 }, (_, i) => ({
  x: (i % 4) * 26 + (i > 3 ? 12 : 0) + (i > 7 ? 6 : 0),
  y: Math.floor(i / 4) * 18 + (i % 2) * 7,
  s: 0.7 + ((i * 37) % 10) / 22,
  d: `${0.55 + ((i * 13) % 7) / 20}s`,
}))

function Aves() {
  return (
    <svg aria-hidden="true" viewBox="0 0 130 70" className="aves absolute top-[18%] left-0 w-[min(34rem,70vw)] text-night-950/80">
      {AVES.map((a, i) => (
        <g key={i} transform={`translate(${a.x} ${a.y}) scale(${a.s})`}>
          <g className="ala" style={{ '--d': a.d } as CSSProperties}>
            <path d="M0 0Q-5-5-11-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M0 0Q5-5 11-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </svg>
  )
}

/* ───────────── Escena de pareja: nubes (cada una con varias bocanadas que se apartan del cursor) ───────────── */

const NUBES = [
  { left: '-6%', top: '8%', w: 'min(30rem,60vw)' },
  { left: '62%', top: '4%', w: 'min(24rem,50vw)' },
  { left: '14%', top: '62%', w: 'min(22rem,46vw)' },
  { left: '70%', top: '58%', w: 'min(26rem,52vw)' },
]

function Nube({ left, top, w }: { left: string; top: string; w: string }) {
  return (
    <div aria-hidden="true" className="nube-deriva absolute" style={{ left, top, width: w }}>
      {[0, 1, 2].map((k) => (
        <img
          key={k}
          data-bocanada
          src={nube}
          alt=""
          width={720}
          height={328}
          loading="lazy"
          decoding="async"
          className="absolute w-full"
          style={{ left: `${k * 18 - 18}%`, top: `${(k % 2) * 14}%`, opacity: k === 1 ? 1 : 0.8, scale: k === 1 ? '1' : '0.7' }}
        />
      ))}
      <div className="aspect-[720/328]" />
    </div>
  )
}

export function Recorrido() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let parar: (() => void) | undefined
    let cancelado = false
    // la parte viva se descarga solo cuando el recorrido está a una pantalla de distancia
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        import('@/components/effects/recorrido-vivo').then((m) => {
          if (!cancelado) parar = m.iniciar(el)
        })
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)
    return () => {
      cancelado = true
      io.disconnect()
      parar?.()
    }
  }, [])

  const s = (slug: string) => bySlug(slug)!

  return (
    <div ref={ref} className="recorrido relative">
      {/* la cinta: fija en pantalla mientras dura el recorrido, delante de los fondos y detrás del contenido */}
      <div aria-hidden="true" className="pointer-events-none sticky top-0 z-10 -mb-[100svh] h-svh">
        <canvas data-cinta className="size-full" />
      </div>

      <Tramo id="infantil" className="tramo-infantil">
        <Figura forma="cilindro" style={{ left: '7%', top: '16%' }} className="size-[clamp(4.5rem,9vw,7.5rem)]" />
        <Figura forma="esfera" style={{ left: '4%', top: '44%' }} className="size-[clamp(4rem,7vw,6rem)]" />
        <Figura forma="cubo" style={{ left: '17%', top: '38%' }} className="size-[clamp(4rem,7.5vw,6.5rem)]" />
        <Figura forma="prisma" style={{ left: '74%', top: '6%' }} className="size-[clamp(4.5rem,8vw,7rem)]" />
        <Figura forma="pelota" style={{ left: '62%', top: '14%' }} className="size-[clamp(3.5rem,6vw,5rem)]" />
        <Figura forma="cono" style={{ left: '86%', top: '12%' }} className="size-[clamp(4rem,7vw,6rem)]" />
        <Figura forma="esfera" style={{ left: '44%', top: '70%' }} className="size-[clamp(3rem,5vw,4.5rem)]" />
        <div data-cuerpo aria-hidden="true" className="cuerpo absolute z-20 w-[clamp(7rem,13vw,11rem)]" style={{ left: '28%', top: '20%' }}>
          <img src={mascota} alt="" width={354} height={360} loading="lazy" decoding="async" draggable={false} className="w-full drop-shadow-[0_18px_22px_var(--color-kid-shadow)]" />
        </div>
        <Tarjeta s={s('terapia-infantil')} tono="claro" className="bottom-6 left-1/2 -translate-x-1/2 sm:top-[22%] sm:right-[8%] sm:bottom-auto sm:left-auto sm:translate-x-0" />
      </Tramo>

      <Tramo id="adolescentes" className="tramo-adolescentes">
        <canvas data-fuegos aria-hidden="true" className="absolute inset-0 size-full" />
        <Tarjeta s={s('terapia-adolescentes')} tono="oscuro" className="bottom-6 left-1/2 -translate-x-1/2 sm:bottom-[10%]" />
      </Tramo>

      <Tramo id="individual" className="tramo-individual">
        <div aria-hidden="true" className="respira absolute top-[38%] left-[26%] size-[min(26rem,70vw)] -translate-1/2">
          <span />
          <span />
          <span />
        </div>
        <Tarjeta s={s('terapia-individual')} tono="oscuro" className="bottom-6 left-1/2 -translate-x-1/2 sm:right-[8%] sm:bottom-[12%] sm:left-auto sm:translate-x-0" />
      </Tramo>

      <Tramo id="pareja" className="tramo-pareja">
        {NUBES.map((n, i) => (
          <Nube key={i} {...n} />
        ))}
        <Tarjeta s={s('terapia-de-pareja')} tono="claro" className="bottom-6 left-1/2 -translate-x-1/2 sm:top-[16%] sm:right-[10%] sm:bottom-auto sm:left-auto sm:translate-x-0" />
      </Tramo>

      <Tramo id="familiar" className="tramo-familiar">
        <div aria-hidden="true" className="sol absolute top-[52%] left-[64%] size-[min(16rem,40vw)] -translate-1/2 rounded-full" />
        <Aves />
        <svg aria-hidden="true" viewBox="0 0 1600 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[30%] w-full">
          <path d="M0 140C180 90 330 120 470 100s300-70 460-30 260 60 400 20 200-40 270-20V300H0Z" className="fill-sunset-hill-700" />
          <path d="M0 210c160-40 320-20 480-40s330-50 520-10 300 40 600 0V300H0Z" className="fill-sunset-hill-900" />
        </svg>
        <Tarjeta s={s('terapia-familiar')} tono="oscuro" className="bottom-6 left-1/2 -translate-x-1/2 sm:top-[34%] sm:bottom-auto sm:left-[8%] sm:translate-x-0" />
      </Tramo>

      <Tramo id="final" className="tramo-final">
        <Stars />
        <div className="absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] z-20 grid justify-items-center px-5">
          <a href={to(HUB_PATH)} className={buttonClass('ghost')}>
            Ver todo lo que atendemos
          </a>
        </div>
      </Tramo>
    </div>
  )
}
