import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Data Protection | AHEI',
  description: 'AHEI continental data protection framework, privacy principles, and compliance with AU Convention on Cyber Security and Personal Data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Breadcrumb */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">Home</Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/about" className="no-underline text-[#838383] hover:text-[#09090B]">About</Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">Privacy Policy</span>
      </nav>

      {/* Header */}
      <header className="border-b-2 border-[#09090B] pb-6">
        <span className="font-code-badge bg-[#09090B] text-white px-2 py-0.5 rounded-xs">
          DATA PROTECTION PROTOCOL
        </span>
        <h1 className="font-headline-lg text-[#232323] mt-2 mb-2">
          Privacy Policy &amp; Sovereign Data Governance
        </h1>
        <p className="font-body-md text-[#838383] m-0">
          Compliant with the Malabo Convention &amp; Continental Data Protection Standards
        </p>
      </header>

      {/* Content */}
      <div className="prose font-body text-[#232323] space-y-8">
        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">1. Data Minimization &amp; Student Privacy</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            AHEI is designed with privacy-first principles. We do not require student account registration, tracking cookies, or biometric profiling to browse rankings, run the Tuition Cost Calculator, or explore AI Career Match pathways. Shortlisted universities and comparison sets are preserved purely client-side in browser storage.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">2. Institutional &amp; Researcher Submissions</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            When institutional representatives submit factual correction requests or gazette updates, contact details (such as official university registrar email addresses and names) are collected solely to authenticate the submission and prevent fraudulent alteration of academic metrics.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">3. Anonymized Analytical Telemetry</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            We collect aggregated, non-identifiable telemetry (such as total monthly search queries, most compared universities, and regional readership distribution) to optimize server performance and report continental higher education trends to academic researchers.
          </p>
        </section>

        <section className="bg-white border border-[#d5d5d5] p-6 space-y-3">
          <h2 className="font-title-lg text-[#09090B] m-0">4. Right to Information &amp; Contact</h2>
          <p className="font-body-md text-[#838383] leading-relaxed m-0">
            For privacy inquiries, registry data audits, or subject access requests, contact the AHEI Data Protection Secretariat at{' '}
            <span className="font-mono text-xs text-[#09090B] font-semibold">governance@ahei-index.org</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
