# askwijs Brand Voice Guide

## Who We Sound Like

A calm, brilliant friend who knows Dutch taxes. Not a stuffy accountant, not a chatbot. Think: the smartest person at a coworking space who happens to be great with numbers and genuinely wants to help you.

askwijs speaks English first, Dutch fluently. The only financial tool that feels native to both communities.

---

## Voice Attributes

### 1. Confident

State what askwijs does. Do not hedge.

- Good: "Stop dreading April 30."
- Good: "Your quarterly BTW. Pre-filled, ready to submit."
- Bad: "We might be able to help with your taxes."
- Bad: "We hope to simplify your filing experience."

### 2. Precise

Use real numbers, real terms, real data. Specificity builds trust.

- Good: "Found 4.210 in deductions: 290/mo WeWork, 60,49/mo Adobe, 89 NS travel, 349 monitor (KIA eligible)."
- Good: "BTW rubriek 1a: Leveringen/diensten belast met hoog tarief"
- Good: "PSD2 Open Banking, read-only access"
- Bad: "We found some deductions for you."
- Bad: "Various tax categories are supported."

### 3. Warm

Make it personal. Use possessives ("your Dutch taxes"), name the user when possible, and write like a helpful person, not a system.

- Good: "Your Dutch taxes, fully automated."
- Good: "Wijs has calculated this for you."
- Good: "Want me to walk you through the 4 that need review?"
- Bad: "The system has completed tax calculations."
- Bad: "Users may review their automated categorizations."

### 4. Direct

Short sentences. Action-oriented headings. No filler words.

- Good: "Snap a photo. Wijs does the rest."
- Good: "Connect your bank in seconds. BTW pre-filled in minutes. File in one click."
- Bad: "Our innovative platform enables you to seamlessly manage your complete financial administration."

---

## Tone by Context

### Landing page
Bold, confident, slightly emotional. Lead with the pain point, resolve it fast.

- Headline example: "Stop dreading April 30."
- Subhead example: "Your Dutch taxes, fully automated. Connect your bank, and askwijs handles BTW (Dutch VAT), categorization, and filing."

### Dashboard and AI chat
Precise, helpful, data-grounded. Always reference actual numbers from the user's data.

- "Goedemorgen! I see 12 new transactions from your ING account. 8 were auto-categorized."
- "Q1 BTW: 2.614,50 verschuldigd minus 724,50 voorbelasting = 1.890,00 to pay. Deadline: April 30."

### Onboarding
Encouraging, brief, progress-oriented. Tell them how long it takes.

- "Let's get you set up" with "~2 minutes" underneath.
- "We use Tink PSD2. Read-only access. We never move your money."

### Legal pages (Terms, Privacy)
Clear, honest, no legalese. Short paragraphs. Plain language.

- "askwijs provides automated tax calculations and AI-assisted categorization. This is not a substitute for professional tax advice."
- "We use only essential cookies. No tracking cookies, no analytics scripts, no third-party ad pixels."

### Error states
Empathetic, blame-free. Tell them what happened and what to do next.

- Good: "Failed to save profile. Please try again."
- Good: "Failed to connect to bank. Please try again."
- Bad: "Error 500: Internal Server Error"
- Bad: "You entered invalid data."

### Pricing
Simple, transparent. Always show what's included and what it costs.

- "Simple pricing. No surprises."
- "Start free. Upgrade when you need more."

---

## Terminology

### Brand names

| Term | Usage | Example |
|------|-------|---------|
| askwijs | Brand name. Always lowercase, one word. | "askwijs handles BTW filing." |
| Wijs | The AI assistant. Capitalized. Short form. | "Wijs categorizes your transactions." |
| Ask Wijs | The feature name. Two words, both capitalized. | "Use Ask Wijs to check your deductions." |

### Dutch terms

Use the Dutch term first, with English in parentheses on first use in any page or section. After the first explanation, the Dutch term can stand alone.

| Dutch term | First use | Subsequent uses |
|-----------|-----------|-----------------|
| BTW | BTW (Dutch VAT) | BTW |
| boekhouder | boekhouder (bookkeeper) | boekhouder |
| aangifte | aangifte (tax filing) | aangifte |
| zelfstandigenaftrek | zelfstandigenaftrek (self-employment deduction) | zelfstandigenaftrek |
| KvK | KvK (Chamber of Commerce number) | KvK |
| Belastingdienst | Belastingdienst (Dutch tax authority) | Belastingdienst |
| rubriek | rubriek (form box/field) | rubriek |
| KOR | KOR (small business VAT exemption) | KOR |
| netto | netto (net) | netto |
| eenmanszaak | eenmanszaak (sole proprietorship) | eenmanszaak |

### Product category

- askwijs is a "financial OS" or "financial administration tool."
- Never call askwijs "boekhouding software" (bookkeeping software). That is what we replace, not what we are.
- Acceptable: "financial tool", "financial OS", "tax tool."
- Not acceptable: "platform", "solution", "software suite."

### Referring to people

- In marketing copy: "ZZP'ers and expats", "freelancers and expats."
- Never say "customers" or "users" in marketing copy.
- In internal docs or UI labels: "user" is acceptable.

### Pricing notation

- Use Dutch comma notation for prices: 9,99 not 9.99.
- Always include "excl. 21% BTW" near any price.
- Use the euro symbol before the amount: 24,99/month.
- Dot as thousands separator: 1.890,00 (not 1,890.00).

---

## Style Rules

### Typography in copy

- Headings: Sentence case. Lora serif, weight 600.
  - Good: "Your quarterly BTW. Pre-filled, ready to submit."
  - Bad: "Your Quarterly BTW. Pre-filled, Ready To Submit."
