'use client'

import { Circle as CircleHelp, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CtaSection({
  onCreateEvent,
  onExplore,
}: {
  onCreateEvent: () => void
  onExplore: () => void
}) {
  return (
    <section id="categorias" className="px-6 py-16 md:py-20">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl px-6 py-14 text-center md:py-16"
        style={{
          background: 'linear-gradient(135deg, rgba(0,207,200,0.12) 0%, rgba(0,156,151,0.06) 50%, rgba(24,24,24,0.9) 100%)',
          border: '1px solid rgba(0,207,200,0.25)',
          boxShadow: '0 0 80px rgba(0,207,200,0.1), inset 0 1px 0 rgba(0,207,200,0.15)',
        }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#00CFC8' }}>
          <Zap className="size-3" />
          COMECE HOJE
        </span>

        <h2
          className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl"
          style={{ fontFamily: 'var(--font-exo2), sans-serif', fontWeight: 900 }}
        >
          O seu evento perfeito começa{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00CFC8 0%, #03FFF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            aqui
          </span>
        </h2>

        <p
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
          style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
        >
          Meu TimTim: O seu caminho para o brinde perfeito.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={onCreateEvent}
            className="h-12 px-6 text-sm font-semibold"
            style={{ boxShadow: '0 0 20px rgba(0,207,200,0.4)' }}
          >
            Criar Evento Grátis
          </Button>
          <Button variant="outline" onClick={onExplore} className="h-12 border-primary/40 px-6 text-sm text-primary hover:bg-primary/10">
            Explorar Fornecedores
          </Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CircleHelp className="size-3.5" />
          Sem cartão de crédito. 100% gratuito para clientes.
        </p>
      </div>
    </section>
  )
}
