# AHEI

African Higher Education Index

A complete product specification for building AHEI with AI-assisted development

## Product Requirements Document

| Document | Product Requirements Document |
| --- | --- |
| Version | 1.0 |
| Status | Build-ready baseline |

# Contents

1. Executive Summary & Product Vision

2. Goals, Non-Goals & Principles

3. Target Users & Personas

4. Product Scope & Release Strategy

5. Functional Requirements

6. Ranking & Methodology Requirements

7. Data Requirements & Provenance

8. AI Requirements

9. Admin & Governance

10. Search, SEO & Content Requirements

11. Trust, Safety, Privacy & Legal Requirements

12. Non-Functional Requirements

13. Business & Monetization Requirements

14. Analytics & KPIs

15. MVP Acceptance Criteria

16. Open Decisions

# 1. Executive Summary & Product Vision

AHEI (African Higher Education Index) is an Africa-first higher-education intelligence platform that combines university rankings, structured institutional data, program discovery, comparisons, admissions information, scholarships, student experience and research intelligence. The public website is the discovery layer; the underlying dataset, verification workflow and ranking engine are the strategic core.

| Product promise<br>Make African higher education easier to understand, compare and navigate by turning fragmented university information into structured, sourced, transparent and searchable intelligence. |
| --- |

## 1.1 Product pillars

Rankings: Africa, regional, country and subject rankings with transparent methodology and historical movement.

University intelligence: detailed profiles, metrics, programs, tuition, admissions, accreditation, research and outcomes.

Student discovery: search, filters, comparison, cost estimation, scholarships, deadlines and future student-match tools.

Institutional intelligence: benchmarking, data correction, profile management, analytics and eventually an API/data product.

Trust infrastructure: source attribution, last-verified timestamps, confidence indicators, audit logs and human review.

## 1.2 Product vision statement

AHEI should become the reference layer for understanding African universities: the place students, families, researchers, institutions and education businesses visit when they need a structured answer about African higher education.

# 2. Goals, Non-Goals & Principles

## 2.1 Goals

Create a scalable database covering universities across all African countries, beginning with a smaller set of launch markets for data quality.

Publish a credible AHEI ranking system whose methodology, inputs and uncertainty are understandable to users.

Generate reusable university and program pages from structured data instead of hand-coding individual pages.

Provide excellent student decision tools without presenting recommendations as unquestionable truth.

Enable an internal research/admin team to continuously update, verify and audit data.

Build a foundation that can later support institutional analytics, recruitment products and a data API.

## 2.2 Non-goals for V1

A full application/visa-processing platform.

A marketplace where universities can pay to alter their ranking positions.

Real-time universal data coverage for every university on day one.

An autonomous AI system that publishes ranking-changing information without human review.

A social network or general student community unrelated to university decision-making.

## 2.3 Product principles

Evidence over decoration: every consequential metric should have provenance.

No fabricated data: missing data stays missing; derived estimates must be labeled as derived.

Ranking independence: commercial relationships cannot directly purchase ranking position.

Africa-first depth: regional and country context matters, not only global prestige.

Explainability: users should be able to understand why a number appears.

Progressive disclosure: simple answers first, deeper analytics underneath.

# 3. Target Users & Personas

| Persona | Primary jobs | Key needs | Priority |
| --- | --- | --- | --- |
| Prospective student | Find and compare universities/programs | Rankings, requirements, tuition, scholarships, fit | P0 |
| Parent/guardian | Evaluate risk, cost and value | Credibility, cost, accreditation, outcomes | P0 |
| Current student | Research options and share experience | Reviews, accommodation, transfers, postgraduate options | P1 |
| University representative | Maintain institutional information | Claim profile, submit corrections, analytics | P1 |
| Researcher/analyst | Study African higher education | Structured data, sources, history, exports | P1 |
| Employer/recruiter | Understand talent pools | Program strength, graduate outcomes, university reach | P2 |
| AHEI admin/researcher | Maintain the platform | Verification, ingestion, ranking controls, auditability | P0 |

# 4. Product Scope & Release Strategy

## 4.1 V1 public product

Homepage with Africa rankings, regional navigation, featured movements, search and discovery entry points.

Africa, region, country and initial subject ranking pages.

