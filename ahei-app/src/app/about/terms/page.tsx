import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use & Academic Data License | AHEI',
  description: 'Terms governing access, citation, institutional benchmarking, and API licensing for the African Higher Education Index.',
};

export default function TermsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Breadcrumb */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">Home</Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/about" className="no-underline text-[#838383] hover:text-[#09090B]">About</Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">Terms of Use</span>
      </nav>

      {/* Header */}
      <header className="border-b-2 border-[#09090B] pb-6">
        <span className="font-code-badge bg-[#09090B] text-white px-2 py-0.5 rounded-xs">
          GOVERNANCE &amp; LEGAL STANDARDS
        </span>
        <h1 className="font-headline-lg text-[#232323] mt-2 mb-2">
          Terms of Use &amp; Academic Data License
        </h1>
        <p className="font-body-md text-[#838383] m-0">
          Last revised: October 2026 · Governing 2027 Continental Edition
        </p>
      </header>

      {/* Content Sections */}
      <div className="prose font-body text-[#232323] space-y-8">
        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">1. Nature of the Index &amp; Commercial Independence</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            The African Higher Education Index (AHEI) is an independent, peer-reviewed benchmarking authority. Commercial engagements—such as sponsored editorial announcements, recruitment features, or verified premium profiles—have zero influence on algorithmic ranking computations or institutional evaluation scores.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">2. Permitted Academic Citation &amp; Fair Use</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            Universities, researchers, news agencies, and government ministries are permitted to cite published AHEI composite rankings, pillar scores, and country league tables with appropriate attribution:
          </p>
          <div className="p-3 bg-[#f2f2f2] border border-[#d5d5d5] font-mono text-xs text-[#09090B]">
            Source: African Higher Education Index (AHEI), 2027 Official Edition, https://ahei-index.org
          </div>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            Automated scraping, bulk mirror harvesting, or commercial redistribution of raw institutional datasets without written API authorization is strictly prohibited.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">3. Factual Integrity &amp; Correction Rights</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            AHEI maintains a continuous verification loop. Institutional registrars, faculty deans, and vice-chancellors possess the right to submit official gazettes, chartered statutory updates, or tuition amendments via the{' '}
            <Link href="/about/corrections" className="text-[#09090B] underline font-semibold">
              Factual Correction Channel
            </Link>. All corrections are audited by AHEI researchers prior to registry publication.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">4. Informational Warranty &amp; Student Guidance</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            AHEI rankings, cost estimates, and AI career match projections are analytical advisory tools intended to assist student discovery and institutional policymaking. They do not constitute statutory admission guarantees or professional licensure endorsements.
          </p>
        </section>
      </div>
    </div>
  );
}
