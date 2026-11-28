import { useEffect, useRef } from 'react'

/**
 * Aurora boreal en WebGL (shader de ruido). Se carga con React.lazy.
 * - Se pausa con la pestaña oculta o fuera de viewport.
 * - Con prefers-reduced-motion dibuja un solo cuadro estático.
 * - Resolución reducida (es un fondo difuso) y ~30 fps.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

// Precisión alta si la GPU la tiene, y un hash sin sin()*43758: en mediump ese truco
// se desborda (Inf/NaN) y la aurora se pintaba en blanco en algunas GPUs.
const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;uniform float t;
float h(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
float fb3(vec2 p){return .5*n(p)+.25*n(p*2.)+.125*n(p*4.);}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float x=uv.x;
  // cortina principal: cresta ondulante que se mueve, con rayos verticales
  float n1=fbm(vec2(x*2.4+t*.05,t*.035));
  float base=.42+.13*sin(x*3.4+t*.16+n1*3.)+.07*(n1-.5);
  float d=uv.y-base;
  float body=smoothstep(-.05,.0,d)*exp(-max(d,0.)*4.2);
  float rays=.35+.65*fb3(vec2(x*26.+n1*5.+t*.22,d*1.4-t*.06));
  float a=body*rays+exp(-d*d*700.)*.28;
  // segunda cortina, más tenue y lenta
  float n2=fb3(vec2(x*1.7-t*.03+4.,t*.02));
  float d2=uv.y-(.62+.1*sin(x*2.2-t*.1+n2*2.5));
  a+=(smoothstep(-.04,.0,d2)*exp(-max(d2,0.)*5.))*(.3+.7*fb3(vec2(x*20.-t*.15,d2)))*.55;
  // verde abajo, violeta en las puntas y en franjas que viajan
  vec3 green=vec3(.16,.93,.66);vec3 teal=vec3(.1,.72,.78);vec3 violet=vec3(.62,.42,.98);
  float band=smoothstep(.35,.75,.5+.5*sin(x*4.2-t*.09+n1*2.));
  vec3 c=mix(green,teal,smoothstep(.0,.12,d));
  c=mix(c,violet,clamp(band*.85+smoothstep(.08,.3,d)*.6,0.,1.));
  a=clamp(a*smoothstep(.0,.25,uv.y),0.,1.);
  gl_FragColor=vec4(clamp(c,0.,1.)*a*.9,a*.9);
}`

export default function Aurora({ className = 'absolute inset-x-0 top-0 h-[85vh] w-full' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true })
    if (!gl) return

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)

    // Compilación en paralelo (KHR_parallel_shader_compile): no bloquea el hilo principal
    // mientras la GPU compila; se espera cuadro a cuadro hasta que esté listo.
    const par = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null
    let cleanup: (() => void) | null = null
    let poll = 0
    const listo = () => {
      if (par && !gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) {
        poll = requestAnimationFrame(listo)
        return
      }
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
      cleanup = arrancar(canvas, gl, prog)
    }
    listo()
    return () => {
      cancelAnimationFrame(poll)
      cleanup?.()
      // sin loseContext(): en StrictMode el efecto se monta dos veces sobre el mismo canvas
      // y un contexto perdido dejaba la aurora en blanco. El navegador lo libera al quitar el canvas.
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`aurora-fade ${className}`} />
}

/** Dibuja la aurora (~30 fps) y la pausa fuera de pantalla o con la pestaña oculta. */
function arrancar(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, prog: WebGLProgram) {
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const uR = gl.getUniformLocation(prog, 'r')
  const uT = gl.getUniformLocation(prog, 't')

  const SCALE = 0.3
  const resize = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * SCALE))
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * SCALE))
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(uR, canvas.width, canvas.height)
  }
  resize()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let raf = 0
  let last = 0
  let visible = true
  const start = performance.now() - 40_000 // arranca a media danza

  const draw = (now: number) => {
    gl.uniform1f(uT, ((now - start) / 1000) % 3600) // acotado: floats grandes pierden precisión
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    if (now - last < 33) return
    last = now
    draw(now)
  }
  const sync = () => {
    cancelAnimationFrame(raf)
    if (reduce.matches || !visible || document.hidden) {
      draw(performance.now())
      return
    }
    raf = requestAnimationFrame(loop)
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    sync()
  })
  io.observe(canvas)
  const ro = new ResizeObserver(() => {
    resize()
    draw(performance.now())
  })
  ro.observe(canvas)
  document.addEventListener('visibilitychange', sync)
  reduce.addEventListener('change', sync)
  sync()

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', sync)
    reduce.removeEventListener('change', sync)
  }
}
