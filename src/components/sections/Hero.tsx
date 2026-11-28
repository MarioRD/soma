import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Stars } from '@/components/effects/Stars'
import { ButtonLink } from '@/components/ui/Button'
import { useScrollEffect } from '@/hooks/useScrollEffect'
import { escena, H, W, type CapaId } from '@/lib/escena'
import { HUB_PATH } from '@/lib/routes'
import { to } from '@/lib/url'

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
    if (el && !el.firstChild) el.innerHTML = escena(id)
  }, [id])
  return (
    <div aria-hidden="true" className={`capa ${className}`} style={{ '--k': k } as CSSProperties}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        dangerouslySetInnerHTML={{ __html: import.meta.env.SSR ? escena(id) : '' }}
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

      <Capa k={0.74} id="lejanas" />
      <Niebla k={0.66} top="50%" d="110s" />

      {/* el titular vive entre las montañas lejanas y las medias: al bajar, el paisaje pasa por delante */}
      <div className="capa grid justify-items-center px-5 pt-[clamp(6.5rem,17svh,10rem)]" style={{ '--k': 0.5 } as CSSProperties}>
        <h1
          id="titulo"
          className="shine rise h-fit max-w-[16ch] text-center text-[clamp(2.6rem,6.2vw,5.25rem)] leading-[1.02] font-normal tracking-[-0.02em]"
        >
          Psicología Soma, una luz en tu noche
        </h1>
      </div>

      <Capa k={0.52} id="medias" />
      <Niebla k={0.44} top="60%" d="80s" className="opacity-80" />
      <Capa k={0.32} id="bosque" />
      <Niebla k={0.24} top="70%" d="140s" className="opacity-60" />
      <Capa k={0.14} id="cercanas" />
      <Capa k={0} id="primerPlano" className="text-night-950" />

      {/* primer plano de texto: se mueve con la página */}
      <div className="absolute inset-x-0 bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto grid w-full max-w-7xl items-end gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="lantern hidden max-w-xs rounded-[1.75rem] p-5 lg:block">
            <p className="text-[0.95rem] leading-relaxed text-moon-100">
              Consulta presencial en Tultitlán, Estado de México, y en línea desde cualquier lugar.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={to('/agendar/')} className="min-h-11 px-5 text-[0.95rem]">
                Agendar
              </ButtonLink>
              <ButtonLink href={to(HUB_PATH)} variant="ghost" className="min-h-11 px-5 text-[0.95rem]">
                Cómo te ayudo
              </ButtonLink>
            </div>
          </div>
          <p
            className="rise mx-auto max-w-[44ch] text-center text-[1.05rem] leading-relaxed text-moon-100 sm:text-lg"
            style={{ '--delay': '160ms' } as CSSProperties}
          >
            Psicoterapia, hipnosis ericksoniana y constelaciones familiares, en Tultitlán y en línea
          </p>
        </div>
      </div>
    </section>
  )
}
