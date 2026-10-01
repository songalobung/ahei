---
name: African Higher Education Index (AHEI)
version: 2.0.0
last_updated: 2026-09-30
status: canonical
principles:
  - editorial-broadsheet
  - calm-restrained
  - zero-gratuitous-decoration
  - high-density-data
  - primary-sourced-auditing

colors:
  surface: '#F7F6F2'
  surface-dim: '#EFECE6'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#EFECE6'
  surface-container: '#E6E3DC'
  surface-container-high: '#dedad2'
  surface-container-highest: '#d5d1c8'
  on-surface: '#171918'
  on-surface-variant: '#676963'
  outline: '#8c8e87'
  outline-variant: '#D9D7D0'
  primary: '#164A3A'
  on-primary: '#FFFFFF'
  primary-container: '#2A6B55'
  on-primary-container: '#FFFFFF'
  primary-fixed: '#d2e4dc'
  on-primary-fixed: '#0d2e24'
  secondary: '#B28A45'
  on-secondary: '#FFFFFF'
  secondary-container: '#faedd9'
  on-secondary-container: '#3b2a0c'
  secondary-fixed: '#faedd9'
  on-secondary-fixed: '#3b2a0c'
  status-success: '#2e684a'
  status-warning: '#b57a1e'
  status-error: '#9e3223'

typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: '500'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-badge:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
    textTransform: uppercase
  tabular-num:
    fontFamily: JetBrains Mono
    fontFeatureSettings: '"tnum"'

radii:
  tables: 0px
  dossiers: 0px
  cards: 2px
  buttons: 4px
  inputs: 4px
  dropdowns: 4px
  badges: 2px
  banned:
    - rounded-full (except circular avatar/dots)
    - rounded-xl
    - rounded-2xl
    - rounded-3xl

voice_and_rules:
  - Avoid AI tech-bro aesthetic (no purple/indigo gradients, no neon glow, no floating cards).
  - Use restrained broadsheet hairlines (1px #D9D7D0, 2px #164A3A anchor borders).
  - Every visible button must have a clear functional purpose; use dropdowns for secondary actions.
  - Numbers and scores must always render in tabular monospace.
  - Maintain WCAG AA contrast ratio at all times.
---

# African Higher Education Index (AHEI) — Canonical Design System

## Architectural Principles
1. **Calm, Authoritative & Institutional**: The visual system feels intentional, restrained, and scholarly.
2. **True Neutral Ivory Canvas**: Primary background is warm off-white `#F7F6F2`, never cold sterile gray or neon-tinted purple.
3. **Institutional Palette**:
   - Primary: Deep forest green `#164A3A`
   - Secondary: Academic gold `#B28A45`
   - Contrast Ink: Charcoal near-black `#171918`
   - Muted Ink: Neutral gray-olive `#676963`
   - Hairlines: Warm border `#D9D7D0`
4. **Crisp Precision**: Strict 0–4px radii across all components. Rounded-2xl and rounded-3xl cards are strictly banned.