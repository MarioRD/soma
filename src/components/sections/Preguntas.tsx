import { PREGUNTAS } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'

/** Preguntas frecuentes: <details> nativo (funciona sin JS) y alimenta el FAQPage del JSON-LD. */
export function Preguntas() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="py-24 sm:py-32">
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
        <h2 id="preguntas-titulo" className="max-w-[14ch] text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal">
          Lo que suelen preguntarnos
        </h2>

        <div className="border-t border-starlight/12">
          {PREGUNTAS.map((p) => (
            <details key={p.q} name="preguntas" className="group border-b border-starlight/12">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl transition-colors duration-200 hover:text-candle-200 sm:text-2xl [&::-webkit-details-marker]:hidden">
                {p.q}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-candle-200 transition-transform duration-300 group-open:rotate-45"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </summary>
              <p className="max-w-[60ch] pb-6 text-[1.05rem] leading-relaxed text-moon-100">{p.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
