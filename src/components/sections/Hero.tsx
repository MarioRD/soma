import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Stars } from '@/components/effects/Stars'
import { useScrollEffect } from '@/hooks/useScrollEffect'
import type { CapaId } from '@/lib/escena'
import { escenaSSR } from '@/lib/escena-ssr'

// Medidas del paisaje (src/lib/escena.ts). Aquí como constante para que el generador
// del paisaje no viaje en el JS del navegador: solo se usa al prerenderizar.
const VIEWBOX = '0 0 2200 900'

const Aurora = lazy(() => import('@/components/effects/Aurora'))

/**
 * Hero en capas (parallax): cada capa baja a su ritmo mientras la página sube.
 * --k = cuánto "se queda atrás" la capa (1 = fija en el cielo, 0 = se mueve con la página).
 * El primer plano es night-950, el mismo color que la sección siguiente: el paisaje se funde con la página.
 */
function parallax(el: HTMLElement, r: DOMRect) {
  el.style.setProperty('--sy', String(Math.min(Math.max(-r.top, 0), r.height)))
}

function Capa({ k, id, className = '' }: { k: number; id: CapaId; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    // Sin prerender (npm run dev) el SVG llega vacío: se dibuja aquí.
    // Con prerender ya viene en el HTML y React no lo toca al hidratar.
    const el = ref.current
    if (el && !el.firstChild) import('@/lib/escena').then((m) => (el.innerHTML = m.escena(id)))
  }, [id])
  return (
    <div aria-hidden="true" className={`capa ${className}`} style={{ '--k': k } as CSSProperties}>
      <svg
        ref={ref}
        viewBox={VIEWBOX}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        dangerouslySetInnerHTML={{ __html: import.meta.env.SSR ? escenaSSR(id) : '' }}
        suppressHydrationWarning
      />
    </div>
  )
}

function Niebla({ k, top, d, className = '' }: { k: number; top: string; d: string; className?: string }) {
  return (
    <div aria-hidden="true" className="capa" style={{ '--k': k } as CSSProperties}>
      <div className={`niebla ${className}`} style={{ top, '--d': d } as CSSProperties} />
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [aurora, setAurora] = useState(false)
  useScrollEffect(ref, parallax)

  useEffect(() => {
    // la aurora WebGL llega cuando la página ya cargó y el navegador está libre:
    // no compite con el LCP ni con la hidratación (la versión CSS cubre mientras tanto)
    let idle = 0
    const t = setTimeout(() => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setAurora(true), { timeout: 3000 })
        : (setTimeout(() => setAurora(true), 0) as unknown as number)
    }, 1500)
    return () => {
      clearTimeout(t)
      window.cancelIdleCallback?.(idle)
    }
  }, [])

  return (
    <section ref={ref} id="inicio" aria-labelledby="titulo" className="hero relative h-svh min-h-[38rem] overflow-clip">
      {/* cielo: degradado, estrellas que titilan y aurora */}
      <div aria-hidden="true" className="capa cielo" style={{ '--k': 0.92 } as CSSProperties}>
        <Stars />
        <div className="aurora-static absolute inset-x-0 top-0 h-[60%]" />
        {aurora && (
          <Suspense fallback={null}>
            <Aurora className="absolute inset-x-0 top-0 h-[62%] w-full" />
          </Suspense>
        )}
      </div>

      <Capa k={0.76} id="lejanas" />
      <Niebla k={0.7} top="34%" d="110s" />

      {/* el titular vive entre las montañas lejanas y las laderas: al bajar, el paisaje pasa por delante */}
      <div className="capa grid justify-items-center px-5 pt-[clamp(6.5rem,19svh,11rem)]" style={{ '--k': 0.56 } as CSSProperties}>
        <h1
          id="titulo"
          className="shine rise h-fit max-w-[16ch] text-center text-[clamp(2.6rem,6.2vw,5.25rem)] leading-[1.02] font-normal tracking-[-0.02em]"
        >
          Psicología Soma, una luz en tu noche
        </h1>
      </div>

      <Capa k={0.56} id="laderas" />
      <Niebla k={0.46} top="46%" d="80s" />
      <Capa k={0.36} id="bosque" />
      <Niebla k={0.26} top="60%" d="140s" />
      <Capa k={0.16} id="cercanas" />
      <Niebla k={0.1} top="68%" d="95s" className="opacity-70" />
      <Capa k={0} id="primerPlano" className="text-night-950" />

      {/* texto del primer plano: se mueve con la página */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        <p
          className="rise mx-auto max-w-[34ch] text-center text-[1.05rem] leading-relaxed text-moon-100 sm:text-lg"
          style={{ '--delay': '160ms' } as CSSProperties}
        >
          Psicoterapia, hipnosis ericksoniana y constelaciones familiares
        </p>
      </div>
    </section>
  )
}
