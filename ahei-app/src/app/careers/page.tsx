'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { useCompare } from '@/components/layout/CompareProvider';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { Bot, Send, Sparkles, AlertCircle, RotateCcw, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';

interface CareerPathPreset {
  id: string;
  title: string;
  field: string;
  code: string;
  growthRate: string;
  demandTier: string;
  startingSalaryUsd: string;
  midSalaryUsd: string;
  seniorSalaryUsd: string;
  primaryHubs: string[];
  recommendedMajors: string[];
  keyEmployers: string[];
  strategicSummary: string;
  curriculumRoadmap: {
    year: string;
    focus: string;
    milestones: string[];
  }[];
  targetDisciplines: string[];
  aiPrompts: {
    label: string;
    prompt: string;
  }[];
}

const PRESET_CAREERS: CareerPathPreset[] = [
  {
    id: 'ai_ml',
    title: 'Machine Learning & Applied AI Engineer',
    field: 'Computer Science, AI & Informatics',
    code: 'CSC',
    growthRate: '+38% 5-Yr Growth in Africa',
    demandTier: 'Critical Continental Demand',
    startingSalaryUsd: '$22,000 – $32,000',
    midSalaryUsd: '$45,000 – $65,000',
    seniorSalaryUsd: '$75,000 – $110,000+',
    primaryHubs: ['Nairobi (Silicon Savannah)', 'Cape Town', 'Cairo', 'Lagos (Yaba)', 'Kigali'],
    recommendedMajors: ['BSc Computer Science', 'BSc Data Science & AI', 'BEng Software Engineering'],
    keyEmployers: ['Microsoft Africa Development Center (ADC)', 'Google Africa Research', 'Safaricom', 'InstaDeep', 'Andela'],
    strategicSummary: 'African tech ecosystems are urgently investing in native AI models for agricultural yield prediction, localized NLP for indigenous languages, automated healthcare diagnostics, and fintech credit assessment.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Mathematical Foundations',
        focus: 'Calculus, Linear Algebra, Discrete Structures, Python & Systems Architecture',
        milestones: ['Publish first open-source data pipeline', 'Join university computing society (GDSC)'],
      },
      {
        year: 'Year 2: Algorithms & Neural Networks',
        focus: 'Data Structures, Probability & Statistics, Deep Learning, Cloud Infrastructure',
        milestones: ['Participate in pan-African Zindi or Kaggle hackathon', 'Complete university lab research assistantship'],
      },
      {
        year: 'Year 3: Industrial Internship & Applied AI',
        focus: 'Distributed Systems, Computer Vision, Natural Language Processing, MLOps',
        milestones: ['12-week paid corporate internship at continental tech hub', 'Present at Deep Learning Indaba'],
      },
      {
        year: 'Year 4: Capstone & Commercial Placement',
        focus: 'Autonomous Agents, Ethical AI Governance, Final Year Capstone Project',
        milestones: ['Defend capstone system addressing a regional African challenge', 'Final-round graduate engineering recruitment'],
      },
    ],
    targetDisciplines: ['Computer', 'Informatics', 'Software', 'Data', 'Artificial Intelligence', 'Engineering'],
    aiPrompts: [
      {
        label: 'Hub Salaries: Nairobi vs Cape Town vs Cairo',
        prompt: 'Compare entry-level and mid-career AI engineering salaries, cost-of-living adjusted purchasing power, and tech ecosystem growth across Nairobi, Cape Town, and Cairo.',
      },
      {
        label: 'Microsoft ADC & InstaDeep Hiring Portfolio',
        prompt: 'What specific open-source models, GitHub repositories, or Kaggle/Zindi competition rankings do recruiters at Microsoft ADC and InstaDeep evaluate in African graduates?',
      },
      {
        label: 'Highest-Yield University Electives',
        prompt: 'Which advanced electives (e.g. Distributed Systems, Localized NLP, Computer Vision) should a computer science student prioritize to work on African agricultural and fintech AI applications?',
      },
    ],
  },
  {
    id: 'renewable_energy',
    title: 'Renewable Energy & Smart Grid Architect',
    field: 'Engineering & Industrial Technology',
    code: 'ENG',
    growthRate: '+34% 5-Yr Growth in Africa',
    demandTier: 'High Strategic Priority',
    startingSalaryUsd: '$18,000 – $28,000',
    midSalaryUsd: '$38,000 – $58,000',
    seniorSalaryUsd: '$68,000 – $95,000+',
    primaryHubs: ['Johannesburg', 'Cairo', 'Nairobi', 'Casablanca', 'Addis Ababa'],
    recommendedMajors: ['BSc Electrical & Power Engineering', 'BSc Renewable Energy Systems', 'BSc Mechanical Engineering'],
    keyEmployers: ['African Development Bank (AfDB)', 'Scatec Solar', 'Eskom Transmission', 'KenGen', 'Schneider Electric Africa'],
    strategicSummary: 'With Africa leading solar irradiance and geothermal potential, specialized grid engineers are required to transition minigrids, commercial solar-storage arrays, and green hydrogen infrastructure across the continent.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Engineering Physics & Circuit Theory',
        focus: 'Engineering Mechanics, Differential Equations, Electromagnetic Fields, CAD Modeling',
        milestones: ['Laboratory safety certifications', 'First renewable mini-circuit design'],
      },
      {
        year: 'Year 2: Power Systems & Thermodynamics',
        focus: 'Power Electronics, Fluid Dynamics, PV Physics, Control Engineering',
        milestones: ['Join Engineers Without Borders student chapter', 'Solar irradiation site assessment project'],
      },
      {
        year: 'Year 3: Grid Integration & Industrial Placement',
        focus: 'High Voltage Engineering, Battery Storage Chemistry, Smart Grid Telemetry',
        milestones: ['Industrial training attachment at a regional power utility or independent power producer (IPP)'],
      },
      {
        year: 'Year 4: Regional Grid Capstone',
        focus: 'Microgrid Islanding, Power Economics, Energy Regulatory Policy',
        milestones: ['Design scalable rural microgrid prototype', 'Submission to African Union Energy Forum'],
      },
    ],
    targetDisciplines: ['Engineering', 'Electrical', 'Mechanical', 'Renewable', 'Energy'],
    aiPrompts: [
      {
        label: 'Utility vs IPP Hiring Standards',
        prompt: 'What are the comparative technical requirements and interview assessments for graduate grid engineers applying to national utilities (KenGen, Eskom) versus private Independent Power Producers (IPPs)?',
      },
      {
        label: 'Key Certifications: SCADA & PVsyst',
        prompt: 'Which professional certifications, software skills (PVsyst, ETAP, SCADA telemetry), and safety credentials carry the highest weight for solar and wind energy projects in Africa?',
      },
      {
        label: 'Decentralized Microgrid Roadmap',
        prompt: 'How can an African engineering student prepare to design, finance, and deploy off-grid solar-battery microgrids in rural and peri-urban communities under current regional energy regulations?',
      },
    ],
  },
  {
    id: 'biomedical_health',
    title: 'Epidemiologist & Health Systems Researcher',
    field: 'Clinical Medicine & Health Sciences',
    code: 'MED',
    growthRate: '+30% 5-Yr Growth in Africa',
    demandTier: 'Sovereign Public Health Priority',
    startingSalaryUsd: '$20,000 – $30,000',
    midSalaryUsd: '$42,000 – $62,000',
    seniorSalaryUsd: '$70,000 – $105,000+',
    primaryHubs: ['Cape Town', 'Kigali', 'Nairobi', 'Accra', 'Cairo'],
    recommendedMajors: ['MBChB / Medicine', 'BSc Public Health', 'BSc Biomedical Sciences'],
    keyEmployers: ['Africa CDC', 'World Health Organization (AFRO)', 'BioNTech Kigali', 'KEMRI', 'National Institute for Communicable Diseases (NICD)'],
    strategicSummary: 'Post-pandemic health sovereignty has catalyzed major investments in continental vaccine manufacturing facilities, genomic surveillance centers, and clinical trial networks across Africa.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Cellular Biology & Organic Chemistry',
        focus: 'Human Anatomy, Biochemistry, Medical Genetics, Biostatistics',
        milestones: ['Laboratory containment protocol certification', 'Clinical shadowing introduction'],
      },
      {
        year: 'Year 2: Pathology & Infectious Diseases',
        focus: 'Immunology, Microbiology, Pharmacology, Pathophysiology',
        milestones: ['Field research on vector-borne disease transmission', 'Genomic analysis rotation'],
      },
      {
        year: 'Year 3: Clinical Epidemiology & Field Trials',
        focus: 'Clinical Diagnostics, Health Economics, Epidemiology of Communicable Diseases',
        milestones: ['Hospital ward clerkships and public health community intervention rotation'],
      },
      {
        year: 'Year 4: Public Health Policy & Thesis',
        focus: 'Biosecurity, Health Systems Management, Clinical Trials Design',
        milestones: ['Co-author peer-reviewed clinical surveillance study', 'Africa CDC internship pathway'],
      },
    ],
    targetDisciplines: ['Medicine', 'Health', 'Clinical', 'Pharmacy', 'Nursing', 'Biomedical'],
    aiPrompts: [
      {
        label: 'Africa CDC & WHO AFRO Entry Routes',
        prompt: 'What are the formal graduate recruitment paths, fellowship programs, and prerequisites for young researchers aiming to join Africa CDC or WHO AFRO regional surveillance hubs?',
      },
      {
        label: 'Essential Computational Health Stack',
        prompt: 'Which data analysis frameworks (R, Python, DHIS2, Stata, spatial GIS) are non-negotiable for modern African epidemiological surveillance and vaccine trial management?',
      },
      {
        label: 'Funded Continental Health Scholarships',
        prompt: 'What are the top fully-funded postgraduate scholarship schemes (e.g. Wellcome Trust, Mastercard Foundation, DAAD) supporting African students in epidemiology and infectious disease biology?',
      },
    ],
  },
  {
    id: 'fintech_quant',
    title: 'Quantitative Finance & Fintech Risk Analyst',
    field: 'Business, Economics & Finance',
    code: 'BUS',
    growthRate: '+36% 5-Yr Growth in Africa',
    demandTier: 'Rapid Corporate Expansion',
    startingSalaryUsd: '$20,000 – $29,000',
    midSalaryUsd: '$40,000 – $60,000',
    seniorSalaryUsd: '$72,000 – $100,000+',
    primaryHubs: ['Johannesburg', 'Lagos', 'Nairobi', 'Cairo', 'Casablanca'],
    recommendedMajors: ['BCom Actuarial Science', 'BSc Quantitative Finance', 'BCom Economics & Statistics'],
    keyEmployers: ['Standard Bank Group', 'Absa Capital', 'Flutterwave', 'Interswitch', 'African Export-Import Bank (Afreximbank)'],
    strategicSummary: 'Africa leads global mobile money transaction volumes. Quantitative analysts who master algorithmic risk models, cross-currency settlements under AfCFTA, and digital credit scoring are in unprecedented demand.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Microeconomics & Statistical Analysis',
        focus: 'Financial Accounting, Micro/Macro Theory, Matrix Algebra, Probability Modeling',
        milestones: ['Financial modeling certification in Excel & R', 'Student investment society portfolio team'],
      },
      {
        year: 'Year 2: Econometrics & Financial Mathematics',
        focus: 'Time Series Econometrics, Corporate Finance, Derivative Pricing, Python for Finance',
        milestones: ['Inter-varsity algorithmic trading competition', 'Pass preliminary actuarial / CFA exam'],
      },
      {
        year: 'Year 3: Risk Engineering & Banking Internship',
        focus: 'Credit Risk Modeling, Fixed Income Analysis, Portfolio Optimization, FinTech Architecture',
        milestones: ['Investment banking or fintech risk division internship placement'],
      },
      {
        year: 'Year 4: Cross-Border Trade & Valuation Capstone',
        focus: 'AfCFTA Currency Protocol, Regulatory Technology (RegTech), Applied Valuation',
        milestones: ['Institutional valuation presentation to capital market committee', 'Full-time analyst placement'],
      },
    ],
    targetDisciplines: ['Business', 'Economics', 'Finance', 'Commerce', 'Accounting', 'Management'],
    aiPrompts: [
      {
        label: 'JSE & NSE Trading Desk Criteria',
        prompt: 'What mathematical, statistical, and algorithmic programming competencies are required by quantitative trading desks at the Johannesburg Stock Exchange, Nairobi Securities Exchange, and international investment banks?',
      },
      {
        label: 'CFA Charter vs MFE Degree',
        prompt: 'For an African graduate targeting fintech credit risk and algorithmic trading, is pursuing the CFA charter or a Master of Financial Engineering (MFE) more advantageous?',
      },
      {
        label: 'AfCFTA Cross-Border Settlement Roles',
        prompt: 'How is the Pan-African Payment and Settlement System (PAPSS) and AfCFTA creating new employment demand for quantitative risk, currency hedging, and algorithmic clearing analysts?',
      },
    ],
  },
  {
    id: 'trade_law',
    title: 'Cross-Border Commercial & AfCFTA Legal Counsel',
    field: 'Law, Governance & Public Policy',
    code: 'LAW',
    growthRate: '+26% 5-Yr Growth in Africa',
    demandTier: 'High Strategic Demand',
    startingSalaryUsd: '$19,000 – $28,000',
    midSalaryUsd: '$38,000 – $56,000',
    seniorSalaryUsd: '$68,000 – $98,000+',
    primaryHubs: ['Johannesburg', 'Nairobi', 'Lagos', 'Accra', 'Addis Ababa'],
    recommendedMajors: ['LLB / Bachelor of Laws', 'BA Jurisprudence & International Relations'],
    keyEmployers: ['Bowmans', 'ENSafrica', 'African Union Legal Directorate', 'Cliffe Dekker Hofmeyr', 'Aluko & Oyebode'],
    strategicSummary: 'The operationalization of the African Continental Free Trade Area (AfCFTA) requires legal specialists skilled in cross-border dispute resolution, intellectual property, infrastructure project finance, and tariff law.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Constitutional & Contractual Jurisprudence',
        focus: 'Law of Contract, African Legal History, Constitutional Law, Legal Writing & Analysis',
        milestones: ['First-year moot court tournament participation', 'Legal aid clinic volunteering'],
      },
      {
        year: 'Year 2: Commercial Law & Delict',
        focus: 'Company Law, Law of Property, Delict, International Public Law',
        milestones: ['Editorial team of university law review journal', 'Regional law student debate champion'],
      },
      {
        year: 'Year 3: Cross-Border Arbitration & Project Finance',
        focus: 'Commercial Arbitration, Maritime Law, Intellectual Property, AfCFTA Protocols',
        milestones: ['Vacation clerkship at premier continental corporate law firm'],
      },
      {
        year: 'Year 4: Specialized Moot & Professional Bar Track',
        focus: 'International Trade Litigation, Sovereign Debt Restructuring, Final Dissertation',
        milestones: ['Continental All-Africa Human Rights or Jessup Moot Court representation', 'Bar school admissions'],
      },
    ],
    targetDisciplines: ['Law', 'Legal', 'Jurisprudence', 'Policy'],
    aiPrompts: [
      {
        label: 'Cross-Border Bar Licensing in Africa',
        prompt: 'What are the statutory bar conversion requirements and cross-border practice rights for an African corporate lawyer working between ECOWAS (Nigeria, Ghana) and EAC (Kenya, Rwanda)?',
      },
      {
        label: 'Securing Tier-1 Law Firm Clerkships',
        prompt: 'What academic credentials, moot court accomplishments, and legal drafting samples do premier African commercial law firms (Bowmans, ENSafrica, ALN) look for in vacation clerkship candidates?',
      },
      {
        label: 'AfCFTA Dispute & Arbitration Strategy',
        prompt: 'What curriculum focus and arbitration certifications (e.g. CIArb) prepare a law student to handle AfCFTA tariff disputes, sovereign infrastructure concessions, and international investment arbitration?',
      },
    ],
  },
  {
    id: 'agritech',
    title: 'Agritech Systems & Food Security Specialist',
    field: 'Agriculture & Food Security Systems',
    code: 'AGR',
    growthRate: '+31% 5-Yr Growth in Africa',
    demandTier: 'Strategic Continental Priority',
    startingSalaryUsd: '$17,000 – $25,000',
    midSalaryUsd: '$35,000 – $52,000',
    seniorSalaryUsd: '$62,000 – $88,000+',
    primaryHubs: ['Nairobi', 'Addis Ababa', 'Ibadan', 'Stellenbosch', 'Kumasi'],
    recommendedMajors: ['BSc Agricultural Economics', 'BSc Precision Agronomy', 'BSc Food Science & Technology'],
    keyEmployers: ['International Institute of Tropical Agriculture (IITA)', 'Twiga Foods', 'AGRA', 'Olam International', 'World Food Programme Africa'],
    strategicSummary: 'Transforming African smallholder yields into climate-resilient commercial supply chains requires agricultural experts adept at precision irrigation, satellite crop monitoring, post-harvest logistics, and biotechnology.',
    curriculumRoadmap: [
      {
        year: 'Year 1: Soil Science & Plant Physiology',
        focus: 'Agricultural Botany, Chemistry of Soils, Microeconomics, Agro-Meteorology',
        milestones: ['Agronomy field station rotations', 'Crop yield trial recording'],
      },
      {
        year: 'Year 2: Crop Protection & Precision Tech',
        focus: 'Plant Pathology, Irrigation Hydraulics, GIS Mapping, Remote Sensing in Agriculture',
        milestones: ['Drone-based field health surveillance project', 'Student Agritech Innovation Club'],
      },
      {
        year: 'Year 3: Supply Chain Economics & Farm Placement',
        focus: 'Post-Harvest Engineering, Commodity Trading, Cold Chain Logistics, Agro-Finance',
        milestones: ['6-month practical attachment at commercial agro-processing estate or research institute'],
      },
      {
        year: 'Year 4: Climate Resilience & Commercialization Capstone',
        focus: 'Drought-Resistant Seed Biotechnology, Export Quality Compliance, Final Thesis',
        milestones: ['Field trial validation of climate-smart crop methodology', 'Agribusiness venture pitching'],
      },
    ],
    targetDisciplines: ['Agriculture', 'Veterinary', 'Agronomy', 'Food Security', 'Forestry'],
    aiPrompts: [
      {
        label: 'IITA & AGRA Graduate Recruitment',
        prompt: 'What agronomic research credentials, field trial experiences, and publication backgrounds do institutions like IITA, AGRA, and international agro-enterprises prioritize when hiring junior specialists?',
      },
      {
        label: 'Drone & Satellite Remote Sensing Stack',
        prompt: 'Which drone surveying licenses, multispectral imaging tools (NDVI), and GIS software packages are most in-demand for commercial precision agriculture across East and West Africa?',
      },
      {
        label: 'Lab-to-Commercial Venture Incubation',
        prompt: 'How can an African university agritech researcher commercialize a drought-tolerant crop prototype or precision irrigation algorithm into an investable agritech startup?',
      },
    ],
  },
];

