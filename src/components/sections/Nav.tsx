import firma from '@/assets/brand/web/firma-sm.png'
import { ButtonLink } from '@/components/ui/Button'

const LINKS = [
  { href: '#terapias', label: 'Terapias' },
  { href: '#primera-sesion', label: 'Primera sesión' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#comunidad', label: 'Comunidad' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] z-50 px-3">
      <nav
        aria-label="Principal"
        className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5"
      >
        <a href="#inicio" className="shrink-0 rounded-md py-1" aria-label="Soma, ir al inicio">
          <img src={firma} alt="" width={110} height={36} className="h-8 w-auto" />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-[0.95rem] text-mist transition-colors duration-200 hover:text-starlight"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href="#agendar" className="min-h-11 px-5 text-[0.95rem]">
          Agendar
        </ButtonLink>
      </nav>
    </header>
  )
}
