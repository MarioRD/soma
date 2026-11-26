import type { Faq } from '@/content/servicios'

/** Preguntas con <details> nativo (sin JS). Oculta las que aún tienen TODO en la respuesta… salvo en desarrollo. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const visibles = faqs.filter((f) => import.meta.env.DEV || !f.a.startsWith('TODO'))
  if (!visibles.length) return null
  return (
    <div className="border-t border-starlight/12">
      {visibles.map((p) => (
        <details key={p.q} name="faq" className="group border-b border-starlight/12">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl transition-colors duration-200 hover:text-candle-200 sm:text-[1.4rem] [&::-webkit-details-marker]:hidden">
            {p.q}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-candle-200 transition-transform duration-300 group-open:rotate-45">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </summary>
          <p className="max-w-[62ch] pb-6 text-[1.05rem] leading-relaxed text-moon-100">{p.a}</p>
        </details>
      ))}
    </div>
  )
}
