# Design System — askwijs

## Product Context
- **What this is:** AI-powered financial OS that auto-categorizes transactions, tracks BTW, and files Dutch tax returns
- **Who it's for:** Dutch freelancers (ZZP'ers) and expats running businesses in the Netherlands
- **Space/industry:** Dutch accounting/fintech (Moneybird, e-Boekhouden, Twinfield) — all generic, white-bg, Dutch-only
- **Project type:** Web app (dashboard) + marketing landing page — unified dark aesthetic

## Aesthetic Direction
- **Direction:** Warm Premium Dark — serious fintech product with human warmth. Mercury meets Moneybird.
- **Decoration level:** Minimal — subtle accent glows on key elements, product screenshots as decoration. No blobs, no gradients, no illustrations.
- **Mood:** Confident, precise, warm. A calm brilliant friend who knows Dutch taxes. Premium product tool, not boekhouding software.
- **Reference sites:** mercury.com (dark premium fintech), linear.app (interaction quality), ramp.com (data hierarchy)
- **Anti-patterns:** No purple gradients, no 3-column icon grids, no centered-everything layouts, no stock photos, no gradient buttons, no italic text, no large monospace fonts, no cold/sterile clinical feel

## Typography
- **Display/Hero:** Lora — warm classical serif for hero headings and brand moments. Calligraphic roots with contemporary polish. Readable on dark backgrounds, signals authority + warmth without being trendy.
- **Body/UI:** Plus Jakarta Sans — warm geometric sans-serif. Friendlier than Inter, excellent readability at all sizes. Used for body text, labels, buttons, navigation.
- **Data/Tables:** Plus Jakarta Sans with `font-variant-numeric: tabular-nums` — never use monospace on large numbers
- **Code/Identifiers:** JetBrains Mono — small sizes only (KvK numbers, BTW-ids, IBANs, invoice numbers). Never large, never for amounts.
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - Hero: 56px / Lora 600 / tracking -0.02em / line-height 1.12
  - H1: 36px / Lora 600 / line-height 1.2
  - H2: 24px / Plus Jakarta Sans 600 / line-height 1.3
  - H3: 17px / Plus Jakarta Sans 600 / line-height 1.4
  - Body: 15px / Plus Jakarta Sans 400 / line-height 1.6
  - Small: 13px / Plus Jakarta Sans 400 / line-height 1.5
  - Caption: 11px / Plus Jakarta Sans 600 / tracking 0.08em / uppercase
  - Micro: 10px / Plus Jakarta Sans 600 / tracking 0.06em

## Color
- **Approach:** Warm monochrome dark with blue accent — unified across landing page and app
- **Accent (Wijs Blue):** #2563EB — CTAs, active states, accent highlights, links
- **Accent hover:** #3B82F6
- **Accent pale:** rgba(37, 99, 235, 0.12) — badge/pill backgrounds
- **Backgrounds:**
  - Base: #0B0F1A (warm near-black with blue undertone)
  - Surface: #111827 (cards, sidebar, elevated panels)
  - Surface elevated: #1F2937 (inputs, dropdowns, hover states)
- **Text:**
  - Primary: #F9FAFB (near-white — headings, amounts, primary labels)
  - Secondary: #9CA3AF (body text, descriptions, counterparty names)
  - Tertiary: #6B7280 (dates, placeholders, section labels)
- **Semantic:**
  - Success: #059669 (revenue, positive deltas, connected states, confirmations)
  - Warning: #D97706 (due dates, pending states — deadlines only, never decorative)
  - Error: #DC2626 (errors, failed states, overdue — never decorative)
  - Info: #2563EB (same as accent)
- **Semantic pale (for badges/alerts):**
  - Success pale: rgba(5, 150, 105, 0.12)
  - Warning pale: rgba(217, 119, 6, 0.12)
  - Error pale: rgba(220, 38, 38, 0.12)
  - Info pale: rgba(37, 99, 235, 0.12)
- **Borders:**
  - Default: rgba(255, 255, 255, 0.08)
  - Subtle/separators: rgba(255, 255, 255, 0.04)
  - Active/focus: rgba(37, 99, 235, 0.25)
- **Badge/pill backgrounds:** 12% opacity of semantic color, never solid fills

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(80)

## Layout
- **Approach:** Unified dark — landing page and dashboard share the same palette and aesthetic. No light/dark jarring switch at login.
- **Landing page:** Full-width sections, interactive demos, stacked feature sections. Product screenshots are the decoration.
- **Dashboard:** Sidebar navigation (220px) + main canvas. Edge-to-edge content. Wijs chat bar at bottom.
- **Max content width:** 1100px (landing sections), full-width (dashboard)
- **Border radius:**
  - sm: 6px (buttons, badges, inputs)
  - md: 10px (cards, modals)
  - lg: 14px (dashboard frame, hero panels)
  - full: 9999px (pills, avatars)
- **Mobile:** Hamburger menu overlay for sidebar below `lg` breakpoint. All layouts responsive.

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms)
- **Scroll animations:** Fade-in-up on intersection (0.7s ease, 24px translateY) — landing page sections only
- **No motion:** Reduced-motion media query disables all animations

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Unified design system created | Replaced 3 conflicting files (DESIGN.md, brand/DESIGN.md, brand/BRAND.md) with one coherent warm premium dark system |
| 2026-04-03 | Lora for display (was Instrument Serif) | Classical serif with calligraphic warmth. Better legibility on dark backgrounds than Instrument Serif. Less trendy, more trustworthy for financial product. |
| 2026-04-03 | Plus Jakarta Sans for body | Warmer than Inter/Outfit, friendlier geometric sans. Every competitor uses Inter or Roboto. |
| 2026-04-03 | Wijs Blue #2563EB as sole accent | Established brand color. Replaced Linear indigo #5e6ad2 for consistency. |
| 2026-04-03 | Dark everywhere | Eliminated light/dark split (was: dark landing, light app). Unified warm dark palette. |
