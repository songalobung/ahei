# AHEI

African Higher Education Index

Implementation backlog with phases, dependencies, priorities and acceptance criteria

## Task Breakdown List

| Document | Task Breakdown List |
| --- | --- |
| Version | 1.0 |
| Status | Build-ready baseline |

# Contents

1. Delivery Strategy

2. Legend & Priority Model

3. Phase 0 — Foundation

4. Phase 1 — Data Model & Supabase

5. Phase 2 — Design System & Frontend Shell

6. Phase 3 — University & Program Data

7. Phase 4 — Rankings Engine

8. Phase 5 — Public Rankings & Profiles

9. Phase 6 — Search & Comparison

10. Phase 7 — Admin & Verification

11. Phase 8 — AI Research Pipeline

12. Phase 9 — SEO & Editorial

13. Phase 10 — QA, Security & Launch

14. Phase 11 — Post-MVP V2

15. Definition of Done

16. Critical Path

# 1. Delivery Strategy

Build the platform in vertical slices: create the database foundation, then make one complete university flow work end-to-end before multiplying the number of regions, subjects and institutions. The backlog is intentionally ordered so each phase produces a usable artifact.

| Build rule<br>Never spend weeks generating thousands of pages before the source/provenance model, verification workflow and ranking calculation are stable. |
| --- |

# 2. Legend & Priority Model

| Priority | Meaning |
| --- | --- |
| P0 | Blocking or essential for public MVP. |
| P1 | Important for MVP quality; can follow the core path. |
| P2 | Post-launch enhancement. |
| P3 | Experimental / optional future work. |

# 3. Phase 0 — Foundation

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F0-001 | Create Git repository and branching strategy | P0 | — | Repo with main/dev/PR conventions. |
| F0-002 | Create Next.js TypeScript app | P0 | F0-001 | App boots locally and in preview. |
| F0-003 | Connect Vercel project | P0 | F0-002 | Preview deployment succeeds. |
| F0-004 | Create Supabase projects for dev/staging/prod | P0 | F0-001 | Projects separated by environment. |
| F0-005 | Create environment variable conventions | P0 | F0-004 | No secrets committed; env validation works. |
| F0-006 | Set coding standards, lint, typecheck, formatting | P0 | F0-002 | CI blocks broken builds. |
| F0-007 | Create initial documentation repository structure | P1 | F0-001 | Docs folders and contribution notes. |

# 4. Phase 1 — Data Model & Supabase

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F1-001 | Create country and region tables | P0 | F0-004 | Countries/regions seeded; relationships valid. |
| F1-002 | Create university master table | P0 | F1-001 | CRUD-ready university schema. |
| F1-003 | Create campus/faculty tables | P1 | F1-002 | Hierarchical institution data supported. |
| F1-004 | Create subject/program tables | P0 | F1-002 | Programs linked to universities and subjects. |
| F1-005 | Create tuition/admission/deadline tables | P0 | F1-004 | Time-aware fee and requirement records. |
| F1-006 | Create scholarship tables | P1 | F1-002 | Scholarship eligibility/source structure. |
| F1-007 | Create ranking edition/result/score tables | P0 | F1-002 | Versioned rankings possible. |
| F1-008 | Create sources/source observations | P0 | F1-002 | Every factual observation can carry provenance. |
| F1-009 | Create verification task workflow | P0 | F1-008 | Draft/pending/verified/conflict/stale states. |
| F1-010 | Create audit log tables and triggers/hooks | P0 | F1-008 | Consequential changes traceable. |
| F1-011 | Add RLS policies | P0 | F1-009 | Public read vs admin/private write boundaries enforced. |
| F1-012 | Create realistic seed dataset (small) | P0 | F1-011 | Enough records to demonstrate product without fake scale. |

# 5. Phase 2 — Design System & Frontend Shell

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F2-001 | Define typography, spacing, grids and color tokens | P0 | F0-002 | Tokens documented and reusable. |
| F2-002 | Build global navigation/footer | P0 | F2-001 | Responsive public shell. |
| F2-003 | Build ranking table component | P0 | F2-001 | Accessible table with rank, movement, score. |
| F2-004 | Build source/verification badge components | P0 | F2-001 | Consistent provenance UI. |
| F2-005 | Build scorecard/chart primitives | P0 | F2-001 | Reusable for university and rankings. |
| F2-006 | Build compare selector UI | P1 | F2-003 | Multi-select up to four universities. |
| F2-007 | Build responsive mobile patterns | P0 | F2-002 | No critical layout failures on mobile. |

