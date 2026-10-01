import React, { useState, useMemo } from 'react';
import { University } from '../data/universities';

interface RankingsScreenProps {
  universities: University[];
  onSelectUniversity: (id: string) => void;
  onAddToCompare: (id: string) => void;
  comparedIds: string[];
  initialFilters?: { country?: string; region?: string; search?: string };
}

export const RankingsScreen: React.FC<RankingsScreenProps> = ({
  universities,
  onSelectUniversity,
  onAddToCompare,
  comparedIds,
  initialFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.search || '');
  const [selectedRegion, setSelectedRegion] = useState(initialFilters?.region || 'all');
  const [selectedCountry, setSelectedCountry] = useState(initialFilters?.country || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTuition, setSelectedTuition] = useState('all');
  const [sortBy, setSortBy] = useState<'rank' | 'projected_rank' | 'projected_score' | 'momentum' | 'research' | 'employability' | 'climbers'>('rank');
  const [viewMode, setViewMode] = useState<'standard' | 'detailed' | 'forecast'>('standard');
  const [activeWeighting, setActiveWeighting] = useState<'overall' | 'research' | 'teaching' | 'employability' | 'continental' | 'intl'>('overall');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const pageSize = 12;

  // Filtered & sorted list
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchesSearch =
        searchQuery === '' ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.flagshipFaculties.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === 'all' || u.region === selectedRegion;
      const matchesCountry = selectedCountry === 'all' || u.country === selectedCountry;
      
      let matchesType = true;
      if (selectedType === 'public') matchesType = u.type.toLowerCase().includes('public') || u.type.toLowerCase().includes('federal');
      else if (selectedType === 'private') matchesType = u.type.toLowerCase().includes('private');
      else if (selectedType === 'tech') matchesType = u.type.toLowerCase().includes('tech') || u.name.toLowerCase().includes('tech') || u.name.toLowerCase().includes('science');

      let matchesTuition = true;
      if (selectedTuition === 'sub1k') matchesTuition = u.domesticTuitionUsd.includes('$2') || u.domesticTuitionUsd.includes('$3') || u.domesticTuitionUsd.includes('$4');
      else if (selectedTuition === '1k-3k') matchesTuition = u.domesticTuitionUsd.includes('$1,') || u.domesticTuitionUsd.includes('$2,');
      else if (selectedTuition === '3k-6k') matchesTuition = u.domesticTuitionUsd.includes('$3,') || u.domesticTuitionUsd.includes('$4,');
      else if (selectedTuition === 'over6k') matchesTuition = u.domesticTuitionUsd.includes('$12,') || u.internationalTuitionAnnual.includes('$8,');

      return matchesSearch && matchesRegion && matchesCountry && matchesType && matchesTuition;
    });
  }, [universities, searchQuery, selectedRegion, selectedCountry, selectedType, selectedTuition]);

  const sortedUniversities = useMemo(() => {
    const list = [...filteredUniversities];
    if (sortBy === 'rank') {
      list.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'projected_rank') {
      list.sort((a, b) => (a.projectedRankNextYear || a.rank) - (b.projectedRankNextYear || b.rank));
    } else if (sortBy === 'projected_score') {
      list.sort((a, b) => (b.projectedScoreNextYear || b.aheiScore) - (a.projectedScoreNextYear || a.aheiScore));
    } else if (sortBy === 'momentum') {
      list.sort((a, b) => (b.momentumVelocity || 0) - (a.momentumVelocity || 0));
    } else if (sortBy === 'research') {
      list.sort((a, b) => b.researchScore - a.researchScore);
    } else if (sortBy === 'employability') {
      list.sort((a, b) => b.employabilityScore - a.employabilityScore);
    } else if (sortBy === 'climbers') {
      list.sort((a, b) => (b.shift.type === 'up' ? b.shift.val : 0) - (a.shift.type === 'up' ? a.shift.val : 0));
    }
    return list;
  }, [filteredUniversities, sortBy]);

  const totalPages = Math.ceil(sortedUniversities.length / pageSize) || 1;
  const paginatedList = sortedUniversities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownloadCSV = () => {
    let csv = 'Rank_2027,Proj_Rank_2028,Proj_Delta,Trajectory,Momentum_Velocity,Institution,Location,Country,Region,AHEI_Score_2027,Proj_Score_2028,Research,Teaching,Employability,Audit_Cert\n';
    sortedUniversities.forEach((u) => {
      const deltaStr = (u.projectedRankDelta || 0) > 0 ? `+${u.projectedRankDelta}` : `${u.projectedRankDelta || 0}`;
      csv += `${u.rank},${u.projectedRankNextYear || u.rank},${deltaStr},"${u.trajectory || 'Consolidating'}",${u.momentumVelocity || 0},"${u.name}","${u.city}","${u.country}","${u.region}",${u.aheiScore},${u.projectedScoreNextYear || u.aheiScore},${u.researchScore},${u.teachingScore},${u.employabilityScore},"${u.auditCertification || 'AU-AHEI-2027'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AHEI_Africa_Rankings_2027_2028_Forecast_${selectedCountry !== 'all' ? selectedCountry : 'All'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Academic Masthead Notification */}
      <section className="w-full bg-[#dedad2] text-[#232323] px-6 lg:px-12 py-2 flex flex-wrap items-center justify-between gap-2 text-body-sm text-[12px]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#09090B] text-white font-code-badge text-[10px] font-bold">
            i
          </span>
          <span className="font-semibold text-[#09090B]">OFFICIAL LEAGUE TABLE RELEASE:</span>
          <span className="text-[#838383]">Validated under the ISO/AHEI Academic Intelligence Framework v4.2</span>
        </div>
        <div className="flex items-center gap-3 text-[#838383]">
          <span className="flex items-center gap-1 font-code-badge text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            REGISTRY SYNCHRONIZED
          </span>
          <span className="text-[#d5d5d5]">|</span>
          <a href="#methodology-notes" className="text-[#164A3A] font-semibold hover:underline">
            Auditor Signed Off (Oct 2026)
          </a>
        </div>
      </section>

      {/* Editorial Header & Methodology Note */}
      <header className="w-full bg-white px-6 lg:px-12 py-10 shadow-xs border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[#164A3A] font-code-badge text-[11px] uppercase tracking-widest font-semibold mb-2">
                <span>Volume IX</span>
                <span>•</span>
                <span>Continental Standard</span>
                <span>•</span>
                <span>Peer-Reviewed League Table</span>
              </div>
              <h1 className="font-headline-lg text-[34px] lg:text-[42px] text-[#09090B] tracking-tight font-serif mb-3 font-semibold uppercase">
                AFRICA UNIVERSITY RANKINGS 2027
              </h1>
              <p className="font-body-lg text-[18px] text-[#838383] leading-relaxed font-serif">
                The definitive continental index evaluating 500 accredited higher-education institutions across 54 African countries. Gauging scientific impact, pedagogical depth, and societal transformation.
              </p>
            </div>

            {/* Analytical Live Counters */}
            <div className="flex flex-wrap sm:flex-nowrap gap-1 self-start lg:self-end bg-[#E6E3DC] p-1.5 border border-[#d5d5d5]">
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#838383]">Ranked</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#09090B]">500</span>
                <span className="block font-body-sm text-[11px] text-[#8c8e87]">Institutions</span>
              </div>
              <div className="w-[1px] bg-[#d5d5d5]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#838383]">Coverage</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#09090B]">54</span>
                <span className="block font-body-sm text-[11px] text-[#8c8e87]">Member States</span>
              </div>
              <div className="w-[1px] bg-[#d5d5d5]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#838383]">Indexed</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#09090B]">1.8M</span>
                <span className="block font-body-sm text-[11px] text-[#8c8e87]">Citations</span>
              </div>
              <div className="w-[1px] bg-[#d5d5d5]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#838383]">Cycle</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#164A3A]">Oct '26</span>
                <span className="block font-body-sm text-[11px] text-[#8c8e87]">Official Baseline</span>
              </div>
            </div>
          </div>

          {/* Formula Weighting: Hierarchical Dropdown */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E6E3DC]">
            <div className="flex items-center gap-3">
              <label htmlFor="formula-weighting-select" className="font-code-badge text-[11px] uppercase text-[#09090B] font-bold">
                Formula Weighting:
              </label>
              <select
                id="formula-weighting-select"
                value={activeWeighting}
                onChange={(e) => setActiveWeighting(e.target.value as any)}
                className="bg-white border border-[#d5d5d5] font-title-md text-[13px] text-[#232323] px-3 py-1.5 outline-none focus:border-[#09090B] cursor-pointer"
              >
                <option value="overall">Overall League Table (100%)</option>
                <option value="research">Research Citations &amp; Impact (30%)</option>
                <option value="teaching">Teaching &amp; Faculty Ratio (25%)</option>
                <option value="employability">Graduate Employability (20%)</option>
                <option value="continental">Continental Relevance &amp; Agenda 2063 (15%)</option>
                <option value="intl">International Mobility &amp; Diversity (10%)</option>
              </select>
            </div>
            <div className="flex items-center gap-1 font-code-badge text-[11px] text-[#838383] shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#164A3A]">verified</span>
              <span>Double-blind statistical review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Comprehensive Filter & Search Controller */}
      <section className="w-full bg-[#E6E3DC] px-6 lg:px-12 py-5 shadow-xs sticky top-16 z-40 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search bar */}
            <div className="lg:col-span-4 relative flex items-center bg-white border border-[#d5d5d5] focus-within:border-[#09090B] transition-colors rounded-xs">
              <span className="material-symbols-outlined absolute left-3 text-[20px] text-[#8c8e87]" aria-hidden="true">search</span>
              <input
                type="text"
                value={searchQuery}
                aria-label="Search institution, city, or academic specialty"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                placeholder="Search institution, city, or specialty..."
                className="w-full pl-10 pr-4 py-2 bg-transparent font-body-md text-[14px] text-[#232323] outline-none placeholder:text-[#8c8e87]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="mr-2 text-xs text-[#8c8e87] hover:text-[#232323] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter: Region */}
            <div className="lg:col-span-2 bg-white border border-[#d5d5d5] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#8c8e87] mr-1">public</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#232323] py-2 outline-none cursor-pointer"
              >
                <option value="all">All Africa (54)</option>
                <option value="Southern Africa">Southern Africa</option>
                <option value="East Africa">East Africa</option>
                <option value="North Africa">North Africa</option>
                <option value="West Africa">West Africa</option>
                <option value="Central Africa">Central Africa</option>
              </select>
            </div>

            {/* Filter: Country */}
            <div className="lg:col-span-2 bg-white border border-[#d5d5d5] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#8c8e87] mr-1">flag</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#232323] py-2 outline-none cursor-pointer"
              >
                <option value="all">All Countries</option>
                <option value="South Africa">South Africa</option>
                <option value="Egypt">Egypt</option>
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Uganda">Uganda</option>
                <option value="Ghana">Ghana</option>
                <option value="Ethiopia">Ethiopia</option>
              </select>
            </div>

            {/* Filter: Institution Type */}
            <div className="lg:col-span-2 bg-white border border-[#d5d5d5] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#8c8e87] mr-1">account_balance</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#232323] py-2 outline-none cursor-pointer"
              >
                <option value="all">All Institution Types</option>
                <option value="public">Public Autonomous</option>
                <option value="private">Private Chartered</option>
                <option value="tech">Specialized Tech</option>
              </select>
            </div>

            {/* Filter: Tuition Bracket */}
            <div className="lg:col-span-2 bg-white border border-[#d5d5d5] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#8c8e87] mr-1">payments</span>
              <select
                value={selectedTuition}
                onChange={(e) => setSelectedTuition(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#232323] py-2 outline-none cursor-pointer"
              >
                <option value="all">Tuition (All Ranges)</option>
                <option value="sub1k">&lt; $1,000 / year</option>
                <option value="1k-3k">$1,000 – $3,000 / yr</option>
                <option value="3k-6k">$3,000 – $6,000 / yr</option>
                <option value="over6k">&gt; $6,000 / yr</option>
              </select>
            </div>
          </div>

          {/* Secondary Controls: Dropdown Sort and View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 font-body-sm text-[13px] text-[#838383]">
              <label htmlFor="rankings-sort-select" className="font-semibold text-[#09090B]">Sort By:</label>
              <select
                id="rankings-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#d5d5d5] px-3 py-1 font-body-sm text-[13px] text-[#232323] outline-none focus:border-[#09090B] cursor-pointer"
              >
                <option value="rank">2027 Official Rank</option>
                <option value="projected_rank">2028 Projected Rank (Model)</option>
                <option value="projected_score">2028 Projected Score</option>
                <option value="momentum">Momentum Velocity</option>
                <option value="research">Research Impact</option>
                <option value="employability">Graduate Employability</option>
                <option value="climbers">Biggest Climbers</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white border border-[#d5d5d5] p-0.5">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`px-3 py-1 font-code-badge text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'standard'
                      ? 'bg-[#09090B] text-white font-bold'
                      : 'text-[#838383] hover:text-[#09090B]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">table_rows</span>
                  <span>Standard</span>
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-1 font-code-badge text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-[#09090B] text-white font-bold'
                      : 'text-[#838383] hover:text-[#09090B]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">query_stats</span>
                  <span>Detailed</span>
                </button>
                <button
                  onClick={() => setViewMode('forecast')}
                  className={`px-3 py-1 font-code-badge text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'forecast'
                      ? 'bg-[#164A3A] text-white font-bold'
                      : 'text-[#164A3A] hover:bg-[#F7F6F2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>2028 Forecast (Next-Year Model)</span>
                </button>
              </div>

              <button
                onClick={handleDownloadCSV}
                className="hover:bg-[#f9f9f9] text-[#09090B] font-body-sm text-[12px] px-2.5 py-1 flex items-center gap-1 transition-colors underline underline-offset-4 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Master 2027 / 2028 Predictive League Table Container */}
      <main className="w-full px-6 lg:px-12 py-8 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto bg-white border border-[#d5d5d5] shadow-xs overflow-hidden">
          {/* Table Head & Structural Scroll */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#dedad2] text-[#09090B] font-code-badge text-[11px] uppercase tracking-wider select-none border-b border-[#d5d5d5]">
                  {viewMode === 'forecast' ? (
                    <>
                      <th className="py-3 px-3 text-center w-14">2027 Rank</th>
                      <th className="py-3 px-3 text-center w-20 bg-[#e3e2e6] text-[#164A3A] font-bold">2028 Proj.</th>
                      <th className="py-3 px-2 text-center w-16">Delta</th>
                      <th className="py-3 px-4 min-w-[260px]">Institution &amp; Location</th>
                      <th className="py-3 px-3 min-w-[110px]">Country</th>
                      <th className="py-3 px-3 text-right min-w-[100px]">2027 Score</th>
                      <th className="py-3 px-3 text-right bg-[#e3e2e6] min-w-[110px] text-[#164A3A] font-bold">2028 Proj. Score</th>
                      <th className="py-3 px-3 text-right min-w-[110px]">Momentum</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">Trajectory</th>
                      <th className="py-3 px-3 text-left min-w-[150px]">Audit Certification</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3 text-center w-14">Rank</th>
                      <th className="py-3 px-2 text-center w-14">Shift</th>
                      <th className="py-3 px-4 min-w-[280px]">Institution &amp; Location</th>
                      <th className="py-3 px-3 min-w-[120px]">Country</th>
                      <th className="py-3 px-3 text-right bg-[#e3e2e6] min-w-[110px] text-[#09090B] font-bold">
                        AHEI Score
                      </th>
                      <th className="py-3 px-3 text-right min-w-[110px]">Research (30%)</th>
                      <th className="py-3 px-3 text-right min-w-[110px]">Teaching (25%)</th>
                      <th className="py-3 px-3 text-right min-w-[110px]">Employability (20%)</th>
                      {viewMode === 'detailed' && (
                        <>
                          <th className="py-3 px-3 text-right min-w-[110px]">Continental (15%)</th>
                          <th className="py-3 px-3 text-right min-w-[110px]">Intl Outlook (10%)</th>
                        </>
                      )}
                      <th className="py-3 px-3 text-right min-w-[90px]">Staff/Student</th>
                      <th className="py-3 px-3 text-right min-w-[90px]">Intl. Cohort</th>
                      <th className="py-3 px-4 text-center min-w-[140px]">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E3DC] font-body-md text-[14px] text-[#232323]">
                {paginatedList.map((uni) => {
                  const isCompared = comparedIds.includes(uni.id);
                  const isTopPick = uni.rank <= 3 || uni.id === 'uon';
                  const projRank = uni.projectedRankNextYear || uni.rank;
                  const delta = uni.projectedRankDelta !== undefined ? uni.projectedRankDelta : (uni.rank - projRank);
                  const trajectory = uni.trajectory || (delta >= 2 ? 'Surging' : delta >= 1 ? 'Advancing' : delta === 0 ? 'Consolidating' : 'At Risk');

                  if (viewMode === 'forecast') {
                    return (
                      <tr
                        key={uni.id}
                        className={`hover:bg-[#f9f9f9] transition-colors group ${
                          isTopPick ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-tabular-num font-medium text-[16px] text-[#838383]">
                            #{uni.rank.toString().padStart(2, '0')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center bg-[#E6E3DC]/30">
                          <span className="font-tabular-num font-bold text-[18px] text-[#164A3A]">
                            #{projRank.toString().padStart(2, '0')}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          {delta > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 text-emerald-800 font-code-badge text-[11px] font-bold rounded-[2px]">
                              ▲ +{delta}
                            </span>
                          )}
                          {delta < 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-50 text-rose-800 font-code-badge text-[11px] font-bold rounded-[2px]">
                              ▼ {delta}
                            </span>
                          )}
                          {delta === 0 && (
                            <span className="inline-block px-1.5 py-0.5 bg-[#E6E3DC] text-[#838383] font-code-badge text-[11px] font-medium rounded-[2px]">
                              — 0
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <button
                              onClick={() => onSelectUniversity(uni.id)}
                              className="font-title-md text-[15px] text-[#09090B] hover:text-[#164A3A] font-bold tracking-tight text-left cursor-pointer transition-colors"
                            >
                              {uni.name}
                            </button>
                            <span className="font-body-sm text-[12px] text-[#838383] flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              {uni.city} • {uni.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[16px]">{uni.flag}</span>
                            <span className="font-medium text-[#232323] text-xs">{uni.country}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="font-tabular-num text-[15px] font-medium text-[#838383]">
                            {uni.aheiScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right bg-[#E6E3DC]/30">
                          <span className="font-tabular-num text-[17px] font-bold text-[#164A3A]">
                            {(uni.projectedScoreNextYear || uni.aheiScore).toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-tabular-num text-xs font-semibold text-[#164A3A]">
                          +{uni.momentumVelocity?.toFixed(2) || '0.00'} pts/yr
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 font-code-badge text-[10px] uppercase font-bold rounded-[2px] ${
                            trajectory === 'Surging'
                              ? 'bg-[#164A3A] text-white'
                              : trajectory === 'Advancing'
                              ? 'bg-[#B28A45] text-white'
                              : trajectory === 'Consolidating'
                              ? 'bg-[#E6E3DC] text-[#171918]'
                              : 'bg-[#faedd9] text-[#842029]'
                          }`}>
                            {trajectory}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-left">
                          <span className="font-code-badge text-[11px] text-[#676963] bg-[#E6E3DC]/50 px-1.5 py-0.5 rounded-[2px] border border-[#d5d5d5]">
                            {uni.auditCertification || `AU-AHEI-2027-${uni.countryCode.toUpperCase()}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setActiveRowMenuId(activeRowMenuId === uni.id ? null : uni.id)}
                              className="p-1.5 text-[#838383] hover:text-[#232323] hover:bg-[#f9f9f9] transition-colors cursor-pointer rounded-xs"
                              title={`Actions for ${uni.name}`}
                              aria-label={`Actions for ${uni.name}`}
                              aria-haspopup="true"
                              aria-expanded={activeRowMenuId === uni.id}
                            >
                              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                            {activeRowMenuId === uni.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[12px] text-left">
                                <button
                                  onClick={() => {
                                    onSelectUniversity(uni.id);
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px] text-[#09090B]">visibility</span>
                                  <span>View Dossier</span>
                                </button>
                                <button
                                  onClick={() => {
                                    onAddToCompare(uni.id);
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px] text-[#164A3A]">compare_arrows</span>
                                  <span>{isCompared ? 'Remove Compare' : 'Add to Compare'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={uni.id}
                      className={`hover:bg-[#f9f9f9] transition-colors group ${
                        isTopPick ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-tabular-num font-bold text-[18px] text-[#09090B]">
                          {uni.rank.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        {uni.shift.type === 'up' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 text-emerald-800 font-code-badge text-[11px] font-bold">
                            ▲ {uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'down' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-50 text-[#164A3A] font-code-badge text-[11px] font-bold">
                            ▼ {uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'equal' && (
                          <span className="inline-block px-1.5 py-0.5 bg-[#E6E3DC] text-[#838383] font-code-badge text-[11px] font-medium">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectUniversity(uni.id)}
                              className="font-title-md text-[15px] text-[#09090B] hover:text-[#164A3A] font-bold tracking-tight text-left cursor-pointer transition-colors"
                            >
                              {uni.name}
                            </button>
                            {uni.id === 'uct' && (
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" title="Tier 1 Research Excellence"></span>
                            )}
                            {uni.id === 'uon' && (
                              <span className="font-code-badge text-[10px] bg-[#faedd9] text-[#3b2a0c] px-1.5 py-0.2 uppercase font-semibold">
                                East Africa #1
                              </span>
                            )}
                            {uni.id === 'cairo' && (
                              <span className="font-code-badge text-[10px] bg-[#dedad2] text-[#09090B] px-1.5 py-0.2 uppercase font-semibold">
                                North Africa #1
                              </span>
                            )}
                            {uni.id === 'ibadan' && (
                              <span className="font-code-badge text-[10px] bg-[#faedd9] text-[#3b2a0c] px-1.5 py-0.2 uppercase font-semibold">
                                West Africa #1
                              </span>
                            )}
                            {uni.id === 'aau' && (
                              <span className="font-code-badge text-[10px] bg-[#faedd9] text-[#3b2a0c] px-1.5 py-0.2 uppercase font-semibold">
                                Fastest Riser
                              </span>
                            )}
                          </div>
                          <span className="font-body-sm text-[12px] text-[#838383] flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {uni.city} • {uni.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px]">{uni.flag}</span>
                          <span className="font-medium text-[#232323] text-xs">{uni.country}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right bg-[#E6E3DC]/40">
                        <span className="font-tabular-num text-[17px] font-bold text-[#09090B]">
                          {uni.aheiScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num font-medium text-[#09090B]">
                        {uni.researchScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                        {uni.teachingScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                        {uni.employabilityScore.toFixed(1)}
                      </td>
                      {viewMode === 'detailed' && (
                        <>
                          <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                            {uni.continentalRelevanceScore.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                            {uni.internationalScore.toFixed(1)}
                          </td>
                        </>
                      )}
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                        {uni.studentFacultyRatio}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#838383]">
                        {uni.internationalDiversityPct}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveRowMenuId(activeRowMenuId === uni.id ? null : uni.id)}
                            className="p-1.5 text-[#838383] hover:text-[#232323] hover:bg-[#f9f9f9] transition-colors cursor-pointer rounded-xs"
                            title={`Actions for ${uni.name}`}
                            aria-label={`Actions for ${uni.name}`}
                            aria-haspopup="true"
                            aria-expanded={activeRowMenuId === uni.id}
                          >
                            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                          </button>
                          {activeRowMenuId === uni.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[12px] text-left">
                              <button
                                onClick={() => {
                                  onSelectUniversity(uni.id);
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px] text-[#09090B]">visibility</span>
                                <span>View Dossier</span>
                              </button>
                              <button
                                onClick={() => {
                                  onAddToCompare(uni.id);
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px] text-[#164A3A]">compare_arrows</span>
                                <span>{isCompared ? 'Remove Compare' : 'Add to Compare'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Strip */}
          <div className="px-6 py-4 bg-[#f9f9f9] flex flex-col sm:flex-row items-center justify-between gap-3 font-body-sm text-[12px] text-[#838383] border-t border-[#d5d5d5]">
            <div>
              Showing <span className="font-bold text-[#09090B]">1–{paginatedList.length}</span> of{' '}
              <span className="font-bold text-[#09090B]">{sortedUniversities.length}</span> verified institutions across Africa
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-[#8c8e87] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    currentPage === pg
                      ? 'bg-[#09090B] text-white font-bold'
                      : 'bg-white hover:bg-[#E6E3DC] text-[#232323] border border-[#d5d5d5]'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <span className="px-2">...</span>
              <button
                onClick={() => setCurrentPage(42)}
                className="px-3 py-1 bg-white hover:bg-[#E6E3DC] text-[#232323] border border-[#d5d5d5] cursor-pointer"
              >
                42
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 bg-white hover:bg-[#E6E3DC] text-[#09090B] font-medium flex items-center gap-1 border border-[#d5d5d5] cursor-pointer"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Analytics & Methodology Explanatory Callout Grid */}
        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6" id="methodology-notes">
          {/* Key Indicator Definitions */}
          <div className="lg:col-span-2 bg-white p-6 shadow-xs border border-[#d5d5d5]">
            <h3 className="font-title-lg text-[18px] text-[#09090B] font-serif font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164A3A] text-[20px]">menu_book</span>
              Statistical Indicator Definitions &amp; Next-Year Predictive Engine
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-body-sm text-[12px] text-[#838383]">
              <div>
                <span className="font-bold text-[#09090B] block mb-0.5">1. Research Impact (30% Weight):</span>
                <p>
                  Field-Weighted Citation Impact (FWCI) aggregated over 5 calendar years via Scopus &amp; Web of Science; papers per academic staff member, and continental co-authorship density.
                </p>
              </div>
              <div>
                <span className="font-bold text-[#09090B] block mb-0.5">2. Teaching &amp; Faculty (25% Weight):</span>
                <p>
                  Full-time doctoral qualification ratio of professoriate, institutional teaching budget per student, and audited academic staff-to-student operational load.
                </p>
              </div>
              <div>
                <span className="font-bold text-[#09090B] block mb-0.5">3. Graduate Employability (20% Weight):</span>
                <p>
                  Alumni employment tracking at 6 and 12 months post-convocation, domestic corporate employer reputation survey (N=18,400 respondents across Africa).
                </p>
              </div>
              <div>
                <span className="font-bold text-[#09090B] block mb-0.5">4. AHEI-NYPM v1.0 Predictive Model:</span>
                <p>
                  Next-year 2028 ranks are calculated via compound bibliometric citation momentum, doctoral faculty expansion, and statutory accreditation governance completeness. Trajectories are designated: <strong className="text-[#164A3A]">Surging</strong> (▲ &ge; 2), <strong className="text-[#B28A45]">Advancing</strong> (▲ +1), <strong className="text-[#232323]">Consolidating</strong> (0), or <strong className="text-[#842029]">At Risk</strong> (&minus;).
                </p>
              </div>
            </div>
          </div>

          {/* Formal Governance & Ethics Seal */}
          <div className="bg-[#f9f9f9] p-6 shadow-xs border border-[#d5d5d5] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#09090B] font-code-badge text-[11px] uppercase font-bold mb-2">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified_user</span>
                <span>Integrity Charter</span>
              </div>
              <h4 className="font-title-md text-[15px] text-[#09090B] font-bold mb-2">
                Independent Audit Guarantee
              </h4>
              <p className="font-body-sm text-[12px] text-[#838383] leading-relaxed mb-4">
                Institutions do not pay for inclusion, profiling, or re-weighting in the AHEI Master Index. Institutional performance audits are conducted by an autonomous committee of African vice-chancellors and global statisticians.
              </p>
            </div>
            <div className="p-3 bg-[#e3e2e6] text-[#171918] font-code-badge text-[11px] leading-tight flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#164A3A] shrink-0">verified</span>
              <span>
                <strong>AUDIT NOTICE:</strong> Next-year projections and current baselines are certified under statutory charters with sovereign national regulators across 54 AU member states.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
