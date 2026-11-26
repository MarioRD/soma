import { useState, type FormEvent } from 'react'
import { SITE, TERAPIAS } from '@/lib/content'
import { buttonClass, CONTAINER } from '@/lib/ui'

const FIELD =
  'w-full rounded-2xl bg-night-950/50 px-4 py-3 text-base text-starlight ring-1 ring-starlight/15 ring-inset placeholder:text-mist/70 transition-shadow duration-200 hover:ring-starlight/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-candle-200'

/**
 * Cierre de la página: el primer mensaje.
 * Si hay WhatsApp configurado, el formulario arma el mensaje y abre WhatsApp.
 * TODO: o conectar a un endpoint / servicio de formularios.
 */
export function Agendar() {
  const [status, setStatus] = useState('')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const texto = `Hola Soma, soy ${f.get('nombre')}. Me interesa: ${f.get('interes')}. ${f.get('mensaje') ?? ''}`.trim()
    if (SITE.whatsapp) {
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
      setStatus('Abrimos WhatsApp con tu mensaje listo para enviar.')
    } else {
      setStatus('El formulario aún no está conectado (pendiente: WhatsApp o correo de Soma).')
    }
  }

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="py-24 sm:py-32">
      <div className={CONTAINER}>
        <div className="lantern grid gap-12 rounded-[2.5rem] p-7 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-16">
          <div>
            <h2 id="agendar-titulo" className="max-w-[14ch] text-[clamp(2.2rem,4.4vw,3.75rem)] leading-[1.05] font-normal">
              Tu primera sesión empieza con un mensaje
            </h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-moon-100">
              Escríbenos lo que quieras contar. Te respondemos para encontrar un horario.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="nombre" className="text-sm text-mist">
                Tu nombre
              </label>
              <input id="nombre" name="nombre" required autoComplete="given-name" className={FIELD} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="interes" className="text-sm text-mist">
                Me interesa
              </label>
              <select id="interes" name="interes" className={FIELD} defaultValue="Aún no lo sé">
                <option>Aún no lo sé</option>
                {TERAPIAS.map((t) => (
                  <option key={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="mensaje" className="text-sm text-mist">
                Algo que quieras contarnos (opcional)
              </label>
              <textarea id="mensaje" name="mensaje" rows={3} className={`${FIELD} resize-y`} />
            </div>
            <button type="submit" className={buttonClass('primary', 'mt-2 w-full sm:w-auto sm:justify-self-start')}>
              Enviar mensaje
            </button>
            <p role="status" aria-live="polite" className="min-h-[1lh] text-sm text-candle-200">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
