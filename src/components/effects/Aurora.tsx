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
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float x=uv.x*2.2;
  float w=fbm(vec2(x*.8+t*.02,t*.03));
  float band=.62+.16*sin(x*1.3+w*4.+t*.05)+.08*(w-.5);
  float d=uv.y-band;
  float curtain=exp(-d*d*38.)*smoothstep(-.25,.1,d+.2);
  float rays=.55+.45*fbm(vec2(x*9.+t*.08,uv.y*1.5));
  float a=curtain*rays*smoothstep(.0,.35,uv.y);
  vec3 green=vec3(.18,.90,.75);vec3 blue=vec3(.10,.50,.82);vec3 violet=vec3(.46,.50,.90);
  vec3 c=mix(green,blue,smoothstep(.0,.12,d));
  c=mix(c,violet,smoothstep(.08,.25,d));
  a=clamp(a,0.,1.);
  gl_FragColor=vec4(clamp(c,0.,1.)*a*.85,a*.85);
}`

export default function Aurora() {
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')

    const SCALE = 0.35
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
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="aurora-fade absolute inset-x-0 top-0 h-[85vh] w-full" />
}
