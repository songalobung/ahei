import React, { useState } from 'react';
import { University } from '../data/universities';

interface UniversityProfileScreenProps {
  university: University;
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => void;
  onSelectUniversity: (id: string) => void;
  onAddToCompare: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  allUniversities: University[];
}

export const UniversityProfileScreen: React.FC<UniversityProfileScreenProps> = ({
  university,
  onNavigate,
  onSelectUniversity,
  onAddToCompare,
  isBookmarked,
  onToggleBookmark,
  allUniversities,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rankings' | 'programmes' | 'tuition' | 'research' | 'provenance'>('overview');
  const [programmeSearch, setProgrammeSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [copiedShare, setCopiedShare] = useState(false);
  const [profileMoreMenuOpen, setProfileMoreMenuOpen] = useState(false);

  const filteredProgrammes = (university.programmes.length > 0 ? university.programmes : [
    {
      id: 'p1',
      name: 'Bachelor of Science in Computer Science',
      code: 'P15/2027',
      track: 'Honours Track',
      level: 'Undergraduate' as const,
      duration: '4 Academic Years',
      faculty: 'Faculty of Science & Tech',
      campus: 'Science Campus',
      domesticTuition: university.domesticTuitionAverage,
      accreditation: 'Accredited',
      accreditationBody: university.accreditationBody,
      intake: 'September 2027',
    },
    {
      id: 'p2',
      name: 'Bachelor of Medicine & Bachelor of Surgery (MBChB)',
      code: 'U22/2027',
      track: 'Clinical Professional',
      level: 'Undergraduate' as const,
      duration: '6 Academic Years',
      faculty: 'School of Medicine',
      campus: 'Medical Campus',
      domesticTuition: university.domesticTuitionAverage,
      accreditation: 'Approved',
      accreditationBody: university.accreditationBody,
      intake: 'September 2027',
    },
    {
      id: 'p3',
      name: 'Master of Science in Data Analytics & AI',
      code: 'MS-DA/2027',
      track: 'Applied Research',
      level: 'Postgraduate' as const,
      duration: '2 Years (Evening / Weekend)',
      faculty: 'School of Computing',
      campus: 'Main Campus',
      domesticTuition: university.domesticTuitionAverage,
      accreditation: 'Industry Endorsed',
      accreditationBody: university.accreditationBody,
      intake: 'May & Sep 2027',
    },
    {
      id: 'p4',
      name: 'Bachelor of Laws (LLB)',
      code: 'G34/2027',
      track: 'Professional Jurisprudence',
      level: 'Undergraduate' as const,
      duration: '4 Academic Years',
      faculty: 'Faculty of Law',
      campus: 'Law Campus',
      domesticTuition: university.domesticTuitionAverage,
      accreditation: 'CLE Accredited',
      accreditationBody: university.accreditationBody,
      intake: 'September 2027',
    },
  ]).filter((prog) => {
    const matchesSearch =
      programmeSearch === '' ||
      prog.name.toLowerCase().includes(programmeSearch.toLowerCase()) ||
      prog.faculty.toLowerCase().includes(programmeSearch.toLowerCase()) ||
      prog.code.toLowerCase().includes(programmeSearch.toLowerCase());
    const matchesDegree = degreeFilter === 'All' || prog.level === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="flex flex-col w-full bg-[#f2f2f2]">
      {/* MASTHEAD & PROVENANCE STRIP */}
      <div className="w-full bg-[#f9f9f9] text-[#232323] px-6 lg:px-12 py-3 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-body-sm text-[12px]">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[#838383]">
            <button onClick={() => onNavigate('home')} className="hover:text-[#09090B] transition-colors cursor-pointer">
              Home
            </button>
            <span className="text-[#d5d5d5]">/</span>
            <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer">
              Universities
            </button>
            <span className="text-[#d5d5d5]">/</span>
            <span className="text-[#838383]">{university.country}</span>
            <span className="text-[#d5d5d5]">/</span>
            <span className="text-[#09090B] font-bold">{university.name}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-code-badge text-[11px] text-[#838383]">
            <div className="flex items-center gap-1 bg-[#E6E3DC] px-2 py-0.5 text-[#09090B] border border-[#d5d5d5]">
              <span className="material-symbols-outlined text-[14px] text-[#164A3A]">verified</span>
              <span>REGISTRY ID: {university.registryId}</span>
            </div>
            <span className="hidden sm:inline text-[#d5d5d5]">•</span>
            <span>AUDIT: SEP 2026</span>
            <span className="hidden sm:inline text-[#d5d5d5]">•</span>
            <span className="text-[#164A3A] font-semibold">CYCLE 2027</span>

            {/* Quick Switcher Dropdown */}
            <div className="relative ml-2">
              <select
                value={university.id}
                onChange={(e) => onSelectUniversity(e.target.value)}
                className="bg-white border border-[#d5d5d5] px-2 py-0.5 text-xs text-[#09090B] outline-none cursor-pointer"
              >
                {allUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    Switch: {u.name} (Rank #{u.rank})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* INSTITUTION DOSSIER BANNER & SUMMARY */}
      <div className="w-full bg-white text-[#232323] px-6 lg:px-12 py-10 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
          {/* Left: Identity & Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-[12px]">
              <span className="bg-[#09090B] text-white px-2.5 py-0.5 font-code-badge text-[11px] uppercase tracking-wider">
                {university.type}
              </span>
              <span className="bg-[#E6E3DC] text-[#838383] px-2.5 py-0.5">
                Est. {university.estYear} (Chartered {university.charterYear})
              </span>
              <span className="bg-[#E6E3DC] text-[#838383] px-2.5 py-0.5">
                Campuses: {university.campusesCount}
              </span>
              <span className="bg-[#164A3A]/10 text-[#164A3A] px-2.5 py-0.5 font-semibold flex items-center gap-1 border border-[#164A3A]/20">
                <span className="material-symbols-outlined text-[14px]">gpp_good</span>
                {university.accreditationBody} [2026]
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-headline-lg text-[34px] lg:text-[42px] font-serif text-[#09090B] tracking-tight">
                {university.name}
              </h1>
              <p className="font-body-lg text-[18px] text-[#838383] italic font-serif">
                {university.nativeMotto || 'Universitas Insignis • "Excellence & Truth"'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-body-md text-[14px] text-[#838383] flex-wrap">
              <span className="flex items-center gap-1.5 text-[#232323]">
                <span className="material-symbols-outlined text-[18px] text-[#164A3A]">location_on</span>
                {university.city}, {university.country} • {university.region}
              </span>
              <span className="text-[#d5d5d5]">•</span>
              <a
                href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#164A3A] hover:text-[#09090B] transition-colors underline underline-offset-4"
              >
                <span className="material-symbols-outlined text-[16px]">public</span>
                {university.website.replace(/^https?:\/\//, '')}
              </a>
              <span className="text-[#d5d5d5]">•</span>
              <span className="text-body-sm text-[#8c8e87]">VC: {university.viceChancellor}</span>
            </div>

            {/* Action Ribbon: Primary [Compare], Secondary [Admissions Portal ↗], and [More ▾] */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onAddToCompare(university.id);
                  onNavigate('compare');
                }}
                className="bg-[#09090B] text-white font-title-md text-[14px] px-5 py-2.5 hover:bg-[#2A6B55] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                <span>Compare Institution</span>
              </button>

              <a
                href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-[#09090B] border border-[#09090B] font-title-md text-[14px] px-4 py-2.5 hover:bg-[#f9f9f9] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Visit Portal</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>

              {/* Overflow 'More ▾' Action Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMoreMenuOpen(!profileMoreMenuOpen)}
                  aria-expanded={profileMoreMenuOpen}
                  aria-haspopup="true"
                  aria-label="More profile actions"
                  className="bg-[#E6E3DC] text-[#232323] border border-[#d5d5d5] font-title-md text-[14px] px-3.5 py-2.5 hover:bg-[#dedad2] transition-colors inline-flex items-center gap-1 cursor-pointer rounded-xs"
                >
                  <span>More</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                </button>
                {profileMoreMenuOpen && (
                  <div className="absolute left-0 mt-1 w-52 bg-white border border-[#d5d5d5] shadow-none z-30 py-1 font-body-sm text-[13px] rounded-xs">
                    <button
                      onClick={() => {
                        onToggleBookmark(university.id);
                        setProfileMoreMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${isBookmarked ? 'text-[#164A3A]' : 'text-[#838383]'}`}>
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                      <span>{isBookmarked ? 'Remove Bookmark' : 'Save University'}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleShare();
                        setProfileMoreMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#838383]">share</span>
                      <span>Share Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                        setProfileMoreMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#232323] flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#838383]">download</span>
                      <span>Download Profile (PDF)</span>
                    </button>
                    <div className="border-t border-[#d5d5d5] my-1"></div>
                    <button
                      onClick={() => {
                        alert('Official registrar inquiry ticket created for ' + university.name);
                        setProfileMoreMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#f9f9f9] text-[#838383] flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">flag</span>
                      <span>Report Data Issue</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Editorial Scorecard Matrix */}
          <div className="w-full lg:w-[380px] shrink-0 bg-[#f9f9f9] p-6 border border-[#d5d5d5] space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                  AHEI Continental Rating
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display-xl text-[48px] font-serif text-[#09090B] font-bold">
                    {university.aheiScore.toFixed(1)}
                  </span>
                  <span className="font-body-md text-[14px] text-[#838383]">/ 100</span>
                </div>
                <div className="font-title-md text-[13px] text-[#09090B] font-semibold mt-0.5">
                  Grade A+ Institutional Rank
                </div>
              </div>
              <div className="bg-[#2A6B55] text-white px-3 py-2 text-right">
                <div className="font-code-badge text-[10px] uppercase tracking-wider text-[#7aa694]">
                  Confidence
                </div>
                <div className="font-title-lg text-[18px] text-[#D9D7D0] font-bold">
                  {university.confidence}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 bg-white border border-[#d5d5d5] text-center">
              <div className="p-2">
                <div className="font-code-badge text-[10px] uppercase text-[#838383]">Africa</div>
                <div className="font-headline-sm text-[22px] font-serif text-[#09090B] font-semibold">
                  #{university.rank}
                </div>
                <div className="font-code-badge text-[10px] text-[#09090B]">
                  {university.shift.type === 'up' ? `▲ +${university.shift.val} YOY` : university.shift.type === 'down' ? `▼ -${university.shift.val} YOY` : '— STABLE'}
                </div>
              </div>
              <div className="p-2 bg-[#f9f9f9]">
                <div className="font-code-badge text-[10px] uppercase text-[#838383]">
                  {university.region.replace(' Africa', '')}
                </div>
                <div className="font-headline-sm text-[22px] font-serif text-[#164A3A] font-semibold">
                  #{university.regionalRank}
                </div>
                <div className="font-code-badge text-[10px] text-[#838383]">— STABLE</div>
              </div>
              <div className="p-2">
                <div className="font-code-badge text-[10px] uppercase text-[#838383]">
                  {university.country}
                </div>
                <div className="font-headline-sm text-[22px] font-serif text-[#09090B] font-semibold">
                  #{university.nationalRank}
                </div>
                <div className="font-code-badge text-[10px] text-[#838383]">— 12 YRS</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-body-sm text-[12px] text-[#838383] pt-1">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#164A3A]">fact_check</span>
                8/8 Dimensions Verified
              </span>
              <span className="font-code-badge text-[11px]">AHEI-2027-V1</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY TAB NAVIGATION */}
      <div className="w-full bg-[#f9f9f9] sticky top-16 z-40 border-b border-[#d5d5d5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-1 py-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'rankings', label: 'Rankings & Metrics' },
              { id: 'programmes', label: `Programmes (${university.programmes.length || 142})` },
              { id: 'tuition', label: 'Tuition & Living' },
              { id: 'research', label: 'Research & Institutes' },
              { id: 'provenance', label: 'Audit & Sources' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById(tab.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-4 py-3 font-title-md text-[13px] transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#09090B] font-bold bg-white border-t-2 border-[#09090B]'
                    : 'text-[#838383] hover:text-[#09090B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-body-sm font-code-badge text-[11px] text-[#838383] pl-4">
            <span className="w-2 h-2 rounded-full bg-[#164A3A] inline-block"></span>
            PUBLIC DOSSIER
          </div>
        </div>
      </div>

      {/* MAIN EDITORIAL CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-12">
        {/* SECTION: KEY INSTITUTIONAL FACTS (6-METRIC GRID) */}
        <section className="space-y-4" id="overview">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
              Core Institutional Statistics (2026/2027)
            </h2>
            <span className="font-code-badge text-[11px] text-[#838383]">
              Validated via {university.accreditationBody}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  Total Enrollment
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#09090B]">groups</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.totalEnrollment.toLocaleString()}
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                {Math.round((university.undergraduateCount / university.totalEnrollment) * 100)}% Undergraduate ({university.undergraduateCount.toLocaleString()}) • {Math.round((university.postgraduateCount / university.totalEnrollment) * 100)}% Postgraduate ({university.postgraduateCount.toLocaleString()})
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  Academic Staff
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#09090B]">badge</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.academicStaff.toLocaleString()}
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                {university.phdFacultyShare}% PhD-credentialed faculty • Doctoral researchers
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  Student-to-Faculty Ratio
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#164A3A]">balance</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.studentFacultyRatio}
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                Top decile in {university.region} (Continental benchmark: 26:1)
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  International Diversity
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#09090B]">travel_explore</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.internationalDiversityPct}%
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                {Math.round(university.totalEnrollment * (university.internationalDiversityPct / 100)).toLocaleString()} foreign candidates across African &amp; global nations
              </p>
            </div>

            {/* Metric 5 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  Specialized Campuses
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#09090B]">apartment</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.campusesCount} Campuses
              </div>
              <p className="font-body-sm text-[12px] text-[#838383] truncate" title={university.campusLocations}>
                {university.campusLocations}
              </p>
            </div>

            {/* Metric 6 */}
            <div className="bg-white p-5 border border-[#d5d5d5] space-y-2">
              <div className="flex items-center justify-between text-[#838383]">
                <span className="font-code-badge text-[11px] uppercase tracking-wider">
                  Research Expenditure
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#164A3A]">payments</span>
              </div>
              <div className="font-headline-md text-[28px] font-serif text-[#09090B]">
                {university.researchExpenditureFormatted}
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                Health, Agriculture &amp; Climate leading allocations
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: VISUAL CAMPUS ASSETS (EDITORIAL MOSAIC) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative bg-[#E6E3DC] overflow-hidden group border border-[#d5d5d5]">
            <img
              className="w-full h-80 object-cover filter contrast-[1.05]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyb8jM5i5OfnRFTncoMdMgP30y9Img188tnFuQxzudusJiJaJTSxq-LOo9tXE-jrnlv9v-Cy5RGMEbj7_zuIt0bU__bwxrP33e6oLFiQQv_Wcs5mKl7vgm8dJirZMZQ6lQw5rzYaNRMoKnISPN9KwKF0DXhBmTCjEtOTiDJhRbJ7eGFbspVkyDylRDyXyOtRC8mONieXL4wI_zU4JeUk1u_cDkcPQ4RNhFOGi-fvM_rEDqRcTz6XAw"
              alt="Grand historic broadside architectural view of University of Nairobi Gandhi Memorial Library and Great Court in Nairobi Kenya."
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#09090B]/90 via-[#09090B]/50 to-transparent text-white">
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#faedd9]">
                Main Campus • University Way
              </span>
              <h3 className="font-headline-sm text-[22px] font-serif">The Great Court &amp; Taifa Hall</h3>
              <p className="font-body-sm text-[12px] text-[#e3e2e6]">
                Center of convocation, national discourse, and academic history.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative bg-[#E6E3DC] flex-1 overflow-hidden border border-[#d5d5d5]">
              <img
                className="w-full h-full object-cover min-h-[150px]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoGjtUN_AQGc305gHktcu3clDeeHsAYt8jnmBSNEkvWRl2-3CFj4wU4ahK_XCPk-X9IiEvgSXUFLaBKX0ZkaHyAfWI3esabdNRlH5TcqIArey1pSEOMiQ8RbhztaznO6N3wQjJAT4g6y_uFCtx1HZ_vH7obGPFD6FTHIEdOadNmfQsQf5UGOLz6Dn8e-jSaarJ2ER4OVC5a0zNMT0Sum9rPU6MK1HQU5zdDlIXncpdL1pm1BKb1aYi"
                alt="Chiromo STEM Faculty labs"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#09090B]/95 to-transparent text-white">
                <span className="font-code-badge text-[10px] text-[#faedd9]">Chiromo STEM Faculty</span>
                <div className="font-title-md text-[13px] font-semibold">Genomics &amp; Virology Labs</div>
              </div>
            </div>

            <div className="relative bg-[#E6E3DC] flex-1 overflow-hidden border border-[#d5d5d5]">
              <img
                className="w-full h-full object-cover min-h-[150px]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD47asHWyScgdo0XPX-b5LE6rLTnlKbhz45pExLD4WwZcYkc-wWrqUqejotXACKJkjHIwKzpk0SfeEJ17WbWPoXMOaOOAt5sK3Nwla0sDVtPYywa88KTIMJdjoltsYD7mlcO9mCAfyDfcVSf7IlAN1IH5uCNu-5VDAj395ogPrDNTnJzndYbcgOIbYF_qvnBxSS7JMrMywORS2Mfx9mr4iEjliNxVoPpMfkG1SPgFTFkvmqP5yBJ2CE"
                alt="Wangari Maathai Institute"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#09090B]/95 to-transparent text-white">
                <span className="font-code-badge text-[10px] text-[#faedd9]">Upper Kabete Campus</span>
                <div className="font-title-md text-[13px] font-semibold">Wangari Maathai Institute</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: DIMENSIONAL PERFORMANCE MATRIX & TRAJECTORY */}
        <section className="space-y-6" id="rankings">
          <div className="border-b border-[#d5d5d5] pb-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                AHEI 2027 Analytical Dossier
              </span>
              <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
                Dimensional Performance vs Continental Benchmarks
              </h2>
            </div>
            <div className="flex items-center gap-4 text-body-sm text-[12px] text-[#838383]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#09090B] inline-block"></span>
                {university.name} Index
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#d5d5d5] inline-block"></span>
                Continental Median (58.4)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Horizontal Performance Bars (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Metric 1 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    Research Output &amp; Scientific Citations
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 3% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">{university.researchScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: `${university.researchScore}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }} title="Continental Median: 58.4"></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>Field-Weighted Citation Impact: 1.68</span>
                  <span>18,420 Indexed Publications (Scopus)</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    Teaching Quality &amp; Faculty Standing
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 5% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">{university.teachingScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: `${university.teachingScore}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>Doctoral Staff Share: {university.phdFacultyShare}%</span>
                  <span>Student Completion: 88.2%</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    Graduate Employability &amp; Industry Pull
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 2% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">{university.employabilityScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: `${university.employabilityScore}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>Employer Reputation Score: 92.4</span>
                  <span>Employment Rate at 6 Months: 81.3%</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    Regional &amp; Continental Public Policy Impact
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 1% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">{university.continentalRelevanceScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: `${university.continentalRelevanceScore}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>EAC Policy Citations: 430+</span>
                  <span>WHO / AU Advisory Seats: 46</span>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    STEM &amp; Intellectual Property Patents
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 4% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">82.1</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: '82.1%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>Registered Regional Patents: 48</span>
                  <span>Spin-out Ventures Active: 19</span>
                </div>
              </div>

              {/* Metric 6 */}
              <div className="bg-white p-4 space-y-2 border border-[#d5d5d5]">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-title-md text-[14px] text-[#09090B] font-bold">
                    International Research Collaboration
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">Top 8% Africa</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">{university.internationalScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#E6E3DC] relative">
                  <div className="h-full bg-[#09090B]" style={{ width: `${university.internationalScore}%` }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#8c8e87]" style={{ left: '58.4%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-code-badge text-[#838383]">
                  <span>International Co-authorship: 46.8%</span>
                  <span>Consortia: ARUA, CARTA, RUFORUM</span>
                </div>
              </div>
            </div>

            {/* Trajectory & Ranking History (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-[#f9f9f9] p-6 border border-[#d5d5d5] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-lg text-[18px] text-[#09090B] font-bold">
                    Historical Ranking Trajectory
                  </h3>
                  <span className="font-code-badge text-[11px] text-[#164A3A] font-bold">4-YEAR TREND</span>
                </div>

                <div className="space-y-2 py-1">
                  {university.history.map((h) => (
                    <div
                      key={h.year}
                      className="flex items-center justify-between p-3 bg-white border border-[#d5d5d5]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-code-badge text-body-sm font-bold text-[#09090B]">
                          {h.year}
                        </span>
                        <span className="text-body-sm text-[#838383]">{h.rankText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-code-badge text-[11px] text-[#09090B] bg-[#09090B]/10 px-2 py-0.5 font-bold">
                          {h.points} PTS
                        </span>
                        <span className="font-code-badge text-[12px] text-[#09090B] font-bold">
                          {h.diff}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border border-[#d5d5d5] text-body-sm text-[12px] text-[#838383] space-y-2">
                  <div className="flex items-center gap-1.5 font-title-md text-[#09090B] font-bold">
                    <span className="material-symbols-outlined text-[16px] text-[#164A3A]">trending_up</span>
                    Intelligence Note: Health Grants Accelerant
                  </div>
                  <p className="leading-relaxed">
                    {university.trajectoryNote ||
                      "Progression into Africa's top quartile is propelled by competitive international grants, high citation velocity in tropical infectious diseases, and expanding cross-continental consortia."}
                  </p>
                </div>
              </div>

              {/* Micro Quick Facts Box */}
              <div className="p-4 bg-[#09090B] text-white space-y-2">
                <div className="font-code-badge text-[11px] uppercase tracking-wider text-[#faedd9] font-semibold">
                  Institutional Governance Notice
                </div>
                <p className="font-body-sm text-[12px] leading-relaxed text-[#e3e2e6]">
                  Operating under sovereign statutory charter. Fully accredited institutional member of the Inter-University Council for East Africa (IUCEA) and the Association of African Universities (AAU).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: EXTERNAL BENCHMARK COMPARATIVE TABLE */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                Multilateral Auditing
              </span>
              <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
                External International Ranking Cross-Check
              </h2>
            </div>
            <span className="font-code-badge text-[11px] text-[#838383]">All 2026/2027 Editions</span>
          </div>

          <div className="overflow-x-auto bg-white border border-[#d5d5d5]">
            <table className="w-full text-left font-body-sm text-[12px]">
              <thead className="bg-[#E6E3DC] text-[#232323] font-title-md text-code-badge uppercase tracking-wider text-[11px] border-b border-[#d5d5d5]">
                <tr>
                  <th className="py-3 px-4">Evaluation System</th>
                  <th className="py-3 px-4">Africa Rank</th>
                  <th className="py-3 px-4">Global Bracket</th>
                  <th className="py-3 px-4">Primary Methodological Weight</th>
                  <th className="py-3 px-4 text-right">Data Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E3DC]">
                <tr className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#09090B] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#164A3A]"></span>
                    AHEI (African Higher Education Index)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#164A3A] font-tabular-num">
                    #{university.rank}
                  </td>
                  <td className="py-3.5 px-4 font-tabular-num">N/A (Continental Exclusive)</td>
                  <td className="py-3.5 px-4 text-[#838383]">
                    Continental Policy, Citations &amp; Employability (Balanced)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="bg-[#09090B]/10 text-[#09090B] px-2 py-0.5 font-code-badge text-[11px] font-semibold">
                      Verified Primary
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#232323]">Times Higher Education (THE) Africa</td>
                  <td className="py-3.5 px-4 font-bold text-[#232323] font-tabular-num">#{university.rank + 4}</td>
                  <td className="py-3.5 px-4 font-tabular-num">801–1000 Band</td>
                  <td className="py-3.5 px-4 text-[#838383]">Research citations &amp; international outlook</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[#838383] font-code-badge text-[11px]">Synced Oct 2026</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#232323]">QS World University Rankings</td>
                  <td className="py-3.5 px-4 font-bold text-[#232323] font-tabular-num">#{university.rank + 6}</td>
                  <td className="py-3.5 px-4 font-tabular-num">901–950 Band</td>
                  <td className="py-3.5 px-4 text-[#838383]">Academic peer &amp; employer reputation surveys</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[#838383] font-code-badge text-[11px]">Synced Jun 2026</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#232323]">Webometrics Academic Repository</td>
                  <td className="py-3.5 px-4 font-bold text-[#232323] font-tabular-num">#{university.rank + 2}</td>
                  <td className="py-3.5 px-4 font-tabular-num">1,120 Global</td>
                  <td className="py-3.5 px-4 text-[#838383]">Open-access institutional repository web presence</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[#838383] font-code-badge text-[11px]">Synced Jul 2026</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION: SELECTED PROGRAMMES DIRECTORY WITH FILTER BAR */}
        <section className="space-y-4" id="programmes">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                Curricular Offerings
              </span>
              <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
                Selected Academic Programmes Directory
              </h2>
            </div>
            <div className="font-body-sm text-[12px] text-[#838383]">
              Showing {filteredProgrammes.length} Featured Flagship Programmes of 142 Total
            </div>
          </div>

          {/* Faceted Search & Filter Toolstrip */}
          <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#8c8e87]">
                search
              </span>
              <input
                type="text"
                value={programmeSearch}
                onChange={(e) => setProgrammeSearch(e.target.value)}
                placeholder="Search programmes, disciplines, or certifications..."
                className="w-full pl-9 pr-4 py-2 bg-white text-body-sm font-body-sm text-[#232323] placeholder:text-[#8c8e87] focus:outline-none border border-[#d5d5d5]"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="bg-white border border-[#d5d5d5] text-body-sm font-body-sm py-2 px-3 text-[#232323] focus:outline-none cursor-pointer"
              >
                <option value="All">All Degrees (UG &amp; PG)</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
                <option value="Doctoral">Doctorate (PhD)</option>
              </select>
            </div>
          </div>

          {/* Programmes Table */}
          <div className="overflow-x-auto bg-white border border-[#d5d5d5]">
            <table className="w-full text-left font-body-sm text-[12px]">
              <thead className="bg-[#E6E3DC] text-[#232323] font-title-md text-code-badge uppercase tracking-wider text-[11px] border-b border-[#d5d5d5]">
                <tr>
                  <th className="py-3 px-4">Programme &amp; Discipline</th>
                  <th className="py-3 px-4">Level &amp; Duration</th>
                  <th className="py-3 px-4">Faculty / Campus</th>
                  <th className="py-3 px-4">Domestic Tuition</th>
                  <th className="py-3 px-4">Accreditation Body</th>
                  <th className="py-3 px-4 text-right">Intake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E3DC]">
                {filteredProgrammes.map((prog) => (
                  <tr key={prog.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-title-md text-[14px] text-[#09090B] font-bold">
                        {prog.name}
                      </div>
                      <div className="font-code-badge text-[11px] text-[#838383]">
                        Code: {prog.code} • {prog.track}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block font-semibold">{prog.level}</span>
                      <div className="text-[#838383] font-code-badge text-[11px]">
                        {prog.duration}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#838383]">
                      <div>{prog.faculty}</div>
                      <div className="text-[11px] text-[#8c8e87]">{prog.campus}</div>
                    </td>
                    <td className="py-4 px-4 font-tabular-num font-semibold text-[#09090B]">
                      {prog.domesticTuition}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 bg-[#E6E3DC] px-2 py-0.5 text-[#09090B] text-[11px] font-semibold border border-[#d5d5d5]">
                        <span className="material-symbols-outlined text-[13px] text-[#164A3A]">verified</span>
                        {prog.accreditation}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-[#09090B] text-white font-code-badge text-[11px] px-2.5 py-1">
                        {prog.intake}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#f9f9f9] text-center border border-[#d5d5d5]">
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-title-md text-[13px] text-[#164A3A] hover:text-[#09090B] transition-colors underline underline-offset-4"
            >
              View all 142 accredited {university.name} programmes with full syllabus breakdowns →
            </a>
          </div>
        </section>

        {/* SECTION: TUITION & COST OF LIVING MATRIX */}
        <section className="space-y-6" id="tuition">
          <div className="border-b border-[#d5d5d5] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                Financial Planning Intelligence
              </span>
              <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
                Tuition Structures &amp; {university.city} Living Estimates
              </h2>
            </div>
            <span className="font-code-badge text-[11px] text-[#838383]">
              Currency: National Currency &amp; USD Equivalent
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tuition Comparison */}
            <div className="bg-white p-6 border border-[#d5d5d5] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-[18px] text-[#09090B] font-bold">
                  Annual Tuition by Residency Status
                </h3>
                <span className="font-code-badge text-[11px] text-[#164A3A] font-semibold">
                  ACADEMIC YR 2026/27
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                Under sovereign tertiary funding models, government-sponsored citizens receive tiered scholarship and loan support via national education boards.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] flex justify-between items-center">
                  <div>
                    <div className="font-title-md text-[14px] text-[#09090B] font-bold">
                      National Citizen (Government Subsidized / Band 1–4)
                    </div>
                    <div className="text-[12px] text-[#838383]">Covers eligible domestic &amp; regional students</div>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular-num font-bold text-[#09090B] block">
                      KES 40,000 – 90,000
                    </span>
                    <div className="font-code-badge text-[11px] text-[#8c8e87]">~$310 – $700 USD / yr</div>
                  </div>
                </div>

                <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] flex justify-between items-center">
                  <div>
                    <div className="font-title-md text-[14px] text-[#09090B] font-bold">
                      National Self-Sponsored (Direct Entry)
                    </div>
                    <div className="text-[12px] text-[#838383]">Arts, Humanities, Business disciplines</div>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular-num font-bold text-[#09090B] block">
                      KES 180,000 – 260,000
                    </span>
                    <div className="font-code-badge text-[11px] text-[#8c8e87]">~$1,400 – $2,000 USD / yr</div>
                  </div>
                </div>

                <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] flex justify-between items-center">
                  <div>
                    <div className="font-title-md text-[14px] text-[#09090B] font-bold">
                      National STEM &amp; Professional Faculties
                    </div>
                    <div className="text-[12px] text-[#838383]">Engineering, Medicine, Computing, Pharmacy</div>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular-num font-bold text-[#09090B] block">
                      KES 300,000 – 480,000
                    </span>
                    <div className="font-code-badge text-[11px] text-[#8c8e87]">~$2,300 – $3,700 USD / yr</div>
                  </div>
                </div>

                <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] flex justify-between items-center">
                  <div>
                    <div className="font-title-md text-[14px] text-[#09090B] font-bold">
                      International Non-Resident Students
                    </div>
                    <div className="text-[12px] text-[#838383]">All faculties baseline flat tariff</div>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular-num font-bold text-[#164A3A] block">
                      {university.internationalTuitionAnnual}
                    </span>
                    <div className="font-code-badge text-[11px] text-[#8c8e87]">Standard International Matrix</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nairobi / Local Living Cost Index */}
            <div className="bg-white p-6 border border-[#d5d5d5] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-[18px] text-[#09090B] font-bold">
                  Estimated Student Living Costs ({university.city})
                </h3>
                <span className="font-code-badge text-[11px] text-[#09090B] bg-[#09090B]/10 px-2 py-0.5 font-bold">
                  EST. PER MONTH
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#838383]">
                Representative monthly expenditure for an on/off-campus student within the {university.city} university perimeter.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between p-2.5 bg-[#f9f9f9] border border-[#E6E3DC]">
                  <span className="flex items-center gap-2 text-body-sm text-[12px] text-[#232323]">
                    <span className="material-symbols-outlined text-[18px] text-[#164A3A]">bed</span>
                    On-Campus University Hall of Residence
                  </span>
                  <span className="font-tabular-num font-bold text-[#09090B]">
                    KES 4,500 – 8,000 <span className="font-normal text-[11px] text-[#838383]">($35–$62)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f9f9f9] border border-[#E6E3DC]">
                  <span className="flex items-center gap-2 text-body-sm text-[12px] text-[#232323]">
                    <span className="material-symbols-outlined text-[18px] text-[#164A3A]">home</span>
                    Private Off-Campus Studio / Shared Flat
                  </span>
                  <span className="font-tabular-num font-bold text-[#09090B]">
                    KES 14,000 – 26,000 <span className="font-normal text-[11px] text-[#838383]">($110–$200)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f9f9f9] border border-[#E6E3DC]">
                  <span className="flex items-center gap-2 text-body-sm text-[12px] text-[#232323]">
                    <span className="material-symbols-outlined text-[18px] text-[#164A3A]">restaurant</span>
                    Food, Dining &amp; Grocery Staples
                  </span>
                  <span className="font-tabular-num font-bold text-[#09090B]">
                    KES 12,000 – 18,000 <span className="font-normal text-[11px] text-[#838383]">($90–$140)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f9f9f9] border border-[#E6E3DC]">
                  <span className="flex items-center gap-2 text-body-sm text-[12px] text-[#232323]">
                    <span className="material-symbols-outlined text-[18px] text-[#164A3A]">directions_bus</span>
                    City Transit (Matatu / Commuter Rail)
                  </span>
                  <span className="font-tabular-num font-bold text-[#09090B]">
                    KES 4,000 – 6,500 <span className="font-normal text-[11px] text-[#838383]">($30–$50)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f9f9f9] border border-[#E6E3DC]">
                  <span className="flex items-center gap-2 text-body-sm text-[12px] text-[#232323]">
                    <span className="material-symbols-outlined text-[18px] text-[#164A3A]">wifi</span>
                    High-Speed Mobile Broadband &amp; Books
                  </span>
                  <span className="font-tabular-num font-bold text-[#09090B]">
                    KES 3,500 – 5,000 <span className="font-normal text-[11px] text-[#838383]">($27–$38)</span>
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#f9f9f9] border border-[#d5d5d5] text-body-sm font-code-badge text-[11px] text-[#838383] flex justify-between items-center">
                <span>TOTAL ESTIMATED LIVING BUDGET:</span>
                <span className="text-[#09090B] font-bold text-[14px]">
                  {university.averageMonthlyLiving}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: RESEARCH CENTERS & FLAGSHIP INSTITUTES */}
        <section className="space-y-4" id="research">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A] font-semibold">
                Scientific Capacity
              </span>
              <h2 className="font-headline-sm text-[22px] font-serif text-[#09090B]">
                Flagship Research Institutes &amp; Centers of Excellence
              </h2>
            </div>
            <span className="font-code-badge text-[11px] text-[#838383]">3 Global Priority Hubs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {university.researchCenters.map((rc, idx) => (
              <div
                key={idx}
                className="bg-white p-6 border border-[#d5d5d5] space-y-3 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <span className="font-code-badge text-[11px] text-[#164A3A] font-bold uppercase">
                    {rc.category}
                  </span>
                  <h3 className="font-headline-sm text-[18px] font-serif text-[#09090B] font-bold">
                    {rc.name}
                  </h3>
                  <p className="font-body-sm text-[12px] text-[#838383] leading-relaxed">
                    {rc.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E6E3DC] space-y-1 text-[11px] font-code-badge text-[#838383]">
                  <div>• Partners: {rc.partners}</div>
                  <div>• Primary Facility: {rc.facility}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: PROVENANCE & AUDIT TRAIL */}
        <section className="p-6 bg-[#f9f9f9] border border-[#d5d5d5] space-y-4" id="provenance">
          <div className="flex items-center justify-between border-b border-[#d5d5d5] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#164A3A]">history_edu</span>
              <h3 className="font-title-lg text-[18px] text-[#09090B] font-bold">
                Institutional Audit &amp; Data Provenance Trail
              </h3>
            </div>
            <span className="font-code-badge text-[11px] text-[#838383]">
              CYCLE: 2026/2027 AHEI EVALUATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-body-sm text-[12px]">
            <div className="space-y-1">
              <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                Accreditation Register
              </div>
              <p className="text-[#838383]">
                Direct institutional charter accreditation record registry verified 14 Sep 2026.
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                Annual Financial Report 2025/2026
              </div>
              <p className="text-[#838383]">
                Audited financial disclosures verified for research endowment and capital allocations.
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                Scopus &amp; Web of Science Databases
              </div>
              <p className="text-[#838383]">
                5-year window citation aggregation, h-index calculation, and co-authorship matrices.
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                Higher Education Funding Registry
              </div>
              <p className="text-[#838383]">
                Tuition fee parity verification for national government-subsidized categories.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white border border-[#d5d5d5] font-code-badge text-[11px] text-[#838383] flex items-center justify-between flex-wrap gap-2">
            <span>SECURITY SIGNATURE: SHA256:7a4f91e92d...verified-academic-registry</span>
            <span className="text-[#164A3A] font-semibold">VERIFIED SOVEREIGN INSTITUTIONAL RECORD</span>
          </div>
        </section>
      </div>
    </div>
  );
};
