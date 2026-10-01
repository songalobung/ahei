import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Scale, BarChart3, ArrowLeft } from 'lucide-react';

export default function MethodologyPage() {
  const PILLARS = [
    {
      pillar: 'Research Impact',
      weight: '30%',
      badgeColor: '#164A3A',
      badgeBg: '#F7F6F2',
      indicators: [
        'Field-Weighted Citation Impact (FWCI) — Scopus & Web of Science',
        'Research output volume (publications per FTE faculty)',
        'H-index of institutional research portfolio',
        'International research collaboration ratio',
      ],
    },
    {
      pillar: 'Teaching Quality',
      weight: '25%',
      badgeColor: '#164A3A',
      badgeBg: '#faf5ff',
      indicators: [
        'Faculty with doctoral qualifications (%)',
        'Student-to-faculty ratio',
        'Accredited programme coverage (%)',
        'Instructional expenditure per student',
      ],
    },
    {
      pillar: 'Graduate Employability',
      weight: '20%',
      badgeColor: '#059669',
      badgeBg: '#ecfdf5',
      indicators: [
        '6-month post-graduation employment rate',
        '12-month post-graduation employment rate',
        'Employer reputation survey score',
      ],
    },
    {
      pillar: 'Continental Relevance',
      weight: '15%',
      badgeColor: '#B28A45',
      badgeBg: '#fefce8',
      indicators: [
        'Alignment to AU Agenda 2063 priority sectors',
        'Regional development research output',
        'Community engagement and extension services score',
      ],
    },
    {
      pillar: 'Internationalization',
      weight: '10%',
      badgeColor: '#2563eb',
      badgeBg: '#F7F6F2',
      indicators: [
        'International student ratio',
        'International faculty ratio',
        'Cross-border joint degree programmes',
        'International research laboratory partnerships',
      ],
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">Home</Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/about" className="no-underline text-[#838383] hover:text-[#09090B]">About</Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">Methodology</span>
      </nav>

      {/* ─── Masthead ─── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-code-badge text-white px-3 py-1 font-semibold text-xs"
            style={{ background: '#164A3A', borderRadius: '20px' }}
          >
            PEER-REVIEWED FRAMEWORK
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
            2027 EDITION · 14 EMPIRICAL INDICATORS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] m-0 mb-4">
          Ranking Methodology &amp; Mathematical Framework
        </h1>
        <p className="font-body-lg text-[#676963] max-w-3xl m-0 leading-relaxed text-base sm:text-lg">
          The AHEI composite score is calculated from five weighted pillars, each composed of
          multiple indicators sourced from primary institutional records and verified international databases.
        </p>
      </div>

      {/* ─── Pillar Details ─── */}
      <div className="space-y-5">
        <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
          The Five Audited Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS.map((section) => (
            <div
              key={section.pillar}
              className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-sm hover:border-[#164A3A] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9] mb-4">
                  <h3 className="text-xl font-serif font-bold text-[#232323] m-0">
                    {section.pillar}
                  </h3>
                  <span
                    className="font-mono text-xs font-bold px-3 py-1 rounded-full"
                    style={{ color: section.badgeColor, background: section.badgeBg }}
                  >
                    Weight: {section.weight}
                  </span>
                </div>

                <ul className="space-y-2.5 m-0 p-0 list-none">
                  {section.indicators.map((indicator) => (
                    <li key={indicator} className="text-xs sm:text-sm text-[#676963] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#164A3A] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mathematical Normalization & Verification ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-7 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xs bg-[#F7F6F2] text-[#164A3A] flex items-center justify-center mb-2">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#232323] m-0">
            Score Calculation &amp; Min-Max Normalization
          </h3>
          <p className="text-xs sm:text-sm text-[#676963] leading-relaxed m-0">
            Each indicator is normalized to a 0–100 scale using min-max normalization across all ranked institutions. Pillar scores are weighted averages of their constituent indicators. The composite AHEI Score is the weighted sum of all five pillar scores, rounded to one decimal place.
          </p>
        </div>

        <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-7 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xs bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#232323] m-0">
            Verification Protocol &amp; Confidence Scoring
          </h3>
          <p className="text-xs sm:text-sm text-[#676963] leading-relaxed m-0">
            All data undergoes a three-stage verification process: automated cross-referencing against official statutory gazettes, manual review by regional desk analysts, and institutional confirmation where data is contested. The confidence score reflects data completeness and recency.
          </p>
        </div>
      </div>
    </div>
  );
}
