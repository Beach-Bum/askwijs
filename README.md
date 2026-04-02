# askwijs.ai 🧠

> **The smartest tax advisor for Dutch freelancers — in English & Nederlands**

askwijs is a bilingual AI tax advisor built for Dutch ZZP'ers and expat freelancers in the Netherlands. It answers tax questions in plain English or Dutch, tracks BTW/VAT deadlines, calculates deductions, and makes the Belastingdienst feel a lot less scary.

---

## What it does

- 💬 **Ask Wijs anything** — plain Dutch answers to complex tax questions
- 📊 **BTW dashboard** — quarterly VAT overview at a glance
- 📅 **Deadline tracker** — never miss an aangifte again
- 🧾 **Deduction finder** — zelfstandigenaftrek, KOR, MKB-winstvrijstelling
- 📎 **Receipt scanning** — upload invoices, auto-categorize expenses

---

## Target audience

- 🇳🇱 **Dutch ZZP'ers** — freelancers and eenmanszaak owners navigating the Dutch tax system
- 🌍 **Expats in the Netherlands** — 500k+ internationals, many running their own business, dealing with an unfamiliar tax system in a foreign language
- 🏢 **Small businesses (MKB)** — sole traders and micro-businesses, especially under the KOR threshold

Both audiences want the same thing: a smart, friendly alternative to expensive accountants and confusing government portals.

---

## Repo structure

```
askwijs/
├── README.md
├── docs/
│   └── brand-ux-guide.html     # Full brand & UX research guide
├── brand/
│   ├── BRAND.md                 # Brand strategy & positioning
│   ├── DESIGN.md                # Design system reference
│   └── DOMAINS.md               # Available domain research
└── src/                         # App source (coming soon)
```

---

## Brand

**Name:** askwijs  
**Domain:** askwijs.ai *(available)*  
**Tagline:** *Jouw fiscale gids. Altijd beschikbaar.*  
**Feel:** Calm, brilliant Dutch friend who knows everything about taxes

### Color palette
| Token | Hex | Usage |
|---|---|---|
| Wijs Blue | `#2563eb` | Primary — trust anchor |
| Clarity Green | `#059669` | Success states, netto earnings |
| Deep Slate | `#0a0f1a` | Sidebar, headings |
| Off White | `#f8fafc` | App background |
| Warm Amber | `#d97706` | Deadlines, alerts only |

### Typography
- **Display:** DM Serif Display — warmth + authority
- **UI:** Inter — clean, readable at all sizes

---

## Build roadmap

- [ ] Landing page + waitlist
- [ ] Logo & visual identity
- [ ] Onboarding flow (3 screens)
- [ ] Chat interface (MVP)
- [ ] BTW dashboard
- [ ] Deadline notifications

---

## Stack (planned)

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **AI:** Claude API (Anthropic)
- **Hosting:** Vercel
- **Domain:** askwijs.ai

---

*Built for the ~1.5 million ZZP'ers and 500k+ expats running businesses in the Netherlands 🇳🇱🌍*
