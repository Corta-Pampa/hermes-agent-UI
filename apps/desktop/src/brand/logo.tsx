import { cn } from '@/lib/utils'

import logoUrl from './assets/corta-logo.svg'
import markUrl from './assets/corta-mark.svg'

import { BRAND } from '.'

// The official artwork carries its own light plate, the way corta.fr shows it
// on both light and dark pages. On dark surfaces the site swaps in a duller,
// silvered plate; dimming the same art is the flat equivalent, so a white
// plate never glares out of a dark window. Size through className (height;
// width follows the aspect ratio).
const ART = 'w-auto select-none dark:brightness-[0.82]'

/** The full "■Corta" logo. */
export function CortaLogo({ className, ...props }: React.ComponentProps<'img'>) {
  return (
    <img alt={BRAND.productName} className={cn('h-8', ART, className)} draggable={false} src={logoUrl} {...props} />
  )
}

/** The compact "■C" mark, for small brand moments. */
export function CortaMark({ className, ...props }: React.ComponentProps<'img'>) {
  return <img alt="" className={cn('h-6', ART, className)} draggable={false} src={markUrl} {...props} />
}
