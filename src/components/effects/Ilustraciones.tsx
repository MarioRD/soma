import type { CSSProperties } from 'react'

/**
 * Ilustraciones de los tres enfoques, en SVG: figuras humanas iluminadas por una luz cálida
 * (como el farol), sobre destellos de color que cambian de tono.
 */

// Perfil humano mirando a la derecha (caja ~190 × 250)
const PERFIL =
  'M60 250C62 215 56 198 50 182C28 156 26 98 55 66C80 38 132 34 152 62C164 78 166 94 164 108C163 114 167 119 172 126L181 142C183 147 178 150 171 150C173 154 173 158 169 160C173 163 171 168 167 170C167 177 169 182 161 187C151 192 137 191 130 196C128 212 130 230 134 250Z'

export type Tono = { c: string; x: string; y: string; s: string; d: string; delay: string; dx: string; dy: string }

/** Luces de fondo: tres manchas de color que respiran y se desplazan (solo transform/opacity). */
export function Destellos({ tonos }: { tonos: Tono[] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {tonos.map((t, i) => (
        <span
          key={i}
          className="destello"
          style={
            {
              background: t.c,
              left: t.x,
              top: t.y,
              width: t.s,
              height: t.s,
              '--d': t.d,
              '--delay': t.delay,
              '--dx': t.dx,
              '--dy': t.dy,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-luz`}>
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.25" stopColor="#ffe7c2" stopOpacity="0.9" />
        <stop offset="1" stopColor="#f5b971" stopOpacity="0" />
      </radialGradient>
      {/* piel iluminada: cálida hacia la luz, violeta en la sombra */}
      <linearGradient id={`${id}-piel`} x1="1" y1="0.3" x2="0" y2="0.7">
        <stop offset="0" stopColor="#ffe2b8" />
        <stop offset="0.35" stopColor="#c99a9a" />
        <stop offset="0.7" stopColor="#4b3f8f" />
        <stop offset="1" stopColor="#1b1846" />
      </linearGradient>
      <linearGradient id={`${id}-pielI`} x1="0" y1="0.3" x2="1" y2="0.7">
        <stop offset="0" stopColor="#ffe2b8" />
        <stop offset="0.35" stopColor="#c99a9a" />
        <stop offset="0.7" stopColor="#4b3f8f" />
        <stop offset="1" stopColor="#1b1846" />
      </linearGradient>
    </defs>
  )
}

export function Hipnosis({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <Defs id="hip" />
      {/* ondas que nacen de la luz: el trance como atención tranquila */}
      <g fill="none" stroke="#ffe7c2" strokeOpacity="0.18">
        <circle cx="318" cy="118" r="38" />
        <circle cx="318" cy="118" r="62" />
        <circle cx="318" cy="118" r="90" />
      </g>
      <circle cx="318" cy="118" r="70" fill="url(#hip-luz)" opacity="0.55" />
      <circle cx="318" cy="118" r="9" fill="#fffaf0" />
      <path d={PERFIL} transform="translate(70 62) scale(1.05)" fill="url(#hip-piel)" />
    </svg>
  )
}

function Figura({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g fill={fill}>
      <circle cx={x} cy={y - 50 * s} r={11 * s} />
      <path d={`M${x - 20 * s} ${y}C${x - 21 * s} ${y - 26 * s} ${x - 14 * s} ${y - 36 * s} ${x} ${y - 36 * s}C${x + 14 * s} ${y - 36 * s} ${x + 21 * s} ${y - 26 * s} ${x + 20 * s} ${y}Z`} />
    </g>
  )
}

export function Constelaciones({ className }: { className?: string }) {
  const gente = [
    { x: 110, y: 236, s: 1.25 },
    { x: 196, y: 214, s: 1.1 },
    { x: 282, y: 236, s: 1.25 },
    { x: 160, y: 262, s: 0.85 },
    { x: 238, y: 266, s: 0.8 },
  ]
  const estrellas = gente.map((g) => ({ x: g.x, y: g.y - 50 * g.s - 70 }))
  const lineas = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [1, 4]]
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <Defs id="con" />
      <ellipse cx="196" cy="268" rx="170" ry="26" fill="url(#con-luz)" opacity="0.35" />
      <g stroke="#ffe7c2" strokeOpacity="0.45" strokeWidth="1.2">
        {lineas.map(([a, b]) => (
          <line key={`${a}${b}`} x1={estrellas[a].x} y1={estrellas[a].y} x2={estrellas[b].x} y2={estrellas[b].y} />
        ))}
      </g>
      {/* hilos de luz de cada estrella a su persona */}
      <g stroke="#ffe7c2" strokeOpacity="0.14" strokeDasharray="2 5">
        {gente.map((g, i) => (
          <line key={i} x1={estrellas[i].x} y1={estrellas[i].y} x2={g.x} y2={g.y - 62 * g.s} />
        ))}
      </g>
      {estrellas.map((e, i) => (
        <g key={i}>
          <circle cx={e.x} cy={e.y} r="14" fill="url(#con-luz)" opacity="0.7" />
          <circle cx={e.x} cy={e.y} r={i === 1 ? 3.4 : 2.4} fill="#fffaf0" />
        </g>
      ))}
      {gente.map((g, i) => (
        <Figura key={i} {...g} fill={i % 2 ? 'url(#con-pielI)' : 'url(#con-piel)'} />
      ))}
    </svg>
  )
}

export function Clinica({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <Defs id="cli" />
      {/* dos personas frente a frente; entre ellas, la luz de la conversación */}
      <circle cx="200" cy="150" r="80" fill="url(#cli-luz)" opacity="0.5" />
      <circle cx="200" cy="150" r="6" fill="#fffaf0" />
      <path d={PERFIL} transform="translate(-6 70) scale(0.92)" fill="url(#cli-piel)" />
      <path d={PERFIL} transform="translate(406 70) scale(-0.92 0.92)" fill="url(#cli-piel)" />
    </svg>
  )
}
