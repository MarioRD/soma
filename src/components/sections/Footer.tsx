import firma from '@/assets/brand/web/firma.png'
import { TERAPIAS } from '@/lib/content'
import { CONTAINER } from '@/lib/ui'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="pt-16 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)]">
      <div className={`${CONTAINER} grid gap-12`}>
        <img src={firma} alt="Soma" width={886} height={292} loading="lazy" className="h-auto w-[min(70vw,26rem)]" />

        <div className="grid gap-10 border-t border-starlight/12 pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-mist">
            Soma no es un servicio de emergencias. Si tu vida o la de alguien más está en riesgo, llama al 911 o acude al
            hospital más cercano.
            {/* TODO: confirmar país y añadir la línea de apoyo emocional local */}
          </p>
          <nav aria-label="Terapias">
            <ul className="grid gap-2">
              {TERAPIAS.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-[0.95rem] text-moon-100 transition-colors duration-200 hover:text-starlight">
                    {t.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="text-sm text-mist">
          © {YEAR} Soma. Aviso de privacidad (pendiente).
        </p>
      </div>
    </footer>
  )
}
