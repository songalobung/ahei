'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { University } from '@/data/universities';
import { useCompare } from '@/components/layout/CompareProvider';
import { useBookmarks } from '@/components/layout/BookmarksProvider';
import { useUniversities } from '@/components/layout/InstitutionsProvider';

const DISCIPLINES = [
  { id: 'all', label: 'All Disciplines', code: 'ALL' },
  { id: 'medicine', label: 'Medicine & Health', code: 'MED', keywords: ['Medicine', 'Health', 'Surgery', 'Pharmacy', 'Clinical', 'Nursing'] },
  { id: 'tech', label: 'Computer Science & AI', code: 'CSC', keywords: ['Computer', 'Informatics', 'Software', 'Data', 'Artificial Intelligence', 'Cyber'] },
  { id: 'engineering', label: 'Engineering & Technology', code: 'ENG', keywords: ['Engineering', 'Electrical', 'Mechanical', 'Civil', 'Mining', 'Renewable'] },
  { id: 'business', label: 'Business & Economics', code: 'BUS', keywords: ['Business', 'Economics', 'Finance', 'Commerce', 'Management', 'Accounting'] },
  { id: 'law', label: 'Law & Governance', code: 'LAW', keywords: ['Law', 'Legal', 'Jurisprudence', 'Public Policy', 'International Relations'] },
  { id: 'agriculture', label: 'Agriculture & Food Systems', code: 'AGR', keywords: ['Agriculture', 'Veterinary', 'Agronomy', 'Food Security', 'Forestry'] },
];

const REGIONS = [
  { id: 'all', label: 'All Regions' },
  { id: 'Southern Africa', label: 'Southern Africa' },
  { id: 'East Africa', label: 'East Africa' },
  { id: 'North Africa', label: 'North Africa' },
  { id: 'West Africa', label: 'West Africa' },
];

const PRIORITIES = [
  { id: 'rank', label: 'Overall Prestige' },
  { id: 'employability', label: 'High Employability' },
  { id: 'research', label: 'Research Excellence' },
  { id: 'teaching', label: 'Teaching & Mentorship' },
  { id: 'affordable', label: 'Affordable Tuition' },
];

