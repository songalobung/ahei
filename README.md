# AHEI — African Higher Education Index

AHEI is an Africa-first higher-education intelligence platform for discovering and comparing universities using structured, sourced, and reviewable information.

## Project documents

- [Product requirements](./AHEI_PRD.prd)
- [Pyramid framework and development roadmap](./AHEI_Pyramid_Framework_Roadmap.md)
- [Requirements source document](./AHEI_Requirements_Document.md)
- [Design and architecture source document](./AHEI_Design_Architecture_Document.md)
- [Task breakdown source document](./AHEI_Task_Breakdown_List.md)
- [Initial data research and validation tracker](./data-research/README.md)
- [University directory candidates](./data-research/university_directory_candidates.csv)
- [Official directory extracts and crosswalk](./data-research/)
- [Kenya CUE approved-university register extract (15 September 2026)](./data-research/kenya_CUE_approved_universities_2026-09-15.csv)

The PRD and source documents are the current product baseline. Resolve conflicts by prioritizing evidence, provenance, human verification, and reproducible rankings; record any approved product decisions in the relevant documents.

The Africa-wide university discovery list is provisional. See the data research notes and country tracker for the national approval-register sources extracted so far and outstanding coverage gaps. Do not treat candidate counts as a complete or verified approved-institution census.

## Recommended free-to-start stack

| Concern | Initial choice | Upgrade path |
| --- | --- | --- |
| Web app and server routes | Next.js + TypeScript | Scale the deployment plan or move hosting while retaining the app |
| Database | Supabase PostgreSQL | Upgrade database capacity; PostgreSQL migrations and exports preserve portability |
| Authentication and authorization | Supabase Auth + PostgreSQL row-level security | Add stronger identity controls and capacity as privileged use grows |
| File storage | Supabase Storage | Increase capacity or move object storage behind an application service |
| Hosting | Vercel | Upgrade hosting as traffic and production requirements grow |
| Search | PostgreSQL full-text search + trigram matching | Add a dedicated search engine only when query volume or relevance needs justify it |
| Ranking calculations | Tested TypeScript package in this repository | Extract to a worker only when scheduling, throughput, or isolation requires it |
| Editorial content | Markdown/MDX | Adopt a hosted CMS when editorial collaboration warrants it |
| Tests and CI | Vitest, Playwright, GitHub Actions | Add specialized infrastructure as the team and test needs grow |
| UI styling | Tailwind CSS; use shadcn/ui selectively | Keep application-owned components and styling portable |

Free plans have quotas and terms that may change. Confirm commercial eligibility, storage and compute limits, backup/restore options, and custom-domain costs before production. Do not treat a free development plan as a production reliability or backup strategy.

## Development principles

1. Build the source, observation, verification, and audit foundations before scaling page generation.
2. Keep one modular application initially; introduce separate workers or services only for a demonstrated need.
3. Put database operations behind typed repositories/services rather than scattering database calls through UI components.
4. Keep ranking calculations deterministic, versioned, and independently tested.
5. Treat AI output as a proposal for human review, never as an autonomous publisher of consequential facts.
6. Keep missing values explicit and distinguish verified measurements from estimates.
7. Use migrations, automated checks, and small vertical slices to preserve a straightforward upgrade path.

## Suggested first milestone

Deliver one end-to-end university flow: create a university and source record, record a sourced observation, review and verify it, and render the verified information on a public profile. This validates the most important trust and data architecture before expanding coverage.
