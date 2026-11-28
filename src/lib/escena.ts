/**
 * Paisaje del hero en capas para el parallax.
 * - Cordilleras (m1–m4) y bosque con suelo y plantas (b1–b3): vectorizados desde las imágenes
 *   de referencia del diseño (src/lib/paisaje.ts).
 * - Primer plano: la roca y el árbol de la marca, vectorizados desde soma-arbol.png.
 *
 * Coordenadas: viewBox 2200 × 900. Todo es determinista y se calcula solo al prerenderizar;
 * el navegador recibe el SVG ya dibujado en el HTML.
 */
import { ARBOL_D, ARBOL_H, ROCA } from './arbol-marca'
import { CAPAS } from './paisaje'

// Mismas medidas que VIEWBOX en Hero.tsx
const W = 2200
const H = 900

// Composición del diseño de Figma (776 × 382 px al doble), centrada en el viewBox
const K = 1.178
const X = (x: number) => 186 + x * K
const Y = (y: number) => y * K

const i0 = (n: number) => Math.round(n).toString()

type Clave = keyof typeof CAPAS

/**
 * Capa trazada: se escala al ancho del paisaje, se baja `y` px y se rellena hacia abajo
 * hasta el borde. Degradado vertical: color de la silueta arriba → neblina abajo.
 */
function trazada(k: Clave, y: number, arriba: string, abajo: string) {
  const c = CAPAS[k]
  const s = W / c.w
  const fondo = y + c.h * s
  const id = `g-${k}`
  return (
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${arriba}"/><stop offset=".75" stop-color="${arriba}"/><stop offset="1" stop-color="${abajo}"/></linearGradient></defs>` +
    `<path fill="url(#${id})" fill-rule="evenodd" transform="translate(0 ${i0(y)}) scale(${s.toFixed(4)})" d="${c.d}"/>` +
    (fondo < H ? `<rect x="0" y="${i0(fondo - 2)}" width="${W}" height="${i0(H - fondo + 2)}" fill="${abajo}"/>` : '')
  )
}

/* Cordilleras: lo más lejano es lo más claro (perspectiva atmosférica) */
const m1 = () => trazada('m1', -150, '#455d7a', '#3d6a98')
const m2 = () => trazada('m2', -150, '#264462', '#2f6ca3')
const m3 = () => trazada('m3', -150, '#223153', '#3a6a9c')
const m4 = () => trazada('m4', -150, '#12263e', '#2a5a8a')
/* Bosque: pinos a los costados que bajan al valle; al frente, el suelo con plantas */
const b1 = () => trazada('b1', -20, '#1a3e5f', '#2a6197')
const b2 = () => trazada('b2', -20, '#0c2842', '#1f4f7d')
const b3 = () => trazada('b3', -20, '#0a2037', '#0a2037')

/* ───────────── Primer plano: roca y árbol de la marca ───────────── */

// base del tronco en x=790, y=655 del diseño; ancho ≈ 600 px del diseño
const ARBOL_S = 0.74 // el trazo está a la mitad de resolución
const ARBOL_TX = X(790) - 463 * ARBOL_S
const ARBOL_TY = Y(655) - ARBOL_H * ARBOL_S

/** Roca del logo bajo el árbol, con laderas suaves a los lados. */
function roca() {
  const pts = ROCA.map(([x, y]) => [ARBOL_TX + x * ARBOL_S, ARBOL_TY + y * ARBOL_S] as const)
  const [x0, y0] = pts[0]
  const [x1, y1] = pts[pts.length - 1]
  return (x: number) => {
    // laderas cortas y curvas: la roca es un montículo, no una pirámide
    if (x <= x0) return y0 + ((x0 - x) / 120) ** 2 * 40
    if (x >= x1) return y1 + ((x - x1) / 120) ** 2 * 40
    let i = 0
    while (x > pts[i + 1][0]) i++
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    return ay + ((by - ay) * (x - ax)) / (bx - ax)
  }
}

function primerPlano() {
  const r = roca()
  let d = `M-20 ${H}`
  for (let x = -20; x <= W + 20; x += 6) d += `L${x} ${i0(Math.min(H, r(x)))}`
  d += `L${W + 20} ${H}Z`
  return (
    `<path fill="currentColor" d="${d}"/>` +
    `<path fill="currentColor" fill-rule="evenodd" transform="translate(${i0(ARBOL_TX)} ${i0(ARBOL_TY)}) scale(${ARBOL_S})" d="${ARBOL_D}"/>`
  )
}

const GENERA = { m1, m2, m3, m4, b1, b2, b3, primerPlano }
export type CapaId = keyof typeof GENERA
const cache: Partial<Record<CapaId, string>> = {}

/** Se calcula solo al prerenderizar (o en dev): en producción el SVG ya viene en el HTML. */
export function escena(id: CapaId) {
  return (cache[id] ??= GENERA[id]())
}
