// components/ui/Button.tsx
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  shape?: 'pill' | 'circle'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  shape = 'pill',
  size = 'md',
  className,
  children,
  ...props        // ← everything else: onClick, disabled, type, etc.
}: ButtonProps) {
  return (
    <button
      className={cn(
        // base — always applied
        'inline-flex items-center justify-center font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',

        // variant
        variant === 'primary' && 'bg-accent text-white hover:bg-accent/90',
        variant === 'outline' && 'border border-border text-tx bg-transparent hover:bg-bg2',
        variant === 'ghost'   && 'bg-transparent text-tx2 hover:bg-bg2',
        variant === 'danger'  && 'bg-red-500 text-white hover:bg-red-600',

        // shape
        shape === 'pill'   && 'rounded-full px-5',
        shape === 'circle' && 'rounded-full p-0 aspect-square',

        // size
        size === 'sm' && 'text-sm h-8',
        size === 'md' && 'text-sm h-9',
        size === 'lg' && 'text-base h-11',

        // className last — so caller can override anything
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}