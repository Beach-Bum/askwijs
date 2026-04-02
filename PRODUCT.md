# askwijs — Product Specification

## Vision

askwijs is a **financial OS for Dutch ZZP'ers and expats** — not a chat app.

The AI agent (Wijs) sits on top of real connected bank data and operates autonomously:
auto-categorizing transactions, calculating live tax positions, and filing returns on your behalf.
The dashboard gives you a secure, complete view of your financial picture at all times.

---

## Core Pillars

### 1. 🏦 Connect — Open Banking (PSD2)
- Connect Dutch bank accounts automatically: ING, ABN AMRO, Rabobank, SNS, Bunq, Revolut NL
- Uses **Nordigen/GoCardless** or **Tink** (Visa) as the PSD2 aggregator
- Real-time transaction sync — new payments appear within minutes
- Users see a live, accurate financial picture — not estimates
- Bank-level security messaging front and centre

### 2. 🔄 Categorize — Auto Transaction Engine
- Every transaction automatically tagged: business / personal
- Sub-categories: travel, equipment, software, office, meals, subcontractors
- BTW (VAT) rate auto-detected per transaction (21%, 9%, 0%, exempt)
- Mixed-use rules applied automatically (e.g. phone: 70% business)
- One-click correction if Wijs gets it wrong — learns from corrections
- Receipt/invoice matching: upload a PDF, Wijs matches it to a transaction

### 3. 📊 Dashboard — Financial Command Centre
- **Netto income** — what you actually keep, live
- **BTW position** — what you owe or will reclaim this quarter
- **Income tax forecast** — projected annual tax bill based on YTD data
- **Deductions found** — zelfstandigenaftrek, startersaftrek, home office, equipment
- **Deadline tracker** — next BTW aangifte, income tax, KOR applications
- **Cash flow** — 30/60/90 day view based on actual transactions
- Everything in English with Dutch tax terms explained inline

### 4. 🤖 Wijs Agent — Autonomous Tax Operations

Wijs is not a chatbot. Wijs is an agent that acts:

**Automatic actions (no confirmation needed):**
- Categorizes new transactions as they arrive
- Updates BTW position in real time
- Flags mixed-use items for review
- Sends deadline reminders 2 weeks + 3 days before due

**Agent actions (user confirmation required):**
- Prepares quarterly BTW aangifte from real transaction data
- Submits BTW aangifte to Belastingdienst via DigiD/API
- Prepares annual income tax return (IB)
- Generates profit & loss statement on demand
- Exports accountant-ready bookkeeping report

**Conversational (ask anything):**
- Answers tax questions grounded in YOUR actual data
- "Can I deduct this?" → checks your transaction history for context
- "How much tax will I pay this year?" → calculates from real YTD figures
- "Am I better off with KOR?" → runs the actual numbers for your situation

### 5. 🔒 Security — Bank-Level Trust
- PSD2 compliant — read-only bank access by default
- No credentials stored — OAuth token-based connections
- SOC 2 Type II target (year 1)
- Data stored in EU (Netherlands/Germany)
- GDPR compliant by design
- 2FA required for filing actions
- Audit log of every agent action

---

## User Journeys

### Journey 1: Dutch ZZP'er onboarding
1. Sign up with KVK number
2. Connect ING/ABN AMRO via PSD2 (2 clicks)
3. Wijs categorizes last 90 days of transactions
4. Dashboard shows: netto earnings, BTW owed, next deadline
5. BTW aangifte prepared and submitted — first time in 5 minutes

### Journey 2: Expat freelancer onboarding
1. Sign up in English
2. Connect bank (Bunq/Revolut/ING)
3. Wijs explains Dutch tax system in plain English as it sets up
4. Dashboard shows everything translated: "VAT you owe: €1,890 (due Jan 31)"
5. Ask Wijs anything — answers in English with Dutch context

