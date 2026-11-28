import type { Tono } from '@/components/effects/Ilustraciones'

/** Colores de los destellos de cada tarjeta de enfoque. */
export const TONOS: Record<string, Tono[]> = {
  'hipnosis-ericksoniana': [
    { c: '#7a4ff0', x: '-10%', y: '-20%', s: '70%', d: '11s', delay: '0s', dx: '14%', dy: '10%' },
    { c: '#f5b971', x: '55%', y: '5%', s: '45%', d: '8s', delay: '-3s', dx: '-10%', dy: '12%' },
    { c: '#1a7fd1', x: '20%', y: '55%', s: '60%', d: '13s', delay: '-6s', dx: '12%', dy: '-14%' },
  ],
  'constelaciones-familiares': [
    { c: '#10b89c', x: '-15%', y: '10%', s: '65%', d: '12s', delay: '-2s', dx: '16%', dy: '-8%' },
    { c: '#7680e6', x: '50%', y: '-25%', s: '60%', d: '10s', delay: '-5s', dx: '-14%', dy: '14%' },
    { c: '#f5b971', x: '35%', y: '50%', s: '40%', d: '9s', delay: '-1s', dx: '10%', dy: '-10%' },
  ],
  'psicoterapia-clinica': [
    { c: '#1a7fd1', x: '-20%', y: '-10%', s: '65%', d: '10s', delay: '-4s', dx: '14%', dy: '12%' },
    { c: '#f5b971', x: '32%', y: '20%', s: '38%', d: '8s', delay: '-2s', dx: '6%', dy: '-10%' },
    { c: '#b5576a', x: '60%', y: '45%', s: '55%', d: '12s', delay: '-7s', dx: '-12%', dy: '-8%' },
  ],
}
