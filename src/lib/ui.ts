/** Contenedor único de la página: medida fija, los márgenes crecen en pantallas grandes. */
export const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

export type Variant = 'primary' | 'ghost'

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-[background-color,color,box-shadow,transform] duration-300 ease-(--ease-soft) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const VARIANTS: Record<Variant, string> = {
  // Vela encendida: el único botón relleno de la página
  primary:
    'bg-candle-200 text-night-950 shadow-[0_0_40px_-8px_var(--color-candle-500)] hover:bg-starlight hover:shadow-[0_0_56px_-6px_var(--color-candle-500)]',
  ghost:
    'text-starlight ring-1 ring-starlight/25 ring-inset hover:bg-starlight/10 hover:ring-starlight/45',
}

export function buttonClass(variant: Variant = 'primary', extra = '') {
  return `${BASE} ${VARIANTS[variant]} ${extra}`
}