# 6. Phase 3 — University & Program Data

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F3-001 | Create university repository/service layer | P0 | F1-002 | Typed read/write operations. |
| F3-002 | Create program repository/service layer | P0 | F1-004 | Typed relationships and queries. |
| F3-003 | Build university editor form | P0 | F1-009 | Field-level source/verification controls. |
| F3-004 | Build source editor | P0 | F1-008 | Source metadata management. |
| F3-005 | Build verification queue | P0 | F1-009 | Researchers can review and approve/reject observations. |
| F3-006 | Implement CSV import | P1 | F3-001 | CSV rows validate, dedupe and create reviewable records. |
| F3-007 | Implement duplicate detection | P1 | F3-006 | Potential duplicates surfaced to admin. |
| F3-008 | Create initial program taxonomy | P0 | F1-004 | Core subjects and subsubjects populated. |

# 7. Phase 4 — Rankings Engine

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F4-001 | Define methodology configuration schema | P0 | F1-007 | Weights/thresholds versioned in DB. |
| F4-002 | Implement metric normalization utilities | P0 | F4-001 | Unit tests cover edge cases. |
| F4-003 | Implement missing-data rules | P0 | F4-001 | No hidden zero-filling. |
| F4-004 | Implement dimension scoring | P0 | F4-002 | Inputs generate stable scores. |
| F4-005 | Implement weighted aggregation | P0 | F4-004 | Final score reproducible. |
| F4-006 | Implement confidence score | P0 | F4-003 | Coverage + freshness + provenance logic. |
| F4-007 | Implement rank ordering and ties | P0 | F4-005 | Stable deterministic ranking. |
| F4-008 | Create ranking snapshot job | P0 | F4-007 | Edition stores reproducible snapshot. |
| F4-009 | Build ranking review/publish workflow | P0 | F4-008 | Admin can calculate, review, publish. |
| F4-010 | Write methodology documentation | P0 | F4-001 | Public methodology page mirrors actual implementation. |

# 8. Phase 5 — Public Rankings & Profiles

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F5-001 | Build homepage | P0 | F2-002 | Editorial hero, rankings, discovery entry points. |
| F5-002 | Build Africa rankings page | P0 | F4-009 | Published ranking table + filters. |
| F5-003 | Build regional ranking pages | P0 | F5-002 | Five regional routes supported. |
| F5-004 | Build country ranking pages | P0 | F5-003 | Dynamic country pages. |
| F5-005 | Build university profile page | P0 | F3-001 | Profile rendered from DB. |
| F5-006 | Build ranking history chart | P0 | F4-009 | Historical editions visualized. |
| F5-007 | Build score breakdown module | P0 | F4-004 | Dimension scores and explanation. |
| F5-008 | Build programs section on profile | P0 | F3-002 | Programs grouped/filterable. |
| F5-009 | Build admissions/tuition/scholarships sections | P0 | F3-005 | Verified records shown with sources. |
| F5-010 | Build accreditation/verification section | P0 | F3-005 | Recognition details and source displayed. |

# 9. Phase 6 — Search & Comparison

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F6-001 | Implement Postgres full-text/trigram search | P0 | F3-001 | University/program/country search works. |
| F6-002 | Build search results page | P0 | F6-001 | Grouped and filtered results. |
| F6-003 | Build university compare endpoint | P0 | F5-005 | Up to four profiles returned. |
| F6-004 | Build compare page | P0 | F6-003 | Responsive comparison table/charts. |
| F6-005 | Implement saved comparison URL | P1 | F6-004 | Shareable comparison links. |
| F6-006 | Add subject/country/budget filters | P0 | F6-001 | Core discovery filters functional. |

# 10. Phase 7 — Admin & Verification

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F7-001 | Build admin dashboard | P0 | F1-010 | Operational cards and queues. |
| F7-002 | Implement role model | P0 | F1-011 | Super admin/data admin/researcher/editor roles. |
| F7-003 | Build university admin list | P0 | F7-001 | Filter/sort/bulk actions. |
| F7-004 | Build university edit workflow | P0 | F7-003 | Field-level provenance. |
| F7-005 | Build verification inbox | P0 | F3-005 | Assign, approve, reject, conflict. |
| F7-006 | Build ranking administration | P0 | F4-009 | Create/edit/calculate/review/publish editions. |
| F7-007 | Build audit log viewer | P0 | F1-010 | Filterable history of sensitive changes. |
| F7-008 | Add admin MFA requirement | P0 | F7-002 | Privileged accounts protected. |
| F7-009 | Add bulk import/export tooling | P1 | F3-006 | Safe batch operations with review. |

