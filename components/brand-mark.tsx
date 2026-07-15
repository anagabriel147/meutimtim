import { cn } from '@/lib/utils'

const textSize = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }
const iconSize = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }
const gapClass = { sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' }

export function BrandMark({
  className,
  size = 'md',
  showWordmark = true,
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}) {
  const icon = (
    <span
      className={cn(iconSize[size], 'select-none leading-none')}
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 5px rgba(0,207,200,0.75))' }}
    >
      🥂
    </span>
  )

  if (!showWordmark) {
    return (
      <span className={cn('inline-flex items-center', className)} aria-label="TimTim">
        {icon}
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center', gapClass[size], className)}
      aria-label="TimTim — O seu caminho para o brinde perfeito"
    >
      {icon}
      <span
        className={cn(textSize[size], 'select-none leading-none')}
        style={{
          fontFamily: 'var(--font-exo2), sans-serif',
          fontWeight: 900,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #00CFC8 0%, #03FFF6 55%, #009C97 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 6px rgba(0,207,200,0.45))',
        }}
      >
        TIMTIM
      </span>
    </span>
  )
}
