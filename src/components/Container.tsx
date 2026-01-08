import { cn } from '@/lib/utils'

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 w-full items-center justify-center', className)}
      {...props}
    />
  )
}
