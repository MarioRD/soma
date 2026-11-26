import { TERAPIAS } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'

/** Tres faroles: cada terapia es un panel de vidrio que se enciende al pasar. */
export function Terapias() {
  return (
    <section id="terapias" aria-labelledby="terapias-titulo" className="py-24 sm:py-32">
      <div className={CONTAINER}>
        <h2 id="terapias-titulo" className="max-w-[18ch] text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal">
          Tres formas de acompañarte, una misma calma
        </h2>

        <ol className="mt-14 grid gap-5">
          {TERAPIAS.map((t, i) => (
            <li key={t.id} id={t.id} className="scroll-mt-28">
              <article
                tabIndex={-1}
                className="lantern grid gap-8 rounded-[2rem] p-7 sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12"
              >
                <div>
                  <p className="font-serif text-5xl leading-none text-candle-200/70 tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-6 text-[clamp(1.75rem,3vw,2.4rem)] leading-tight font-normal">{t.nombre}</h3>
                  <p className="mt-3 text-lg text-candle-200">{t.corto}</p>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <p className="text-[1.05rem] leading-relaxed text-moon-100">{t.descripcion}</p>
                  <div>
                    <h4 className="text-sm text-mist">Puede ayudarte con</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.paraQuien.map((p) => (
                        <li key={p} className="rounded-full px-3.5 py-1.5 text-sm text-starlight ring-1 ring-starlight/15 ring-inset">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
