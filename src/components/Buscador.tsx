import { useId, useMemo, useState, type FormEvent } from 'react'
import { KIND_LABEL, SERVICIOS, type Servicio } from '@/content/servicios'
import { whatsappUrl } from '@/lib/content'
import { to } from '@/lib/url'

/**
 * "¿Qué estás viviendo?": buscador por palabras de la vida real (tristeza, mi hijo no se concentra…)
 * que lleva a la página dedicada. Sin JS quedan las sugerencias como enlaces normales.
 */

const SUGERENCIAS: { label: string; slug: string }[] = [
  { label: 'Me siento triste y sin ganas', slug: 'depresion' },
  { label: 'No puedo dejar de preocuparme', slug: 'ansiedad-y-ataques-de-panico' },
  { label: 'Perdí a alguien', slug: 'duelo' },
  { label: 'Problemas con mi pareja', slug: 'terapia-de-pareja' },
  { label: 'Mi hijo no pone atención', slug: 'tdah' },
  { label: 'Quiero probar la hipnosis', slug: 'hipnosis-ericksoniana' },
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9ñ\s-]/g, ' ')

type Entry = { s: Servicio; nombre: string; keys: string[]; words: string[] }

function buildIndex(): Entry[] {
  return SERVICIOS.map((s) => {
    const keys = s.keywords.map(norm)
    const text = norm([s.nombre, s.titulo, ...s.keywords, ...(s.sientes ?? [])].join(' '))
    return { s, nombre: norm(s.nombre), keys, words: text.split(/\s+/).filter((w) => w.length > 2) }
  })
}

const INDEX = buildIndex()

const STOP = new Set(['que', 'con', 'por', 'para', 'los', 'las', 'una', 'uno', 'mis', 'del', 'muy', 'mas', 'como', 'tengo', 'siento', 'estoy', 'me'])

function search(index: Entry[], q: string) {
  const nq = norm(q).trim()
  if (nq.length < 2) return []
  const tokens = nq.split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t))
  return index
    .map((e) => {
      let score = 0
      for (const k of e.keys) if (nq.includes(k) || (k.includes(nq) && nq.length > 3)) score += 6
      if (e.nombre.includes(nq)) score += 4
      for (const t of tokens) if (e.words.some((w) => w.startsWith(t) || t.startsWith(w))) score += 2
      return { s: e.s, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.s)
}

export function Buscador({ id = 'buscador' }: { id?: string }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => search(INDEX, q), [q])
  const statusId = useId()
  const typed = q.trim().length >= 2

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (results[0]) window.location.href = to(`/${results[0].slug}/`)
  }

  return (
    <div className="w-full max-w-xl">
      <form role="search" onSubmit={onSubmit}>
        <label htmlFor={id} className="font-serif text-xl text-starlight sm:text-2xl">
          ¿Qué estás viviendo?
        </label>
        <div className="glass mt-3 flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 focus-within:ring-2 focus-within:ring-candle-200">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-mist">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id={id}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ansiedad, duelo, pareja…"
            autoComplete="off"
            enterKeyHint="search"
            aria-describedby={statusId}
            className="min-h-11 w-full min-w-0 bg-transparent text-base text-starlight placeholder:text-mist/80 focus:outline-none"
          />
        </div>
      </form>

      <p id={statusId} role="status" aria-live="polite" className="sr-only">
        {typed ? (results.length ? `${results.length} resultados` : 'Sin resultados') : ''}
      </p>

      {typed ? (
        results.length ? (
          <ul className="mt-4 grid gap-2">
            {results.map((s) => (
              <li key={s.slug}>
                <a
                  href={to(`/${s.slug}/`)}
                  className="lantern flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-3"
                >
                  <span className="font-serif text-lg">{s.nombre}</span>
                  <span className="shrink-0 text-sm text-mist">{KIND_LABEL[s.kind]}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-moon-100">
            No encontramos esa palabra, pero no importa: cuéntanos qué pasa{' '}
            <a href={whatsappUrl()} className="text-candle-200 underline decoration-1 underline-offset-4 hover:text-starlight">
              por WhatsApp
            </a>{' '}
            y te orientamos.
          </p>
        )
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Sugerencias">
          {SUGERENCIAS.map((s) => (
            <li key={s.slug}>
              <a
                href={to(`/${s.slug}/`)}
                className="inline-flex min-h-10 items-center rounded-full px-4 text-[0.92rem] text-moon-100 ring-1 ring-starlight/15 ring-inset transition-colors duration-200 hover:bg-starlight/10 hover:text-starlight"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
