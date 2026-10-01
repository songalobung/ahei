'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { MACRO_REGIONS } from '@/data/macroRegions';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { ARTICLES_DATA } from '@/data/articles';

export default function HomePage() {
  const router = useRouter();
  const { universities } = useUniversities();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Top 5 institutions sorted by overall score
  const top5 = useMemo(() => {
    return [...universities].sort((a, b) => b.aheiScore - a.aheiScore).slice(0, 5);
  }, [universities]);

  // Live matching for the hero search input
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return universities
      .filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.countryCode.toLowerCase() === q
      )
      .slice(0, 6);
  }, [universities, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(`/universities/${searchResults[0].id}`);
    } else if (searchQuery.trim()) {
      router.push(`/rankings?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-12">
      {/* ─── 1. Hero Section (THE Style) ─── */}
      <section className="pb-12">
        <div className="mb-2">
          <span
            className="font-code-badge"
            style={{
              background: '#09090B',
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: '20px',
            }}
          >
            2027 EDITION
          </span>
        </div>

        <h1 className="font-headline-lg md:text-5xl mb-4 leading-tight">
          <span className="the-gradient-text">Empowering</span>
          <br />
          <span className="text-[#232323]">African Higher Education</span>
        </h1>
        <p className="font-body-lg text-[#595959] max-w-2xl mb-8 leading-relaxed">
          From powerful, data-driven insights and strategic benchmarking across 54 African nations, our rankings enable students, academics, and institutions to make smarter, more informed decisions.
        </p>

        {/* Hero Search (THE rounded style) */}
        <div className="max-w-2xl relative mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white shadow-none" style={{ borderRadius: '28px', border: '1px solid #e9e9e9' }}>
              <div className="pl-4 pr-2 text-[#838383]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search universities by name, country, or city…"
                className="w-full py-3.5 pr-4 text-sm text-[#232323] placeholder-[#838383] outline-none"
                style={{ background: 'transparent' }}
              />
              <button
                type="submit"
                className="btn-primary text-xs shrink-0 mr-1.5 px-5 py-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-none z-30 divide-y divide-[#f2f2f2]" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              {searchResults.map((u) => (
                <Link
                  key={u.id}
                  href={`/universities/${u.id}`}
                  className="flex items-center justify-between p-3 hover:bg-[#f9f9f9] transition-colors no-underline"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#164A3A] bg-[#F7F6F2] px-1.5 py-0.5" style={{ borderRadius: '4px' }}>
                      {u.countryCode.toUpperCase()}
                    </span>
                    <span className="font-semibold text-sm text-[#232323]">{u.name}</span>
                    <span className="text-xs text-[#838383]">({u.city}, {u.country})</span>
                  </div>
                  <span className="font-tabular-num font-bold text-xs text-[#164A3A]">
                    #{u.rank} · {u.aheiScore.toFixed(1)}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Quick Pathway Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-[#838383] font-medium">Quick:</span>
            {[
              { label: 'Top 10', href: '/rankings' },
              { label: 'AI Career Match', href: '/careers' },
              { label: 'Medicine', href: '/subjects' },
              { label: 'Computer Science', href: '/subjects' },
              { label: 'South Africa', href: '/explore/southern-africa' },
              { label: 'Kenya', href: '/explore/east-africa' },
              { label: 'Egypt', href: '/explore/north-africa' },
              { label: 'Cost Calculator', href: '/calculator' },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-3 py-1 bg-white border border-[#d5d5d5] text-[#232323] hover:border-[#164A3A] hover:text-[#164A3A] no-underline transition-colors font-medium"
                style={{ borderRadius: '20px' }}
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Continental Stats (THE rounded cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Institutions Ranked', value: '1,048' },
            { label: 'Countries & Territories', value: '54' },
            { label: 'Evaluated Programmes', value: '14,200+' },
            { label: 'Indexed Citations', value: '1.8M' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4" style={{ borderRadius: '12px' }}>
              <span className="text-xs text-[#838383] block uppercase tracking-wider font-medium">{stat.label}</span>
              <span className="font-tabular-num font-bold text-2xl text-[#232323] mt-1 block">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. Primary Gateways (THE Rounded Cards) ─── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Rankings */}
          <Link
            href="/rankings"
            className="the-card p-6 flex flex-col justify-between no-underline group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-code-badge text-white px-2.5 py-0.5" style={{ background: '#164A3A', borderRadius: '12px' }}>
                  RANKINGS
                </span>
                <span className="text-xs text-[#838383] font-mono">1,048</span>
              </div>
              <h3 className="font-title-lg text-[#232323] group-hover:text-[#164A3A] transition-colors mb-2">
                World University Rankings
              </h3>
              <p className="font-body-sm text-[#595959] m-0 leading-relaxed">
                Full multi-pillar rankings evaluating research depth, teaching quality, graduate employability, and continental impact.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-semibold text-[#164A3A]">
              <span>Explore Rankings</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Subjects */}
          <Link
            href="/subjects"
            className="the-card p-6 flex flex-col justify-between no-underline group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-code-badge text-white px-2.5 py-0.5" style={{ background: '#164A3A', borderRadius: '12px' }}>
                  SUBJECTS
                </span>
                <span className="text-xs text-[#838383] font-mono">6 FIELDS</span>
              </div>
              <h3 className="font-title-lg text-[#232323] group-hover:text-[#164A3A] transition-colors mb-2">
                Rankings by Subject
              </h3>
              <p className="font-body-sm text-[#595959] m-0 leading-relaxed">
                Examine leading faculties across Medicine, Computer Science &amp; AI, Engineering, Business, Law, and Agriculture.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-semibold text-[#164A3A]">
              <span>Explore Subjects</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Calculator */}
          <Link
            href="/calculator"
            className="the-card p-6 flex flex-col justify-between no-underline group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-code-badge text-white px-2.5 py-0.5" style={{ background: '#24A148', borderRadius: '12px' }}>
                  FINANCE
                </span>
                <span className="text-xs text-[#838383] font-mono">BUDGETS</span>
              </div>
              <h3 className="font-title-lg text-[#232323] group-hover:text-[#24A148] transition-colors mb-2">
                Tuition &amp; Living Costs
              </h3>
              <p className="font-body-sm text-[#595959] m-0 leading-relaxed">
                Estimate 10-month student budgets covering domestic vs. international tuition, campus housing, and living costs.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-semibold text-[#24A148]">
              <span>Calculate Costs</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Compare */}
          <Link
            href="/compare"
            className="the-card p-6 flex flex-col justify-between no-underline group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-code-badge px-2.5 py-0.5" style={{ background: '#f2f2f2', color: '#232323', borderRadius: '12px' }}>
                  COMPARE
                </span>
                <span className="text-xs text-[#838383] font-mono">SIDE-BY-SIDE</span>
              </div>
              <h3 className="font-title-lg text-[#232323] group-hover:text-[#164A3A] transition-colors mb-2">
                Compare Institutions
              </h3>
              <p className="font-body-sm text-[#595959] m-0 leading-relaxed">
                Head-to-head dossiers comparing research output, student ratios, fee bands, and regional standing.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-semibold text-[#164A3A]">
              <span>Launch Compare</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* AI Career Match Callout (THE gradient card) */}
        <div
          className="mt-6 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #164A3A 0%, #164A3A 60%, #3B9FE6 100%)',
          }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-code-badge text-white px-2.5 py-0.5" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                AI ENGINE
              </span>
            </div>
            <h3 className="font-headline-md text-white m-0 mb-2">
              AI Career Match &amp; Degree Roadmap
            </h3>
            <p className="text-sm text-white/80 m-0 leading-relaxed">
              Map your career ambitions directly to high-demand continental industries and top-ranked African faculties. Explore salary tiers across Lagos, Nairobi, Cape Town, and Cairo.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/careers"
              className="px-6 py-3 bg-white text-[#164A3A] font-semibold text-sm text-center no-underline transition-all flex items-center justify-center gap-2 hover:shadow-none"
              style={{ borderRadius: '24px' }}
            >
              <span>Match Your Ambitions</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Google Ad Space: Home Mid-Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-6" />

      {/* ─── 3. Continental Flagship League Table Highlight (Top 5 Leaders) ─── */}
      <section>
        <div className="the-card border border-[#e9e9e9] overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="p-4 sm:p-6 border-b border-[#f2f2f2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-code-badge text-white px-2.5 py-0.5"
                  style={{ background: '#09090B', borderRadius: '12px' }}
                >
                  FLAGSHIP HIGHLIGHT
                </span>
                <span className="font-body-sm text-[#838383]">Top 5 Continental Leaders</span>
              </div>
              <h2 className="font-headline-md text-[#232323] m-0">
                2027 Overall Continental Rankings
              </h2>
            </div>

            <Link
              href="/rankings"
              className="btn-primary font-body-sm no-underline self-start sm:self-auto px-5 py-2.5"
              style={{ borderRadius: '24px' }}
            >
              View All 1,048 Institutions →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="rankings-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={{ width: '56px' }}>#</th>
                  <th>Institution &amp; Country</th>
                  <th>Performance Tier</th>
                  <th style={{ textAlign: 'right' }}>Overall Score</th>
                  <th style={{ textAlign: 'center' }}>Staff Ratio</th>
                  <th style={{ textAlign: 'right' }}>Est. Tuition</th>
                  <th style={{ textAlign: 'center', width: '90px' }}>Dossier</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((u) => {
                  const isTier1 = u.aheiScore >= 90;

                  return (
                    <tr key={u.id}>
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
                              {u.city}, {u.country}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`text-xs font-semibold px-2.5 py-1 ${isTier1 ? 'text-[#164A3A] bg-[#faf5ff]' : 'text-[#164A3A] bg-[#F7F6F2]'}`} style={{ borderRadius: '12px' }}>
                          {isTier1 ? 'Tier 1 · Elite' : 'Tier 2 · Distinction'}
                        </span>
                      </td>

                      <td className="cell-score">
                        <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                          {u.aheiScore.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-[#838383] block">/ 100</span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span className="font-tabular-num text-xs font-semibold text-[#232323]">
                          {u.studentFacultyRatio || '18:1'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <span className="font-tabular-num text-xs font-semibold text-[#09090B]">
                          {u.domesticTuitionUsd || '$1,500'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <Link
                          href={`/universities/${u.id}`}
                          className="text-xs no-underline font-semibold text-[#164A3A] hover:underline"
                        >
                          Full Dossier →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#f9f9f9] border-t border-[#f2f2f2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#838383] gap-2">
            <span>Showing top 5 flagships. Use the comprehensive league table for granular pillar filters and institutional comparisons.</span>
            <Link href="/rankings" className="font-bold text-[#164A3A] hover:underline shrink-0">
              Open Full Rankings Table (1,048 Institutions) →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4. Subject Discipline Directory ─── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-code-badge text-white px-2.5 py-0.5"
                style={{ background: '#164A3A', borderRadius: '12px' }}
              >
                DISCIPLINE BENCHMARKS
              </span>
              <span className="text-xs text-[#838383]">6 Key Subject Leagues</span>
            </div>
            <h2 className="font-headline-md text-[#232323] m-0">
              Explore Rankings by Academic Field
            </h2>
          </div>
          <Link
            href="/subjects"
            className="text-xs font-bold text-[#164A3A] hover:underline flex items-center gap-1"
          >
            <span>View Complete Subject Tables</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              code: 'MED',
              title: 'Clinical Medicine & Health Sciences',
              leader: 'University of Cape Town',
              leaderScore: '96.4',
              papers: '4,850+ Clinical Papers',
              href: '/subjects',
              badgeColor: '#B28A45',
              badgeBg: '#fdf2f8',
            },
            {
              code: 'CSC',
              title: 'Computer Science, AI & Informatics',
              leader: 'University of the Witwatersrand',
              leaderScore: '94.8',
              papers: '3,210+ Computing Papers',
              href: '/subjects',
              badgeColor: '#164A3A',
              badgeBg: '#faf5ff',
            },
            {
              code: 'ENG',
              title: 'Engineering & Industrial Technology',
              leader: 'Cairo University',
              leaderScore: '95.1',
              papers: '4,100+ Applied Tech Studies',
              href: '/subjects',
              badgeColor: '#164A3A',
              badgeBg: '#F7F6F2',
            },
            {
              code: 'BUS',
              title: 'Business, Economics & Finance',
              leader: 'University of Stellenbosch',
              leaderScore: '92.6',
              papers: '2,900+ Economic Reviews',
              href: '/subjects',
              badgeColor: '#24A148',
              badgeBg: '#f0fdf4',
            },
            {
              code: 'LAW',
              title: 'Law, Governance & Public Policy',
              leader: 'University of Cape Town',
              leaderScore: '95.7',
              papers: '1,840+ Legal Jurisprudence',
              href: '/subjects',
              badgeColor: '#B28A45',
              badgeBg: '#fefce8',
            },
            {
              code: 'AGR',
              title: 'Agriculture & Food Security Systems',
              leader: 'University of Nairobi',
              leaderScore: '93.5',
              papers: '2,420+ Agronomy Studies',
              href: '/subjects',
              badgeColor: '#059669',
              badgeBg: '#ecfdf5',
            },
          ].map((subj) => (
            <Link
              key={subj.code}
              href={subj.href}
              className="the-card p-5 flex flex-col justify-between no-underline group border border-[#e9e9e9] hover:border-[#164A3A] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono text-[10px] font-bold px-2 py-0.5"
                    style={{
                      color: subj.badgeColor,
                      background: subj.badgeBg,
                      borderRadius: '8px',
                    }}
                  >
                    {subj.code}
                  </span>
                  <span className="text-[11px] text-[#838383] font-mono">{subj.papers}</span>
                </div>
                <h4 className="font-title-md text-[#232323] group-hover:text-[#164A3A] transition-colors mb-2 leading-snug">
                  {subj.title}
                </h4>
              </div>
              <div className="pt-3 mt-2 border-t border-[#f2f2f2] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#838383] block text-[10px] uppercase tracking-wider">Lead</span>
                  <span className="font-semibold text-[#232323]">{subj.leader}</span>
                </div>
                <span
                  className="font-tabular-num font-bold text-xs px-2 py-0.5"
                  style={{
                    color: subj.badgeColor,
                    background: subj.badgeBg,
                    borderRadius: '10px',
                  }}
                >
                  {subj.leaderScore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 5. Direct Side-by-Side Comparison Feature (THE Gradient Style) ─── */}
      <section
        className="the-card p-6 md:p-8 border border-[#e9e9e9] text-white relative overflow-hidden"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #09090B 0%, #1c1c24 50%, #2e1065 100%)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span
                className="font-code-badge text-white px-2.5 py-0.5"
                style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}
              >
                DECISION ENGINE
              </span>
            </div>
            <h3 className="font-headline-sm text-white m-0 text-2xl font-bold">
              Benchmark Any 2 to 4 African Institutions Head-to-Head
            </h3>
            <p className="text-sm text-white/80 m-0 leading-relaxed">
              Evaluate tuition differentials, student-to-faculty ratios, citation velocity, and regional standing in one unified side-by-side executive dossier.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/compare?u1=uct&u2=wits"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center no-underline transition-colors flex items-center justify-center gap-1.5"
              style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <span>Preview: UCT vs. Wits</span>
              <span>→</span>
            </Link>
            <Link
              href="/compare"
              className="px-6 py-2.5 bg-[#164A3A] hover:bg-[#5825df] text-white font-semibold text-xs text-center no-underline transition-all flex items-center justify-center gap-1.5 shadow-none"
              style={{ borderRadius: '24px' }}
            >
              <span>Launch Compare Matrix</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. Student Life & Verified Campus Videos ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-code-badge text-white px-2.5 py-0.5"
                style={{ background: '#B28A45', borderRadius: '12px' }}
              >
                CAMPUS CULTURE &amp; MEDIA
              </span>
              <span className="text-xs text-[#838383]">Verified Student Stories &amp; Multimedia Tours</span>
            </div>
            <h2 className="font-headline-md text-[#232323] m-0">
              Student Life, Campus Voices &amp; Higher Education Dispatches
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-xs font-bold text-[#B28A45] hover:underline flex items-center gap-1"
          >
            <span>Explore All Media &amp; Tours</span>
            <span>→</span>
          </Link>
        </div>

        {/* Video & Media Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Video / Documentary Card */}
          <div className="the-card lg:col-span-2 p-5 border border-[#e9e9e9] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f2f2]">
                <span
                  className="font-code-badge text-white px-2.5 py-0.5"
                  style={{ background: '#09090B', borderRadius: '12px' }}
                >
                  CAMPUS SPOTLIGHT VIDEO
                </span>
                <span className="text-xs text-[#838383] font-mono">OFFICIAL THE FEATURE</span>
              </div>
              
              <div
                className="aspect-video w-full bg-[#09090B] relative shadow-sm"
                style={{ borderRadius: '12px', overflow: 'hidden' }}
              >
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube-nocookie.com/embed/6mXlvRCKw8M?rel=0"
                  title="UCT Remains Africa's Top-Ranked University"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div>
                <h3 className="font-title-lg text-[#232323] m-0 mb-1">
                  UCT Remains Africa&apos;s Top-Ranked University: Excellence &amp; Continental Leadership
                </h3>
                <p className="font-body-sm text-[#595959] m-0 leading-relaxed">
                  Explore how the University of Cape Town leads global research impact, clinical medicine breakthroughs, and African higher education benchmarking against Devil’s Peak.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#f2f2f2] flex items-center justify-between text-xs text-[#838383]">
              <span>Featured Institution: <strong>University of Cape Town (South Africa)</strong></span>
              <Link href="/universities/uct" className="text-[#164A3A] font-semibold hover:underline">
                View Full Dossier →
              </Link>
            </div>
          </div>

          {/* Secondary Campus Video Spotlights */}
          <div className="space-y-4">
            {/* Spotlight 2: Nairobi */}
            <div className="the-card p-5 border border-[#e9e9e9]">
              <span
                className="font-code-badge text-[#164A3A] bg-[#F7F6F2] px-2 py-0.5 inline-block mb-2"
                style={{ borderRadius: '8px' }}
              >
                EAST AFRICA CAMPUS TOUR
              </span>
              <div
                className="aspect-video w-full bg-[#09090B] mb-2 relative shadow-xs"
                style={{ borderRadius: '10px', overflow: 'hidden' }}
              >
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube-nocookie.com/embed/Y1__igSejp4?rel=0"
                  title="Inside the University of Nairobi Full Campus Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h4 className="font-title-md text-[#232323] mb-1">
                Inside the University of Nairobi: Complete Campus Tour
              </h4>
              <p className="text-xs text-[#595959] m-0 leading-snug">
                Walking tour through UoN Towers, engineering studios, historic academic courtyards, and Kenyan student life in Nairobi.
              </p>
            </div>

            {/* Spotlight 3: Wits University */}
            <div className="the-card p-5 border border-[#e9e9e9]">
              <span
                className="font-code-badge text-[#164A3A] bg-[#faf5ff] px-2 py-0.5 inline-block mb-2"
                style={{ borderRadius: '8px' }}
              >
                SOUTHERN AFRICA FLAGSHIP
              </span>
              <div
                className="aspect-video w-full bg-[#09090B] mb-2 relative shadow-xs"
                style={{ borderRadius: '10px', overflow: 'hidden' }}
              >
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube-nocookie.com/embed/OGhwL5qNkXo?rel=0"
                  title="Wits University Campus Tour World Class"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h4 className="font-title-md text-[#232323] mb-1">
                Wits University: World-Class Architecture &amp; Labs
              </h4>
              <p className="text-xs text-[#595959] m-0 leading-snug">
                Johannesburg&apos;s academic powerhouse featuring deep-level mining labs, the Great Hall, and state-of-the-art libraries.
              </p>
            </div>
          </div>
        </div>

        {/* ─── 6b. African Higher Education Articles & Dispatches ─── */}
        <div className="the-card p-6 sm:p-8 border border-[#e9e9e9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f2f2f2] mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-code-badge text-white px-2.5 py-0.5"
                  style={{ background: '#164A3A', borderRadius: '12px' }}
                >
                  AHEI JOURNAL &amp; ESSAYS
                </span>
                <span className="text-xs text-[#838383]">Peer-Reviewed Analysis &amp; Guides</span>
              </div>
              <h3 className="font-title-lg text-[#232323] m-0 text-xl font-bold">
                In-Depth Higher Education Features &amp; Student Insights
              </h3>
            </div>
            <Link href="/articles" className="text-xs font-bold text-[#164A3A] hover:underline flex items-center gap-1">
              <span>Browse All Articles &amp; Guides</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ARTICLES_DATA.slice(0, 4).map((art) => (
              <article
                key={art.slug}
                className="the-card p-5 border border-[#e9e9e9] flex flex-col justify-between hover:border-[#164A3A] transition-all group"
              >
                <div>
                  <span
                    className="font-mono text-[10px] font-bold text-[#164A3A] bg-[#faf5ff] px-2 py-0.5 inline-block uppercase mb-2.5"
                    style={{ borderRadius: '8px' }}
                  >
                    {art.category}
                  </span>
                  <Link href={`/articles/${art.slug}`} className="block no-underline">
                    <h4 className="font-title-md text-[#232323] group-hover:text-[#164A3A] transition-colors mb-2 leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#595959] leading-relaxed mb-4 line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#f2f2f2] text-[11px] text-[#838383]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={art.author.avatar}
                      alt={art.author.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-medium text-[#232323] truncate">{art.author.name}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span>{art.readTime}</span>
                    <Link href={`/articles/${art.slug}`} className="text-[#164A3A] font-bold hover:underline">
                      Read Guide →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Regional Macro-Networks Strip (THE Rounded Cards Grid) ─── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-code-badge text-white px-2.5 py-0.5"
                style={{ background: '#24A148', borderRadius: '12px' }}
              >
                GEOGRAPHICAL CORRIDORS
              </span>
              <span className="text-xs text-[#838383]">5 Continental Macro-Networks</span>
            </div>
            <h2 className="font-headline-md text-[#232323] m-0">
              Explore Africa by Regional Corridor
            </h2>
          </div>
          <Link href="/explore" className="text-xs font-bold text-[#24A148] hover:underline flex items-center gap-1">
            <span>View All Regional Breakdowns</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MACRO_REGIONS.map((region) => (
            <Link
              key={region.id}
              href={`/explore/${region.id}`}
              className="the-card p-4 flex flex-col justify-between no-underline group border border-[#e9e9e9] hover:border-[#24A148] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#838383] uppercase">
                    {region.nationsCount} Nations
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold text-[#24A148] bg-[#f0fdf4] px-1.5 py-0.5"
                    style={{ borderRadius: '6px' }}
                  >
                    Score {region.medianScore.toFixed(0)}
                  </span>
                </div>
                <h4 className="font-title-md text-[#232323] group-hover:text-[#24A148] transition-colors mb-1 font-bold">
                  {region.name}
                </h4>
                <p className="text-[11px] text-[#838383] m-0 line-clamp-1">
                  Lead: {region.topInstitution}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-semibold text-[#24A148]">
                <span>Explore Region</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 8. Institutional Governance & Data Auditing Notice ─── */}
      <footer className="the-card p-6 border border-[#e9e9e9] bg-white text-xs text-[#838383] space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="font-code-badge text-white px-2.5 py-0.5"
            style={{ background: '#09090B', borderRadius: '12px' }}
          >
            DATA GOVERNANCE
          </span>
          <span className="font-bold text-[#232323]">Provenance &amp; Institutional Verification Notice</span>
          <span className="text-[#d5d5d5]">·</span>
          <span>AHEI Research Council 2027</span>
        </div>
        <p className="m-0 leading-relaxed max-w-4xl text-[#595959]">
          The African Higher Education Index scores are computed using verified primary institutional submissions, national education ministries gazettes, global citation databases, and employer reputational audits. Institutional data corrections and re-evaluations are administered via the <Link href="/admin" className="text-[#164A3A] font-semibold hover:underline">Institutional Verification Desk</Link>.
        </p>
      </footer>
    </div>
  );
}
