import { cn } from '@/lib/utils'

export function TimTimLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="TimTim"
    >
      <span
        aria-hidden="true"
        className="text-xl leading-none select-none"
        style={{ filter: 'drop-shadow(0 0 5px rgba(0,207,200,0.75))' }}
      >
        🥂
      </span>
      <span
        className="text-xl select-none leading-none"
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
