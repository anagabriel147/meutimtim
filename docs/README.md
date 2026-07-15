# TimTim Platform

> **Meu TimTim: O seu caminho para o brinde perfeito.**

A marketplace connecting clients (contratantes), suppliers (fornecedores), and event advisors (assessores) with a built-in escrow split payment system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, tw-animate-css |
| Database | Supabase (PostgreSQL 17) |
| Auth | Supabase Auth (JWT, email/password) |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Exo 2 (brand headings), Playfair Display (serifs), Poppins (body) |

---

## Brand Identity

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Ciano Neon | `#00CFC8` | Primary / CTAs / Buttons / Borders |
| Azul Neon | `#03FFF6` | Gradient highlights / Glow effects |
| Verde Mar | `#009C97` | Medium tone / Gradient end |
| Grafite Escuro | `#111111` | Main background (dark mode) |
| Cinza Escuro | `#2A2A2A` | Card surfaces / Secondary bg |
| Preto Absoluto | `#000000` | Absolute black |

### Typography

| Family | Purpose | Style |
|---|---|---|
| **Exo 2** (900w) | Brand name "TIMTIM", section headings, stats | Geometric sans, futuristic, uppercase |
| **Playfair Display** (700w italic) | Slogan, subtitles, premium copy | Classic elegant serif |
| **Poppins** (300–700w) | Body text, UI labels, navigation | Clean modern sans |

### CSS Utilities

```css
.font-brand          /* Exo 2 + uppercase + tracking */
.font-serif-brand    /* Playfair Display italic */
.glow-cyan           /* box-shadow neon glow */
.glow-text-cyan      /* text-shadow neon */
.gradient-brand      /* cyan→neon→sea gradient text */
.glass               /* frosted glass surface */
.border-neon         /* animated cyan border */
```

---

## Project Structure

```
timtim/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts      # POST — register
│   │   │   └── login/route.ts       # POST — login
│   │   ├── split/
│   │   │   └── simulate/route.ts    # POST — payment split simulation
│   │   ├── proposals/route.ts       # GET/POST proposals
│   │   ├── contracts/
│   │   │   ├── route.ts             # GET/POST contracts
│   │   │   └── release/route.ts     # POST — release escrow
│   │   └── wallet/route.ts          # GET wallet + transactions
│   ├── admin/          # Admin dashboard
│   ├── assessor/       # Advisor dashboard
│   ├── cadastro/       # Registration flow
│   ├── cliente/        # Client dashboard
│   ├── fornecedor/     # Supplier dashboard
│   └── home/           # Public landing page
├── components/
│   ├── admin/          # Admin UI
│   ├── assessor/       # Advisor UI
│   ├── auth/           # Login form (Supabase wired)
│   ├── avaliacoes/     # Review UI
│   ├── cadastro/       # Registration UI
│   ├── cliente/        # Client dashboard UI
│   ├── contratos/      # Contracts UI
│   ├── disputas/       # Dispute UI
│   ├── eventos/        # Event detail UI
│   ├── fornecedor/     # Supplier dashboard UI
│   ├── fornecedores/   # Marketplace explore UI
│   ├── home/           # Landing page sections
│   ├── mensagens/      # Chat UI
│   └── ui/             # Base UI components
├── docs/
│   ├── BUSINESS_ARCHITECTURE.md
│   ├── SECURITY_COMPLIANCE.md
│   └── README.md (this file)
└── lib/
    ├── supabase.ts      # Singleton Supabase client
    └── utils.ts         # cn() utility
```

---

## Database Schema

Tables (all with RLS enabled):

| Table | Description |
|---|---|
| `profiles` | User profile, role, subscription |
| `suppliers` (alias: `vendor_profiles`) | Extended vendor profile |
| `events` | Client events |
| `proposals` | Vendor bids |
| `contracts` | Binding service agreements + escrow |
| `wallets` | Balance ledger |
| `wallet_transactions` | Financial history |
| `disputes` | Arbitration cases |
| `messages` | Platform chat |
| `reviews` | Vendor ratings |
| `referrals` | Advisor affiliate tracking |
| `advisor_client_events` | Advisor ↔ event management |

---

## API Routes

### Authentication

```bash
# Register
POST /api/auth/signup
{ "email", "password", "name", "role", "phone"?, "city"? }

# Login
POST /api/auth/login
{ "email", "password" }
→ returns session token + role-based redirect
```

### Payment Split Simulation

```bash
# Simulate escrow split
POST /api/split/simulate
Authorization: Bearer <token>
{ "contract_amount": 1000, "payment_method": "pix", "installments": 1 }

# Fee schedule
GET /api/split/simulate
```

### Contracts

```bash
# Create contract
POST /api/contracts
Authorization: Bearer <token>
{ "event_id", "vendor_id", "total_amount", "proposal_id"? }

# Release escrow (client confirms service)
POST /api/contracts/release
Authorization: Bearer <token>
{ "contract_id" }
```

---

## Running Locally

The dev server starts automatically in this environment. To run manually:

```bash
npm run dev     # Development server (port 3000)
npm run build   # Production build
npm run lint    # ESLint
```

Environment variables are pre-configured in `.env`.

---

## Mock Credentials (Development)

The system now uses **live Supabase auth**. Create accounts via `/cadastro` or the API:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@timtim.com.br","password":"senha123","name":"Teste","role":"client"}'
```

---

## Documentation

- [Business Architecture](./BUSINESS_ARCHITECTURE.md) — flows, payment split, database schema
- [Security & Compliance](./SECURITY_COMPLIANCE.md) — OWASP, LGPD, RLS policies
