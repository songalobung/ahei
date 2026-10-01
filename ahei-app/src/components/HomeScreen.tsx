import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { University } from '../data/universities';
import { MACRO_REGIONS, INSIGHT_ARTICLES, InsightArticle } from '../data/macroRegions';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { BorderBeam } from '@/components/magicui/border-beam';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { Badge } from '@/components/ui/badge';

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
  const [heroMenuOpen, setHeroMenuOpen] = useState(false);
  const [tableMoreMenuOpen, setTableMoreMenuOpen] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

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
      <section className="w-full bg-[#ffffff] border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-12">
          {/* Eyebrow metadata */}
          <div className="flex flex-wrap items-center gap-2 font-code-badge text-[#838383] text-[11px] uppercase tracking-wider mb-6 pb-3 border-b border-[#d5d5d5]">
            <span className="inline-block w-2 h-2 bg-[#164A3A]"></span>
            <span className="text-[#09090B] font-bold">Intelligence Dossier</span>
            <span className="text-[#d5d5d5]">/</span>
            <span>AHEI Official Continental Register</span>
            <span className="text-[#d5d5d5]">/</span>
            <span className="text-[#232323]">Release Index 2027.1</span>
            <span className="ml-auto hidden sm:inline-block text-[#164A3A] font-medium">
              Standard Release: Oct 28, 2026
            </span>
          </div>

          {/* Main Broadsheet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
            <div className="lg:col-span-8 flex flex-col">
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-bold mb-3">
                Independent Continental Academic Intelligence
              </span>
              <h1 className="font-display-xl text-[38px] lg:text-[56px] text-[#09090B] font-serif font-normal tracking-tight leading-none mb-6">
                Africa’s Universities, <span className="italic text-[#164A3A]">Measured.</span>
              </h1>
              <p className="font-body-lg text-[18px] lg:text-[19px] text-[#838383] leading-relaxed max-w-3xl mb-8 font-serif">
                Comprehensive rankings, peer-reviewed research output, accredited programmes, tuition transparency, and institutional performance metrics across 54 African nations. Built for ministers, vice-chancellors, researchers, and prospective scholars.
              </p>

              {/* Action Hierarchy: Primary CTA + Secondary Link + Compact More Menu */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('rankings')}
                  className="bg-[#09090B] text-white font-title-md text-[15px] px-6 py-3 hover:bg-[#2A6B55] transition-colors tracking-tight flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore Rankings</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <a
                  href="#discovery-engine"
                  className="font-title-md text-[15px] text-[#09090B] hover:text-[#164A3A] transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>Find a university</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                </a>

                {/* More ▾ Overflow Menu */}
                <div className="relative">
                  <button
                    onClick={() => setHeroMenuOpen(!heroMenuOpen)}
                    className="font-title-md text-[14px] text-[#838383] hover:text-[#232323] py-2 px-3 border border-[#d5d5d5] bg-[#f2f2f2] hover:bg-[#f9f9f9] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>More</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                  </button>
                  {heroMenuOpen && (
                    <div className="absolute left-0 mt-1 w-64 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[13px]">
                      <button
                        onClick={() => {
                          handleDownloadReport();
                          setHeroMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#164A3A]">download</span>
                        <span>Download Executive Report (PDF)</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenMethodology();
                          setHeroMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#838383]">policy</span>
                        <span>Methodology &amp; Ethics Protocol</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hero Editorial Side Dossier */}
            <div className="lg:col-span-4 bg-[#f9f9f9] p-6 border-l-2 border-[#164A3A] border border-[#D9D7D0] relative overflow-hidden flex flex-col justify-between">
              <BorderBeam size={220} duration={14} borderWidth={1.5} colorFrom="#B28A45" colorTo="#164A3A" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-code-badge text-[11px] text-[#164A3A] uppercase font-bold tracking-wider">
                    Methodology Note 27.2
                  </span>
                  <Badge variant="gold">
                    <AnimatedShinyText>Audited</AnimatedShinyText>
                  </Badge>
                </div>
                <h2 className="font-headline-sm text-[22px] text-[#09090B] font-serif mb-3 leading-snug">
                  Continental Citation Parity
                </h2>
                <p className="font-body-md text-[14px] text-[#838383] leading-relaxed mb-4">
                  The 2027 index factors 3.1 million regional research papers published in African-domiciled and indexed journals, adjusting for international publisher indexation bias.
                </p>
              </div>
              <div className="pt-4 border-t border-[#d5d5d5] flex items-center justify-between">
                <span className="font-body-sm text-[12px] text-[#838383]">Council Chair: Prof. K. Adebayo</span>
                <button
                  onClick={() => {
                    const article = INSIGHT_ARTICLES.find((a) => a.id === 'citation-economics');
                    if (article) onOpenArticle(article);
                  }}
                  className="font-body-sm text-[12px] text-[#164A3A] font-semibold hover:underline cursor-pointer"
                >
                  Read Directive →
                </button>
              </div>
            </div>
          </div>

          {/* Integrated 4-Column Metric Strip with Fine Rules */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#d5d5d5] bg-[#f2f2f2]">
            <div className="p-6 border-r border-[#d5d5d5]">
              <div className="font-code-badge text-[11px] text-[#838383] uppercase tracking-wider mb-1">
                Coverage Scope
              </div>
              <div className="font-headline-lg text-[40px] text-[#09090B] font-serif font-semibold">
                <NumberTicker value={54} />
              </div>
              <div className="font-body-sm text-[12px] text-[#838383] mt-1">
                Sovereign Nations Tracked
              </div>
            </div>
            <div className="p-6 md:border-r border-[#d5d5d5]">
              <div className="font-code-badge text-[11px] text-[#838383] uppercase tracking-wider mb-1">
                Institutional Census
              </div>
              <div className="font-headline-lg text-[40px] text-[#09090B] font-serif font-semibold">
                <NumberTicker value={1048} />
              </div>
              <div className="font-body-sm text-[12px] text-[#838383] mt-1">
                Chartered &amp; Accredited Bodies
              </div>
            </div>
            <div className="p-6 border-r border-t md:border-t-0 border-[#d5d5d5]">
              <div className="font-code-badge text-[11px] text-[#838383] uppercase tracking-wider mb-1">
                Academic Breadth
              </div>
              <div className="font-headline-lg text-[40px] text-[#09090B] font-serif font-semibold flex items-center">
                <NumberTicker value={14200} />
                <span>+</span>
              </div>
              <div className="font-body-sm text-[12px] text-[#838383] mt-1">
                Evaluated Degree Curricula
              </div>
            </div>
            <div className="p-6 border-t md:border-t-0 border-[#d5d5d5]">
              <div className="font-code-badge text-[11px] text-[#838383] uppercase tracking-wider mb-1">
                Standard Release
              </div>
              <div className="font-headline-lg text-[40px] text-[#164A3A] font-serif font-semibold">
                2027 Ed.
              </div>
              <div className="font-body-sm text-[12px] text-[#838383] mt-1">
                Peer-Reviewed Statistical Baseline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED RANKINGS TABLE (CORE ENGINE) */}
      <section className="w-full bg-[#f2f2f2] py-12 border-b border-[#d5d5d5]" id="rankings-table">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Masthead */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#09090B] gap-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-semibold">
                Primary Comparative Registry
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#09090B] font-serif">
                Africa University Rankings 2027
              </h2>
              <p className="font-body-md text-[14px] text-[#838383] mt-1">
                Official annual evaluation synthesizing 18 quantitative metrics across teaching, research citations, continental impact, and graduate employability.
              </p>
            </div>
            {/* Consolidated Actions ▾ Dropdown */}
            <div className="relative self-start md:self-auto">
              <button
                onClick={() => setTableMoreMenuOpen(!tableMoreMenuOpen)}
                className="bg-white border border-[#d5d5d5] px-3.5 py-1.5 font-body-sm text-[13px] text-[#232323] hover:border-[#09090B] flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#838383]">tune</span>
                <span>Actions</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
              {tableMoreMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[13px]">
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setTableMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#f9f9f9] flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#838383]">file_download</span>
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setTableMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#f9f9f9] flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#838383]">print</span>
                    <span>Print Digest</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Faceted Table Controls: Dropdown instead of 5 wide buttons */}
          <div className="bg-[#f9f9f9] border border-[#d5d5d5] px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="sort-pillar-select" className="font-code-badge text-[11px] uppercase font-semibold text-[#838383]">
                Evaluate By:
              </label>
              <select
                id="sort-pillar-select"
                value={activeSortPillar}
                onChange={(e) => setActiveSortPillar(e.target.value as any)}
                className="bg-white border border-[#d5d5d5] font-title-md text-[13px] text-[#232323] px-3 py-1.5 outline-none focus:border-[#09090B] cursor-pointer"
              >
                <option value="overall">Overall League Score (100%)</option>
                <option value="research">Research Impact (30%)</option>
                <option value="teaching">Teaching Quality (25%)</option>
                <option value="employability">Industry Employability (20%)</option>
                <option value="continental">Continental Relevance (15%)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-code-badge text-[11px] text-[#838383]">Top 6 Preview</span>
              <span className="text-[#d5d5d5]">•</span>
              <button
                onClick={() => onNavigate('rankings')}
                className="font-body-sm text-[12px] text-[#09090B] hover:text-[#164A3A] font-semibold underline underline-offset-4 cursor-pointer"
              >
                View Full League Table →
              </button>
            </div>
          </div>

          {/* Broadsheet Tabular Data Grid */}
          <div className="overflow-x-auto border border-[#d5d5d5] bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6E3DC] border-b-2 border-[#09090B] font-title-md text-[#09090B] uppercase tracking-wider text-[11px]">
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
              <tbody className="divide-y divide-[#d5d5d5] font-body-md text-[14px] text-[#232323]">
                {sortedPreview.map((uni, idx) => {
                  const displayRank = idx + 1;
                  return (
                    <tr key={uni.id} className="hover:bg-[#f9f9f9] transition-colors">
                      <td className="py-3 px-4 font-code-badge text-[11px] font-bold text-[#09090B]">
                        #{displayRank.toString().padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3">
                        {uni.shift.type === 'up' && (
                          <span className="inline-block bg-[#D9D7D0] text-[#0d2e24] font-code-badge text-[11px] px-2 py-0.5 font-bold">
                            ▲ +{uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'down' && (
                          <span className="inline-block bg-[#faedd9] text-[#3b2a0c] font-code-badge text-[11px] px-2 py-0.5 font-bold">
                            ▼ -{uni.shift.val}
                          </span>
                        )}
                        {uni.shift.type === 'equal' && (
                          <span className="inline-block bg-[#E6E3DC] text-[#838383] font-code-badge text-[11px] px-2 py-0.5">
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
                            className="font-title-md text-[15px] text-[#09090B] font-bold hover:text-[#164A3A] text-left cursor-pointer transition-colors"
                          >
                            {uni.name}
                          </button>
                          <span className="font-body-sm text-[12px] text-[#838383] flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3c6657]"></span>
                            {uni.city}, {uni.country} • Chartered {uni.charterYear} • {uni.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[15px] font-bold text-[#09090B] tabular-nums">
                        {uni.aheiScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[13px] text-[#232323] tabular-nums">
                        {uni.researchScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right font-code-badge text-[13px] text-[#232323] tabular-nums">
                        {uni.teachingScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 font-code-badge text-[11px] text-[#838383]">
                        <span className={`px-2 py-0.5 font-medium ${uni.region === 'East Africa' ? 'bg-[#ffdea6] text-[#271900]' : 'bg-[#dedad2] text-[#09090B]'}`}>
                          {uni.region.replace(' Africa', '')} #{uni.regionalRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveRowMenuId(activeRowMenuId === uni.id ? null : uni.id)}
                            className="p-1.5 text-[#838383] hover:text-[#232323] hover:bg-[#f9f9f9] transition-colors cursor-pointer"
                            title="More actions"
                            aria-label="More actions"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                          </button>
                          {activeRowMenuId === uni.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[12px]">
                              <button
                                onClick={() => {
                                  onSelectUniversity(uni.id);
                                  onNavigate('universities', uni.id);
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
                                  onNavigate('compare');
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px] text-[#164A3A]">compare_arrows</span>
                                <span>Add to Compare</span>
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

          {/* Table Footnote & Deep Action */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-sm font-body-sm text-[#838383]">
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#164A3A]">verified</span>
              <span>Showing top 6 of 500 ranked institutions • Verified against official national accreditation registers &amp; WURI matrices</span>
            </div>
            <button
              onClick={() => onNavigate('rankings')}
              className="font-title-md text-[15px] text-[#164A3A] hover:text-[#09090B] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Full 500 Table (All Macro-Regions)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: REGIONAL INTELLIGENCE STRIP */}
      <section className="w-full bg-[#f9f9f9] py-12 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#d5d5d5]">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-semibold">
                Macro-Regional Framework
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#09090B] font-serif">
                Explore Higher Education Across 5 African Macro-Regions
              </h2>
            </div>
            <span className="font-body-sm text-[12px] text-[#838383] mt-2 md:mt-0">
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
                    <span className="font-title-md text-[16px] text-[#09090B] font-bold">
                      {region.name}
                    </span>
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">
                      {region.nationsCount} Nations
                    </span>
                  </div>
                  <p className="font-body-sm text-[12px] text-[#838383] mb-4">
                    {region.description}
                  </p>
                  <div className="space-y-2 border-t border-[#d5d5d5] pt-3 mb-4">
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#838383]">Top Institution:</span>
                      <span className="font-title-md text-[#09090B] font-semibold truncate ml-2">
                        {region.topInstitution}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#838383]">Ranked Bodies:</span>
                      <span className="font-code-badge text-[#232323] font-semibold">
                        {region.rankedBodies}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#838383]">Median Score:</span>
                      <span className="font-code-badge text-[#09090B] font-semibold">
                        {region.medianScore}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-[12px]">
                      <span className="text-[#838383]">Top Field:</span>
                      <span className="text-[#164A3A] font-medium truncate ml-2">
                        {region.topField}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#d5d5d5]">
                  <Link
                    href={`/regions/${region.id}`}
                    className="font-body-sm text-[12px] text-[#09090B] font-semibold hover:text-[#164A3A] inline-flex items-center gap-1 transition"
                  >
                    <span>View Corridor Dossier</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                  <span className="text-[#d5d5d5]">|</span>
                  <button
                    onClick={() => {
                      if (onApplyRankingsFilter) {
                        onApplyRankingsFilter({ region: region.name });
                      }
                      onNavigate('rankings');
                    }}
                    className="font-body-sm text-[12px] text-[#838383] hover:text-[#09090B] cursor-pointer"
                  >
                    League Table
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: 'WHAT CHANGED IN 2027?' EDITORIAL ANALYSIS */}
      <section className="w-full bg-[#f2f2f2] py-12 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-8 pb-4 border-b border-[#d5d5d5]">
            <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-semibold">
              Annual Statistical Audit
            </span>
            <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#09090B] font-serif">
              What Changed in 2027?
            </h2>
            <p className="font-body-md text-[14px] text-[#838383] max-w-3xl mt-1">
              A critical review of institutional volatility, newly admitted registries, and shifting research concentration hubs across the African continent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Biggest Movers */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#09090B]">
                <span className="material-symbols-outlined text-[#164A3A] text-[22px]">trending_up</span>
                <h3 className="font-headline-sm text-[22px] text-[#09090B] font-serif">Biggest Movers</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#838383] mb-4">
                Institutions advancing +10 positions or more due to verified regional citation spikes and updated faculty-to-PhD metrics.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'East Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Univ. of Rwanda</span>
                    <span className="font-code-badge text-[11px] text-[#0d2e24] bg-[#D9D7D0] px-1.5 py-0.5 font-bold">
                      ▲ +14 (#28)
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Major gains in public health publications and East African Community student diversity quota.
                  </p>
                </div>
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'West Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Kwame Nkrumah Univ. (KNUST)</span>
                    <span className="font-code-badge text-[11px] text-[#0d2e24] bg-[#D9D7D0] px-1.5 py-0.5 font-bold">
                      ▲ +11 (#18)
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Doubled engineering patent disclosures with commercial deployment in West African agri-processing.
                  </p>
                </div>
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'North Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Univ. of Mohammed V (Rabat)</span>
                    <span className="font-code-badge text-[11px] text-[#0d2e24] bg-[#D9D7D0] px-1.5 py-0.5 font-bold">
                      ▲ +10 (#22)
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Tripled Scopus citation indices in renewable energy physics and desalinization sciences.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Newly Ranked */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#09090B]">
                <span className="material-symbols-outlined text-[#164A3A] text-[22px]">new_releases</span>
                <h3 className="font-headline-sm text-[22px] text-[#09090B] font-serif">Newly Ranked</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#838383] mb-4">
                28 newly accredited institutions entered the 2027 Index after completing the mandatory 5-year longitudinal registry cycle.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'West Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Ashesi University (Ghana)</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #41
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    First independent private chartered university from West Africa to enter continental Top 50.
                  </p>
                </div>
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'East Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Kigali Independent Univ. (Rwanda)</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #118
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Recognized following mandatory national audit by Rwanda Higher Education Council (HEC).
                  </p>
                </div>
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'Southern Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Botswana Intl. Univ. of Sci. &amp; Tech.</span>
                    <span className="font-code-badge text-[11px] bg-[#ffdea6] text-[#271900] px-1.5 py-0.5 font-bold">
                      Debut #124
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Graduated inaugural PhD engineering cohort; high score in laboratory infrastructure capacity.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Fastest Research Expansion */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#09090B]">
                <span className="material-symbols-outlined text-[#164A3A] text-[22px]">science</span>
                <h3 className="font-headline-sm text-[22px] text-[#09090B] font-serif">Research Expansion</h3>
              </div>
              <p className="font-body-sm text-[12px] text-[#838383] mb-4">
                Universities recording the steepest acceleration in peer-reviewed output indexed in African and global repositories.
              </p>
              <div className="space-y-3 font-body-sm text-[12px]">
                <div 
                  onClick={() => {
                    onSelectUniversity('aau');
                    onNavigate('universities', 'aau');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Addis Ababa Univ. (Ethiopia)</span>
                    <span className="font-code-badge text-[11px] text-[#09090B] font-bold">
                      +44% Output
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Substantial surge in indigenous cereal genetics and Horn of Africa geological studies.
                  </p>
                </div>
                <div 
                  onClick={() => {
                    if (onApplyRankingsFilter) onApplyRankingsFilter({ region: 'West Africa' });
                    onNavigate('rankings');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Univ. of Lagos (Nigeria)</span>
                    <span className="font-code-badge text-[11px] text-[#09090B] font-bold">
                      +38% Output
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Leading African cross-institutional co-authorships in urban logistics, climate finance, and fintech.
                  </p>
                </div>
                <div 
                  onClick={() => {
                    onSelectUniversity('ain-shams');
                    onNavigate('universities', 'ain-shams');
                  }}
                  className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] hover:border-[#09090B] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-md text-[#09090B] font-semibold hover:text-[#164A3A]">Ain Shams University (Egypt)</span>
                    <span className="font-code-badge text-[11px] text-[#09090B] font-bold">
                      +31% Output
                    </span>
                  </div>
                  <p className="text-[#838383] text-xs">
                    Expansion in surgical oncology research clinical trials and AI medical diagnostics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: UNIVERSITY DISCOVERY ENGINE */}
      <section className="w-full bg-[#E6E3DC] py-12 border-b border-[#d5d5d5]" id="discovery-engine">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-8">
            <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-semibold">
              Institutional Discovery Filter
            </span>
            <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#09090B] font-serif">
              Search the Continental Registry
            </h2>
            <p className="font-body-md text-[14px] text-[#838383] mt-2">
              Filter across 1,048 verified universities by legal accreditation status, degree tier, annual estimated tuition, and disciplinary domain.
            </p>
          </div>

          {/* Discovery Filter Panel */}
          <div className="bg-white p-6 border border-[#d5d5d5]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Filter 1: Country */}
              <div>
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#09090B] mb-1.5">
                  Country / Nation
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] text-body-sm font-body-sm text-[#232323] p-2.5 outline-none focus:border-[#09090B]"
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
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#09090B] mb-1.5">
                  Academic Discipline
                </label>
                <select
                  value={filterDiscipline}
                  onChange={(e) => setFilterDiscipline(e.target.value)}
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] text-body-sm font-body-sm text-[#232323] p-2.5 outline-none focus:border-[#09090B]"
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
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#09090B] mb-1.5">
                  Degree Level
                </label>
                <select
                  value={filterDegree}
                  onChange={(e) => setFilterDegree(e.target.value)}
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] text-body-sm font-body-sm text-[#232323] p-2.5 outline-none focus:border-[#09090B]"
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
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#09090B] mb-1.5">
                  Annual Tuition Range
                </label>
                <select
                  value={filterTuition}
                  onChange={(e) => setFilterTuition(e.target.value)}
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] text-body-sm font-body-sm text-[#232323] p-2.5 outline-none focus:border-[#09090B]"
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
                <label className="block font-code-badge text-[11px] uppercase font-semibold text-[#09090B] mb-1.5">
                  Charter Type
                </label>
                <select
                  value={filterCharter}
                  onChange={(e) => setFilterCharter(e.target.value)}
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] text-body-sm font-body-sm text-[#232323] p-2.5 outline-none focus:border-[#09090B]"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#d5d5d5] gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-[#164A3A]"></span>
                <span className="font-title-md text-[15px] text-[#09090B] font-bold">
                  Matching 342 verified programmes
                </span>
                <span className="text-[#838383] font-body-sm text-[12px]">
                  across 89 institutions meeting criteria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearFilter}
                  className="font-body-sm text-[12px] text-[#838383] hover:text-[#09090B] underline cursor-pointer"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="bg-[#09090B] text-white font-title-md text-[14px] px-6 py-2.5 hover:bg-[#2A6B55] transition-colors tracking-tight flex items-center gap-2 cursor-pointer shadow-sm"
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
      <section className="w-full bg-[#f2f2f2] py-12 border-b border-[#d5d5d5]" id="insights-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#09090B] gap-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-widest text-[#164A3A] font-semibold">
                Scholarly Journalism &amp; Analysis
              </span>
              <h2 className="font-headline-lg text-[32px] lg:text-[40px] text-[#09090B] font-serif">
                AHEI Insights &amp; Working Papers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="font-title-md text-[14px] text-[#164A3A] hover:text-[#09090B] transition-colors flex items-center gap-1 cursor-pointer"
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
                className="bg-white border border-[#d5d5d5] flex flex-col justify-between hover:border-[#09090B] transition-all cursor-pointer group shadow-xs"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between font-code-badge text-[11px] text-[#838383] uppercase tracking-wider mb-3">
                    <span className="text-[#164A3A] font-bold">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-[#09090B] font-serif mb-3 leading-snug group-hover:text-[#164A3A] transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-body-md text-[13px] text-[#838383] leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
                <div className="px-6 py-3.5 bg-[#f9f9f9] border-t border-[#d5d5d5] flex items-center justify-between font-body-sm text-[12px]">
                  <span className="text-[#09090B] font-semibold">{article.author}</span>
                  <span className="text-[#838383]">{article.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: DATA PROVENANCE & METHODOLOGY STATEMENT */}
      <section className="w-full bg-[#f9f9f9] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-6 bg-white border border-[#d5d5d5] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[32px] text-[#09090B] shrink-0 mt-0.5">
                policy
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-code-badge text-[11px] text-[#09090B] uppercase font-bold tracking-wider">
                    Provenance &amp; Institutional Ethics Protocol
                  </span>
                  <span className="bg-[#faedd9] text-[#3b2a0c] font-code-badge text-[10px] px-2 py-0.5 font-bold uppercase">
                    Open Registry Standard
                  </span>
                </div>
                <p className="font-body-sm text-[13px] text-[#838383] leading-relaxed max-w-4xl">
                  All statistical tables published by the African Higher Education Index (AHEI) are derived from directly submitted institutional registries, verified cross-references with sovereign accreditation agencies, and independently verified publication indexes. Institutional dispute periods run annually between June 1 and July 31.
                </p>
                <div className="mt-2 font-code-badge text-[11px] text-[#164A3A] font-semibold">
                  OFFICIAL AUDIT: SOURCED DIRECTLY FROM 54 NATIONAL MINISTERIAL REGISTRIES &amp; ACCREDITED BODIES.
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={onOpenMethodology}
                className="border border-[#09090B] text-[#09090B] px-4 py-2 font-title-md text-[13px] hover:bg-[#f9f9f9] transition-colors whitespace-nowrap cursor-pointer"
              >
                Methodology Whitepaper (PDF)
              </button>
              <button
                onClick={onOpenMethodology}
                className="bg-[#09090B] text-white px-4 py-2 font-title-md text-[13px] hover:bg-[#2A6B55] transition-colors whitespace-nowrap cursor-pointer shadow-sm"
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
