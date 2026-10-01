'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/components/layout/CompareProvider';
import { useUniversities } from '@/components/layout/InstitutionsProvider';

interface SubjectTrack {
  id: string;
  code: string;
  title: string;
  description: string;
  leadIndicator: string;
  accreditationStandard: string;
  topUniversities: Array<{
    uniId: string;
    subjectScore: number;
    subjectRank: number;
    keyFacility: string;
    flagshipDegree: string;
  }>;
}

const SUBJECT_TRACKS: SubjectTrack[] = [
  {
    id: 'medicine',
    code: 'MED',
    title: 'Medicine & Health Sciences',
    description: 'Audited against clinical teaching hospitals, medical council accreditation, and epidemiological citations.',
    leadIndicator: 'Clinical Research & Hospital Affiliations',
    accreditationStandard: 'WHO & National Medical Councils',
    topUniversities: [
      {
        uniId: 'uct',
        subjectScore: 97.4,
        subjectRank: 1,
        keyFacility: 'Groote Schuur Academic Hospital Complex',
        flagshipDegree: 'MBChB (Bachelor of Medicine & Surgery)',
      },
      {
        uniId: 'wits',
        subjectScore: 94.8,
        subjectRank: 2,
        keyFacility: 'Charlotte Maxeke Johannesburg Academic Hospital',
        flagshipDegree: 'MBBCh & Health Sciences Research Hub',
      },
      {
        uniId: 'cairo',
        subjectScore: 92.6,
        subjectRank: 3,
        keyFacility: 'Kasr Al Ainy Medical School (Est. 1827)',
        flagshipDegree: 'Bachelor of Medicine & Surgery (MBBCh)',
      },
      {
        uniId: 'uon',
        subjectScore: 89.2,
        subjectRank: 4,
        keyFacility: 'Kenyatta National Hospital Health Sciences Campus',
        flagshipDegree: 'MBChB & Tropical Medicine Center',
      },
      {
        uniId: 'makerere',
        subjectScore: 88.5,
        subjectRank: 5,
        keyFacility: 'Mulago National Referral Hospital',
        flagshipDegree: 'MBChB & Infectious Disease Institute',
      },
    ],
  },
  {
    id: 'cs',
    code: 'CSC',
    title: 'Computer Science & AI',
    description: 'Evaluated across software architecture, machine learning research, GitHub contributions, and tech industry placements.',
    leadIndicator: 'Computing Systems & Silicon Savannah / Tech Hub Ties',
    accreditationStandard: 'IEEE & ACM Continental Chapters',
    topUniversities: [
      {
        uniId: 'uct',
        subjectScore: 95.8,
        subjectRank: 1,
        keyFacility: 'Hasso Plattner d-school & AI Lab',
        flagshipDegree: 'BSc Computer Science & Data Science',
      },
      {
        uniId: 'stellenbosch',
        subjectScore: 93.1,
        subjectRank: 2,
        keyFacility: 'Center for Artificial Intelligence Research (CAIR)',
        flagshipDegree: 'BSc Computer Science & Applied Mathematics',
      },
      {
        uniId: 'wits',
        subjectScore: 91.4,
        subjectRank: 3,
        keyFacility: 'Tshimologong Digital Innovation Zone',
        flagshipDegree: 'BSc Computational & Applied Mathematics',
      },
      {
        uniId: 'uon',
        subjectScore: 88.9,
        subjectRank: 4,
        keyFacility: 'Chiromo Science Campus & C4DLab Tech Incubator',
        flagshipDegree: 'BSc Computer Science & Cyber Security',
      },
      {
        uniId: 'auc',
        subjectScore: 87.2,
        subjectRank: 5,
        keyFacility: 'Center for Applied Computing & New Cairo Tech Park',
        flagshipDegree: 'BSc Computer Science (ABET Accredited)',
      },
    ],
  },
  {
    id: 'engineering',
    code: 'ENG',
    title: 'Engineering & Built Environment',
    description: 'Ranked by laboratory infrastructure, heavy industry co-op placements, and accredited engineering council credentials.',
    leadIndicator: 'ABET / Washington Accord Standards',
    accreditationStandard: 'Engineering Council of SA & National Boards',
    topUniversities: [
      {
        uniId: 'wits',
        subjectScore: 96.2,
        subjectRank: 1,
        keyFacility: 'School of Mining Engineering & High Voltage Lab',
        flagshipDegree: 'BSc (Eng) Mining & Civil Engineering',
      },
      {
        uniId: 'uct',
        subjectScore: 95.0,
        subjectRank: 2,
        keyFacility: 'Chemical Engineering Catalysis Center',
        flagshipDegree: 'BSc (Eng) Electrical & Mechanical',
      },
      {
        uniId: 'cairo',
        subjectScore: 93.5,
        subjectRank: 3,
        keyFacility: 'Giza Faculty of Engineering & Hydraulics Lab',
        flagshipDegree: 'BSc Architectural & Structural Engineering',
      },
      {
        uniId: 'pretoria',
        subjectScore: 91.8,
        subjectRank: 4,
        keyFacility: 'Engineering 4.0 Complex & Heavy Machinery Lab',
        flagshipDegree: 'BEng Industrial & Electronic Engineering',
      },
      {
        uniId: 'ainshams',
        subjectScore: 88.3,
        subjectRank: 5,
        keyFacility: 'Automotive & Energy Systems Laboratories',
        flagshipDegree: 'BSc Mechatronics & Civil Infrastructure',
      },
    ],
  },
  {
    id: 'business',
    code: 'BUS',
    title: 'Business, Economics & Finance',
    description: 'Measured by international business school accreditations (EQUIS, AMBA, AACSB) and executive career mobility.',
    leadIndicator: 'Triple Crown Accreditation & Executive Placements',
    accreditationStandard: 'AMBA / EQUIS / AACSB Standards',
    topUniversities: [
      {
        uniId: 'uct',
        subjectScore: 98.1,
        subjectRank: 1,
        keyFacility: 'UCT Graduate School of Business (Triple-Accredited)',
        flagshipDegree: 'Full-Time MBA & Master of Financial Engineering',
      },
      {
        uniId: 'stellenbosch',
        subjectScore: 94.6,
        subjectRank: 2,
        keyFacility: 'Stellenbosch Business School (Bellville Park)',
        flagshipDegree: 'BCom International Business & MBA',
      },
      {
        uniId: 'pretoria',
        subjectScore: 93.4,
        subjectRank: 3,
        keyFacility: 'Gordon Institute of Business Science (GIBS)',
        flagshipDegree: 'Executive MBA & PDBA',
      },
      {
        uniId: 'auc',
        subjectScore: 92.0,
        subjectRank: 4,
        keyFacility: 'AUC School of Business (Triple Crown AACSB, AMBA, EQUIS)',
        flagshipDegree: 'BBA & Master of Science in Finance',
      },
      {
        uniId: 'uon',
        subjectScore: 86.5,
        subjectRank: 5,
        keyFacility: 'Lower Kabete Faculty of Business and Management',
        flagshipDegree: 'Master of Business Administration (MBA)',
      },
    ],
  },
  {
    id: 'agriculture',
    code: 'AGR',
    title: 'Agriculture & Food Security',
    description: 'Evaluated by agronomy research output, seed bank patents, and rural community development initiatives.',
    leadIndicator: 'Continental Agronomy Impact & Climate Resilience',
    accreditationStandard: 'CGIAR & RUFORUM Continental Network',
    topUniversities: [
      {
        uniId: 'stellenbosch',
        subjectScore: 96.5,
        subjectRank: 1,
        keyFacility: 'Welgevallen Experimental Farm & Viticulture Center',
        flagshipDegree: 'BScAgric Agronomy & Soil Science',
      },
      {
        uniId: 'uon',
        subjectScore: 92.4,
        subjectRank: 2,
        keyFacility: 'Upper Kabete Field Station & Dryland Agri-Research Hub',
        flagshipDegree: 'BSc Agriculture & Food Science Technology',
      },
      {
        uniId: 'makerere',
        subjectScore: 90.8,
        subjectRank: 3,
        keyFacility: 'Makerere University Agricultural Research Institute Kabanyolo (MUARIK)',
        flagshipDegree: 'BSc Agricultural Engineering & Agribusiness',
      },
      {
        uniId: 'ibadan',
        subjectScore: 89.1,
        subjectRank: 4,
        keyFacility: 'Faculty of Agriculture & Forestry Experimental Plots',
        flagshipDegree: 'BSc Agronomy & Animal Science',
      },
      {
        uniId: 'pretoria',
        subjectScore: 88.0,
        subjectRank: 5,
        keyFacility: 'Experimental Farm & Forestry Products Institute',
        flagshipDegree: 'BSc (Agric) Agricultural Economics',
      },
    ],
  },
  {
    id: 'law',
    code: 'LAW',
    title: 'Law, Governance & Human Rights',
    description: 'Ranked by judicial clerkship placements, human rights tribunals, and African Union law scholarship.',
    leadIndicator: 'Constitutional Jurisprudence & AU Policy Impact',
    accreditationStandard: 'African Court of Human Rights & Bar Councils',
    topUniversities: [
      {
        uniId: 'pretoria',
        subjectScore: 96.0,
        subjectRank: 1,
        keyFacility: 'Centre for Human Rights (Oliver Tambo Building)',
        flagshipDegree: 'LLM Human Rights & Democratisation in Africa',
      },
      {
        uniId: 'uct',
        subjectScore: 94.7,
        subjectRank: 2,
        keyFacility: 'Wilfred & Jules Kramer Law School & Refugee Rights Clinic',
        flagshipDegree: 'Bachelor of Laws (LLB) & LLM Marine Law',
      },
      {
        uniId: 'wits',
        subjectScore: 92.9,
        subjectRank: 3,
        keyFacility: 'Centre for Applied Legal Studies (CALS)',
        flagshipDegree: 'LLB & Constitutional Litigation Clinic',
      },
      {
        uniId: 'uon',
        subjectScore: 88.4,
        subjectRank: 4,
        keyFacility: 'Parklands Law Campus & Legal Aid Clinic',
        flagshipDegree: 'Bachelor of Laws (LLB)',
      },
      {
        uniId: 'ghana',
        subjectScore: 87.0,
        subjectRank: 5,
        keyFacility: 'University of Ghana School of Law (Legon)',
        flagshipDegree: 'Bachelor of Laws (LLB) & LLM Alternative Dispute',
      },
    ],
  },
];

