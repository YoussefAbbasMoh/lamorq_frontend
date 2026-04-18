# LAMORQ — Website SEO & Content Rules

## 1. BRAND IDENTITY & VOICE

**Brand Name:** LAMORQ  
**Brand Direction:** Premium Natural Clean  
**Origin:** Egyptian skincare brand  
**Core Positioning:** Effective skincare built on science-backed, gentle ingredients — where science meets nature, without the complexity.

### Voice Rules

- Tone: Confident, clean, friendly — like a knowledgeable friend, not a doctor.
- Language target: English (primary), Arabic Egyptian dialect (secondary for social/product descriptions).
- Words to USE: glow, even, smooth, gentle, light, bright, balance, care, clean, nourish, soft, visible results.
- Words to AVOID: treat, cure, heal, therapy, medical, clinical prescription, dermatologist-only, علاجية, تشخيص, دواء, علاج, يعالج — **NEVER use medical or therapeutic claims**.
- No complex scientific jargon in consumer-facing copy. Ingredient names are fine when accompanied by plain-language explanations.
- Simple sentences. Short paragraphs. Real results language.

---

## 2. SEO GROUND RULES

### Page Titles (`<title>`)

- Format: `{Primary Keyword} — LAMORQ`
- Max 60 characters
- Every page must have a unique title
- Examples:
  - Homepage: `Natural Skincare That Actually Works — LAMORQ`
  - Glow Serum: `Glow Serum for Brighter, Even Skin — LAMORQ`
  - Tone Cream: `Gentle Brightening Cream for Sensitive Areas — LAMORQ`

### Meta Descriptions

- Max 155 characters
- Must contain the page's primary keyword naturally
- Must end with a soft CTA or benefit statement
- No keyword stuffing — write for humans first

### Heading Hierarchy (`H1` → `H6`)

- One `H1` per page only — must contain primary keyword
- `H2`s = main sections (benefits, ingredients, how to use, etc.)
- `H3`s = subsections or individual ingredient callouts
- Never skip heading levels

### URL Structure

- All lowercase, hyphens only (no underscores, no spaces)
- Keep short and descriptive

### Image SEO

- All images must have descriptive `alt` text — describe what's in the image + include product name when relevant
- File names: `lamorq-glow-serum-bottle.webp` (not `IMG_2034.jpg`)
- Use WebP format, compress before upload
- Lazy load all non-above-the-fold images (`loading="lazy"`)

### Canonical Tags

- Every page must have a canonical `<link>` tag pointing to itself

### Structured Data (JSON-LD)

- Product pages → use `Product` schema including: name, description, image, brand, offers (price, currency, availability)
- Homepage → use `Organization` schema
- Blog posts (if any) → use `Article` schema
- Do NOT include any medical claims in structured data

### Open Graph & Twitter Cards

- Every page must have `og:title`, `og:description`, `og:image`, `og:url`
- `og:image` should be 1200×630px
- Match OG title/description to the page's meta title/description (don't duplicate exact same text — slight variation is fine)

---

## 3. PRODUCT COPY RULES

### General Rules for All Products

- Lead with the **feeling/result**, not the ingredient list
- Follow with ingredient explanation in plain language
- Never say the product "treats," "cures," or "heals" anything
- Always include a "How to Use" section
- Include a "Who It's For" section (skin type, concern — no medical framing)

---

## 4. PRODUCT 1 — GLOW SERUM

### Primary Keyword

`glow serum for brighter skin`

### H1

`Glow Serum — Brighter Skin, Visibly Even`

### Meta Title

`Glow Serum for Brighter, Even Skin — LAMORQ`

### Meta Description

`A lightweight daily serum with Niacinamide, Vitamin C & Hyaluronic Acid. Visibly brighter, more even skin — gentle enough for everyday use.`

---

## 5. PRODUCT 2 — TONE CREAM

### Primary Keyword

`brightening cream for sensitive areas`

### H1

`Tone Cream — Gentle Brightening for Sensitive Areas`

### Meta Title

`Gentle Brightening Cream for Sensitive Areas — LAMORQ`

### Meta Description

`LAMORQ Tone Cream evens out skin tone in sensitive areas with Alpha Arbutin, Kojic Dipalmitate & Licorice Extract. Gentle, effective, daily use.`

---

## 6. HOMEPAGE SEO

### H1

`Simple Skincare. Real Results.`

### Meta Title

`Natural Skincare That Actually Works — LAMORQ`

### Meta Description

`LAMORQ is an Egyptian skincare brand built on science-backed, gentle ingredients. Effective products for brighter, even, healthy-looking skin.`

---

## 7. GENERAL CONTENT RULES (Apply Everywhere)

- Short sentences. One idea per sentence.
- No passive voice where possible
- No filler words: "really," "very," "amazing," "revolutionary"

### Performance SEO

- Core Web Vitals matter — avoid heavy scripts that block render
- Fonts: preload above-the-fold fonts
- Above-the-fold images: use `fetchpriority="high"`, NOT `loading="lazy"`
- Below-the-fold images: always `loading="lazy"`

---

## 8. WHAT NOT TO DO — HARD STOPS

| ❌ Never do this | ✅ Do this instead |
|---|---|
| Use "treats," "cures," "heals" | Use "helps," "supports," "reduces the look of" |
| Use "علاجي / علاجية / يعالج" | Use "فعّال / يحسن مظهر / يهتم بـ" |
| Make medical or diagnostic claims | Describe visible, cosmetic outcomes only |

---

*This file is the source of truth for all LAMORQ website copy and SEO implementation. Any new page, product, or section created must follow these rules.*
