'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DestinationGuide {
  id: string;
  country: string;
  countryCode: string;
  region: string;
  headline: string;
  overview: string;
  rankedInstitutions: number;
  averageTuitionUsd: string;
  monthlyLivingUsd: string;
  visaInfo: string;
  workRights: string;
  topInstitutions: Array<{ id: string; name: string; rank: number; city: string }>;
  keyStrengths: string[];
}

const DESTINATIONS: DestinationGuide[] = [
  {
    id: 'za',
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'Southern Africa',
    headline: 'Premier Research & Medical Epicenter',
    overview: 'Home to the continent’s highest-ranked research universities, world-renowned medical schools, and triple-accredited business faculties.',
    rankedInstitutions: 26,
    averageTuitionUsd: '$2,500 – $5,200 / yr',
    monthlyLivingUsd: '$450 – $750 / mo',
    visaInfo: 'Study Visa issued for degree duration via VFS Global. Requires SAQA evaluation & medical cover.',
    workRights: 'International students may work up to 20 hours per week during term time.',
    topInstitutions: [
      { id: 'uct', name: 'University of Cape Town', rank: 1, city: 'Cape Town' },
      { id: 'wits', name: 'University of the Witwatersrand', rank: 2, city: 'Johannesburg' },
      { id: 'stellenbosch', name: 'Stellenbosch University', rank: 3, city: 'Stellenbosch' },
      { id: 'pretoria', name: 'University of Pretoria', rank: 7, city: 'Pretoria' },
    ],
    keyStrengths: ['Clinical Health Sciences', 'Mining & Civil Engineering', 'Cosmology & Astronomy', 'Corporate Law'],
  },
  {
    id: 'eg',
    country: 'Egypt',
    countryCode: 'EG',
    region: 'North Africa',
    headline: 'Historic Arab & Mediterranean Scholarly Crossroads',
    overview: 'Centuries of scholarly leadership in engineering, clinical medicine, and humanities, featuring both prestigious public titans and private American-model universities.',
    rankedInstitutions: 31,
    averageTuitionUsd: '$1,800 – $8,500 / yr',
    monthlyLivingUsd: '$300 – $500 / mo',
    visaInfo: 'Student visa processed via Ministry of Higher Education & Egyptian Immigration Authority upon formal admission.',
    workRights: 'Limited campus assistantships permitted; off-campus work requires separate permit.',
    topInstitutions: [
      { id: 'cairo', name: 'Cairo University', rank: 6, city: 'Giza / Cairo' },
      { id: 'auc', name: 'American University in Cairo', rank: 9, city: 'New Cairo' },
      { id: 'ainshams', name: 'Ain Shams University', rank: 11, city: 'Cairo' },
    ],
    keyStrengths: ['Architecture & Civil Engineering', 'Pharmaceutical Sciences', 'Middle Eastern Studies', 'Clinical Surgery'],
  },
  {
    id: 'ke',
    country: 'Kenya',
    countryCode: 'KE',
    region: 'East Africa',
    headline: 'Silicon Savannah: Innovation, Agri-Tech & Law',
    overview: 'East Africa’s technological and commercial engine, hosting top regional medical facilities, mobile money research clusters, and dynamic business hubs.',
    rankedInstitutions: 18,
    averageTuitionUsd: '$1,200 – $3,200 / yr',
    monthlyLivingUsd: '$350 – $600 / mo',
    visaInfo: 'Student Pass issued by the Directorate of Immigration Services (Form 8). Rapid online processing.',
    workRights: 'Internships permitted when integral to curriculum; research assistantships available.',
    topInstitutions: [
      { id: 'uon', name: 'University of Nairobi', rank: 4, city: 'Nairobi' },
    ],
    keyStrengths: ['Mobile & Fintech Engineering', 'Tropical Medicine', 'Agronomy & Dryland Research', 'International Law'],
  },
  {
    id: 'ng',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'West Africa',
    headline: 'West Africa’s Demographic Talent Powerhouse',
    overview: 'Home to historic federal universities with celebrated literary, pharmaceutical, and business alumni shaping commerce across West Africa.',
    rankedInstitutions: 42,
    averageTuitionUsd: '$600 – $2,500 / yr',
    monthlyLivingUsd: '$250 – $450 / mo',
    visaInfo: 'Subject to Regularization (STR) visa issued at Nigerian missions abroad, then regularized to CERPAC permit.',
    workRights: 'Graduate assistantships and academic research fellowships permitted.',
    topInstitutions: [
      { id: 'ibadan', name: 'University of Ibadan', rank: 8, city: 'Ibadan' },
    ],
    keyStrengths: ['Pharmacy & Drug Discovery', 'African History & Literature', 'Petrochemical Engineering', 'Agricultural Science'],
  },
  {
    id: 'ug',
    country: 'Uganda',
    countryCode: 'UG',
    region: 'East Africa',
    headline: 'Historic Academic Center for Health Sciences',
    overview: 'Celebrated for Makerere University—one of Africa’s oldest higher learning institutions—pioneering infectious disease and community health scholarship.',
    rankedInstitutions: 12,
    averageTuitionUsd: '$1,100 – $2,800 / yr',
    monthlyLivingUsd: '$300 – $500 / mo',
    visaInfo: 'East African Community (EAC) students enjoy reciprocal tuition and simplified student pass entry.',
    workRights: 'Student internships and community engagement projects.',
    topInstitutions: [
      { id: 'makerere', name: 'Makerere University', rank: 5, city: 'Kampala' },
    ],
    keyStrengths: ['Infectious Disease Research', 'Social Sciences & Gender Studies', 'Forestry & Conservation', 'Public Health'],
  },
  {
    id: 'gh',
    country: 'Ghana',
    countryCode: 'GH',
    region: 'West Africa',
    headline: 'Gateway to West Africa: English-Medium Hub',
    overview: 'Renowned for academic stability, strong democratic institutions, and welcoming international student community in Accra and Kumasi.',
    rankedInstitutions: 15,
    averageTuitionUsd: '$1,500 – $4,000 / yr',
    monthlyLivingUsd: '$350 – $550 / mo',
    visaInfo: 'Ghana Immigration Service issues student permits endorsed in passport upon school endorsement.',
    workRights: 'Campus tutoring and co-op programmes allowed.',
    topInstitutions: [
      { id: 'ghana', name: 'University of Ghana', rank: 10, city: 'Accra' },
    ],
    keyStrengths: ['Public Health & Demography', 'Mineral Engineering', 'Business Administration', 'African Studies'],
  },
];