export default function CareerMatchPage() {
  const { universities } = useUniversities();
  const { addToCompare, isInCompare } = useCompare();

  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai_ml');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // AI Assistant Chat State
  const aiConsoleRef = useRef<HTMLElement>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; provider?: string }>
  >([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isQueryingAi, setIsQueryingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Preset Track AI Strategy Dossier State
  const [trackBriefings, setTrackBriefings] = useState<
    Record<string, { answer: string; provider?: string }>
  >({});
  const [loadingTrackBriefingId, setLoadingTrackBriefingId] = useState<string | null>(null);
  const [trackBriefingError, setTrackBriefingError] = useState<string | null>(null);

  const SUGGESTED_QUESTIONS = [
    'What degrees prepare me best for an Applied AI or Data Science career in Nairobi or Lagos?',
    'What are the statutory bar and licensing steps for a cross-border commercial lawyer under AfCFTA?',
    'How should an African graduate format their CV for renewable energy or solar grid projects?',
  ];

  const handleAskCareersAi = async (overridePrompt?: string) => {
    const question = (overridePrompt || inputPrompt).trim();
    if (!question || isQueryingAi) return;

    if (question.length > 1000) {
      setAiError('Questions must be within 1,000 characters.');
      return;
    }

    setAiError(null);
    setIsQueryingAi(true);

    const updated = [...chatMessages, { role: 'user' as const, text: question }];
    setChatMessages(updated);
    setInputPrompt('');

    try {
      const res = await fetch('/api/careers-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Unable to contact advisory service.');
      }

      setChatMessages([
        ...updated,
        {
          role: 'assistant',
          text: data.answer,
          provider: data.provider,
        },
      ]);
    } catch (err: any) {
      setAiError(err.message || 'The AI assistant is temporarily unavailable. Please try again shortly.');
    } finally {
      setIsQueryingAi(false);
    }
  };

  const handleGenerateTrackBriefing = async (career: CareerPathPreset) => {
    if (loadingTrackBriefingId) return;
    setLoadingTrackBriefingId(career.id);
    setTrackBriefingError(null);

    const prompt = `Provide an executive career strategy & market intelligence dossier for ${career.title} in African economies. Detail: 1) High-growth continental specializations and economic catalysts under AfCFTA, 2) Core employer evaluation criteria at premier organizations (such as ${career.keyEmployers.slice(0, 3).join(', ')}), 3) Key regulatory, professional licensing, or certification benchmarks, and 4) High-impact portfolio projects and electives for African students.`;

    try {
      const res = await fetch('/api/careers-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to generate track briefing.');
      }

      setTrackBriefings((prev) => ({
        ...prev,
        [career.id]: {
          answer: data.answer,
          provider: data.provider,
        },
      }));
    } catch (err: any) {
      setTrackBriefingError(err.message || 'Unable to generate track briefing at this time.');
    } finally {
      setLoadingTrackBriefingId(null);
    }
  };

  const handleSelectTrackPrompt = (prompt: string) => {
    handleAskCareersAi(prompt);
    if (aiConsoleRef.current) {
      aiConsoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeCareer = useMemo(() => {
    return PRESET_CAREERS.find((c) => c.id === selectedCareerId) || PRESET_CAREERS[0];
  }, [selectedCareerId]);

  const matchedUniversities = useMemo(() => {
    return universities
      .filter((u) => {
        if (selectedRegion !== 'all' && u.region !== selectedRegion) return false;
        const hasMatchingFaculty = u.flagshipFaculties?.some((f) =>
          activeCareer.targetDisciplines.some((td) => f.toLowerCase().includes(td.toLowerCase()))
        );
        return hasMatchingFaculty;
      })
      .sort((a, b) => b.employabilityScore - a.employabilityScore)
      .slice(0, 4);
  }, [universities, selectedRegion, activeCareer]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-10">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">
          Home
        </Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">AI Career Pathways &amp; Degree Match</span>
      </nav>

      {/* ─── Header Masthead ─── */}
      <header className="border-b border-[#e9e9e9] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="font-code-badge text-white px-3 py-1 font-semibold"
            style={{ background: '#164A3A', borderRadius: '20px' }}
          >
            AI CAREER INTELLIGENCE ENGINE
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
            2027 CONTINENTAL EMPLOYABILITY CORRIDORS
          </span>
        </div>

        <h1 className="font-headline-lg text-[#232323] m-0 mb-3 text-3xl sm:text-4xl font-serif font-bold">
          African Career Match &amp; Degree Roadmap Engine
        </h1>

        <p className="font-body-lg text-[#676963] max-w-3xl m-0 leading-relaxed text-sm sm:text-base">
          Align your career ambitions with the highest-employability degree programmes across Africa. Powered by empirical graduate destination data, corporate hiring indices, and economic expansion forecasts under the AfCFTA.
        </p>

        {/* Career Preset Buttons Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#f1f5f9]">
          <span className="text-xs font-semibold text-[#838383] uppercase tracking-wider self-center mr-2">
            Preset Career Tracks:
          </span>
          {PRESET_CAREERS.map((c) => {
            const isActive = selectedCareerId === c.id;
            const hasAiDossier = !!trackBriefings[c.id];
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCareerId(c.id);
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                  isActive
                    ? 'bg-[#09090B] text-white border-[#09090B] shadow-sm'
                    : 'bg-white text-[#232323] border-[#e2e8f0] hover:border-[#164A3A] hover:text-[#164A3A]'
                }`}
              >
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F7F6F2] text-[#164A3A]'
                  }`}
                >
                  {c.code}
                </span>
                <span>{c.title}</span>
                <span
                  className={`font-mono text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#faf5ff] text-[#164A3A] border border-[#f3e8ff]'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {hasAiDossier ? 'AI READY' : 'AI'}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── AHEI Careers AI Assistant Console ─── */}
      <section
        ref={aiConsoleRef}
        id="ai-assistant-console"
        className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-8 shadow-sm space-y-6"
        aria-labelledby="ai-assistant-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e9e9e9]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="font-code-badge text-white px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: '#09090B', borderRadius: '12px' }}
              >
                AHEI CAREERS AI ASSISTANT
              </span>
              <span className="text-xs text-[#838383] font-mono bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-full">
                GROUNDED CONTINENTAL ADVISORY
              </span>
            </div>
            <h2 id="ai-assistant-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#232323] m-0">
              Ask the Higher Education &amp; Career Assistant
            </h2>
            <p className="font-body-sm text-[#838383] m-0 mt-1">
              Inquire about African degree prerequisites, graduate skills, AfCFTA hiring hubs, or CV tailoring.
            </p>
          </div>

          {chatMessages.length > 0 && (
            <button
              onClick={() => {
                setChatMessages([]);
                setAiError(null);
              }}
              className="text-xs text-[#838383] hover:text-[#09090B] border border-[#e2e8f0] hover:border-[#09090B] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition bg-white shrink-0 self-start sm:self-auto font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs text-xs text-[#676963] flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#164A3A] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#232323]">Privacy Notice:</strong> Please do not enter passport numbers, national ID details, grades or sensitive personal information. AI can make mistakes. Free AI services may process what you type. Check official sources before acting.
          </div>
        </div>

        {/* Error State */}
        {aiError && (
          <div className="p-3.5 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs font-semibold rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Empty State with 3 Suggested Questions */}
        {chatMessages.length === 0 && (
          <div className="space-y-3 py-1">
            <span className="text-xs font-semibold text-[#232323] uppercase tracking-wider block">
              Suggested Starting Inquiries:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskCareersAi(question)}
                  disabled={isQueryingAi}
                  className="bg-[#f8fafc] hover:bg-white border border-[#e2e8f0] hover:border-[#164A3A] hover:shadow-xs p-4 text-left text-xs text-[#232323] rounded-xs cursor-pointer transition-all flex flex-col justify-between group disabled:opacity-50"
                >
                  <span className="leading-relaxed mb-3 font-medium text-[#232323] group-hover:text-[#164A3A]">
                    {question}
                  </span>
                  <span className="text-[11px] font-semibold text-[#164A3A] flex items-center gap-1 mt-auto">
                    <span>Ask this</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Thread Messages */}
        {chatMessages.length > 0 && (
          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {chatMessages.map((msg, index) => (
              <div key={index} className="space-y-1.5">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-2xl bg-[#F7F6F2] text-[#1e3a8a] border border-[#D9D7D0] px-4 py-3 text-xs rounded-none rounded-tr-xs font-sans">
                      <span className="font-semibold block mb-1 text-[#1e40af]">You:</span>
                      <p className="m-0 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-2xl bg-white border border-[#e2e8f0] shadow-xs px-5 py-3.5 text-xs rounded-none rounded-tl-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-[#164A3A] text-white px-2 py-0.5 rounded-full">
                          AHEI AI
                        </span>
                        {msg.provider && (
                          <span className="font-mono text-[10px] text-[#838383]">
                            via {msg.provider}
                          </span>
                        )}
                      </div>
                      <div className="font-body text-[#232323] leading-relaxed whitespace-pre-wrap text-xs">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isQueryingAi && (
              <div className="flex justify-start">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 text-xs rounded-none flex items-center gap-2.5 text-[#838383]">
                  <span className="font-mono text-[10px] font-bold bg-[#164A3A] text-white px-2 py-0.5 rounded-full">
                    AHEI AI
                  </span>
                  <span className="animate-pulse">Consulting African career registry &amp; synthesizing guidance…</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Form Console */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskCareersAi();
          }}
          className="space-y-2 pt-3 border-t border-[#e9e9e9]"
        >
          <div className="relative">
            <input
              type="text"
              aria-label="Ask the Careers AI Assistant"
              value={inputPrompt}
              maxLength={1000}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about degrees, career skills, AfCFTA hubs, or CV tips (e.g. 'What degrees lead to renewable energy projects in Kenya?')..."
              className="w-full px-4 py-3 text-xs border border-[#e2e8f0] rounded-xs bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#164A3A] focus:ring-1 focus:ring-[#164A3A] pr-32 transition-all shadow-xs"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#838383] hidden sm:inline">
                {inputPrompt.length}/1000
              </span>
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isQueryingAi}
                className="bg-[#164A3A] hover:bg-[#3442db] text-white text-xs font-semibold py-1.5 px-3.5 rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>{isQueryingAi ? 'Thinking…' : 'Send'}</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ─── Active Career Executive Dossier ─── */}
      <section className="space-y-6">
        {/* Executive Header Card */}
        <div className="the-card bg-white p-6 sm:p-8 rounded-none border border-[#e9e9e9] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e9e9e9]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#164A3A] bg-[#F7F6F2] px-2.5 py-0.5 rounded-full border border-[#D9D7D0]">
                  [{activeCareer.code}] {activeCareer.field}
                </span>
                <span className="text-xs font-semibold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-0.5 rounded-full">
                  {activeCareer.growthRate}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323] m-0 mb-1.5">
                {activeCareer.title}
              </h2>
              <span className="text-xs font-mono text-[#838383] uppercase tracking-wider">
                Status: <strong className="text-[#232323]">{activeCareer.demandTier}</strong>
              </span>
            </div>

            {/* Compensation Bands Card */}
            <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs text-right shrink-0">
              <span className="text-[11px] font-semibold text-[#838383] uppercase tracking-wider block mb-1">
                Continental Salary Ranges (Annual USD)
              </span>
              <div className="flex items-baseline justify-end gap-4 mt-1 font-mono">
                <div>
                  <span className="text-[10px] text-[#838383] block">Entry Level</span>
                  <span className="font-bold text-xs text-[#232323]">{activeCareer.startingSalaryUsd}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#838383] block">Mid-Career</span>
                  <span className="font-bold text-xs text-[#164A3A]">{activeCareer.midSalaryUsd}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#838383] block">Senior Lead</span>
                  <span className="font-bold text-xs text-[#164A3A]">{activeCareer.seniorSalaryUsd}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="font-body-md text-[#676963] mt-5 mb-5 leading-relaxed max-w-4xl text-sm sm:text-base">
            {activeCareer.strategicSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f1f5f9] text-xs">
            <div>
              <span className="font-semibold text-[#232323] block mb-2">Primary Continental Hiring Hubs:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCareer.primaryHubs.map((hub) => (
                  <span key={hub} className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#232323] rounded-full font-mono text-[11px]">
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-[#232323] block mb-2">Key Corporate &amp; Institutional Employers:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCareer.keyEmployers.map((emp) => (
                  <span key={emp} className="px-2.5 py-1 bg-[#F7F6F2] text-[#1e40af] border border-[#D9D7D0] rounded-full font-medium text-[11px]">
                    {emp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Track AI Strategy & Market Intelligence Panel ─── */}
        <div className="the-card bg-white p-6 sm:p-8 rounded-none border border-[#e9e9e9] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e9e9e9]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-code-badge bg-[#164A3A] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-[#FAF5EB]" />
                  AHEI AI STRATEGY DOSSIER
                </span>
                <span className="text-xs text-[#838383] font-mono bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-full">
                  [{activeCareer.code}] TRACK ADVISORY
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#232323] m-0">
                AI Career Strategy &amp; Market Intelligence: {activeCareer.title}
              </h3>
              <p className="font-body-sm text-[#838383] m-0 mt-1">
                Synthesize real-time hiring demand, corporate benchmarks, and curriculum optimization for this continental career track.
              </p>
            </div>

            <button
              onClick={() => handleGenerateTrackBriefing(activeCareer)}
              disabled={loadingTrackBriefingId === activeCareer.id}
              className="bg-[#164A3A] hover:bg-[#3442db] text-white text-xs font-semibold py-2 px-4 rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto transition-colors shadow-xs"
            >
              {loadingTrackBriefingId === activeCareer.id ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Strategy…</span>
                </>
              ) : trackBriefings[activeCareer.id] ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh AI Briefing</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Synthesize AI Track Dossier</span>
                </>
              )}
            </button>
          </div>

          {/* Track AI Briefing Content */}
          {trackBriefingError && loadingTrackBriefingId === null && (
            <div className="mt-4 p-3.5 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs font-semibold rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{trackBriefingError}</span>
            </div>
          )}

          {loadingTrackBriefingId === activeCareer.id && (
            <div className="mt-4 bg-[#f8fafc] border border-[#e2e8f0] p-4 text-xs text-[#838383] rounded-xs flex items-center gap-2.5">
              <span className="font-mono text-[10px] font-bold bg-[#164A3A] text-white px-2 py-0.5 rounded-full">
                AHEI AI
              </span>
              <span className="animate-pulse">
                Consulting pan-African employment databases &amp; synthesizing strategic dossier for {activeCareer.title}…
              </span>
            </div>
          )}

          {trackBriefings[activeCareer.id] && loadingTrackBriefingId !== activeCareer.id && (
            <div className="mt-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold bg-[#164A3A] text-white px-2 py-0.5 rounded-full">
                    SYNTHESIZED STRATEGIC BRIEFING
                  </span>
                  {trackBriefings[activeCareer.id].provider && (
                    <span className="font-mono text-[10px] text-[#838383]">
                      via {trackBriefings[activeCareer.id].provider}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-[#838383]">
                  AHEI Continental Registry
                </span>
              </div>

              <div className="font-body text-xs text-[#232323] leading-relaxed whitespace-pre-wrap">
                {trackBriefings[activeCareer.id].answer}
              </div>

              <div className="pt-2 border-t border-[#e2e8f0] text-[10px] text-[#838383] font-mono">
                Advisory note: Recommendations are synthesized from empirical educational &amp; labor indices. Professional certifications and statutory bar qualifications are subject to national regulatory accreditation.
              </div>
            </div>
          )}

          {/* Quick AI Inquiries for this track */}
          <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
            <span className="text-[11px] font-semibold text-[#232323] uppercase tracking-wider block mb-3">
              Instant AI Track Inquiries (Click to Query Assistant):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCareer.aiPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTrackPrompt(p.prompt)}
                  disabled={isQueryingAi}
                  className="p-4 text-left bg-[#f8fafc] hover:bg-white border border-[#e2e8f0] hover:border-[#164A3A] hover:shadow-xs rounded-xs transition-all cursor-pointer flex flex-col justify-between gap-2.5 group disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-1.5 py-0.5 rounded-md">
                      Q{idx + 1}
                    </span>
                    <span className="font-semibold text-xs text-[#232323] group-hover:text-[#164A3A]">
                      {p.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#838383] line-clamp-2 leading-relaxed">
                    {p.prompt}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#164A3A] font-semibold pt-1">
                    <span>Ask AI Assistant</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Google Ad Space: Careers Leaderboard ─── */}
        <GoogleAdSpace format="leaderboard" label="ADVERTISEMENT" className="my-6" />

        {/* ─── Recommended Top African Universities for this Career Track ─── */}
        <div className="the-card bg-white p-6 sm:p-8 rounded-none border border-[#e9e9e9] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#e9e9e9] mb-5">
            <div>
              <span className="font-mono text-[11px] font-bold text-[#164A3A] block mb-0.5 uppercase tracking-wider">
                ACADEMIC ACCREDITATION &amp; PLACEMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#232323] m-0">
                Top African Universities for {activeCareer.title}
              </h3>
            </div>
            <Link href="/rankings" className="text-xs font-semibold text-[#164A3A] hover:underline no-underline">
              View All Rankings →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchedUniversities.map((u, idx) => (
              <div key={u.id} className="the-card p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex flex-col justify-between hover:border-[#164A3A] hover:bg-white hover:shadow-xs transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-xs font-bold text-[#164A3A] bg-[#F7F6F2] px-2 py-0.5 rounded-full">
                      #{idx + 1} Top Pick
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#838383] bg-white px-2 py-0.5 rounded-full border border-[#e2e8f0]">
                      {u.countryCode.toUpperCase()}
                    </span>
                  </div>

                  {u.crestUrl && (
                    <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs mb-3">
                      <img
                        src={u.crestUrl}
                        alt={`${u.name} official crest`}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <h4 className="font-serif font-bold text-sm text-[#232323] mb-1 line-clamp-1">
                    <Link href={`/universities/${u.id}`} className="no-underline hover:text-[#164A3A] transition-colors">
                      {u.name}
                    </Link>
                  </h4>
                  <span className="text-xs text-[#838383] block mb-3 font-sans">
                    {u.city}, {u.country}
                  </span>

                  <div className="space-y-1.5 p-2.5 bg-white border border-[#e2e8f0] rounded-lg text-xs font-mono mb-3">
                    <div className="flex justify-between">
                      <span className="text-[#838383]">Employability:</span>
                      <strong className="text-[#059669]">{u.employabilityScore.toFixed(1)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#838383]">Research:</span>
                      <strong className="text-[#232323]">{u.researchScore.toFixed(1)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#838383]">Tuition:</span>
                      <span className="text-[#232323]">{u.domesticTuitionUsd || '$1,500/yr'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
                  <Link href={`/universities/${u.id}`} className="font-semibold text-[#164A3A] hover:underline no-underline">
                    Dossier →
                  </Link>
                  <button
                    onClick={() => addToCompare(u.id)}
                    disabled={isInCompare(u.id)}
                    className="text-xs font-semibold px-2 py-0.5 rounded-full border border-[#e2e8f0] bg-white text-[#232323] hover:border-[#164A3A] hover:text-[#164A3A] cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {isInCompare(u.id) ? 'In Compare' : '+ Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 4-Year Academic & Skill Execution Roadmap ─── */}
        <div className="the-card bg-white p-6 sm:p-8 rounded-none border border-[#e9e9e9] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#e9e9e9] mb-5">
            <div>
              <span className="font-mono text-[11px] font-bold text-[#164A3A] block mb-0.5 uppercase tracking-wider">
                CURRICULUM ARCHITECTURE
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#232323] m-0">
                4-Year Degree &amp; Professional Competency Roadmap
              </h3>
            </div>
            <span className="text-xs text-[#838383] font-mono hidden sm:inline bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 rounded-full">
              Accredited Continental Framework
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCareer.curriculumRoadmap.map((step) => (
              <div key={step.year} className="the-card p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs space-y-3">
                <span className="font-code-badge bg-[#09090B] text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold block w-fit">
                  {step.year}
                </span>

                <div>
                  <span className="text-[11px] font-semibold text-[#838383] block uppercase tracking-wider mb-1">
                    Curriculum Core Focus:
                  </span>
                  <p className="font-body-sm text-[#232323] m-0 leading-relaxed font-medium">
                    {step.focus}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#e2e8f0]">
                  <span className="text-[11px] font-semibold text-[#164A3A] block uppercase tracking-wider mb-1">
                    Strategic Milestones:
                  </span>
                  <ul className="text-xs text-[#676963] pl-4 space-y-1 m-0">
                    {step.milestones.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