### Journey 3: Ongoing autonomous operation
- Wijs runs in the background every day
- New transactions categorized automatically
- Monthly: Wijs sends "your financial snapshot" email
- Quarterly: "Your BTW return is ready — review and approve"
- Annually: "Your income tax return is ready — here's what you'll pay"

---

## Tech Stack (Recommended)

### Frontend
```
Framework:    React + Vite
Styling:      Tailwind CSS
Charts:       Recharts or Tremor
Auth UI:      Clerk or Auth0
State:        Zustand
```

### Backend
```
Runtime:      Node.js (Hono) or Python (FastAPI)
Database:     PostgreSQL (Supabase)
Queue:        BullMQ (Redis) — for transaction processing
Auth:         Clerk / Auth0
```

### Banking
```
Primary:      Nordigen (GoCardless) — EU PSD2, free tier available
Alternative:  Tink — enterprise, excellent NL coverage
NL Banks:     ING, ABN AMRO, Rabobank, SNS, ASN, Triodos, Bunq
```

### AI Agent
```
Model:        Claude API (claude-sonnet-4-6)
Tools:        categorize_transaction, calculate_btw, prepare_return,
              submit_return, search_transactions, get_tax_rules
Memory:       User transaction history + tax preferences in context
```

### Tax Filing
```
BTW:          Belastingdienst API (or interim: PDF generation + DigiD guide)
IB:           Belastingdienst IB aangifte API
KOR:          Application form generation
```

### Hosting
```
Frontend:     Vercel
Backend:      Railway or Render
Database:     Supabase (EU region)
Domain:       askwijs.ai + askwijs.nl
```

---

## Data Model (Core)

```
User
  ├── profile (name, KVK, BTW number, language preference)
  ├── bank_connections[] (via Nordigen)
  ├── transactions[] (synced from bank)
  │     ├── category (auto-assigned by Wijs)
  │     ├── btw_rate (0, 9, 21, exempt)
  │     ├── deductible_percentage
  │     └── receipt_match (optional)
  ├── tax_periods[]
  │     ├── btw_returns[]
  │     └── income_tax_returns[]
  └── wijs_actions[] (audit log)
```

---

## MVP Scope (Phase 1)

- [ ] Auth + onboarding (KVK, BTW number, language)
- [ ] Nordigen bank connection (ING, ABN AMRO, Rabobank)
- [ ] Transaction sync + auto-categorization
- [ ] Dashboard: netto, BTW position, deadlines
- [ ] Wijs chat: questions answered from real data
- [ ] BTW return preparation (PDF + review UI)
- [ ] Deadline notifications (email)

## Phase 2

- [ ] BTW submission via Belastingdienst API
- [ ] Income tax return preparation
- [ ] Receipt/invoice scanning + matching
- [ ] KOR calculator + application
- [ ] Accountant export (PDF/CSV)
- [ ] Mobile app (React Native)

## Phase 3

- [ ] Income tax submission
- [ ] Multi-year comparison
- [ ] Pension/AOV recommendations
- [ ] Business structure advice (eenmanszaak vs BV)
- [ ] Expat-specific: 30% ruling tracker, M-form assistance

---

## Pricing Model (Planned)

| Plan | Price | For |
|---|---|---|
| **Starter** | Free | 1 bank account, dashboard only |
| **ZZP** | €12/mo | Full automation, BTW filing, 3 bank accounts |
| **Pro** | €29/mo | Multiple entities, accountant export, priority support |

*Cheaper than 1 hour with an accountant.*

---

## Key Differentiators

1. **Only bilingual tool** — genuine English + Dutch, not Google Translate
2. **Agent that acts** — files returns, doesn't just advise
3. **Built on real data** — PSD2 bank connections, not manual input
4. **ZZP + expat** — serves both communities equally well
5. **No accountant needed** for routine filing — 10x cheaper
6. **Dutch-native tax logic** — zelfstandigenaftrek, MKB, KOR, schijnzelfstandigheid all handled
