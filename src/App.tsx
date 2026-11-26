import { NightSky } from '@/components/effects/NightSky'
import { Consent } from '@/components/Consent'
import { Footer } from '@/components/sections/Footer'
import { Nav } from '@/components/sections/Nav'
import { useAmbient } from '@/hooks/useAmbient'
import type { Route } from '@/lib/routes'
import { Home } from '@/pages/Home'
import { AgendarPage, Hub, NotFound, PreguntasPage, Privacidad, Sobre } from '@/pages/Paginas'
import { ServicioPage } from '@/pages/ServicioPage'

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case 'home':
      return <Home />
    case 'servicio':
      return <ServicioPage route={route} s={route.servicio!} />
    case 'hub':
      return <Hub route={route} />
    case 'sobre':
      return <Sobre route={route} />
    case 'preguntas':
      return <PreguntasPage route={route} />
    case 'agendar':
      return <AgendarPage route={route} />
    case 'privacidad':
      return <Privacidad route={route} />
    default:
      return <NotFound />
  }
}

/** Sitio multipágina: cada ruta se prerenderiza a su propio HTML (scripts/prerender.mjs). */
export default function App({ route }: { route: Route }) {
  useAmbient()

  return (
    <>
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-candle-200 px-5 py-3 font-semibold text-night-950 focus-visible:translate-y-0"
      >
        Saltar al contenido
      </a>
      <NightSky />
      <Nav current={route.path} />
      <main id="contenido">
        <Page route={route} />
      </main>
      <Footer />
      <Consent />
    </>
  )
}
