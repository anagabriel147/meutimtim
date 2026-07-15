# SECURITY & COMPLIANCE — TimTim Platform

> LGPD compliant. OWASP Top 10 hardened. Financial fraud prevention.

---

## 1. Authentication & Session Security

### 1.1 Supabase Auth (JWT)
- All sessions use **signed JWTs** issued by Supabase Auth
- Tokens expire every **1 hour** (auto-refreshed client-side)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose — it cannot bypass RLS
- `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed to the client

### 1.2 Password Policy
- Minimum 8 characters (enforced at API and UI level)
- Passwords hashed by Supabase using **bcrypt** (server-side, never stored in plain text)
- No password visible in logs or responses

### 1.3 Session Handling
- Sessions stored in Supabase Auth — not in `localStorage`
- `onAuthStateChange` uses async wrapper to prevent deadlocks

---

## 2. Authorization — Row Level Security (RLS)

Every table has RLS enabled. No table is accessible without a matching policy.

### Policy Design Principles
- **Owner-scoped by default**: users access only rows they own
- **Role-aware**: suppliers can read all published listings; clients cannot read other clients' events
- **No `USING (true)` shortcut** on authenticated data — all ownership checks are explicit
- **Contracts are immutable**: DELETE policy blocks all deletions

### RLS Policy Map

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` |
| suppliers | any authenticated | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` |
| events | `owner = uid` | `true` (DEFAULT uid) | `owner = uid` | `owner = uid` |
| proposals | `sender or event_owner` | `uid = vendor_id` | `uid = vendor_id` | `uid = vendor_id` |
| contracts | `client or vendor` | `uid = client_id` | `client or vendor` | BLOCKED |
| wallets | `owner = uid` | `true` (DEFAULT) | `owner = uid` | BLOCKED |
| disputes | `parties` | `uid = opened_by` | `uid = opened_by` | BLOCKED |
| messages | `sender or recipient` | `uid = sender_id` | `parties` | `uid = sender_id` |
| reviews | `published OR author` | `uid = reviewer_id` | `uid = reviewer_id` | `uid = reviewer_id` |
| referrals | `uid = advisor_id` | `uid = advisor_id` | `uid = advisor_id` | `uid = advisor_id` |

---

## 3. OWASP Top 10 Controls

### A01 — Broken Access Control
- All data access gated by RLS at the database level
- API routes validate JWT bearer token before any query
- Role column in `profiles` cannot be self-elevated (no UPDATE policy that sets `role`)

### A02 — Cryptographic Failures
- HTTPS enforced on all endpoints (Supabase + Vercel/Next.js)
- Passwords hashed with bcrypt (Supabase Auth)
- JWTs signed with RS256

### A03 — Injection
- All database queries use Supabase SDK parameterized queries — no raw string concatenation
- User inputs validated before insertion (type checks, length limits, enum constraints)
- No `eval()` or dynamic code execution

### A04 — Insecure Design
- Financial flows go through the escrow simulation API, not directly to the database
- Contracts cannot be deleted (RLS DELETE = false)
- Wallet balance only modified through platform-controlled transactions

### A05 — Security Misconfiguration
- `SUPABASE_SERVICE_ROLE_KEY` never in `NEXT_PUBLIC_*` variables
- TypeScript `ignoreBuildErrors: true` is a build-time config only
- No default credentials in production (mock credentials are UI-only)

### A06 — Vulnerable Components
- Dependencies pinned in `pnpm-lock.yaml`
- `pnpm audit` runs in CI
- `hono` overridden to patched version `4.12.25`

### A07 — Identification & Authentication Failures
- Password minimum length enforced server-side
- No weak credentials accepted
- Rate limiting provided by Supabase Auth (built-in)

### A08 — Software & Data Integrity
- No untrusted CDN imports — all packages from npm registry
- Database migrations use `IF NOT EXISTS` guards (idempotent)
- Financial amounts validated `> 0` at DB constraint level

### A09 — Security Logging & Monitoring
- Supabase provides audit logs for auth events
- All API errors return generic messages (no stack traces to client)
- `contract_id` and `user_id` logged on payment simulation

### A10 — Server-Side Request Forgery (SSRF)
- No user-controlled URL fetching in server routes
- Payment gateway calls are internal simulation only

---

## 4. Financial Fraud Prevention

### 4.1 Escrow Controls
- Client funds held in escrow until explicit release confirmation
- Escrow release requires authenticated client JWT + contract ownership
- Contract `status` transitions are one-directional: `active → completed | disputed`

### 4.2 Amount Validation
- `contract_amount > 0` enforced at DB level
- `platform_fee_pct` bounded `0–100%`
- `split_installments` bounded `1–12`
- `wallet.balance >= 0` enforced at DB level

### 4.3 Dispute Protection
- Disputes freeze escrow (status → `disputed`)
- Only admin can mark dispute `resolved` (server-side)
- Full audit trail in `wallet_transactions`

### 4.4 Referral Fraud Prevention
- `referral_code` is `UNIQUE` — cannot be reused
- Self-referral blocked by `advisor_id ≠ referred_user_id` application logic
- Commission only released by admin after `status = converted`

---

## 5. LGPD Compliance (Brazilian GDPR)

### 5.1 Data Minimization
- Only collect: name, email, phone, city (optional), role
- No unnecessary PII stored
- `avatar_url` points to user-uploaded asset, not 3rd-party scraped

### 5.2 Consent
- `lgpd_accepted_at` column in `profiles` records consent timestamp
- Users must accept terms before account creation

### 5.3 Right to Erasure
- `profiles ON DELETE CASCADE` — deleting auth.users cascades all user data
- Financial records (`contracts`, `wallet_transactions`) retained for legal/audit purposes (contracts table DELETE blocked)

### 5.4 Data Portability
- Users can export their data via the profile settings panel
- All data in standard JSON format via Supabase client

### 5.5 Data Residency
- Supabase project hosted in **sa-east-1 (São Paulo)** — Brazilian jurisdiction

---

## 6. Environment Variables

| Variable | Exposure | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Safe anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS — NEVER expose |
| `SUPABASE_DB_URL` | **Server only** | Direct DB connection — NEVER expose |

---

## 7. Security Checklist

- [x] RLS enabled on all tables
- [x] JWT validation on all protected API routes
- [x] Password hashing (bcrypt via Supabase)
- [x] No raw SQL / no injection vectors
- [x] No service role key in client bundle
- [x] Escrow cannot be released without client confirmation
- [x] Contracts are immutable (no DELETE)
- [x] LGPD consent timestamp recorded
- [x] Financial amounts validated at DB constraint level
- [x] HTTPS enforced (Supabase + deployment platform)
