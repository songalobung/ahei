# AHEI

African Higher Education Index

Technical architecture, data model, system design and operating model for AHEI

## Design & Architecture Document

| Document | Design & Architecture Document |
| --- | --- |
| Version | 1.0 |
| Status | Build-ready baseline |

# Contents

1. Architecture Objectives & Principles

2. System Overview

3. Frontend Architecture

4. Backend & API Architecture

5. Database Architecture

6. Core Data Model

7. Ranking Engine

8. AI Research Pipeline

9. Admin Architecture

10. Search & SEO Architecture

11. Authentication & Authorization

12. Security & Privacy

13. Caching, Performance & Scalability

14. Observability & Operations

15. Deployment & Environments

16. Testing Strategy

17. Backup & Recovery

18. Third-Party Integrations

19. Key API Shapes

20. Folder Structure

21. Architecture Decision Record Summary

# 1. Architecture Objectives & Principles

Use a modular monolith first; avoid premature microservices.

Keep the relational database as the source of truth for structured university intelligence.

Treat sources and provenance as first-class records.

Separate public read paths from privileged mutation paths.

Make ranking calculations deterministic and versioned.

Make AI asynchronous, reviewable and bounded by data governance rules.

Prefer server-rendered public content with selective client interactivity.

Design for eventual scale without paying the complexity cost on day one.

# 2. System Overview

Browser / Search Engine         │         ▼ Next.js App Router (public + admin UI)         │         ├── Server Components / Route Handlers         ├── Server Actions (validated mutations)         └── Client components (charts, filters, compare)         │         ▼ Supabase   ├── PostgreSQL (source of truth)   ├── Auth   ├── Storage (logos/documents where permitted)   └── Row Level Security         │         ├── Ranking Engine (Python/TypeScript job)         ├── AI Research Worker         ├── Search Index (later: dedicated engine)         └── Scheduled jobs / queues         │         ▼ External Sources / Official Documents / Licensed Data

| Architecture choice<br>Start as a modular monolith. Use background jobs for ranking generation and AI research. Introduce separate services only when scale, isolation or compliance creates a real need. |
| --- |

# 3. Frontend Architecture

## 3.1 Next.js structure

App Router with route groups for public, admin and utility pages.

Server Components for ranking tables, university profiles and SEO-heavy content.

Client Components only where interaction is meaningful: filters, charts, compare builder, admin forms.

Typed data access layer rather than calling Supabase directly from arbitrary UI components.

Shared design system for typography, tables, stat cards, badges, ranking movement and source displays.

## 3.2 UI modules

| Module | Purpose |
| --- | --- |
| RankingTable | Dense ranked tables with sorting/filtering and movement. |
| ScoreBreakdown | Component scores and methodology explanation. |
| SourceBadge | Source, date and verification status display. |
| UniversityHeader | Identity, rank, location, actions. |
| UniversityStatGrid | Structured key metrics. |
| ProgramCard | Program-level discovery. |
| CompareWorkspace | Select up to four universities and compare. |
| SearchBox | Universal search with suggestions. |
| DataConfidence | Confidence/freshness visual. |
| AdminDataTable | CRUD + filters + bulk operations. |

# 4. Backend & API Architecture

Use a typed service/repository layer between application routes and Supabase. Keep domain operations centralized so ranking rules, verification transitions and permission checks are not duplicated across the UI.

/src   /app     /(public)     /(admin)     /api   /components   /domain     /universities     /programs     /rankings     /sources     /verification   /lib     /supabase     /auth     /search     /validation   /jobs     /rankings     /ai-research   /types   /utils

## 4.1 API rules

Public GET endpoints or server-rendered queries expose only published/approved data.

Admin mutation endpoints enforce role and entity-level permissions.

Validate all inputs with a shared schema library such as Zod.

Use idempotency for import jobs and ranking generation requests.

Rate-limit public search and expensive compare queries.

Return stable error codes for UI handling and observability.

# 5. Database Architecture

## 5.1 Core entities

| Entity | Key purpose |
| --- | --- |
| countries | Country reference data and geographic metadata. |
| regions | AHEI-defined African geographic groups. |
| universities | Institution master record. |
| campuses | Campus locations and attributes. |
| faculties | Academic organizational units. |
| subjects | Normalized subject taxonomy. |
| programs | Specific degrees/programs. |
| program_admissions | Program-level entry rules. |
| tuition_records | Fees and tuition observations over time. |
| scholarships | Funding opportunities. |
| deadlines | Application/intake deadline records. |
| rankings | Ranking edition definitions. |
| ranking_results | University/subject result per edition. |
| ranking_scores | Dimension-level inputs and outputs. |
| sources | Source registry. |
| source_observations | Specific claim/value from a source. |
| verification_tasks | Human review workflow. |
| reviews | Student/user reviews after community layer launches. |
| articles | Editorial content. |
| audit_logs | Immutable-ish change history. |

