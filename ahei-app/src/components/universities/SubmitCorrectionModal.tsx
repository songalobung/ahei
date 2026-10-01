'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  Building2, 
  GraduationCap, 
  Coins, 
  Users, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { University } from '@/data/universities';

interface SubmitCorrectionModalProps {
  university: University;
  isOpen: boolean;
  onClose: () => void;
}

type StepCategory = 'claimant' | 'basic' | 'campuses' | 'academics' | 'tuition' | 'evidence';

export default function SubmitCorrectionModal({ university, isOpen, onClose }: SubmitCorrectionModalProps) {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<StepCategory>('claimant');
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    claimId: string;
    submittedAt: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Claimant Credentials
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantDesignation, setClaimantDesignation] = useState('Institutional Planning / Registrar Officer');
  const [claimantPhone, setClaimantPhone] = useState('');

  // Editable Profile Fields (prepopulated from active university)
  const [profileForm, setProfileForm] = useState({
    name: university.name || '',
    nativeMotto: university.nativeMotto || '',
    viceChancellor: university.viceChancellor || '',
    primaryAccreditation: university.primaryAccreditation || '',
    city: university.city || '',
    country: university.country || '',
    region: university.region || 'West Africa',
    type: university.type || 'Public Chartered Flagship',
    estYear: university.estYear || 1960,
    charterYear: university.charterYear || university.estYear || 1960,
    website: university.website || '',
    
    // Campuses
    campusesCount: university.campusesCount || (university.campusesList?.length || 1),
    campusesListText: (university.campusesList || [university.city]).join(', '),
    
    // Degrees & Programs
    degreesOfferedCount: university.degreesOfferedCount || 120,
    undergradDegreesCount: university.undergradDegreesCount || 55,
    postgradDegreesCount: university.postgradDegreesCount || 50,
    doctoralProgramsCount: university.doctoralProgramsCount || 15,
    flagshipFaculties: university.flagshipFaculties || '',
    description: university.description || '',

    // Metrics
    totalEnrollment: university.totalEnrollment || 25000,
    academicStaff: university.academicStaff || 1200,
    phdFacultyShare: university.phdFacultyShare || 65,
    studentFacultyRatio: university.studentFacultyRatio || '18:1',
    internationalDiversityPct: university.internationalDiversityPct || 5.0,

    // Tuition & Living Costs
    domesticTuitionAverage: university.domesticTuitionAverage || '',
    domesticTuitionUsd: university.domesticTuitionUsd || '',
    internationalTuitionAnnual: university.internationalTuitionAnnual || '',
    onCampusAccommodation: university.onCampusAccommodation || '',
    averageMonthlyLiving: university.averageMonthlyLiving || '',
    financialAidTier: university.financialAidTier || 'MODERATE',

    // Evidence
    sourceDocumentUrl: university.website || '',
    gazetteReference: `Sovereign HEI Gazette Ref for ${university.country}`,
    verificationNotes: 'Official institutional review submission to update published records in the AHEI Continental Registry.',
  });

  const handleChange = (field: string, value: any) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!claimantName.trim() || !claimantEmail.trim()) {
      setActiveStep('claimant');
      setErrorMessage('Please enter your full name and official institutional email address.');
      return;
    }

    if (!profileForm.sourceDocumentUrl.trim()) {
      setActiveStep('evidence');
      setErrorMessage('An official source document URL or sovereign gazette registry link is required for verification.');
      return;
    }

    setSubmitting(true);

    try {
      const campusesList = profileForm.campusesListText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        institutionId: university.id,
        institutionName: university.name,
        country: university.country,
        claimType: 'FULL_PROFILE_VERIFICATION',
        claimant: {
          fullName: claimantName,
          email: claimantEmail,
          designation: claimantDesignation,
          phone: claimantPhone,
        },
        evidence: {
          sourceDocumentUrl: profileForm.sourceDocumentUrl,
          gazetteReference: profileForm.gazetteReference,
          verificationNotes: profileForm.verificationNotes,
        },
        profileData: {
          name: profileForm.name,
          nativeMotto: profileForm.nativeMotto,
          viceChancellor: profileForm.viceChancellor,
          primaryAccreditation: profileForm.primaryAccreditation,
          city: profileForm.city,
          country: profileForm.country,
          region: profileForm.region,
          type: profileForm.type,
          estYear: Number(profileForm.estYear) || university.estYear,
          charterYear: Number(profileForm.charterYear) || university.estYear,
          website: profileForm.website,
          campusesCount: Number(profileForm.campusesCount) || campusesList.length,
          campusesList,
          degreesOfferedCount: Number(profileForm.degreesOfferedCount),
          undergradDegreesCount: Number(profileForm.undergradDegreesCount),
          postgradDegreesCount: Number(profileForm.postgradDegreesCount),
          doctoralProgramsCount: Number(profileForm.doctoralProgramsCount),
          flagshipFaculties: profileForm.flagshipFaculties,
          description: profileForm.description,
          totalEnrollment: Number(profileForm.totalEnrollment),
          academicStaff: Number(profileForm.academicStaff),
          phdFacultyShare: Number(profileForm.phdFacultyShare),
          studentFacultyRatio: profileForm.studentFacultyRatio,
          internationalDiversityPct: Number(profileForm.internationalDiversityPct),
          domesticTuitionAverage: profileForm.domesticTuitionAverage,
          domesticTuitionUsd: profileForm.domesticTuitionUsd,
          internationalTuitionAnnual: profileForm.internationalTuitionAnnual,
          onCampusAccommodation: profileForm.onCampusAccommodation,
          averageMonthlyLiving: profileForm.averageMonthlyLiving,
          financialAidTier: profileForm.financialAidTier,
        },
      };

      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit institutional correction claim.');
      }

      setSuccessReceipt({
        claimId: data.claimId || `AHEI-CLAIM-${Date.now()}`,
        submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#F7F6F2] border border-[#D9D7D0] w-full max-w-3xl rounded-none shadow-2xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ─── Masthead Header ─── */}
        <div className="bg-[#164A3A] text-white p-5 sm:p-6 border-b border-[#B28A45]/30 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest bg-[#B28A45] text-white px-2 py-0.5 rounded-[2px]">
                Sovereign Verification Channel
              </span>
              <span className="font-mono text-[11px] text-[#D9D7D0]">
                REF: {university.id.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white m-0">
              Submit Institutional Correction Dossier
            </h2>
            <p className="text-xs text-[#D9D7D0] mt-1 m-0">
              Official data update and factual correction channel for <strong>{university.name}</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#D9D7D0] hover:text-white p-1.5 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Modal Content ─── */}
        {successReceipt ? (
          <div className="p-8 sm:p-12 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 bg-[#164A3A]/10 text-[#164A3A] border border-[#164A3A]/30 flex items-center justify-center mx-auto rounded-none">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#B28A45] tracking-wider uppercase block">
                Cryptographic Audit Receipt Generated
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#171918] m-0">
                Institutional Claim Successfully Staged
              </h3>
              <p className="font-mono text-sm font-bold text-[#164A3A] bg-white p-2.5 border border-[#D9D7D0] inline-block mt-2">
                CLAIM AUDIT CODE: {successReceipt.claimId}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#676963] max-w-lg mx-auto leading-relaxed">
              Your submission containing comprehensive profile corrections for <strong>{university.name}</strong> has been committed to the sovereign audit queue. The AHEI Regulatory Council will verify the submitted gazette evidence against our primary-sourced directory.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#164A3A] hover:bg-[#0e3025] text-white text-xs font-semibold rounded-xs transition cursor-pointer"
              >
                Close & Return to Dossier
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            
            {/* ─── Tab Navigation Bar ─── */}
            <div className="bg-white border-b border-[#D9D7D0] px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0 text-xs font-mono">
              {[
                { id: 'claimant', label: '1. Claimant Credentials', icon: ShieldCheck },
                { id: 'basic', label: '2. Basic Info & Leadership', icon: Building2 },
                { id: 'campuses', label: '3. Campuses & Locations', icon: Building2 },
                { id: 'academics', label: '4. Degrees & Programs', icon: GraduationCap },
                { id: 'tuition', label: '5. Tuition & Living Costs', icon: Coins },
                { id: 'evidence', label: '6. Gazette Evidence & Submit', icon: FileText },
              ].map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id as StepCategory)}
                    className={`px-3 py-1.5 rounded-xs transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#164A3A] text-white font-bold'
                        : 'text-[#676963] hover:text-[#171918] hover:bg-[#F7F6F2]'
                    }`}
                  >
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── Error Display ─── */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 rounded-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ─── Form Body ─── */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Step 1: Claimant Info */}
              {activeStep === 'claimant' && (
                <div className="space-y-4">
                  <div className="bg-[#164A3A]/5 border border-[#164A3A]/20 p-4 rounded-xs">
                    <h4 className="font-serif font-bold text-sm text-[#164A3A] m-0 mb-1">
                      Institutional Identity Verification
                    </h4>
                    <p className="text-[#676963] text-xs m-0">
                      To prevent unauthorized alterations, correction submissions must originate from an institutional registrar, planning officer, verified academic, or designated sovereign authority.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Claimant Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={claimantName}
                        onChange={(e) => setClaimantName(e.target.value)}
                        placeholder="e.g. Prof. / Dr. / Registrar Name"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Institutional Email (.edu / .ac / sovereign domain) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={claimantEmail}
                        onChange={(e) => setClaimantEmail(e.target.value)}
                        placeholder="e.g. registrar@institution.edu"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Official Designation / Role
                      </label>
                      <input
                        type="text"
                        value={claimantDesignation}
                        onChange={(e) => setClaimantDesignation(e.target.value)}
                        placeholder="e.g. Director of Academic Affairs / Registrar"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Contact Phone / Extension (Optional)
                      </label>
                      <input
                        type="tel"
                        value={claimantPhone}
                        onChange={(e) => setClaimantPhone(e.target.value)}
                        placeholder="+234 / +27 / +20 ..."
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Info & Leadership */}
              {activeStep === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#171918] block mb-1">Official Legal Name of Institution</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Vice-Chancellor / President / Rector</label>
                      <input
                        type="text"
                        value={profileForm.viceChancellor}
                        onChange={(e) => handleChange('viceChancellor', e.target.value)}
                        placeholder="e.g. Prof. Mosa Moshabela"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Official Latin / Sovereign Motto</label>
                      <input
                        type="text"
                        value={profileForm.nativeMotto}
                        onChange={(e) => handleChange('nativeMotto', e.target.value)}
                        placeholder="e.g. Spes Bona / Scientia et Humanitas"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden italic"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Primary Sovereign Accreditation Body</label>
                      <input
                        type="text"
                        value={profileForm.primaryAccreditation}
                        onChange={(e) => handleChange('primaryAccreditation', e.target.value)}
                        placeholder="e.g. NUC Nigeria / CUE Kenya / CHE South Africa"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Institutional Type</label>
                      <input
                        type="text"
                        value={profileForm.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        placeholder="e.g. Public Chartered Flagship / Private Faith-Based"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Founding Year</label>
                      <input
                        type="number"
                        value={profileForm.estYear}
                        onChange={(e) => handleChange('estYear', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Official Web Portal</label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#171918] block mb-1">Institutional Summary / Editorial Profile</label>
                      <textarea
                        rows={3}
                        value={profileForm.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Campuses & Locations */}
              {activeStep === 'campuses' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Primary Host City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Sovereign Nation</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Total Physical Campuses Count</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={profileForm.campusesCount}
                        onChange={(e) => handleChange('campusesCount', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#171918] block mb-1">
                        Physical Campus Names & Regional Branch Locations (Comma separated)
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.campusesListText}
                        onChange={(e) => handleChange('campusesListText', e.target.value)}
                        placeholder="e.g. Main Campus (Legon), Korle-Bu Medical Campus, Accra City Campus"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Degrees & Programs */}
              {activeStep === 'academics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Total Degrees</label>
                      <input
                        type="number"
                        value={profileForm.degreesOfferedCount}
                        onChange={(e) => handleChange('degreesOfferedCount', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Undergraduate</label>
                      <input
                        type="number"
                        value={profileForm.undergradDegreesCount}
                        onChange={(e) => handleChange('undergradDegreesCount', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Postgraduate</label>
                      <input
                        type="number"
                        value={profileForm.postgradDegreesCount}
                        onChange={(e) => handleChange('postgradDegreesCount', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Doctoral (PhD)</label>
                      <input
                        type="number"
                        value={profileForm.doctoralProgramsCount}
                        onChange={(e) => handleChange('doctoralProgramsCount', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Total Student Body</label>
                      <input
                        type="number"
                        value={profileForm.totalEnrollment}
                        onChange={(e) => handleChange('totalEnrollment', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">Academic Faculty Staff</label>
                      <input
                        type="number"
                        value={profileForm.academicStaff}
                        onChange={(e) => handleChange('academicStaff', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">PhD Faculty Ratio (%)</label>
                      <input
                        type="number"
                        value={profileForm.phdFacultyShare}
                        onChange={(e) => handleChange('phdFacultyShare', e.target.value)}
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#171918] block mb-1">
                      Flagship Faculties & Specializations (Comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={profileForm.flagshipFaculties}
                      onChange={(e) => handleChange('flagshipFaculties', e.target.value)}
                      placeholder="e.g. Medicine & Surgery, Faculty of Law, Faculty of Engineering"
                      className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Tuition & Living Costs */}
              {activeStep === 'tuition' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Domestic Statutory Tuition (Local Currency Range)
                      </label>
                      <input
                        type="text"
                        value={profileForm.domesticTuitionAverage}
                        onChange={(e) => handleChange('domesticTuitionAverage', e.target.value)}
                        placeholder="e.g. ZAR 65,000 - 95,000 / NGN 450,000"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Domestic Tuition (USD Equivalent Approx)
                      </label>
                      <input
                        type="text"
                        value={profileForm.domesticTuitionUsd}
                        onChange={(e) => handleChange('domesticTuitionUsd', e.target.value)}
                        placeholder="e.g. $3,500 - $5,200 / yr"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        International Student Annual Tuition
                      </label>
                      <input
                        type="text"
                        value={profileForm.internationalTuitionAnnual}
                        onChange={(e) => handleChange('internationalTuitionAnnual', e.target.value)}
                        placeholder="e.g. $6,800 - $14,500 / yr"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#171918] block mb-1">
                        Estimated Monthly Living Cost
                      </label>
                      <input
                        type="text"
                        value={profileForm.averageMonthlyLiving}
                        onChange={(e) => handleChange('averageMonthlyLiving', e.target.value)}
                        placeholder="e.g. $450 - $700 / mo"
                        className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Evidence & Submission */}
              {activeStep === 'evidence' && (
                <div className="space-y-4">
                  <div className="bg-[#B28A45]/10 border border-[#B28A45]/30 p-4 rounded-xs">
                    <h4 className="font-serif font-bold text-sm text-[#171918] m-0 mb-1">
                      Evidence-Based Verification Requirement
                    </h4>
                    <p className="text-[#676963] text-xs m-0">
                      All corrections require corroborating public links: official university fee schedules, gazette notifications, ministry accreditation portals, or university registrar pages.
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[#171918] block mb-1">
                      Official Source Document URL / Gazette Link <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={profileForm.sourceDocumentUrl}
                      onChange={(e) => handleChange('sourceDocumentUrl', e.target.value)}
                      placeholder="https://institution.edu/fees-schedule or official ministerial gazette link"
                      className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171918] block mb-1">
                      Gazette / Regulatory Citation Code
                    </label>
                    <input
                      type="text"
                      value={profileForm.gazetteReference}
                      onChange={(e) => handleChange('gazetteReference', e.target.value)}
                      placeholder="e.g. Ministry of Higher Education Gazette Vol. 44 / No. 12"
                      className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171918] block mb-1">
                      Audit Notes &amp; Verification Justification
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.verificationNotes}
                      onChange={(e) => handleChange('verificationNotes', e.target.value)}
                      placeholder="Summarize the changes made and any contextual information for the verification team..."
                      className="w-full bg-white border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* ─── Footer Controls ─── */}
            <div className="bg-white border-t border-[#D9D7D0] p-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#676963] hover:text-[#171918] transition cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {activeStep !== 'claimant' && (
                  <button
                    type="button"
                    onClick={() => {
                      const steps: StepCategory[] = ['claimant', 'basic', 'campuses', 'academics', 'tuition', 'evidence'];
                      const curIdx = steps.indexOf(activeStep);
                      if (curIdx > 0) setActiveStep(steps[curIdx - 1]);
                    }}
                    className="px-4 py-2 border border-[#D9D7D0] bg-[#F7F6F2] hover:bg-white text-xs font-semibold text-[#171918] rounded-xs transition cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}

                {activeStep !== 'evidence' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const steps: StepCategory[] = ['claimant', 'basic', 'campuses', 'academics', 'tuition', 'evidence'];
                      const curIdx = steps.indexOf(activeStep);
                      if (curIdx < steps.length - 1) setActiveStep(steps[curIdx + 1]);
                    }}
                    className="px-5 py-2 bg-[#164A3A] hover:bg-[#0e3025] text-white text-xs font-semibold rounded-xs transition cursor-pointer"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-[#164A3A] hover:bg-[#0e3025] text-white text-xs font-bold rounded-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting to Sovereign Ledger...' : 'Submit Institutional Claim'}</span>
                  </button>
                )}
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
