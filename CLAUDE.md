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

## Sitio multipágina
- Rutas en `src/lib/routes.ts`; contenido de cada página dedicada en `src/content/servicios.ts`; datos del negocio en `src/lib/content.ts`.
- `npm run build` prerenderiza cada ruta a `dist/<ruta>/index.html` con su `<head>` (`src/lib/seo.ts`: título, canonical, OG, JSON-LD) y genera `sitemap.xml`, `robots.txt`, `llms.txt` y `404.html` (`scripts/prerender.mjs`).
- Enlaces internos siempre con `to('/ruta/')` (`src/lib/url.ts`) por la base de GitHub Pages.
- Variables de build: `BASE_PATH`, `VITE_SITE_URL` (dominio), `VITE_GA_ID` (Analytics, con consentimiento).
- Contenido clínico: `revisado` solo con fecha real de revisión de la Mtra. Lidia.

## Estructura
- `src/components/effects/` auroras, estrellas, parallax, glass (canvas/WebGL aislados aquí).
- `src/components/sections/` secciones; `src/pages/` páginas.
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
