/**
 * Paisaje del hero dibujado con código: montañas, pinos, árbol en flor y pasto.
 * Todo es determinista (semilla fija): el servidor y el cliente producen el mismo SVG.
 * Cada capa devuelve el contenido interno de un <svg viewBox="0 0 2200 900">.
 */

// Ancho de sobra (2.4:1): en pantallas anchas no hay que escalar y el titular no choca con el árbol
export const W = 2200
const CX = W / 2
export const H = 900

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const f = (n: number) => (Math.round(n * 10) / 10).toString()
const i0 = (n: number) => Math.round(n).toString()

/** Ruido 1D suave (suma de senos con fases aleatorias): crestas naturales sin librerías. */
function ridgeFn(seed: number, amp: number, freq: number) {
  const r = rng(seed)
  const waves = Array.from({ length: 5 }, (_, i) => ({
    a: amp / (i + 1) ** 1.25,
    k: freq * (i + 1) ** 1.7 * (0.8 + r() * 0.4),
    p: r() * Math.PI * 2,
  }))
  return (x: number) => waves.reduce((y, w) => y + w.a * Math.sin(x * w.k + w.p), 0)
}

function pine(x: number, y: number, h: number) {
  const tiers = 3
  const w = h * 0.3
  const right: string[] = []
  const left: string[] = []
  for (let i = 1; i <= tiers; i++) {
    const ty = y - h + (h * 0.9 * i) / tiers
    const wi = (w * i) / tiers
    right.push(`L${i0(x + wi)} ${i0(ty)}`)
    if (i < tiers) right.push(`L${i0(x + wi * 0.3)} ${i0(ty - h * 0.05)}`)
    left.unshift(`L${i0(x - wi)} ${i0(ty)}`)
    if (i < tiers) left.unshift(`L${i0(x - wi * 0.3)} ${i0(ty - h * 0.05)}`)
  }
  return `M${i0(x)} ${i0(y - h)}${right.join('')}L${i0(x)} ${i0(y + 2)}${left.join('')}Z`
}

type Capa = {
  seed: number
  base: number // altura media de la cresta (0 arriba, 900 abajo)
  amp: number
  freq: number
  fill: string
  pinos?: { n: number; min: number; max: number; zonas?: [number, number][] }
}

function capa({ seed, base, amp, freq, fill, pinos }: Capa) {
  const y = ridgeFn(seed, amp, freq)
  let d = `M-40 ${H}`
  for (let x = -40; x <= W + 40; x += 10) d += `L${x} ${i0(base + y(x))}`
  d += `L${W + 40} ${H}Z`
  let p = ''
  if (pinos) {
    const r = rng(seed * 3 + 1)
    for (let i = 0; i < pinos.n; i++) {
      const zona = pinos.zonas ? pinos.zonas[i % pinos.zonas.length] : [0, W]
      const x = zona[0] + r() * (zona[1] - zona[0])
      const h = pinos.min + r() * (pinos.max - pinos.min)
      p += pine(x, base + y(x) + h * 0.18, h)
    }
  }
  return `<path fill="${fill}" d="${d}${p}"/>`
}

/* Capas de atrás hacia adelante: más lejos = más clara y más brumosa */
const lejanas = () => capa({ seed: 11, base: 470, amp: 90, freq: 0.004, fill: '#36588c' })
const medias = () =>
  capa({
  seed: 23,
  base: 560,
  amp: 70,
  freq: 0.005,
  fill: '#27467a',
  pinos: { n: 70, min: 16, max: 34, zonas: [[-20, 820], [1380, 2220]] },
})
const bosque = () =>
  capa({
  seed: 37,
  base: 650,
  amp: 40,
  freq: 0.006,
  fill: '#1a3460',
  pinos: { n: 120, min: 26, max: 58 },
})
const cercanas = () =>
  capa({
  seed: 41,
  base: 740,
  amp: 46,
  freq: 0.0045,
  fill: '#0f2445',
  pinos: { n: 34, min: 70, max: 150, zonas: [[-30, 720], [1480, 2230]] },
})

/* ───────────── Primer plano: loma, árbol en flor y pasto ───────────── */

