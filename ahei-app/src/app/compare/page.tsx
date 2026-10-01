'use client';

import React, { Suspense, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { University } from '@/data/universities';
import { useCompare } from '@/components/layout/CompareProvider';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-body-md text-[#838383]">Loading comparison…</div>}>
      <CompareContent />
    </Suspense>
  );
}

interface MetricDef {
  key: string;
  label: string;
  category: 'prestige' | 'research' | 'student' | 'costs';
  description: string;
  isScore?: boolean;
  isLowerBetter?: boolean;
  format?: (val: unknown, u: University) => React.ReactNode;
}

const METRICS: MetricDef[] = [
  // Category 1: Prestige & Standing
  {
    key: 'rank',
    label: 'Overall African Rank',
    category: 'prestige',
    description: 'Continental standing out of 1,048 audited higher education institutions.',
    isLowerBetter: true,
    format: (val) => `#${val}`,
  },
  {
    key: 'aheiScore',
    label: 'AHEI Composite Score',
    category: 'prestige',
    description: 'Standardized 0–100 benchmark score based on all 5 audited pillars.',
    isScore: true,
    format: (val) => `${Number(val).toFixed(1)} / 100`,
  },
  {
    key: 'regionalRank',
    label: 'Regional Rank',
    category: 'prestige',
    description: 'Standing within the university’s geographical macro-region.',
    isLowerBetter: true,
    format: (val, u) => `#${val} in ${u.region}`,
  },
  {
    key: 'confidence',
    label: 'Audit Confidence Rating',
    category: 'prestige',
    description: 'Primary-source verification index of data provided by university & ministry.',
    format: (val) => `${val}% Verified`,
  },

  // Category 2: Research & Faculty
  {
    key: 'researchScore',
    label: 'Research Excellence (30%)',
    category: 'research',
    description: 'Peer-reviewed citations, academic journal impact, and doctoral production.',
    isScore: true,
    format: (val) => `${Number(val).toFixed(1)}%`,
  },
  {
    key: 'phdFacultyShare',
    label: 'Faculty with Doctoral Degrees',
    category: 'research',
    description: 'Percentage of permanent teaching faculty holding an accredited PhD.',
    format: (val) => `${val}% of staff`,
  },
  {
    key: 'academicStaff',
    label: 'Total Academic Faculty',
    category: 'research',
    description: 'Number of full-time professors, senior lecturers, and researchers.',
    format: (val) => Number(val).toLocaleString(),
  },
  {
    key: 'continentalRelevanceScore',
    label: 'Continental Impact (15%)',
    category: 'research',
    description: 'Research addressing African Union Agenda 2063 development priorities.',
    isScore: true,
    format: (val) => `${Number(val).toFixed(1)}%`,
  },

  // Category 3: Student Experience & Employability
  {
    key: 'teachingScore',
    label: 'Teaching & Mentorship (25%)',
    category: 'student',
    description: 'Instructional resources, student satisfaction, and classroom infrastructure.',
    isScore: true,
    format: (val) => `${Number(val).toFixed(1)}%`,
  },
  {
    key: 'employabilityScore',
    label: 'Graduate Employability (20%)',
    category: 'student',
    description: 'Alumni hiring rates, employer reputation, and executive market demand.',
    isScore: true,
    format: (val) => `${Number(val).toFixed(1)}%`,
  },
  {
    key: 'studentFacultyRatio',
    label: 'Student-to-Faculty Ratio',
    category: 'student',
    description: 'Number of enrolled students per academic professor. Lower ratio means more mentorship.',
    isLowerBetter: true,
    format: (val) => `${val}`,
  },
  {
    key: 'internationalDiversityPct',
    label: 'International Students Share',
    category: 'student',
    description: 'Proportion of international & cross-border students in student body.',
    format: (val) => `${val}% international`,
  },
  {
    key: 'totalEnrollment',
    label: 'Total Student Body Size',
    category: 'student',
    description: 'Total headcount of undergraduate and postgraduate students.',
    format: (val) => Number(val).toLocaleString(),
  },

  // Category 4: Costs & Affordability
  {
    key: 'domesticTuitionUsd',
    label: 'Annual Domestic Tuition',
    category: 'costs',
    description: 'Audited statutory tuition fee for in-country students in USD equivalent.',
    isLowerBetter: true,
    format: (val) => `${val} / year`,
  },
  {
    key: 'averageMonthlyLiving',
    label: 'Est. Monthly Living Cost',
    category: 'costs',
    description: 'Average monthly student expenses for food, transportation, and supplies.',
    isLowerBetter: true,
    format: (val) => `${val} / mo`,
  },
  {
    key: 'onCampusAccommodation',
    label: 'University Housing (Annual)',
    category: 'costs',
    description: 'Audited annual rate for on-campus residence hall.',
    isLowerBetter: true,
    format: (val) => `${val} / session`,
  },
  {
    key: 'financialAidTier',
    label: 'Financial Aid Availability',
    category: 'costs',
    description: 'Institutional scholarship endowment and national bursary eligibility.',
    format: (val) => `${val} SUPPORT`,
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Indicators' },
  { id: 'prestige', label: 'Rank & Prestige' },
  { id: 'research', label: 'Research & Faculty' },
  { id: 'student', label: 'Student & Jobs' },
  { id: 'costs', label: 'Tuition & Budget' },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const { compareIds, addToCompare, removeFromCompare, clearCompare } = useCompare();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [addSelectorOpen, setAddSelectorOpen] = useState<boolean>(false);
  const { universities } = useUniversities();

  // Use URL params or context
  const idsParam = searchParams.get('ids');
  const activeIds = idsParam ? idsParam.split(',').filter(Boolean) : compareIds;

  const compareUniversities = useMemo(() => {
    return activeIds
      .map((id) => universities.find((u) => u.id === id))
      .filter(Boolean) as University[];
  }, [activeIds, universities]);

  // Available universities to add
  const availableToAdd = useMemo(() => {
    return universities.filter((u) => !compareUniversities.some((cu) => cu.id === u.id));
  }, [compareUniversities, universities]);

  // Executive Verdict calculations
  const verdict = useMemo(() => {
    if (compareUniversities.length < 2) return null;

    const highestRanked = [...compareUniversities].sort((a, b) => a.rank - b.rank)[0];
    const topResearch = [...compareUniversities].sort((a, b) => b.researchScore - a.researchScore)[0];
    const topEmployability = [...compareUniversities].sort((a, b) => b.employabilityScore - a.employabilityScore)[0];
    const topTeaching = [...compareUniversities].sort((a, b) => b.teachingScore - a.teachingScore)[0];

    // parse tuition
    const getTuition = (u: University) => {
      const match = u.domesticTuitionUsd?.match(/\$?([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : 99999;
    };
    const mostAffordable = [...compareUniversities].sort((a, b) => getTuition(a) - getTuition(b))[0];

    return {
      highestRanked,
      topResearch,
      topEmployability,
      topTeaching,
      mostAffordable,
    };
  }, [compareUniversities]);

  // Find best value for a metric
  const getBestValue = (metric: MetricDef): unknown => {
    if (!compareUniversities.length) return null;
    const values = compareUniversities.map((u) => (u as unknown as Record<string, unknown>)[metric.key]);

    if (metric.isLowerBetter) {
      if (metric.key === 'studentFacultyRatio') {
        const parseRatio = (r: unknown) => {
          const match = String(r).match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 99;
        };
        const numValues = values.map(parseRatio);
        const minVal = Math.min(...numValues);
        return compareUniversities.find((u) => parseRatio(u.studentFacultyRatio) === minVal)?.studentFacultyRatio;
      }
      if (metric.key.includes('Usd') || metric.key.includes('Living') || metric.key.includes('Accommodation')) {
        const parseUsd = (val: unknown) => {
          const match = String(val).match(/\$?([\d,]+)/);
          return match ? parseInt(match[1].replace(/,/g, ''), 10) : 99999;
        };
        const numValues = values.map(parseUsd);
        const minVal = Math.min(...numValues);
        return compareUniversities.find((u) => parseUsd((u as unknown as Record<string, unknown>)[metric.key]) === minVal);
      }
      const numValues = values.filter((v): v is number => typeof v === 'number');
      return numValues.length ? Math.min(...numValues) : null;
    }

    const numValues = values.filter((v): v is number => typeof v === 'number');
    return numValues.length ? Math.max(...numValues) : null;
  };

  const filteredMetrics = useMemo(() => {
    return METRICS.filter((m) => {
      if (activeCategory !== 'all' && m.category !== activeCategory) return false;
      return true;
    });
  }, [activeCategory]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
            Direct Head-to-Head Comparison
          </span>
          <h1 className="font-headline-lg text-[#09090B] mt-1 mb-2 font-bold tracking-tight">
            Compare Universities
          </h1>
          <p className="font-body-md text-[#666666] m-0 max-w-2xl text-sm md:text-base leading-relaxed">
            Compare up to 4 institutions side by side with verified empirical indicators, academic metrics, and plain-English takeaways.
          </p>
        </div>

        {compareUniversities.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className="px-4 py-2 text-xs font-semibold rounded-full border cursor-pointer transition-all duration-200 shadow-xs"
              style={{
                background: highlightDifferences ? '#09090B' : '#FFFFFF',
                color: highlightDifferences ? '#FFFFFF' : '#09090B',
                borderColor: highlightDifferences ? '#09090B' : '#e9e9e9',
              }}
            >
              {highlightDifferences ? '✓ Highlighting Differences' : 'Highlight Differences'}
            </button>

            <button
              onClick={clearCompare}
              className="px-4 py-2 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2] rounded-full border border-transparent hover:border-[#fecaca] transition-all cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {compareUniversities.length === 0 ? (
        <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm text-center py-16 px-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-none bg-[#F7F6F2] border border-[#D9D7D0] flex items-center justify-center text-[#164A3A]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-16.5-.52l-1.5 6a3 3 0 004.242 3.328l.258-.088m10.5-9.24l1.5 6a3 3 0 01-4.242 3.328l-.258-.088" />
            </svg>
          </div>
          <h2 className="font-headline-sm text-[#09090B] font-bold mb-2">
            No universities selected for comparison
          </h2>
          <p className="font-body-md text-[#666666] max-w-md mx-auto mb-6 text-sm">
            Select universities from the rankings table, subject leaderboards, or profile pages by clicking &ldquo;+ Compare&rdquo;.
          </p>
          <div className="flex justify-center gap-3">
            <Link 
              href="/rankings" 
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#09090B] hover:bg-[#232323] transition-all no-underline shadow-xs"
            >
              Browse Full Rankings Table →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ─── Executive Verdict Banner ─── */}
          {verdict && (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#e9e9e9]">
                <span className="font-mono text-xs font-bold bg-[#164A3A] text-white px-2.5 py-0.5 rounded-full">
                  VERDICT
                </span>
                <h3 className="font-headline-sm text-[#09090B] font-bold m-0 text-lg">
                  Head-to-Head Comparison Verdict
                </h3>
                <span className="font-body-sm text-[#838383] ml-auto hidden sm:inline text-xs">
                  At-a-glance leadership breakdown
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Winner 1: Overall Rank */}
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#164A3A] transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#164A3A] uppercase tracking-wider block mb-2 font-mono">
                      HIGHEST OVERALL RANK
                    </span>
                    {verdict.highestRanked.crestUrl && (
                      <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-3">
                        <img
                          src={verdict.highestRanked.crestUrl}
                          alt={`${verdict.highestRanked.name} official crest`}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="font-title-md text-[#09090B] font-bold leading-snug">
                      {verdict.highestRanked.name}
                    </div>
                  </div>
                  <span className="text-xs text-[#666666] block mt-3 pt-2.5 border-t border-[#e2e8f0]">
                    #{verdict.highestRanked.rank} in Africa · Score {verdict.highestRanked.aheiScore.toFixed(1)}
                  </span>
                </div>

                {/* Winner 2: Research */}
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#09090B] transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#09090B] uppercase tracking-wider block mb-2 font-mono">
                      RESEARCH &amp; CITATIONS
                    </span>
                    {verdict.topResearch.crestUrl && (
                      <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-3">
                        <img
                          src={verdict.topResearch.crestUrl}
                          alt={`${verdict.topResearch.name} official crest`}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="font-title-md text-[#09090B] font-bold leading-snug">
                      {verdict.topResearch.name}
                    </div>
                  </div>
                  <span className="text-xs text-[#666666] block mt-3 pt-2.5 border-t border-[#e2e8f0]">
                    Score {verdict.topResearch.researchScore.toFixed(1)}% ({verdict.topResearch.phdFacultyShare}% PhD faculty)
                  </span>
                </div>

                {/* Winner 3: Employability */}
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#16a34a] transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#16a34a] uppercase tracking-wider block mb-2 font-mono">
                      GRADUATE EMPLOYABILITY
                    </span>
                    {verdict.topEmployability.crestUrl && (
                      <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-3">
                        <img
                          src={verdict.topEmployability.crestUrl}
                          alt={`${verdict.topEmployability.name} official crest`}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="font-title-md text-[#09090B] font-bold leading-snug">
                      {verdict.topEmployability.name}
                    </div>
                  </div>
                  <span className="text-xs text-[#666666] block mt-3 pt-2.5 border-t border-[#e2e8f0]">
                    {verdict.topEmployability.employabilityScore.toFixed(1)}% employer demand score
                  </span>
                </div>

                {/* Winner 4: Affordability */}
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#d97706] transition-all">
                  <div>
                    <span className="text-[11px] font-bold text-[#d97706] uppercase tracking-wider block mb-2 font-mono">
                      MOST AFFORDABLE TUITION
                    </span>
                    {verdict.mostAffordable.crestUrl && (
                      <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-3">
                        <img
                          src={verdict.mostAffordable.crestUrl}
                          alt={`${verdict.mostAffordable.name} official crest`}
                          width={56}
                          height={56}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="font-title-md text-[#09090B] font-bold leading-snug">
                      {verdict.mostAffordable.name}
                    </div>
                  </div>
                  <span className="text-xs text-[#666666] block mt-3 pt-2.5 border-t border-[#e2e8f0]">
                    {verdict.mostAffordable.domesticTuitionUsd || '$1,200'} / year domestic
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── Google Ad Space: Compare Mid-Leaderboard ─── */}
          <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-6" />

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 text-xs font-semibold rounded-full border cursor-pointer transition-all whitespace-nowrap shadow-xs"
                style={{
                  background: activeCategory === cat.id ? '#09090B' : '#FFFFFF',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#09090B',
                  borderColor: activeCategory === cat.id ? '#09090B' : '#e9e9e9',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="rankings-table" style={{ minWidth: '700px' }}>
                {/* University Columns Header */}
                <thead>
                  <tr>
                    <th style={{ width: '240px', background: '#f8fafc', position: 'sticky', left: 0, zIndex: 2, borderRight: '1px solid #e9e9e9' }}>
                      <span className="font-semibold text-xs text-[#09090B]">Performance Indicator</span>
                    </th>
                    {compareUniversities.map((u) => (
                      <th key={u.id} style={{ minWidth: '220px', textAlign: 'center', verticalAlign: 'top', background: '#FFFFFF', borderRight: '1px solid #f1f5f9' }}>
                        <div className="flex flex-col items-center p-4">
                          {u.crestUrl && (
                            <div className="w-16 h-16 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-2.5">
                              <img
                                src={u.crestUrl}
                                alt={`${u.name} official crest`}
                                width={60}
                                height={60}
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <Link
                            href={`/universities/${u.id}`}
                            className="font-title-md text-[#09090B] font-bold hover:text-[#164A3A] transition-colors block text-center no-underline"
                            style={{ textTransform: 'none', letterSpacing: 'normal' }}
                          >
                            {u.name}
                          </Link>
                          <span className="text-xs text-[#666666] font-normal block mt-1" style={{ textTransform: 'none' }}>
                            <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f1f5f9] px-1.5 py-0.5 rounded-sm border border-[#e2e8f0] mr-1">{u.countryCode.toUpperCase()}</span>
                            {u.city}, {u.country}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-[11px] font-bold bg-[#164A3A] text-white">
                            #{u.rank} in Africa
                          </span>
                          <button
                            onClick={() => removeFromCompare(u.id)}
                            className="text-[11px] text-[#dc2626] hover:underline cursor-pointer border-none bg-transparent mt-2.5 font-medium"
                            style={{ textTransform: 'none' }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: 4 - compareUniversities.length }).map((_, idx) => (
                      <th key={idx} style={{ minWidth: '180px', textAlign: 'center', background: '#f8fafc', verticalAlign: 'middle', borderRight: '1px solid #f1f5f9' }}>
                        <div className="p-6 text-center">
                          <span className="text-xs text-[#838383] block mb-2 font-normal" style={{ textTransform: 'none' }}>
                            Slot {compareUniversities.length + idx + 1} Available
                          </span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addToCompare(e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="w-full px-3 py-2 text-xs border border-[#d5d5d5] rounded-xs bg-white focus:outline-none focus:border-[#09090B]"
                            style={{ textTransform: 'none' }}
                          >
                            <option value="" disabled>+ Add University…</option>
                            {availableToAdd.map((av) => (
                              <option key={av.id} value={av.id}>
                                #{av.rank} {av.name} ({av.country})
                              </option>
                            ))}
                          </select>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredMetrics.map((metric) => {
                    const bestVal = getBestValue(metric);

                    return (
                      <tr key={metric.key} className="hover:bg-[#fafafa] transition-colors">
                        {/* Indicator Label & Explainer */}
                        <td
                          style={{
                            position: 'sticky',
                            left: 0,
                            background: '#FFFFFF',
                            zIndex: 1,
                            borderRight: '1px solid #e9e9e9',
                            padding: '14px 18px',
                          }}
                        >
                          <div className="font-semibold text-xs text-[#09090B]">
                            {metric.label}
                          </div>
                          <span className="text-[11px] text-[#666666] block mt-0.5 leading-snug">
                            {metric.description}
                          </span>
                        </td>

                        {/* University Values */}
                        {compareUniversities.map((u) => {
                          const rawVal = (u as unknown as Record<string, unknown>)[metric.key];
                          const formatted = metric.format ? metric.format(rawVal, u) : String(rawVal ?? '—');
                          const isNumeric = typeof rawVal === 'number';
                          const isBest = isNumeric && bestVal !== null && rawVal === bestVal && compareUniversities.length > 1;

                          return (
                            <td
                              key={u.id}
                              style={{
                                textAlign: 'center',
                                background: isBest ? '#f0fdf4' : 'transparent',
                                borderRight: '1px solid #f1f5f9',
                                padding: '14px 18px',
                              }}
                            >
                              <div className="py-1">
                                <span
                                  className="font-tabular-num font-bold text-sm block"
                                  style={{
                                    color: isBest ? '#15803d' : '#09090B',
                                  }}
                                >
                                  {formatted}
                                </span>

                                {/* Visual Comparative Bar for 0-100 scores */}
                                {metric.isScore && isNumeric && (
                                  <div className="w-3/4 mx-auto mt-2 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                                    <div
                                      style={{
                                        width: `${rawVal}%`,
                                        height: '100%',
                                        background: isBest ? '#16a34a' : '#164A3A',
                                        borderRadius: '9999px',
                                      }}
                                    />
                                  </div>
                                )}

                                {isBest && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#15803d] mt-1.5">
                                    Top Performer
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {/* Empty cells to pad out table columns */}
                        {Array.from({ length: 4 - compareUniversities.length }).map((_, idx) => (
                          <td key={idx} style={{ background: '#f8fafc', borderRight: '1px solid #f1f5f9' }} />
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
