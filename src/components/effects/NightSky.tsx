import { lazy, Suspense, useEffect, useState } from 'react'
import { Stars } from './Stars'

const Aurora = lazy(() => import('./Aurora'))

/**
 * Fondo fijo de toda la página: noche + estrellas + atardecer que se desvanece al bajar
 * + aurora WebGL (solo cliente, cargada en diferido).
 * Sin JS o sin WebGL queda un brillo de aurora estático en CSS.
 */
export function NightSky() {
  const [aurora, setAurora] = useState(false)

  useEffect(() => {
    // Se monta después de lo importante (texto, logo): no compite con el LCP.
    const id = window.setTimeout(() => setAurora(true), 700)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-950">
      <div className="sky-dusk absolute inset-0" />
      <div className="aurora-static absolute inset-x-0 top-0 h-[70vh]" />
      <Stars />
      {aurora && (
        <Suspense fallback={null}>
          <Aurora />
        </Suspense>
      )}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-night-950 to-transparent" />
    </div>
  )
}
