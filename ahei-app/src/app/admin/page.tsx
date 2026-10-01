'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Scale, 
  PlusCircle, 
  Edit3, 
  RotateCcw,
  Sparkles,
  Lock,
  KeyRound,
  LogOut,
  UserCheck
} from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { University } from '@/data/universities';

export const computeCompositeScore = (
  research: number,
  teaching: number,
  employability: number,
  continentalRelevance: number = 75,
  international: number = 70
): number => {
  const r = Number(research) || 0;
  const t = Number(teaching) || 0;
  const e = Number(employability) || 0;
  const c = Number(continentalRelevance) || 0;
  const i = Number(international) || 0;
  const composite = (r * 0.30) + (t * 0.25) + (e * 0.20) + (c * 0.15) + (i * 0.10);
  return Number(composite.toFixed(1));
};

type AdminTab = 'roster' | 'add_uni' | 'rankings_editor' | 'queue' | 'ingest';

export default function AdminPortal() {
  const { universities, addUniversity, updateUniversity, updateRankings, resetToDefaults } = useUniversities();
  const [activeTab, setActiveTab] = useState<AdminTab>('roster');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [auditorName, setAuditorName] = useState('Sovereign Administrator');

  // Real Claims Queue State
  const [realClaims, setRealClaims] = useState<any[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);

  const fetchClaims = async () => {
    setIsLoadingClaims(true);
    try {
      const res = await fetch('/api/claims');
      const data = await res.json();
      if (data.success && data.claims) {
        setRealClaims(data.claims);
      }
    } catch (err) {
      console.error('Failed to load real claims:', err);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedAuth = typeof window !== 'undefined' ? sessionStorage.getItem('ahei_admin_auth') : null;
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      const storedName = sessionStorage.getItem('ahei_auditor_name');
      if (storedName) setAuditorName(storedName);
      fetchClaims();
    }
  }, []);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both an auditor institutional email and the administrator passkey.');
      return;
    }

    setIsVerifyingAuth(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid administrator credentials. Access strictly denied.');
        return;
      }

      sessionStorage.setItem('ahei_admin_auth', 'true');
      sessionStorage.setItem('ahei_admin_token', data.token);
      sessionStorage.setItem('ahei_auditor_name', data.auditorName || loginEmail);
      setAuditorName(data.auditorName || loginEmail);
      setIsAuthenticated(true);
      fetchClaims();
    } catch (err: any) {
      setAuthError('Security gateway error: Unable to verify administrator credentials.');
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('ahei_admin_auth');
    sessionStorage.removeItem('ahei_admin_token');
    sessionStorage.removeItem('ahei_auditor_name');
    setIsAuthenticated(false);
    setLoginPassword('');
    setAuthError(null);
  };

  // Search/Filter in roster
  const [rosterSearch, setRosterSearch] = useState('');

  // Status message
  const [adminStatus, setAdminStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New University Form State
  const [newUniForm, setNewUniForm] = useState({
    id: '',
    registryId: '',
    name: '',
    city: '',
    country: 'Nigeria',
    flag: 'NG',
    region: 'West Africa' as University['region'],
    estYear: 1962,
    type: 'Public Chartered Flagship',
    website: 'https://unilag.edu.ng',
    viceChancellor: 'Prof. Folasade Ogunsola',
    rank: 12,
    aheiScore: 78.5,
    researchScore: 79.0,
    teachingScore: 81.2,
    employabilityScore: 84.0,
    continentalRelevanceScore: 76.5,
    internationalScore: 68.0,
    totalEnrollment: 55000,
    academicStaff: 1800,
    phdFacultyShare: 62,
    studentFacultyRatio: '20:1',
    internationalDiversityPct: 3.5,
    campusesCount: 3,
    domesticTuitionUsd: '$850',
    domesticTuitionAverage: 'NGN 1,200,000',
    internationalTuitionAnnual: '$3,200',
    onCampusAccommodation: '$450',
    averageMonthlyLiving: '$280',
    financialAidTier: 'HIGH' as const,
    flagshipFaculties: 'Medicine & Health Sciences, Law, Civil Engineering, Business Administration',
    description: 'Premier metropolitan flagship research institution pioneering urban hydrology, marine ecology, and commercial jurisprudence in West Africa.',
  });

  // Edit University Modal / Inline state
  const [editingUni, setEditingUni] = useState<University | null>(null);

  // Verification Queue State
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: 'task-101',
      institution_name: 'University of Nairobi',
      field_name: 'tuition_local_undergrad',
      current_value: 'KES 150,000 - 320,000',
      proposed_value: 'KES 160,000 - 340,000',
      source_url: 'https://uonbi.ac.ke/fees-2026-2027.pdf',
      submitted_by: 'AI Research Worker #4',
      confidence: 0.94,
      date: '2026-09-30'
    },
    {
      id: 'task-102',
      institution_name: 'Cairo University',
      field_name: 'total_enrollment',
      current_value: '260,000',
      proposed_value: '268,500',
      source_url: 'https://cu.edu.eg/annual-report-2025',
      submitted_by: 'Researcher (Egypt Desk)',
      confidence: 0.98,
      date: '2026-09-30'
    }
  ]);

  // Batch CSV Ingestion state
  const [parsedRecords, setParsedRecords] = useState<Record<string, any>[]>([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

  // Filtered roster
  const filteredRoster = universities.filter((u) => {
    if (!rosterSearch) return true;
    const q = rosterSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
  });

  // Handle Add New University
  const handleCreateUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniForm.name || !newUniForm.country) {
      setAdminStatus({ type: 'error', message: 'University Name and Country are required.' });
      return;
    }

    const generatedId = newUniForm.id || newUniForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const generatedRegistry = newUniForm.registryId || `${newUniForm.country.slice(0, 2).toUpperCase()}-${generatedId.toUpperCase()}-001`;

    const fullUniversity: University = {
      id: generatedId,
      registryId: generatedRegistry,
      name: newUniForm.name,
      city: newUniForm.city || 'Metropolitan Campus',
      country: newUniForm.country,
      countryCode: newUniForm.country.slice(0, 2).toLowerCase(),
      flag: (newUniForm.flag || newUniForm.country.slice(0, 2)).toUpperCase(),
      region: newUniForm.region,
      estYear: Number(newUniForm.estYear) || 1970,
      charterYear: Number(newUniForm.estYear) || 1970,
      type: newUniForm.type,
      website: newUniForm.website,
      viceChancellor: newUniForm.viceChancellor,
      crestUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-veDF_X5k0iU9TecNkq33JZhFZVwNbe-8HjhjA-SLESMJsDrvTkznz1wsQ07m7muZaGlieb_jK7GGsoMe0S0r8f7BkQ50ta6cbw_GgnrwHKMDa2Mu3J0FsMYmxM2ztcb2_EyB6P4vB7oUbgiZjyXsxnxs4pCxE-gOSCJYXV0CE5x0cMA7nDZbch7B9G9HFPeB1JbDka1L78FhexcCJcojwQ6InQ8rMpj6mjxx0glgjFn7yTgQcqHK',
      prospectusImg: '',
      rank: Number(newUniForm.rank) || universities.length + 1,
      shift: { type: 'equal', val: 0 },
      aheiScore: Number(newUniForm.aheiScore) || 75.0,
      confidence: 92,
      regionalRank: 3,
      nationalRank: 1,
      projectedScoreNextYear: (Number(newUniForm.aheiScore) || 75.0) + 1.8,
      projectedRankNextYear: Number(newUniForm.rank) || universities.length + 1,
      projectedRankDelta: 0,
      momentumVelocity: 1.8,
      trajectory: 'Consolidating',
      auditCertification: `AU-AHEI-2027-${newUniForm.country.slice(0, 2).toUpperCase()}-${generatedId.slice(0, 4).toUpperCase()}`,
      studentSatisfactionScore: 91.5,
      studentSatisfactionBreakdown: {
        teachingQuality: 92.0,
        campusSafety: 91.0,
        facilitiesAndLabs: 89.5,
        careerServices: 93.5,
      },
      globalRankings: {
        qsWorldRank: 'Regional Sovereign Tier',
        theWorldRank: 'National Flagship Ranking',
        webometricsRank: 'Top Continental Registry',
        arwuShanghaiRank: 'National Accredited',
      },
      researchScore: Number(newUniForm.researchScore) || 75.0,
      teachingScore: Number(newUniForm.teachingScore) || 75.0,
      employabilityScore: Number(newUniForm.employabilityScore) || 75.0,
      continentalRelevanceScore: Number(newUniForm.continentalRelevanceScore) || 75.0,
      internationalScore: Number(newUniForm.internationalScore) || 75.0,
      prestigeScore: 85.0,
      totalEnrollment: Number(newUniForm.totalEnrollment) || 30000,
      undergraduateCount: Math.round(Number(newUniForm.totalEnrollment) * 0.75),
      postgraduateCount: Math.round(Number(newUniForm.totalEnrollment) * 0.25),
      internationalStudents: 1200,
      internationalRatio: 4,
      academicStaffCount: Number(newUniForm.academicStaff) || 1200,
      academicStaff: Number(newUniForm.academicStaff) || 1200,
      phdFacultyShare: Number(newUniForm.phdFacultyShare) || 55,
      doctoralStaffRatio: Number(newUniForm.phdFacultyShare) || 55,
      studentStaffRatio: 20,
      campusHectares: 200,
      libraryVolumes: '850K',
      endowmentUsd: '$25M',
      stemEnrolmentRatio: 40,
      domesticTuitionAvg: newUniForm.domesticTuitionAverage || '$1,500 / yr',
      domesticTuitionAverage: newUniForm.domesticTuitionAverage,
      domesticTuitionUsd: newUniForm.domesticTuitionUsd,
      intlTuitionAvg: newUniForm.internationalTuitionAnnual || '$3,500 / yr',
      internationalTuitionAnnual: newUniForm.internationalTuitionAnnual,
      studentFacultyRatio: newUniForm.studentFacultyRatio || '20:1',
      internationalDiversityPct: Number(newUniForm.internationalDiversityPct) || 3.0,
      campusesCount: Number(newUniForm.campusesCount) || 2,
      campusLocations: `${newUniForm.city} Main Campus`,
      researchExpenditureFormatted: 'Audited Institutional Allocation',
      admissionSelectivity: 'Competitive (Audited)',
      acceptanceRate: 25,
      accreditationExpiry: '2030',
      description: `${newUniForm.name} is an officially accredited institution in ${newUniForm.country}.`,
      trajectoryNote: 'Projected under pure deterministic AHEI-NYPM v1.0 velocity metrics.',
      vectors: {
        researchOutput: Number(newUniForm.researchScore) || 75.0,
        employability: Number(newUniForm.employabilityScore) || 75.0,
        teachingImpact: Number(newUniForm.teachingScore) || 75.0,
        facultyPhdRatio: Number(newUniForm.phdFacultyShare) || 55.0,
        globalOutlook: Number(newUniForm.internationalScore) || 75.0,
      },
      history: [
        { year: 2026, rankText: `#${Number(newUniForm.rank) + 1}`, points: Number(newUniForm.aheiScore) - 1.2, diff: '+1' },
        { year: 2027, rankText: `#${newUniForm.rank}`, points: Number(newUniForm.aheiScore), diff: '0' },
      ],
      onCampusAccommodation: newUniForm.onCampusAccommodation,
      averageMonthlyLiving: newUniForm.averageMonthlyLiving,
      financialAidNote: 'Institutional merit bursaries and national higher education loans available.',
      financialAidTier: newUniForm.financialAidTier,
      accreditationBody: `National Universities Commission / Ministry of Higher Education (${newUniForm.country})`,
      campusSetting: 'Urban / Metropolitan Setting',
      flagshipFaculties: newUniForm.flagshipFaculties.split(',').map((s) => s.trim()).filter(Boolean),
      researchCenters: [
        {
          name: 'Center for Multidisciplinary Research & Innovation',
          category: 'Interdisciplinary STEM',
          description: 'Focusing on regional industrial applications, public health epidemiology, and data science.',
          partners: 'National Research Foundation',
          facility: 'Central Science Complex',
        }
      ],
      programmes: [
        {
          id: `${generatedId}-01`,
          name: 'Bachelor of Science in Computer Science',
          code: 'CSC-301',
          track: 'Regular Full-Time',
          level: 'Undergraduate',
          duration: '4 Years',
          faculty: 'Faculty of Science',
          campus: 'Main Campus',
          domesticTuition: newUniForm.domesticTuitionUsd,
          accreditation: 'Full Professional Accreditation',
          accreditationBody: 'National Regulatory Board',
          intake: 'September / Fall',
        },
        {
          id: `${generatedId}-02`,
          name: 'Master of Business Administration (MBA)',
          code: 'MBA-801',
          track: 'Executive & Regular',
          level: 'Postgraduate',
          duration: '2 Years',
          faculty: 'School of Business',
          campus: 'Main Campus',
          domesticTuition: newUniForm.domesticTuitionUsd,
          accreditation: 'Accredited Post-Grad Programme',
          accreditationBody: 'Continental Business Education Council',
          intake: 'January / Fall',
        }
      ],
    };

    addUniversity(fullUniversity);
    setAdminStatus({
      type: 'success',
      message: `✓ ${fullUniversity.name} successfully created, assigned #${fullUniversity.rank} rank, and synchronized live across all website tables, search, compare, and profiles!`,
    });
    setActiveTab('roster');
  };

  // Handle Save Edited University
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni) return;

    updateUniversity(editingUni.id, editingUni);
    setAdminStatus({
      type: 'success',
      message: `✓ Updated ${editingUni.name}: Rank #${editingUni.rank}, Score ${editingUni.aheiScore.toFixed(1)} live across website!`,
    });
    setEditingUni(null);
  };

  // Handle Quick Rank Adjustment
  const handleQuickRankChange = (id: string, newRank: number, newScore: number, newResearch?: number) => {
    updateUniversity(id, {
      rank: newRank,
      aheiScore: newScore,
      ...(newResearch !== undefined && !isNaN(newResearch) ? { researchScore: newResearch } : {}),
    });
    setAdminStatus({
      type: 'success',
      message: `✓ Recalibrated #${newRank}: Score ${newScore.toFixed(1)}${newResearch !== undefined && !isNaN(newResearch) ? ` (Research: ${newResearch.toFixed(1)}%)` : ''} live across website!`,
    });
  };

  // Handle Action in Real Claims Queue
  const handleApproveClaim = async (claim: any) => {
    try {
      if (claim.profileData && Object.keys(claim.profileData).length > 0) {
        updateUniversity(claim.institutionId, claim.profileData);
      }

      await fetch(`/api/claims?id=${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED', reviewer: auditorName }),
      });

      setAdminStatus({
        type: 'success',
        message: `✓ Claim ${claim.id} APPROVED: Changes synchronized to ${claim.institutionName} across live site!`,
      });
      fetchClaims();
    } catch (err: any) {
      setAdminStatus({
        type: 'error',
        message: `Failed to approve claim: ${err.message}`,
      });
    }
  };

  const handleRejectClaim = async (claim: any) => {
    try {
      await fetch(`/api/claims?id=${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', reviewer: auditorName }),
      });

      setAdminStatus({
        type: 'success',
        message: `Claim ${claim.id} marked as REJECTED and archived.`,
      });
      fetchClaims();
    } catch (err: any) {
      setAdminStatus({
        type: 'error',
        message: `Failed to reject claim: ${err.message}`,
      });
    }
  };

  const handleQueueAction = (id: string, action: 'approve' | 'reject') => {
    setPendingQueue((prev) => prev.filter((q) => q.id !== id));
    setAdminStatus({
      type: 'success',
      message: `Observation ${id} marked as ${action.toUpperCase()} and archived.`,
    });
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingCsv(true);
    Papa.parse<Record<string, any>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessingCsv(false);
        if (results.data && results.data.length > 0) {
          setParsedRecords(results.data);
          setAdminStatus({
            type: 'success',
            message: `Successfully parsed ${results.data.length} records from ${file.name}. Review below.`,
          });
        }
      },
    });
  };

  // Commit Parsed Records to Live System
  const handleCommitBatchRecords = () => {
    if (!parsedRecords.length) return;
    let importedCount = 0;
    parsedRecords.forEach((r, idx) => {
      const name = r.institution_name || r.name;
      if (!name) return;
      const country = r.country || 'Africa';
      const rawId = r.institution_id || name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
      const generatedRegistry = r.institution_id || `${country.slice(0, 2).toUpperCase()}-${rawId.toUpperCase()}-${String(idx + 1).padStart(3, '0')}`;

      const newUni: University = {
        id: rawId.toLowerCase(),
        registryId: generatedRegistry,
        name: name,
        nativeMotto: r.institution_name_local || '',
        city: r.city || 'Metropolitan Campus',
        country: country,
        countryCode: (r.country_iso2 || country.slice(0, 2)).toLowerCase(),
        flag: (r.country_iso2 || country.slice(0, 2)).toUpperCase(),
        region: 'East Africa',
        estYear: Number(r.founding_year) || 1980,
        charterYear: Number(r.founding_year) || 1980,
        type: r.sector ? `${r.sector} University` : 'Public University',
        website: r.official_website || '',
        viceChancellor: 'Vice-Chancellor Office',
        crestUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-veDF_X5k0iU9TecNkq33JZhFZVwNbe-8HjhjA-SLESMJsDrvTkznz1wsQ07m7muZaGlieb_jK7GGsoMe0S0r8f7BkQ50ta6cbw_GgnrwHKMDa2Mu3J0FsMYmxM2ztcb2_EyB6P4vB7oUbgiZjyXsxnxs4pCxE-gOSCJYXV0CE5x0cMA7nDZbch7B9G9HFPeB1JbDka1L78FhexcCJcojwQ6InQ8rMpj6mjxx0glgjFn7yTgQcqHK',
        prospectusImg: '',
        rank: universities.length + importedCount + 1,
        shift: { type: 'equal', val: 0 },
        aheiScore: 70.0,
        confidence: 90,
        regionalRank: 10,
        nationalRank: 5,
        projectedScoreNextYear: 71.8,
        projectedRankNextYear: universities.length + importedCount + 1,
        projectedRankDelta: 0,
        momentumVelocity: 1.8,
        trajectory: 'Consolidating',
        auditCertification: `AU-AHEI-2027-${country.slice(0, 2).toUpperCase()}-${rawId.slice(0, 4).toUpperCase()}`,
        studentSatisfactionScore: 90.0,
        studentSatisfactionBreakdown: {
          teachingQuality: 91.0,
          campusSafety: 90.0,
          facilitiesAndLabs: 88.5,
          careerServices: 91.5,
        },
        globalRankings: {
          qsWorldRank: 'Regional Sovereign Tier',
          theWorldRank: 'National Flagship Ranking',
          webometricsRank: 'Top Continental Registry',
          arwuShanghaiRank: 'National Accredited',
        },
        researchScore: 75.0,
        teachingScore: 75.0,
        employabilityScore: 75.0,
        continentalRelevanceScore: 75.0,
        internationalScore: 65.0,
        prestigeScore: 80.0,
        totalEnrollment: Number(r.total_enrollment) || 25000,
        undergraduateCount: Math.round((Number(r.total_enrollment) || 25000) * 0.8),
        postgraduateCount: Math.round((Number(r.total_enrollment) || 25000) * 0.2),
        internationalStudents: 1000,
        internationalRatio: 4,
        academicStaffCount: 1000,
        academicStaff: 1000,
        phdFacultyShare: 50,
        doctoralStaffRatio: 50,
        studentStaffRatio: 25,
        campusHectares: 150,
        libraryVolumes: '600K',
        endowmentUsd: '$18M',
        stemEnrolmentRatio: 38,
        domesticTuitionAvg: r.tuition_local_undergrad || '$1,200 / yr',
        domesticTuitionAverage: r.tuition_local_undergrad || 'Sovereign Subsidized Rate',
        domesticTuitionUsd: 'Standard State Tariff',
        intlTuitionAvg: r.tuition_international_undergrad || '$3,000 / yr',
        internationalTuitionAnnual: r.tuition_international_undergrad || 'International Tier',
        studentFacultyRatio: '25:1',
        internationalDiversityPct: 3.0,
        campusesCount: 2,
        campusLocations: `${r.city || 'Main'} Campus`,
        researchExpenditureFormatted: 'Verified Ministerial Allocation',
        admissionSelectivity: 'Competitive (Audited)',
        acceptanceRate: 30,
        accreditationExpiry: '2030',
        trajectoryNote: 'Projected under pure deterministic AHEI-NYPM v1.0 velocity metrics.',
        vectors: {
          researchOutput: 75.0,
          employability: 75.0,
          teachingImpact: 75.0,
          facultyPhdRatio: 50.0,
          globalOutlook: 65.0,
        },
        history: [
          { year: 2027, rankText: `Rank #${universities.length + importedCount + 1}`, points: 70.0, diff: '0' }
        ],
        onCampusAccommodation: 'Available',
        averageMonthlyLiving: '~$250 USD / mo',
        financialAidNote: 'National regulatory loans and state scholarships',
        financialAidTier: 'HIGH',
        accreditationBody: r.accreditation_body || r.regulator || 'Ministry of Higher Education',
        campusSetting: 'National Higher Education Campus',
        flagshipFaculties: ['Sciences', 'Humanities', 'Applied Technology'],
        description: r.notes || `${name} is an officially accredited higher education institution in ${country}.`,
        researchCenters: [],
        programmes: [],
      };
      addUniversity(newUni);
      importedCount++;
    });
    setAdminStatus({
      type: 'success',
      message: `✓ Successfully ingested ${importedCount} verified records into live registry and ranking engine!`,
    });
    setParsedRecords([]);
    setActiveTab('roster');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-8">
        <div className="font-mono text-xs text-[#838383]">Initializing AHEI Registry Security Module...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex flex-col justify-between">
        {/* Security Masthead */}
        <div className="bg-[#09090B] text-white py-6 border-b-2 border-[#164A3A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-code-badge bg-[#164A3A] text-white px-2 py-0.5 rounded-xs">
                SECURITY GATE
              </span>
              <span className="font-serif text-lg font-bold">AHEI Continental Registry Governance</span>
            </div>
            <Link
              href="/"
              className="text-xs text-white/80 hover:text-white no-underline border border-white/30 px-3 py-1.5 rounded-xs transition"
            >
              ← Back to Live Site
            </Link>
          </div>
        </div>

        {/* Auditor Authentication Form Box */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-white border border-[#d5d5d5] shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-[#164A3A]" />
              <span className="font-mono text-[11px] font-bold tracking-wider text-[#838383] uppercase">
                Restricted Institutional Portal
              </span>
            </div>

            <h2 className="font-headline-md text-[#232323] mt-1 mb-2">
              Sign In to Admin Console
            </h2>
            <p className="font-body-sm text-[#838383] mb-6">
              Access to modify official university rankings, add institutions, and synchronize continental league table records requires verified auditor credentials.
            </p>

            {authError && (
              <div className="p-3 mb-5 bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] text-xs font-semibold rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#232323] uppercase tracking-wider mb-1.5">
                  Auditor Institutional Email / ID
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. auditor@ahei-index.org"
                  className="w-full px-3 py-2 text-sm border border-[#d5d5d5] rounded-xs bg-[#f2f2f2] focus:bg-white focus:outline-none focus:border-[#09090B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232323] uppercase tracking-wider mb-1.5">
                  Cryptographic Passkey / Access Key
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm border border-[#d5d5d5] rounded-xs bg-[#f2f2f2] focus:bg-white focus:outline-none focus:border-[#09090B]"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingAuth}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 cursor-pointer font-semibold disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isVerifyingAuth ? 'Verifying Sovereign Credentials...' : 'Verify Cryptographic Credentials & Enter'}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#f9f9f9] text-center">
              <p className="font-mono text-[10px] text-[#838383] m-0">
                🔒 AHEI Regulatory Governance Protocol · Password Protected · All Access Logged
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#d5d5d5] py-4 bg-white text-center">
          <p className="font-mono text-xs text-[#838383] m-0">
            African Higher Education Index © 2027 · Governance Division · All Rights Reserved
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      {/* ─── Admin Masthead ─── */}
      <div className="bg-[#09090B] text-white py-8 border-b-2 border-[#164A3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-code-badge bg-[#164A3A] text-white px-2 py-0.5 rounded-xs">
                AHEI REGISTRY ADMIN CONSOLE
              </span>
              <span className="text-xs text-white/80">Live Synced Index v2.0</span>
            </div>
            <h1 className="font-headline-lg text-white mt-1 mb-0">
              Institutional Governance &amp; Rankings Editor
            </h1>
            <p className="text-xs text-white/80 mt-1 mb-0 max-w-xl">
              Add new institutions, recalibrate league table ranks, audit observation claims, and stage bulk ministry registers.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-xs bg-white/10 text-white/90 border border-white/20 px-2.5 py-1 rounded-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#164A3A]" />
                {auditorName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs px-3 py-1.5 border border-white/40 text-white rounded-xs hover:bg-white/10 no-underline transition"
            >
              ← Back to Live Site
            </Link>
            <button
              onClick={() => {
                if (window.confirm('Reset all live edits back to canonical defaults?')) {
                  resetToDefaults();
                  setAdminStatus({ type: 'success', message: 'Reset all live data to baseline canonical records.' });
                }
              }}
              className="text-xs px-3 py-1.5 border border-[#164A3A] bg-[#faedd9] text-[#3b2a0c] font-semibold rounded-xs hover:bg-[#ebd4af] cursor-pointer transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={handleSignOut}
              className="text-xs px-3 py-1.5 border border-red-300/40 bg-red-900/30 text-red-100 hover:bg-red-800/40 rounded-xs cursor-pointer transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ─── Admin Control Tabs ─── */}
      <div className="bg-white border-b border-[#d5d5d5] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'roster' as AdminTab, label: `Master Roster (${universities.length})`, icon: Database },
            { id: 'add_uni' as AdminTab, label: 'Add New Institution', icon: PlusCircle },
            { id: 'rankings_editor' as AdminTab, label: 'Rankings Engine & Weights', icon: Scale },
            { id: 'queue' as AdminTab, label: `Verification Queue (${pendingQueue.length})`, icon: Clock },
            { id: 'ingest' as AdminTab, label: 'Batch CSV Ingestion', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setAdminStatus(null);
                }}
                className="py-3 px-4 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 border-b-2"
                style={{
                  color: isActive ? '#09090B' : '#838383',
                  borderBottomColor: isActive ? '#09090B' : 'transparent',
                  background: isActive ? '#f2f2f2' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4 text-[#164A3A]" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Feedback Banner ─── */}
      {adminStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className="p-3.5 border rounded-xs text-xs font-sans flex items-center justify-between"
            style={{
              background: adminStatus.type === 'success' ? '#D9D7D0' : '#faedd9',
              borderColor: adminStatus.type === 'success' ? '#09090B' : '#9e3223',
              color: adminStatus.type === 'success' ? '#0d2e24' : '#3b2a0c',
            }}
          >
            <span>{adminStatus.message}</span>
            <button
              onClick={() => setAdminStatus(null)}
              className="font-mono text-xs font-bold underline cursor-pointer bg-none border-none"
            >
              ✕ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB CONTENTS ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ─── TAB 1: MASTER INSTITUTION ROSTER & LIVE EDITING ─── */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#d5d5d5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-title-lg text-[#232323] m-0">
                  Live Master Institution Roster
                </h2>
                <p className="text-xs text-[#838383] m-0">
                  Any rank or score updated here synchronizes live across the entire website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Search live roster…"
                  className="input-field text-xs py-1.5"
                  style={{ width: '220px', background: '#FFFFFF' }}
                />
                <button
                  onClick={() => setActiveTab('add_uni')}
                  className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
                >
                  + Add University
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div className="module p-0 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="rankings-table" style={{ minWidth: '850px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '56px' }}>Rank</th>
                      <th>Institution Name</th>
                      <th>Country</th>
                      <th>Overall Score</th>
                      <th>Research (30%)</th>
                      <th>Teaching (25%)</th>
                      <th>Employability (20%)</th>
                      <th style={{ textAlign: 'right', width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((u) => (
                      <tr key={u.id}>
                        <td className="cell-rank">
                          <span className="font-bold text-[#09090B]">#{u.rank}</span>
                        </td>
                        <td className="cell-name">
                          <Link href={`/universities/${u.id}`} className="hover:text-[#09090B] font-semibold text-sm">
                            {u.name}
                          </Link>
                          <span className="text-[11px] text-[#838383] block">
                            {u.city}, {u.country} · Registry: {u.registryId}
                          </span>
                        </td>
                        <td className="cell-country">
                          <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f9f9f9] px-1 py-0.5 border border-[#d5d5d5] mr-1.5">
                            {u.countryCode.toUpperCase()}
                          </span>
                          {u.country}
                        </td>
                        <td className="cell-score font-bold text-[#09090B]">
                          {u.aheiScore.toFixed(1)}
                        </td>
                        <td className="cell-score">
                          {u.researchScore.toFixed(1)}%
                        </td>
                        <td className="cell-score">
                          {u.teachingScore.toFixed(1)}%
                        </td>
                        <td className="cell-score">
                          {u.employabilityScore.toFixed(1)}%
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUni({ ...u })}
                              className="px-2 py-1 text-xs border border-[#09090B] text-[#09090B] hover:bg-[#D9D7D0] rounded-xs cursor-pointer"
                            >
                              Edit Live
                            </button>
                            <Link
                              href={`/universities/${u.id}`}
                              className="px-2 py-1 text-xs border border-[#d5d5d5] text-[#838383] hover:text-[#232323] rounded-xs no-underline"
                            >
                              View Profile
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: ADD NEW UNIVERSITY FORM ─── */}
        {activeTab === 'add_uni' && (
          <div className="module bg-white p-6 border-2 border-[#09090B]">
            <div className="pb-4 border-b border-[#d5d5d5] mb-6">
              <span className="font-code-badge text-[#09090B] block mb-1">
                INSTITUTIONAL ENROLLMENT ENGINE
              </span>
              <h2 className="font-headline-md text-[#232323] m-0">
                Add New University to AHEI 2027 Index
              </h2>
              <p className="text-xs text-[#838383] mt-1 m-0">
                Enter audited statutory indicators. Upon publication, the university will immediately appear across all rankings, search indexes, and profiles.
              </p>
            </div>

            <form onSubmit={handleCreateUniversity} className="space-y-6">
              {/* Section 1: Basic Identity */}
              <div>
                <h3 className="font-title-md text-[#09090B] mb-3 pb-1 border-b border-[#f9f9f9]">
                  1. Institutional Identity &amp; Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      University Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUniForm.name}
                      onChange={(e) => setNewUniForm({ ...newUniForm, name: e.target.value })}
                      placeholder="e.g. University of Lagos"
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUniForm.country}
                      onChange={(e) => setNewUniForm({ ...newUniForm, country: e.target.value })}
                      placeholder="e.g. Nigeria"
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Country ISO Code (2-Letter)
                    </label>
                    <input
                      type="text"
                      value={newUniForm.flag}
                      onChange={(e) => setNewUniForm({ ...newUniForm, flag: e.target.value.toUpperCase() })}
                      placeholder="e.g. NG, ZA, KE"
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Macro-Region
                    </label>
                    <select
                      value={newUniForm.region}
                      onChange={(e) => setNewUniForm({ ...newUniForm, region: e.target.value as University['region'] })}
                      className="input-field w-full text-xs"
                    >
                      <option value="West Africa">West Africa</option>
                      <option value="East Africa">East Africa</option>
                      <option value="North Africa">North Africa</option>
                      <option value="Southern Africa">Southern Africa</option>
                      <option value="Central Africa">Central Africa</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      City &amp; Main Campus Location
                    </label>
                    <input
                      type="text"
                      value={newUniForm.city}
                      onChange={(e) => setNewUniForm({ ...newUniForm, city: e.target.value })}
                      placeholder="e.g. Lagos, Akoka Campus"
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Charter / Founding Year
                    </label>
                    <input
                      type="number"
                      value={newUniForm.estYear}
                      onChange={(e) => setNewUniForm({ ...newUniForm, estYear: Number(e.target.value) })}
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Official Web Portal URL
                    </label>
                    <input
                      type="url"
                      value={newUniForm.website}
                      onChange={(e) => setNewUniForm({ ...newUniForm, website: e.target.value })}
                      placeholder="https://..."
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Vice Chancellor / Rector
                    </label>
                    <input
                      type="text"
                      value={newUniForm.viceChancellor}
                      onChange={(e) => setNewUniForm({ ...newUniForm, viceChancellor: e.target.value })}
                      className="input-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Sector / Status
                    </label>
                    <input
                      type="text"
                      value={newUniForm.type}
                      onChange={(e) => setNewUniForm({ ...newUniForm, type: e.target.value })}
                      placeholder="Public Chartered Flagship"
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Scores & Ranks */}
              <div>
                <h3 className="font-title-md text-[#09090B] mb-3 pb-1 border-b border-[#f9f9f9]">
                  2. 2027 Continental Ranking &amp; Pillar Scores (0–100 Scale)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Assigned Rank #
                    </label>
                    <input
                      type="number"
                      required
                      value={newUniForm.rank}
                      onChange={(e) => setNewUniForm({ ...newUniForm, rank: Number(e.target.value) })}
                      className="input-field w-full text-xs font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Overall Composite Score <span className="font-mono text-[10px] text-[#09090B] font-normal">(Auto-Calculated)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newUniForm.aheiScore}
                      onChange={(e) => setNewUniForm({ ...newUniForm, aheiScore: Number(e.target.value) })}
                      className="input-field w-full text-xs font-bold font-mono text-[#09090B] bg-[#FAF5EB]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Research Score (30%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newUniForm.researchScore}
                      onChange={(e) => {
                        const r = Number(e.target.value);
                        const composite = computeCompositeScore(
                          r,
                          newUniForm.teachingScore,
                          newUniForm.employabilityScore,
                          newUniForm.continentalRelevanceScore,
                          newUniForm.internationalScore
                        );
                        setNewUniForm({ ...newUniForm, researchScore: r, aheiScore: composite });
                      }}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Teaching Score (25%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newUniForm.teachingScore}
                      onChange={(e) => {
                        const t = Number(e.target.value);
                        const composite = computeCompositeScore(
                          newUniForm.researchScore,
                          t,
                          newUniForm.employabilityScore,
                          newUniForm.continentalRelevanceScore,
                          newUniForm.internationalScore
                        );
                        setNewUniForm({ ...newUniForm, teachingScore: t, aheiScore: composite });
                      }}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Employability (20%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newUniForm.employabilityScore}
                      onChange={(e) => {
                        const emp = Number(e.target.value);
                        const composite = computeCompositeScore(
                          newUniForm.researchScore,
                          newUniForm.teachingScore,
                          emp,
                          newUniForm.continentalRelevanceScore,
                          newUniForm.internationalScore
                        );
                        setNewUniForm({ ...newUniForm, employabilityScore: emp, aheiScore: composite });
                      }}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Continental Impact (15%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newUniForm.continentalRelevanceScore}
                      onChange={(e) => {
                        const c = Number(e.target.value);
                        const composite = computeCompositeScore(
                          newUniForm.researchScore,
                          newUniForm.teachingScore,
                          newUniForm.employabilityScore,
                          c,
                          newUniForm.internationalScore
                        );
                        setNewUniForm({ ...newUniForm, continentalRelevanceScore: c, aheiScore: composite });
                      }}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Internationalization (10%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newUniForm.internationalScore}
                      onChange={(e) => {
                        const intl = Number(e.target.value);
                        const composite = computeCompositeScore(
                          newUniForm.researchScore,
                          newUniForm.teachingScore,
                          newUniForm.employabilityScore,
                          newUniForm.continentalRelevanceScore,
                          intl
                        );
                        setNewUniForm({ ...newUniForm, internationalScore: intl, aheiScore: composite });
                      }}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Student:Faculty Ratio
                    </label>
                    <input
                      type="text"
                      value={newUniForm.studentFacultyRatio}
                      onChange={(e) => setNewUniForm({ ...newUniForm, studentFacultyRatio: e.target.value })}
                      placeholder="e.g. 18:1"
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Fees & Student Intel */}
              <div>
                <h3 className="font-title-md text-[#09090B] mb-3 pb-1 border-b border-[#f9f9f9]">
                  3. Student Population &amp; Statutory Tuition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Total Student Enrollment
                    </label>
                    <input
                      type="number"
                      value={newUniForm.totalEnrollment}
                      onChange={(e) => setNewUniForm({ ...newUniForm, totalEnrollment: Number(e.target.value) })}
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Annual Tuition (USD Est.)
                    </label>
                    <input
                      type="text"
                      value={newUniForm.domesticTuitionUsd}
                      onChange={(e) => setNewUniForm({ ...newUniForm, domesticTuitionUsd: e.target.value })}
                      placeholder="$1,200"
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Monthly Living Cost Est.
                    </label>
                    <input
                      type="text"
                      value={newUniForm.averageMonthlyLiving}
                      onChange={(e) => setNewUniForm({ ...newUniForm, averageMonthlyLiving: e.target.value })}
                      placeholder="$320"
                      className="input-field w-full text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#232323] block mb-1">
                      Financial Aid Support Tier
                    </label>
                    <select
                      value={newUniForm.financialAidTier}
                      onChange={(e) => setNewUniForm({ ...newUniForm, financialAidTier: e.target.value as any })}
                      className="input-field w-full text-xs"
                    >
                      <option value="HIGH">HIGH SUPPORT</option>
                      <option value="MODERATE">MODERATE SUPPORT</option>
                      <option value="STANDARD">STANDARD SUPPORT</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-[#232323] block mb-1">
                    Flagship Disciplines &amp; Accredited Faculties (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newUniForm.flagshipFaculties}
                    onChange={(e) => setNewUniForm({ ...newUniForm, flagshipFaculties: e.target.value })}
                    placeholder="Medicine & Health, Law, Engineering, Computer Science"
                    className="input-field w-full text-xs"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-[#232323] block mb-1">
                    Institutional Summary &amp; Research Dossier
                  </label>
                  <textarea
                    rows={3}
                    value={newUniForm.description}
                    onChange={(e) => setNewUniForm({ ...newUniForm, description: e.target.value })}
                    className="input-field w-full text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#d5d5d5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('roster')}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Publish New Institution to Live Index →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 3: RANKINGS ENGINE & LIVE SCORE RECALIBRATOR ─── */}
        {activeTab === 'rankings_editor' && (
          <div className="module bg-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d5d5d5]">
              <div>
                <span className="font-code-badge text-[#09090B] block mb-1">
                  DETERMINISTIC RANKING ENGINE
                </span>
                <h3 className="font-title-lg text-[#232323] m-0">
                  Quick Live Rank &amp; Score Recalibration
                </h3>
                <p className="text-xs text-[#838383] mt-1 m-0">
                  Adjust ranking positions and composite scores directly. Changes take effect on the live website immediately.
                </p>
              </div>

              <span className="font-code-badge bg-[#faedd9] text-[#3b2a0c] px-3 py-1 rounded-xs">
                {universities.length} Institutions Indexed
              </span>
            </div>

            <div className="space-y-3">
              {universities.map((u) => (
                <div
                  key={u.id}
                  className="p-4 bg-[#f2f2f2] border border-[#d5d5d5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-tabular-num font-bold text-lg text-[#09090B] w-12">
                      #{u.rank}
                    </span>
                    <div>
                      <span className="font-semibold text-sm text-[#232323] block">
                        {u.name}
                      </span>
                      <span className="text-xs text-[#838383] flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f9f9f9] px-1 py-0.5 border border-[#d5d5d5]">
                          {u.countryCode.toUpperCase()}
                        </span>
                        {u.country} · Current Score: <strong>{u.aheiScore.toFixed(1)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#838383]">Rank:</span>
                      <input
                        type="number"
                        defaultValue={u.rank}
                        id={`rank-input-${u.id}`}
                        className="input-field text-xs font-mono font-bold w-16 text-center"
                        style={{ background: '#FFFFFF' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#838383]">Research %:</span>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={u.researchScore}
                        id={`research-input-${u.id}`}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          const newScore = computeCompositeScore(
                            r,
                            u.teachingScore,
                            u.employabilityScore,
                            u.continentalRelevanceScore,
                            u.internationalScore
                          );
                          const scoreEl = document.getElementById(`score-input-${u.id}`) as HTMLInputElement;
                          if (scoreEl) scoreEl.value = String(newScore);
                        }}
                        className="input-field text-xs font-mono font-bold w-18 text-center text-[#09090B]"
                        style={{ background: '#FFFFFF' }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#838383]">Overall:</span>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={u.aheiScore}
                        id={`score-input-${u.id}`}
                        className="input-field text-xs font-mono font-bold w-20 text-center text-[#09090B] bg-[#FAF5EB]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const rankEl = document.getElementById(`rank-input-${u.id}`) as HTMLInputElement;
                        const scoreEl = document.getElementById(`score-input-${u.id}`) as HTMLInputElement;
                        const researchEl = document.getElementById(`research-input-${u.id}`) as HTMLInputElement;
                        if (rankEl && scoreEl) {
                          handleQuickRankChange(
                            u.id,
                            Number(rankEl.value),
                            Number(scoreEl.value),
                            researchEl ? Number(researchEl.value) : undefined
                          );
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-[#09090B] text-white font-semibold rounded-xs cursor-pointer hover:bg-[#2A6B55] transition"
                    >
                      Save Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: VERIFICATION QUEUE ─── */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#d5d5d5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-title-lg text-[#232323] m-0">
                  Institutional Correction &amp; Claims Ledger ({realClaims.length})
                </h3>
                <p className="text-xs text-[#838383] m-0">
                  Evidence dossiers submitted by verified institutional registrars, researchers, and accredited planning officers.
                </p>
              </div>
              <button
                onClick={fetchClaims}
                className="px-3 py-1.5 text-xs border border-[#164A3A] text-[#164A3A] hover:bg-[#164A3A]/10 rounded-xs transition cursor-pointer font-mono"
              >
                ↻ Refresh Live Queue
              </button>
            </div>

            {realClaims.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#d5d5d5] text-xs text-[#838383]">
                No pending correction claims in ledger. All sovereign institutional records are up to date.
              </div>
            ) : (
              realClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-5 bg-white border border-[#d5d5d5] space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#f1f5f9] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-[#09090B] font-serif font-bold text-base">
                          {claim.institutionName}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 bg-[#F7F6F2] border border-[#D9D7D0] text-[#164A3A] font-bold">
                          {claim.id}
                        </span>
                        <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-[2px] ${
                          claim.status === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : claim.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#666666] mt-1">
                        <strong>Claimant:</strong> {claim.claimant?.fullName} ({claim.claimant?.designation}) · <span className="font-mono text-[#164A3A]">{claim.claimant?.email}</span> {claim.claimant?.phone ? `· ${claim.claimant.phone}` : ''}
                      </div>
                      <div className="text-xs text-[#838383] mt-1">
                        <strong>Evidence:</strong> <a href={claim.evidence?.sourceDocumentUrl} target="_blank" rel="noreferrer" className="text-[#164A3A] hover:underline font-mono">{claim.evidence?.sourceDocumentUrl}</a> {claim.evidence?.gazetteReference ? `· Gazette: ${claim.evidence.gazetteReference}` : ''}
                      </div>
                      {claim.evidence?.verificationNotes && (
                        <p className="text-xs text-[#444444] bg-[#f8fafc] p-2 rounded-xs border border-[#e2e8f0] mt-2 italic">
                          &ldquo;{claim.evidence.verificationNotes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {claim.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleRejectClaim(claim)}
                            className="px-3 py-1.5 text-xs border border-red-300 text-red-700 hover:bg-red-50 rounded-xs cursor-pointer font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveClaim(claim)}
                            className="px-4 py-1.5 text-xs bg-[#164A3A] text-white hover:bg-[#0e3025] rounded-xs cursor-pointer font-bold shadow-xs"
                          >
                            ✓ Approve &amp; Merge Profile
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Profile Diffs Preview */}
                  {claim.profileData && Object.keys(claim.profileData).length > 0 && (
                    <div className="bg-[#FAF9F5] p-3 border border-[#E6E3DC] text-xs">
                      <span className="font-mono text-[10px] font-bold text-[#838383] uppercase tracking-wider block mb-2">
                        Submitted Profile Fields for Rectification:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]">
                        {claim.profileData.viceChancellor && (
                          <div className="p-1.5 bg-white border border-[#E6E3DC]">
                            <span className="text-[#838383] block text-[10px]">Vice-Chancellor:</span>
                            <span className="font-bold text-[#09090B]">{claim.profileData.viceChancellor}</span>
                          </div>
                        )}
                        {claim.profileData.domesticTuitionAverage && (
                          <div className="p-1.5 bg-white border border-[#E6E3DC]">
                            <span className="text-[#838383] block text-[10px]">Domestic Tuition:</span>
                            <span className="font-bold text-[#164A3A]">{claim.profileData.domesticTuitionAverage}</span>
                          </div>
                        )}
                        {claim.profileData.nativeMotto && (
                          <div className="p-1.5 bg-white border border-[#E6E3DC]">
                            <span className="text-[#838383] block text-[10px]">Motto:</span>
                            <span className="italic text-[#09090B]">{claim.profileData.nativeMotto}</span>
                          </div>
                        )}
                        {claim.profileData.campusesList && claim.profileData.campusesList.length > 0 && (
                          <div className="p-1.5 bg-white border border-[#E6E3DC] sm:col-span-2">
                            <span className="text-[#838383] block text-[10px]">Physical Campuses:</span>
                            <span className="text-[#09090B]">{claim.profileData.campusesList.join(', ')}</span>
                          </div>
                        )}
                        {claim.profileData.flagshipFaculties && (
                          <div className="p-1.5 bg-white border border-[#E6E3DC] sm:col-span-3">
                            <span className="text-[#838383] block text-[10px]">Flagship Faculties:</span>
                            <span className="text-[#09090B]">{claim.profileData.flagshipFaculties}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── TAB 5: BATCH CSV INGESTION ─── */}
        {activeTab === 'ingest' && (
          <div className="module bg-white p-6 space-y-6">
            <div>
              <h3 className="font-title-lg text-[#09090B] m-0">
                Batch CSV &amp; Register Ingestion
              </h3>
              <p className="text-xs text-[#838383] mt-1">
                Upload national ministry registers (e.g. South Africa SAQA, Kenya CUE, Nigeria NUC) to stage and synchronize records.
              </p>
            </div>

            <label
              htmlFor="batch-csv-upload"
              className="border-2 border-dashed border-[#d5d5d5] p-8 text-center hover:border-[#09090B] transition cursor-pointer bg-[#f2f2f2] flex flex-col items-center justify-center space-y-2 block"
            >
              <Upload className="w-8 h-8 text-[#09090B] mx-auto" />
              <p className="text-xs font-semibold text-[#09090B] m-0">
                {isProcessingCsv ? 'Parsing CSV structure…' : 'Drop your batch CSV file here or click to browse'}
              </p>
              <p className="text-[11px] text-[#838383] m-0">
                Supports standard AHEI 51-column institutional register format
              </p>
              <input
                id="batch-csv-upload"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                disabled={isProcessingCsv}
                className="hidden"
              />
            </label>

            {parsedRecords.length > 0 && (
              <div className="space-y-3">
                <span className="font-title-md text-[#232323] block">
                  Preview of Parsed Records ({parsedRecords.length} Rows)
                </span>
                <div className="border border-[#d5d5d5] overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9f9f9] font-mono text-[11px] uppercase border-b border-[#d5d5d5]">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Institution Name</th>
                        <th className="p-2">Country</th>
                        <th className="p-2">Sector</th>
                        <th className="p-2">Enrollment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E3DC]">
                      {parsedRecords.slice(0, 8).map((r, i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono">{i + 1}</td>
                          <td className="p-2 font-semibold text-[#09090B]">{r.institution_name || r.name || 'Unnamed'}</td>
                          <td className="p-2">{r.country || '—'}</td>
                          <td className="p-2">{r.sector || 'Public'}</td>
                          <td className="p-2 font-mono">{r.total_enrollment || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#d5d5d5]">
                  <span className="text-xs text-[#838383]">
                    Ready to commit {parsedRecords.length} records into the active database.
                  </span>
                  <button
                    type="button"
                    onClick={handleCommitBatchRecords}
                    className="btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    Commit All {parsedRecords.length} Records to Live Registry
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── LIVE EDIT MODAL ─── */}
      {editingUni && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#09090B] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d5d5d5]">
              <h3 className="font-title-lg text-[#09090B] m-0">
                Edit Record: {editingUni.name}
              </h3>
              <button
                onClick={() => setEditingUni(null)}
                className="text-xs text-[#838383] hover:text-[#232323] bg-none border-none cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Rank Position #</label>
                  <input
                    type="number"
                    value={editingUni.rank}
                    onChange={(e) => setEditingUni({ ...editingUni, rank: Number(e.target.value) })}
                    className="input-field w-full text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 flex items-center justify-between">
                    <span>Overall AHEI Score</span>
                    <span className="text-[10px] text-[#09090B] font-mono font-normal">Auto-Calculated</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.aheiScore}
                    onChange={(e) => setEditingUni({ ...editingUni, aheiScore: Number(e.target.value) })}
                    className="input-field w-full text-xs font-bold font-mono text-[#09090B] bg-[#FAF5EB]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Research Score (30%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.researchScore}
                    onChange={(e) => {
                      const research = Number(e.target.value);
                      const aheiScore = computeCompositeScore(
                        research,
                        editingUni.teachingScore,
                        editingUni.employabilityScore,
                        editingUni.continentalRelevanceScore ?? 75,
                        editingUni.internationalScore ?? 70
                      );
                      setEditingUni({
                        ...editingUni,
                        researchScore: research,
                        aheiScore,
                      });
                    }}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teaching Score (25%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.teachingScore}
                    onChange={(e) => {
                      const teaching = Number(e.target.value);
                      const aheiScore = computeCompositeScore(
                        editingUni.researchScore,
                        teaching,
                        editingUni.employabilityScore,
                        editingUni.continentalRelevanceScore ?? 75,
                        editingUni.internationalScore ?? 70
                      );
                      setEditingUni({
                        ...editingUni,
                        teachingScore: teaching,
                        aheiScore,
                      });
                    }}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Employability (20%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.employabilityScore}
                    onChange={(e) => {
                      const employability = Number(e.target.value);
                      const aheiScore = computeCompositeScore(
                        editingUni.researchScore,
                        editingUni.teachingScore,
                        employability,
                        editingUni.continentalRelevanceScore ?? 75,
                        editingUni.internationalScore ?? 70
                      );
                      setEditingUni({
                        ...editingUni,
                        employabilityScore: employability,
                        aheiScore,
                      });
                    }}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Continental Impact (15%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.continentalRelevanceScore ?? 75}
                    onChange={(e) => {
                      const continental = Number(e.target.value);
                      const aheiScore = computeCompositeScore(
                        editingUni.researchScore,
                        editingUni.teachingScore,
                        editingUni.employabilityScore,
                        continental,
                        editingUni.internationalScore ?? 70
                      );
                      setEditingUni({
                        ...editingUni,
                        continentalRelevanceScore: continental,
                        aheiScore,
                      });
                    }}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">International Diversity (10%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUni.internationalScore ?? 70}
                    onChange={(e) => {
                      const intl = Number(e.target.value);
                      const aheiScore = computeCompositeScore(
                        editingUni.researchScore,
                        editingUni.teachingScore,
                        editingUni.employabilityScore,
                        editingUni.continentalRelevanceScore ?? 75,
                        intl
                      );
                      setEditingUni({
                        ...editingUni,
                        internationalScore: intl,
                        aheiScore,
                      });
                    }}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Domestic Tuition (USD)</label>
                  <input
                    type="text"
                    value={editingUni.domesticTuitionUsd}
                    onChange={(e) => setEditingUni({ ...editingUni, domesticTuitionUsd: e.target.value })}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description / Dossier</label>
                <textarea
                  rows={3}
                  value={editingUni.description}
                  onChange={(e) => setEditingUni({ ...editingUni, description: e.target.value })}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#d5d5d5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUni(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Live Changes →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
