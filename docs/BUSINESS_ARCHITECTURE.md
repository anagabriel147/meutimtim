# BUSINESS ARCHITECTURE — TimTim Platform

> "Meu TimTim: O seu caminho para o brinde perfeito."

---

## 1. Platform Overview

TimTim is a three-sided marketplace connecting:

| Role | Portuguese | Description |
|---|---|---|
| **Client** | Contratante | Creates events, receives proposals, pays |
| **Supplier** | Fornecedor | Offers services, submits proposals, receives payment |
| **Advisor** | Assessor | Manages events on behalf of clients, earns commission |
| **Admin** | Administrador | Platform operator with full oversight |

---

## 2. Core User Flows

### 2.1 Client Flow

```
Register → Create Event → Receive Proposals → Compare & Chat
→ Accept Proposal → Sign Contract → Pay (Escrow held)
→ Confirm Service Delivery → Escrow Released → Leave Review
```

### 2.2 Supplier Flow

```
Register + Subscribe (Pro Plan) → List Business Profile
→ Browse Open Events → Send Proposal → Negotiate via Chat
→ Contract Signed → Deliver Service → Receive Payment (net of fee)
```

### 2.3 Advisor Flow

```
Register + Subscribe (Advisor Plan) → Acquire Clients via Referral Code
→ Create/Manage Events on Client Behalf → Track Commissions
→ Refer Suppliers → Earn Affiliate Commission
```

---

## 3. Payment Architecture — Split Escrow

### 3.1 Flow

```
Client pays gross amount
       │
       ▼
  [Payment Gateway]
  PIX / Card / Boleto
       │
       ▼
  [TimTim Escrow]
  Holds full contract_amount
       │
  Service delivered?
  ┌────┴────┐
  YES      NO (Dispute)
   │           │
   ▼           ▼
 Release    Arbitration
  split         │
   │       [Admin review]
   ├── Platform Fee (10%)   → TimTim revenue
   └── Supplier Net (90%)   → Supplier wallet
```

### 3.2 Fee Structure

| Payment Method | Processing Fee | Notes |
|---|---|---|
| PIX | 0% | Recommended — instant |
| Debit Card | 1.5% | Same-day settlement |
| Credit Card | 2.99% | + installment interest |
| Boleto | 3.5% | 1-3 business day settlement |

**Platform fee: 10% of contract amount** (charged to supplier on release)

### 3.3 Installment Interest Schedule

| Installments | Monthly Interest | Applied On |
|---|---|---|
| 1x | 0% | Gross amount |
| 2-3x | 1.5% | Gross amount |
| 6x | 2.5% | Gross amount |
| 12x | 3.9% | Gross amount |

### 3.4 Split Simulation API

```
POST /api/split/simulate
{
  "contract_amount": 1000,
  "payment_method": "pix",
  "installments": 1,
  "contract_id": "uuid"
}

Response:
{
  "breakdown": {
    "contract_amount": 1000.00,
    "payment_fee": 0.00,
    "gross_amount": 1000.00,
    "platform_fee": 100.00,
    "supplier_net": 900.00,
    "escrow_held": 1000.00
  },
  "gateway": {
    "approved": true,
    "transaction_id": "TT-...",
    "escrow_status": "held"
  }
}
```

---

## 4. Database Schema

### 4.1 Entity Relationships

```
auth.users
  └── profiles (role, subscription)
        ├── suppliers (extended vendor profile)
        ├── events (client's events)
        │     ├── event_services (service slots)
        │     │     └── proposals → contracts
        │     └── advisor_client_events (advisor link)
        ├── wallets
        │     └── wallet_transactions
        ├── contracts
        │     ├── disputes
        │     └── reviews
        ├── messages
        └── referrals (advisor affiliate)
```

### 4.2 Key Tables

| Table | Purpose | RLS Scope |
|---|---|---|
| `profiles` | Universal user profile | owner only |
| `suppliers` | Vendor extended profile | all authenticated can read |
| `events` | Client event records | owner only |
| `proposals` | Supplier bids | sender + event owner |
| `contracts` | Binding agreements | client + supplier |
| `wallets` | Balance ledger | owner only |
| `wallet_transactions` | Financial history | owner only |
| `disputes` | Arbitration cases | parties to contract |
| `messages` | Chat | sender + recipient |
| `reviews` | Vendor ratings | published = public read |
| `referrals` | Advisor affiliate | advisor only |
| `advisor_client_events` | Advisor management | advisor + client |

---

## 5. Subscription Plans

### Supplier Pro — R$79,90/mês (R$798,90/ano)
- Unlimited proposals
- Priority listing
- Analytics dashboard
- Chat with clients

### Advisor Pro — R$149,90/mês (R$1.499,00/ano)
- Manage unlimited client events
- Referral program with commission
- Advanced reporting
- Priority support

---

## 6. Dispute Resolution

1. **Open Dispute** — either party opens via `/api/disputes`
2. **Evidence Phase** — both parties submit evidence (7 days)
3. **Admin Review** — TimTim team reviews (3-5 business days)
4. **Resolution** — full refund / partial refund / re-execution / closed

Escrow remains frozen throughout arbitration.

---

## 7. Match em 1 Clique

The "1-click match" system uses indexed queries on:
- `event_services.category` + `suppliers.category`
- `events.location` + `suppliers.city`
- `suppliers.rating DESC`
- `suppliers.verified_badge = true`

Optimized with composite indexes for sub-100ms response times.

---

## 8. API Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register new user |
| POST | `/api/auth/login` | None | Login + get session |
| POST | `/api/split/simulate` | Bearer | Simulate payment split |
| GET | `/api/split/simulate` | None | Get fee structure |
| GET | `/api/proposals` | Bearer | List proposals |
| POST | `/api/proposals` | Bearer | Create proposal |
| GET | `/api/contracts` | Bearer | List contracts |
| POST | `/api/contracts` | Bearer | Create contract |
| POST | `/api/contracts/release` | Bearer | Release escrow |
| GET | `/api/wallet` | Bearer | Wallet + transactions |
