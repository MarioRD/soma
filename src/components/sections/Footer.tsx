import firma from '@/assets/brand/web/firma.png'
import { byKind } from '@/content/servicios'
import { DIRECCION, PSICOLOGA, SITE, whatsappUrl } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'
import { to } from '@/lib/url'

const YEAR = new Date().getFullYear()

const GRUPOS = [
  { titulo: 'Lo que atendemos', items: byKind('area') },
  { titulo: 'Para quién', items: byKind('publico') },
  { titulo: 'Enfoques y modalidades', items: [...byKind('enfoque'), ...byKind('modalidad'), ...byKind('empresa')] },
]

const LINK = 'text-[0.95rem] text-moon-100 transition-colors duration-200 hover:text-starlight'

/** Pie con NAP (nombre, dirección, teléfono) y enlaces a todas las páginas: SEO local y navegación. */
export function Footer() {
  return (
    <footer className="pt-16 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)]">
      <div className={`${CONTAINER} grid gap-14`}>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end">
          <img src={firma} alt="Soma" width={886} height={292} loading="lazy" className="h-auto w-[min(70vw,24rem)]" />
          <address className="grid gap-2 text-[0.95rem] leading-relaxed text-moon-100 not-italic">
            <span className="text-starlight">{PSICOLOGA.completo}</span>
            <span>
              Cédula profesional {PSICOLOGA.cedula} ·{' '}
              <a href={PSICOLOGA.verificarCedula} target="_blank" rel="noopener" className={LINK + ' underline decoration-1 underline-offset-4'}>
                verificar en la SEP
              </a>
            </span>
            <span>{DIRECCION}</span>
            <span>
              WhatsApp{' '}
              <a href={whatsappUrl()} target="_blank" rel="noopener" className={LINK + ' tabular-nums underline decoration-1 underline-offset-4'}>
                {SITE.telefono}
              </a>
            </span>
          </address>
        </div>

        <nav aria-label="Todas las páginas" className="grid gap-10 border-t border-starlight/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {GRUPOS.map((g) => (
            <div key={g.titulo}>
              <h2 className="font-sans text-sm text-mist">{g.titulo}</h2>
              <ul className="mt-4 grid gap-2">
                {g.items.map((s) => (
                  <li key={s.slug}>
                    <a href={to(`/${s.slug}/`)} className={LINK}>
                      {s.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="font-sans text-sm text-mist">Soma</h2>
            <ul className="mt-4 grid gap-2">
              {[
                ['/mtra-lidia-dorantes/', 'Sobre Lidia'],
                ['/preguntas/', 'Preguntas frecuentes'],
                ['/agendar/', 'Agendar'],
                ['/aviso-de-privacidad/', 'Aviso de privacidad'],
              ].map(([p, l]) => (
                <li key={p}>
                  <a href={to(p)} className={LINK}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="grid gap-4 border-t border-starlight/12 pt-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <p className="max-w-[60ch] text-[0.95rem] leading-relaxed text-mist">
            Soma no es un servicio de emergencias. Si tu vida o la de alguien más está en riesgo, llama al 911 o a la
            Línea de la Vida, 800 911 2000, las 24 horas.
          </p>
          <p className="text-sm text-mist md:text-right">© {YEAR} Soma Psicología</p>
        </div>
      </div>
    </footer>
  )
}
