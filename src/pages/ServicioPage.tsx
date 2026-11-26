import { AgendarCta } from '@/components/sections/AgendarCta'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { FaqList } from '@/components/ui/FaqList'
import { ServicioLink } from '@/components/ui/ServicioLink'
import { bySlug, byKind, type Servicio } from '@/content/servicios'
import { PSICOLOGA, whatsappUrl } from '@/lib/content'
import type { Route } from '@/lib/routes'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

const H2 = 'text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-normal'

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

/** Plantilla de página dedicada: un tema, una respuesta clara, un siguiente paso. */
export function ServicioPage({ route, s }: { route: Route; s: Servicio }) {
  const relacionados = (s.enfoques ?? []).map(bySlug).filter((x): x is Servicio => !!x)
  const hermanos = byKind(s.kind).filter((x) => x.slug !== s.slug).slice(0, 3)

  return (
    <>
      <header className="pt-32 pb-16 sm:pt-40">
        <div className={CONTAINER}>
          {route.crumbs && <Breadcrumbs crumbs={route.crumbs} />}
          <h1 className="mt-8 max-w-[20ch] text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.04] font-normal tracking-[-0.015em]">
            {s.titulo}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-moon-100 sm:text-xl">{s.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl(`Hola, me gustaría agendar una sesión en Soma. Me interesa: ${s.nombre}.`)} target="_blank" rel="noopener">
              Agendar por WhatsApp
            </ButtonLink>
            <ButtonLink href={to('/como-te-ayudo/')} variant="ghost">
              Ver otras formas de ayuda
            </ButtonLink>
          </div>
        </div>
      </header>

      {s.sientes && (
        <section aria-labelledby="sientes" className="py-16 sm:py-20">
          <div className={CONTAINER}>
            <div className="lantern rounded-[2rem] p-7 sm:p-12">
              <h2 id="sientes" className={H2}>
                ¿Te pasa algo de esto?
              </h2>
              <ul className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
                {s.sientes.map((t) => (
                  <li key={t} className="border-l-2 border-candle-500/60 pl-5 font-serif text-xl leading-snug sm:text-[1.4rem]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="como" className="py-16 sm:py-20">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
          <h2 id="como" className={`${H2} max-w-[14ch]`}>
            {s.kind === 'empresa' ? 'Qué ofrecemos' : 'Cómo lo trabajamos'}
          </h2>
          <div className="grid gap-6">
            {s.como.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[62ch] text-[1.08rem] leading-relaxed text-moon-100">
                {p}
              </p>
            ))}
            {s.incluye && (
              <ul className="grid gap-3">
                {s.incluye.map((i) => (
                  <li key={i} className="flex gap-3 text-[1.05rem] leading-relaxed">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-5 shrink-0 text-candle-200">
                      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
            )}
            {relacionados.length > 0 && (
              <div>
                <h3 className="font-sans text-sm text-mist">Se trabaja con</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {relacionados.map((r) => (
                    <li key={r.slug}>
                      <a
                        href={to(`/${r.slug}/`)}
                        className="inline-flex min-h-10 items-center rounded-full px-4 text-[0.95rem] text-starlight ring-1 ring-starlight/20 ring-inset transition-colors duration-200 hover:bg-starlight/10"
                      >
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.nota && (
              <p role="note" className="max-w-[62ch] rounded-2xl bg-dusk-600/15 p-5 text-[0.98rem] leading-relaxed text-starlight ring-1 ring-dusk-400/30 ring-inset">
                {s.nota}
              </p>
            )}
          </div>
        </div>
      </section>

      {s.faqs.length > 0 && (
        <section aria-labelledby="faq" className="py-16 sm:py-20">
          <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]`}>
            <h2 id="faq" className={`${H2} max-w-[14ch]`}>
              Preguntas sobre {s.nombre.split(' (')[0].toLowerCase()}
            </h2>
            <FaqList faqs={s.faqs} />
          </div>
        </section>
      )}

      <div className={CONTAINER}>
        <p className="text-sm text-mist">
          {s.revisado
            ? `Contenido revisado por la ${PSICOLOGA.completo}, cédula ${PSICOLOGA.cedula}, el ${fecha(s.revisado)}.`
            : `Contenido informativo de Soma; no sustituye una valoración profesional.`}
        </p>
      </div>

      <AgendarCta tema={s.nombre} />

      {hermanos.length > 0 && (
        <section aria-labelledby="mas" className="pb-24">
          <div className={CONTAINER}>
            <h2 id="mas" className="font-serif text-2xl font-normal">
              También te puede interesar
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {hermanos.map((h) => (
                <li key={h.slug}>
                  <ServicioLink s={h} detalle={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
