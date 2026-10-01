'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { University } from '@/data/universities';
import { MACRO_REGIONS } from '@/data/macroRegions';
import { useCompare } from '@/components/layout/CompareProvider';
import { useBookmarks } from '@/components/layout/BookmarksProvider';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';

type SortKey = 'rank' | 'name' | 'score' | 'research' | 'teaching' | 'employability' | 'continental' | 'international';
type SortDir = 'asc' | 'desc';
type ViewMode = 'simple' | 'detailed';

const ITEMS_PER_PAGE = 25;

function getPillarBarColor(score: number): string {
  if (score >= 85) return '#09090B'; // Highest scores: Deep green
  if (score >= 78) return '#237A5C'; // High: Vibrant emerald
  if (score >= 70) return '#164A3A'; // Medium: Academic gold
  if (score >= 60) return '#D97706'; // Moderate: Warm amber
  return '#C0392B'; // Lower: Red
}

export default function RankingsPage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-body-md text-[#838383]">Loading rankings…</div>}>
      <RankingsContent />
    </Suspense>
  );
}

function RankingsContent() {
  const searchParams = useSearchParams();
  const { universities } = useUniversities();
  const { addToCompare, isInCompare } = useCompare();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [showExplainer, setShowExplainer] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [regionFilter, setRegionFilter] = useState(searchParams.get('region') || '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [quickPreset, setQuickPreset] = useState<string>('all');

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const countries = useMemo(() => {
    const set = new Set(universities.map((u) => u.country));
    return Array.from(set).sort();
  }, [universities]);

  // Quick preset filter handler
  const handlePreset = (preset: string) => {
    setQuickPreset(preset);
    setCurrentPage(1);
  };

  // Filter logic
  const filtered = useMemo(() => {
    return universities.filter((u) => {
      if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.country.toLowerCase().includes(searchQuery.toLowerCase()) && !u.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (regionFilter && u.region !== regionFilter) return false;
      if (countryFilter && u.country !== countryFilter) return false;

      // Tier filter
      if (tierFilter === 'tier1' && u.aheiScore < 90) return false;
      if (tierFilter === 'tier2' && (u.aheiScore < 80 || u.aheiScore >= 90)) return false;
      if (tierFilter === 'tier3' && (u.aheiScore < 70 || u.aheiScore >= 80)) return false;

      // Quick presets
      if (quickPreset === 'top10' && u.rank > 10) return false;
      if (quickPreset === 'employability' && u.employabilityScore < 85) return false;
      if (quickPreset === 'research' && u.researchScore < 85) return false;
      if (quickPreset === 'affordable') {
        const match = u.domesticTuitionUsd?.match(/\$?([\d,]+)/);
        const tuition = match ? parseInt(match[1].replace(/,/g, ''), 10) : 5000;
        if (tuition > 2500) return false;
      }

      return true;
    });
  }, [searchQuery, regionFilter, countryFilter, tierFilter, quickPreset]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...filtered];
    const getSortValue = (u: University): number | string => {
      switch (sortKey) {
        case 'rank': return u.rank;
        case 'name': return u.name;
        case 'score': return u.aheiScore;
        case 'research': return u.researchScore;
        case 'teaching': return u.teachingScore;
        case 'employability': return u.employabilityScore;
        case 'continental': return u.continentalRelevanceScore;
        case 'international': return u.internationalScore;
        default: return u.rank;
      }
    };

    list.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return list;
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRegionFilter('');
    setCountryFilter('');
    setTierFilter('all');
    setQuickPreset('all');
    setCurrentPage(1);
  };

  const hasFilters = searchQuery || regionFilter || countryFilter || tierFilter !== 'all' || quickPreset !== 'all';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* ─── Google Search Central Structured Data (BreadcrumbList) ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://ahei-index.org',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'African University Rankings 2027',
                item: 'https://ahei-index.org/rankings',
              },
            ],
          }),
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span
            className="font-code-badge text-white px-2.5 py-0.5 inline-block mb-1.5"
            style={{
              background: '#09090B',
              borderRadius: '12px',
            }}
          >
            2027 Continental League Table
          </span>
          <h1 className="font-headline-lg text-[#232323] m-0 mb-1">
            African University Rankings
          </h1>
          <p className="font-body-md text-[#838383] m-0">
            {sorted.length} audited institutions across 54 African countries.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#f9f9f9] p-1 border border-[#e9e9e9]" style={{ borderRadius: '24px' }}>
          <span className="text-xs font-semibold text-[#838383] px-2 hidden sm:inline">Table View:</span>
          <button
            onClick={() => setViewMode('simple')}
            className="px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
            style={{
              background: viewMode === 'simple' ? '#09090B' : 'transparent',
              color: viewMode === 'simple' ? '#FFFFFF' : '#838383',
              boxShadow: viewMode === 'simple' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              borderRadius: '20px',
              border: 'none',
            }}
          >
            Simple / Student View
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className="px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
            style={{
              background: viewMode === 'detailed' ? '#09090B' : 'transparent',
              color: viewMode === 'detailed' ? '#FFFFFF' : '#838383',
              boxShadow: viewMode === 'detailed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              borderRadius: '20px',
              border: 'none',
            }}
          >
            Academic Pillar Breakdown
          </button>
        </div>
      </div>

      {/* ─── Google Ad Space: Top Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="mb-6" />

      {/* Explainer: Understanding the Rankings */}
      {showExplainer && (
        <div className="the-card mb-6 p-5 border border-[#e9e9e9] relative" style={{ borderRadius: '16px' }}>
          <button
            onClick={() => setShowExplainer(false)}
            className="absolute top-4 right-4 text-xs text-[#838383] hover:text-[#232323] cursor-pointer bg-none border-none font-semibold"
            title="Dismiss explanation"
          >
            ✕ Dismiss
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="font-mono text-[10px] font-bold text-white px-2 py-0.5"
              style={{ background: '#164A3A', borderRadius: '8px' }}
            >
              METHODOLOGY GUIDE
            </span>
            <span className="font-title-md text-[#232323] font-bold">
              Understanding Ranking Scores &amp; Tiers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3.5 bg-[#f9f9f9] border border-[#e9e9e9]" style={{ borderRadius: '12px' }}>
              <span className="font-bold text-[#232323] block mb-1">
                1. What does the Overall Score mean?
              </span>
              <p className="text-[#838383] m-0 leading-relaxed">
                Scores range from <strong>0 to 100</strong>, calibrated across 1,048 institutions. Score 90+ represents world-class continental leaders.
              </p>
            </div>

            <div className="p-3.5 bg-[#f9f9f9] border border-[#e9e9e9]" style={{ borderRadius: '12px' }}>
              <span className="font-bold text-[#232323] block mb-1">
                2. The 3 Performance Tiers
              </span>
              <ul className="text-[#838383] m-0 pl-4 space-y-1">
                <li><strong className="text-[#164A3A]">Tier 1 (90+):</strong> Continental Elite</li>
                <li><strong className="text-[#164A3A]">Tier 2 (80–89.9):</strong> High Distinction</li>
                <li><strong className="text-[#838383]">Tier 3 (70–79.9):</strong> Notable Merit</li>
              </ul>
            </div>

            <div className="p-3.5 bg-[#f9f9f9] border border-[#e9e9e9]" style={{ borderRadius: '12px' }}>
              <span className="font-bold text-[#232323] block mb-1">
                3. The 5 Weighted Pillars
              </span>
              <p className="text-[#838383] m-0 leading-relaxed">
                Research (30%), Teaching (25%), Employability (20%), Continental Impact (15%), and Internationalization (10%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="the-card mb-6 p-5 border border-[#e9e9e9]" style={{ borderRadius: '16px' }}>
        {/* Row 1: Search and Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search universities, cities, or countries…"
              className="input-field w-full text-xs py-2.5 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
              style={{ borderRadius: '10px', background: '#FFFFFF' }}
            />
          </div>

          {/* Region */}
          <select
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
            className="input-field text-xs py-2.5 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ minWidth: '150px', borderRadius: '10px', background: '#FFFFFF' }}
          >
            <option value="">All Regions</option>
            {MACRO_REGIONS.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          {/* Country */}
          <select
            value={countryFilter}
            onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
            className="input-field text-xs py-2.5 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ minWidth: '150px', borderRadius: '10px', background: '#FFFFFF' }}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Tier */}
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }}
            className="input-field text-xs py-2.5 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ minWidth: '140px', borderRadius: '10px', background: '#FFFFFF' }}
          >
            <option value="all">All Tiers</option>
            <option value="tier1">Tier 1 · Elite (90+)</option>
            <option value="tier2">Tier 2 · Distinction (80–89.9)</option>
            <option value="tier3">Tier 3 · Merit (70–79.9)</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#B28A45] hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Row 2: 1-Click Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-[#f2f2f2]">
          <span className="text-[11px] font-semibold text-[#838383] uppercase tracking-wider">
            Quick Filters:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'top10', label: 'Top 10 Flagships' },
            { id: 'employability', label: 'High Employability (>85)' },
            { id: 'research', label: 'Top Research (>85)' },
            { id: 'affordable', label: 'Tuition < $2,500/yr' },
          ].map((preset) => {
            const isActive = quickPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset.id)}
                className="px-3 py-1 text-xs border cursor-pointer transition-colors"
                style={{
                  borderRadius: '20px',
                  background: isActive ? '#09090B' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#232323',
                  borderColor: isActive ? '#09090B' : '#d5d5d5',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="the-card p-0 border border-[#e9e9e9] overflow-hidden shadow-xs" style={{ borderRadius: '16px' }}>
        <div className="overflow-x-auto">
          {viewMode === 'simple' ? (
            /* ─── SIMPLE / STUDENT VIEW ─── */
            <table className="rankings-table" style={{ minWidth: '760px' }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('rank')} data-sort-active={sortKey === 'rank' ? 'true' : undefined} style={{ width: '56px' }}>
                    #{getSortIndicator('rank')}
                  </th>
                  <th onClick={() => handleSort('name')} data-sort-active={sortKey === 'name' ? 'true' : undefined}>
                    Institution &amp; Location{getSortIndicator('name')}
                  </th>
                  <th>Performance Tier</th>
                  <th onClick={() => handleSort('score')} data-sort-active={sortKey === 'score' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Overall Score{getSortIndicator('score')}
                  </th>
                  <th style={{ textAlign: 'center' }}>Staff Ratio</th>
                  <th style={{ textAlign: 'right' }}>Est. Tuition</th>
                  <th style={{ textAlign: 'center', width: '130px' }}>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u, idx) => {
                  const isTier1 = u.aheiScore >= 90;
                  const isTier2 = u.aheiScore >= 80 && u.aheiScore < 90;

                  return (
                    <React.Fragment key={u.id}>
                      <tr>
                        <td className="cell-rank">
                          <span className="font-tabular-num font-bold text-base text-[#232323]">
                            {u.rank}
                          </span>
                        </td>

                        <td className="cell-name py-4">
                          <div className="flex flex-col items-start gap-2">
                            {u.crestUrl && (
                              <div
                                className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFFFFF] border border-[#e9e9e9] p-1.5 flex items-center justify-center shadow-xs"
                                style={{ borderRadius: '12px' }}
                              >
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
                            <div>
                              <Link href={`/universities/${u.id}`} className="hover:text-[#164A3A] font-semibold text-[15px] block leading-snug">
                                {u.name}
                              </Link>
                              <span className="font-body-sm block text-[#838383] text-xs mt-0.5">
                                <span
                                  className="font-mono text-[10px] font-bold text-[#164A3A] bg-[#F7F6F2] px-1.5 py-0.5 mr-1"
                                  style={{ borderRadius: '4px' }}
                                >
                                  {u.countryCode.toUpperCase()}
                                </span>
                                {u.city}, {u.country} · {u.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 ${isTier1 ? 'text-[#164A3A] bg-[#faf5ff]' : isTier2 ? 'text-[#164A3A] bg-[#F7F6F2]' : 'text-[#838383] bg-[#f9f9f9]'}`}
                            style={{ borderRadius: '12px' }}
                          >
                            {isTier1 ? 'Tier 1 · Elite' : isTier2 ? 'Tier 2 · Distinction' : 'Tier 3 · Merit'}
                          </span>
                        </td>

                        <td className="cell-score">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="font-tabular-num font-bold text-base text-[#09090B]">
                              {u.aheiScore.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-[#838383]">/ 100</span>
                          </div>
                          <div className="text-[11px]">
                            {u.shift.type === 'up' && <span className="trend-up">↑ +{u.shift.val} places</span>}
                            {u.shift.type === 'down' && <span className="trend-down">↓ -{u.shift.val} places</span>}
                            {u.shift.type === 'equal' && <span className="trend-stable">— Steady</span>}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className="font-tabular-num text-xs font-semibold text-[#232323]">
                            {u.studentFacultyRatio || '18:1'}
                          </span>
                          <span className="block text-[10px] text-[#838383]">students/faculty</span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <span className="font-tabular-num text-xs font-semibold text-[#09090B]">
                            {u.domesticTuitionUsd || '$1,500'}
                          </span>
                          <span className="block text-[10px] text-[#838383]">per year</span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => addToCompare(u.id)}
                              disabled={isInCompare(u.id)}
                              className="px-2.5 py-1 text-xs border cursor-pointer transition-colors"
                              style={{
                                background: isInCompare(u.id) ? '#D9D7D0' : '#FFFFFF',
                                borderColor: isInCompare(u.id) ? '#164A3A' : '#d5d5d5',
                                color: isInCompare(u.id) ? '#164A3A' : '#232323',
                                borderRadius: '16px',
                                fontWeight: 600,
                              }}
                              title={isInCompare(u.id) ? 'Already in comparison' : 'Add to compare'}
                            >
                              {isInCompare(u.id) ? 'In Compare' : '+ Compare'}
                            </button>

                            <button
                              onClick={() => toggleBookmark(u.id)}
                              className="p-1 cursor-pointer transition-colors"
                              style={{
                                background: 'none',
                                border: 'none',
                              }}
                              title={isBookmarked(u.id) ? 'Saved' : 'Save to Shortlist'}
                            >
                              <svg className="w-4 h-4" fill={isBookmarked(u.id) ? "#164A3A" : "none"} stroke={isBookmarked(u.id) ? "#164A3A" : "#838383"} strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* In-Feed Google Ad break between row 5 and 6 */}
                      {idx === 4 && (
                        <tr key="ad-in-feed-simple">
                          <td colSpan={7} className="p-0 border-y border-[#e9e9e9] bg-[#f9f9f9]">
                            <GoogleAdSpace format="in-feed" className="my-2 border-0" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* ─── DETAILED ACADEMIC PILLAR BREAKDOWN VIEW ─── */
            <table className="rankings-table" style={{ minWidth: '900px' }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('rank')} data-sort-active={sortKey === 'rank' ? 'true' : undefined} style={{ width: '48px' }}>
                    #{getSortIndicator('rank')}
                  </th>
                  <th onClick={() => handleSort('name')} data-sort-active={sortKey === 'name' ? 'true' : undefined}>
                    Institution{getSortIndicator('name')}
                  </th>
                  <th>Country</th>
                  <th onClick={() => handleSort('score')} data-sort-active={sortKey === 'score' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Overall{getSortIndicator('score')}
                  </th>
                  <th onClick={() => handleSort('research')} data-sort-active={sortKey === 'research' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Research (30%){getSortIndicator('research')}
                  </th>
                  <th onClick={() => handleSort('teaching')} data-sort-active={sortKey === 'teaching' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Teaching (25%){getSortIndicator('teaching')}
                  </th>
                  <th onClick={() => handleSort('employability')} data-sort-active={sortKey === 'employability' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Employability (20%){getSortIndicator('employability')}
                  </th>
                  <th onClick={() => handleSort('continental')} data-sort-active={sortKey === 'continental' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Continental (15%){getSortIndicator('continental')}
                  </th>
                  <th onClick={() => handleSort('international')} data-sort-active={sortKey === 'international' ? 'true' : undefined} style={{ textAlign: 'right' }}>
                    Intl (10%){getSortIndicator('international')}
                  </th>
                  <th style={{ width: '40px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u, idx) => (
                  <React.Fragment key={u.id}>
                    <tr>
                      <td className="cell-rank">{u.rank}</td>
                      <td className="cell-name py-3.5">
                        <div className="flex flex-col items-start gap-1.5">
                          {u.crestUrl && (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#FFFFFF] border border-[#d5d5d5] p-1 rounded-xs flex items-center justify-center shadow-xs">
                              <img
                                src={u.crestUrl}
                                alt={`${u.name} official crest`}
                                width={44}
                                height={44}
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <Link href={`/universities/${u.id}`} className="hover:text-[#09090B] font-semibold text-sm leading-snug">
                            {u.name}
                          </Link>
                        </div>
                      </td>
                      <td className="cell-country">
                        <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f9f9f9] px-1 py-0.5 border border-[#d5d5d5] mr-1.5">
                          {u.countryCode.toUpperCase()}
                        </span>
                        {u.country}
                      </td>
                      <td className="cell-score font-bold text-[#09090B]">{u.aheiScore.toFixed(1)}</td>
                      <td className="cell-score">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-tabular-num font-semibold text-xs">{u.researchScore.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-[#f9f9f9] rounded-xs overflow-hidden">
                            <div
                              className="h-full rounded-xs transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0, u.researchScore))}%`,
                                backgroundColor: getPillarBarColor(u.researchScore),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="cell-score">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-tabular-num font-semibold text-xs">{u.teachingScore.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-[#f9f9f9] rounded-xs overflow-hidden">
                            <div
                              className="h-full rounded-xs transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0, u.teachingScore))}%`,
                                backgroundColor: getPillarBarColor(u.teachingScore),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="cell-score">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-tabular-num font-semibold text-xs">{u.employabilityScore.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-[#f9f9f9] rounded-xs overflow-hidden">
                            <div
                              className="h-full rounded-xs transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0, u.employabilityScore))}%`,
                                backgroundColor: getPillarBarColor(u.employabilityScore),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="cell-score">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-tabular-num font-semibold text-xs">{u.continentalRelevanceScore.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-[#f9f9f9] rounded-xs overflow-hidden">
                            <div
                              className="h-full rounded-xs transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0, u.continentalRelevanceScore))}%`,
                                backgroundColor: getPillarBarColor(u.continentalRelevanceScore),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="cell-score">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-tabular-num font-semibold text-xs">{u.internationalScore.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-[#f9f9f9] rounded-xs overflow-hidden">
                            <div
                              className="h-full rounded-xs transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0, u.internationalScore))}%`,
                                backgroundColor: getPillarBarColor(u.internationalScore),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => addToCompare(u.id)}
                          disabled={isInCompare(u.id)}
                          className="cursor-pointer text-xs font-mono font-bold"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isInCompare(u.id) ? '#09090B' : '#8c8e87',
                          }}
                          title={isInCompare(u.id) ? 'In compare' : 'Add to compare'}
                        >
                          {isInCompare(u.id) ? 'IN' : '+'}
                        </button>
                      </td>
                    </tr>

                    {/* In-Feed Google Ad break between row 5 and 6 */}
                    {idx === 4 && (
                      <tr key="ad-in-feed-detailed">
                        <td colSpan={10} className="p-0 border-y border-[#d5d5d5] bg-[#f2f2f2]">
                          <GoogleAdSpace format="in-feed" className="my-2 border-0" />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination border-t border-[#f2f2f2] p-4 bg-[#f9f9f9] flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 text-xs font-semibold border border-[#d5d5d5] hover:border-[#164A3A] hover:text-[#164A3A] bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              style={{ borderRadius: '20px' }}
            >
              ← Previous
            </button>
            <span className="text-xs text-[#838383] font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 text-xs font-semibold border border-[#d5d5d5] hover:border-[#164A3A] hover:text-[#164A3A] bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              style={{ borderRadius: '20px' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="font-body-sm mt-4 text-[#838383] text-center">
        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of {sorted.length} audited universities
      </div>
    </div>
  );
}
