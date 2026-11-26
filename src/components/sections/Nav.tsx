import firma from '@/assets/brand/web/firma-sm.png'
import { ButtonLink } from '@/components/ui/Button'
import { HUB_PATH } from '@/lib/routes'
import { to } from '@/lib/url'

const NAV_LINKS = [
  { path: HUB_PATH, label: 'Cómo te ayudo' },
  { path: '/mtra-lidia-dorantes/', label: 'Sobre Lidia' },
  { path: '/empresas-nom-035/', label: 'Empresas' },
  { path: '/preguntas/', label: 'Preguntas' },
]

/** Menú móvil con la Popover API nativa: funciona sin hidratar React y cierra con Esc / clic fuera. */
export function Nav({ current }: { current: string }) {
  return (
    <header className="fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] z-50 px-3">
      <nav
        aria-label="Principal"
        className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5"
      >
        <a href={to('/')} className="shrink-0 rounded-md py-1" aria-label="Soma, ir al inicio">
          <img src={firma} alt="" width={110} height={36} className="h-8 w-auto" />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.path}>
              <a
                href={to(l.path)}
                aria-current={current === l.path ? 'page' : undefined}
                className="rounded-full px-4 py-2 text-[0.95rem] text-mist transition-colors duration-200 hover:text-starlight aria-[current=page]:text-candle-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ButtonLink href={to('/agendar/')} className="min-h-11 px-5 text-[0.95rem]">
            Agendar
          </ButtonLink>
          <button
            type="button"
            popoverTarget="menu-movil"
            aria-label="Abrir menú"
            className="grid size-11 place-items-center rounded-full text-starlight ring-1 ring-starlight/20 ring-inset transition-colors duration-200 hover:bg-starlight/10 lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="menu-movil"
        popover="auto"
        className="menu-movil m-0 bg-night-900/95 ring-1 ring-starlight/15 backdrop-blur-xl mt-2 ml-auto w-[min(20rem,calc(100vw-1.5rem))] rounded-3xl p-3 text-starlight"
      >
        <ul className="grid gap-1">
          {[{ path: '/', label: 'Inicio' }, ...NAV_LINKS, { path: '/agendar/', label: 'Agendar' }].map((l) => (
            <li key={l.path}>
              <a
                href={to(l.path)}
                aria-current={current === l.path ? 'page' : undefined}
                className="flex min-h-12 items-center rounded-2xl px-4 font-serif text-lg transition-colors duration-200 hover:bg-starlight/10 aria-[current=page]:text-candle-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
