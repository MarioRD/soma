import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Efectos de ambiente de toda la página (solo cliente):
 * - La luz de los faroles (.lantern) sigue al cursor: escribe --lx / --ly.
 * - Scroll suave con Lenis (desactivado con prefers-reduced-motion).
 */
export function useAmbient() {
  useEffect(() => {
    let current: HTMLElement | null = null
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element | null)?.closest<HTMLElement>('.lantern') ?? null
      if (current && current !== el) {
        current.style.removeProperty('--lx')
        current.style.removeProperty('--ly')
      }
      current = el
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })

    let lenis: Lenis | null = null
    let raf = 0
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new Lenis({ anchors: { offset: -24 }, lerp: 0.1 })
      const tick = (t: number) => {
        lenis?.raf(t)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])
}
