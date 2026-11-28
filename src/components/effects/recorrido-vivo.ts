/**
 * Parte viva del recorrido del infinito (se carga aparte, solo cerca de la pantalla y sin reduced-motion):
 * - Cinta ∞ en WebGL (sin librerías): la cámara la recorre con el scroll y al final se aleja.
 * - Fuegos artificiales (adolescentes), figuras y mascota que se agarran y se lanzan (infantil),
 *   nubes que se apartan del cursor o del dedo (pareja).
 * - Al soltar el scroll entre dos escenas, se acomoda suavemente en la más cercana.
 * Todo se pausa fuera de pantalla. Devuelve una función que lo detiene y limpia.
 */
import { getLenis } from '@/lib/lenis'

type V3 = [number, number, number]

export function iniciar(raiz: HTMLElement) {
  const paradas: (() => void)[] = []
  const canvas = raiz.querySelector<HTMLCanvasElement>('[data-cinta]')
  if (canvas) {
    const p = cinta(raiz, canvas)
    if (p) paradas.push(p)
  }
  const fuegosCanvas = raiz.querySelector<HTMLCanvasElement>('[data-fuegos]')
  if (fuegosCanvas) paradas.push(fuegos(fuegosCanvas))
  const infantil = raiz.querySelector<HTMLElement>('[data-tramo="infantil"]')
  if (infantil) paradas.push(cuerpos(infantil))
  const pareja = raiz.querySelector<HTMLElement>('[data-tramo="pareja"]')
  if (pareja) paradas.push(nubes(pareja))
  paradas.push(acomodo(raiz))
  paradas.push(navClara(raiz))
  return () => paradas.forEach((p) => p())
}

/** Ejecuta `cuadro` en cada frame mientras `el` esté visible. */
function mientrasVisible(el: Element, cuadro: (t: number) => void, margen = '0px') {
  let raf = 0
  let activo = false
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop)
    cuadro(t)
  }
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !activo && !document.hidden) {
        activo = true
        raf = requestAnimationFrame(loop)
      } else if (!e.isIntersecting && activo) {
        activo = false
        cancelAnimationFrame(raf)
      }
    },
    { rootMargin: margen },
  )
  io.observe(el)
  return () => {
    io.disconnect()
    cancelAnimationFrame(raf)
  }
}

/* ═════════════════════════ Cinta ∞ (WebGL) ═════════════════════════ */

const A = 7 // medio ancho del ∞
const ALTO = 1.3 // separación vertical en el cruce (para que la cinta no se atraviese)
const ANCHO = 1.15 // medio ancho de la cinta

function curva(t: number): V3 {
  const s = Math.sin(t)
  const c = Math.cos(t)
  const d = 1 + s * s
  return [(A * c) / d, ALTO * s, (A * s * c) / d]
}
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
const tangente = (t: number) => norm(sub(curva(t + 1e-3), curva(t - 1e-3)))
const ARRIBA: V3 = [0, 1, 0]

function geometria(n: number) {
  const pos: number[] = []
  const nor: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    const c = curva(t)
    const T = tangente(t)
    const S = norm(cross(T, ARRIBA))
    const U = cross(S, T)
    const giro = t + 0.5 // una vuelta completa a lo largo del ∞: se ve como un listón que se tuerce
    const D = add(mul(S, Math.cos(giro)), mul(U, Math.sin(giro)))
    const N = norm(cross(T, D))
    for (const j of [-1, 1]) {
      const p = add(c, mul(D, ANCHO * j))
      pos.push(...p)
      nor.push(...N)
      uv.push(i / n, j)
    }
    if (i < n) {
      const a = i * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), uv: new Float32Array(uv), idx: new Uint16Array(idx) }
}

function perspectiva(fov: number, asp: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2)
  const nf = 1 / (near - far)
  return new Float32Array([f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0])
}
function mirar(ojo: V3, obj: V3, arriba: V3) {
  const z = norm(sub(ojo, obj))
  const x = norm(cross(arriba, z))
  const y = cross(z, x)
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, ojo), -dot(y, ojo), -dot(z, ojo), 1])
}

