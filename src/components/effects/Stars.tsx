/** Campo de estrellas en SVG, determinista (mismo resultado en servidor y cliente). */
import type { CSSProperties } from 'react'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const GRUPOS = 4 // las que titilan se reparten en 4 capas; cada capa titila completa

const STARS = (() => {
  const r = rng(7)
  return Array.from({ length: 180 }, (_, i) => ({
    x: r() * 160,
    y: Math.pow(r(), 1.6) * 100, // más densas arriba
    s: r() < 0.08 ? 1.6 : 0.4 + r() * 0.8,
    g: i % 3 === 0 ? i % GRUPOS : -1, // -1 = fija
  }))
})()

const RITMO = [
  { d: '4.2s', delay: '0s' },
  { d: '5.6s', delay: '-1.8s' },
  { d: '3.6s', delay: '-0.9s' },
  { d: '6.4s', delay: '-3.1s' },
]

function Capa({ g, className, style }: { g: number; className?: string; style?: CSSProperties }) {
  const lista = STARS.filter((st) => st.g === g)
  return (
    <svg aria-hidden="true" className={`absolute inset-0 size-full text-starlight ${className ?? ''}`} style={style} preserveAspectRatio="xMidYMid slice" viewBox="0 0 160 100">
      {lista.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.s * 0.09} fill="currentColor" opacity={g < 0 ? 0.35 + st.s * 0.3 : undefined} />
      ))}
      {lista
        .filter((st) => st.s > 1.5)
        .map((st, i) => (
          // destellos: las estrellas grandes tienen cruz de luz
          <path key={`d${i}`} d={`M${st.x - 0.9} ${st.y}h1.8M${st.x} ${st.y - 0.9}v1.8`} stroke="currentColor" strokeWidth={0.06} strokeLinecap="round" />
        ))}
    </svg>
  )
}

/**
 * La animación va sobre cada <svg> completo (opacidad en el compositor),
 * no sobre cada círculo: así el navegador no repinta el cielo en cada cuadro.
 */
export function Stars() {
  return (
    <>
      <Capa g={-1} />
      {RITMO.map((rt, g) => (
        <Capa key={g} g={g} className="twinkle will-change-[opacity]" style={{ '--d': rt.d, '--delay': rt.delay } as CSSProperties} />
      ))}
    </>
  )
}
