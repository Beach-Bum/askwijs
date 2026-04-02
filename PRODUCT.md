# askwijs — Product Architecture

## Vision

askwijs is a **financial OS for Dutch ZZP'ers and expat freelancers** — not a chatbot.

It connects to your bank accounts, automatically categorizes every transaction, calculates your live tax position, and lets an AI agent (Wijs) file returns on your behalf. The chat interface sits on top of real financial data — making advice personal, not generic.

**Think:** Revolut Business + Bench Accounting + Dutch tax expertise + an AI agent that acts for you.

---

## Core Pillars

### 1. 🏦 Connect
**Bank connections via PSD2 / Open Banking**
- Auto-connect ING, ABN AMRO, Rabobank, SNS, Bunq, Revolut NL
- Provider: **Nordigen (GoCardless)** or **Tink** (Visa-owned, best NL coverage)
- Transactions sync automatically — no manual import
- Real-time balance and transaction feed

### 2. 🔄 Categorize
**Automatic transaction categorization**
- Every transaction tagged: business / personal / mixed
- Sub-categories: office, travel, equipment, meals, subscriptions
- Deductible percentage calculated automatically
- User can override with one tap — Wijs learns from corrections

### 3. 📊 Dashboard
**Live financial picture**
- Netto income (real-time, from connected accounts)
- BTW (VAT) position — owed vs reclaimable
- Income tax forecast for the year
- Deductions found automatically
- Upcoming deadlines with countdown
- Quarter-by-quarter comparison

### 4. 🤖 Wijs Agent
**AI agent that acts on your behalf**
- Prepares BTW aangifte from real transaction data
- Submits returns to Belastingdienst (via DigiD integration)
- Categorizes new transactions as they arrive
- Flags anomalies, missing receipts, risky classifications
- Proactive: "Your Q1 BTW return is due in 12 days. I've prepared it — want to review?"

### 5. 💬 Ask
**Conversational interface on real data**
- English or Dutch — seamlessly
- Questions answered with your actual numbers
- "Am I on track for zelfstandigenaftrek?" → Yes, you've logged 847 hours. Target: 1,225.

---

## User Flow

```
1. Sign up → enter KVK number + BTW number
2. Connect bank account(s) via Open Banking (one click)
3. Wijs categorizes last 90 days of transactions automatically
4. Dashboard populates with live tax position
5. Wijs notifies of upcoming deadlines
6. User reviews → Wijs files → done
```

---

## Tech Architecture

### Frontend
```
Framework:    React + Vite
Styling:      Tailwind CSS
State:        Zustand or TanStack Query
Charts:       Recharts or Tremor
Auth:         Clerk or Supabase Auth
```

### Backend
```
Runtime:      Node.js / Bun
API:          REST + WebSockets for real-time updates
Database:     PostgreSQL (Supabase)
Queue:        BullMQ for async categorization jobs
Storage:      Supabase Storage (receipts, documents)
```

### Key Integrations
```
Open Banking: Nordigen/GoCardless API (PSD2, covers all NL banks)
              OR Tink API (Visa-owned, enterprise-grade)
Tax Filing:   Belastingdienst API + DigiD OAuth
AI:           Claude API — claude-sonnet-4-6
OCR:          AWS Textract or Google Document AI (receipts)
```

### Wijs Agent Tools
```
get_transactions(dateRange, category)
categorize_transaction(id, category, deductiblePct)
calculate_btw_position(quarter, year)
prepare_btw_return(quarter, year)
submit_btw_return(quarter, year, digiDToken)
get_deadlines(userId)
find_deductions(year)
calculate_income_tax(year)
scan_receipt(imageUrl)
flag_transaction(id, reason)
```

---

## Data Model

```sql
users
  id, email, name, language, kvk_number, btw_number, created_at

bank_connections
  id, user_id, provider, account_id, iban, bank_name, synced_at, active

transactions
  id, user_id, connection_id, date, amount, currency,
  merchant, description, category, subcategory,
  deductible_pct, is_business, receipt_url, notes, reviewed

btw_returns
  id, user_id, quarter, year, status, btw_collected,
  btw_paid, btw_owed, filed_at, submitted_by

tax_years
  id, user_id, year, gross_income, deductions,
  taxable_income, estimated_tax, actual_tax, zza_eligible
```

---

## Security

- All bank data encrypted at rest (AES-256)
- PSD2 compliant — no bank credentials stored, token-only
- DigiD: user authorizes per filing session, never stored
- GDPR compliant — Dutch data residency
- Full audit log of all agent actions
- User can revoke bank connections instantly

---

## Roadmap

### Phase 1 — Foundation (MVP)
- [ ] Auth + onboarding (KVK/BTW input)
- [ ] Bank connection via Nordigen (ING, ABN AMRO, Rabobank)
- [ ] Transaction sync + auto-categorization
- [ ] Dashboard (netto, BTW position, deadlines)
- [ ] Wijs chat grounded in real transaction data

### Phase 2 — Agent
- [ ] BTW return preparation + submission
- [ ] Receipt scanning + OCR-to-transaction matching
- [ ] Proactive deadline notifications (email + push)
- [ ] Income tax forecasting

### Phase 3 — Intelligence
- [ ] DigiD integration for full autonomous filing
- [ ] Schijnzelfstandigheid risk scoring
- [ ] Multi-year comparison + trends
- [ ] Accountant handoff export
- [ ] Business health score

---

## Competitive Gap

| Product | What's missing |
|---|---|
| Moneybird | No AI agent, no English, no auto bank connect |
| e-Boekhouden | Dated UI, Dutch-only, no AI |
| Twinfield | Enterprise complexity, expensive |
| Belastingdienst portal | Government UX, zero guidance |
| ChatGPT / generic AI | No real data, generic advice only |

**askwijs is the only product that:**
1. Works natively in English AND Dutch
2. Auto-connects bank accounts (PSD2)
3. Has an AI agent that categorizes AND files
4. Is built specifically for ZZP + expat market in NL

---

## Notes for Claude Code

Consolidate the existing codebase against this spec:

1. Dashboard must reflect the 5 pillars above
2. Wijs agent needs tool-use implementation (see Tools list)
3. Bank connection flow → Nordigen/GoCardless API
4. All UI → design system in `brand/DESIGN.md`
5. Landing page → `src/index.html` (reflects full product vision)
6. Prioritize Phase 1 for MVP
