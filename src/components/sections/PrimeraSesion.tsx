import { SITE } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'

const DATOS = [
  { label: 'Modalidad', value: SITE.modalidad },
  { label: 'Horario', value: SITE.hours },
  { label: 'Dónde', value: SITE.address },
]

/** Qué esperar al llegar: reduce el miedo de dar el primer paso. */
export function PrimeraSesion() {
  return (
    <section id="primera-sesion" aria-labelledby="primera-titulo" className="py-24 sm:py-32">
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end`}>
        <div>
          <h2 id="primera-titulo" className="max-w-[16ch] text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal">
            No tienes que saber por dónde empezar
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-moon-100">
            En la primera sesión platicamos lo que te trae aquí, a tu ritmo y sin juicios. Al final sabrás qué camino
            tiene sentido para ti, y si quieres seguir.
          </p>
        </div>

        <dl className="lantern grid gap-6 rounded-[2rem] p-7 sm:p-9">
          {DATOS.map((d) => (
            <div key={d.label} className="grid gap-1 border-b border-starlight/10 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm text-mist">{d.label}</dt>
              <dd className="font-serif text-2xl">
                {d.value || <span className="text-candle-200/80" data-todo>Por confirmar</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