export function DestinationGuides() {
  const [selectedId, setSelectedId] = useState(DESTINATIONS[0].id);
  const current = DESTINATIONS.find((d) => d.id === selectedId) || DESTINATIONS[0];

  return (
    <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-[#e9e9e9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
              Study in Africa Guides
            </span>
            <span className="font-body-sm text-[#838383] text-xs">Student Mobility &amp; Destination Intel</span>
          </div>
          <h2 className="font-headline-sm text-[#09090B] font-bold mt-2 mb-0 text-xl">
            Higher Education Country Portals
          </h2>
          <p className="font-body-sm text-[#666666] mt-1 mb-0 text-xs sm:text-sm">
            Tuition estimates, living costs, visa regulations, and top-ranked campuses across premier African study hubs.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline self-start md:self-auto"
        >
          <span>Explore All 54 Nations</span>
          <span>→</span>
        </Link>
      </div>

      {/* Country Selection Chips with Clean Country Code Badges */}
      <div className="flex gap-2 overflow-x-auto py-3.5 border-b border-[#f1f5f9] no-scrollbar">
        {DESTINATIONS.map((dest) => {
          const isSelected = dest.id === selectedId;
          return (
            <button
              key={dest.id}
              onClick={() => setSelectedId(dest.id)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border rounded-full shadow-xs"
              style={{
                background: isSelected ? '#09090B' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#09090B',
                borderColor: isSelected ? '#09090B' : '#e9e9e9',
              }}
            >
              <span className="font-mono text-[10px] opacity-75">{dest.countryCode}</span>
              <span>{dest.country}</span>
            </button>
          );
        })}
      </div>

      {/* Destination Intel Grid */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Country Deep Dive */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-xs bg-[#f1f5f9] text-[#09090B] px-2 py-0.5 rounded-sm border border-[#e2e8f0]">{current.countryCode}</span>
              <h3 className="font-headline-sm text-[#09090B] font-bold m-0 text-lg sm:text-xl">
                {current.country}
              </h3>
              <span className="font-body-sm text-[#838383] text-xs">
                ({current.region})
              </span>
            </div>
            <p className="font-body-md font-bold text-[#09090B] mb-2 text-sm leading-snug">
              {current.headline}
            </p>
            <p className="font-body-sm text-[#666666] leading-relaxed text-xs sm:text-sm">
              {current.overview}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs">
            <div>
              <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider">Monitored HEIs</span>
              <span className="font-tabular-num font-bold text-lg text-[#09090B]">
                {current.rankedInstitutions}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider">Average Tuition</span>
              <span className="font-tabular-num font-bold text-xs text-[#09090B] block mt-0.5">
                {current.averageTuitionUsd}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider">Living Costs</span>
              <span className="font-tabular-num font-bold text-xs text-[#09090B] block mt-0.5">
                {current.monthlyLivingUsd}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider">Work Rights</span>
              <span className="font-tabular-num font-bold text-xs text-[#15803d] block mt-0.5">
                Part-Time Allowed
              </span>
            </div>
          </div>

          {/* Visa and Work Rights Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 border border-[#e2e8f0] bg-white rounded-xs shadow-2xs">
              <span className="font-semibold text-xs text-[#09090B] block mb-1.5">
                Student Visa Guidelines
              </span>
              <p className="font-body-sm text-[#666666] m-0 text-xs leading-relaxed">
                {current.visaInfo}
              </p>
            </div>
            <div className="p-4 border border-[#e2e8f0] bg-white rounded-xs shadow-2xs">
              <span className="font-semibold text-xs text-[#09090B] block mb-1.5">
                Employment &amp; Internships
              </span>
              <p className="font-body-sm text-[#666666] m-0 text-xs leading-relaxed">
                {current.workRights}
              </p>
            </div>
          </div>

          {/* Key Academic Strengths */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider mb-2">
              National Academic Strengths
            </span>
            <div className="flex flex-wrap gap-2">
              {current.keyStrengths.map((strength, i) => (
                <span
                  key={i}
                  className="font-body-sm bg-[#f1f5f9] text-[#09090B] px-3 py-1 rounded-full text-xs font-medium border border-[#e2e8f0]"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Top Rated Institutions in this country */}
        <div className="border-t lg:border-t-0 lg:border-l border-[#e9e9e9] lg:pl-6 pt-5 lg:pt-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#09090B] border border-[#e2e8f0] mb-3">
            Flagship Institutions in {current.country}
          </span>
          <div className="space-y-3">
            {current.topInstitutions.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex items-center justify-between gap-3 hover:border-[#164A3A] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tabular-num font-bold text-xs text-[#164A3A]">
                      #{item.rank} in Africa
                    </span>
                  </div>
                  <Link
                    href={`/universities/${item.id}`}
                    className="font-semibold text-sm text-[#09090B] hover:text-[#164A3A] transition-colors no-underline block mt-0.5 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <span className="font-body-sm text-[#666666] text-xs">
                    {item.city}
                  </span>
                </div>

                <Link
                  href={`/universities/${item.id}`}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline shrink-0"
                >
                  <span>Dossier</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-[#F7F6F2] border border-[#D9D7D0] rounded-xs">
            <span className="font-semibold text-xs text-[#1e40af] block">
              Regional Guidance
            </span>
            <p className="font-body-sm text-[#1e3a8a] text-xs m-0 mt-1 leading-relaxed">
              Explore national accreditation reports and ministry registers on our Explore page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
