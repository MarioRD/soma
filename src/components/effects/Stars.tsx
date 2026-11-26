/** Campo de estrellas en SVG, determinista (mismo resultado en servidor y cliente). */
import type { CSSProperties } from 'react'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const STARS = (() => {
  const r = rng(7)
  return Array.from({ length: 180 }, (_, i) => ({
    x: r() * 160,
    y: Math.pow(r(), 1.6) * 100, // más densas arriba
    s: r() < 0.08 ? 1.6 : 0.4 + r() * 0.8,
    twinkle: i % 6 === 0,
    d: 3 + r() * 5,
    delay: r() * 6,
  }))
})()

export function Stars() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full text-starlight"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 160 100"
    >
      {STARS.map((st, i) => (
        <circle
          key={i}
          cx={st.x}
          cy={st.y}
          r={st.s * 0.09}
          fill="currentColor"
          opacity={st.twinkle ? undefined : 0.35 + st.s * 0.3}
          className={st.twinkle ? 'twinkle' : undefined}
          style={st.twinkle ? ({ '--d': `${st.d}s`, '--delay': `${st.delay}s` } as CSSProperties) : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
