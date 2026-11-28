/**
 * Paisaje del hero en capas, dibujado con código sobre la composición del diseño de Figma:
 * siluetas oscuras de montaña cuya base se funde en neblina azul brillante, pinos en los
 * costados, loma al frente con plantas en las esquinas y el árbol de la marca (vectorizado).
 *
 * Coordenadas: viewBox 2200 × 900. El diseño (776 × 382 px) ocupa el centro:
 * x = 186 + x_diseño·2·1.178, y = y_diseño·2·1.178 — en pantallas más anchas se ve más paisaje.
 * Todo es determinista. Se calcula solo al prerenderizar; el navegador recibe el SVG en el HTML.
 */
import { ARBOL_D, ARBOL_H, ROCA } from './arbol-marca'

// Mismas medidas que VIEWBOX en Hero.tsx
const W = 2200
const H = 900

const K = 1.178
const X = (x: number) => 186 + x * K // x del diseño al doble de tamaño (0–1552)
const Y = (y: number) => y * K // y del diseño al doble de tamaño (0–764)

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const i0 = (n: number) => Math.round(n).toString()

/** Cresta suave entre puntos de control (interpolación coseno) + un poco de ruido. */
function cresta(puntos: [number, number][], seed: number, ruido: number, recta = false) {
  const pts = puntos.map(([x, y]) => [X(x), Y(y)] as const)
  const r = rng(seed)
  const ondas = Array.from({ length: 3 }, (_, i) => ({ k: 0.012 * (i + 1) ** 1.6, p: r() * 6.28, a: ruido / (i + 1) }))
  return (x: number) => {
    let i = 0
    while (i < pts.length - 2 && x > pts[i + 1][0]) i++
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const t = Math.min(1, Math.max(0, (x - x0) / (x1 - x0 || 1)))
    const c = recta ? t : (1 - Math.cos(t * Math.PI)) / 2
    return y0 + (y1 - y0) * c + ondas.reduce((s, o) => s + o.a * Math.sin(x * o.k + o.p), 0)
  }
}

function pino(x: number, y: number, h: number) {
  const w = h * 0.26
  const n = 3
  const der: string[] = []
  const izq: string[] = []
  for (let i = 1; i <= n; i++) {
    const ty = y - h + (h * 0.92 * i) / n
    const wi = (w * i) / n
    der.push(`L${i0(x + wi)} ${i0(ty)}`)
    if (i < n) der.push(`L${i0(x + wi * 0.35)} ${i0(ty - h * 0.04)}`)
    izq.unshift(`L${i0(x - wi)} ${i0(ty)}`)
    if (i < n) izq.unshift(`L${i0(x - wi * 0.35)} ${i0(ty - h * 0.04)}`)
  }
  return `M${i0(x)} ${i0(y - h)}${der.join('')}L${i0(x)} ${i0(y + 4)}${izq.join('')}Z`
}

type Bosque = { desde: number; hasta: number; n: number; min: number; max: number }

/**
 * Capa de montaña: silueta con degradado vertical (oscuro arriba → neblina abajo).
 * `arriba`/`abajo` = alturas (en y del diseño) donde empieza y termina el degradado.
 */
function capa(o: {
  id: string
  puntos: [number, number][]
  seed: number
  ruido?: number
  recta?: boolean
  corte?: number
  color: string
  niebla: string
  arriba: number
  abajo: number
  bosques?: Bosque[]
}) {
  const y = cresta(o.puntos, o.seed, o.ruido ?? 4, o.recta)
  let d = `M-20 ${H}`
  for (let x = -20; x <= W + 20; x += 8) d += `L${x} ${i0(y(x))}`
  d += `L${W + 20} ${H}Z`
  const r = rng(o.seed * 7 + 3)
  for (const b of o.bosques ?? []) {
    for (let i = 0; i < b.n; i++) {
      const x = X(b.desde) + r() * (X(b.hasta) - X(b.desde))
      const h = b.min + r() * (b.max - b.min)
      d += pino(x, y(x) + h * 0.12, h)
    }
  }
  return (
    `<defs><linearGradient id="${o.id}" gradientUnits="userSpaceOnUse" x1="0" y1="${i0(Y(o.arriba))}" x2="0" y2="${i0(Y(o.abajo))}">` +
    `<stop offset="0" stop-color="${o.color}"/><stop offset="${o.corte ?? 0.55}" stop-color="${o.color}"/><stop offset="1" stop-color="${o.niebla}"/></linearGradient></defs>` +
    `<path fill="url(#${o.id})" d="${d}"/>`
  )
}

/* ───────────── Capas (de atrás hacia adelante) ───────────── */

