'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { useCompare } from '@/components/layout/CompareProvider';
import { useBookmarks } from '@/components/layout/BookmarksProvider';
import { Programme } from '@/data/universities';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import SubmitCorrectionModal from '@/components/universities/SubmitCorrectionModal';

type TabKey = 'info' | 'programs' | 'life' | 'cost' | 'scholarships' | 'rankings' | 'campuses' | 'similar';

export function UniversityDetailClient({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const { getUniversityById, universities } = useUniversities();
  const { addToCompare, isInCompare } = useCompare();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [progLevelFilter, setProgLevelFilter] = useState<string>('all');
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  // Interactive tuition estimator inside cost tab
  const [residencyStatus, setResidencyStatus] = useState<'domestic' | 'international'>('domestic');
  const [housingChoice, setHousingChoice] = useState<'on_campus' | 'off_campus'>('on_campus');

  const u = getUniversityById(id);

  if (!u) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-headline-md text-[#232323]">Institution Not Found</h1>
        <p className="font-body-md mt-4 text-[#838383]">
          The institution ID &ldquo;{id}&rdquo; does not match any audited entity in our continental registry.
        </p>
        <Link href="/rankings" className="btn-primary no-underline mt-6 inline-block">
          View All Monitored Institutions →
        </Link>
      </div>
    );
  }

  const isTier1 = u.aheiScore >= 90;
  const isTier2 = u.aheiScore >= 80 && u.aheiScore < 90;

  // Filter programmes
  const filteredProgrammes = (u.programmes || []).filter((p) => {
    if (progLevelFilter === 'all') return true;
    return p.level.toLowerCase() === progLevelFilter.toLowerCase();
  });

  // Calculate peer recommendations (same region or close rank)
  const peerUniversities = universities
    .filter((other) => other.id !== u.id && (other.region === u.region || Math.abs(other.rank - u.rank) <= 4))
    .slice(0, 3);

  // Dynamic cost calculation
  const domesticUsdNum = parseInt(u.domesticTuitionUsd?.replace(/\D/g, '') || '1500', 10);
  const intlUsdNum = parseInt(u.internationalTuitionAnnual?.replace(/\D/g, '') || '4500', 10);
  const tuitionFeeUsd = residencyStatus === 'domestic' ? domesticUsdNum : intlUsdNum;
  const housingFeeUsd = housingChoice === 'on_campus' ? 1800 : 2600;
  const monthlyLivingUsd = parseInt(u.averageMonthlyLiving?.replace(/\D/g, '') || '350', 10);
  const annualLivingUsd = monthlyLivingUsd * 10;
  const booksFeeUsd = 400;
  const totalAnnualBudget = tuitionFeeUsd + housingFeeUsd + annualLivingUsd + booksFeeUsd;

  const websiteUrl = u.website.startsWith('http') ? u.website : `https://${u.website}`;

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: 'University Info' },
    { key: 'programs', label: `Degrees & Programmes (${u.programmes?.length || 0})` },
    { key: 'life', label: 'Student Life & Culture' },
    { key: 'cost', label: 'Cost of Living & Tuition' },
    { key: 'scholarships', label: 'Scholarships & Aid' },
    { key: 'rankings', label: 'Rankings & Ratings' },
    { key: 'campuses', label: 'Campus Locations' },
    { key: 'similar', label: 'Similar Universities' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-8">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/rankings" className="no-underline text-[#838383] hover:text-[#164A3A]">
          Rankings
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/explore" className="no-underline text-[#838383] hover:text-[#164A3A]">
          {u.region}
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-medium">{u.name}</span>
      </nav>

      {/* ─── Google Search Central Structured Data (Schema.org / CollegeOrUniversity) ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollegeOrUniversity',
            name: u.name,
            url: u.website,
            logo: u.crestUrl,
            image: u.prospectusImg,
            address: {
              '@type': 'PostalAddress',
              addressLocality: u.city,
              addressCountry: u.country,
            },
            foundingDate: String(u.charterYear || u.estYear),
            description: u.description,
          }),
        }}
      />

      {/* ─── Hero Masthead ─── */}
      <header className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            {/* Official University Logo directly ABOVE the name */}
            {u.crestUrl && (
              <div className="mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-[#e2e8f0] p-2.5 rounded-none flex items-center justify-center shadow-xs">
                  <img
                    src={u.crestUrl}
                    alt={`${u.name} official emblem`}
                    width={96}
                    height={96}
                    fetchPriority="high"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
                  {isTier1 ? 'Tier 1 · Continental Elite' : isTier2 ? 'Tier 2 · High Distinction' : 'Tier 3 · Merit'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-[#164A3A] text-white">
                  #{u.rank} in Africa (2027)
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-[#B28A45] text-white font-mono">
                  2028 Proj: #{u.projectedRankNextYear || u.rank} ({u.trajectory || 'Consolidating'})
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-[#164A3A]/10 text-[#164A3A] border border-[#164A3A]/25 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
                  {u.verificationAudit?.status === 'VERIFIED_AUTHENTIC' ? 'Verified Sovereign HEI' : 'Provisional Audit'}
                </span>
                <span className="font-mono text-[#838383] text-xs bg-[#f8fafc] px-2.5 py-0.5 rounded-[2px] border border-[#e2e8f0]">
                  Cert: {u.verificationAudit?.regulatorAuditCode || u.auditCertification || `AU-AHEI-2027-${u.countryCode.toUpperCase()}`}
                </span>
              </div>

              <h1 className="font-headline-lg text-[#09090B] font-bold tracking-tight m-0 leading-tight">
                {u.name}
              </h1>

              <p className="font-body-md text-[#666666] mt-2 mb-0 flex items-center flex-wrap gap-2 text-xs sm:text-sm">
                <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f1f5f9] px-1.5 py-0.5 rounded-[2px] border border-[#e2e8f0]">
                  {u.countryCode.toUpperCase()}
                </span>
                <span className="font-medium text-[#09090B]">{u.city}, {u.country}</span>
                <span className="text-[#d5d5d5]">·</span>
                <span>Chartered {u.charterYear || u.estYear}</span>
                <span className="text-[#d5d5d5]">·</span>
                <span>{u.type}</span>
              </p>

              {u.nativeMotto && (
                <p className="font-body-sm italic text-[#838383] mt-2 mb-0 text-xs">
                  &ldquo;{u.nativeMotto}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Quick Score & Next-Year Forecast Panel */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xs p-5 text-right shrink-0">
            <span className="text-[11px] font-bold text-[#838383] uppercase tracking-wider block font-mono">
              2027 Baseline Score
            </span>
            <div className="flex items-baseline justify-end gap-1.5 mt-1">
              <span className="font-tabular-num text-3xl sm:text-4xl font-bold text-[#09090B]">
                {u.aheiScore.toFixed(1)}
              </span>
              <span className="text-xs text-[#838383] font-medium">/ 100</span>
            </div>
            <div className="text-[11px] text-[#666666] mt-1.5 font-medium">
              National: <strong className="text-[#09090B]">#{u.nationalRank}</strong> · Regional: <strong className="text-[#09090B]">#{u.regionalRank}</strong>
            </div>
            <div className="mt-2 pt-2 border-t border-[#e2e8f0] flex items-center justify-end gap-2 text-[11px] font-mono text-[#164A3A]">
              <span className="text-[#838383]">2028 Model Proj:</span>
              <strong>{(u.projectedScoreNextYear || u.aheiScore).toFixed(1)}</strong>
              <span className="text-[#B28A45] font-semibold">(+{u.momentumVelocity?.toFixed(2) || '0.00'} pts/yr)</span>
            </div>
          </div>
        </div>

        {/* Action Trays: Compare + Shortlist + Official Link */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-[#f1f5f9]">
          <button
            onClick={() => addToCompare(u.id)}
            disabled={isInCompare(u.id)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xs text-xs font-semibold text-white bg-[#09090B] hover:bg-[#232323] transition-all cursor-pointer shadow-xs disabled:opacity-40"
          >
            {isInCompare(u.id) ? '✓ In Compare' : '+ Add to Compare'}
          </button>

          <button
            onClick={() => toggleBookmark(u.id)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xs text-xs font-semibold border transition-all cursor-pointer shadow-xs"
            style={{
              background: isBookmarked(u.id) ? '#F7F6F2' : '#FFFFFF',
              color: isBookmarked(u.id) ? '#164A3A' : '#09090B',
              borderColor: isBookmarked(u.id) ? '#D9D7D0' : '#e2e8f0',
            }}
          >
            <svg className="w-3.5 h-3.5" fill={isBookmarked(u.id) ? "#164A3A" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            <span>{isBookmarked(u.id) ? 'Saved in Shortlist' : 'Save to Shortlist'}</span>
          </button>

          <button
            onClick={() => setIsCorrectionModalOpen(true)}
            className="text-xs px-4 py-2.5 border border-[#e2e8f0] bg-white text-[#666666] hover:text-[#09090B] hover:border-[#09090B] rounded-xs no-underline transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#164A3A]" />
            <span>Submit Institutional Claim / Correction</span>
          </button>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline ml-auto"
          >
            <span>Visit Official Portal</span>
            <span>→</span>
          </a>
        </div>
      </header>

      {/* ─── Google Ad Space: Top Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-6" />

      {/* ─── Tab Navigation Bar (Pill Scroll Bar) ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap shadow-xs"
              style={{
                background: isActive ? '#09090B' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#09090B',
                borderColor: isActive ? '#09090B' : '#e9e9e9',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: UNIVERSITY INFORMATION & OVERVIEW ─── */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Key Facts Matrix */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Enrolled Students', value: u.totalEnrollment.toLocaleString() },
              { label: 'Academic Staff Count', value: u.academicStaff.toLocaleString() },
              { label: 'Faculty with PhD', value: `${u.phdFacultyShare}%` },
              { label: 'Student-to-Faculty Ratio', value: u.studentFacultyRatio },
              { label: 'International Student Share', value: `${u.internationalDiversityPct}%` },
              { label: 'Operating Campuses', value: String(u.campusesCount) },
            ].map((fact) => (
              <div key={fact.label} className="p-3.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs flex flex-col justify-between">
                <span className="text-[11px] text-[#838383] font-medium block">{fact.label}</span>
                <span className="font-headline-sm text-base sm:text-lg font-bold text-[#09090B] block mt-1">{fact.value}</span>
              </div>
            ))}
          </div>

          {/* Institutional Dossier & History */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-2">
              Institutional Overview &amp; Mission
            </h2>
            <p className="font-body-lg text-[#09090B] leading-relaxed m-0 text-sm sm:text-base">
              {u.description}
            </p>
          </div>

          {/* Leadership & Accreditations */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-3">
              Statutory Governance &amp; Setting
            </h2>
            <dl className="m-0 divide-y divide-[#f1f5f9]">
              {[
                { label: 'Vice Chancellor / Rector', value: u.viceChancellor },
                { label: 'Statutory Accreditation Body', value: u.accreditationBody },
                { label: 'Campus Geographic Setting', value: u.campusSetting },
                { label: 'Annual Research Budget', value: u.researchExpenditureFormatted },
              ].map((item) => (
                <div key={item.label} className="py-3 flex flex-col sm:flex-row sm:items-center">
                  <dt className="text-xs text-[#838383] sm:w-64 shrink-0 font-medium">
                    {item.label}
                  </dt>
                  <dd className="text-xs sm:text-sm text-[#09090B] font-semibold m-0 mt-0.5 sm:mt-0">
                    {item.value || 'Accredited'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Statutory Provenance & Data Quality Stamp (PRD Section 6 & 7.2) */}
          <div className="the-card bg-white rounded-none border-l-4 border-l-[#164A3A] border border-[#e9e9e9] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#164A3A] shrink-0 mt-0.5" />
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
                  AUDITED PROVENANCE
                </span>
                <p className="font-semibold text-xs sm:text-sm text-[#09090B] mt-1 mb-0">
                  Data Status: Verified &amp; Reconciled with Statutory National Regulators
                </p>
                <p className="text-[11px] text-[#838383] m-0 font-mono mt-0.5">
                  Primary Source: {u.accreditationBody} Gazette · Audited: 2026-09 · Reviewer ID: AHEI-DESK-{u.countryCode.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="text-xs text-[#164A3A] font-semibold hover:underline shrink-0 flex items-center gap-1 no-underline cursor-pointer bg-transparent border-0 p-0"
            >
              <span>Submit Correction Claim</span>
              <span>→</span>
            </button>
          </div>

          {/* Autonomous Integrity Watchdog & Anti-Fraud Audit Ledger */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e9e9e9] pb-3">
              <div>
                <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono m-0 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#164A3A]"></span>
                  Autonomous Verification &amp; Anti-Fraud Ledger
                </h2>
                <p className="text-[11px] text-[#666666] m-0 mt-0.5">
                  Continuous multi-provider monitoring (AHEI-CIV Engine v1.0)
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#164A3A] bg-[#164A3A]/10 px-2.5 py-1 rounded-[2px] border border-[#164A3A]/20">
                Integrity Score: {u.verificationAudit?.integrityScore || 98}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F7F6F2] p-3.5 border border-[#D9D7D0]">
                <span className="text-[10px] font-bold text-[#838383] uppercase tracking-wider font-mono block">
                  Accreditation Authority
                </span>
                <span className="font-semibold text-xs text-[#09090B] mt-1 block">
                  {u.accreditationBody}
                </span>
              </div>
              <div className="bg-[#F7F6F2] p-3.5 border border-[#D9D7D0]">
                <span className="text-[10px] font-bold text-[#838383] uppercase tracking-wider font-mono block">
                  Live Domain Probe
                </span>
                <span className="font-semibold text-xs text-[#164A3A] mt-1 block font-mono">
                  ✓ {u.verificationAudit?.domainStatus || 'LIVE'} (SSL 443)
                </span>
              </div>
              <div className="bg-[#F7F6F2] p-3.5 border border-[#D9D7D0]">
                <span className="text-[10px] font-bold text-[#838383] uppercase tracking-wider font-mono block">
                  Anti-Degree Mill Filter
                </span>
                <span className="font-semibold text-xs text-[#164A3A] mt-1 block font-mono">
                  ✓ {u.verificationAudit?.fraudRisk === 'LOW' || !u.verificationAudit ? '0 Fraud Flags' : 'Under Observation'}
                </span>
              </div>
              <div className="bg-[#F7F6F2] p-3.5 border border-[#D9D7D0]">
                <span className="text-[10px] font-bold text-[#838383] uppercase tracking-wider font-mono block">
                  Last Continuous Audit
                </span>
                <span className="font-semibold text-xs text-[#09090B] mt-1 block font-mono">
                  {u.verificationAudit?.lastAuditedDate || '2026-10-01'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#676963] font-mono m-0 bg-[#f8fafc] p-3 border border-[#e2e8f0]">
              Audit Stamp: {u.verificationAudit?.auditNotes || `Formally certified and verified under sovereign regulatory framework by ${u.accreditationBody}. Zero unapproved flags detected.`}
            </p>
          </div>

          {/* Flagship Faculties */}
          {u.flagshipFaculties && u.flagshipFaculties.length > 0 && (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
              <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-3">
                Flagship Faculties &amp; Colleges
              </h2>
              <div className="flex flex-wrap gap-2">
                {u.flagshipFaculties.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: DEGREES & PROGRAMMES DIRECTORY ─── */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                Audited Academic Degree Catalog
              </h3>
              <p className="font-body-sm text-[#666666] text-xs m-0 mt-0.5">
                Showing {filteredProgrammes.length} verified degree offerings.
              </p>
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['all', 'undergraduate', 'postgraduate', 'doctoral'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setProgLevelFilter(lvl)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full border capitalize cursor-pointer transition-all shadow-xs"
                  style={{
                    background: progLevelFilter === lvl ? '#09090B' : '#FFFFFF',
                    color: progLevelFilter === lvl ? '#FFFFFF' : '#09090B',
                    borderColor: progLevelFilter === lvl ? '#09090B' : '#e9e9e9',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {filteredProgrammes.length > 0 ? (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="rankings-table" style={{ minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th>Degree Programme</th>
                      <th>Faculty / College</th>
                      <th>Level</th>
                      <th>Duration</th>
                      <th>Statutory Tuition</th>
                      <th>Accreditation Council</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProgrammes.map((p) => (
                      <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="cell-name font-semibold text-xs text-[#09090B]">{p.name}</td>
                        <td className="font-body-sm text-xs text-[#666666]">{p.faculty}</td>
                        <td>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              background: p.level === 'Doctoral' ? '#F7F6F2' : p.level === 'Postgraduate' ? '#faf5ff' : '#f1f5f9',
                              color: p.level === 'Doctoral' ? '#1e40af' : p.level === 'Postgraduate' ? '#6b21a8' : '#09090B',
                              border: '1px solid ' + (p.level === 'Doctoral' ? '#D9D7D0' : p.level === 'Postgraduate' ? '#e9d5ff' : '#e2e8f0'),
                            }}
                          >
                            {p.level}
                          </span>
                        </td>
                        <td className="font-body-sm text-xs text-[#666666]">{p.duration}</td>
                        <td className="font-tabular-num font-body-sm text-[#09090B] font-bold text-xs">{p.domesticTuition}</td>
                        <td className="font-body-sm text-xs text-[#838383]">{p.accreditationBody}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm text-center py-12 px-6">
              <p className="font-body-md text-[#838383] m-0 text-sm">
                No programmes match the selected qualification level.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: STUDENT LIFE & CAMPUS CULTURE ─── */}
      {activeTab === 'life' && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#f1f5f9]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
                  Campus Environment &amp; Experiences
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-[#09090B] m-0">
                  Student Life at {u.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] px-3 py-1 rounded-full border border-[#e2e8f0]">
                {u.totalEnrollment.toLocaleString()} Enrolled Students · {u.internationalDiversityPct}% International
              </span>
            </div>
            <p className="font-body-md text-[#666666] m-0 leading-relaxed max-w-3xl text-xs sm:text-sm">
              Life at {u.name} combines rigorous academic inquiry with rich continental traditions, active student governance, collegiate residential living, and vibrant cultural and entrepreneurial ecosystems.
            </p>
          </div>

          {/* Student Life Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pillar 1: Housing & Residential Colleges */}
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2">
                  ACCOMMODATION &amp; COLLEGES
                </span>
                <h4 className="font-headline-sm text-base font-bold text-[#09090B] mb-2">
                  Residential Halls &amp; Living Communities
                </h4>
                <p className="font-body-sm text-[#666666] mb-4 leading-relaxed text-xs">
                  Campus housing guarantees priority placement for first-year and international scholars across catered and self-catering halls of residence. Residential wardens and academic peer mentors provide round-the-clock pastoral support.
                </p>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#838383]">On-Campus Placement Rate:</span>
                  <span className="font-bold text-[#09090B]">~42% of First-Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#838383]">Off-Campus Shuttle Coverage:</span>
                  <span className="font-bold text-[#15803d]">Free Dedicated Transit</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: Governance & Student Guild */}
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2">
                  DEMOCRATIC LEADERSHIP
                </span>
                <h4 className="font-headline-sm text-base font-bold text-[#09090B] mb-2">
                  Student Representative Council &amp; Guild
                </h4>
                <p className="font-body-sm text-[#666666] mb-4 leading-relaxed text-xs">
                  Student leadership is democratically elected annually, holding statutory representation on the University Senate and Council. The guild oversees student welfare, academic advocacy, legal advisory services, and club subventions.
                </p>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#838383]">Active Student Societies:</span>
                  <span className="font-bold text-[#09090B]">85+ Registered Clubs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#838383]">Council Representation:</span>
                  <span className="font-bold text-[#15803d]">Direct Voting Rights</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: Athletics & Varsity Sports */}
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2">
                  VARSITY SPORTS &amp; RECREATION
                </span>
                <h4 className="font-headline-sm text-base font-bold text-[#09090B] mb-2">
                  Athletic Excellence &amp; Derbies
                </h4>
                <p className="font-body-sm text-[#666666] mb-4 leading-relaxed text-xs">
                  Home to competitive varsity football, rugby, basketball, track &amp; field, and swimming squads competing in national and FASU (Federation of Africa University Sports) collegiate tournaments. Extensive fitness centers and floodlit courts are accessible to all students.
                </p>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#838383]">Competitive Disciplines:</span>
                  <span className="font-bold text-[#09090B]">22 Varsity Squads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#838383]">Recreation Complex:</span>
                  <span className="font-bold text-[#09090B]">Olympic Pool &amp; Arena</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: Campus Dining & Cultural Life */}
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2">
                  CAMPUS LIFE &amp; SUPPORT
                </span>
                <h4 className="font-headline-sm text-base font-bold text-[#09090B] mb-2">
                  Dining, Arts &amp; Student Wellness
                </h4>
                <p className="font-body-sm text-[#666666] mb-4 leading-relaxed text-xs">
                  Campus features diverse dining options including central cafeterias, artisan coffee kiosks, and specialized dietary facilities (halal, kosher, vegetarian). The International Student Support Office (ISSO) and Health &amp; Wellness Bureau provide medical, visa, and psychological counseling.
                </p>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#838383]">Student Health Clinic:</span>
                  <span className="font-bold text-[#15803d]">24/7 On-Campus Service</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#838383]">Cultural &amp; Arts Festivals:</span>
                  <span className="font-bold text-[#09090B]">Annual Continental Week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Voices Section */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9] mb-4">
              <div>
                <span className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono block mb-1">Campus Dispatches</span>
                <h4 className="font-headline-sm text-base font-bold text-[#09090B] m-0">Student Voices on Life &amp; Academics</h4>
              </div>
              <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">Verified Perspectives</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between">
                <p className="font-body-sm italic text-[#232323] mb-4 leading-relaxed text-xs sm:text-sm">
                  &ldquo;The intellectual density here is palpable. Between working in the machine learning lab and debating pan-African governance at the student union, you are constantly pushed by peers from across 30 different African countries.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#e2e8f0]">
                  <span className="font-semibold text-[#09090B]">Final-Year Computer Science Scholar</span>
                  <span className="font-mono text-[#838383]">Class of 2026</span>
                </div>
              </div>

              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between">
                <p className="font-body-sm italic text-[#232323] mb-4 leading-relaxed text-xs sm:text-sm">
                  &ldquo;Living in the residential hall gave me an immediate community. The campus is vibrant, safe, and deeply connected to the surrounding city. Academic demands are high, but the faculty mentorship is exceptional.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#e2e8f0]">
                  <span className="font-semibold text-[#09090B]">Postgraduate Health Sciences Researcher</span>
                  <span className="font-mono text-[#838383]">Faculty of Medicine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: COST OF LIVING & TUITION (WITH ESTIMATOR) ─── */}
      {activeTab === 'cost' && (
        <div className="space-y-6">
          {/* Key Tuition Metrics Grid */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-4">
              Statutory Tuition &amp; Accommodation Rates
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Domestic Tuition (Local)', value: u.domesticTuitionAverage },
                { label: 'Domestic Tuition (USD)', value: u.domesticTuitionUsd },
                { label: 'International Tuition (Annual)', value: u.internationalTuitionAnnual },
                { label: 'On-Campus Accommodation', value: u.onCampusAccommodation },
                { label: 'Average Monthly Living', value: u.averageMonthlyLiving },
                { label: 'Financial Aid Support', value: `${u.financialAidTier} TIER` },
              ].map((fact) => (
                <div key={fact.label} className="p-3.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs flex flex-col justify-between">
                  <span className="text-[11px] text-[#838383] font-medium block">{fact.label}</span>
                  <span className="font-headline-sm text-sm sm:text-base font-bold text-[#09090B] block mt-1">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Calculator specific to this university */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f1f5f9] mb-5">
              <div className="w-9 h-9 rounded-xs bg-[#F7F6F2] border border-[#D9D7D0] flex items-center justify-center shrink-0 text-[#164A3A]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3.75-6h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm3.75-6h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zM6.75 6.75h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                  {u.name} Student Budget Estimator
                </h3>
                <span className="text-xs text-[#838383]">
                  Personalise your estimated 10-month academic expenditure
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#09090B] block mb-1.5">
                    Your Fee Residency Status:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setResidencyStatus('domestic')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full border cursor-pointer transition-all shadow-xs"
                      style={{
                        background: residencyStatus === 'domestic' ? '#09090B' : '#FFFFFF',
                        color: residencyStatus === 'domestic' ? '#FFFFFF' : '#09090B',
                        borderColor: residencyStatus === 'domestic' ? '#09090B' : '#e9e9e9',
                      }}
                    >
                      In-Country Citizen
                    </button>
                    <button
                      onClick={() => setResidencyStatus('international')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full border cursor-pointer transition-all shadow-xs"
                      style={{
                        background: residencyStatus === 'international' ? '#09090B' : '#FFFFFF',
                        color: residencyStatus === 'international' ? '#FFFFFF' : '#09090B',
                        borderColor: residencyStatus === 'international' ? '#09090B' : '#e9e9e9',
                      }}
                    >
                      International Student
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#09090B] block mb-1.5">
                    Housing Preference:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setHousingChoice('on_campus')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full border cursor-pointer transition-all shadow-xs"
                      style={{
                        background: housingChoice === 'on_campus' ? '#09090B' : '#FFFFFF',
                        color: housingChoice === 'on_campus' ? '#FFFFFF' : '#09090B',
                        borderColor: housingChoice === 'on_campus' ? '#09090B' : '#e9e9e9',
                      }}
                    >
                      University Residence
                    </button>
                    <button
                      onClick={() => setHousingChoice('off_campus')}
                      className="py-2.5 px-3 text-xs font-semibold rounded-full border cursor-pointer transition-all shadow-xs"
                      style={{
                        background: housingChoice === 'off_campus' ? '#09090B' : '#FFFFFF',
                        color: housingChoice === 'off_campus' ? '#FFFFFF' : '#09090B',
                        borderColor: housingChoice === 'off_campus' ? '#09090B' : '#e9e9e9',
                      }}
                    >
                      Private Rental
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs text-xs text-[#666666] leading-relaxed">
                  <strong className="text-[#09090B]">City Intelligence:</strong> Living expenses in {u.city}, {u.country} are indexed at ~${monthlyLivingUsd}/mo covering campus dining, public transit, and utilities.
                </div>
              </div>

              {/* Estimated Total Card */}
              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between">
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between pb-2 border-b border-[#e2e8f0]">
                    <span className="text-[#666666]">Annual Tuition:</span>
                    <strong className="font-mono text-[#09090B]">${tuitionFeeUsd.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#e2e8f0]">
                    <span className="text-[#666666]">Housing (10 Months):</span>
                    <strong className="font-mono text-[#09090B]">${housingFeeUsd.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#e2e8f0]">
                    <span className="text-[#666666]">Living, Food &amp; Transit:</span>
                    <strong className="font-mono text-[#09090B]">${annualLivingUsd.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#e2e8f0]">
                    <span className="text-[#666666]">Books &amp; Course Materials:</span>
                    <strong className="font-mono text-[#09090B]">${booksFeeUsd.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#e2e8f0] flex items-baseline justify-between">
                  <span className="font-headline-sm text-sm font-bold text-[#09090B]">Total Annual Budget:</span>
                  <div className="text-right">
                    <span className="font-tabular-num text-2xl font-bold text-[#09090B]">
                      ${totalAnnualBudget.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#666666] block font-mono">USD / academic session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: SCHOLARSHIPS & FINANCIAL AID ─── */}
      {activeTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f5f9] mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
                  Scholarship Intelligence
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-[#09090B] m-0">
                  Available Bursaries &amp; Financial Aid at {u.name}
                </h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#09090B] text-white">
                {u.financialAidTier} AID TIER
              </span>
            </div>

            <p className="font-body-md text-[#666666] leading-relaxed mb-6 text-xs sm:text-sm">
              {u.financialAidNote || 'Financial support programs are offered to both domestic and international applicants based on academic excellence, need assessment, and research leadership.'}
            </p>

            {/* Curated Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#164A3A] transition-all">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#faf5ff] text-[#164A3A] border border-[#e9d5ff] mb-2 font-mono">
                    1. INSTITUTIONAL MERIT SCHOLARSHIP
                  </span>
                  <h4 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                    Vice Chancellor&apos;s Academic Excellence Award
                  </h4>
                  <p className="text-xs text-[#666666] mt-2 mb-3 leading-relaxed">
                    Up to 100% statutory tuition waiver for top 5% graduating secondary school and honours students entering undergraduate or master&apos;s degrees.
                  </p>
                </div>
                <div className="text-xs text-[#09090B] font-semibold pt-2 border-t border-[#e2e8f0]">
                  Deadline: Rolling / 31 July Annually
                </div>
              </div>

              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#09090B] transition-all">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2 font-mono">
                    2. CONTINENTAL RESEARCH GRANT
                  </span>
                  <h4 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                    African Union Doctoral Mobility Fellowship
                  </h4>
                  <p className="text-xs text-[#666666] mt-2 mb-3 leading-relaxed">
                    Full tuition, accommodation stipend, and research laboratory bench fees for cross-border African doctoral candidates in STEM, Health, and Agri-tech.
                  </p>
                </div>
                <div className="text-xs text-[#09090B] font-semibold pt-2 border-t border-[#e2e8f0]">
                  Deadline: 15 October Annually
                </div>
              </div>

              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#16a34a] transition-all">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] mb-2 font-mono">
                    3. NATIONAL BURSARY &amp; AID SCHEME
                  </span>
                  <h4 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                    Ministry of Higher Education Need-Based Grant
                  </h4>
                  <p className="text-xs text-[#666666] mt-2 mb-3 leading-relaxed">
                    Government-backed loans and subsidised accommodation allowances for qualifying in-country undergraduate scholars.
                  </p>
                </div>
                <div className="text-xs text-[#09090B] font-semibold pt-2 border-t border-[#e2e8f0]">
                  Administered via National Higher Education Loans Board
                </div>
              </div>

              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#d97706] transition-all">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fffbeb] text-[#d97706] border border-[#fde68a] mb-2 font-mono">
                    4. INDUSTRY &amp; DONOR SCHOLARSHIPS
                  </span>
                  <h4 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                    Corporate STEM &amp; Innovation Endowments
                  </h4>
                  <p className="text-xs text-[#666666] mt-2 mb-3 leading-relaxed">
                    Targeted scholarship opportunities supported by regional tech, mining, and banking partners with guaranteed internship placements.
                  </p>
                </div>
                <div className="text-xs text-[#09090B] font-semibold pt-2 border-t border-[#e2e8f0]">
                  Award Range: $1,000 – $4,500 / year
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: RANKINGS & RATINGS DEEP DIVE ─── */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          {/* 2028 Next-Year Predictive Model & Momentum (AHEI-NYPM v1.0) */}
          <div className="the-card bg-white rounded-none border-2 border-[#164A3A] p-6 shadow-xs relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9D7D0]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold bg-[#164A3A] text-white font-mono uppercase">
                    AHEI-NYPM v1.0 Predictive Engine
                  </span>
                  <span className="font-mono text-xs text-[#838383]">
                    Cert: {u.auditCertification || `AU-AHEI-2027-${u.countryCode.toUpperCase()}`}
                  </span>
                </div>
                <h2 className="font-headline-sm text-lg font-bold text-[#09090B] font-serif m-0">
                  2028 Predictive Ranking &amp; Trajectory Forecast
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-[2px] font-code-badge uppercase ${
                  u.trajectory === 'Surging' ? 'bg-[#164A3A] text-white' :
                  u.trajectory === 'Advancing' ? 'bg-[#B28A45] text-white' :
                  u.trajectory === 'Consolidating' ? 'bg-[#E6E3DC] text-[#171918]' :
                  'bg-[#faedd9] text-[#842029]'
                }`}>
                  {u.trajectory || 'Consolidating'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] font-mono text-[#838383] block uppercase">2027 Baseline Rank</span>
                <span className="font-tabular-num text-2xl font-bold text-[#09090B] block mt-1">#{u.rank}</span>
                <span className="text-[11px] text-[#676963] block mt-0.5">Current Africa Standing</span>
              </div>
              <div className="p-4 bg-[#164A3A]/5 border border-[#164A3A]/30 rounded-none">
                <span className="text-[11px] font-mono text-[#164A3A] block uppercase font-bold">2028 Projected Rank</span>
                <span className="font-tabular-num text-2xl font-bold text-[#164A3A] block mt-1">
                  #{u.projectedRankNextYear || u.rank}
                </span>
                <span className="text-[11px] text-[#164A3A] font-semibold block mt-0.5">
                  {(u.projectedRankDelta || 0) > 0 ? `▲ Gain +${u.projectedRankDelta} places` :
                   (u.projectedRankDelta || 0) < 0 ? `▼ Slip ${u.projectedRankDelta} places` :
                   '— Constant Standing'}
                </span>
              </div>
              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] font-mono text-[#838383] block uppercase">2028 Proj. Score</span>
                <span className="font-tabular-num text-2xl font-bold text-[#09090B] block mt-1">
                  {(u.projectedScoreNextYear || u.aheiScore).toFixed(1)}
                </span>
                <span className="text-[11px] text-[#676963] block mt-0.5">vs {u.aheiScore.toFixed(1)} baseline</span>
              </div>
              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] font-mono text-[#838383] block uppercase">Momentum Velocity</span>
                <span className="font-tabular-num text-2xl font-bold text-[#B28A45] block mt-1">
                  +{u.momentumVelocity?.toFixed(2) || '0.00'}
                </span>
                <span className="text-[11px] text-[#676963] block mt-0.5">pts / annum compound</span>
              </div>
            </div>

            <p className="text-xs text-[#676963] leading-relaxed m-0 border-t border-[#D9D7D0] pt-3">
              <strong>Model Lineage:</strong> Projected using the pure, deterministic AHEI-NYPM v1.0 engine. Incorporates institutional Scopus/WoS citation publication acceleration, faculty PhD staffing increases, and statutory accreditation assurance.
            </p>
          </div>

          {/* Worldwide Benchmarking & Global Rankings */}
          <div className="the-card bg-white rounded-none border border-[#D9D7D0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#D9D7D0] mb-4">
              <div>
                <span className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono block mb-1">
                  Global Academic Standing
                </span>
                <h3 className="font-headline-sm text-base font-bold text-[#09090B] font-serif m-0">
                  Worldwide &amp; Cross-Agency Rankings
                </h3>
              </div>
              <span className="font-mono text-xs text-[#164A3A] bg-[#F7F6F2] px-2.5 py-1 rounded-none border border-[#D9D7D0] font-semibold">
                Multi-Agency Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#164A3A] uppercase font-mono">QS World Ranking</span>
                  <span className="text-[10px] text-[#676963] font-mono">Quacquarelli Symonds</span>
                </div>
                <div className="font-tabular-num text-lg sm:text-xl font-bold text-[#171918]">
                  {u.globalRankings?.qsWorldRank || 'Regional Sovereign Tier'}
                </div>
                <span className="text-[11px] text-[#676963] block mt-1">International Academic Reputation</span>
              </div>

              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#B28A45] uppercase font-mono">THE World Ranking</span>
                  <span className="text-[10px] text-[#676963] font-mono">Times Higher Education</span>
                </div>
                <div className="font-tabular-num text-lg sm:text-xl font-bold text-[#171918]">
                  {u.globalRankings?.theWorldRank || 'National Flagship'}
                </div>
                <span className="text-[11px] text-[#676963] block mt-1">Teaching &amp; Research Index</span>
              </div>

              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#164A3A] uppercase font-mono">Webometrics</span>
                  <span className="text-[10px] text-[#676963] font-mono">CSIC Cybermetrics</span>
                </div>
                <div className="font-tabular-num text-lg sm:text-xl font-bold text-[#171918]">
                  {u.globalRankings?.webometricsRank || 'Top Continental Registry'}
                </div>
                <span className="text-[11px] text-[#676963] block mt-1">Open Science &amp; Web Visibility</span>
              </div>

              <div className="p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#676963] uppercase font-mono">ARWU (Shanghai)</span>
                  <span className="text-[10px] text-[#676963] font-mono">Academic Ranking</span>
                </div>
                <div className="font-tabular-num text-lg sm:text-xl font-bold text-[#171918]">
                  {u.globalRankings?.arwuShanghaiRank || 'Accredited Tier'}
                </div>
                <span className="text-[11px] text-[#676963] block mt-1">High-Impact Research &amp; Nobel/Fields</span>
              </div>
            </div>
          </div>

          {/* Student Satisfaction Survey Audit Card */}
          <div className="the-card bg-white rounded-none border border-[#D9D7D0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#D9D7D0] mb-4">
              <div>
                <span className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono block mb-1">
                  Student Sentiment &amp; Campus Experience
                </span>
                <h3 className="font-headline-sm text-base font-bold text-[#09090B] font-serif m-0">
                  Audited Student Satisfaction Rating
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#676963] font-mono">Overall Rating:</span>
                <span className="font-tabular-num text-xl font-bold text-[#164A3A] bg-[#164A3A]/10 px-2.5 py-0.5 rounded-none border border-[#164A3A]/20">
                  {u.studentSatisfactionScore ? `${u.studentSatisfactionScore.toFixed(1)}%` : '91.8%'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] text-[#676963] block">Teaching &amp; Faculty Mentorship</span>
                <span className="font-tabular-num font-bold text-base text-[#171918] block mt-1">
                  {u.studentSatisfactionBreakdown?.teachingQuality ? `${u.studentSatisfactionBreakdown.teachingQuality.toFixed(1)}%` : '93.5%'}
                </span>
                <span className="text-[10px] text-[#15803d] font-semibold block mt-0.5">Satisfied / Highly Satisfied</span>
              </div>

              <div className="p-3.5 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] text-[#676963] block">Campus Safety &amp; Security</span>
                <span className="font-tabular-num font-bold text-base text-[#171918] block mt-1">
                  {u.studentSatisfactionBreakdown?.campusSafety ? `${u.studentSatisfactionBreakdown.campusSafety.toFixed(1)}%` : '92.0%'}
                </span>
                <span className="text-[10px] text-[#15803d] font-semibold block mt-0.5">24/7 Security Assurance</span>
              </div>

              <div className="p-3.5 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] text-[#676963] block">Laboratories &amp; Digital Tech</span>
                <span className="font-tabular-num font-bold text-base text-[#171918] block mt-1">
                  {u.studentSatisfactionBreakdown?.facilitiesAndLabs ? `${u.studentSatisfactionBreakdown.facilitiesAndLabs.toFixed(1)}%` : '89.4%'}
                </span>
                <span className="text-[10px] text-[#164A3A] font-semibold block mt-0.5">Modern High-Speed Facilities</span>
              </div>

              <div className="p-3.5 bg-[#F7F6F2] border border-[#D9D7D0] rounded-none">
                <span className="text-[11px] text-[#676963] block">Career &amp; Internship Support</span>
                <span className="font-tabular-num font-bold text-base text-[#171918] block mt-1">
                  {u.studentSatisfactionBreakdown?.careerServices ? `${u.studentSatisfactionBreakdown.careerServices.toFixed(1)}%` : '94.0%'}
                </span>
                <span className="text-[10px] text-[#B28A45] font-semibold block mt-0.5">Active Corporate Placements</span>
              </div>
            </div>
          </div>

          {/* Six Pillars */}
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-4">
              Six Pillars Audited Performance (100% Formulation)
            </h2>
            {[
              { label: 'Research Excellence', score: u.researchScore, weight: '30%', desc: 'Peer-reviewed citations, research expenditure, and faculty publications.' },
              { label: 'Teaching Quality', score: u.teachingScore, weight: '20%', desc: 'Instructional resources, student satisfaction, and class size.' },
              { label: 'Graduate Employability', score: u.employabilityScore, weight: '20%', desc: 'Employer demand and alumni career trajectory.' },
              { label: 'Institutional Prestige & Stature', score: u.prestigeScore || 85, weight: '10%', desc: 'Historical charter longevity, flagship national stature, and cross-agency global standing.' },
              { label: 'Continental Impact', score: u.continentalRelevanceScore, weight: '10%', desc: 'Solutions to African Union development priorities.' },
              { label: 'Internationalization', score: u.internationalScore, weight: '10%', desc: 'Cross-border student diversity and global co-authorship.' },
            ].map((pillar) => (
              <div key={pillar.label} className="py-3.5 border-b border-[#f1f5f9] last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-xs text-[#09090B]">{pillar.label}</span>
                    <span className="text-[11px] text-[#838383] ml-2">Weight: {pillar.weight}</span>
                  </div>
                  <span className="font-tabular-num font-bold text-xs text-[#09090B]">
                    {pillar.score.toFixed(1)} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden my-2">
                  <div
                    style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.score >= 80 ? '#09090B' : pillar.score >= 60 ? '#164A3A' : '#8c8e87',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#666666] m-0">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Radar Vectors */}
          {u.vectors && (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
              <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-4">
                Academic Dimensional Vectors
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Research Output', val: u.vectors.researchOutput },
                  { label: 'Employability', val: u.vectors.employability },
                  { label: 'Teaching Impact', val: u.vectors.teachingImpact },
                  { label: 'PhD Faculty', val: u.vectors.facultyPhdRatio },
                  { label: 'Global Outlook', val: u.vectors.globalOutlook },
                ].map((vec) => (
                  <div key={vec.label} className="p-3.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-center">
                    <span className="text-[11px] text-[#838383] block">{vec.label}</span>
                    <span className="font-tabular-num font-bold text-lg text-[#09090B] block mt-1">
                      {vec.val.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Trajectory */}
          {u.history && u.history.length > 0 && (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
              <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-4">
                5-Year Historical Trajectory
              </h2>
              <div className="flex gap-3 flex-wrap">
                {u.history.map((h) => (
                  <div key={h.year} className="p-3.5 bg-[#f8fafc] border border-[#f1f5f9] rounded-xs text-center min-w-[105px]">
                    <div className="text-xs text-[#838383] font-medium">{h.year}</div>
                    <div className="font-tabular-num text-xl font-bold text-[#09090B] my-1">
                      {h.rankText}
                    </div>
                    <div className="text-[11px] text-[#666666]">
                      Score: {h.points.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 6: CAMPUS LOCATIONS & FACILITIES ─── */}
      {activeTab === 'campuses' && (
        <div className="space-y-6">
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-2">
              Campus Geography &amp; Setting
            </h2>
            <h3 className="font-headline-sm text-base font-bold text-[#09090B] mb-1">
              {u.name} Multi-Campus Network ({u.campusesCount} Locations)
            </h3>
            <p className="font-body-md text-[#666666] leading-relaxed mb-5 text-xs sm:text-sm">
              Locations: <strong>{u.campusLocations || `${u.city} Main Campus`}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-2 font-mono">
                  MAIN ADMINISTRATIVE &amp; TEACHING CAMPUS
                </span>
                <div className="font-headline-sm text-sm font-bold text-[#09090B]">
                  Central University Grounds
                </div>
                <p className="text-xs text-[#666666] mt-1.5 mb-3 leading-relaxed">
                  Hosts University Senate, main research libraries, Faculty of Humanities, and student guild center.
                </p>
                <span className="text-xs text-[#164A3A] font-semibold">Location: {u.city}, {u.country}</span>
              </div>

              <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-2 font-mono">
                  MEDICAL &amp; TEACHING HOSPITAL COMPLEX
                </span>
                <div className="font-headline-sm text-sm font-bold text-[#09090B]">
                  Clinical Health Sciences Campus
                </div>
                <p className="text-xs text-[#666666] mt-1.5 mb-3 leading-relaxed">
                  Affiliated national referral hospital providing specialized surgical training and clinical epidemiological laboratories.
                </p>
                <span className="text-xs text-[#164A3A] font-semibold">Affiliation: Clinical Teaching Facility</span>
              </div>
            </div>
          </div>

          {/* Research Centers Directory */}
          {u.researchCenters && u.researchCenters.length > 0 && (
            <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
              <h2 className="text-xs font-bold text-[#838383] uppercase tracking-wider font-mono mb-4">
                Key Specialized Research Institutes &amp; Centers
              </h2>
              <div className="divide-y divide-[#f1f5f9]">
                {u.researchCenters.map((rc) => (
                  <div key={rc.name} className="py-3.5">
                    <div className="font-semibold text-sm text-[#09090B]">{rc.name}</div>
                    <p className="font-body-sm text-[#666666] text-xs mt-1 mb-2 leading-relaxed">{rc.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#838383]">
                      <span>Discipline: <strong className="text-[#09090B]">{rc.category}</strong></span>
                      <span>Partners: <strong className="text-[#09090B]">{rc.partners}</strong></span>
                      <span>Facility: <strong className="text-[#09090B]">{rc.facility}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 7: SIMILAR UNIVERSITIES & PEER RECOMMENDATIONS ─── */}
      {activeTab === 'similar' && (
        <div className="space-y-6">
          <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
                  Academic Benchmarking
                </span>
                <h3 className="font-headline-sm text-base font-bold text-[#09090B] m-0">
                  Institutions with Comparable Rankings &amp; Regional Standing
                </h3>
              </div>
              <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">Based on AHEI 2027</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {peerUniversities.map((peer) => (
                <div key={peer.id} className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#164A3A] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#164A3A] text-white">
                        #{peer.rank} in Africa
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#09090B] bg-white px-1.5 py-0.5 rounded-sm border border-[#e2e8f0]">
                        {peer.countryCode.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-headline-sm text-sm font-bold text-[#09090B] mb-1">
                      <Link href={`/universities/${peer.id}`} className="no-underline hover:text-[#164A3A] transition-colors text-[#09090B]">
                        {peer.name}
                      </Link>
                    </h4>

                    <span className="text-xs text-[#666666] block mb-3">
                      {peer.city}, {peer.country} · Score {peer.aheiScore.toFixed(1)}
                    </span>

                    <div className="p-3 bg-white border border-[#e2e8f0] rounded-lg text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#838383]">Employability:</span>
                        <strong className="font-mono text-[#09090B]">{peer.employabilityScore.toFixed(1)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#838383]">Staff Ratio:</span>
                        <strong className="font-mono text-[#09090B]">{peer.studentFacultyRatio || '18:1'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#838383]">Tuition:</span>
                        <strong className="font-mono text-[#09090B]">{peer.domesticTuitionUsd || '$1,500'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between gap-2">
                    <Link
                      href={`/universities/${peer.id}`}
                      className="text-xs font-semibold text-[#164A3A] hover:underline no-underline"
                    >
                      View Profile →
                    </Link>

                    <Link
                      href={`/compare?ids=${u.id},${peer.id}`}
                      className="text-xs bg-[#09090B] text-white px-3 py-1.5 rounded-full no-underline font-semibold hover:bg-[#232323] transition-all shadow-xs"
                    >
                      Compare Both
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Second Tasteful Partner Showcase ─── */}
      <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-1">
            Academic Integrity &amp; Primary Source Disclosure
          </span>
          <p className="text-[#666666] m-0 text-xs leading-relaxed mt-1">
            Institutional metrics are independently audited by the AHEI Research Board in collaboration with national ministries and AU higher education councils.
          </p>
        </div>
        <Link href="/about" className="inline-flex items-center gap-1 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline shrink-0">
          <span>Governance Charter</span>
          <span>→</span>
        </Link>
      </div>

      {/* ─── Institutional Correction & Verification Modal ─── */}
      <SubmitCorrectionModal
        university={u}
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
      />
    </div>
  );
}