const VS = `attribute vec3 aP;attribute vec3 aN;attribute vec2 aUV;
uniform mat4 uProj;uniform mat4 uView;
varying vec3 vP;varying vec3 vN;varying vec2 vUV;
void main(){vP=aP;vN=aN;vUV=aUV;gl_Position=uProj*uView*vec4(aP,1.);}`

// Nácar: lavanda (luna) → azul glaciar → menta (aurora) → lila, con brillo de vela en los bordes
const FS = `precision mediump float;
uniform vec3 uCam;uniform float uT;
varying vec3 vP;varying vec3 vN;varying vec2 vUV;
vec3 paleta(float u){
  u=fract(u)*4.;
  vec3 a=vec3(.62,.6,.97),b=vec3(.45,.62,.98),c=vec3(.46,.86,.86),d=vec3(.76,.63,.98);
  if(u<1.)return mix(a,b,u);if(u<2.)return mix(b,c,u-1.);if(u<3.)return mix(c,d,u-2.);return mix(d,a,u-3.);
}
void main(){
  vec3 N=normalize(vN);vec3 V=normalize(uCam-vP);
  if(dot(N,V)<0.)N=-N;
  float fr=pow(1.-max(dot(N,V),0.),2.2);
  vec3 L=normalize(vec3(.35,1.,.45));
  float dif=.8+.2*max(dot(N,L),0.);
  float spec=pow(max(dot(reflect(-L,N),V),0.),28.);
  vec3 base=paleta(vUV.x*2.+uT*.004);
  vec3 iri=.5+.5*cos(6.2832*(fr*1.1+vUV.x*3.+vec3(0.,.33,.67)));
  vec3 col=base*dif+iri*.22*fr+vec3(1.,.93,.82)*(spec*.55+fr*.25);
  float borde=smoothstep(.78,1.,abs(vUV.y));
  col=mix(col,vec3(1.,.96,.9),borde*.45);
  float d=length(uCam-vP);
  float a=.94*(1.-smoothstep(22.,42.,d));
  gl_FragColor=vec4(clamp(col,0.,1.)*a,a);
}`

