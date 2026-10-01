'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How are universities selected for ranking?',
    a: 'Any chartered, accredited higher education institution in an African Union member state that offers degree-level programmes and has at least 3 years of verifiable operational data is eligible for inclusion. We currently track 1,048 institutions across 54 nations.',
  },
  {
    q: 'How often are the rankings updated?',
    a: 'The AHEI rankings are published annually, with data collection running from January to September. The rankings reflect the most recent academic year for which complete data is available.',
  },
  {
    q: 'Where does the data come from?',
    a: 'All data is primary-sourced from institutional annual reports, national higher education regulatory bodies (such as CUE Kenya, NUC Nigeria, CHE South Africa), Scopus & Web of Science citation databases, UNESCO Institute for Statistics, and institutional graduate surveys.',
  },
  {
    q: 'How are disputed data points resolved?',
    a: 'When an institution contests a data point, we initiate a formal review: the institution provides counter-evidence with source documentation, our regional desk analyst verifies against third-party sources, and a final determination is made within 30 days.',
  },
  {
    q: 'Why does my institution have a low confidence score?',
    a: 'The confidence score (0–100%) reflects data completeness and recency. Institutions with incomplete self-reporting, outdated annual reports, or limited third-party verification will have lower confidence scores. Submitting updated data through official channels will improve this.',
  },
  {
    q: 'Can I use AHEI data in academic publications?',
    a: 'Yes. AHEI data may be cited in academic publications with appropriate attribution. Please cite as: "African Higher Education Index (AHEI), 2027 Edition. Published October 2026."',
  },
  {
    q: 'How does the continental relevance pillar work?',
    a: 'This pillar measures alignment with the African Union\'s Agenda 2063 development priorities: agriculture and food security, health and wellbeing, industrialization, environmental sustainability, governance, and pan-African unity. Institutions are scored on research output and programme offerings in these priority areas.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">Home</Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/about" className="no-underline text-[#838383] hover:text-[#09090B]">About</Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">FAQ</span>
      </nav>

      {/* ─── Header ─── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-code-badge text-white px-3 py-1 font-semibold text-xs"
            style={{ background: '#164A3A', borderRadius: '20px' }}
          >
            EDITORIAL &amp; AUDIT INTELLIGENCE
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
            KNOWLEDGE BASE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] m-0 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="font-body-lg text-[#676963] max-w-2xl m-0 leading-relaxed text-base sm:text-lg">
          Common inquiries about data collection, methodology, dispute resolution, and citation usage of the AHEI rankings.
        </p>
      </div>

      {/* ─── Accordion List ─── */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`the-card bg-white rounded-none border transition-all overflow-hidden ${
                isOpen ? 'border-[#164A3A] shadow-sm' : 'border-[#e9e9e9] hover:border-[#cbd5e1]'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer bg-transparent border-none"
              >
                <span className="font-serif font-bold text-base sm:text-lg text-[#232323]">
                  {item.q}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#F7F6F2] text-[#164A3A] rotate-180' : 'bg-[#f8fafc] text-[#838383]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#676963] leading-relaxed border-t border-[#f1f5f9]">
                  <p className="m-0 font-sans">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
