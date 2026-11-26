import { ButtonLink } from '@/components/ui/Button'
import { DIRECCION, SITE, whatsappUrl } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

/** Cierre de cada página: el primer mensaje, sin fricción. */
export function AgendarCta({ tema }: { tema?: string }) {
  const texto = tema
    ? `Hola, me gustaría agendar una sesión en Soma. Me interesa: ${tema}.`
    : 'Hola, me gustaría agendar una sesión en Soma.'
  return (
    <section aria-labelledby="cta-titulo" className="py-20 sm:py-28">
      <div className={CONTAINER}>
        <div className="lantern grid gap-10 rounded-[2.5rem] p-7 sm:p-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:p-16">
          <div>
            <h2 id="cta-titulo" className="max-w-[16ch] text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.05] font-normal">
              Tu primera sesión empieza con un mensaje
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-moon-100">
              Escríbenos por WhatsApp y encontramos juntos un horario, en consultorio o en línea.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={whatsappUrl(texto)} target="_blank" rel="noopener">
                Escribir por WhatsApp
              </ButtonLink>
              <ButtonLink href={to('/agendar/')} variant="ghost">
                Ver opciones para agendar
              </ButtonLink>
            </div>
          </div>
          <dl className="grid gap-5 text-[0.95rem]">
            <div>
              <dt className="text-mist">WhatsApp</dt>
              <dd className="mt-1 font-serif text-2xl tabular-nums">{SITE.telefono}</dd>
            </div>
            <div>
              <dt className="text-mist">Consultorio</dt>
              <dd className="mt-1 leading-relaxed text-moon-100">
                {DIRECCION}.{' '}
                <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
                  Ver en el mapa
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