function arbol() {
  const r = rng(5)
  const ramas: { d: string; w: number }[] = []
  // flores: puntos con trazo redondo (M x y h0), agrupados por tamaño. Muy pocos bytes por flor.
  const flores = new Map<number, string>()
  const punto = (x: number, y: number, d: number) => {
    const k = Math.max(4, Math.min(12, Math.round(d)))
    flores.set(k, (flores.get(k) ?? '') + `M${i0(x)} ${i0(y)}h0`)
  }
  const flor = (x: number, y: number, s: number) => {
    punto(x, y, s * 2)
    for (let n = 0; n < 3; n++) if (r() < 0.6) punto(x + (r() - 0.5) * s * 5, y + (r() - 0.6) * s * 4, s * (1 + r()))
  }

  const MIN = 0.12 * Math.PI // las ramas nunca apuntan hacia abajo
  const MAX = 0.88 * Math.PI
  const rama = (x: number, y: number, ang: number, len: number, w: number, depth: number) => {
    ang = Math.min(MAX, Math.max(MIN, ang))
    const x2 = x + Math.cos(ang) * len
    const y2 = y - Math.sin(ang) * len
    const bend = (r() - 0.5) * len * 0.3
    const cx = (x + x2) / 2 + Math.sin(ang) * bend
    const cy = (y + y2) / 2 + Math.cos(ang) * bend
    ramas.push({ d: `M${i0(x)} ${i0(y)}Q${i0(cx)} ${i0(cy)} ${i0(x2)} ${i0(y2)}`, w })
    if (depth === 0) {
      flor(x2, y2, 3.2 + r() * 2.8)
      if (r() < 0.5) flor(x2 + (r() - 0.5) * 26, y2 - r() * 14, 2.4 + r() * 2)
      return
    }
    if (depth <= 2 && r() < 0.7) flor((x + x2) / 2, (y + y2) / 2 - 4, 2.4 + r() * 2)
    // abre hacia afuera: la copa crece ancha, como sombrilla
    const afuera = Math.cos(ang) >= 0 ? -1 : 1
    const a1 = ang + 0.28 + r() * 0.32
    const a2 = ang - 0.28 - r() * 0.32
    const sesgo = depth < 5 ? afuera * 0.1 : 0
    const k = 0.74 + r() * 0.12
    rama(x2, y2, a1 + sesgo, len * k, w * 0.64, depth - 1)
    rama(x2, y2, a2 + sesgo, len * (k - 0.04), w * 0.64, depth - 1)
  }

  const bx = CX
  const by = 795
  ramas.push({ d: `M${bx - 12} ${by}Q${bx - 2} ${by - 70} ${bx} ${by - 135}`, w: 21 })
  rama(bx, by - 135, Math.PI / 2 + 0.62, 76, 11.5, 6)
  rama(bx, by - 135, Math.PI / 2 - 0.6, 80, 11.5, 6)
  rama(bx, by - 135, Math.PI / 2 + 0.08, 70, 10, 6)

  const grupos = new Map<string, string>()
  for (const { d, w } of ramas) {
    const k = f(Math.max(0.9, Math.round(w * 2) / 2))
    grupos.set(k, (grupos.get(k) ?? '') + d)
  }
  let out = '<g fill="none" stroke="currentColor" stroke-linecap="round">'
  for (const [w, d] of grupos) out += `<path stroke-width="${w}" d="${d}"/>`
  for (const [k, d] of flores) out += `<path stroke-width="${k}" d="${d}"/>`
  out += '</g>'
  return out
}

function pasto() {
  const r = rng(91)
  let d = ''
  const brizna = (x: number, y: number, h: number, bend: number, w: number) => {
    d += `M${i0(x - w)} ${i0(y)}Q${i0(x + bend * 0.4)} ${i0(y - h * 0.6)} ${i0(x + bend)} ${i0(y - h)}Q${i0(x + bend * 0.4 + w)} ${i0(y - h * 0.6)} ${i0(x + w)} ${i0(y)}Z`
  }
  const suelo = (x: number) => 818 + 18 * Math.sin(x * 0.004 + 1.2) - 34 * Math.exp(-(((x - CX) / 260) ** 2))
  // más pasto y más alto lejos del árbol
  for (let i = 0; i < 190; i++) {
    const x = -20 + r() * (W + 40)
    const lejos = Math.min(1, Math.abs(x - CX) / 900)
    if (r() > 0.15 + lejos) continue
    const h = 10 + r() * 70 * lejos
    brizna(x, suelo(x) + 4, h, (r() - 0.5) * h * 0.7, 1.4 + r() * 1.8 * lejos)
  }
  let loma = `M-40 ${H}`
  for (let x = -40; x <= W + 40; x += 20) loma += `L${x} ${i0(suelo(x))}`
  loma += `L${W + 40} ${H}Z`
  return `<path fill="currentColor" d="${loma}${d}"/>`
}

const GENERA = { lejanas, medias, bosque, cercanas, primerPlano: () => arbol() + pasto() }
export type CapaId = keyof typeof GENERA
const cache: Partial<Record<CapaId, string>> = {}

/**
 * Se calcula solo cuando se pide (en el build, al prerenderizar). En el navegador el SVG
 * ya viene en el HTML, así que normalmente nunca se ejecuta: cero costo al cargar.
 */
export function escena(id: CapaId) {
  return (cache[id] ??= GENERA[id]())
}
