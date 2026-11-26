import type { CSSProperties } from 'react'
import arbol720 from '@/assets/brand/web/arbol-720.webp'
import arbol1200 from '@/assets/brand/web/arbol-1200.webp'
import { ButtonLink } from '@/components/ui/Button'
import { CONTAINER } from '@/lib/ui'

/**
 * Hero: el logo (árbol bajo la luna) ES la luna del cielo de la página.
 * El titular queda a la izquierda, sobre el atardecer.
 */
export function Hero() {
  return (
    <section id="inicio" aria-labelledby="titulo" className="relative flex min-h-dvh items-center pt-28 pb-16">
      <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`}>
        <div className="order-2 lg:order-1">
          <h1
            id="titulo"
            className="rise max-w-[13ch] text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[1.02] font-normal tracking-[-0.02em]"
          >
            Psicología Soma, una luz en tu noche
          </h1>
          <p className="rise mt-6 max-w-[34ch] text-lg leading-relaxed text-moon-100 sm:text-xl" style={{ '--delay': '120ms' } as CSSProperties}>
            Psicoterapia, hipnosis ericksoniana y constelaciones familiares para volver a ti.
          </p>
          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ '--delay': '220ms' } as CSSProperties}>
            <ButtonLink href="#agendar">Agendar primera sesión</ButtonLink>
            <ButtonLink href="#terapias" variant="ghost">
              Conocer las terapias
            </ButtonLink>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-[min(78vw,30rem)] lg:order-2 lg:w-full lg:max-w-[34rem]">
          {/* halo de luna */}
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full bg-moon-300/40 blur-[70px]"
          />
          <img
            src={arbol1200}
            srcSet={`${arbol720} 720w, ${arbol1200} 1200w`}
            sizes="(min-width: 1024px) 34rem, 78vw"
            alt="Logotipo de Soma: un árbol en flor bajo una luna llena estrellada, con la firma soma al pie"
            width={1200}
            height={1200}
            fetchPriority="high"
            className="moon-mask relative aspect-square w-full"
          />
        </div>
      </div>
    </section>
  )
}