// Lo más lejano es lo más claro (perspectiva atmosférica): picos grandes contra el cielo
const lejanas = () =>
  capa({
    id: 'g-lejanas',
    seed: 11,
    ruido: 1.5,
    recta: true, // picos marcados, como en el diseño
    corte: 0.8,
    color: '#1b3f70',
    niebla: '#2a5f96',
    arriba: 150,
    abajo: 360,
    puntos: [
      [-200, 250], [-60, 205], [60, 170], [150, 196], [220, 150], [330, 214], [420, 238], [520, 205], [600, 236], [700, 270],
      [800, 250], [880, 226], [960, 262], [1060, 214], [1160, 176], [1230, 204], [1330, 140], [1420, 188], [1500, 172], [1600, 216], [1760, 236],
    ],
  })

// Segunda cordillera, más cercana y oscura; con picos también al centro (lo que se ve en celular)
const cordillera = () =>
  capa({
    id: 'g-cordillera',
    seed: 17,
    ruido: 2,
    recta: true,
    corte: 0.7,
    color: '#0e2a4f',
    niebla: '#2f6ca3',
    arriba: 220,
    abajo: 400,
    puntos: [
      [-200, 320], [-40, 290], [90, 250], [200, 292], [300, 272], [400, 312], [520, 288], [640, 250], [720, 276],
      [800, 236], [890, 282], [980, 300], [1080, 262], [1180, 296], [1280, 270], [1400, 232], [1500, 268], [1600, 290], [1760, 300],
    ],
  })

const laderas = () =>
  capa({
    id: 'g-laderas',
    seed: 23,
    ruido: 5,
    color: '#082746',
    niebla: '#2a6197',
    arriba: 300,
    abajo: 500,
    puntos: [
      [-200, 330], [0, 335], [110, 352], [260, 392], [420, 440], [560, 478], [700, 505], [860, 510],
      [1000, 480], [1150, 420], [1300, 380], [1430, 352], [1552, 335], [1760, 330],
    ],
    bosques: [
      { desde: -160, hasta: 330, n: 46, min: 28, max: 78 },
      { desde: 1240, hasta: 1720, n: 46, min: 28, max: 78 },
    ],
  })

const bosque = () =>
  capa({
    id: 'g-bosque',
    seed: 37,
    ruido: 6,
    color: '#092847',
    niebla: '#3a74a8',
    arriba: 400,
    abajo: 620,
    puntos: [
      [-200, 410], [0, 420], [180, 432], [330, 470], [460, 525], [600, 585], [760, 610], [900, 590],
      [1020, 545], [1160, 495], [1320, 445], [1450, 400], [1552, 382], [1760, 380],
    ],
    bosques: [
      { desde: -180, hasta: 620, n: 62, min: 22, max: 56 },
      { desde: 940, hasta: 1740, n: 62, min: 22, max: 56 },
    ],
  })

const cercanas = () =>
  capa({
    id: 'g-cercanas',
    seed: 41,
    ruido: 5,
    color: '#0a2644',
    niebla: '#23527a',
    arriba: 480,
    abajo: 700,
    puntos: [
      [-200, 500], [0, 520], [160, 535], [320, 570], [470, 625], [600, 660], [1000, 668], [1120, 630],
      [1250, 575], [1400, 520], [1552, 480], [1760, 470],
    ],
    bosques: [
      { desde: -180, hasta: 420, n: 40, min: 30, max: 70 },
      { desde: 1180, hasta: 1740, n: 44, min: 30, max: 76 },
    ],
  })

/* ───────────── Primer plano: loma, plantas, pasto y el árbol de la marca ───────────── */

/** Planta de hojas: tallos curvos con hojas alternas y algunas flores (silueta). */
function planta(x: number, y: number, alto: number, r: () => number, lado: number) {
  let d = ''
  const tallos = 4 + Math.floor(r() * 4)
  for (let t = 0; t < tallos; t++) {
    const h = alto * (0.55 + r() * 0.45)
    const inc = (r() - 0.5 + lado * 0.25) * 0.9
    const tx = x + (r() - 0.5) * alto * 0.3
    const ex = tx + Math.sin(inc) * h
    const ey = y - Math.cos(inc) * h
    const cx = tx + Math.sin(inc) * h * 0.3
    const cy = y - h * 0.6
    d += `M${i0(tx - 1.5)} ${i0(y)}Q${i0(cx)} ${i0(cy)} ${i0(ex)} ${i0(ey)}Q${i0(cx + 3)} ${i0(cy)} ${i0(tx + 1.5)} ${i0(y)}Z`
    // hojas a lo largo del tallo
    const hojas = 3 + Math.floor(r() * 3)
    for (let k = 1; k <= hojas; k++) {
      const u = k / (hojas + 1)
      const px = tx + (ex - tx) * u
      const py = y + (ey - y) * u
      const lv = (k % 2 ? 1 : -1) * (0.7 + r() * 0.5) + inc
      const L = alto * (0.1 + r() * 0.08) * (1 - u * 0.5)
      const hx = px + Math.sin(lv) * L
      const hy = py - Math.cos(lv) * L
      const nx = Math.cos(lv) * L * 0.32
      const ny = Math.sin(lv) * L * 0.32
      d += `M${i0(px)} ${i0(py)}Q${i0((px + hx) / 2 + nx)} ${i0((py + hy) / 2 + ny)} ${i0(hx)} ${i0(hy)}Q${i0((px + hx) / 2 - nx)} ${i0((py + hy) / 2 - ny)} ${i0(px)} ${i0(py)}Z`
    }
    if (r() < 0.45) {
      // flor de cinco pétalos en la punta
      const s = 4 + r() * 4
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * 6.283
        const fx = ex + Math.cos(a) * s
        const fy = ey + Math.sin(a) * s
        d += `M${i0(fx - s)} ${i0(fy)}a${i0(s)} ${i0(s)} 0 1 0 ${i0(2 * s)} 0a${i0(s)} ${i0(s)} 0 1 0 ${i0(-2 * s)} 0`
      }
    }
  }
  return d
}

