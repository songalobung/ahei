'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { MACRO_REGIONS } from '@/data/macroRegions';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';

export default function ExplorePage() {
  const { universities } = useUniversities();

  const countries = useMemo(() => {
    return Array.from(new Set(universities.map((u) => ({ name: u.country, flag: u.flag, code: u.countryCode }))))
      .reduce((acc, curr) => {
        if (!acc.find((c) => c.name === curr.name)) acc.push(curr);
        return acc;
      }, [] as { name: string; flag: string; code: string }[])
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [universities]);

  const countryInstitutionCounts = useMemo(() => {
    return countries.map((c) => ({
      ...c,
      count: universities.filter((u) => u.country === c.name).length,
    }));
  }, [countries, universities]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-[#e9e9e9]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
          Geographical Corridors &amp; National Hubs
        </span>
        <h1 className="font-headline-lg text-[#09090B] font-bold tracking-tight mb-2">
          Explore African Higher Education
        </h1>
        <p className="font-body-md text-[#666666] max-w-2xl text-sm md:text-base leading-relaxed">
          Browse audited institutions across 5 continental macro-regions and all 54 sovereign African member nations.
        </p>
      </div>

      {/* Region Cards */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono">
            Macro-Regional Corridors (5)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MACRO_REGIONS.map((region) => (
            <Link
              key={region.id}
              href={`/regions/${region.id}`}
              className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 flex flex-col justify-between hover:border-[#164A3A] hover:shadow-none transition-all duration-200 group no-underline"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#164A3A] bg-[#F7F6F2] px-2.5 py-0.5 rounded-full border border-[#D9D7D0]">
                    {region.nationsCount} Nations
                  </span>
                  <span className="font-tabular-num text-xs font-bold text-[#09090B] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
                    {region.rankedBodies} Monitored
                  </span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-[#09090B] group-hover:text-[#164A3A] transition-colors mb-3 leading-snug">
                  {region.name}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                    <span className="text-[#666666]">Median AHEI Score</span>
                    <span className="font-tabular-num font-bold text-[#09090B]">
                      {region.medianScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="py-2 bg-[#f8fafc] px-3 rounded-lg border border-[#f1f5f9] mt-2">
                    <span className="text-[11px] text-[#838383] block">Top Ranked Institution</span>
                    <strong className="text-xs text-[#09090B] font-bold block truncate mt-0.5">{region.topInstitution}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-semibold text-[#164A3A]">
                <span>Explore Regional Dossier</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Google Ad Space: Explore Mid-Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-8" />

      {/* Country Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono">
            Directory by Sovereign Nation ({countryInstitutionCounts.length})
          </h2>
        </div>
        <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {countryInstitutionCounts.map((c) => (
              <Link
                key={c.code}
                href={`/rankings?country=${encodeURIComponent(c.name)}`}
                className="no-underline flex items-center gap-2 p-2.5 rounded-xs border border-transparent hover:border-[#e2e8f0] hover:bg-[#f8fafc] transition-all text-[#09090B] text-xs font-medium"
              >
                <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f1f5f9] px-1.5 py-0.5 rounded-sm border border-[#e2e8f0] shrink-0">
                  {c.code.toUpperCase()}
                </span>
                <span className="truncate">{c.name}</span>
                <span className="font-tabular-num text-[#838383] ml-auto text-[11px] shrink-0">
                  ({c.count})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
