'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUniversities } from '@/components/layout/InstitutionsProvider';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, Send, Building2, GraduationCap, Coins } from 'lucide-react';

function CorrectionsPageContent() {
  const searchParams = useSearchParams();
  const preselectedUniId = searchParams.get('uni');
  const { universities } = useUniversities();

  const [selectedUniId, setSelectedUniId] = useState<string>(preselectedUniId || universities[0]?.id || '');
  const [claimType, setClaimType] = useState<'FULL_PROFILE_VERIFICATION' | 'TARGETED_FIELD_CORRECTION'>('FULL_PROFILE_VERIFICATION');
  
  const [submitterName, setSubmitterName] = useState('');
  const [submitterRole, setSubmitterRole] = useState('Institutional Planning / Registrar Officer');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitterPhone, setSubmitterPhone] = useState('');

  const [sourceUrl, setSourceUrl] = useState('');
  const [gazetteRef, setGazetteRef] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Prepopulate editable profile fields based on selectedUni
  const selectedUni = useMemo(() => {
    return universities.find((u) => u.id === selectedUniId) || universities[0];
  }, [universities, selectedUniId]);

  const [formFields, setFormFields] = useState({
    name: '',
    viceChancellor: '',
    nativeMotto: '',
    primaryAccreditation: '',
    type: '',
    estYear: 1960,
    website: '',
    city: '',
    campusesCount: 1,
    campusesListText: '',
    degreesOfferedCount: 100,
    undergradDegreesCount: 50,
    postgradDegreesCount: 40,
    doctoralProgramsCount: 10,
    flagshipFaculties: '',
    totalEnrollment: 20000,
    academicStaff: 1000,
    phdFacultyShare: 60,
    studentFacultyRatio: '18:1',
    domesticTuitionAverage: '',
    domesticTuitionUsd: '',
    internationalTuitionAnnual: '',
    averageMonthlyLiving: '',
  });

  useEffect(() => {
    if (selectedUni) {
      setFormFields({
        name: selectedUni.name || '',
        viceChancellor: selectedUni.viceChancellor || '',
        nativeMotto: selectedUni.nativeMotto || '',
        primaryAccreditation: selectedUni.primaryAccreditation || selectedUni.accreditationBody || '',
        type: selectedUni.type || '',
        estYear: selectedUni.estYear || 1960,
        website: selectedUni.website || '',
        city: selectedUni.city || '',
        campusesCount: selectedUni.campusesCount || 1,
        campusesListText: (selectedUni.campusesList || [selectedUni.city]).join(', '),
        degreesOfferedCount: selectedUni.degreesOfferedCount || 100,
        undergradDegreesCount: selectedUni.undergradDegreesCount || 50,
        postgradDegreesCount: selectedUni.postgradDegreesCount || 40,
        doctoralProgramsCount: selectedUni.doctoralProgramsCount || 10,
        flagshipFaculties: Array.isArray(selectedUni.flagshipFaculties) ? selectedUni.flagshipFaculties.join(', ') : (selectedUni.flagshipFaculties || ''),
        totalEnrollment: selectedUni.totalEnrollment || 20000,
        academicStaff: selectedUni.academicStaff || 1000,
        phdFacultyShare: selectedUni.phdFacultyShare || 60,
        studentFacultyRatio: selectedUni.studentFacultyRatio || '18:1',
        domesticTuitionAverage: selectedUni.domesticTuitionAverage || '',
        domesticTuitionUsd: selectedUni.domesticTuitionUsd || '',
        internationalTuitionAnnual: selectedUni.internationalTuitionAnnual || '',
        averageMonthlyLiving: selectedUni.averageMonthlyLiving || '',
      });
      if (selectedUni.website) setSourceUrl(selectedUni.website);
      setGazetteRef(`Sovereign Gazette Ref for ${selectedUni.country}`);
    }
  }, [selectedUni]);

  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{ claimId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (key: string, val: any) => {
    setFormFields(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedUni) {
      setErrorMsg('Please select an institution.');
      return;
    }

    if (!submitterName.trim() || !submitterEmail.trim()) {
      setErrorMsg('Please provide your full name and official institutional email.');
      return;
    }

    if (!sourceUrl.trim()) {
      setErrorMsg('An official source document or gazette URL is mandatory for verification.');
      return;
    }

    setSubmitting(true);

    try {
      const campusesList = formFields.campusesListText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        institutionId: selectedUni.id,
        institutionName: selectedUni.name,
        country: selectedUni.country,
        claimType,
        claimant: {
          fullName: submitterName.trim(),
          email: submitterEmail.trim(),
          designation: submitterRole.trim(),
          phone: submitterPhone.trim(),
        },
        evidence: {
          sourceDocumentUrl: sourceUrl.trim(),
          gazetteReference: gazetteRef.trim(),
          verificationNotes: verificationNotes.trim() || 'Submitted through AHEI Sovereign Verification Portal',
        },
        profileData: {
          ...formFields,
          campusesList,
          campusesCount: Number(formFields.campusesCount) || campusesList.length,
          estYear: Number(formFields.estYear),
          degreesOfferedCount: Number(formFields.degreesOfferedCount),
          undergradDegreesCount: Number(formFields.undergradDegreesCount),
          postgradDegreesCount: Number(formFields.postgradDegreesCount),
          doctoralProgramsCount: Number(formFields.doctoralProgramsCount),
          totalEnrollment: Number(formFields.totalEnrollment),
          academicStaff: Number(formFields.academicStaff),
          phdFacultyShare: Number(formFields.phdFacultyShare),
        },
      };

      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccessReceipt({ claimId: data.claimId || `AHEI-CLAIM-${Date.now()}` });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with sovereign audit ledger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* ─── Breadcrumb ─── */}
      <nav className="font-body-sm text-[#838383] flex items-center gap-2">
        <Link href="/" className="no-underline text-[#838383] hover:text-[#09090B]">Home</Link>
        <span className="text-[#d5d5d5]">/</span>
        <Link href="/about" className="no-underline text-[#838383] hover:text-[#09090B]">About</Link>
        <span className="text-[#d5d5d5]">/</span>
        <span className="text-[#232323] font-semibold">Factual Correction Channel</span>
      </nav>

      {/* ─── Header ─── */}
      <header className="border-b border-[#e9e9e9] pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-code-badge text-white px-3 py-1 font-semibold text-xs rounded-xs"
            style={{ background: '#164A3A' }}
          >
            SOVEREIGN VERIFICATION DESK
          </span>
          <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-xs">
            AHEI-CIV INTEGRITY PROTOCOL
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171918] m-0 mb-3">
          Official Institutional Correction &amp; Claim Channel
        </h1>
        <p className="font-body-lg text-[#676963] m-0 leading-relaxed text-sm sm:text-base">
          AHEI operates on audited sovereign evidence. Institutional registrars, planning desks, researchers, and accredited academic officers can submit complete profile corrections, updated statutory tuition schedules, rector appointments, and multi-campus configurations for audit and ledger recalibration.
        </p>
      </header>

      {successReceipt ? (
        <div className="the-card bg-white rounded-none border border-[#e9e9e9] p-8 sm:p-12 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-[#164A3A]/10 text-[#164A3A] border border-[#164A3A]/30 flex items-center justify-center mx-auto rounded-none">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#171918] m-0">
            Correction Dossier Successfully Staged
          </h2>
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-[#B28A45] tracking-wider uppercase block">
              Cryptographic Audit Reference
            </span>
            <p className="font-mono text-sm font-bold text-[#164A3A] bg-[#F7F6F2] p-2.5 border border-[#D9D7D0] inline-block m-0">
              AUDIT CODE: {successReceipt.claimId}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-[#676963] max-w-xl mx-auto leading-relaxed">
            Your factual observation regarding <strong>{selectedUni?.name}</strong> has been committed to the AHEI Sovereign Verification Queue. Upon cross-referencing your submitted official documents, the continental registry will automatically update.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSuccessReceipt(null);
                setVerificationNotes('');
              }}
              className="px-5 py-2.5 rounded-xs border border-[#D9D7D0] text-xs font-semibold text-[#171918] hover:border-[#164A3A] transition cursor-pointer bg-white"
            >
              Submit Another Dossier
            </button>
            <Link
              href={`/universities/${selectedUni?.id}`}
              className="px-5 py-2.5 rounded-xs bg-[#164A3A] text-white text-xs font-semibold hover:bg-[#0e3025] transition no-underline shadow-xs"
            >
              View Institution Dossier →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="the-card bg-white rounded-none border border-[#e9e9e9] p-6 sm:p-8 space-y-8 shadow-sm text-xs">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 rounded-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Target Institution Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#164A3A] border-b border-[#e9e9e9] pb-2 m-0 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#164A3A]" />
              <span>1. Target Institution &amp; Claim Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Select Higher Education Institution <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                >
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.country}) — #{uni.rank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Scope of Submission
                </label>
                <select
                  value={claimType}
                  onChange={(e: any) => setClaimType(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                >
                  <option value="FULL_PROFILE_VERIFICATION">Full Institutional Profile Audit &amp; Rectification</option>
                  <option value="TARGETED_FIELD_CORRECTION">Targeted Metric / Leadership / Tuition Update</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Claimant Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#164A3A] border-b border-[#e9e9e9] pb-2 m-0 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#164A3A]" />
              <span>2. Submitter Identity &amp; Accreditation Authority</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Claimant Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="e.g. Dr. Adeyemi Adeleke"
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Official Institutional Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="e.g. registrar@institution.edu"
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={submitterRole}
                  onChange={(e) => setSubmitterRole(e.target.value)}
                  placeholder="e.g. Deputy Registrar / Dean"
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Profile Corrections (All fields editable) */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#164A3A] border-b border-[#e9e9e9] pb-2 m-0 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#164A3A]" />
              <span>3. Verified Profile Data (Edit fields as needed)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#171918] block mb-1">Official Legal Name</label>
                <input
                  type="text"
                  value={formFields.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">Vice-Chancellor / President / Rector</label>
                <input
                  type="text"
                  value={formFields.viceChancellor}
                  onChange={(e) => handleFieldChange('viceChancellor', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">Official Latin / Sovereign Motto</label>
                <input
                  type="text"
                  value={formFields.nativeMotto}
                  onChange={(e) => handleFieldChange('nativeMotto', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden italic"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">Primary Accreditation Body</label>
                <input
                  type="text"
                  value={formFields.primaryAccreditation}
                  onChange={(e) => handleFieldChange('primaryAccreditation', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-[#171918] block mb-1">
                  Physical Campuses &amp; Regional Branch Locations (Comma separated)
                </label>
                <textarea
                  rows={2}
                  value={formFields.campusesListText}
                  onChange={(e) => handleFieldChange('campusesListText', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Domestic Statutory Tuition (Local Currency)
                </label>
                <input
                  type="text"
                  value={formFields.domesticTuitionAverage}
                  onChange={(e) => handleFieldChange('domesticTuitionAverage', e.target.value)}
                  placeholder="e.g. ZAR 65,000 - 95,000 / NGN 450,000"
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Domestic Tuition (USD Equivalent Approx)
                </label>
                <input
                  type="text"
                  value={formFields.domesticTuitionUsd}
                  onChange={(e) => handleFieldChange('domesticTuitionUsd', e.target.value)}
                  placeholder="e.g. $3,500 - $5,200"
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-[#171918] block mb-1">
                  Flagship Faculties &amp; Leading Departments
                </label>
                <textarea
                  rows={2}
                  value={formFields.flagshipFaculties}
                  onChange={(e) => handleFieldChange('flagshipFaculties', e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Evidence & Gazette Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#164A3A] border-b border-[#e9e9e9] pb-2 m-0 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#164A3A]" />
              <span>4. Gazette Reference &amp; Evidence Documentation</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Official Public Evidence / Fee Schedule URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171918] block mb-1">
                  Audit Notes &amp; Justification
                </label>
                <textarea
                  rows={3}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Contextual notes for the sovereign auditor..."
                  className="w-full bg-[#F7F6F2] border border-[#D9D7D0] p-2.5 rounded-xs text-xs text-[#171918] focus:border-[#164A3A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#e9e9e9] flex items-center justify-between">
            <p className="text-[11px] text-[#676963] m-0">
              Submissions are permanently recorded in the AHEI verification ledger and audited against sovereign gazettes.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#164A3A] hover:bg-[#0e3025] text-white text-xs font-bold rounded-xs transition cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Staging into Ledger...' : 'Submit Institutional Claim Dossier'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}

export default function CorrectionsPage() {
  return (
    <Suspense fallback={<div className="max-w-[960px] mx-auto p-12 text-center text-xs font-mono">Loading Sovereign Verification Desk...</div>}>
      <CorrectionsPageContent />
    </Suspense>
  );
}
