'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { useCompare } from '@/components/layout/CompareProvider';
import { useBookmarks } from '@/components/layout/BookmarksProvider';
import { Building2, Search, Filter, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="max-w-[1200px] mx-auto px-4 py-16 text-center font-body-md text-[#838383]">Loading university directory…</div>}>
      <UniversitiesDirectoryContent />
    </Suspense>
  );
}

function UniversitiesDirectoryContent() {
  const searchParams = useSearchParams();
  const { universities } = useUniversities();
  const { addToCompare, isInCompare } = useCompare();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'all');

  const countries = useMemo(() => {
    return Array.from(new Set(universities.map((u) => u.country))).sort();
  }, [universities]);

  const filteredUnis = useMemo(() => {
    return universities.filter((u) => {
      const q = query.toLowerCase().trim();
      const matchesSearch = !q || (
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.countryCode.toLowerCase() === q
      );

      const matchesRegion = selectedRegion === 'all' || u.region === selectedRegion;
      const matchesCountry = selectedCountry === 'all' || u.country === selectedCountry;

      return matchesSearch && matchesRegion && matchesCountry;
    }).sort((a, b) => a.rank - b.rank);
  }, [universities, query, selectedRegion, selectedCountry]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-8">
      {/* Breadcrumb */}
      <nav className="font-body-sm text-[#666666] flex items-center gap-2 text-xs">
        <Link href="/" className="no-underline text-[#666666] hover:text-[#09090B]">
          Home
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#09090B] font-semibold">Universities &amp; Academic Institutions Directory</span>
      </nav>

      {/* Header Masthead */}
      <header className="border-b border-[#e9e9e9] pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
            Continental Registry
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
            {universities.length} Audited Chartered Institutions
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-[#09090B] font-bold tracking-tight m-0 mb-2">
              African Universities Directory &amp; Gazetted Roster
            </h1>
            <p className="font-body-lg text-[#666666] max-w-2xl m-0 leading-relaxed text-sm md:text-base">
              Explore officially verified institutional profiles across all African jurisdictions. Access degree registries, statutory tuition bands, student body metrics, and accreditation standing.
            </p>
          </div>

          <Link
            href="/rankings"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#09090B] hover:bg-[#232323] transition-all no-underline shadow-xs shrink-0 self-start md:self-auto"
          >
            <span>View 2027 League Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#f1f5f9]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#838383] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university name, city, or code…"
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#d5d5d5] rounded-xs bg-[#FFFFFF] focus:outline-none focus:border-[#09090B]"
            />
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-[#d5d5d5] rounded-xs bg-[#FFFFFF] focus:outline-none focus:border-[#09090B]"
            >
              <option value="all">All African Regions (5)</option>
              <option value="Southern Africa">Southern Africa</option>
              <option value="East Africa">East Africa</option>
              <option value="North Africa">North Africa</option>
              <option value="West Africa">West Africa</option>
              <option value="Central Africa">Central Africa</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-[#d5d5d5] rounded-xs bg-[#FFFFFF] focus:outline-none focus:border-[#09090B]"
            >
              <option value="all">All Member States ({countries.length})</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#838383] font-mono">
          <span>SHOWING {filteredUnis.length} OF {universities.length} INSTITUTIONS</span>
          {(query || selectedRegion !== 'all' || selectedCountry !== 'all') && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedRegion('all');
                setSelectedCountry('all');
              }}
              className="text-[#164A3A] hover:underline font-sans cursor-pointer border-none bg-transparent"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUnis.map((u) => {
            return (
              <div
                key={u.id}
                className="the-card bg-white rounded-none border border-[#e9e9e9] p-5 flex flex-col justify-between hover:border-[#164A3A] hover:shadow-none transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    {u.crestUrl && (
                      <div className="w-12 h-12 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs shrink-0">
                        <img
                          src={u.crestUrl}
                          alt={`${u.name} crest`}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#164A3A] text-white">
                          #{u.rank} in Africa
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f1f5f9] px-1.5 py-0.5 rounded-sm border border-[#e2e8f0]">
                          {u.countryCode.toUpperCase()}
                        </span>
                      </div>
                      <Link
                        href={`/universities/${u.id}`}
                        className="no-underline block group"
                      >
                        <h3 className="font-headline-sm text-sm font-bold text-[#09090B] group-hover:text-[#164A3A] transition-colors m-0 leading-snug line-clamp-1">
                          {u.name}
                        </h3>
                      </Link>
                      <p className="font-body-sm text-[#666666] m-0 text-xs mt-0.5">
                        {u.city}, {u.country}
                      </p>
                    </div>
                  </div>

                  <p className="font-body-sm text-[#666666] text-xs line-clamp-2 m-0 mb-4 leading-relaxed">
                    {u.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-xs mb-4">
                    <div>
                      <span className="text-[#838383] block text-[10px] uppercase font-mono font-medium">AHEI Score</span>
                      <span className="font-tabular-num font-bold text-sm text-[#09090B]">{u.aheiScore.toFixed(1)} / 100</span>
                    </div>
                    <div>
                      <span className="text-[#838383] block text-[10px] uppercase font-mono font-medium">Domestic Tuition</span>
                      <span className="font-tabular-num font-bold text-sm text-[#09090B]">{u.domesticTuitionUsd}/yr</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => addToCompare(u.id)}
                    disabled={isInCompare(u.id)}
                    className="text-xs text-[#09090B] font-semibold hover:text-[#164A3A] transition-colors cursor-pointer disabled:opacity-40 border-none bg-transparent"
                  >
                    {isInCompare(u.id) ? '✓ In Compare' : '+ Compare'}
                  </button>

                  <Link
                    href={`/universities/${u.id}`}
                    className="text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Full Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
