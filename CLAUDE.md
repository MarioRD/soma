# Soma · landing page

Landing de Soma (psicología, psicoterapia con hipnosis ericksoniana, constelaciones familiares). Todo el contenido visible va en español.

## Stack
- Vite + React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `src/index.css` con `@theme`).
- Animación: `motion` (`motion/react`). Scroll suave/parallax: `lenis`.
- Fuentes self-hosted: Fraunces (títulos, `font-serif`) y Manrope (texto, `font-sans`).
- Alias `@/` → `src/`.

## Concepto visual
Anochecer y atardeceres relajantes, auroras boreales, estrellas, parallax, glassmorphism / liquid glass (utilidad `glass`).
Paleta: `night-*` (fondo), `moon-*` (índigo de la luna), `aurora-*` (verde-turquesa), `glacier-500`, `dusk-400` (cálido, poco uso), `starlight` (texto).
Marca en `src/assets/brand/`: `soma-wordmark.png` (firma manuscrita), `soma-arbol.png` (árbol bajo la luna), `soma-poster.png` (referencia).

## Estructura
- `src/components/effects/` auroras, estrellas, parallax, glass (canvas/WebGL aislados aquí).
- `src/components/sections/` secciones de la página.
- `src/components/ui/` piezas pequeñas reutilizables.
- `src/hooks/`, `src/lib/`.

## Reglas
- Respetar `prefers-reduced-motion`: todo efecto debe tener versión estática.
- Efectos pesados (canvas/WebGL) con `React.lazy` y pausados fuera de viewport.
- HTML semántico, un solo `h1`, contraste AA, foco visible.
- Sin datos inventados (teléfonos, testimonios, precios): usar marcadores `TODO` hasta tenerlos.
- Comandos: `npm run dev`, `npm run build`, `npm run lint`.

## Skills del proyecto (`.claude/skills/`)
Diseño: `hallmark`, `frontend-design`, `make-interfaces-feel-better`. Web moderna: `modern-web-guidance`. Motion: `motion-foundations/patterns/advanced`. React/Vite: `react-patterns`, `react-performance`, `vite-patterns`. A11y: `accessibility`, `frontend-a11y`. SEO: `seo`. Pruebas en navegador: `webapp-testing`.
