import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SubjectRankings } from '@/components/discovery/SubjectRankings';
import { CourseMatcher } from '@/components/discovery/CourseMatcher';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Subject League Tables 2027 | AHEI African Higher Education Index',
  description: 'Audited academic rankings by subject discipline across African universities. Explore leaders in Medicine, Computer Science, Engineering, Business, Law, and Agriculture.',
  alternates: {
    canonical: `${siteUrl}/subjects`,
  },
  openGraph: {
    title: 'Continental Discipline Performance & Faculty Excellence | AHEI',
    description: 'Audited academic rankings by subject discipline across African universities.',
    url: `${siteUrl}/subjects`,
    type: 'website',
  },
};

export default function SubjectsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">
          Home
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">Subject League Tables</span>
      </nav>

      {/* ─── Header ─── */}
      <header className="border-b border-[#f2f2f2] pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="font-code-badge text-white px-2.5 py-0.5"
            style={{ background: '#164A3A', borderRadius: '12px' }}
          >
            SUBJECT LEAGUE TABLES
          </span>
          <span className="font-mono text-xs text-[#838383]">
            2027 EDITION · 6 SPECIALIZED DISCIPLINARY DOMAINS
          </span>
        </div>

        <h1 className="font-headline-lg text-[#232323] m-0 mb-3">
          Continental Discipline Performance &amp; Faculty Excellence
        </h1>

        <p className="font-body-lg text-[#595959] max-w-3xl m-0 leading-relaxed">
          Institutional rank alone does not reflect departmental depth. AHEI subject rankings evaluate publication density, laboratory capital, citation share, and graduate placement across specific faculties.
        </p>

        {/* Quick Discipline Anchors */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#f2f2f2]">
          {[
            { label: 'Clinical Medicine & Health', code: 'MED', color: '#B28A45', bg: '#fdf2f8' },
            { label: 'Computer Science & AI', code: 'CSC', color: '#164A3A', bg: '#faf5ff' },
            { label: 'Engineering & Technology', code: 'ENG', color: '#164A3A', bg: '#F7F6F2' },
            { label: 'Business & Economics', code: 'BUS', color: '#24A148', bg: '#f0fdf4' },
            { label: 'Law & Jurisprudence', code: 'LAW', color: '#B28A45', bg: '#fefce8' },
            { label: 'Agriculture & Food Systems', code: 'AGR', color: '#059669', bg: '#ecfdf5' },
          ].map((d) => (
            <span
              key={d.code}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e9e9e9] text-xs text-[#232323] font-medium shadow-xs"
              style={{ borderRadius: '20px' }}
            >
              <span
                className="font-mono text-[10px] font-bold px-1.5 py-0.2"
                style={{ color: d.color, background: d.bg, borderRadius: '6px' }}
              >
                {d.code}
              </span>
              <span>{d.label}</span>
            </span>
          ))}
        </div>
      </header>

      {/* ─── Section 1: Subject League Tables ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
              Departmental Leaderboards by Field
            </h2>
            <p className="font-body-sm text-[#838383] m-0 mt-0.5">
              Select an academic field to examine institutional scores, research papers, and flagship degree programmes.
            </p>
          </div>
          <Link href="/rankings" className="text-xs font-semibold text-[#164A3A] hover:underline no-underline hidden sm:inline-block">
            View Overall League Table →
          </Link>
        </div>

        <SubjectRankings />
      </section>

      {/* ─── Google Ad Space: Subjects Mid-Leaderboard ─── */}
      <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-8" />

      {/* ─── Section 2: Course & Programme Matcher ─── */}
      <section className="pt-8 border-t border-[#e9e9e9] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
          <div>
            <span className="font-mono text-[11px] font-bold text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-2.5 py-0.5 rounded-full block w-fit mb-1.5 uppercase tracking-wider">
              PROSPECTIVE APPLICANT DISCOVERY
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
              Find Degree Programmes by Field, Region &amp; Priority
            </h2>
            <p className="font-body-sm text-[#838383] m-0 mt-0.5">
              Filter verified African faculties matching your career goals and tuition expectations.
            </p>
          </div>
        </div>

        <CourseMatcher />
      </section>
    </div>
  );
}
