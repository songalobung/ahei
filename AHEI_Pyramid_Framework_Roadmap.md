# AHEI Pyramid Framework & Development Roadmap

This document combines the product-to-implementation pyramid with the phased roadmap. Each layer depends on the layer below it: visible product features should be built on trusted data and reproducible rules.

## The AHEI pyramid

```text
                         PUBLIC VALUE
             Discover · Compare · Understand
             Rankings · Profiles · Programs
                          /\
                         /  \
                        /    \
                       / TRUST \
                      / Sources \
                     / Review &   \
                    / Verification \
                   / Audit & freshness\
                  /--------------------\
                 / DETERMINISTIC ENGINE  \
                / Methodology · Scoring   \
               / Confidence · Snapshots    \
              /----------------------------\
             / STRUCTURED DATA FOUNDATION   \
            / Universities · Programs · Geo  \
           / Sources · Observations · History \
          /------------------------------------\
         / PORTABLE, UPGRADEABLE PLATFORM       \
        / Next.js · TypeScript · PostgreSQL       \
       / Supabase · CI · tests · migrations        \
      /--------------------------------------------\
```

The diagram is conceptual: trust, review, and provenance are cross-cutting controls, not a presentation-only feature. Ranking results must be traceable down through methodology and input snapshots to the underlying sourced observations.

## Architecture framework

### Application shape

- Start as a modular monolith using Next.js and TypeScript.
- Organize by domain: universities, programs, rankings, sources, verification, and administration.
- Keep domain operations in typed service/repository modules.
- Use server-rendered pages for public ranking, country, university, and program content.
- Add client-side interactivity only where it improves search, filtering, charts, comparison, or admin workflows.

### Data and trust

- Use PostgreSQL as the source of truth for structured platform data.
- Model sources and field-level observations explicitly.
- Keep verification state and audit history with consequential data changes.
- Enforce public-read and privileged-write boundaries with database row-level security as well as application authorization.
- Archive records needed for historic reporting instead of deleting them.

### Ranking and research jobs

- Keep the ranking engine deterministic and testable.
- Version methodology configuration and preserve the input snapshot for every calculated edition.
- Start calculations and imports as application jobs or scheduled tasks where practical.
- Introduce a separate worker only when execution time, retries, or scale makes it necessary.
- AI research may propose structured observations with evidence, but a human review step is required before publication.

### Upgradeability

- Begin with provider free tiers for prototyping and development, after checking current terms and limits.
- Use standard PostgreSQL schemas, migrations, and exports to keep data portable.
- Isolate provider-specific access behind repository and service interfaces.
- Prefer PostgreSQL search until measured needs warrant a dedicated search product.
- Budget for backups, monitoring, and production availability before public launch; free-tier availability is not a substitute for an operational recovery plan.

## Delivery roadmap

### Phase 0 — Foundation

**Outcome:** A maintainable application can be developed and checked consistently.

- Set up the GitHub repository and contribution conventions.
- Create the Next.js TypeScript application and responsive shell.
- Add environment-variable validation and keep secrets out of source control.
- Configure formatting, linting, type-checking, tests, and GitHub Actions.
- Establish design tokens and the initial public navigation.

**Exit checks:** The application starts locally; CI runs; preview deployment works; no credentials are committed.

### Phase 1 — Data, provenance, and access control

**Outcome:** A small, trustworthy dataset can be maintained safely.

- Create country and region reference data.
- Create university, campus, faculty, subject, and program schemas needed for the first slice.
- Model sources and source observations with effective dates and verification metadata.
- Add verification tasks, roles, audit history, and row-level security.
- Seed a small, realistic dataset; do not fabricate scale.

**Exit checks:** Migrations are repeatable; public access exposes only approved data; unauthorized writes fail; observations can be traced to sources.

### Phase 2 — First university vertical slice

**Outcome:** One institution can be researched, verified, and presented end to end.

- Build typed university and program repositories/services.
- Create researcher forms and a verification queue.
- Render a public profile from verified database records.
- Display source, verification state, and freshness for consequential fields.

**Exit checks:** A researcher can create, review, verify, and publish sourced profile data; changes are auditable.

### Phase 3 — Ranking engine and publication

**Outcome:** A ranking edition is reproducible and controlled.

- Store methodology versions, weights, thresholds, and edition status.
- Implement normalization, missing-data rules, confidence, aggregation, and deterministic tie handling.
- Snapshot the inputs and methodology used for a calculation.
- Implement calculate → review → publish controls and preserve historical editions.
- Test edge cases, reproducibility, and missing values.

**Exit checks:** Identical inputs and methodology produce identical results; no unreviewed ranking-critical change becomes public.

### Phase 4 — Public discovery

**Outcome:** Users can find and evaluate relevant institutions and programs.

- Build Africa, regional, country, and initial subject ranking pages.
- Add search using PostgreSQL full-text and trigram matching.
- Add university profiles, program relationships, and comparison for up to four universities.
- Include verified tuition, admissions, scholarship, and recognition information only where available.
- Add canonical URLs, metadata, breadcrumbs, and meaningful internal links.

**Exit checks:** Search → profile → compare journey works on desktop and mobile; public routes are indexable and have meaningful content.

### Phase 5 — Production readiness

**Outcome:** The public MVP can be launched with appropriate safeguards.

- Test role enforcement and row-level security integration.
- Complete accessibility and performance audits.
- Validate rate limits, session security, secret handling, backups, and restore procedures.
- Add operational logging, job failure reporting, and ranking run identifiers.
- Confirm hosting/database plan terms, capacity, commercial eligibility, and recovery expectations.
- Prepare launch and rollback procedures.

**Exit checks:** Critical student and admin journeys pass; access control and recovery have been tested; production costs and limits are understood.

### Phase 6 — Post-MVP expansion

**Outcome:** Add capabilities in response to validated user and operational needs.

Potential additions:

- AI-assisted research proposals with evidence capture and human approval.
- Student matching with explainable factors and explicit uncertainty.
- Scholarship discovery and deadline alerts.
- Moderated student reviews.
- Institution claim workflows and analytics.
- Dedicated search, separate workers, or a data API when measured scale or product requirements justify them.

## Critical path

```text
Foundation
  -> Structured data + provenance
    -> Verification + authorization
      -> First public university profile
        -> Versioned ranking engine
          -> Ranking review and publication
            -> Search + comparison
              -> QA, accessibility, security, SEO, and launch
```

Do not scale institution/page volume ahead of the source, verification, and ranking foundations. The first milestone should prove one complete, auditable university flow.

## Decision gates

| Decision | Start with | Revisit when |
| --- | --- | --- |
| Hosting | Vercel free tier for prototype/early validation | Usage, commercial terms, or reliability needs exceed the plan |
| Database and auth | Supabase PostgreSQL/Auth/RLS | Capacity, support, or operational needs require an upgrade |
| Search | PostgreSQL full-text + trigram | Relevance, latency, or query volume is measured to be insufficient |
| Background work | In-app jobs or scheduled tasks | Jobs need durable queues, long runtimes, or independent scaling |
| Editorial | Markdown/MDX | Multiple editors need previews, approvals, or non-developer publishing |
| AI research | Defer until evidence/review pipeline exists | A bounded task has measurable value and a human approval path |
