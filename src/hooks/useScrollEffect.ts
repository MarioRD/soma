import { useEffect, type RefObject } from 'react'

/**
 * Llama a `apply` en cada cuadro de scroll mientras el elemento está cerca de la pantalla.
 * Sin efecto con prefers-reduced-motion: el elemento queda en su versión estática.
 * `apply` debe ser estable (función de módulo).
 */
export function useScrollEffect<T extends HTMLElement>(
  ref: RefObject<T | null>,
  apply: (el: T, rect: DOMRect, vh: number) => void,
) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const run = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > vh * 2) return
      apply(el, r, vh)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [ref, apply])
}