function cinta(raiz: HTMLElement, canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })
  if (!gl) return null
  const sh = (tipo: number, src: string) => {
    const s = gl.createShader(tipo)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const g = geometria(1400)
  const atributo = (nombre: string, datos: Float32Array, n: number) => {
    const b = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, datos, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, nombre)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0)
  }
  atributo('aP', g.pos, 3)
  atributo('aN', g.nor, 3)
  atributo('aUV', g.uv, 2)
  const ib = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.idx, gl.STATIC_DRAW)
  const uProj = gl.getUniformLocation(prog, 'uProj')
  const uView = gl.getUniformLocation(prog, 'uView')
  const uCam = gl.getUniformLocation(prog, 'uCam')
  const uT = gl.getUniformLocation(prog, 'uT')
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  const tramos = raiz.querySelectorAll('[data-tramo]').length // 6: cinco escenas + final
  const movil = matchMedia('(pointer: coarse)').matches
  let asp = 1
  const medir = () => {
    const dpr = Math.min(devicePixelRatio || 1, movil ? 1.25 : 1.5)
    canvas.width = Math.round(canvas.clientWidth * dpr)
    canvas.height = Math.round(canvas.clientHeight * dpr)
    asp = canvas.width / Math.max(1, canvas.height)
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  medir()
  const ro = new ResizeObserver(medir)
  ro.observe(canvas)

  /** Pose de cámara para un avance p (0 = primera escena, tramos-1 = vista completa). */
  const T0 = 0.15
  const PASO = 1.2
  const pose = (p: number): { ojo: V3; obj: V3; arriba: V3; fov: number } => {
    const vertical = asp < 0.9
    const ultimo = tramos - 1
    const pp = Math.min(p, ultimo - 1)
    const t = T0 + Math.max(pp, -0.6) * PASO
    const c = curva(t)
    const T = tangente(t)
    const S = norm(cross(T, ARRIBA))
    // a un costado de la cinta, un poco atrás y arriba, mirando hacia donde sigue
    const lado = vertical ? 3.6 : 4.6
    const ojo = add(add(add(c, mul(T, -4.6)), mul(S, lado)), [0, 2.4, 0])
    const obj = add(curva(t + 0.6), mul(S, vertical ? 0.6 : -0.4))
    const montado = { ojo, obj, arriba: ARRIBA, fov: vertical ? 1.15 : 0.95 }
    if (p <= ultimo - 1) return montado
    // alejamiento final: desde arriba, el ∞ completo (vertical en pantallas verticales)
    const k = Math.min(1, p - (ultimo - 1))
    const e = k * k * (3 - 2 * k)
    const lejos = vertical ? 30 : 21
    const vista = {
      ojo: [0, lejos, lejos * 0.42] as V3,
      obj: [0, 0, 0] as V3,
      arriba: (vertical ? [1, 0, 0] : ARRIBA) as V3,
      fov: 0.8,
    }
    return {
      ojo: mix(montado.ojo, vista.ojo, e),
      obj: mix(montado.obj, vista.obj, e),
      arriba: norm(mix(montado.arriba, vista.arriba, e)),
      fov: montado.fov + (vista.fov - montado.fov) * e,
    }
  }

  let actual: ReturnType<typeof pose> | null = null
  const cuadro = (t: number) => {
    const r = raiz.getBoundingClientRect()
    const p = -r.top / innerHeight
    const meta = pose(p)
    // la cámara sigue a la meta con suavidad (sin tirones al hacer scroll rápido)
    if (!actual) actual = meta
    else {
      const k = 0.14
      actual = {
        ojo: mix(actual.ojo, meta.ojo, k),
        obj: mix(actual.obj, meta.obj, k),
        arriba: norm(mix(actual.arriba, meta.arriba, k)),
        fov: actual.fov + (meta.fov - actual.fov) * k,
      }
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniformMatrix4fv(uProj, false, perspectiva(actual.fov, asp, 0.1, 80))
    gl.uniformMatrix4fv(uView, false, mirar(actual.ojo, actual.obj, actual.arriba))
    gl.uniform3fv(uCam, actual.ojo)
    gl.uniform1f(uT, t / 1000)
    gl.drawElements(gl.TRIANGLES, g.idx.length, gl.UNSIGNED_SHORT, 0)
  }
  const parar = mientrasVisible(raiz, cuadro)
  return () => {
    parar()
    ro.disconnect()
  }
}

/* ═════════════════════════ Fuegos artificiales (adolescentes) ═════════════════════════ */

const COLORES = ['#7df5da', '#ffe7c2', '#f5b971', '#9b7bf0', '#f48fb1', '#6ec6ff', '#ffd98a']

function fuegos(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  type P = { x: number; y: number; vx: number; vy: number; vida: number; c: string; cohete?: boolean; meta?: number }
  let ps: P[] = []
  let w = 0
  let h = 0
  const dpr = Math.min(devicePixelRatio || 1, 1.5)
  const medir = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  medir()
  const ro = new ResizeObserver(medir)
  ro.observe(canvas)
  let proximo = 0
  let antes = 0
  const lanzar = () => {
    const x = w * (0.15 + Math.random() * 0.7)
    ps.push({ x, y: h + 10, vx: (Math.random() - 0.5) * 40, vy: -h * (0.9 + Math.random() * 0.35), vida: 1, c: '#ffe7c2', cohete: true, meta: h * (0.15 + Math.random() * 0.3) })
  }
  const estallar = (x: number, y: number) => {
    const c = COLORES[Math.floor(Math.random() * COLORES.length)]
    const c2 = COLORES[Math.floor(Math.random() * COLORES.length)]
    const n = 70
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const v = 120 + Math.random() * 160
      ps.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, c: i % 3 ? c : c2 })
    }
  }
  const cuadro = (t: number) => {
    const dt = Math.min(0.05, (t - (antes || t)) / 1000)
    antes = t
    if (t > proximo) {
      lanzar()
      proximo = t + 1400 + Math.random() * 1600
    }
    // estela: borra un poco cada cuadro en lugar de todo
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    const vivos: P[] = []
    for (const p of ps) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.cohete) {
        p.vy += h * 0.55 * dt
        if (p.y <= (p.meta ?? 0) || p.vy >= 0) {
          estallar(p.x, p.y)
          continue
        }
      } else {
        p.vx *= 0.985
        p.vy = p.vy * 0.985 + 90 * dt
        p.vida -= dt * 0.55
        if (p.vida <= 0) continue
      }
      ctx.globalAlpha = Math.max(0, p.vida)
      ctx.fillStyle = p.c
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.cohete ? 2.6 : 2.4, 0, Math.PI * 2)
      ctx.fill()
      vivos.push(p)
    }
    ctx.globalAlpha = 1
    ps = vivos
  }
  const parar = mientrasVisible(canvas, cuadro)
  return () => {
    parar()
    ro.disconnect()
  }
}

