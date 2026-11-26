// Prerender: inyecta el HTML de la app en dist/index.html para que buscadores y agentes
// lean todo el contenido sin ejecutar JavaScript.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const html = template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
if (html === template) throw new Error('No se encontró <div id="root"></div> en dist/index.html')
await writeFile(resolve(dist, 'index.html'), html)
await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerender ok')
