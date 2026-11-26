import arbolBlanco from '@/assets/brand/web/arbol-blanco.png'
import { SITE } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'

const CREENCIAS = [
  'Aquí nadie llega tarde.',
  'Lo que callas también cuenta.',
  'Sanar no es olvidar: es aprender a ver de noche.',
]

/** Pertenencia: lo que Soma cree, dicho en voz alta, y dónde encontrarse. */
export function Comunidad() {
  const redes = [
    { label: 'Instagram', href: SITE.social.instagram },
    { label: 'Facebook', href: SITE.social.facebook },
  ]

  return (
    <section id="comunidad" aria-labelledby="comunidad-titulo" className="py-24 sm:py-32">
      <div className={CONTAINER}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <img src={arbolBlanco} alt="" width={335} height={335} loading="lazy" className="size-24 opacity-90" />
            <h2 id="comunidad-titulo" className="mt-8 max-w-[14ch] text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal">
              Bajo el mismo árbol
            </h2>
            <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-moon-100">
              Soma también es una comunidad: personas que eligieron mirarse con más calma.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {redes.map((r) => (
                <li key={r.label}>
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center rounded-full px-5 text-starlight ring-1 ring-starlight/25 ring-inset transition-colors duration-200 hover:bg-starlight/10"
                    >
                      {r.label}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center rounded-full px-5 text-mist ring-1 ring-starlight/15 ring-inset" data-todo>
                      {r.label} (enlace pendiente)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid content-center gap-8">
            {CREENCIAS.map((c) => (
              <li
                key={c}
                className="border-l-2 border-candle-500/60 pl-6 font-serif text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.15] text-starlight"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
