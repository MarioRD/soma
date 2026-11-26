import { NightSky } from '@/components/effects/NightSky'
import { Agendar } from '@/components/sections/Agendar'
import { Comunidad } from '@/components/sections/Comunidad'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { Nav } from '@/components/sections/Nav'
import { Preguntas } from '@/components/sections/Preguntas'
import { PrimeraSesion } from '@/components/sections/PrimeraSesion'
import { Terapias } from '@/components/sections/Terapias'
import { StructuredData } from '@/components/StructuredData'
import { useAmbient } from '@/hooks/useAmbient'

export default function App() {
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
      <Nav />
      <main id="contenido">
        <Hero />
        <Terapias />
        <PrimeraSesion />
        <Preguntas />
        <Comunidad />
        <Agendar />
      </main>
      <Footer />
      <StructuredData />
    </>
  )
}
