'use client'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = String(props.value ?? '').length > 0
  const isFloated = focused || hasValue

  return (
    <div className="w-full">
      <div className={cn(
        'relative border rounded transition-colors',
        focused ? 'border-accent' : 'border-[#333]',
        error && 'border-red-500',
      )}>
        {/* floating label */}
        <label className={cn(
          'absolute left-3 transition-all duration-150 pointer-events-none text-[#71767b]',
          isFloated ? 'top-2 text-xs text-accent' : 'top-1/2 -translate-y-1/2 text-base',
          error && 'text-red-500'
        )}>
          {label}
        </label>

        {/* input */}
        <input
          className={cn(
            'w-full bg-transparent text-white text-lg outline-none px-3 pb-2 pt-6',
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>

      {/* error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1 px-1">{error}</p>
      )}
    </div>
  )
}