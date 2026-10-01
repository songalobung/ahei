# AHEI UI/UX Design Audit & Competitive Benchmark

**Date:** 2026-09-30  
**Phase:** Phase 1 (Audit) & Phase 2 (Design System Foundations)  
**Evaluator:** Product Design, UX Architecture & Editorial Engineering

---

## 1. Audit of Current UI: Where It Fails & Looks "AI-Generated"

| Element / Pattern | Current Implementation Flaw | Redesign Remedy |
| :--- | :--- | :--- |
| **Dark Mode Monotony** | Generic dark SaaS `#0B0F17` with neon emerald `#10B981` pills, giving the vibe of a crypto tool, hacker dashboard, or AI wrapper. | Shift to an **editorial institution palette**: Warm ivory/slate light mode default (`#FBFBFD` / `#F4F5F7`) with an authoritative Oxford/Midnight navy accent (`#0A192F` / `#0C1829`), rich forest green provenance badges (`#14532D`), and crisp warm paper typography. |
| **Giant Rounded Cards** | Almost every single block of text is wrapped in an identical `rounded-2xl` or `rounded-3xl` dark card with `border-slate-800`. | **Eradicate unnecessary cards.** Use editorial dividers, asymmetric newspaper-style columns, inline tabular lists, and structured section breaks (like *The Guardian*, *Financial Times*, or *Times Higher Education*). |
| **Pill Buttons & Neon Sparks** | Tiny neon pills, pulse animations, and generic badge overload (`Verified 100%`). | Restrained typographic labels, subtle hairline borders (`#E2E8F0`), serif display headings (Playfair/Merriweather or sharp modern News Gothic like Inter Display), and clean data chips. |
| **Hero Section Stereotypes** | Centered giant hero title with generic "Discover, Compare & Evaluate..." copy and a floating search bar. | **Editorial publication masthead**: "AFRICA'S UNIVERSITIES, MEASURED." with issue date, live audited data ticker, regional spotlights, and direct tabular entry points. |
| **Rankings Presentation** | Generic table with heavy background hover states and centered neon badge numbers. | **Dense, authoritative ranking table** with movement arrows (↑2, ↓1, =), audited dimension bars (Research, Teaching, Employability, Citations), clear country flags/codes, and expandable drawer methodology. |
| **University Profile Structure** | Three separate cards for stats, tuition, and admissions with no cohesive institutional story. | **Institutional dossier architecture**: Official crest/header, accreditation status banner, sticky sub-navigation tabs (*Overview · Rankings · Faculties & Programmes · Costs & Living · Admissions · Research · Sourced Provenance*), and side-by-side comparative benchmarks. |

---

## 2. Design System Matrix (Real Products Benchmark)

We extract specific operational principles from industry benchmarks:
- **QS / TopUniversities & THE:** Density of metrics, clear subject breakdowns, transparent ranking methodology notes, and dual-score visualizations (overall vs. indicator).
- **The Guardian University Guide:** High editorial clarity, crisp data columns, bold serif headers, and zero fluff.
- **Financial Times / Bloomberg:** Authoritative typography, hairline borders, muted palettes, high information density, and data provenance as a first-class citizen.
- **Niche & Studyportals:** Clear student-centric cost breakdowns (domestic vs. international, living costs, application deadlines) without losing academic rigor.

---

## 3. The New AHEI Visual Language & Design Tokens

### A. Color Palette: Editorial, Prestigious & Calm
- **Backgrounds:** Clean, bright academic white/cream (`#FFFFFF`, `#F8F9FA`, `#F1F3F5`) with deep midnight navy surfaces (`#0A1120`, `#0F172A`) for masthead / hero contrasts.
- **Text & Editorial:** Obsidian (`#0F172A`), Slate Charcoal (`#334155`), Muted Pewter (`#64748B`).
- **Brand & Accents:**
  - *Heritage Cobalt / Indigo:* `#1E3A8A` (Academic prestige)
  - *Audited Emerald:* `#047857` (Verified provenance and trust indicators)
  - *Amber / Ochre:* `#B45309` (Preliminary / needs review status)
  - *Crimson:* `#B91C1C` (Stale / unaccredited alerts)

### B. Typography & Scale
- **Headings:** Modern, sharp, authoritative display typeface (`Cinzel` / `Newsreader` / `Playfair Display` or high-contrast sans `Inter Display`).
- **Data & Tables:** Tabular figures (`font-variant-numeric: tabular-nums`) with clean monofont labels for IDs and codes (`JetBrains Mono` / `Courier`).
- **Body & Prose:** Highly readable `Inter` / `Source Serif 4` at 1.5 line height.

### C. Layout & Information Hierarchy
- **No decorative blobs or random gradients.**
- **Hairline dividers** (`border-slate-200` in light, `border-slate-800` in dark) replace heavy card containers.
- **Data density** is calibrated: high density for ranking and comparison tables; generous, structured rhythm for university dossiers and editorial guides.

---

*Phase 1 Audit complete. Proceeding immediately to Phase 2 (Design System implementation in Tailwind) and Phase 3 (Redesigning Header, Masthead, Rankings, and University Profile).*
