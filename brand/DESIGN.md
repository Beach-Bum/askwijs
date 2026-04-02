# askwijs — Design System

## Core Principles

1. **Clarity over cleverness** — if it needs explaining, simplify it
2. **Human before digital** — warm, personal, not institutional
3. **Calm authority** — confident without being cold
4. **Progressive disclosure** — show only what's needed now
5. **Visible security cues** — trust must be earned visually
6. **Mobile-first** — ZZPers check taxes on the go
7. **Accessible contrast** — WCAG AA minimum, AAA where possible
8. **Bilingual by default** — English primary, Dutch seamlessly supported. Dutch tax terms always accompanied by an English gloss on first use.

---

## Color Tokens

```css
/* Brand */
--color-primary:        #2563eb;   /* Wijs Blue — trust, CTAs */
--color-primary-light:  #3b82f6;   /* Hover states */
--color-primary-pale:   #eff6ff;   /* AI messages, highlights */

/* Success */
--color-success:        #059669;   /* Clarity Green */
--color-success-light:  #10b981;
--color-success-pale:   #ecfdf5;

/* Alert */
--color-alert:          #d97706;   /* Warm Amber — deadlines only */
--color-alert-pale:     #fffbeb;

/* Error */
--color-error:          #dc2626;   /* Errors only — never decorative */
--color-error-pale:     #fff1f2;

/* Neutral scale */
--color-slate-950:      #0a0f1a;   /* Sidebar, deep headings */
--color-slate-900:      #0f172a;
--color-slate-800:      #1e293b;
--color-slate-700:      #334155;
--color-slate-500:      #64748b;   /* Secondary text */
--color-slate-300:      #cbd5e1;
--color-slate-100:      #f1f5f9;
--color-slate-50:       #f8fafc;   /* App background */
--color-white:          #ffffff;
```

---

## Typography

### Fonts
```
Display:  DM Serif Display — warmth + authority for headlines
UI:       Inter — clarity at all sizes for body/labels/data
Mono:     JetBrains Mono — tax amounts, form values
```

### Type Scale
```
Display   DM Serif / 40–48px / lh 1.15  — Hero headings
H1        Inter 700 / 28px / lh 1.25    — Page titles
H2        Inter 600 / 20px / lh 1.3     — Section headers
H3        Inter 600 / 16px / lh 1.4     — Card titles
Body      Inter 400 / 15px / lh 1.6     — Default prose
Small     Inter 400 / 13px / lh 1.5     — Secondary text
Caption   Inter 500 / 11px / ls 0.08em  — Labels, tags (uppercase)
```

---

## Spacing

Base unit: **4px**

```
4px   — xs  (tight inline gaps)
8px   — sm  (icon padding, tight stacks)
12px  — md  (default padding unit)
16px  — lg  (card inner padding)
24px  — xl  (section gaps, card outer)
32px  — 2xl
48px  — 3xl
64px  — 4xl (major section breaks)
```

---

## Border Radius

```
4px   — inputs, small tags
8px   — buttons, sidebar items
12px  — stat cards, chat bubbles
16px  — main cards, panels
20px  — large modals, UI containers
9999px — pills, badges
```

---

## Components

### Stat Card
- White background, 1px border `#e2e8f0`
- 16px radius, 16px padding
- Label: Caption style, slate-500
- Value: H1 weight, slate-900
- Badge: pill shape with semantic color

### Chat Bubble (AI)
- Background: `--color-primary-pale`
- No border
- Max-width: 280px
- Avatar: 28px circle, Wijs Blue, "W" initial

### Chat Bubble (User)
- Background: `--color-slate-50`
- Border: 1px `--color-slate-200`
- Max-width: 280px
- Avatar: 28px circle, slate-200

### Sidebar
- Background: `--color-slate-950`
- Active item: `rgba(37,99,235,0.15)` background, `#93c5fd` text
- Inactive: `#94a3b8`
- Logo: DM Serif, white + blue accent

### Primary Button
```css
background: var(--color-primary);
color: white;
border-radius: 8px;
padding: 10px 20px;
font: Inter 600 15px;
transition: background 0.15s;
```

---

## Do's & Don'ts

### ✅ Do
- Use generous white space — it signals calm and clarity
- Show progress bars in all multi-step flows
- Use green exclusively for success/positive states
- Personalize greetings with the user's first name
- Use Dutch tax terms natively (BTW, zelfstandigenaftrek, KOR)
- Make security visible — lock icons, clear data handling copy
- Round card corners — feels approachable, not corporate

### ❌ Don't
- Use red outside of error states
- Show raw numbers without context or explanation
- Use heavy gradients or distracting animations
- Default to dark mode (reduces perceived trust in finance)
- Use jargon without a plain-language follow-up
- Stack more than 3 actions on one screen
- Use serif fonts below 16px

---

## Layout

### App shell
```
┌─────────────────────────────────────────┐
│  Sidebar (220px dark)  │  Main canvas   │
│                        │  (off-white)   │
│  Logo                  │                │
│  Nav items             │  Dashboard /   │
│                        │  Chat / Flow   │
│  Settings (bottom)     │                │
└─────────────────────────────────────────┘
```

### Dashboard grid
- 3-column stat cards (responsive → 1 col mobile)
- Chat panel below stats
- Deadline list in right rail (desktop)

---

## Microinteractions

| Trigger | Animation |
|---|---|
| Button press | Scale 0.97 → 1.0, 100ms |
| Card hover | Shadow lift, 150ms ease |
| Success state | Green checkmark fade-in |
| AI typing | Three dots pulse |
| Filing complete | Confetti burst (subtle) |
| Deadline approaching | Amber pulse on badge |

---

## Accessibility

- WCAG AA minimum contrast on all text
- Focus rings: 2px offset, `--color-primary`
- Error messages: never color-only (always include icon + text)
- All icons: aria-label or visually hidden text
- Tab order: logical, no focus traps