export function SubjectRankings() {
  const [activeTab, setActiveTab] = useState(SUBJECT_TRACKS[0].id);
  const { addToCompare, isInCompare } = useCompare();
  const { universities } = useUniversities();

  const currentTrack = SUBJECT_TRACKS.find((t) => t.id === activeTab) || SUBJECT_TRACKS[0];

  return (
    <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#e9e9e9]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="font-code-badge text-white px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: '#164A3A',
                borderRadius: '12px',
              }}
            >
              Field-by-Field Index
            </span>
            <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
              2027 Continental Subject Directory
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#232323] m-0">
            Rankings by Academic Discipline
          </h2>
          <p className="font-body-sm text-[#838383] mt-1 mb-0">
            Compare institutions based on specific departmental research impact, facilities, and verified accreditation standards.
          </p>
        </div>

        <Link
          href="/rankings"
          className="text-xs font-semibold text-[#164A3A] hover:underline self-start md:self-auto no-underline"
        >
          View Full League Table →
        </Link>
      </div>

      {/* Subject Navigation Tabs with Clean Code Badges */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SUBJECT_TRACKS.map((track) => {
          const isActive = track.id === activeTab;
          return (
            <button
              key={track.id}
              onClick={() => setActiveTab(track.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all rounded-full border shadow-2xs ${
                isActive
                  ? 'bg-[#09090B] text-white border-[#09090B] shadow-sm'
                  : 'bg-white text-[#232323] border-[#e2e8f0] hover:border-[#164A3A] hover:text-[#164A3A]'
              }`}
            >
              <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F7F6F2] text-[#164A3A]'}`}>
                {track.code}
              </span>
              <span>{track.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Discipline Overview Banner */}
      <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] font-bold text-[#164A3A] block mb-1 uppercase tracking-wider">
            Methodology &amp; Standards
          </span>
          <p className="font-body-sm text-[#232323] mb-0 font-medium text-xs sm:text-sm">
            {currentTrack.description}
          </p>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-[#838383] block text-[10px] font-mono uppercase tracking-wider">
            Accreditation Authority
          </span>
          <span className="text-xs font-bold text-[#232323]">
            {currentTrack.accreditationStandard}
          </span>
        </div>
      </div>

      {/* Discipline Table */}
      <div className="border border-[#e2e8f0] rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans" style={{ minWidth: '700px' }}>
            <thead className="bg-[#f8fafc] text-[#232323] text-[11px] font-semibold uppercase tracking-wider border-b border-[#e2e8f0]">
              <tr>
                <th className="py-3.5 px-4 text-center" style={{ width: '56px' }}>Rank</th>
                <th className="py-3.5 px-5">Institution &amp; Country</th>
                <th className="py-3.5 px-4">Flagship Degree</th>
                <th className="py-3.5 px-4">Core Laboratory / Campus Facility</th>
                <th className="py-3.5 px-4 text-right" style={{ width: '100px' }}>Subject Score</th>
                <th className="py-3.5 px-4 text-center" style={{ width: '110px' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {currentTrack.topUniversities.map((item) => {
                const u = universities.find((uni) => uni.id === item.uniId);
                if (!u) return null;

                return (
                  <tr key={item.uniId} className="hover:bg-[#f8fafc] transition-colors h-16">
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-sm font-bold text-[#164A3A]">
                        #{item.subjectRank}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        {u.crestUrl && (
                          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white border border-[#e2e8f0] p-1 rounded-xs flex items-center justify-center shadow-2xs shrink-0">
                            <img
                              src={u.crestUrl}
                              alt={`${u.name} official crest`}
                              width={44}
                              height={44}
                              loading="lazy"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <Link href={`/universities/${u.id}`} className="hover:text-[#164A3A] font-serif font-bold text-sm block no-underline text-[#232323]">
                            {u.name}
                          </Link>
                          <span className="block text-[#838383] text-xs font-sans">
                            {u.city}, {u.country}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#232323]">
                      {item.flagshipDegree}
                    </td>
                    <td className="py-3 px-4 text-[#676963]">
                      {item.keyFacility}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-sm text-[#059669]">
                        {item.subjectScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-[#838383] block font-mono">/ 100</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => addToCompare(u.id)}
                        disabled={isInCompare(u.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          isInCompare(u.id)
                            ? 'bg-[#F7F6F2] text-[#164A3A] border-[#D9D7D0]'
                            : 'bg-white text-[#232323] border-[#e2e8f0] hover:border-[#164A3A] hover:text-[#164A3A]'
                        }`}
                        title={isInCompare(u.id) ? 'Already in comparison' : 'Add to compare'}
                      >
                        {isInCompare(u.id) ? 'In Compare' : '+ Compare'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