University profiles with sourced data, ranking scorecards and history.

University comparison for up to four institutions.

Program directory and basic program-to-university relationships.

Tuition/admissions/scholarship fields where verified data exists.

Accreditation/recognition indicators and source pages.

Search, filtering, canonical URLs, metadata and indexable content.

Admin dashboard with data entry, verification, source management and ranking controls.

## 4.2 V2

AI-assisted research agent; student match; student reviews; accommodation intelligence; deadline alerts; expanded subject coverage; richer analytics.

## 4.3 V3

Institutional dashboards; lead/recruitment products; data subscriptions; API; advanced research datasets; application workflow integrations.

# 5. Functional Requirements

## 5.1 Navigation & information architecture

| ID | Requirement | Priority | Acceptance |
| --- | --- | --- | --- |
| FR-NAV-01 | Users can navigate Africa → Region → Country → University → Program. | P0 | All route patterns resolve and preserve context. |
| FR-NAV-02 | Global search supports university, country, city, program and subject queries. | P0 | Relevant exact and fuzzy matches appear. |
| FR-NAV-03 | Every university and program has a stable canonical URL. | P0 | URLs remain stable across ranking editions. |
| FR-NAV-04 | Breadcrumbs expose geographic and academic hierarchy. | P1 | Breadcrumbs are present on detail pages. |
| FR-NAV-05 | Users can return to rankings from profiles. | P0 | Profile contains links to applicable rankings. |

## 5.2 Rankings

| ID | Requirement | Priority | Acceptance |
| --- | --- | --- | --- |
| FR-RNK-01 | Publish Africa overall ranking. | P0 | Edition has ordered results and scores. |
| FR-RNK-02 | Publish regional rankings for East, West, North, Central and Southern Africa. | P0 | Region filters produce independent lists. |
| FR-RNK-03 | Publish country rankings. | P0 | Country pages expose ranking tables. |
| FR-RNK-04 | Publish subject rankings. | P0 | Subject leaderboard can be regenerated from metrics. |
| FR-RNK-05 | Show rank movement and historical editions. | P0 | Each ranked institution has current and prior positions. |
| FR-RNK-06 | Show score components and methodology. | P0 | User can inspect components and methodology version. |
| FR-RNK-07 | Show data confidence and availability. | P0 | Incomplete records cannot masquerade as fully measured. |
| FR-RNK-08 | Support ranking methodology versions. | P1 | New editions can coexist with historic editions. |

## 5.3 University profiles

Identity: name, aliases, logo, website, description, founding year, institution type, city, country, region.

Recognition: accreditation/recognition authority, status, verification date, source.

Academics: faculties, disciplines, programs, degree levels, delivery modes.

Finance: tuition ranges, fees, currency, estimated total cost and source timestamps.

Student profile: enrollment, staff, international student indicators when available.

Outcomes: employability/graduate outcomes when a reliable source exists.

Research: publications, citations, focus areas or other clearly sourced indicators.

Student experience: structured review summary plus qualitative themes only after review system launches.

Rankings: AHEI and third-party rankings shown separately and attributed.

History: rank movement, score movement and important data updates.

## 5.4 Comparison

Support up to four universities.

Compare ranking position, component scores, tuition, program availability, admissions, scholarships, accreditation and selected student-experience metrics.

Allow users to switch between table and chart views.

Clearly distinguish measured values, estimates and unavailable values.

## 5.5 Program discovery

Programs belong to universities and subjects; support undergraduate and postgraduate levels.

Each program page can show duration, delivery mode, tuition, admissions, deadlines, accreditation and related universities.

Program search supports country/region/subject/budget filters.

Program data should be independently sourced from institution or recognized authority where possible.

## 5.6 Scholarships and deadlines

Scholarship records contain provider, eligibility, coverage, degree level, subject, country, opening/closing dates and official source.

Deadline records contain intake, application type, opening/closing date, official source and verification status.

Expired records are archived, not deleted, where historically useful.

## 5.7 Student discovery & match

Users can enter subject, budget, degree level, country preference and other filters.

Results explain matching factors instead of producing opaque recommendations.

The system never invents admission eligibility; it compares user inputs with published requirements and labels uncertainty.

# 6. Ranking & Methodology Requirements

