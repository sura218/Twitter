// components/ui/Avatar.tsx
'use client'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')           // "sarah dev" → ["sarah", "dev"]
    .map(w => w[0])       // → ["s", "d"]
    .join('')             // → "sd"
    .toUpperCase()        // → "SD"
    .slice(0, 2)          // → "SD" (max 2 chars)
}

function getColor(name: string) {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-red-500',
  ]
  // same name always gets same color
  return colors[name.charCodeAt(0) % colors.length]
}

export function Avatar({ name, src, size = 'md', className, onClick }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError

  return (
    <div
      onClick={onClick}
      className={cn(
        // base
        'rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold',

        // size
        size === 'xs' && 'w-6 h-6 text-xs',
        size === 'sm' && 'w-8 h-8 text-xs',
        size === 'md' && 'w-10 h-10 text-sm',
        size === 'lg' && 'w-14 h-14 text-lg',
        size === 'xl' && 'w-20 h-20 text-2xl',

        // fallback bg color — only when no image
        !showImage && getColor(name),

        // clickable
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity',

        // override from outside
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}