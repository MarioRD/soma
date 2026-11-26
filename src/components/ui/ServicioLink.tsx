import type { Servicio } from '@/content/servicios'
import { to } from '@/lib/url'

/** Farol enlazado a una página de servicio. */
export function ServicioLink({ s, detalle = true }: { s: Servicio; detalle?: boolean }) {
  return (
    <a href={to(`/${s.slug}/`)} className="lantern group flex h-full flex-col justify-between gap-5 rounded-[1.75rem] p-6 sm:p-7">
      <span className="font-serif text-[1.45rem] leading-tight text-starlight">{s.nombre}</span>
      {detalle && <span className="line-clamp-3 text-[0.97rem] leading-relaxed text-moon-100">{s.lead}</span>}
      <span className="text-sm text-candle-200 transition-transform duration-300 group-hover:translate-x-1">Leer más</span>
    </a>
  )
}