export function CourseMatcher() {
  const { universities } = useUniversities();
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('rank');

  const { addToCompare, isInCompare } = useCompare();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Region filter
      if (selectedRegion !== 'all' && u.region !== selectedRegion) return false;

      // Discipline filter
      if (selectedDiscipline !== 'all') {
        const disc = DISCIPLINES.find((d) => d.id === selectedDiscipline);
        if (disc && disc.keywords) {
          const matchFaculty = u.flagshipFaculties?.some((f) =>
            disc.keywords.some((kw) => f.toLowerCase().includes(kw.toLowerCase()))
          );
          const matchProgrammes = u.programmes?.some((p) =>
            disc.keywords.some(
              (kw) =>
                p.name.toLowerCase().includes(kw.toLowerCase()) ||
                p.faculty.toLowerCase().includes(kw.toLowerCase())
            )
          );
          if (!matchFaculty && !matchProgrammes) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedPriority === 'rank') return a.rank - b.rank;
      if (selectedPriority === 'employability') return b.employabilityScore - a.employabilityScore;
      if (selectedPriority === 'research') return b.researchScore - a.researchScore;
      if (selectedPriority === 'teaching') return b.teachingScore - a.teachingScore;
      if (selectedPriority === 'affordable') {
        // parse numeric tuition in USD if possible
        const getUsd = (u: University) => {
          const match = u.domesticTuitionUsd?.match(/\$?([\d,]+)/);
          return match ? parseInt(match[1].replace(/,/g, ''), 10) : 5000;
        };
        return getUsd(a) - getUsd(b);
      }
      return a.rank - b.rank;
    });
  }, [selectedDiscipline, selectedRegion, selectedPriority]);

  return (
    <div className="the-card border border-[#e9e9e9]" style={{ padding: '24px 28px', borderRadius: '16px' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#f2f2f2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-code-badge text-white px-2.5 py-0.5"
              style={{
                background: '#164A3A',
                borderRadius: '12px',
              }}
            >
              Interactive Discovery
            </span>
            <span className="font-body-sm text-[#838383]">Verified African University Programme Matcher</span>
          </div>
          <h2 className="font-headline-md text-[#232323] m-0">
            Find Your Ideal African University
          </h2>
          <p className="font-body-sm text-[#838383] mt-1 mb-0">
            Filter 1,048 monitored institutions by subject specialisation, location, and your personal priorities.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="font-tabular-num text-3xl font-bold text-[#164A3A]">
            {filteredUniversities.length}
          </span>
          <span className="font-body-sm text-[#838383] block">Matches Found</span>
        </div>
      </div>

      {/* Filter Matrix Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 pb-6 border-b border-[#f2f2f2]">
        {/* Step 1: Discipline */}
        <div>
          <label className="text-xs font-semibold text-[#232323] block mb-1.5">
            1. Field of Study
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="input-field w-full text-xs py-2 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ borderRadius: '10px', background: '#FFFFFF' }}
          >
            {DISCIPLINES.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.code}] {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Region */}
        <div>
          <label className="text-xs font-semibold text-[#232323] block mb-1.5">
            2. Preferred Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="input-field w-full text-xs py-2 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ borderRadius: '10px', background: '#FFFFFF' }}
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Priority */}
        <div>
          <label className="text-xs font-semibold text-[#232323] block mb-1.5">
            3. What Matters Most?
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="input-field w-full text-xs py-2 px-3 border border-[#d5d5d5] focus:outline-none focus:border-[#164A3A]"
            style={{ borderRadius: '10px', background: '#FFFFFF' }}
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Deck */}
      <div className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUniversities.slice(0, 6).map((u) => {
            const isTopTier = u.aheiScore >= 90;
            const isHighTier = u.aheiScore >= 80 && u.aheiScore < 90;

            return (
              <div
                key={u.id}
                className="the-card p-5 border border-[#e9e9e9] flex flex-col justify-between hover:border-[#164A3A] transition-all"
                style={{ borderRadius: '16px' }}
              >
                <div>
                  {/* Top Bar: Rank & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                        #{u.rank}
                      </span>
                      <span
                        className="font-code-badge"
                        style={{
                          background: isTopTier ? '#faf5ff' : isHighTier ? '#F7F6F2' : '#f9f9f9',
                          color: isTopTier ? '#164A3A' : isHighTier ? '#164A3A' : '#595959',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 600,
                        }}
                      >
                        {isTopTier ? 'Tier 1 · Elite' : isHighTier ? 'Tier 2 · Distinction' : 'Tier 3 · Merit'}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(u.id)}
                      className="cursor-pointer transition-colors p-1"
                      style={{
                        background: 'none',
                        border: 'none',
                      }}
                      title={isBookmarked(u.id) ? 'Saved in Shortlist' : 'Add to Shortlist'}
                    >
                      <svg className="w-4 h-4" fill={isBookmarked(u.id) ? "#164A3A" : "none"} stroke={isBookmarked(u.id) ? "#164A3A" : "#838383"} strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* University Name & Flag */}
                  <h3 className="font-title-lg text-[#232323] mb-1 line-clamp-1">
                    <Link href={`/universities/${u.id}`} className="no-underline hover:text-[#164A3A] transition-colors">
                      {u.name}
                    </Link>
                  </h3>
                  <p className="font-body-sm text-[#838383] mb-3 flex items-center gap-1.5">
                    <span
                      className="font-mono text-[10px] font-bold text-[#164A3A] bg-[#F7F6F2] px-1.5 py-0.5"
                      style={{ borderRadius: '4px' }}
                    >
                      {u.countryCode.toUpperCase()}
                    </span>
                    <span className="text-xs">{u.city}, {u.country}</span>
                  </p>

                  {/* Quick Metric Pills */}
                  <div
                    className="grid grid-cols-2 gap-2 p-3 bg-[#f9f9f9] mb-3 border border-[#e9e9e9]"
                    style={{ borderRadius: '12px' }}
                  >
                    <div>
                      <span className="text-[10px] text-[#838383] block uppercase font-medium">Overall Score</span>
                      <span className="font-tabular-num font-bold text-[#164A3A] text-sm">
                        {u.aheiScore.toFixed(1)} <span className="font-normal text-[10px] text-[#838383]">/ 100</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#838383] block uppercase font-medium">Employability</span>
                      <span className="font-tabular-num font-bold text-[#232323] text-sm">
                        {u.employabilityScore.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#838383] block uppercase font-medium">Staff Ratio</span>
                      <span className="font-tabular-num text-xs font-semibold text-[#232323]">
                        {u.studentFacultyRatio || '16:1'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#838383] block uppercase font-medium">Est. Tuition</span>
                      <span className="font-tabular-num text-xs font-semibold text-[#09090B]">
                        {u.domesticTuitionUsd || '$1,200'}
                      </span>
                    </div>
                  </div>

                  {/* Flagship discipline tag */}
                  {u.flagshipFaculties && u.flagshipFaculties.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] font-semibold text-[#838383] block uppercase tracking-wider mb-1">
                        Flagship Disciplines
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {u.flagshipFaculties.slice(0, 2).map((fac, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#f2f2f2] text-[#232323] px-2 py-0.5"
                            style={{ borderRadius: '6px' }}
                          >
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#f2f2f2] flex items-center justify-between gap-2 mt-auto">
                  <Link
                    href={`/universities/${u.id}`}
                    className="text-xs font-bold text-[#164A3A] hover:underline"
                  >
                    Full Dossier →
                  </Link>

                  <button
                    onClick={() => addToCompare(u.id)}
                    disabled={isInCompare(u.id)}
                    className="px-3 py-1 border transition-colors cursor-pointer text-xs"
                    style={{
                      background: isInCompare(u.id) ? '#D9D7D0' : '#FFFFFF',
                      borderColor: isInCompare(u.id) ? '#164A3A' : '#d5d5d5',
                      color: isInCompare(u.id) ? '#164A3A' : '#09090B',
                      borderRadius: '16px',
                      fontWeight: 600,
                    }}
                  >
                    {isInCompare(u.id) ? 'In Compare' : '+ Compare'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUniversities.length > 6 && (
          <div className="text-center mt-6">
            <Link
              href="/rankings"
              className="btn-secondary no-underline inline-flex items-center gap-2"
            >
              Explore All {filteredUniversities.length} Institutions in League Table →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