# 11. Phase 8 — AI Research Pipeline

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F8-001 | Define research task schema | P0 | F1-008 | Task includes source, target, field and status. |
| F8-002 | Build source retrieval layer for permitted sources | P0 | F8-001 | Fetch/extract content within usage constraints. |
| F8-003 | Build structured extraction prompts/schemas | P0 | F8-002 | LLM outputs machine-valid data. |
| F8-004 | Build evidence capture | P0 | F8-003 | Extracted value points to evidence. |
| F8-005 | Build conflict detection | P0 | F8-004 | Conflicting observations flagged. |
| F8-006 | Build human approval UI | P0 | F8-005 | AI candidates never auto-publish critical fields. |
| F8-007 | Track model/prompt versions and costs | P1 | F8-003 | Research jobs are auditable. |
| F8-008 | Add stale-data detection jobs | P1 | F3-005 | Records crossing freshness thresholds are queued. |
| F8-009 | Add duplicate/university merge suggestions | P1 | F8-005 | Potential duplicate entities reviewed by admin. |

# 12. Phase 9 — SEO & Editorial

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F9-001 | Define metadata templates | P0 | F5-002 | Titles/descriptions based on actual content. |
| F9-002 | Generate XML sitemap(s) | P0 | F5-004 | Indexable pages included. |
| F9-003 | Implement canonical URLs | P0 | F5-004 | No accidental duplicate indexation. |
| F9-004 | Build methodology/about/trust pages | P0 | F4-010 | Public explanation of data and rankings. |
| F9-005 | Connect Sanity editorial CMS | P1 | F5-001 | Articles/guides publish successfully. |
| F9-006 | Create country/subject guide templates | P1 | F9-005 | Editorial pages reusable and structured. |
| F9-007 | Add internal linking rules | P1 | F9-001 | Rankings → universities → programs → guides. |

# 13. Phase 10 — QA, Security & Launch

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F10-001 | Unit-test ranking engine | P0 | F4-010 | Critical calculation coverage passes. |
| F10-002 | Integration-test Supabase/RLS | P0 | F7-008 | Unauthorized mutations fail. |
| F10-003 | E2E-test core student journey | P0 | F6-004 | Search → profile → compare works. |
| F10-004 | E2E-test admin journey | P0 | F7-008 | Edit → verify → publish works. |
| F10-005 | Accessibility audit | P0 | F5-010 | Critical issues fixed; target WCAG 2.2 AA practices. |
| F10-006 | Performance audit | P0 | F5-004 | Core public routes meet defined performance goals. |
| F10-007 | Security review | P0 | F7-008 | Auth, RLS, rate limits and secret handling checked. |
| F10-008 | SEO technical audit | P0 | F9-007 | Canonical, sitemap, metadata and indexability validated. |
| F10-009 | Backup/restore rehearsal | P1 | F1-010 | Restore procedure tested. |
| F10-010 | Production seed & first ranking edition | P0 | F10-001 | Approved dataset and AHEI 2027 edition live-ready. |
| F10-011 | Launch checklist and rollback runbook | P0 | F10-007 | Documented go-live/rollback steps. |

# 14. Phase 11 — Post-MVP V2

| ID | Task | Priority | Depends on | Deliverable / acceptance |
| --- | --- | --- | --- | --- |
| F11-001 | Student Match questionnaire | P1 | F6-006 | Transparent matching based on user filters. |
| F11-002 | Scholarship finder UX | P1 | F9-005 | Filter by eligibility and deadlines. |
| F11-003 | Deadline alerts | P1 | F11-002 | Email/optional messaging reminders. |
| F11-004 | Accommodation database | P2 | F5-005 | Residence/private housing records. |
| F11-005 | Verified student reviews | P2 | F11-004 | Review system with moderation. |
| F11-006 | Institution claim workflow | P1 | F7-005 | University representatives can request access. |
| F11-007 | Institution analytics dashboard | P2 | F11-006 | Benchmarking and audience insights. |
| F11-008 | Dedicated search engine migration evaluation | P2 | F6-001 | Move only if Postgres search becomes limiting. |
| F11-009 | AHEI data API | P2 | F7-009 | Authenticated, documented access to licensed/owned datasets. |

# 15. Definition of Done

Code reviewed and merged through the repository workflow.

Typecheck, lint and automated tests pass.

No untracked secrets or credentials.

Database migrations are reproducible.

Relevant UI works on desktop and mobile.

Accessibility basics validated.

Source/provenance behavior exists for new factual fields.

Admin permissions are respected.

Analytics/observability events or logs are present where operationally relevant.

Documentation updated for any new domain behavior or ranking logic.

# 16. Critical Path

Foundation   → Database + RLS     → Data/source/verification model       → Ranking engine         → Ranking publication workflow           → Public rankings + profiles             → Search + compare               → QA/security/SEO                 → Launch  AI research can begin once source + observation + verification schemas exist, but it must plug into the same approval workflow rather than bypass it.

| Founder-level sequencing<br>The highest-leverage work is not generating pages. It is defining the canonical university data model, provenance, verification states and ranking methodology so every later feature uses the same source of truth. |
| --- |