/* ═════════════════════════ Figuras que se agarran y se lanzan (infantil) ═════════════════════════ */

function cuerpos(tramo: HTMLElement) {
  type C = { el: HTMLElement; cx: number; cy: number; r: number; x: number; y: number; vx: number; vy: number; rot: number; vr: number; fase: number; agarrado: boolean; px: number; py: number; pt: number; ox: number; oy: number }
  const els = [...tramo.querySelectorAll<HTMLElement>('[data-cuerpo]')]
  const cs: C[] = els.map((el, i) => ({ el, cx: 0, cy: 0, r: 0, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, fase: i * 1.7, agarrado: false, px: 0, py: 0, pt: 0, ox: 0, oy: 0 }))
  const medir = () => {
    for (const c of cs) {
      c.cx = c.el.offsetLeft + c.el.offsetWidth / 2
      c.cy = c.el.offsetTop + c.el.offsetHeight / 2
      c.r = Math.min(c.el.offsetWidth, c.el.offsetHeight) * 0.42
    }
  }
  medir()
  const ro = new ResizeObserver(medir)
  ro.observe(tramo)

  const local = (e: PointerEvent) => {
    const r = tramo.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  const quitar: (() => void)[] = []
  for (const c of cs) {
    const down = (e: PointerEvent) => {
      e.preventDefault()
      c.el.setPointerCapture(e.pointerId)
      const [x, y] = local(e)
      c.agarrado = true
      c.ox = c.cx + c.x - x
      c.oy = c.cy + c.y - y
      c.px = x
      c.py = y
      c.pt = performance.now()
      c.vx = c.vy = 0
      c.el.style.zIndex = '30'
    }
    const move = (e: PointerEvent) => {
      if (!c.agarrado) return
      const [x, y] = local(e)
      const ahora = performance.now()
      const dt = Math.max(8, ahora - c.pt) / 1000
      c.vx = c.vx * 0.4 + ((x - c.px) / dt) * 0.6
      c.vy = c.vy * 0.4 + ((y - c.py) / dt) * 0.6
      c.px = x
      c.py = y
      c.pt = ahora
      c.x = x + c.ox - c.cx
      c.y = y + c.oy - c.cy
    }
    const up = () => {
      if (!c.agarrado) return
      c.agarrado = false
      if (performance.now() - c.pt > 90) c.vx = c.vy = 0 // lo soltó quieto
      const v = Math.hypot(c.vx, c.vy)
      if (v > 2600) {
        c.vx *= 2600 / v
        c.vy *= 2600 / v
      }
      c.vr = c.vx * 0.0015
      c.el.style.zIndex = ''
    }
    c.el.addEventListener('pointerdown', down)
    c.el.addEventListener('pointermove', move)
    c.el.addEventListener('pointerup', up)
    c.el.addEventListener('pointercancel', up)
    quitar.push(() => {
      c.el.removeEventListener('pointerdown', down)
      c.el.removeEventListener('pointermove', move)
      c.el.removeEventListener('pointerup', up)
      c.el.removeEventListener('pointercancel', up)
    })
  }

  let antes = 0
  const cuadro = (t: number) => {
    const dt = Math.min(0.033, (t - (antes || t)) / 1000)
    antes = t
    const W = tramo.clientWidth
    const H = tramo.clientHeight
    for (const c of cs) {
      if (c.agarrado) continue
      // flotan: sin gravedad, con un vaivén suave y fricción del aire
      c.vy += Math.sin(t / 1400 + c.fase) * 10 * dt
      c.vx += Math.cos(t / 1900 + c.fase) * 6 * dt
      const f = Math.pow(0.35, dt)
      c.vx *= f
      c.vy *= f
      c.x += c.vx * dt
      c.y += c.vy * dt
      c.vr *= Math.pow(0.5, dt)
      c.rot += c.vr * dt * 60
      // rebote en los bordes de la escena
      const X = c.cx + c.x
      const Y = c.cy + c.y
      if (X < c.r) { c.x = c.r - c.cx; c.vx = Math.abs(c.vx) * 0.7 }
      if (X > W - c.r) { c.x = W - c.r - c.cx; c.vx = -Math.abs(c.vx) * 0.7 }
      if (Y < c.r) { c.y = c.r - c.cy; c.vy = Math.abs(c.vy) * 0.7 }
      if (Y > H - c.r) { c.y = H - c.r - c.cy; c.vy = -Math.abs(c.vy) * 0.7 }
    }
    // choques entre figuras (círculos)
    for (let i = 0; i < cs.length; i++)
      for (let j = i + 1; j < cs.length; j++) {
        const a = cs[i]
        const b = cs[j]
        const dx = b.cx + b.x - (a.cx + a.x)
        const dy = b.cy + b.y - (a.cy + a.y)
        const d = Math.hypot(dx, dy) || 1
        const m = a.r + b.r - d
        if (m <= 0) continue
        const nx = dx / d
        const ny = dy / d
        const wa = a.agarrado ? 0 : b.agarrado ? 1 : 0.5
        const wb = 1 - wa
        a.x -= nx * m * wa
        a.y -= ny * m * wa
        b.x += nx * m * wb
        b.y += ny * m * wb
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
        if (rv < 0) {
          const imp = -rv * 0.85
          if (!a.agarrado) { a.vx -= nx * imp * (b.agarrado ? 1 : 0.5); a.vy -= ny * imp * (b.agarrado ? 1 : 0.5); a.vr -= imp * 0.0008 }
          if (!b.agarrado) { b.vx += nx * imp * (a.agarrado ? 1 : 0.5); b.vy += ny * imp * (a.agarrado ? 1 : 0.5); b.vr += imp * 0.0008 }
        }
      }
    for (const c of cs) c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.rot.toFixed(1)}deg)${c.agarrado ? ' scale(1.08)' : ''}`
  }
  const parar = mientrasVisible(tramo, cuadro)
  return () => {
    parar()
    ro.disconnect()
    quitar.forEach((q) => q())
  }
}

/* ═════════════════════════ Nubes que se apartan (pareja) ═════════════════════════ */

function nubes(tramo: HTMLElement) {
  const bs = [...tramo.querySelectorAll<HTMLElement>('[data-bocanada]')].map((el) => ({ el, x: 0, y: 0, vx: 0, vy: 0 }))
  let px = -9999
  let py = -9999
  const mover = (x: number, y: number) => {
    const r = tramo.getBoundingClientRect()
    px = x - r.left
    py = y - r.top
  }
  const onPointer = (e: PointerEvent) => mover(e.clientX, e.clientY)
  const onTouch = (e: TouchEvent) => e.touches[0] && mover(e.touches[0].clientX, e.touches[0].clientY)
  const salir = () => {
    px = py = -9999
  }
  tramo.addEventListener('pointermove', onPointer, { passive: true })
  tramo.addEventListener('touchmove', onTouch, { passive: true })
  tramo.addEventListener('pointerleave', salir)
  tramo.addEventListener('touchend', salir)
  const tr = tramo.getBoundingClientRect.bind(tramo)
  const cuadro = () => {
    const base = tr()
    for (const b of bs) {
      const r = b.el.getBoundingClientRect()
      const cx = r.left - base.left + r.width / 2 - b.x
      const cy = r.top - base.top + r.height / 2 - b.y
      const dx = cx + b.x - px
      const dy = cy + b.y - py
      const d = Math.hypot(dx, dy) || 1
      const R = Math.max(160, r.width * 0.55)
      let fx = -b.x * 0.06 // resorte: vuelve a su lugar
      let fy = -b.y * 0.06
      if (d < R) {
        const k = ((R - d) / R) ** 2 * 9
        fx += (dx / d) * k
        fy += (dy / d) * k
      }
      b.vx = (b.vx + fx) * 0.86
      b.vy = (b.vy + fy) * 0.86
      b.x += b.vx
      b.y += b.vy
      const abre = Math.min(1, Math.hypot(b.x, b.y) / 120)
      b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`
      b.el.style.filter = abre > 0.02 ? `blur(${(abre * 3).toFixed(1)}px)` : ''
    }
  }
  const parar = mientrasVisible(tramo, cuadro)
  return () => {
    parar()
    tramo.removeEventListener('pointermove', onPointer)
    tramo.removeEventListener('touchmove', onTouch)
    tramo.removeEventListener('pointerleave', salir)
    tramo.removeEventListener('touchend', salir)
  }
}

