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
Frontend:     React + Vite + Tailwind CSS
Backend:      Node.js / Bun + PostgreSQL (Supabase)
Open Banking: Nordigen/GoCardless API (PSD2, all NL banks)
AI Agent:     Claude API — claude-sonnet-4-6 with tool use
OCR:          AWS Textract (receipt scanning)
Hosting:      Vercel
```

---

## Repo structure

```
askwijs/
├── README.md               ← This file
├── PRODUCT.md              ← Full architecture spec for Claude Code
├── brand/
│   ├── BRAND.md            ← Brand strategy, voice, positioning
│   ├── DESIGN.md           ← Design system: colors, type, components
│   └── DOMAINS.md          ← Domain research
├── docs/
│   └── brand-ux-guide.html ← Visual design research guide
└── src/
    └── index.html          ← Landing page
```

---

## Brand

**Name:** askwijs · **Domain:** askwijs.ai  
**Tagline:** *Your Dutch taxes, fully automated.*  
**Feel:** Calm, secure financial command center — not a chatbot

| Token | Hex | Role |
|---|---|---|
| Wijs Blue | `#2563eb` | Primary — trust, CTAs |
| Clarity Green | `#059669` | Success, netto, confirmations |
| Deep Slate | `#0a0f1a` | Sidebar, dark surfaces |
| Off White | `#f8fafc` | App background |
| Warm Amber | `#d97706` | Deadlines, alerts only |

---

## Roadmap

**Phase 1 — MVP:** Auth, bank connection, auto-categorization, live dashboard, Wijs chat  
**Phase 2 — Agent:** BTW filing, receipt scanning, proactive notifications, income tax forecast  
**Phase 3 — Intelligence:** DigiD filing, risk scoring, accountant handoff, multi-year trends

---

*Built for the ~1.5M ZZP'ers and 500k+ expats running businesses in 🇳🇱*
