/**
 * Marcador de la foto de la Mtra. Lidia (aún no hay foto profesional).
 * TODO: reemplazar por <img> con la foto real (retrato vertical 4:5, mínimo 1200×1500).
 */
export function Retrato({ className = '' }: { className?: string }) {
  return (
    <figure className={`lantern relative aspect-[4/5] overflow-hidden rounded-[2rem] ${className}`} data-slot="retrato-lidia">
      <svg aria-hidden="true" viewBox="0 0 400 500" className="absolute inset-0 size-full text-moon-300/40">
        <circle cx="200" cy="185" r="78" fill="currentColor" />
        <path d="M50 500c10-120 70-190 150-190s140 70 150 190z" fill="currentColor" />
      </svg>
      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm text-mist">Foto de la Mtra. Lidia (de prueba)</figcaption>
    </figure>
  )
}
