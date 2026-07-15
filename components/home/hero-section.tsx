'use client'

import { useState } from 'react'
import { ChevronDown, MapPin, Search, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HERO } from './home-data'

export function HeroSection({ onSearch }: { onSearch: () => void }) {
  const [type, setType] = useState(HERO.vendorTypes[0])
  const [location, setLocation] = useState('')

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-16 md:pt-24">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,207,200,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest text-primary uppercase">
          <Sparkles className="size-3" />
          {HERO.badge}
        </span>

        <h1
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground text-balance md:text-6xl"
          style={{ fontFamily: 'var(--font-exo2), sans-serif', fontWeight: 900 }}
        >
          {HERO.titleLead}{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00CFC8 0%, #03FFF6 55%, #009C97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0,207,200,0.4))',
            }}
          >
            {HERO.titleAccent}
          </span>
        </h1>

        <p
          className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-muted-foreground text-pretty"
          style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
        >
          {HERO.subtitle}
        </p>
      </div>

      {/* search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
        className="relative mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card/70 p-3 backdrop-blur-md md:flex-row md:items-center md:rounded-full"
        style={{ boxShadow: '0 0 40px rgba(0,207,200,0.08), inset 0 1px 0 rgba(0,207,200,0.1)' }}
      >
        <div className="relative flex-1">
          <label htmlFor="hero-type" className="sr-only">
            O que procura?
          </label>
          <select
            id="hero-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-transparent bg-secondary/50 px-4 pr-10 text-sm text-foreground outline-none transition-colors focus-visible:border-primary/60 md:rounded-full"
          >
            {HERO.vendorTypes.map((option) => (
              <option key={option} value={option} className="bg-card text-foreground">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <span className="hidden h-8 w-px bg-border md:block" aria-hidden="true" />

        <div className="relative flex-1">
          <label htmlFor="hero-location" className="sr-only">
            Onde?
          </label>
          <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/60" />
          <Input
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade, região..."
            className="border-transparent bg-secondary/50 pl-10 md:rounded-full"
          />
        </div>

        <Button
          type="submit"
          size="icon-lg"
          className="size-12 shrink-0 rounded-xl md:rounded-full"
          style={{ boxShadow: '0 0 16px rgba(0,207,200,0.4)' }}
        >
          <Search className="size-5" />
          <span className="sr-only">Pesquisar</span>
        </Button>
      </form>

      {/* stats */}
      <div className="relative mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
        {HERO.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="text-3xl font-bold"
              style={
                'accent' in stat && stat.accent
                  ? {
                      fontFamily: 'var(--font-exo2), sans-serif',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #00CFC8 0%, #03FFF6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 8px rgba(0,207,200,0.5))',
                    }
                  : { fontFamily: 'var(--font-exo2), sans-serif', fontWeight: 900 }
              }
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