AHEI should publish a versioned methodology. The following is a starting model for implementation, not a permanent truth. Weights must be stored as configuration so future editions can change without changing historical results.

| Dimension | Initial weight | Candidate inputs | Data quality rule |
| --- | --- | --- | --- |
| Research | 20% | Publications, citations, research impact indicators | Do not mix incomparable datasets without normalization. |
| Teaching | 15% | Teaching resources, staff/student indicators, available teaching evidence | Show coverage and year. |
| Graduate outcomes | 15% | Employment/outcomes metrics where available | Prefer verified institutional/national data. |
| Academic reputation | 15% | Documented surveys or reputation inputs if licensed/defensible | Publish sample and methodology. |
| Internationalization | 10% | International students, partnerships, mobility | Avoid rewarding raw size alone. |
| Innovation | 10% | Research commercialization, startups, patents or documented innovation activity | Use comparable evidence. |
| Industry engagement | 5% | Partnerships, placements, employer links | Evidence required. |
| Student experience | 5% | Verified survey/review data | Minimum sample threshold required. |
| Affordability/value | 5% | Tuition + estimated cost relative to outcomes | Contextualize by country/income level. |

## 6.1 Ranking rules

Normalize metrics before aggregation; document the normalization method.

Avoid double-counting strongly correlated metrics where possible.

Set minimum data thresholds for each dimension.

Use missing-data rules rather than silently inserting zeros.

Flag provisional rankings when coverage falls below a defined confidence threshold.

Version every methodology change and preserve historical editions.

Keep third-party ranking positions separate from AHEI scores.

Provide an appeals/correction process for factual data, without promising ranking changes.

# 7. Data Requirements & Provenance

## 7.1 Source hierarchy

1. Official university sources and published fee/admissions documents.

2. National regulators, accreditation bodies and government statistical sources.

3. Recognized research and ranking datasets with appropriate usage rights.

4. Institution-provided submissions that can be independently reviewed.

5. Reputable secondary sources used for discovery/cross-checking, not as sole proof for high-impact claims unless necessary.

6. User-generated reports only as leads requiring verification.

## 7.2 Required metadata for consequential data

Source URL or source identifier

Source publisher

Date collected

Date verified

Verification status

Method of extraction

Reviewer

Confidence level

Effective date

Notes on transformations

## 7.3 Data states

| State | Meaning | Public display |
| --- | --- | --- |
| Draft | Entered but not reviewed | No |
| Pending verification | Awaiting research review | Optional limited flag |
| Verified | Reviewed against acceptable source | Yes |
| Conflicting | Material disagreement between sources | Yes with warning |
| Stale | Past freshness threshold | Yes with stale badge |
| Archived | Historical/no longer active | Yes where historically relevant |

# 8. AI Requirements

## 8.1 AI-assisted research

Extract structured fields from permitted source content.

Suggest updates rather than silently publishing ranking-critical changes.

Identify conflicts, missing fields, likely duplicates and stale records.

Produce a research note containing extracted value, source, confidence and suggested action.

Maintain provenance so an admin can trace AI output to source evidence.

## 8.2 AI content rules

AI-generated summaries must be grounded in structured verified data.

No fabricated statistics, rankings, deadlines, tuition, accreditation or outcomes.

AI may summarize but cannot override explicit source evidence.

Published AI content should be reviewable and regeneratable from current data.

Prompt and model configuration used for data extraction should be versioned internally.

# 9. Admin & Governance

| Role | Core permissions | Restrictions |
| --- | --- | --- |
| Super Admin | Full platform configuration, users, methodology, publishing | Use sparingly; audit all sensitive actions. |
| Data Admin | Edit university/program/source records, manage verification | Cannot change methodology unless explicitly granted. |
| Researcher | Create research tasks, verify sources, submit corrections | Cannot publish ranking methodology. |
| Editor | Manage articles, guides and editorial pages | Cannot alter ranking scores directly. |
| University Representative | Claim/manage submitted institutional profile fields | All material claims remain subject to AHEI review. |

## 9.1 Auditability

Record actor, timestamp, entity, old value, new value, reason and source for consequential changes.

Ranking generation must produce a reproducible job record.

Deletion should generally be soft deletion/archival for data needed for historical reporting.

