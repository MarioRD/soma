// Prerender multipágina: genera un HTML estático por ruta (dist/<ruta>/index.html) con su <head>
// propio (título, descripción, canonical, Open Graph, JSON-LD), más 404.html, sitemap.xml,
// robots.txt y llms.txt. Buscadores y agentes leen todo sin ejecutar JavaScript.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = resolve('dist')
const ssr = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const { render, ROUTES, NOT_FOUND, SITE, SERVICIOS, KIND_LABEL, PSICOLOGA, DIRECCION } = ssr

const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/')
// Rutas a /llms.txt y similares respetando la base del sitio
const withBase = (html) => html.replace('href="/llms.txt"', `href="${BASE}llms.txt"`)

function page(route) {
  const { html, head } = render(route)
  const out = template
    .replace(/<!--head:start-->[\s\S]*?<!--head:end-->/, head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (out === template) throw new Error('Plantilla sin marcadores en dist/index.html')
  return withBase(out)
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}

for (const route of ROUTES) {
  await write(resolve(dist, `.${route.path}index.html`), page(route))
}
await write(resolve(dist, '404.html'), page(NOT_FOUND))

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.filter((r) => !r.noindex)
  .map((r) => `  <url><loc>${SITE.url}${r.path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`
await write(resolve(dist, 'sitemap.xml'), sitemap)

await write(
  resolve(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# Agentes de IA: bienvenidos. Resumen del sitio en /llms.txt\nSitemap: ${SITE.url}/sitemap.xml\n`,
)

const grupos = ['area', 'publico', 'enfoque', 'modalidad', 'empresa']
const llms = `# Soma Psicología

> Consultorio de psicología de la ${PSICOLOGA.completo} (cédula profesional ${PSICOLOGA.cedula}, maestra en Psicoterapia Ericksoniana). Psicoterapia clínica, hipnosis ericksoniana y constelaciones familiares para niñas y niños, adolescentes, adultos, parejas y familias. Presencial en ${DIRECCION}, y en línea por videollamada.

- Agendar: WhatsApp ${SITE.telefono} (https://wa.me/${SITE.whatsapp}) o ${SITE.url}/agendar/
- Sobre la psicóloga: ${SITE.url}/mtra-lidia-dorantes/
- Preguntas frecuentes: ${SITE.url}/preguntas/

${grupos
  .map(
    (k) =>
      `## ${KIND_LABEL[k]}\n${SERVICIOS.filter((s) => s.kind === k)
        .map((s) => `- [${s.nombre}](${SITE.url}/${s.slug}/): ${s.lead}`)
        .join('\n')}`,
  )
  .join('\n\n')}
`
await write(resolve(dist, 'llms.txt'), llms)

await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender ok: ${ROUTES.length} páginas + 404, sitemap, robots, llms.txt (${SITE.url})`)
