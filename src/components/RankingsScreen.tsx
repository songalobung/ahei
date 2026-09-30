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
  const [sortBy, setSortBy] = useState<'rank' | 'research' | 'employability' | 'climbers'>('rank');
  const [viewMode, setViewMode] = useState<'standard' | 'detailed'>('standard');
  const [activeWeighting, setActiveWeighting] = useState<'overall' | 'research' | 'teaching' | 'employability' | 'continental' | 'intl'>('overall');
  const [currentPage, setCurrentPage] = useState(1);
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
    let csv = 'Rank,Shift,Institution,Location,Country,Region,AHEI_Score,Research,Teaching,Employability,Staff_Student_Ratio,Intl_Cohort\n';
    sortedUniversities.forEach((u) => {
      const shiftStr = u.shift.type === 'up' ? `+${u.shift.val}` : u.shift.type === 'down' ? `-${u.shift.val}` : '0';
      csv += `${u.rank},${shiftStr},"${u.name}","${u.city}","${u.country}","${u.region}",${u.aheiScore},${u.researchScore},${u.teachingScore},${u.employabilityScore},"${u.studentFacultyRatio}",${u.internationalDiversityPct}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AHEI_2027_Africa_Rankings_${selectedCountry !== 'all' ? selectedCountry : 'All'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Academic Masthead Notification */}
      <section className="w-full bg-[#e9e7ec] text-[#1b1b1f] px-6 lg:px-12 py-2 flex flex-wrap items-center justify-between gap-2 text-body-sm text-[12px]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00241a] text-white font-code-badge text-[10px] font-bold">
            i
          </span>
          <span className="font-semibold text-[#00241a]">OFFICIAL LEAGUE TABLE RELEASE:</span>
          <span className="text-[#414845]">Validated under the ISO/AHEI Academic Intelligence Framework v4.2</span>
        </div>
        <div className="flex items-center gap-3 text-[#414845]">
          <span className="flex items-center gap-1 font-code-badge text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            REGISTRY SYNCHRONIZED
          </span>
          <span className="text-[#c0c8c3]">|</span>
          <a href="#methodology-notes" className="text-[#a14013] font-semibold hover:underline">
            Auditor Signed Off (Oct 2026)
          </a>
        </div>
      </section>

      {/* Editorial Header & Methodology Note */}
      <header className="w-full bg-white px-6 lg:px-12 py-10 shadow-xs border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[#a14013] font-code-badge text-[11px] uppercase tracking-widest font-semibold mb-2">
                <span>Volume IX</span>
                <span>•</span>
                <span>Continental Standard</span>
                <span>•</span>
                <span>Peer-Reviewed League Table</span>
              </div>
              <h1 className="font-headline-lg text-[34px] lg:text-[42px] text-[#00241a] tracking-tight font-serif mb-3 font-semibold uppercase">
                AFRICA UNIVERSITY RANKINGS 2027
              </h1>
              <p className="font-body-lg text-[18px] text-[#414845] leading-relaxed font-serif">
                The definitive continental index evaluating 500 accredited higher-education institutions across 54 African countries. Gauging scientific impact, pedagogical depth, and societal transformation.
              </p>
            </div>

            {/* Analytical Live Counters */}
            <div className="flex flex-wrap sm:flex-nowrap gap-1 self-start lg:self-end bg-[#efedf1] p-1.5 border border-[#c0c8c3]">
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#414845]">Ranked</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#00241a]">500</span>
                <span className="block font-body-sm text-[11px] text-[#717974]">Institutions</span>
              </div>
              <div className="w-[1px] bg-[#c0c8c3]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#414845]">Coverage</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#00241a]">54</span>
                <span className="block font-body-sm text-[11px] text-[#717974]">Member States</span>
              </div>
              <div className="w-[1px] bg-[#c0c8c3]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#414845]">Indexed</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#00241a]">1.8M</span>
                <span className="block font-body-sm text-[11px] text-[#717974]">Citations</span>
              </div>
              <div className="w-[1px] bg-[#c0c8c3]"></div>
              <div className="px-4 py-1 text-left">
                <span className="block font-code-badge text-[10px] uppercase text-[#414845]">Cycle</span>
                <span className="block font-tabular-num text-[22px] font-bold text-[#a14013]">Oct '26</span>
                <span className="block font-body-sm text-[11px] text-[#717974]">Official Baseline</span>
              </div>
            </div>
          </div>

          {/* Formula Weighting Pill Bar */}
          <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-[#efedf1]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-body-sm text-[13px]">
              <span className="font-code-badge text-[11px] uppercase text-[#00241a] font-bold mr-2 whitespace-nowrap">
                Formula Weighting:
              </span>
              <button
                onClick={() => setActiveWeighting('overall')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'overall'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Overall Table (100%)
              </button>
              <button
                onClick={() => setActiveWeighting('research')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'research'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Research Impact (30%)
              </button>
              <button
                onClick={() => setActiveWeighting('teaching')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'teaching'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Teaching &amp; Faculty (25%)
              </button>
              <button
                onClick={() => setActiveWeighting('employability')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'employability'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Graduate Employability (20%)
              </button>
              <button
                onClick={() => setActiveWeighting('continental')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'continental'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Continental Relevance (15%)
              </button>
              <button
                onClick={() => setActiveWeighting('intl')}
                className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeWeighting === 'intl'
                    ? 'bg-[#00241a] text-white font-medium'
                    : 'bg-[#efedf1] text-[#414845] hover:bg-[#e9e7ec]'
                }`}
              >
                Internationalization (10%)
              </button>
            </div>
            <div className="flex items-center gap-1 font-code-badge text-[11px] text-[#414845] shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#a14013]">verified</span>
              <span>Double-blind statistical review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Comprehensive Filter & Search Controller */}
      <section className="w-full bg-[#efedf1] px-6 lg:px-12 py-5 shadow-xs sticky top-28 z-40 border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search bar */}
            <div className="lg:col-span-4 relative flex items-center bg-white border border-[#c0c8c3]">
              <span className="material-symbols-outlined absolute left-3 text-[20px] text-[#717974]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search institution, city, or specialty..."
                className="w-full pl-10 pr-4 py-2 bg-transparent font-body-md text-[14px] text-[#1b1b1f] outline-none placeholder:text-[#717974]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mr-2 text-xs text-[#717974] hover:text-[#1b1b1f]">
                  ✕
                </button>
              )}
            </div>

            {/* Filter: Region */}
            <div className="lg:col-span-2 bg-white border border-[#c0c8c3] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#717974] mr-1">public</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#1b1b1f] py-2 outline-none cursor-pointer"
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
            <div className="lg:col-span-2 bg-white border border-[#c0c8c3] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#717974] mr-1">flag</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#1b1b1f] py-2 outline-none cursor-pointer"
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
            <div className="lg:col-span-2 bg-white border border-[#c0c8c3] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#717974] mr-1">account_balance</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#1b1b1f] py-2 outline-none cursor-pointer"
              >
                <option value="all">All Institution Types</option>
                <option value="public">Public Autonomous</option>
                <option value="private">Private Chartered</option>
                <option value="tech">Specialized Tech</option>
              </select>
            </div>

            {/* Filter: Tuition Bracket */}
            <div className="lg:col-span-2 bg-white border border-[#c0c8c3] flex items-center px-2">
              <span className="material-symbols-outlined text-[18px] text-[#717974] mr-1">payments</span>
              <select
                value={selectedTuition}
                onChange={(e) => setSelectedTuition(e.target.value)}
                className="w-full bg-transparent font-body-sm text-[12px] text-[#1b1b1f] py-2 outline-none cursor-pointer"
              >
                <option value="all">Tuition (All Ranges)</option>
                <option value="sub1k">&lt; $1,000 / year</option>
                <option value="1k-3k">$1,000 – $3,000 / yr</option>
                <option value="3k-6k">$3,000 – $6,000 / yr</option>
                <option value="over6k">&gt; $6,000 / yr</option>
              </select>
            </div>
          </div>

          {/* Secondary Controls & View Modes */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 font-body-sm text-[13px] text-[#414845]">
              <span className="font-semibold text-[#00241a]">Sort By:</span>
              <button
                onClick={() => setSortBy('rank')}
                className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
                  sortBy === 'rank'
                    ? 'bg-white text-[#00241a] shadow-xs border border-[#c0c8c3]'
                    : 'bg-transparent text-[#414845] hover:text-[#00241a]'
                }`}
              >
                Rank (Ascending)
              </button>
              <button
                onClick={() => setSortBy('research')}
                className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
                  sortBy === 'research'
                    ? 'bg-white text-[#00241a] shadow-xs border border-[#c0c8c3]'
                    : 'bg-transparent text-[#414845] hover:text-[#00241a]'
                }`}
              >
                Research Impact
              </button>
              <button
                onClick={() => setSortBy('employability')}
                className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
                  sortBy === 'employability'
                    ? 'bg-white text-[#00241a] shadow-xs border border-[#c0c8c3]'
                    : 'bg-transparent text-[#414845] hover:text-[#00241a]'
                }`}
              >
                Employability
              </button>
              <button
                onClick={() => setSortBy('climbers')}
                className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
                  sortBy === 'climbers'
                    ? 'bg-white text-[#00241a] shadow-xs border border-[#c0c8c3]'
                    : 'bg-transparent text-[#414845] hover:text-[#00241a]'
                }`}
              >
                Biggest Climbers
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white border border-[#c0c8c3] p-0.5">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`px-3 py-1 font-code-badge text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'standard'
                      ? 'bg-[#00241a] text-white font-bold'
                      : 'text-[#414845] hover:text-[#00241a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">table_rows</span>
                  <span>Standard Table</span>
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-3 py-1 font-code-badge text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-[#00241a] text-white font-bold'
                      : 'text-[#414845] hover:text-[#00241a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">query_stats</span>
                  <span>Detailed Indicators</span>
                </button>
              </div>

              <button
                onClick={handleDownloadCSV}
                className="bg-[#e9e7ec] hover:bg-[#e3e2e6] text-[#00241a] font-code-badge text-[11px] px-3 py-1.5 flex items-center gap-1.5 transition-colors border border-[#c0c8c3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Download Data CSV</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Master 2027 League Table Container */}
      <main className="w-full px-6 lg:px-12 py-8 bg-[#faf9fd]">
        <div className="max-w-7xl mx-auto bg-white border border-[#c0c8c3] shadow-xs overflow-hidden">
          {/* Table Head & Structural Scroll */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#e9e7ec] text-[#00241a] font-code-badge text-[11px] uppercase tracking-wider select-none border-b border-[#c0c8c3]">
                  <th className="py-3 px-3 text-center w-14">Rank</th>
                  <th className="py-3 px-2 text-center w-14">Shift</th>
                  <th className="py-3 px-4 min-w-[280px]">Institution &amp; Location</th>
                  <th className="py-3 px-3 min-w-[120px]">Country</th>
                  <th className="py-3 px-3 text-right bg-[#e3e2e6] min-w-[110px] text-[#00241a] font-bold">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efedf1] font-body-md text-[14px] text-[#1b1b1f]">
                {paginatedList.map((uni) => {
                  const isCompared = comparedIds.includes(uni.id);
                  const isTopPick = uni.rank <= 3 || uni.id === 'uon';

                  return (
                    <tr
                      key={uni.id}
                      className={`hover:bg-[#f5f3f7] transition-colors group ${
                        isTopPick ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-tabular-num font-bold text-[18px] text-[#00241a]">
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
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-50 text-[#a14013] font-code-badge text-[11px] font-bold">
                            ▼ {uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'equal' && (
                          <span className="inline-block px-1.5 py-0.5 bg-[#efedf1] text-[#414845] font-code-badge text-[11px] font-medium">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectUniversity(uni.id)}
                              className="font-title-md text-[15px] text-[#00241a] hover:text-[#a14013] font-bold tracking-tight text-left cursor-pointer transition-colors"
                            >
                              {uni.name}
                            </button>
                            {uni.id === 'uct' && (
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" title="Tier 1 Research Excellence"></span>
                            )}
                            {uni.id === 'uon' && (
                              <span className="font-code-badge text-[10px] bg-[#ffdbce] text-[#370e00] px-1.5 py-0.2 uppercase font-semibold">
                                East Africa #1
                              </span>
                            )}
                            {uni.id === 'cairo' && (
                              <span className="font-code-badge text-[10px] bg-[#e9e7ec] text-[#00241a] px-1.5 py-0.2 uppercase font-semibold">
                                North Africa #1
                              </span>
                            )}
                            {uni.id === 'ibadan' && (
                              <span className="font-code-badge text-[10px] bg-[#ffdbce] text-[#370e00] px-1.5 py-0.2 uppercase font-semibold">
                                West Africa #1
                              </span>
                            )}
                            {uni.id === 'aau' && (
                              <span className="font-code-badge text-[10px] bg-[#ffdbce] text-[#370e00] px-1.5 py-0.2 uppercase font-semibold">
                                Fastest Riser
                              </span>
                            )}
                          </div>
                          <span className="font-body-sm text-[12px] text-[#414845] flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {uni.city} • {uni.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px]">{uni.flag}</span>
                          <span className="font-medium text-[#1b1b1f] text-xs">{uni.country}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right bg-[#efedf1]/40">
                        <span className="font-tabular-num text-[17px] font-bold text-[#00241a]">
                          {uni.aheiScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num font-medium text-[#00241a]">
                        {uni.researchScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                        {uni.teachingScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                        {uni.employabilityScore.toFixed(1)}
                      </td>
                      {viewMode === 'detailed' && (
                        <>
                          <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                            {uni.continentalRelevanceScore.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                            {uni.internationalScore.toFixed(1)}
                          </td>
                        </>
                      )}
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                        {uni.studentFacultyRatio}
                      </td>
                      <td className="py-3.5 px-3 text-right font-tabular-num text-[#414845]">
                        {uni.internationalDiversityPct}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectUniversity(uni.id)}
                            className="bg-[#00241a] hover:bg-[#0e3b2e] text-white text-[12px] px-2.5 py-1 font-medium tracking-tight cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => onAddToCompare(uni.id)}
                            className={`text-[12px] px-2 py-1 font-medium border cursor-pointer transition-colors ${
                              isCompared
                                ? 'bg-[#a14013] text-white border-[#a14013]'
                                : 'bg-[#e9e7ec] hover:bg-[#e3e2e6] text-[#1b1b1f] border-[#c0c8c3]'
                            }`}
                            title={isCompared ? 'Remove from Comparison' : 'Pin to Comparison Bench'}
                          >
                            {isCompared ? 'Comparing' : 'Compare'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Strip */}
          <div className="px-6 py-4 bg-[#f5f3f7] flex flex-col sm:flex-row items-center justify-between gap-3 font-body-sm text-[12px] text-[#414845] border-t border-[#c0c8c3]">
            <div>
              Showing <span className="font-bold text-[#00241a]">1–{paginatedList.length}</span> of{' '}
              <span className="font-bold text-[#00241a]">500</span> certified institutions (Simulated Benchmark Dataset)
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-[#717974] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    currentPage === pg
                      ? 'bg-[#00241a] text-white font-bold'
                      : 'bg-white hover:bg-[#efedf1] text-[#1b1b1f] border border-[#c0c8c3]'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <span className="px-2">...</span>
              <button
                onClick={() => setCurrentPage(42)}
                className="px-3 py-1 bg-white hover:bg-[#efedf1] text-[#1b1b1f] border border-[#c0c8c3] cursor-pointer"
              >
                42
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 bg-white hover:bg-[#efedf1] text-[#00241a] font-medium flex items-center gap-1 border border-[#c0c8c3] cursor-pointer"
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
          <div className="lg:col-span-2 bg-white p-6 shadow-xs border border-[#c0c8c3]">
            <h3 className="font-title-lg text-[18px] text-[#00241a] font-serif font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a14013] text-[20px]">menu_book</span>
              Statistical Indicator Definitions &amp; Data Lineage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-body-sm text-[12px] text-[#414845]">
              <div>
                <span className="font-bold text-[#00241a] block mb-0.5">1. Research Impact (30% Weight):</span>
                <p>
                  Field-Weighted Citation Impact (FWCI) aggregated over 5 calendar years via Scopus &amp; Web of Science; papers per academic staff member, and continental co-authorship density.
                </p>
              </div>
              <div>
                <span className="font-bold text-[#00241a] block mb-0.5">2. Teaching &amp; Faculty (25% Weight):</span>
                <p>
                  Full-time doctoral qualification ratio of professoriate, institutional teaching budget per student, and audited academic staff-to-student operational load.
                </p>
              </div>
              <div>
                <span className="font-bold text-[#00241a] block mb-0.5">3. Graduate Employability (20% Weight):</span>
                <p>
                  Alumni employment tracking at 6 and 12 months post-convocation, domestic corporate employer reputation survey (N=18,400 respondents across Africa).
                </p>
              </div>
              <div>
                <span className="font-bold text-[#00241a] block mb-0.5">4. Continental Relevance (15% Weight):</span>
                <p>
                  Direct alignment of patent, policy-brief, and peer-reviewed outputs to the African Union Agenda 2063 development and industrial directives.
                </p>
              </div>
            </div>
          </div>

          {/* Formal Governance & Ethics Seal */}
          <div className="bg-[#f5f3f7] p-6 shadow-xs border border-[#c0c8c3] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#00241a] font-code-badge text-[11px] uppercase font-bold mb-2">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified_user</span>
                <span>Integrity Charter</span>
              </div>
              <h4 className="font-title-md text-[15px] text-[#00241a] font-bold mb-2">
                Independent Audit Guarantee
              </h4>
              <p className="font-body-sm text-[12px] text-[#414845] leading-relaxed mb-4">
                Institutions do not pay for inclusion, profiling, or re-weighting in the AHEI Master Index. Institutional performance audits are conducted by an autonomous committee of African vice-chancellors and global statisticians.
              </p>
            </div>
            <div className="p-3 bg-[#e3e2e6] text-[#414845] font-code-badge text-[11px] leading-tight flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#a14013] shrink-0">info</span>
              <span>
                <strong>ACADEMIC NOTICE:</strong> Data shown is rendered for demonstration and design prototype inspection. All rank changes reflect simulated longitudinal academic year models.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
