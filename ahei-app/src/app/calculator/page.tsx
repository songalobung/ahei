import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CostCalculator } from '@/components/discovery/CostCalculator';
import { DestinationGuides } from '@/components/discovery/DestinationGuides';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Cost of Living & Tuition Calculator 2027 | AHEI African Higher Education Index',
  description: 'Audited tuition fees, accommodation rates, and living expense benchmarks across 54 African higher education destinations.',
  alternates: {
    canonical: `${siteUrl}/calculator`,
  },
  openGraph: {
    title: 'University Tuition & Student Living Cost Estimator | AHEI',
    description: 'Audited tuition and living expense comparisons across 54 African higher education destinations.',
    url: `${siteUrl}/calculator`,
    type: 'website',
  },
};

export default function CalculatorPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#666666] flex items-center gap-2 text-xs">
        <Link href="/" className="no-underline text-[#666666] hover:text-[#09090B]">
          Home
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#09090B] font-semibold">Cost &amp; Living Calculator</span>
      </nav>

      {/* ─── Header ─── */}
      <header className="pb-6 border-b border-[#e9e9e9]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
            Student Financial Planning
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
            2027 Audited Tuition &amp; Living Expense Index
          </span>
        </div>

        <h1 className="font-headline-lg text-[#09090B] m-0 mb-3 font-bold tracking-tight">
          University Tuition &amp; Student Living Cost Estimator
        </h1>

        <p className="font-body-lg text-[#666666] max-w-3xl m-0 leading-relaxed text-sm md:text-base">
          Higher education financial planning in Africa requires accurate estimates across tuition bands, campus vs. private housing, and city living indices. All figures are calibrated from institutional gazettes and audited municipal cost-of-living data.
        </p>

        {/* Key Methodology Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-[#f1f5f9] text-xs">
          <div className="the-card bg-white p-4 rounded-xs border border-[#e9e9e9] shadow-xs">
            <span className="font-bold text-[#09090B] block mb-1">Domestic vs. International</span>
            <span className="text-[#666666] leading-relaxed block">Differentiates SADC / EAC regional protocol rates from international student tariffs.</span>
          </div>
          <div className="the-card bg-white p-4 rounded-xs border border-[#e9e9e9] shadow-xs">
            <span className="font-bold text-[#09090B] block mb-1">Standard Academic Year</span>
            <span className="text-[#666666] leading-relaxed block">Estimates calculate a standard 10-month academic term (tuition + housing + stipends + books).</span>
          </div>
          <div className="the-card bg-white p-4 rounded-xs border border-[#e9e9e9] shadow-xs">
            <span className="font-bold text-[#09090B] block mb-1">Currency Normalisation</span>
            <span className="text-[#666666] leading-relaxed block">Reported in USD ($) using real-time central bank reference rates for cross-border comparison.</span>
          </div>
        </div>
      </header>

      {/* ─── Interactive Calculator Engine ─── */}
      <section className="space-y-4">
        <CostCalculator />
      </section>

      {/* ─── Google Ad Space: Calculator Mid-Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-8" />

      {/* ─── Country Cost & Regulatory Guides ─── */}
      <section className="pt-8 border-t border-[#e9e9e9] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-1.5">
              Study Destination Directory
            </span>
            <h2 className="font-headline-sm text-[#09090B] font-bold m-0 text-lg sm:text-xl">
              Country Intelligence &amp; Cost of Study Profiles
            </h2>
            <p className="font-body-sm text-[#666666] m-0 mt-1 text-xs sm:text-sm">
              Explore visa frameworks, language of instruction, and typical student budgets across primary African study corridors.
            </p>
          </div>
          <Link 
            href="/explore" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline hidden sm:inline-flex"
          >
            <span>View All 54 Jurisdictions</span>
            <span>→</span>
          </Link>
        </div>

        <DestinationGuides />
      </section>
    </div>
  );
}
