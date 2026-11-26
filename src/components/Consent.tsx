import { useEffect, useState } from 'react'
import { buttonClass } from '@/lib/ui'
import { to } from '@/lib/url'

/**
 * Google Analytics 4 con consentimiento (Consent Mode v2).
 * - Sin VITE_GA_ID no se renderiza nada ni se carga ningún script.
 * - GA solo se descarga después de "Aceptar": no afecta el rendimiento de la primera carga.
 * Para activarlo: VITE_GA_ID=G-XXXXXXX en el build (variable del repositorio en GitHub Actions).
 */

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined
const KEY = 'soma-consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function loadGA() {
  if (!GA_ID || document.getElementById('ga4')) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' })
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
  const s = document.createElement('script')
  s.id = 'ga4'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

function read() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function Consent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    const v = read()
    if (v === 'si') loadGA()
    // localStorage no existe en el prerender: se lee al montar para no romper la hidratación
    // eslint-disable-next-line react/set-state-in-effect
    else if (v === null) setOpen(true)
  }, [])

  if (!GA_ID || !open) return null

  const decide = (v: 'si' | 'no') => {
    try {
      localStorage.setItem(KEY, v)
    } catch {
      /* sin almacenamiento: se vuelve a preguntar en la próxima visita */
    }
    if (v === 'si') loadGA()
    setOpen(false)
  }

  return (
    <div
      role="region"
      aria-label="Preferencias de privacidad"
      className="glass fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] z-50 mx-auto flex max-w-3xl flex-wrap items-center gap-4 rounded-3xl p-5"
    >
      <p className="min-w-0 flex-1 basis-72 text-[0.95rem] leading-relaxed text-moon-100">
        ¿Nos permites medir de forma anónima cómo se usa el sitio? Nos ayuda a que más personas encuentren apoyo.{' '}
        <a href={to('/aviso-de-privacidad/')} className="text-candle-200 underline decoration-1 underline-offset-4">
          Aviso de privacidad
        </a>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => decide('no')} className={buttonClass('ghost', 'min-h-11 px-5 text-[0.95rem]')}>
          No, gracias
        </button>
        <button type="button" onClick={() => decide('si')} className={buttonClass('primary', 'min-h-11 px-5 text-[0.95rem]')}>
          Aceptar
        </button>
      </div>
    </div>
  )
}
