import type { CapaId } from './escena'

/**
 * Puente para el prerender: entry-server registra aquí el generador del paisaje.
 * Así el generador (y el trazo del árbol) no entran en el JS del navegador.
 */
let generar: ((id: CapaId) => string) | null = null
export const registrarEscena = (fn: (id: CapaId) => string) => {
  generar = fn
}
export const escenaSSR = (id: CapaId) => generar?.(id) ?? ''
