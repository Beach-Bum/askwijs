# askwijs.ai 🧠

> **Your Dutch taxes, fully automated — for ZZP'ers and expats.**

askwijs is a financial OS for Dutch freelancers and expat business owners. Connect your bank, and Wijs handles the rest: automatic transaction categorization, live BTW dashboard, and an AI agent that prepares and files your Dutch tax returns on your behalf. In English or Dutch.

---

## What it does

| Pillar | Description |
|---|---|
| 🏦 **Connect** | PSD2 Open Banking — ING, ABN AMRO, Rabobank, Bunq auto-linked |
| 🔄 **Categorize** | Every transaction auto-tagged: business/personal, deductible % |
| 📊 **Dashboard** | Live netto income, BTW position, tax forecast, deadlines |
| 🤖 **File** | Wijs prepares and submits BTW aangifte to Belastingdienst |
| 💬 **Advise** | AI answers grounded in YOUR real transaction data |

---

## Target audience

- 🇳🇱 **Dutch ZZP'ers** — 1.5M freelancers navigating BTW, zelfstandigenaftrek, Belastingdienst
- 🌍 **Expats in the Netherlands** — 500k+ internationals running businesses, stranded by Dutch-only tools
- 🏢 **Small businesses (MKB)** — eenmanszaak owners who want automation, not an accountant

---

## Why it's different

Every existing Dutch tax tool (Moneybird, e-Boekhouden, Twinfield) is Dutch-only, manual, and advisory. **askwijs is the only platform that:**

1. Works natively in **English AND Dutch**
2. **Auto-connects bank accounts** via PSD2 (no CSV uploads)
3. Has an **AI agent that categorizes and files** — not just advises
4. Is built specifically for the **ZZP + expat market**

---

## Tech stack

```
Frontend:     React 19 + Vite 6 + Tailwind CSS v4 + TypeScript
Backend:      Hono 4 (Node.js) + PostgreSQL + Drizzle ORM
Auth:         Supabase Auth (JWT)
Open Banking: Tink PSD2 API (read-only, all NL banks)
AI Agent:     Anthropic Claude API — claude-sonnet-4-6
Payments:     Stripe (subscriptions, 30-day trial)
Hosting:      Vercel
```

## Getting started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in: Supabase, Stripe, Tink, Anthropic, DATABASE_URL

# Run database migrations
npm run db:migrate

# Start development (frontend + API)
npm run dev:all
```

Frontend: `http://localhost:5173` | API: `http://localhost:3001`

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run dev:server` | Hono API server |
| `npm run dev:all` | Both concurrently |
| `npm run build` | TypeScript check + Vite build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Drizzle Studio |

---

## Repo structure

```
askwijs/
├── src/
│   ├── api/server.ts         # Hono API (auth middleware, Stripe, Tink, profile)
│   ├── components/           # AppShell, ChatPanel, ErrorBoundary
│   ├── db/                   # Drizzle schema + connection
│   ├── hooks/useAuth.tsx     # Supabase auth context
│   ├── lib/
│   │   ├── api.ts            # Fetch client with JWT injection
│   │   ├── supabase.ts       # Supabase client
│   │   ├── ai/categorize.ts  # Claude transaction categorization
│   │   └── tax/dutch-tax.ts  # BTW + income tax calculations
│   └── pages/                # Landing, Login, Onboarding, Dashboard, Subscribe
├── DESIGN.md                 # Unified design system (Warm Premium Dark)
├── brand/                    # Brand strategy docs
├── docs/                     # Design research
└── vercel.json               # SPA rewrite for client-side routing
```

---

## Design System — Warm Premium Dark

**Name:** askwijs · **Domain:** askwijs.ai · **Live:** askwijs-fresh.vercel.app
**Tagline:** Your Dutch taxes, fully automated.
**Direction:** Warm premium dark. Mercury meets Moneybird. Unified dark aesthetic across landing and app.

**Typography:**
- Display/Hero: Lora 600 (classical serif, warm + trustworthy)
- Body/UI: Plus Jakarta Sans (geometric sans)
- Code/Identifiers: JetBrains Mono (small sizes only)

| Token | Hex | Role |
|---|---|---|
| Wijs Blue | `#2563EB` | Primary accent, CTAs, links |
| Background | `#0B0F1A` | Base dark (warm near-black) |
| Surface | `#111827` | Cards, panels, sidebar |
| Elevated | `#1F2937` | Inputs, hover states |
| Text Primary | `#F9FAFB` | Headings, amounts |
| Text Secondary | `#9CA3AF` | Body, descriptions |
| Success | `#059669` | Revenue, confirmations |
| Warning | `#D97706` | Deadlines only |
| Error | `#DC2626` | Errors, overdue |

---

## Roadmap

**Phase 1 — MVP:** Auth, bank connection, auto-categorization, live dashboard, Wijs chat  
**Phase 2 — Agent:** BTW filing, receipt scanning, proactive notifications, income tax forecast  
**Phase 3 — Intelligence:** DigiD filing, risk scoring, accountant handoff, multi-year trends

---

*Built for the ~1.5M ZZP'ers and 500k+ expats running businesses in 🇳🇱*