- Body text: Plus Jakarta Sans, weight 400/500.
- Numbers in UI: Use `fontVariantNumeric: tabular-nums` with the body font. Do not use large monospace fonts for numbers.
- Never use italic text. For emphasis, use color accents (Wijs Blue #2563EB for brand, Clarity Green #059669 for positive states, Warm Amber #D97706 for deadlines).

### CTAs

- Primary CTA label: "Start free trial" (standardized across all pages).
- Supporting text: "No credit card required" or "30 days free."
- Secondary CTA: "Contact us" for sales.
- Skip actions: "I'll connect my bank later" (friendly, no pressure).

### Social proof

- Only use real, verifiable claims. Never fabricate numbers or testimonials.
- Trust signals currently in use: "PSD2 Open Banking", "EU-hosted, GDPR compliant", "30 days free."
- Quote real data when available. Do not invent user counts.

### Bilingual patterns

- Default language: English.
- Mix Dutch tax terms naturally into English copy with a parenthetical translation on first use.
- Dashboard greetings can be Dutch: "Goedemorgen" is already used in the dashboard.
- Example of natural mixing: "Your BTW aangifte (VAT filing) is ready to review."
- Never assume Dutch proficiency. Always explain KvK, Belastingdienst, rubriek numbering, and other Dutch-specific concepts.

---

## Anti-patterns

### Words and phrases to avoid

| Avoid | Why | Use instead |
|-------|-----|-------------|
| "easy" | What's easy varies by person | "fast", "in seconds", "in one click" |
| "we're the best" / "leading" / "world-class" | Let the product speak | State what it does specifically |
| "leverage" / "synergize" / "solution" | Corporate jargon | "use", "tool", "OS" |
| "platform" | Too generic and corporate | "tool", "OS" |
| "limited time!" / "act now!" | Fake urgency | State facts: "30 days free" |
| "simple" / "simply" | Dismissive of real complexity | Describe the actual steps |

### Behaviors to avoid

- Do not mock Dutch taxes. Acknowledge they are confusing, then solve the problem.
  - Bad: "Dutch taxes are a nightmare!"
  - Good: "Dutch taxes can be confusing. Wijs makes them manageable."
- Do not use fear or urgency as motivation.
  - Bad: "File NOW before it's too late!"
  - Good: "Your Q1 BTW aangifte is due April 30."
- Do not list "coming soon" features as current capabilities.
- Do not use superlatives without proof.

---

## Inclusive Language

- Gender-neutral throughout. No "he/she" constructs. Use "they" or "you."
- Bilingual audience: full English primary, Dutch terms woven in. Never assume Dutch proficiency.
- Expat-aware: explain Dutch-specific concepts on first encounter. Do not assume familiarity with KvK registration, Belastingdienst portals, rubriek numbering, or the difference between BTW and IB.
- Never assume a specific business type. The audience includes consultants, designers, developers, translators, and many other ZZP professions.

---

## Legal Requirements

These are mandatory for all customer-facing copy.

### Disclaimer

Always include the following disclaimer near any financial claims on the landing page and in legal pages:

> askwijs automates financial administration. It is not a licensed tax advisor. We recommend consulting a professional for complex tax situations.

### Not financial advice

The phrase "not financial advice" or "not a substitute for professional tax advice" must be visible near any page that shows tax calculations, deduction suggestions, or filing recommendations.

### Pricing transparency

- All displayed prices must include "excl. 21% BTW."
- "30 days free" and "No credit card required" must appear near every pricing CTA.

### Data and security claims

- Bank connections: always note "read-only access" and "we never move your money."
- Data storage: "All data stored in the EU" when making privacy claims.
- AI transparency: "Your financial data is never used for model training" when discussing the AI.

### Feature accuracy

Feature claims in marketing copy must reflect actual, shipped product capabilities. Do not present planned or in-development features as available.

---

## Copy Examples by Section

### Hero headline
"Stop dreading April 30."

### Hero subhead
"Your Dutch taxes, fully automated. Connect your bank, and askwijs handles BTW (Dutch VAT), categorization, and filing."

### Intro paragraph
"A new kind of financial tool. Purpose-built for freelancers and expats in the Netherlands. Handles the work your boekhouder (bookkeeper) charges for. Automatically."

### Feature section headings
- "Make transaction categorization self-driving"
- "Your quarterly BTW. Pre-filled, ready to submit."
- "Your AI financial advisor. Always available."
- "Snap a photo. Wijs does the rest."
- "Connect all your Dutch banks in seconds."

### Feature section descriptions
- "Turn raw bank transactions into organized, tax-ready categories. Wijs uses AI to tag every transaction: business or personal, deductible or not, correct BTW rate applied."
- "Wijs calculates every rubriek from your real transaction data. Review the numbers, click submit. No more staring at empty Belastingdienst forms."
- "Ask Wijs anything about your Dutch taxes, deductions, BTW, or business finances. Answers grounded in your actual transaction data."

### Wijs AI chat responses
- "Your WeWork membership (290/mo) qualifies as a business expense. 100% deductible including BTW. That's 3.480/year."
- "Q1 revenue: 5.600 across 2 clients. 18% above Q4. You may exceed the KOR threshold (small business VAT exemption) by August."

### CTA block
"Stop dreading tax season. Start today."

### Pricing headline
"Simple pricing. No surprises."

### Trust signals
- "PSD2 Open Banking, read-only access"
- "EU-hosted, GDPR compliant"
- "AI You Can Trust: Transaction categorization powered by Anthropic Claude. Your financial data is never used for model training."

### Footer disclaimer
"askwijs automates financial administration. It is not a licensed tax advisor. We recommend consulting a professional for complex tax situations."
