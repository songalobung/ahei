import Link from 'next/link';
import { BookOpen, HelpCircle, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* ─── Breadcrumb & Masthead ─── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-code-badge text-white px-3 py-1 font-semibold text-xs"
            style={{ background: '#164A3A', borderRadius: '20px' }}
          >
            INSTITUTIONAL DIRECTORY &amp; CHARTER
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
            54 AFRICAN NATIONS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] m-0 mb-4">
          About the African Higher Education Index
        </h1>
        <p className="font-body-lg text-[#676963] max-w-3xl m-0 leading-relaxed text-base sm:text-lg">
          The African Higher Education Index (AHEI) is an authoritative, peer-reviewed continental academic registry and university ranking evaluating over 1,040 institutions across 54 African nations.
        </p>
      </div>

      {/* ─── Entry points: Methodology & FAQ ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/about/methodology"
          className="the-card bg-white rounded-none border border-[#e9e9e9] p-7 shadow-sm hover:border-[#164A3A] hover:shadow-none transition-all group no-underline block"
        >
          <div className="w-12 h-12 rounded-xs bg-[#F7F6F2] text-[#164A3A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mb-2 group-hover:text-[#164A3A] transition-colors">
            Methodology &amp; Calibration
          </h2>
          <p className="text-sm text-[#676963] leading-relaxed mb-6 font-sans">
            Our ranking methodology uses 5 weighted pillars and 14 empirical indicators to produce a composite AHEI Score for each institution. Transparent, reproducible, and AU Agenda 2063-aligned.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#164A3A] group-hover:gap-2 transition-all">
            Read Methodology <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/about/faq"
          className="the-card bg-white rounded-none border border-[#e9e9e9] p-7 shadow-sm hover:border-[#164A3A] hover:shadow-none transition-all group no-underline block"
        >
          <div className="w-12 h-12 rounded-xs bg-[#faf5ff] text-[#164A3A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mb-2 group-hover:text-[#164A3A] transition-colors">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#676963] leading-relaxed mb-6 font-sans">
            Clear answers on how we aggregate data, verify registrar records, handle disputes, maintain confidence scoring, and protect academic impartiality.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#164A3A] group-hover:gap-2 transition-all">
            View FAQ <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* ─── Methodology Overview: 5 Ranking Pillars ─── */}
      <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#e9e9e9]">
          <div>
            <span className="font-mono text-[11px] font-bold text-[#164A3A] block mb-1 uppercase tracking-wider">
              EVALUATION WEIGHTINGS
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
              The 5 Core Ranking Pillars
            </h2>
          </div>
          <span className="text-xs text-[#838383] font-mono hidden sm:inline bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 rounded-full">
            100% Normalized Weight
          </span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#f1f5f9]">
          {[
            { pillar: 'Research Impact', weight: '30%', badgeColor: '#164A3A', badgeBg: '#F7F6F2', desc: 'Field-Weighted Citation Impact aggregated via Scopus & Web of Science. Measures research output quality relative to global and regional benchmarks.' },
            { pillar: 'Teaching Quality', weight: '25%', badgeColor: '#164A3A', badgeBg: '#faf5ff', desc: 'Full-time doctoral qualification ratio, instructor-to-student load, and accredited laboratory capacity. Evaluates pedagogical depth.' },
            { pillar: 'Graduate Employability', weight: '20%', badgeColor: '#059669', badgeBg: '#ecfdf5', desc: '6 & 12-month post-convocation employment rate, continental employer reputation, and tech-hub placement.' },
            { pillar: 'Continental Relevance', weight: '15%', badgeColor: '#B28A45', badgeBg: '#fefce8', desc: 'Direct alignment to AU Agenda 2063 development directives: agriculture, healthcare, renewable energy, and regional trade.' },
            { pillar: 'Internationalization', weight: '10%', badgeColor: '#2563eb', badgeBg: '#F7F6F2', desc: 'Cross-border student mobility, international faculty representation, and multi-country research alliances across Africa.' },
          ].map((item) => (
            <div key={item.pillar} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif font-bold text-lg text-[#232323] m-0">
                    {item.pillar}
                  </h3>
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ color: item.badgeColor, background: item.badgeBg }}
                  >
                    {item.weight}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#676963] m-0 max-w-3xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Data Provenance ─── */}
      <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PRIMARY SOURCES
          </span>
          <span className="text-xs text-[#838383] font-mono">
            AUDIT CYCLE: 2026–2027
          </span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
          Data Provenance &amp; Verification Protocol
        </h2>

        <p className="text-sm text-[#676963] leading-relaxed max-w-3xl m-0">
          All data points are primary-sourced from institutional publications, statutory regulatory registers, and verified international databases. No promotional claims or unverified self-assessments are included in scoring calculations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            'Institutional audited annual financial statements and registrar fact sheets',
            'National regulatory councils (e.g., CUE Kenya, NUC Nigeria, CHE South Africa, NAQAAE Egypt)',
            'Clarivate Web of Science and Elsevier Scopus validated citation indices',
            'UNESCO Institute for Statistics (UIS) higher education databases',
            'African Union Commission Directorate of Education, Science, Technology and Innovation',
            'Multi-country corporate graduate recruiter surveys and LinkedIn Talent Insights',
          ].map((source, idx) => (
            <div key={idx} className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex items-start gap-2.5 text-xs text-[#232323]">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
