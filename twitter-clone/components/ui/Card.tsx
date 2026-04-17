// components/ui/Card.tsx
import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ghost' | 'colored'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        // base
        'rounded-2xl transition-colors',

        // variant
        variant === 'default' && 'bg-bg border border-border',
        variant === 'ghost'   && 'bg-transparent',
        variant === 'colored' && 'bg-bg2',

        // padding
        padding === 'none' && 'p-0',
        padding === 'sm'   && 'p-3',
        padding === 'md'   && 'p-4',
        padding === 'lg'   && 'p-6',

        // hoverable
        hoverable && 'cursor-pointer hover:bg-bg2',

        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}