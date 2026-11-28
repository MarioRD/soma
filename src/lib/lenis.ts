import type Lenis from 'lenis'

/** Instancia global de Lenis (la crea useAmbient). Permite pausar el scroll al abrir una ventana. */
let instancia: Lenis | null = null
export const setLenis = (l: Lenis | null) => {
  instancia = l
}
export const pausarScroll = (pausa: boolean) => {
  if (pausa) instancia?.stop()
  else instancia?.start()
  document.documentElement.style.overflow = pausa ? 'hidden' : ''
}
