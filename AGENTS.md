# Project Design & Development Rules

## Strict Design Governance (Lock Rule)
- **Always follow `DESIGN.md`**: Do not invent new colors, fonts, shadows, or border radii.
- **Palette Lock**:
  - Primary Background: `#F7F6F2` (Ivory warm neutral broadsheet).
  - Primary Institutional: `#164A3A` (Deep Forest Green).
  - Secondary Accent: `#B28A45` (Academic Gold).
  - Primary Text: `#171918` (Charcoal near-black).
  - Secondary Text: `#676963` (Muted gray-olive).
  - Rules & Borders: `#D9D7D0` (1px warm hairline) and `#164A3A` (2px anchor rule).
- **Typography Lock**:
  - Headings & Titles: `Newsreader` (serif).
  - Body & UI Controls: `Work Sans` (sans-serif).
  - Tabular Data, Ranks & Badges: `JetBrains Mono` (monospace).
- **Geometry Lock**:
  - Tables, Dossiers & Panels: `0px` radius (crisp broadsheet edges).
  - Buttons, Inputs & Dropdowns: `4px` radius (`rounded-xs`).
  - Badges: `2px` radius.
  - Banned: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full` (except circular avatar dots).
- **Editorial Voice**:
  - Calm, restrained, authoritative, and primary-sourced.
  - No generic AI tech-bro patterns (no purple/indigo gradients, no neon glow, no floating bubbly cards).
- **Ambiguity Rule**: If a design pattern, component, or layout is not explicitly covered in `DESIGN.md`, pause and ask the user before implementing.
