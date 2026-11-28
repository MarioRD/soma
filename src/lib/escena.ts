/**
 * Paisaje del hero en capas para el parallax.
 * - Cordilleras (m1–m4) y bosque con suelo y plantas (b1–b3): vectorizados desde las imágenes
 *   de referencia del diseño (src/lib/paisaje.ts).
 * - Primer plano: montículo con plantas (referencia del diseño) y el árbol de la marca (soma-arbol.png).
 *
 * Coordenadas: viewBox 2200 × 900. Todo es determinista y se calcula solo al prerenderizar;
 * el navegador recibe el SVG ya dibujado en el HTML.
 */
import { ARBOL_D, ARBOL_H } from './arbol-marca'
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

/*
 * COLORES DEL PAISAJE: trazada(capa, desplazamiento y, color de la silueta, color de la neblina en su base).
 * Cordilleras: lo más lejano es lo más claro (perspectiva atmosférica).
 */
const m1 = () => trazada('m1', -150, '#2c3f5a', '#2a4d75')
const m2 = () => trazada('m2', -150, '#1a304b', '#24507e')
const m3 = () => trazada('m3', -150, '#18233f', '#2a4f78')
const m4 = () => trazada('m4', -150, '#0d1c30', '#1e4268')
/* Bosque: pinos a los costados que bajan al valle; al frente, el suelo con plantas */
const b1 = () => trazada('b1', -20, '#122d47', '#1f4a75')
const b2 = () => trazada('b2', -20, '#091f35', '#163a5e')
const b3 = () => trazada('b3', -20, '#071a2e', '#071a2e')

/* ───────────── Primer plano: montículo con plantas y el árbol de la marca ───────────── */

// base del tronco en x=790, y=655 del diseño; ancho ≈ 600 px del diseño
const ARBOL_S = 0.74 // el trazo está a la mitad de resolución
const ARBOL_TX = X(790) - 463 * ARBOL_S
const ARBOL_TY = Y(655) - ARBOL_H * ARBOL_S

/** Primer plano (f1) con el color de la página (currentColor = night-950): sin corte con la sección siguiente. */
function primerPlano() {
  const f = CAPAS.f1
  const s = W / f.w
  // el segundo montículo (x≈790 de la referencia) queda justo bajo el tronco
  const dx = ARBOL_TX + 463 * ARBOL_S - (790 / 1584) * W
  const dy = Y(655) - 6 - (552 / 672) * f.h * s
  return (
    `<path fill="currentColor" fill-rule="evenodd" transform="translate(${i0(dx)} ${i0(dy)}) scale(${s.toFixed(4)})" d="${f.d}"/>` +
    `<rect x="0" y="${i0(dy + f.h * s - 2)}" width="${W}" height="200" fill="currentColor"/>` +
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
