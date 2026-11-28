import { useEffect, useId, useState, type RefObject } from 'react'

/**
 * Liquid glass: refracción en los bordes del vidrio (SVG feDisplacementMap vía backdrop-filter).
 * Solo Chromium soporta `backdrop-filter: url(#…)`; en Safari y Firefox el elemento conserva
 * su vidrio normal (clase .glass). Se aplica solo a superficies pequeñas e interactivas
 * (barra de navegación, buscador): en el contenido, la distorsión estorbaría la lectura.
 * La escala es mucho menor que en la demo (-180): refracta el borde sin voltear ni arcoirizar
 * el texto que pasa detrás. Subirla aquí si se quiere un efecto más evidente.
 */

function soportado(id: string) {
  const ua = navigator.userAgent
  if (/Firefox/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua))) return false
  const d = document.createElement('div')
  d.style.backdropFilter = `url(#${id})`
  return d.style.backdropFilter !== ''
}

function mapa(w: number, h: number, r: number) {
  const e = Math.min(w, h) * 0.08
  const blur = Math.max(3, Math.min(10, h * 0.12))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="${w}" height="${h}" fill="black"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#r)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#b)" style="mix-blend-mode:difference"/><rect x="${e}" y="${e}" width="${w - e * 2}" height="${h - e * 2}" rx="${r}" fill="hsl(0 0% 50% / .93)" style="filter:blur(${blur}px)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const SOLO = (c: 'R' | 'G' | 'B') =>
  `${c === 'R' ? 1 : 0} 0 0 0 0 0 ${c === 'G' ? 1 : 0} 0 0 0 0 0 ${c === 'B' ? 1 : 0} 0 0 0 0 0 1 0`

export function LiquidGlass({ target, radius, scale = -32 }: { target: RefObject<HTMLElement | null>; radius: number; scale?: number }) {
  const id = `liquid${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = target.current
    if (!el || !soportado(id)) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const b = e.borderBoxSize?.[0]
      setSize({ w: Math.round(b?.inlineSize ?? width), h: Math.round(b?.blockSize ?? height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [target, id])

  useEffect(() => {
    const el = target.current
    if (!el || !size) return
    const v = `url(#${id}) blur(5px) saturate(1.5) brightness(1.06)`
    // estilo directo en el DOM del elemento referido (no es una prop de React)
    // eslint-disable-next-line react/immutability
    el.style.backdropFilter = v
    el.style.setProperty('-webkit-backdrop-filter', v)
    el.dataset.liquid = ''
  }, [size, id, target])

  if (!size) return null
  const { w, h } = size
  const href = mapa(w, h, Math.min(radius, h / 2))
  const canal = (c: 'R' | 'G' | 'B', extra: number) => (
    <>
      <feDisplacementMap in="SourceGraphic" in2="mapa" scale={scale + extra} xChannelSelector="R" yChannelSelector="B" result={`d${c}`} />
      <feColorMatrix in={`d${c}`} type="matrix" values={SOLO(c)} result={`c${c}`} />
    </>
  )
  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage x="0" y="0" width={w} height={h} href={href} preserveAspectRatio="none" result="mapa" />
        {canal('R', 0)}
        {canal('G', 3)}
        {canal('B', 6)}
        <feBlend in="cR" in2="cG" mode="screen" result="rg" />
        <feBlend in="rg" in2="cB" mode="screen" result="rgb" />
        <feGaussianBlur in="rgb" stdDeviation="0.6" />
      </filter>
    </svg>
  )
}