# 10. Search, SEO & Content Requirements

Indexable country, region, subject, university and program pages.

Canonical URL strategy and stable slugs.

Structured metadata/schema where appropriate for organizations, universities, articles and programs.

Fast server-rendered initial content.

Search with typo tolerance and synonyms.

Editorial hub for methodology, explainers, rankings commentary and country guides.

Avoid mass-generating thin pages: pages must have meaningful structured information and a clear purpose.

# 11. Trust, Safety, Privacy & Legal Requirements

Do not imply official affiliation with a university unless explicitly verified.

Clearly label AHEI methodology as independent and explain conflicts of interest.

Respect copyright, licensing and robots/terms constraints when sourcing third-party data.

Provide a factual correction channel for institutions and users.

Use privacy-minimizing analytics and obtain consent where legally required.

Protect admin accounts with strong authentication, least privilege and audit logs.

Separate factual corrections from disputes about ranking methodology.

Make clear that student-match results are informational, not guarantees of admission or employment.

# 12. Non-Functional Requirements

| Area | Requirement | Target |
| --- | --- | --- |
| Performance | Fast initial rendering for public pages | Target strong Core Web Vitals on typical broadband/mobile. |
| Availability | Public site reliability | Design for 99.9% monthly availability after launch maturity. |
| Scalability | Universities/programs/history | Database and APIs designed for millions of structured records. |
| Security | Admin and API protection | Least privilege, secure sessions, rate limiting, validation, logging. |
| Accessibility | Usable by keyboard/screen readers | Target WCAG 2.2 AA practices. |
| Observability | Errors and jobs | Centralized logs, job status, alerts and audit trails. |
| Maintainability | Clear architecture | Typed schemas, tests, migrations, documented conventions. |

# 13. Business & Monetization Requirements

## 13.1 Candidate revenue streams

Institutional analytics subscriptions

Sponsored editorial clearly labeled and separated from ranking position

Verified premium university profiles

Recruitment/lead products

Data/API subscriptions

Research reports

Student premium services later

## 13.2 Commercial integrity rule

| Core rule<br>A university paying AHEI for a commercial product must not receive a guaranteed ranking outcome. Commercial data and sponsorship controls must be isolated from ranking computation and documented internally. |
| --- |

# 14. Analytics & KPIs

| Metric | Definition | Why it matters |
| --- | --- | --- |
| Indexed universities | Universities with live public profiles | Coverage |
| Verified data coverage | Percentage of key fields verified | Trust |
| Search-to-profile CTR | Users selecting a result | Discovery quality |
| Profile engagement | Scroll/time/interaction signals | Content usefulness |
| Comparison usage | Comparison sessions and completions | Decision utility |
| Program discovery usage | Program searches/filters | Student value |
| Return users | Users returning within 30 days | Retention |
| Data freshness | Median days since key fields verified | Operational quality |
| Correction resolution time | Time from issue to reviewed decision | Trust/operations |

# 15. MVP Acceptance Criteria

1. A user can reach Africa → region → country → university without dead ends.

2. AHEI can publish one ranking edition and preserve the prior edition.

3. Every displayed high-impact metric has source and verification metadata.

4. A university profile can be generated entirely from database records.

5. A comparison of up to four universities works on desktop and mobile.

6. Admin users can create/edit/verify universities, sources and ranking inputs.

7. Ranking generation is reproducible from stored inputs and methodology version.

8. AI extraction produces reviewable proposals and never silently mutates public ranking-critical data.

9. Public pages are SEO-indexable, responsive and accessible.

10. Core actions are logged and sensitive admin access is protected.

# 16. Open Decisions

| Decision | Recommended starting point | Decision owner |
| --- | --- | --- |
| Launch geographies | Kenya, Uganda, Rwanda, Nigeria, Ghana, South Africa; expand after data pipeline proves stable. | Founder/Product |
| Initial subject set | CS/AI, Business, Medicine, Engineering, Law, Economics, Agriculture. | Product/Research |
| Ranking edition | AHEI 2027 as first formal public edition. | Research |
| Primary visual brand | AHEI with restrained editorial/data aesthetic. | Founder/Design |
| Primary stack | Next.js + TypeScript + Supabase + Vercel + Python + Sanity. | Engineering |
