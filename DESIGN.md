# Design System — askwijs

## Product Context
- **What this is:** AI-powered financial OS that auto-categorizes transactions, tracks BTW, and files Dutch tax returns
- **Who it's for:** Dutch freelancers (ZZP'ers) and expats running businesses in the Netherlands
- **Space/industry:** Dutch accounting/fintech (Moneybird, e-Boekhouden, Twinfield) — all generic, white-bg, blue-accent, Dutch-only
- **Project type:** Web app (dashboard) + marketing landing page

## Aesthetic Direction
- **Direction:** Linear-inspired dark monochrome — clean, minimal, product-focused. Premium developer tool aesthetic applied to fintech.
- **Decoration level:** Minimal — subtle accent radial glows on key elements, no decorative blobs or illustrations. Product screenshots and interactive demos are the decoration.
- **Mood:** Confident, precise, serious but approachable. Premium product tool, not boekhouding tool.
- **Reference sites:** linear.app (palette, layout, interactive sections, product-first), tink.com (trust, animations, section rhythm), mercury.com (dark premium fintech)
- **Anti-patterns:** No purple gradients, no 3-column icon grids, no centered-everything layouts, no stock photos, no gradient buttons, no italic text, no large monospace fonts

## Typography
- **All text:** Inter — clean, neutral, professional sans-serif. Same family for display, body, UI, and labels.
- **Data/Tables:** Inter with `font-variant-numeric: tabular-nums` — never use font-mono on numbers
- **Code:** JetBrains Mono 400 — small sizes only (KvK numbers, BTW-ids, IBANs). Never large.
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - Hero: clamp(40px, 6.5vw, 72px) / Inter 600 / tracking -0.03em
  - H1: 36px / Inter 600
  - H2: clamp(28px, 4vw, 40px) / Inter 600 / tracking -0.02em
  - H3: 17px / Inter 600
  - Body: 16px / Inter 400
  - Body small: 14px / Inter 400
  - Caption: 13px / Inter 500
  - Label: 12px / Inter 500
  - Micro: 11px / Inter 600 / tracking widest / uppercase (category badges only)
  - Tiny: 10px / Inter 500-600 (badge text, stat labels)

## Color
- **Approach:** Linear-inspired monochrome dark with indigo accent
- **Primary (Linear Indigo):** #5e6ad2 — CTAs, active states, accent highlights, category labels
- **Primary hover:** #6e7bdf
- **Backgrounds:**
  - Base: #08090a (near-black)
  - Surface: rgba(255,255,255,0.03)
  - Surface hover: rgba(255,255,255,0.06)
  - Elevated: rgba(255,255,255,0.04)
- **Text:**
  - Primary: #f7f8f8 (near-white)
  - Muted: #8a8f98 (body text, descriptions)
  - Faint: #62666d (tertiary labels, placeholders, dates)
- **Semantic:**
  - Success: #3fb950 (revenue, positive deltas, connected states)
  - Warning: #d29e5e (due dates, pending states)
  - Error: #d2765e (expenses, alerts)
  - Info: #5e6ad2 (same as primary)
- **Borders:**
  - Default: rgba(255,255,255,0.08)
  - Row separators: rgba(255,255,255,0.04)
  - Active: rgba(94,106,210,0.25)
- **Glow effect:** `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,106,210,0.08), transparent)` — subtle indigo glow behind hero
- **Badge/pill backgrounds:** 8-15% opacity of semantic color (e.g., `${color}15`), never solid

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(80) 5xl(100) 6xl(120)

## Layout
- **Approach:** Linear-style for landing page (full-width product shots, stacked feature sections), grid-disciplined for dashboard
- **Landing page structure:**
  - Minimal fixed top nav (logo left, links center, CTA right) with backdrop-blur, auto-hide on scroll down, show on scroll up
  - Hero: centered text + interactive dashboard demo below (in browser chrome frame)
  - Bank logos strip
  - Three pillars (AI-powered, Bilingual, Bank-grade security)
  - Feature sections: text left / interactive demo right, alternating sides (Linear-style)
  - Pricing card, final CTA, minimal footer
- **Dashboard structure:**
  - Top-bar navigation with tab-based nav — Linear-inspired
  - Full-canvas layout, edge-to-edge content
  - AI chat bar at bottom (Wijs assistant)
- **Max content width:** 960px (dashboard demo), 1100px (feature sections)
- **Border radius:**
  - sm: 6px (buttons, small badges)
  - md: 8px (cards, inputs)
  - lg: 12px (feature panels, dashboard sections)
  - xl: 16px (browser chrome frames)
  - full: 999px (pills, avatars, badges)

## Motion
- **Approach:** Intentional — Tink-inspired smooth transitions, not bouncy or playful
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(100ms) short(150ms) medium(200ms) long(400ms) section(600ms)
- **Patterns:**
  - Stat numbers: count-up animation on viewport entry (1400ms, cubic ease-out)
  - Feature sections: fade-in + translateY(24px) on scroll (700ms, IntersectionObserver)
  - Transaction categories: progressive reveal (600ms intervals)
  - BTW boxes: progressive fill animation (400ms intervals)
  - AI chat: message-by-message reveal (1500ms intervals) with typing indicator
  - Cards: border-color transition on hover (150ms)
  - Buttons: background + translateY(-1px) on hover (150ms)
  - Nav: backdrop-filter blur on scroll, auto-hide on scroll down, show on scroll up (300ms)
  - Nav links: animated underline on hover (300ms, accent color)
- **Never:** bouncy spring animations, 3D transforms, parallax scrolling, decorative loading spinners, italic text

## Interactive Elements (Landing Page)
- **Dashboard demo:** 7-tab interactive dashboard (Overview, Transactions, BTW, Invoices, Receipts, Banks, Settings) with real data
- **AI chat bar:** Type questions, get keyword-matched responses about BTW, deductions, revenue
- **Receipt drop zone:** Drag-drop or click to simulate receipt upload with auto-matching
- **Bank connections:** Click "Connect" buttons to toggle connected state
- **Transaction categorization:** Progressive reveal animation showing AI categorization

## Hard Rules
- Never use italic text anywhere
- Never use font-mono or monospace fonts on large numbers or stat displays
- Never use ALL CAPS on body text or headings — sentence case always (exception: tiny 10-11px category badges and section labels)
- Numbers always use `font-variant-numeric: tabular-nums` with Inter, never JetBrains Mono
- No stock photos — product screenshots and interactive UI demos only
- Badge/pill backgrounds use 8-15% opacity of their semantic color, never solid backgrounds
- Interactive product demos on landing page, not just static screenshots (Linear-style)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-02 | Linear-inspired dark monochrome | User chose Linear's exact palette and layout over Amber Intelligence direction |
| 2026-04-02 | Inter for all typography | Matches Linear's clean, neutral aesthetic. No serifs. |
| 2026-04-02 | #5e6ad2 indigo accent | Linear's primary accent color — professional, not flashy |
| 2026-04-02 | #08090a near-black background | Linear's bg — darker and cooler than amber alternative |
| 2026-04-02 | Auto-hide nav on scroll | Linear-style nav behavior — hide on scroll down, show on scroll up |
| 2026-04-02 | No italic text | User explicit feedback: "I dont want any italic" — use color accents for emphasis instead |
| 2026-04-02 | No large monospace | User explicit feedback: "dont use any monofont that is large" — use Inter + tabular-nums |
| 2026-04-02 | Interactive dashboard demo | Linear-style interactive sections — users can click tabs, type to AI, drag receipts |
| 2026-04-02 | Tink.com as motion reference | User likes Tink's trustworthy feel and animations. Intentional motion, not playful. |
