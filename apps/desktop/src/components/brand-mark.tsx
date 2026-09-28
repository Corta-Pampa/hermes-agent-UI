import { CortaMark } from '@/brand/logo'
import { cn } from '@/lib/utils'

// Brand badge for hero moments (install, updates, onboarding, about). Corta:
// the "■C" mark on its own light plate, identical in light and dark (see
// src/brand/logo.tsx). Size the square box via className (default size-14);
// the mark is contained inside it.
export function BrandMark({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('inline-flex size-14 shrink-0 items-center justify-center', className)} {...props}>
      <CortaMark className="h-auto w-full" />
    </span>
  )
}