# 6. Core Data Model

Country 1 ── * University * ── * Campus Region  1 ── * Country University 1 ── * Faculty University 1 ── * Program * ── 1 Subject Program 1 ── * TuitionRecord Program 1 ── * ProgramAdmission University 1 ── * Scholarship (or global scholarship with eligible institutions) University 1 ── * RankingResult * ── 1 RankingEdition RankingResult 1 ── * RankingScore Any factual entity/value ── * SourceObservation * ── 1 Source SourceObservation 1 ── * VerificationTask Any mutable entity ── * AuditLog

## 6.1 Example university table

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| slug | text | Unique canonical URL slug. |
| name | text | Official display name. |
| aliases | jsonb | Alternative names/search aliases. |
| country_id | uuid | FK countries. |
| city | text | Primary city. |
| institution_type | enum | Public/private/other. |
| founded_year | int nullable | Nullable when unknown. |
| website_url | text | Official website. |
| status | enum | Active/closed/merged/pending. |
| verification_status | enum | Draft/pending/verified/conflicting/stale. |
| last_verified_at | timestamptz | Freshness signal. |

## 6.2 Example source observation table

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Observation ID. |
| entity_type | text | University/program/ranking metric/etc. |
| entity_id | uuid | Target record. |
| field_name | text | Field being supported. |
| value_json | jsonb | Observed value before normalization. |
| source_id | uuid | FK sources. |
| observed_at | timestamptz | When collected. |
| effective_from | date nullable | When value becomes applicable. |
| method | enum | Manual/AI extraction/import/API/etc. |
| confidence | numeric | Internal confidence score. |
| review_status | enum | Draft/verified/rejected/conflicting. |

# 7. Ranking Engine

## 7.1 Pipeline

Raw observations    ↓ Validation / deduplication    ↓ Coverage calculation    ↓ Metric normalization    ↓ Dimension scores    ↓ Weighted aggregation    ↓ Confidence / eligibility rules    ↓ Rank ordering    ↓ Ranking snapshot    ↓ Publish approval

## 7.2 Determinism requirements

Same inputs + same methodology version must generate the same result.

All transformations have named/versioned functions.

Store the input snapshot used for a published edition or a reproducible reference to it.

Use tests around normalization, missing data and tie handling.

Never compute ranking scores from live mutable fields without snapshotting the edition inputs.

## 7.3 Ranking publication states

| State | Meaning |
| --- | --- |
| Draft | Being prepared. |
| Calculated | Job completed, not yet public. |
| Under review | Research/admin review in progress. |
| Published | Visible to the public. |
| Superseded | Historic edition retained but not current. |

# 8. AI Research Pipeline

Research task created        ↓ Source retrieval (permitted)        ↓ Document/text extraction        ↓ LLM structured extraction        ↓ Schema validation        ↓ Conflict / freshness checks        ↓ Human review queue        ↓ Approved observation        ↓ Database update + audit log

## 8.1 AI worker contracts

Input: source reference, extraction schema, target entity/field and context.

Output: structured candidate value, evidence span/reference, confidence, notes and proposed status.

Hard rule: worker cannot directly publish ranking-critical values.

All prompts, models and parsers are versioned for reproducibility.

Failed parsing produces a task failure, not a guessed value.

# 9. Admin Architecture

Dashboard surfaces operational metrics first: pending verification, stale data, conflicts, failed jobs, upcoming ranking deadlines.

Entity editor supports field-level provenance and verification state.

Bulk review supports approve/reject/assign with guardrails.

Ranking editor can manage methodology editions, weights and publication workflow.

Audit log is searchable by entity, actor, date and action.

# 10. Search & SEO Architecture

## 10.1 Search strategy

Start with PostgreSQL full-text/trigram search for MVP.

Move to Meilisearch/Algolia/OpenSearch only when query volume or ranking complexity justifies it.

Index university names, aliases, cities, countries, programs and subjects.

Use search synonyms for common abbreviations and alternative university names.

## 10.2 Programmatic SEO guardrails

Generate only pages backed by meaningful data.

Use canonical tags.

Provide unique page titles/descriptions based on actual data.

Avoid duplicate regional/country permutations with no substantive differences.

# 11. Authentication & Authorization

| Layer | Implementation direction |
| --- | --- |
| Authentication | Supabase Auth; email/password initially, optional OAuth later. |
| Authorization | Application roles + RLS policies; never trust client-supplied role. |
| Admin MFA | Required before production access for privileged roles. |
| University representatives | Verified email/domain + manual approval initially. |
| Session security | HTTP-only secure cookies / Supabase recommended pattern. |

