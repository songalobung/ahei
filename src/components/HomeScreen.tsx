import React, { useState, useMemo } from 'react';
import { University } from '../data/universities';
import { MACRO_REGIONS, INSIGHT_ARTICLES, InsightArticle } from '../data/macroRegions';

interface HomeScreenProps {
  universities: University[];
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => void;
  onSelectUniversity: (id: string) => void;
  onAddToCompare: (id: string) => void;
  onOpenArticle: (article: InsightArticle) => void;
  onOpenMethodology: () => void;
  onApplyRankingsFilter?: (filters: { country?: string; region?: string; search?: string }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  universities,
  onNavigate,
  onSelectUniversity,
  onAddToCompare,
  onOpenArticle,
  onOpenMethodology,
  onApplyRankingsFilter,
}) => {
  const [activeSortPillar, setActiveSortPillar] = useState<'overall' | 'research' | 'teaching' | 'employability' | 'continental'>('overall');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [filterTuition, setFilterTuition] = useState('');
  const [filterCharter, setFilterCharter] = useState('');

  // Top 6 sorted
  const sortedPreview = useMemo(() => {
    const list = [...universities];
    if (activeSortPillar === 'overall') {
      list.sort((a, b) => b.aheiScore - a.aheiScore);
    } else if (activeSortPillar === 'research') {
      list.sort((a, b) => b.researchScore - a.researchScore);
    } else if (activeSortPillar === 'teaching') {
      list.sort((a, b) => b.teachingScore - a.teachingScore);
    } else if (activeSortPillar === 'employability') {
      list.sort((a, b) => b.employabilityScore - a.employabilityScore);
    } else if (activeSortPillar === 'continental') {
      list.sort((a, b) => b.continentalRelevanceScore - a.continentalRelevanceScore);
    }
    return list.slice(0, 6);
  }, [universities, activeSortPillar]);

  const handleDownloadReport = () => {
    const content = `AFRICAN HIGHER EDUCATION INDEX (AHEI) - 2027 EXECUTIVE REPORT
Published: October 28, 2026 | ISO/AHEI Academic Intelligence Framework

SCOPE OF EVALUATION:
- 54 Sovereign African Nations Monitored
- 1,048 Chartered and Accredited Institutions
- 14,200+ Evaluated Degree Curricula
- 1.8M Citations Indexed

TOP 10 LEAGUE STANDINGS (2027 Baseline):
1. University of Cape Town (South Africa) - 91.2 AHEI Score
2. University of the Witwatersrand (South Africa) - 89.7 AHEI Score
3. Stellenbosch University (South Africa) - 88.9 AHEI Score
4. University of Nairobi (Kenya) - 84.7 AHEI Score [East Africa #1]
5. Makerere University (Uganda) - 83.9 AHEI Score
6. Cairo University (Egypt) - 83.4 AHEI Score [North Africa #1]
7. University of Pretoria (South Africa) - 82.8 AHEI Score
8. University of Ibadan (Nigeria) - 81.6 AHEI Score [West Africa #1]
9. American University in Cairo (Egypt) - 81.2 AHEI Score
10. University of Ghana (Ghana) - 79.5 AHEI Score

METHODOLOGY HIGHLIGHTS:
- Research Impact (30%): Field-Weighted Citation Impact aggregated via Scopus & Web of Science.
- Teaching Quality (25%): Full-time doctoral qualification ratio & faculty-to-student load.
- Graduate Employability (20%): 6 & 12-month post-convocation employment rate.
- Continental Relevance (15%): Direct alignment to AU Agenda 2063 development directives.
- Internationalization (10%): Cross-border regional student mobility & joint laboratory alliances.

Verified by AHEI Standards Council.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AHEI_2027_Executive_Report_Summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'Rank,Institution,Country,Region,AHEI_Score,Research,Teaching,Employability,Continental_Relevance\n';
    universities.forEach((u) => {
      csv += `${u.rank},"${u.name}","${u.country}","${u.region}",${u.aheiScore},${u.researchScore},${u.teachingScore},${u.employabilityScore},${u.continentalRelevanceScore}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AHEI_2027_Top_Universities.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyFilter = () => {
    if (onApplyRankingsFilter) {
      onApplyRankingsFilter({ country: filterCountry });
    }
    onNavigate('rankings');
  };

  const handleClearFilter = () => {
    setFilterCountry('');
    setFilterDiscipline('');
    setFilterDegree('');
    setFilterTuition('');
    setFilterCharter('');
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: EDITORIAL HERO & LIVE METRICS STRIP */}
      <section className="w-full bg-[#ffffff] border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-12">
          {/* Eyebrow metadata */}
          <div className="flex flex-wrap items-center gap-2 font-code-badge text-[#414845] text-[11px] uppercase tracking-wider mb-6 pb-3 border-b border-[#c0c8c3]">
            <span className="inline-block w-2 h-2 bg-[#a14013]"></span>
            <span className="text-[#00241a] font-bold">Intelligence Dossier</span>
            <span className="text-[#c0c8c3]">/</span>
            <span>AHEI Official Continental Register</span>
            <span className="text-[#c0c8c3]">/</span>
            <span className="text-[#1b1b1f]">Release Index 2027.1</span>
            <span className="ml-auto hidden sm:inline-block text-[#a14013] font-medium">
              Standard Release: Oct 28, 2026
            </span>
          </div>

          {/* Main Broadsheet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
            <div className="lg:col-span-8 flex flex-col">
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-bold mb-3">
                Independent Continental Academic Intelligence
              </span>
              <h1 className="font-display-xl text-[38px] lg:text-[56px] text-[#00241a] font-serif font-normal tracking-tight leading-none mb-6">
                Africa’s Universities, <span className="italic text-[#a14013]">Measured.</span>
              </h1>
              <p className="font-body-lg text-[18px] lg:text-[19px] text-[#414845] leading-relaxed max-w-3xl mb-8 font-serif">
                Comprehensive rankings, peer-reviewed research output, accredited programmes, tuition transparency, and institutional performance metrics across 54 African nations. Built for ministers, vice-chancellors, researchers, and prospective scholars.
              </p>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('rankings')}
                  className="bg-[#00241a] text-white font-title-md text-[15px] px-6 py-3 hover:bg-[#0e3b2e] transition-colors tracking-tight flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Explore Africa Rankings 2027</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
                <a
                  href="#discovery-engine"
                  className="bg-transparent text-[#00241a] border border-[#00241a] font-title-md text-[15px] px-6 py-3 hover:bg-[#f5f3f7] transition-colors tracking-tight flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Find Your University</span>
                </a>
                <button
                  onClick={handleDownloadReport}
                  className="font-title-md text-[14px] text-[#a14013] hover:text-[#702500] transition-colors underline decoration-[#a14013] underline-offset-4 flex items-center gap-1.5 py-3 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Executive Report (PDF, 48pp)</span>
                </button>
              </div>
            </div>

            {/* Hero Editorial Side Dossier */}
            <div className="lg:col-span-4 bg-[#f5f3f7] p-6 border-l-2 border-[#00241a] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-code-badge text-[11px] text-[#00241a] uppercase font-bold tracking-wider">
                    Methodology Note 27.2
                  </span>
                  <span className="font-code-badge text-[11px] px-2 py-0.5 bg-white text-[#414845] border border-[#c0c8c3]">
                    Audited
                  </span>
                </div>
                <h2 className="font-headline-sm text-[22px] text-[#00241a] font-serif mb-3 leading-snug">
                  Continental Citation Parity
                </h2>
                <p className="font-body-md text-[14px] text-[#414845] leading-relaxed mb-4">
                  The 2027 index factors 3.1 million regional research papers published in African-domiciled and indexed journals, adjusting for international publisher indexation bias.
                </p>
              </div>
              <div className="pt-4 border-t border-[#c0c8c3] flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-[#414845]">Council Chair: Prof. K. Adebayo</span>
                <button
                  onClick={() => {
                    const article = INSIGHT_ARTICLES.find((a) => a.id === 'citation-economics');
                    if (article) onOpenArticle(article);
                  }}
                  className="font-body-sm text-[12px] text-[#a14013] font-semibold hover:underline cursor-pointer"
                >
                  Read Directive →
                </button>
              </div>
            </div>
          </div>

          {/* Integrated 4-Column Metric Strip with Fine Rules */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#c0c8c3] bg-[#faf9fd]">
            <div className="p-6 border-r border-[#c0c8c3]">
              <div className="font-code-badge text-[11px] text-[#414845] uppercase tracking-wider mb-1">
                Coverage Scope
              </div>
              <div className="font-headline-lg text-[40px] text-[#00241a] font-serif font-semibold">
                54
              </div>
              <div className="font-body-sm text-[12px] text-[#414845] mt-1">
                Sovereign Nations Tracked
              </div>
            </div>
            <div className="p-6 md:border-r border-[#c0c8c3]">
              <div className="font-code-badge text-[11px] text-[#414845] uppercase tracking-wider mb-1">
                Institutional Census
              </div>
              <div className="font-headline-lg text-[40px] text-[#00241a] font-serif font-semibold">
                1,048
              </div>
              <div className="font-body-sm text-[12px] text-[#414845] mt-1">
                Chartered &amp; Accredited Bodies
              </div>
            </div>
            <div className="p-6 border-r border-t md:border-t-0 border-[#c0c8c3]">
              <div className="font-code-badge text-[11px] text-[#414845] uppercase tracking-wider mb-1">
                Academic Breadth
              </div>
              <div className="font-headline-lg text-[40px] text-[#00241a] font-serif font-semibold">
                14,200+
              </div>
              <div className="font-body-sm text-[12px] text-[#414845] mt-1">
                Evaluated Degree Curricula
              </div>
            </div>
            <div className="p-6 border-t md:border-t-0 border-[#c0c8c3]">
              <div className="font-code-badge text-[11px] text-[#414845] uppercase tracking-wider mb-1">
                Standard Release
              </div>
              <div className="font-headline-lg text-[40px] text-[#a14013] font-serif font-semibold">
                2027 Ed.
              </div>
              <div className="font-body-sm text-[12px] text-[#414845] mt-1">
                Peer-Reviewed Statistical Baseline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED RANKINGS TABLE (CORE ENGINE) */}
      <section className="w-full bg-[#faf9fd] py-12 border-b border-[#c0c8c3]" id="rankings-table">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Masthead */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#00241a] gap-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-semibold">
                Primary Comparative Registry
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] font-serif">
                Africa University Rankings 2027
              </h2>
              <p className="font-body-md text-[14px] text-[#414845] mt-1">
                Official annual evaluation synthesizing 18 quantitative metrics across teaching, research citations, continental impact, and graduate employability.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handleExportCSV}
                className="bg-[#f5f3f7] border border-[#c0c8c3] px-3 py-1.5 font-code-badge text-[11px] text-[#1b1b1f] hover:border-[#00241a] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span> CSV Export
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#f5f3f7] border border-[#c0c8c3] px-3 py-1.5 font-code-badge text-[11px] text-[#1b1b1f] hover:border-[#00241a] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span> Print Digest
              </button>
            </div>
          </div>

          {/* Faceted Table Controls Filter Strip */}
          <div className="bg-[#f5f3f7] border border-[#c0c8c3] px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-code-badge text-[11px] uppercase font-semibold text-[#414845] mr-2">
                Sort Pillar:
              </span>
              <button
                onClick={() => setActiveSortPillar('overall')}
                className={`px-3 py-1 font-title-md text-[13px] tracking-tight cursor-pointer transition-colors ${
                  activeSortPillar === 'overall'
                    ? 'bg-[#00241a] text-white'
                    : 'bg-white text-[#1b1b1f] border border-[#c0c8c3] hover:border-[#00241a]'
                }`}
              >
                Overall Score
              </button>
              <button
                onClick={() => setActiveSortPillar('research')}
                className={`px-3 py-1 font-title-md text-[13px] tracking-tight cursor-pointer transition-colors ${
                  activeSortPillar === 'research'
                    ? 'bg-[#00241a] text-white'
                    : 'bg-white text-[#1b1b1f] border border-[#c0c8c3] hover:border-[#00241a]'
                }`}
              >
                Research Impact (30%)
              </button>
              <button
                onClick={() => setActiveSortPillar('teaching')}
                className={`px-3 py-1 font-title-md text-[13px] tracking-tight cursor-pointer transition-colors ${
                  activeSortPillar === 'teaching'
                    ? 'bg-[#00241a] text-white'
                    : 'bg-white text-[#1b1b1f] border border-[#c0c8c3] hover:border-[#00241a]'
                }`}
              >
                Teaching Quality (25%)
              </button>
              <button
                onClick={() => setActiveSortPillar('employability')}
                className={`px-3 py-1 font-title-md text-[13px] tracking-tight cursor-pointer transition-colors ${
                  activeSortPillar === 'employability'
                    ? 'bg-[#00241a] text-white'
                    : 'bg-white text-[#1b1b1f] border border-[#c0c8c3] hover:border-[#00241a]'
                }`}
              >
                Industry Employability (20%)
              </button>
              <button
                onClick={() => setActiveSortPillar('continental')}
                className={`px-3 py-1 font-title-md text-[13px] tracking-tight cursor-pointer transition-colors ${
                  activeSortPillar === 'continental'
                    ? 'bg-[#00241a] text-white'
                    : 'bg-white text-[#1b1b1f] border border-[#c0c8c3] hover:border-[#00241a]'
                }`}
              >
                Continental Parity (15%)
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-code-badge text-[11px] text-[#414845]">Showing: Top 6 Preview</span>
              <span className="text-[#c0c8c3]">•</span>
              <span className="font-code-badge text-[11px] text-[#a14013] font-semibold">Active: All 54 Nations</span>
            </div>
          </div>

          {/* Broadsheet Tabular Data Grid */}
          <div className="overflow-x-auto border border-[#c0c8c3] bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#efedf1] border-b-2 border-[#00241a] font-title-md text-[#00241a] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold w-16">Rank</th>
                  <th className="py-3 px-3 font-semibold w-24">Shift</th>
                  <th className="py-3 px-4 font-semibold">Institution &amp; National Jurisdiction</th>
                  <th className="py-3 px-4 font-semibold text-right tabular-nums">AHEI Score</th>
                  <th className="py-3 px-4 font-semibold text-right tabular-nums">Research</th>
                  <th className="py-3 px-4 font-semibold text-right tabular-nums">Teaching</th>
                  <th className="py-3 px-4 font-semibold">Regional Standing</th>
                  <th className="py-3 px-4 font-semibold text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c0c8c3] font-body-md text-[14px] text-[#1b1b1f]">
                {sortedPreview.map((uni, idx) => {
                  const displayRank = idx + 1;
                  return (
                    <tr key={uni.id} className="hover:bg-[#f5f3f7] transition-colors">
                      <td className="py-3 px-4 font-code-badge text-[11px] font-bold text-[#00241a]">
                        #{displayRank.toString().padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3">
                        {uni.shift.type === 'up' && (
                          <span className="inline-block bg-[#bfecd9] text-[#002117] font-code-badge text-[11px] px-2 py-0.5 font-bold">
                            ▲ +{uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'down' && (
                          <span className="inline-block bg-[#ffdbce] text-[#370e00] font-code-badge text-[11px] px-2 py-0.5 font-bold">
                            ▼ -{uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'equal' && (
                          <span className="inline-block bg-[#efedf1] text-[#414845] font-code-badge text-[11px] px-2 py-0.5">
                            — Equal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <button
                            onClick={() => {
                              onSelectUniversity(uni.id);
                              onNavigate('universities', uni.id);
                            }}
                            className="font-title-md text-[15px] text-[#00241a] font-bold hover:text-[#a14013] text-left cursor-pointer transition-colors"
                          >
                            {uni.name}
                          </button>
                          <span className="font-body-sm text-[12px] text-[#414845] flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3c6657]"></span>
                            {uni.city}, {uni.country} • Chartered {uni.charterYear} • {uni.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[15px] font-bold text-[#00241a] tabular-nums">
                        {uni.aheiScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[13px] text-[#1b1b1f] tabular-nums">
                        {uni.researchScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[13px] text-[#1b1b1f] tabular-nums">
                        {uni.teachingScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 font-code-badge text-[11px] text-[#414845]">
                        <span className={`px-2 py-0.5 font-medium ${uni.region === 'East Africa' ? 'bg-[#ffdea6] text-[#271900]' : 'bg-[#e9e7ec] text-[#00241a]'}`}>
                          {uni.region.replace(' Africa', '')} #{uni.regionalRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectUniversity(uni.id);
                              onNavigate('universities', uni.id);
                            }}
                            className="px-2.5 py-1 text-xs font-title-md border border-[#c0c8c3] hover:border-[#00241a] text-[#00241a] bg-[#faf9fd] transition-colors cursor-pointer"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              onAddToCompare(uni.id);
                              onNavigate('compare');
                            }}
                            className="px-2 py-1 text-xs font-title-md border border-[#c0c8c3] hover:border-[#a14013] text-[#a14013] bg-[#faf9fd] transition-colors cursor-pointer"
                          >
                            + Compare
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footnote & Deep Action */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-sm font-body-sm text-[#414845]">
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#a14013]">verified</span>
              <span>Showing top 6 of 500 ranked institutions • Verified against official national accreditation registers &amp; WURI matrices</span>
            </div>
            <button
              onClick={() => onNavigate('rankings')}
              className="font-title-md text-[15px] text-[#a14013] hover:text-[#00241a] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Full 500 Table (All Macro-Regions)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: REGIONAL INTELLIGENCE STRIP */}
      <section className="w-full bg-[#f5f3f7] py-12 border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#c0c8c3]">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-semibold">
                Macro-Regional Framework
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] font-serif">
                Explore Higher Education Across 5 African Macro-Regions
              </h2>
            </div>
            <span className="font-body-sm text-[12px] text-[#414845] mt-2 md:mt-0">
              Harmonized under the African Union Education Strategy (CESA)
            </span>
          </div>

          {/* 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {MACRO_REGIONS.map((region) => (
              <div
                key={region.id}
                className="bg-white p-5 border-t-2 flex flex-col justify-between"
                style={{ borderColor: region.accentColor }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-title-md text-[16px] text-[#00241a] font-bold">
                      {region.name}
                    </span>
                    <span className="font-code-badge text-[11px] text-[#a14013] font-semibold">
                      {region.nationsCount} Nations
                    </span>
                  </div>
                  <p className="font-body-sm text-[12px] text-[#414845] mb-4">
                    {region.description}
                  </p>
                  <div className="space-y-2 border-t border-[#c0c8c3] pt-3 mb-4">
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#414845]">Top Institution:</span>
                      <span className="font-title-md text-[#00241a] font-semibold truncate ml-2">
                        {region.topInstitution}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#414845]">Ranked Bodies:</span>
                      <span className="font-code-badge text-[#1b1b1f] font-semibold">
                        {region.rankedBodies}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#414845]">Median Score:</span>
                      <span className="font-code-badge text-[#00241a] font-semibold">
                        {region.medianScore}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#414845]">Top Field:</span>
                      <span className="text-[#a14013] font-medium truncate ml-2">
                        {region.topField}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onApplyRankingsFilter) {
                      onApplyRankingsFilter({ region: region.name });
                    }
                    onNavigate('rankings');
                  }}
                  className="font-body-sm text-[12px] text-[#00241a] font-semibold hover:text-[#a14013] inline-flex items-center gap-1 mt-2 cursor-pointer"
                >
                  Regional Table <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: 'WHAT CHANGED IN 2027?' EDITORIAL ANALYSIS */}
      <section className="w-full bg-[#faf9fd] py-12 border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-8 pb-4 border-b border-[#c0c8c3]">
            <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-semibold">
              Annual Statistical Audit
            </span>
            <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] font-serif">
              What Changed in 2027?
            </h2>
            <p className="font-body-md text-[14px] text-[#414845] max-w-3xl mt-1">
              A critical review of institutional volatility, newly admitted registries, and shifting research concentration hubs across the African continent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Biggest Movers */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#00241a]">
                <span className="material-symbols-outlined text-[#a14013] text-[22px]">trending_up</span>
                <h3 className="font-headline-sm text-[22px] text-[#00241a] font-serif">Biggest Movers</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#414845] mb-4">
                Institutions advancing +10 positions or more due to verified regional citation spikes and updated faculty-to-PhD metrics.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Univ. of Rwanda</span>
                    <span className="font-code-badge text-[11px] text-[#002117] bg-[#bfecd9] px-1.5 py-0.5 font-bold">
                      ▲ +14 (#28)
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Major gains in public health publications and East African Community student diversity quota.
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Kwame Nkrumah Univ. (KNUST)</span>
                    <span className="font-code-badge text-[11px] text-[#002117] bg-[#bfecd9] px-1.5 py-0.5 font-bold">
                      ▲ +11 (#18)
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Doubled engineering patent disclosures with commercial deployment in West African agri-processing.
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Univ. of Mohammed V (Rabat)</span>
                    <span className="font-code-badge text-[11px] text-[#002117] bg-[#bfecd9] px-1.5 py-0.5 font-bold">
                      ▲ +10 (#22)
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Tripled Scopus citation indices in renewable energy physics and desalinization sciences.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Newly Ranked */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#00241a]">
                <span className="material-symbols-outlined text-[#a14013] text-[22px]">new_releases</span>
                <h3 className="font-headline-sm text-[22px] text-[#00241a] font-serif">Newly Ranked</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#414845] mb-4">
                28 newly accredited institutions entered the 2027 Index after completing the mandatory 5-year longitudinal registry cycle.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Ashesi University (Ghana)</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #41
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    First independent private chartered university from West Africa to enter continental Top 50.
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Kigali Independent Univ. (Rwanda)</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #118
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Recognized following mandatory national audit by Rwanda Higher Education Council (HEC).
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Botswana Intl. Univ. of Sci. &amp; Tech.</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #124
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Graduated inaugural PhD engineering cohort; high score in laboratory infrastructure capacity.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Fastest Research Expansion */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#00241a]">
                <span className="material-symbols-outlined text-[#a14013] text-[22px]">science</span>
                <h3 className="font-headline-sm text-[22px] text-[#00241a] font-serif">Research Expansion</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#414845] mb-4">
                Universities recording the steepest acceleration in peer-reviewed output indexed in African and global repositories.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Addis Ababa Univ. (Ethiopia)</span>
                    <span className="font-code-badge text-[11px] text-[#00241a] font-bold">
                      +44% Output
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Substantial surge in indigenous cereal genetics and Horn of Africa geological studies.
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Univ. of Lagos (Nigeria)</span>
                    <span className="font-code-badge text-[11px] text-[#00241a] font-bold">
                      +38% Output
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Leading African cross-institutional co-authorships in urban logistics, climate finance, and fintech.
                  </p>
                </div>
                <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#00241a] font-semibold">Ain Shams University (Egypt)</span>
                    <span className="font-code-badge text-[11px] text-[#00241a] font-bold">
                      +31% Output
                    </span>
                  </div>
                  <p className="text-[#414845] text-xs">
                    Expansion in surgical oncology research clinical trials and AI medical diagnostics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: UNIVERSITY DISCOVERY ENGINE */}
      <section className="w-full bg-[#efedf1] py-12 border-b border-[#c0c8c3]" id="discovery-engine">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-8">
            <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-semibold">
              Institutional Discovery Filter
            </span>
            <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] font-serif">
              Search the Continental Registry
            </h2>
            <p className="font-body-md text-[14px] text-[#414845] mt-2">
              Filter across 1,048 verified universities by legal accreditation status, degree tier, annual estimated tuition, and disciplinary domain.
            </p>
          </div>

          {/* Discovery Filter Panel */}
          <div className="bg-white p-6 border border-[#c0c8c3]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Filter 1: Country */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#00241a] mb-1.5">
                  Country / Nation
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full bg-[#faf9fd] border border-[#c0c8c3] text-body-sm font-body-sm text-[#1b1b1f] p-2.5 outline-none focus:border-[#00241a]"
                >
                  <option value="">All 54 African Nations</option>
                  <option value="South Africa">South Africa (26)</option>
                  <option value="Egypt">Egypt (42)</option>
                  <option value="Nigeria">Nigeria (174)</option>
                  <option value="Kenya">Kenya (68)</option>
                  <option value="Ghana">Ghana (38)</option>
                  <option value="Uganda">Uganda (32)</option>
                  <option value="Ethiopia">Ethiopia (45)</option>
                  <option value="Morocco">Morocco (24)</option>
                </select>
              </div>

              {/* Filter 2: Discipline */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#00241a] mb-1.5">
                  Academic Discipline
                </label>
                <select
                  value={filterDiscipline}
                  onChange={(e) => setFilterDiscipline(e.target.value)}
                  className="w-full bg-[#faf9fd] border border-[#c0c8c3] text-body-sm font-body-sm text-[#1b1b1f] p-2.5 outline-none focus:border-[#00241a]"
                >
                  <option value="">All Disciplines &amp; Fields</option>
                  <option value="cs">Computer Science &amp; AI</option>
                  <option value="med">Clinical Medicine &amp; Surgery</option>
                  <option value="eng">Civil &amp; Electrical Engineering</option>
                  <option value="law">Jurisprudence &amp; Public Law</option>
                  <option value="agri">Agricultural &amp; Climate Sciences</option>
                  <option value="econ">Economics &amp; Public Policy</option>
                </select>
              </div>

              {/* Filter 3: Degree Level */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#00241a] mb-1.5">
                  Degree Level
                </label>
                <select
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="w-full bg-[#faf9fd] border border-[#c0c8c3] text-body-sm font-body-sm text-[#1b1b1f] p-2.5 outline-none focus:border-[#00241a]"
                >
                  <option value="">All Degree Qualifications</option>
                  <option value="ug">Undergraduate (Bachelor's)</option>
                  <option value="pg">Postgraduate (Master's)</option>
                  <option value="phd">Doctoral Research (PhD)</option>
                  <option value="dip">Post-Graduate Diploma</option>
                </select>
              </div>

              {/* Filter 4: Tuition Range */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#00241a] mb-1.5">
                  Annual Tuition Range
                </label>
                <select
                  value={filterTuition}
                  onChange={(e) => setFilterTuition(e.target.value)}
                  className="w-full bg-[#faf9fd] border border-[#c0c8c3] text-body-sm font-body-sm text-[#1b1b1f] p-2.5 outline-none focus:border-[#00241a]"
                >
                  <option value="">Any Tuition Band (USD)</option>
                  <option value="sub1k">&lt; $1,000 / year (Subsidized)</option>
                  <option value="1k-3k">$1,000 – $3,000 / year</option>
                  <option value="3k-6k">$3,000 – $6,000 / year</option>
                  <option value="6kplus">&gt; $6,000 / year (Private/Intl)</option>
                </select>
              </div>

              {/* Filter 5: Charter Type */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#00241a] mb-1.5">
                  Charter Type
                </label>
                <select
                  value={filterCharter}
                  onChange={(e) => setFilterCharter(e.target.value)}
                  className="w-full bg-[#faf9fd] border border-[#c0c8c3] text-body-sm font-body-sm text-[#1b1b1f] p-2.5 outline-none focus:border-[#00241a]"
                >
                  <option value="">All Institutional Types</option>
                  <option value="public">Public National Flagship</option>
                  <option value="state">State / Provincial Public</option>
                  <option value="private-chartered">Private Chartered Non-Profit</option>
                  <option value="private-prop">Private Chartered Proprietary</option>
                </select>
              </div>
            </div>

            {/* Filter Action & Results Indicator Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#c0c8c3] gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-[#a14013]"></span>
                <span className="font-title-md text-[15px] text-[#00241a] font-bold">
                  Matching 342 verified programmes
                </span>
                <span className="text-[#414845] font-body-sm text-[12px]">
                  across 89 institutions meeting criteria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearFilter}
                  className="font-body-sm text-[12px] text-[#414845] hover:text-[#00241a] underline cursor-pointer"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="bg-[#00241a] text-white font-title-md text-[14px] px-6 py-2.5 hover:bg-[#0e3b2e] transition-colors tracking-tight flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Filter Registry Results</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: AHEI INSIGHTS (EDITORIAL & ESSAYS) */}
      <section className="w-full bg-[#faf9fd] py-12 border-b border-[#c0c8c3]" id="insights-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#00241a] gap-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#a14013] font-semibold">
                Scholarly Journalism &amp; Analysis
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] font-serif">
                AHEI Insights &amp; Working Papers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="font-title-md text-[14px] text-[#a14013] hover:text-[#00241a] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Read All Research Essays (140+)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* 4 Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INSIGHT_ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="bg-white border border-[#c0c8c3] flex flex-col justify-between hover:border-[#00241a] transition-all cursor-pointer group shadow-xs"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between font-code-badge text-[11px] text-[#414845] uppercase tracking-wider mb-3">
                    <span className="text-[#a14013] font-bold">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-[#00241a] font-serif mb-3 leading-snug group-hover:text-[#a14013] transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-body-md text-[13px] text-[#414845] leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="px-6 py-3.5 bg-[#f5f3f7] border-t border-[#c0c8c3] flex items-center justify-between font-body-sm text-[12px]">
                  <span className="text-[#00241a] font-semibold">{article.author}</span>
                  <span className="text-[#414845]">{article.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: DATA PROVENANCE & METHODOLOGY STATEMENT */}
      <section className="w-full bg-[#f5f3f7] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-6 bg-white border border-[#c0c8c3] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[32px] text-[#00241a] shrink-0 mt-0.5">
                policy
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-code-badge text-[11px] text-[#00241a] uppercase font-bold tracking-wider">
                    Provenance &amp; Institutional Ethics Protocol
                  </span>
                  <span className="bg-[#ffdbce] text-[#370e00] font-code-badge text-[10px] px-2 py-0.5 font-bold uppercase">
                    Open Registry Standard
                  </span>
                </div>
                <p className="font-body-sm text-[13px] text-[#414845] leading-relaxed max-w-4xl">
                  All statistical tables published by the African Higher Education Index (AHEI) are derived from directly submitted institutional registries, verified cross-references with sovereign accreditation agencies, and independently verified publication indexes. Institutional dispute periods run annually between June 1 and July 31.
                </p>
                <div className="mt-2 font-code-badge text-[11px] text-[#a14013] font-semibold">
                  NOTICE: DEMO / MOCK DATA FOR SPECIFICATION AND INTERFACE EVALUATION PURPOSES.
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={onOpenMethodology}
                className="border border-[#00241a] text-[#00241a] px-4 py-2 font-title-md text-[13px] hover:bg-[#f5f3f7] transition-colors whitespace-nowrap cursor-pointer"
              >
                Methodology Whitepaper (PDF)
              </button>
              <button
                onClick={onOpenMethodology}
                className="bg-[#00241a] text-white px-4 py-2 font-title-md text-[13px] hover:bg-[#0e3b2e] transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Submit University Data
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
