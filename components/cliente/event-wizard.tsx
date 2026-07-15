'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Briefcase,
  Cake,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock,
  Disc3,
  Flower2,
  Gem,
  GraduationCap,
  Handshake,
  Heart,
  Map,
  Martini,
  Music4,
  PartyPopper,
  Presentation,
  Save,
  Search,
  Sparkles,
  SquarePen,
  Utensils,
  Wine,
} from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  COUNTRIES,
  DISTRICTS,
  EVENT_TYPES,
  SERVICE_CATEGORIES,
  VENUE_STATUSES,
  WIZARD_STEPS,
} from './wizard-data'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  gem: Gem,
  heart: Heart,
  cake: Cake,
  baby: Baby,
  briefcase: Briefcase,
  'party-popper': PartyPopper,
  'graduation-cap': GraduationCap,
  presentation: Presentation,
  wine: Wine,
  sparkles: Sparkles,
  martini: Martini,
  utensils: Utensils,
  disc: Disc3,
  flower: Flower2,
  camera: Camera,
  music: Music4,
  check: Check,
  handshake: Handshake,
  search: Search,
}

export function EventWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)

  // Step 1 — O Grande Dia
  const [eventType, setEventType] = useState('casamento')
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(100)
  const [notes, setNotes] = useState('')

  // Step 2 — Localização
  const [country, setCountry] = useState('Portugal')
  const [district, setDistrict] = useState('Lisboa')
  const [city, setCity] = useState('Lisboa')
  const [venueName, setVenueName] = useState('')
  const [address, setAddress] = useState('')
  const [venueStatus, setVenueStatus] = useState('confirmado')

  // Step 3 — Serviços
  const [services, setServices] = useState<string[]>([])
  const [observations, setObservations] = useState('')

  const eventLabel = EVENT_TYPES.find((t) => t.id === eventType)?.label ?? 'Casamento'
  const displayName = name.trim() || `${eventLabel} da Ana & Pedro`
  const locationLabel = `${city || district}, ${country}`

  function toggleService(id: string) {
    setServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  function cancel() {
    router.push('/cliente')
  }

  if (published) {
    return <PublishedScreen displayName={displayName} onBack={() => router.push('/cliente')} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <WizardHeader currentStep={step} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {step === 1 && (
          <StepOne
            eventType={eventType}
            setEventType={setEventType}
            name={name}
            setName={setName}
            date={date}
            setDate={setDate}
            guests={guests}
            setGuests={setGuests}
            notes={notes}
            setNotes={setNotes}
            onCancel={cancel}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTwo
            eventName={displayName}
            country={country}
            setCountry={setCountry}
            district={district}
            setDistrict={setDistrict}
            city={city}
            setCity={setCity}
            venueName={venueName}
            setVenueName={setVenueName}
            address={address}
            setAddress={setAddress}
            venueStatus={venueStatus}
            setVenueStatus={setVenueStatus}
            onBack={() => setStep(1)}
            onCancel={cancel}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepThree
            eventName={displayName}
            location={locationLabel}
            eventLabel={eventLabel}
            services={services}
            toggleService={toggleService}
            observations={observations}
            setObservations={setObservations}
            onCancel={cancel}
            onPublish={() => setPublished(true)}
          />
        )}
      </main>

      <WizardFooter />
    </div>
  )
}