# 12. Security & Privacy

RLS enabled on protected tables.

Service-role credentials never exposed to browser.

Secrets stored in managed environment variables.

Rate limit public search and mutation endpoints.

Sanitize/validate imported HTML and URLs.

Separate PII from public university data; collect only what the product needs.

Admin actions and sensitive exports logged.

Data retention policies defined before launch for accounts and reviews.

# 13. Caching, Performance & Scalability

Cache published ranking pages and university pages aggressively; invalidate on publish/update.

Use server-side pagination for large ranking tables.

Avoid client fetching entire datasets.

Precompute ranking snapshots and aggregate pages.

Use background jobs for AI extraction, ranking computation, sitemap generation and heavy imports.

Store media in optimized formats and use responsive images.

# 14. Observability & Operations

| Area | Minimum implementation |
| --- | --- |
| Application errors | Structured logs + error tracking. |
| Database | Query monitoring, slow query review, backups. |
| Jobs | Job ID, status, attempts, duration, failure reason. |
| Ranking runs | Methodology version + input snapshot ID + output checksum. |
| AI | Model/prompt version, token/cost tracking, outcome status. |
| Security | Auth events, privilege changes, suspicious access alerts. |

# 15. Deployment & Environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Developer work | Synthetic/local fixtures. |
| Preview | PR validation | Synthetic or sanitized staging data. |
| Staging | End-to-end QA | Near-production structure, non-public. |
| Production | Public platform | Real verified data. |

Vercel for web deployment.

Supabase project(s) separated by environment.

Database migrations committed to version control.

CI runs lint, typecheck, unit tests, build and selected integration tests.

# 16. Testing Strategy

| Test level | Examples |
| --- | --- |
| Unit | Ranking normalization, missing data rules, URL slug generation. |
| Integration | Database repositories, RLS, ranking generation, import workflow. |
| E2E | Search → profile → compare; admin edit → verify → publish. |
| Visual | Homepage, ranking table, profile, compare, admin responsive states. |
| Data quality | Duplicate detection, source completeness, stale records. |
| Security | Role bypass attempts, input validation, auth/session behavior. |

# 17. Backup & Recovery

Automated database backups through managed infrastructure.

Export critical ranking snapshots and methodology versions.

Maintain recovery runbook with owner and tested restoration procedure.

Never treat source websites as the only backup of AHEI-specific transformed data.

# 18. Third-Party Integrations

| Integration | Use | Rule |
| --- | --- | --- |
| Supabase | DB/auth/storage | Source of truth for platform data. |
| Vercel | Hosting/CDN | Production web runtime. |
| Sanity | Editorial CMS | Articles/guides; factual institutional data remains in core DB. |
| Map provider | Geographic visualization | Use licensed tiles/API. |
| Analytics | Product analytics | Privacy-minimizing configuration. |
| LLM provider | AI extraction/summarization | No autonomous publication of ranking-critical values. |

# 19. Key API Shapes

GET    /api/rankings?region=east-africa&edition=2027 GET    /api/universities/{slug} GET    /api/universities/{slug}/programs GET    /api/subjects/{slug}/rankings?edition=2027 GET    /api/compare?ids=u1,u2,u3 GET    /api/search?q=computer+science POST   /api/admin/research-tasks POST   /api/admin/verification/{id}/approve POST   /api/admin/rankings/{edition}/calculate POST   /api/admin/rankings/{edition}/publish

# 20. Folder Structure

ahei/ ├── apps/ │   └── web/ │       ├── src/app/ │       ├── src/components/ │       ├── src/domain/ │       ├── src/jobs/ │       ├── src/lib/ │       └── src/types/ ├── packages/ │   ├── ui/ │   ├── config/ │   ├── validation/ │   └── ranking-engine/ ├── supabase/ │   ├── migrations/ │   ├── seed/ │   └── functions/ ├── workers/ │   └── research/ ├── docs/ │   ├── product/ │   ├── architecture/ │   └── methodology/ └── .github/workflows/

# 21. Architecture Decision Record Summary

| ADR | Decision | Reason |
| --- | --- | --- |
| ADR-001 | Modular monolith first | Lower complexity; sufficient for MVP. |
| ADR-002 | Supabase PostgreSQL source of truth | Relational model fits university/program/ranking relationships. |
| ADR-003 | Next.js App Router | SEO + server rendering + interactive React ecosystem. |
| ADR-004 | Versioned ranking snapshots | Historical reproducibility and auditability. |
| ADR-005 | AI proposes, humans approve | Protect ranking/data integrity. |
| ADR-006 | Field-level provenance | Trust and correction workflows. |
| ADR-007 | Dedicated search later | Postgres search is adequate until scale demands more. |