// árbol de la marca: base del tronco en x=790, y=655 del diseño; ancho ≈ 600 px del diseño
const ARBOL_S = 0.74 // el trazo está a la mitad de resolución
const ARBOL_TX = X(790) - 463 * ARBOL_S
const ARBOL_TY = Y(655) - ARBOL_H * ARBOL_S

/** Roca del logo bajo el árbol, con laderas suaves a los lados para unirse al suelo. */
function roca() {
  const pts = ROCA.map(([x, y]) => [ARBOL_TX + x * ARBOL_S, ARBOL_TY + y * ARBOL_S] as const)
  const [x0, y0] = pts[0]
  const [x1, y1] = pts[pts.length - 1]
  return (x: number) => {
    if (x <= x0) return y0 + (x0 - x) * 0.32
    if (x >= x1) return y1 + (x - x1) * 0.32
    let i = 0
    while (x > pts[i + 1][0]) i++
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    return ay + ((by - ay) * (x - ax)) / (bx - ax)
  }
}

function primerPlano() {
  const r = rng(91)
  // loma: baja hacia el centro (ahí manda la roca del logo) y sube en las esquinas, donde crecen las plantas
  const base = cresta(
    [
      [-200, 640], [0, 650], [140, 690], [320, 735], [460, 735], [620, 740], [790, 740], [930, 742],
      [1080, 740], [1200, 725], [1330, 690], [1460, 640], [1552, 620], [1760, 610],
    ],
    5,
    2,
  )
  const laRoca = roca()
  const suelo = (x: number) => Math.min(base(x), laRoca(x))
  let d = `M-20 ${H}`
  for (let x = -20; x <= W + 20; x += 6) d += `L${x} ${i0(suelo(x))}`
  d += `L${W + 20} ${H}Z`

  // pasto
  for (let i = 0; i < 170; i++) {
    const x = -20 + r() * (W + 40)
    const centro = Math.abs(x - X(790)) < 220
    if (centro && r() < 0.7) continue
    const h = 12 + r() * (centro ? 18 : 58)
    const b = (r() - 0.5) * h * 0.6
    const y = suelo(x) + 5
    d += `M${i0(x - 2)} ${i0(y)}Q${i0(x + b * 0.4)} ${i0(y - h * 0.6)} ${i0(x + b)} ${i0(y - h)}Q${i0(x + b * 0.4 + 2)} ${i0(y - h * 0.6)} ${i0(x + 2)} ${i0(y)}Z`
  }

  // plantas en las esquinas (como en el diseño: izquierda baja, derecha más frondosa)
  const izq: [number, number][] = [[-120, 150], [-20, 210], [40, 170], [110, 120], [170, 90]]
  const der: [number, number][] = [[1180, 130], [1260, 170], [1340, 230], [1420, 270], [1490, 300], [1560, 260], [1650, 220], [1740, 180]]
  for (const [x, alto] of izq) d += planta(X(x), suelo(X(x)) + 10, alto * K, r, 1)
  for (const [x, alto] of der) d += planta(X(x), suelo(X(x)) + 10, alto * K, r, -1)

  return (
    `<path fill="currentColor" d="${d}"/>` +
    `<path fill="currentColor" fill-rule="evenodd" transform="translate(${i0(ARBOL_TX)} ${i0(ARBOL_TY)}) scale(${ARBOL_S})" d="${ARBOL_D}"/>`
  )
}

const GENERA = { lejanas, cordillera, laderas, bosque, cercanas, primerPlano }
export type CapaId = keyof typeof GENERA
const cache: Partial<Record<CapaId, string>> = {}

/** Se calcula solo al prerenderizar (o en dev): en producción el SVG ya viene en el HTML. */
export function escena(id: CapaId) {
  return (cache[id] ??= GENERA[id]())
}