/* ---------------- Header with step progress ---------------- */
function WizardHeader({ currentStep }: { currentStep: number }) {
  return (
    <header className="sticky top-0 z-40 w-full border-t-2 border-primary/70 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <BrandMark size="md" />

        <ol className="hidden items-center gap-3 md:flex" aria-label="Progresso">
          {WIZARD_STEPS.map((s, i) => {
            const done = currentStep > s.id
            const active = currentStep === s.id
            return (
              <li key={s.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid size-7 place-items-center rounded-full text-xs font-semibold transition-colors',
                      done && 'bg-primary text-primary-foreground',
                      active && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                      !done && !active && 'border border-border bg-secondary/40 text-muted-foreground',
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} /> : s.id}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      active ? 'font-medium text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <span
                    className={cn(
                      'h-0.5 w-12 rounded-full',
                      currentStep > s.id ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Save className="size-3.5" />
            <span className="hidden sm:inline">Guardar rascunho</span>
          </button>
          <span className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground">
            <CircleHelp className="size-4" />
          </span>
        </div>
      </div>
    </header>
  )
}

function WizardFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <span>© 2025 — Todos os direitos reservados</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacidade
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Termos
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Suporte
          </a>
        </nav>
      </div>
    </footer>
  )
}

/* ---------------- Shared field helpers ---------------- */
function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
      {children}
      {required && <span className="text-primary">*</span>}
      {optional && (
        <span className="rounded border border-border px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wide text-muted-foreground">
          Opcional
        </span>
      )}
    </label>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-input bg-background/40 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20'

/* ---------------- Step 1 ---------------- */
function StepOne(props: {
  eventType: string
  setEventType: (v: string) => void
  name: string
  setName: (v: string) => void
  date: string
  setDate: (v: string) => void
  guests: number
  setGuests: (v: number) => void
  notes: string
  setNotes: (v: string) => void
  onCancel: () => void
  onNext: () => void
}) {
  return (
    <>
      <div className="mb-6">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary">
          <Sparkles className="size-3.5" />
          NOVO EVENTO
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground text-balance">
          Criar o seu <span className="text-primary">Grande Dia</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha os detalhes abaixo para começar a receber propostas dos melhores fornecedores.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/40">
        {/* card step header */}
        <div className="border-b border-border/60 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="text-xs font-semibold tracking-widest text-primary">PASSO 1 DE 3</p>
                <p className="font-display text-lg font-semibold text-foreground">O Grande Dia</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              ~2 min para completar
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 border-b border-border/60 text-center text-sm">
            {['O Grande Dia', 'Detalhes', 'Confirmação'].map((tab, i) => (
              <span
                key={tab}
                className={cn(
                  'pb-3',
                  i === 0
                    ? 'border-b-2 border-primary font-medium text-primary'
                    : 'text-muted-foreground',
                )}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {/* Tipo de evento */}
          <div>
            <FieldLabel required>Tipo de Evento</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecione a categoria que melhor descreve o seu evento.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {EVENT_TYPES.map((type) => {
                const Icon = ICONS[type.icon] ?? Sparkles
                const active = props.eventType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => props.setEventType(type.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                    <span className={cn(active && 'text-foreground')}>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* Nome do evento */}
          <div>
            <FieldLabel required>Nome do Evento</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Um nome descritivo para identificar o seu evento.
            </p>
            <input
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
              placeholder="Ex: Casamento de Ana & Pedro"
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          {/* Data + convidados */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel required>Data do Evento</FieldLabel>
              <p className="mt-1 text-xs text-muted-foreground">Quando está previsto o evento?</p>
              <input
                type="date"
                value={props.date}
                onChange={(e) => props.setDate(e.target.value)}
                className={cn(inputClass, 'mt-3 [color-scheme:dark]')}
              />
            </div>
            <div>
              <FieldLabel required>Número Estimado de Convidados</FieldLabel>
              <p className="mt-1 text-xs text-muted-foreground">
                Uma estimativa é suficiente por agora.
              </p>
              <div className="relative mt-3">
                <input
                  type="number"
                  min={1}
                  value={props.guests}
                  onChange={(e) => props.setGuests(Number(e.target.value))}
                  className={cn(inputClass, 'pr-12')}
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col">
                  <button
                    type="button"
                    aria-label="Aumentar convidados"
                    onClick={() => props.setGuests(props.guests + 10)}
                    className="grid size-5 place-items-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Diminuir convidados"
                    onClick={() => props.setGuests(Math.max(1, props.guests - 10))}
                    className="grid size-5 place-items-center rounded text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <FieldLabel optional>Notas Adicionais</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Partilhe detalhes especiais ou requisitos específicos.
            </p>
            <textarea
              value={props.notes}
              onChange={(e) => props.setNotes(e.target.value)}
              rows={4}
              placeholder="Ex: Precisamos de um espaço ao ar livre com capacidade para dança..."
              className="mt-3 w-full resize-none rounded-xl border border-input bg-background/40 p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 p-6 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="size-3.5" />
            O rascunho é guardado automaticamente
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={props.onCancel}
              className="h-11 border border-border px-6 text-sm"
            >
              Cancelar
            </Button>
            <Button onClick={props.onNext} className="h-11 gap-2 px-6 text-sm font-semibold">
              Próximo Passo
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------- Step 2 ---------------- */
function StepTwo(props: {
  eventName: string
  country: string
  setCountry: (v: string) => void
  district: string
  setDistrict: (v: string) => void
  city: string
  setCity: (v: string) => void
  venueName: string
  setVenueName: (v: string) => void
  address: string
  setAddress: (v: string) => void
  venueStatus: string
  setVenueStatus: (v: string) => void
  onBack: () => void
  onCancel: () => void
  onNext: () => void
}) {
  const selectClass = cn(inputClass, 'appearance-none pr-10')
  return (
    <div className="rounded-3xl border border-border bg-card/40">
      <div className="h-1 rounded-t-3xl bg-primary" />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            PASSO 2 DE 3
          </span>
          <span className="text-sm text-muted-foreground">{props.eventName}</span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Onde será o<br />
          <span className="text-primary">seu evento?</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Defina a localização para que os fornecedores possam calcular deslocações e
          disponibilidade com precisão.
        </p>

        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel>PAÍS</FieldLabel>
              <div className="relative mt-3">
                <select
                  value={props.country}
                  onChange={(e) => props.setCountry(e.target.value)}
                  className={selectClass}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <FieldLabel>DISTRITO / REGIÃO</FieldLabel>
              <div className="relative mt-3">
                <Map className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={props.district}
                  onChange={(e) => props.setDistrict(e.target.value)}
                  className={cn(selectClass, 'pl-11')}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>CIDADE / LOCALIDADE</FieldLabel>
            <input
              value={props.city}
              onChange={(e) => props.setCity(e.target.value)}
              placeholder="Ex: Lisboa"
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <FieldLabel>NOME DO LOCAL / ESPAÇO</FieldLabel>
              <span className="text-xs text-muted-foreground">{props.venueName.length} / 80</span>
            </div>
            <input
              value={props.venueName}
              maxLength={80}
              onChange={(e) => props.setVenueName(e.target.value)}
              placeholder="Ex: Quinta da Regaleira, Hotel Bairro Alto..."
              className={cn(inputClass, 'mt-3')}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Opcional se o espaço ainda não estiver confirmado.
            </p>
          </div>

          <div>
            <FieldLabel>MORADA / ENDEREÇO</FieldLabel>
            <input
              value={props.address}
              onChange={(e) => props.setAddress(e.target.value)}
              placeholder="Rua, número, código postal..."
              className={cn(inputClass, 'mt-3')}
            />
          </div>

          <div className="h-px bg-border/60" />

          <div>
            <FieldLabel>ESTADO DO LOCAL</FieldLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Indique se já tem um espaço confirmado ou se ainda está à procura.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {VENUE_STATUSES.map((status) => {
                const Icon = ICONS[status.icon] ?? Check
                const active = props.venueStatus === status.id
                const accentText =
                  status.accent === 'amber'
                    ? 'text-amber-400'
                    : status.accent === 'muted'
                      ? 'text-muted-foreground'
                      : 'text-primary'
                const accentBg =
                  status.accent === 'amber'
                    ? 'bg-amber-500/10'
                    : status.accent === 'muted'
                      ? 'bg-secondary/60'
                      : 'bg-primary/15'
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => props.setVenueStatus(status.id)}
                    className={cn(
                      'relative rounded-2xl border p-4 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background/40 hover:border-primary/40',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute right-3 top-3 grid size-5 place-items-center rounded-full border',
                        active ? 'border-primary' : 'border-border',
                      )}
                    >
                      {active && <span className="size-2.5 rounded-full bg-primary" />}
                    </span>
                    <span className={cn('grid size-9 place-items-center rounded-lg', accentBg, accentText)}>
                      <Icon className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-foreground">{status.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{status.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-6">
        <Button
          variant="ghost"
          onClick={props.onBack}
          className="h-11 gap-2 border border-border px-6 text-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={props.onCancel}
            className="h-11 border border-border px-6 text-sm"
          >
            Cancelar
          </Button>
          <Button onClick={props.onNext} className="h-11 gap-2 px-6 text-sm font-semibold">
            Avançar
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Step 3 ---------------- */
function StepThree(props: {
  eventName: string
  location: string
  eventLabel: string
  services: string[]
  toggleService: (id: string) => void
  observations: string
  setObservations: (v: string) => void
  onCancel: () => void
  onPublish: () => void
}) {
  const count = props.services.length
  const total = SERVICE_CATEGORIES.length
  const selectedLabels = SERVICE_CATEGORIES.filter((s) => props.services.includes(s.id)).map(
    (s) => s.label,
  )

  return (
    <div className="rounded-3xl border border-border bg-card/40">
      <div className="h-1 rounded-t-3xl bg-primary" />
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            PASSO 3 DE 3 — O QUE PROCURA?
          </span>
          <span className="text-sm text-muted-foreground">
            {props.eventName} · {props.location}
          </span>
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Selecione os serviços
          <br />
          <span className="text-primary">que deseja contratar</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Escolha todas as categorias relevantes para o seu evento. Os fornecedores
          correspondentes receberão o seu pedido de proposta.
        </p>

        {/* counter */}
        <div className="mt-6 flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            Categorias seleccionadas
            <span
              className={cn(
                'grid size-6 place-items-center rounded-full text-xs font-semibold',
                count > 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
              )}
            >
              {count}
            </span>
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {count} / {total}
          </span>
        </div>

        {/* categories */}
        <p className="mt-8 text-xs font-semibold tracking-widest text-muted-foreground">
          CATEGORIAS DE SERVIÇO
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Sparkles
            const active = props.services.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => props.toggleService(cat.id)}
                className={cn(
                  'relative rounded-2xl border p-5 text-center transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background/40 hover:border-primary/40',
                )}
              >
                <span
                  className={cn(
                    'absolute right-3 top-3 grid size-5 place-items-center rounded-full border transition-colors',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {active && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span
                  className={cn(
                    'mx-auto grid size-12 place-items-center rounded-xl transition-colors',
                    active ? 'bg-primary/15 text-primary' : 'bg-secondary/60 text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{cat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>
              </button>
            )
          })}
        </div>

        {/* observations */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">
            OBSERVAÇÕES & RESTRIÇÕES
          </p>
          <span className="text-xs text-muted-foreground">{props.observations.length} / 500</span>
        </div>
        <div className="relative mt-3">
          <SquarePen className="absolute left-4 top-4 size-4 text-muted-foreground" />
          <textarea
            value={props.observations}
            maxLength={500}
            onChange={(e) => props.setObservations(e.target.value)}
            rows={4}
            placeholder="Ex: Precisamos de espaço para 250 convidados, restrições alimentares (vegetariano, sem glúten), cerimónia ao ar livre com chuva de pétala, acesso para cadeira de rodas..."
            className="w-full resize-none rounded-xl border border-input bg-background/40 py-4 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Quanto mais detalhe fornecer, mais precisas serão as propostas dos fornecedores.
        </p>

        {/* summary */}
        <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CircleHelp className="size-4 text-primary" />
            Resumo do pedido
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                EVENTO
              </p>
              <p className="mt-1 text-sm text-foreground">{props.eventLabel}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                LOCAL
              </p>
              <p className="mt-1 text-sm text-foreground">{props.location}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold tracking-widest text-muted-foreground">
                CATEGORIAS
              </p>
              <p className="mt-1 text-sm text-foreground">
                {selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Nenhuma ainda'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-6">
        <Button
          variant="ghost"
          onClick={props.onCancel}
          className="h-12 border border-border px-6 text-sm"
        >
          Cancelar
        </Button>
        <div className="flex items-center gap-4">
          {count === 0 && (
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <CircleHelp className="size-3.5" />
              Selecione pelo menos 1 serviço
            </span>
          )}
          <Button
            onClick={props.onPublish}
            disabled={count === 0}
            className="h-12 gap-2 px-8 text-sm font-semibold"
          >
            Publicar Evento
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Success ---------------- */
function PublishedScreen({ displayName, onBack }: { displayName: string; onBack: () => void }) {
  return (
    <div className="flex min-h-svh flex-col">
      <WizardHeader currentStep={4} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-primary/30 bg-card/40 p-8 text-center md:p-12">
          <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-primary/15 text-primary">
            <CheckCircle2 className="size-10" />
          </span>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-primary">
            <PartyPopper className="size-3.5" />
            EVENTO PUBLICADO
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground text-balance">
            {displayName} está no ar!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground text-pretty">
            O seu pedido foi enviado aos fornecedores correspondentes. Vai começar a receber
            propostas personalizadas em menos de 24 horas.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={onBack} className="h-12 w-full gap-2 px-6 text-sm font-semibold sm:w-auto">
              Ir para o painel
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="h-12 w-full border border-border px-6 text-sm sm:w-auto"
            >
              Ver propostas recebidas
            </Button>
          </div>
        </div>
      </main>
      <WizardFooter />
    </div>
  )
}
