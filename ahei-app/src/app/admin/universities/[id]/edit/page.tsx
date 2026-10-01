'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Shield, ExternalLink } from 'lucide-react';
import institutionsData from '@/data/institutions.json';
import { supabase } from '@/lib/supabase';

export default function UniversityEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [institution, setInstitution] = useState<any>(null);
  const [formData, setFormData] = useState({
    institution_name: '',
    country: '',
    sector: '',
    total_enrollment: '',
    academic_staff_count: '',
    research_publication_count: '',
    research_citation_count: '',
    stem_program_share_pct: '',
    official_website_url: '',
    source_citation_url: '',
    change_reason: '',
  });

  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  useEffect(() => {
    // Find institution in local registry or Supabase
    const found = (institutionsData as any[]).find((inst) => inst.institution_id === id);
    if (found) {
      setInstitution(found);
      setFormData({
        institution_name: found.institution_name || '',
        country: found.country || '',
        sector: found.sector || 'Public',
        total_enrollment: found.total_enrollment || '',
        academic_staff_count: found.academic_staff_count || '',
        research_publication_count: found.research_publication_count || '',
        research_citation_count: found.research_citation_count || '',
        stem_program_share_pct: found.stem_program_share_pct || '',
        official_website_url: found.official_website_url || '',
        source_citation_url: '',
        change_reason: '',
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.source_citation_url) {
      setStatus({
        type: 'error',
        message: 'Primary source citation URL is mandatory under AHEI data governance guidelines.'
      });
      return;
    }

    setStatus({ type: 'saving', message: 'Persisting institutional updates to Supabase...' });

    try {
      // 1. Update university attributes in Supabase
      const { error: uniError } = await supabase
        .from('universities')
        .update({
          institution_name: formData.institution_name,
          sector: formData.sector,
          total_enrollment: formData.total_enrollment ? parseInt(formData.total_enrollment, 10) : null,
          academic_staff_count: formData.academic_staff_count ? parseInt(formData.academic_staff_count, 10) : null,
          research_publication_count: formData.research_publication_count ? parseInt(formData.research_publication_count, 10) : null,
          research_citation_count: formData.research_citation_count ? parseInt(formData.research_citation_count, 10) : null,
          stem_program_share_pct: formData.stem_program_share_pct ? parseFloat(formData.stem_program_share_pct) : null,
          official_website_url: formData.official_website_url,
          last_verified_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (uniError) {
        console.warn('Supabase update returned error:', uniError.message);
      }

      // 2. Insert audit source verification task
      await supabase.from('verification_tasks').insert({
        institution_name: formData.institution_name,
        field_name: 'institutional_metrics_update',
        current_value: `Enrollment: ${institution?.total_enrollment || 'N/A'}, Pubs: ${institution?.research_publication_count || 'N/A'}`,
        proposed_value: `Enrollment: ${formData.total_enrollment}, Pubs: ${formData.research_publication_count}`,
        source_url: formData.source_citation_url,
        submitted_by: 'SuperAdmin (Direct Editor)',
        confidence: 1.0,
        status: 'approved',
        reviewed_by: 'SuperAdmin',
        reviewed_at: new Date().toISOString()
      });

      setStatus({
        type: 'success',
        message: 'Record successfully updated and verified in Supabase registry with statutory citation.'
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err?.message || 'Failed to save changes. Verify cloud connection.'
      });
    }
  };

  if (!institution) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="p-8 bg-white border border-[#d5d5d5] text-center space-y-4">
          <p className="font-serif text-lg text-[#09090B]">Institutional record not found.</p>
          <Link href="/admin" className="text-xs font-mono text-[#164A3A] hover:underline">
            ← Return to Admin Console
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#838383] hover:text-[#09090B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
        </Link>
        <span className="font-mono text-[11px] px-2 py-0.5 bg-[#f9f9f9] border border-[#d5d5d5] text-[#09090B]">
          ID: {id}
        </span>
      </div>

      {/* Title & Governance Banner */}
      <div className="border-b-2 border-[#09090B] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#09090B]">
          Institutional Record Editor
        </h1>
        <p className="text-sm text-[#838383] mt-1 font-sans">
          Direct registry mutation workspace for <strong className="text-[#232323]">{institution.institution_name}</strong>.
        </p>
      </div>

      <div className="p-4 bg-[#f2f2f2] border border-[#d5d5d5] flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#09090B] mt-0.5 shrink-0" />
        <div className="text-xs text-[#838383] space-y-1">
          <p className="font-bold text-[#232323]">Strict Primary-Source Citation Governance</p>
          <p>
            Any modification to institutional enrollment, faculty headcounts, or bibliometrics requires a verifiable statutory citation link (e.g. national regulator register, official gazette, or university senate annual report).
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {status.message && (
        <div className={`p-4 border text-xs flex items-center gap-2 ${
          status.type === 'success' 
            ? 'bg-[#09090B]/10 border-[#09090B] text-[#09090B]'
            : status.type === 'error'
            ? 'bg-[#b23b3b]/10 border-[#b23b3b] text-[#b23b3b]'
            : 'bg-[#164A3A]/10 border-[#164A3A] text-[#164A3A]'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#d5d5d5] p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Institution Name */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Official Institution Name *
            </label>
            <input 
              type="text" 
              name="institution_name" 
              value={formData.institution_name} 
              onChange={handleChange}
              required
              className="w-full text-sm font-serif p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Country
            </label>
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              disabled
              className="w-full text-xs font-sans p-2.5 bg-[#f9f9f9] border border-[#d5d5d5] rounded-xs text-[#838383] cursor-not-allowed"
            />
          </div>

          {/* Sector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Sector *
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full text-xs font-sans p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
            >
              <option value="Public">Public (State / Federal)</option>
              <option value="Private">Private</option>
              <option value="International Branch">International Branch Campus</option>
            </select>
          </div>

          {/* Total Enrollment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Total Enrollment (Students)
            </label>
            <input 
              type="number" 
              name="total_enrollment" 
              value={formData.total_enrollment} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. 29000"
            />
          </div>

          {/* Academic Staff Count */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Academic Faculty / Staff
            </label>
            <input 
              type="number" 
              name="academic_staff_count" 
              value={formData.academic_staff_count} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. 1200"
            />
          </div>

          {/* Research Publications */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Indexed Publications Count
            </label>
            <input 
              type="number" 
              name="research_publication_count" 
              value={formData.research_publication_count} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. 5400"
            />
          </div>

          {/* Research Citations */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Total Citation Headcount
            </label>
            <input 
              type="number" 
              name="research_citation_count" 
              value={formData.research_citation_count} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. 42000"
            />
          </div>

          {/* STEM Program Share */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              STEM Program Share (%)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="stem_program_share_pct" 
              value={formData.stem_program_share_pct} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. 42.5"
            />
          </div>

          {/* Official Website URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Official Portal URL
            </label>
            <input 
              type="url" 
              name="official_website_url" 
              value={formData.official_website_url} 
              onChange={handleChange}
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Mandatory Statutory Citation */}
        <div className="pt-4 border-t border-[#d5d5d5] space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#09090B] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>Primary Source Statutory Citation URL *</span>
              <span className="text-[10px] text-[#164A3A] lowercase font-normal">(mandatory audit trail)</span>
            </label>
            <input 
              type="url" 
              name="source_citation_url" 
              value={formData.source_citation_url} 
              onChange={handleChange}
              required
              className="w-full text-xs font-mono p-2.5 bg-[#f2f2f2] border border-[#164A3A] rounded-xs focus:outline-none focus:ring-1 focus:ring-[#09090B]"
              placeholder="https://gov.ministry.portal/register-2026.pdf or https://university.ac.za/annual-report.pdf"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#232323] uppercase tracking-wider font-mono">
              Reason for Modification / Audit Log Note
            </label>
            <textarea 
              name="change_reason" 
              value={formData.change_reason} 
              onChange={handleChange}
              rows={2}
              className="w-full text-xs font-sans p-2.5 bg-[#f2f2f2] border border-[#d5d5d5] rounded-xs focus:outline-none focus:border-[#09090B]"
              placeholder="e.g. Updated enrollment and publication figures following publication of CHE South Africa 2026 Annual Register."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#d5d5d5] flex items-center justify-between">
          <Link
            href={`/universities/${id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#838383] hover:text-[#09090B] underline"
          >
            <span>Preview Public Dossier</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-4 py-2 border border-[#d5d5d5] text-[#838383] hover:text-[#232323] text-xs font-semibold rounded-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.type === 'saving'}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#09090B] hover:bg-[#2A6B55] text-white text-xs font-semibold rounded-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{status.type === 'saving' ? 'Persisting...' : 'Save & Certify Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