/* ═════════════════════════ Acomodo entre escenas ═════════════════════════ */

function acomodo(raiz: HTMLElement) {
  let espera = 0
  let acomodando = false
  let ultimoY = scrollY
  let dir = 0
  const revisar = () => {
    const lenis = getLenis()
    if (!lenis || acomodando) return
    const top = raiz.getBoundingClientRect().top + scrollY
    const n = raiz.querySelectorAll('[data-tramo]').length
    const vh = innerHeight
    const p = (scrollY - top) / vh
    if (p < -0.45 || p > n - 1 + 0.2) return // fuera del recorrido: scroll normal
    // basta con empezar a bajar (o subir) para pasar a la siguiente escena
    const i = dir > 0 ? Math.ceil(p - 0.1) : dir < 0 ? Math.floor(p + 0.1) : Math.round(p)
    const destino = top + Math.min(Math.max(i, 0), n - 1) * vh
    if (Math.abs(destino - scrollY) < 3) return
    acomodando = true
    lenis.scrollTo(destino, {
      duration: 1.1,
      easing: (x: number) => 1 - Math.pow(1 - x, 3),
      onComplete: () => {
        acomodando = false
      },
    })
    setTimeout(() => (acomodando = false), 1600)
  }
  const onScroll = () => {
    if (!acomodando && scrollY !== ultimoY) dir = Math.sign(scrollY - ultimoY)
    ultimoY = scrollY
    clearTimeout(espera)
    if (!acomodando) espera = window.setTimeout(revisar, 180)
  }
  addEventListener('scroll', onScroll, { passive: true })
  return () => {
    removeEventListener('scroll', onScroll)
    clearTimeout(espera)
  }
}

/* ═════════════════════════ Barra de navegación sobre escenas claras ═════════════════════════ */

/** Sobre las escenas claras (infantil, pareja) la barra se oscurece para conservar el contraste. */
function navClara(raiz: HTMLElement) {
  const claros = [...raiz.querySelectorAll<HTMLElement>('[data-tramo="infantil"], [data-tramo="pareja"]')]
  const html = document.documentElement
  const revisar = () => {
    const y = 40 // altura de la barra
    const encima = claros.some((t) => {
      const r = t.getBoundingClientRect()
      return r.top <= y && r.bottom > y
    })
    html.toggleAttribute('data-nav-oscura', encima)
  }
  addEventListener('scroll', revisar, { passive: true })
  revisar()
  return () => {
    removeEventListener('scroll', revisar)
    html.removeAttribute('data-nav-oscura')
  }
}
