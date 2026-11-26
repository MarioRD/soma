import type { ComponentProps } from 'react'
import { buttonClass, type Variant } from '@/lib/ui'

export function ButtonLink({ variant = 'primary', className = '', ...props }: ComponentProps<'a'> & { variant?: Variant }) {
  return <a className={buttonClass(variant, className)} {...props} />
}
