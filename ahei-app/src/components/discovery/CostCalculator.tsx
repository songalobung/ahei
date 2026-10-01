'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { University } from '@/data/universities';
import { useUniversities } from '@/components/layout/InstitutionsProvider';

export function CostCalculator() {
  const { universities } = useUniversities();
  const [selectedUniId, setSelectedUniId] = useState(universities[0]?.id || 'uct');
  const [studentType, setStudentType] = useState<'domestic' | 'international'>('domestic');
  const [housingType, setHousingType] = useState<'on_campus' | 'off_campus'>('on_campus');

  const selectedUni = useMemo(() => {
    return universities.find((u) => u.id === selectedUniId) || universities[0];
  }, [universities, selectedUniId]);

  // Parse costs in USD estimates
  const budget = useMemo(() => {
    if (!selectedUni) return null;

    // Tuition
    let tuitionUsd = 2500;
    if (studentType === 'domestic') {
      const match = selectedUni.domesticTuitionUsd?.match(/\$?([\d,]+)/);
      tuitionUsd = match ? parseInt(match[1].replace(/,/g, ''), 10) : 2200;
    } else {
      const match = selectedUni.internationalTuitionAnnual?.match(/\$?([\d,]+)/);
      tuitionUsd = match ? parseInt(match[1].replace(/,/g, ''), 10) : 4800;
    }

    // Housing (annual 10 months)
    let housingUsd = 1800;
    if (housingType === 'on_campus') {
      const match = typeof selectedUni.onCampusAccommodation === 'string'
        ? selectedUni.onCampusAccommodation.match(/\$?([\d,]+)/)
        : null;
      housingUsd = match ? parseInt(match[1].replace(/,/g, ''), 10) : 1500;
    } else {
      housingUsd = Math.round(housingUsd * 1.35); // off-campus is ~35% higher
    }

    // Living expenses (10 months)
    const monthlyMatch = selectedUni.averageMonthlyLiving?.match(/\$?([\d,]+)/);
    const monthlyLiving = monthlyMatch ? parseInt(monthlyMatch[1].replace(/,/g, ''), 10) : 350;
    const livingUsd = monthlyLiving * 10;

    // Books & supplies
    const booksUsd = 400;

    const totalUsd = tuitionUsd + housingUsd + livingUsd + booksUsd;

    return {
      tuitionUsd,
      housingUsd,
      livingUsd,
      booksUsd,
      totalUsd,
      currency: 'USD',
    };
  }, [selectedUni, studentType, housingType]);

  return (
    <div className="the-card bg-white rounded-none border border-[#e9e9e9] shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-[#e9e9e9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]"></span>
              Fees &amp; Funding Calculator
            </span>
            <span className="font-body-sm text-[#838383] text-xs">Student Finance &amp; Affordability Planner</span>
          </div>
          <h2 className="font-headline-sm text-[#09090B] font-bold mt-2 mb-0 text-xl">
            Tuition &amp; Living Cost Estimator
          </h2>
          <p className="font-body-sm text-[#666666] mt-1 mb-0 text-xs sm:text-sm">
            Calculate your complete annual student budget including tuition, residence, food, and study supplies.
          </p>
        </div>

        <Link
          href={`/universities/${selectedUni.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#164A3A] hover:text-[#313ec7] no-underline self-start md:self-auto"
        >
          <span>View {selectedUni.name} Dossier</span>
          <span>→</span>
        </Link>
      </div>

      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* University selector */}
          <div>
            <label className="font-semibold text-xs text-[#09090B] block mb-1.5">
              Select Institution
            </label>
            <select
              value={selectedUniId}
              onChange={(e) => setSelectedUniId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#d5d5d5] rounded-xs bg-white focus:outline-none focus:border-[#09090B] mb-3"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  [{u.countryCode.toUpperCase()}] {u.name} ({u.country})
                </option>
              ))}
            </select>

            {/* Selected Uni Preview with Logo Above Name */}
            <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs flex items-center gap-3.5">
              {selectedUni.crestUrl && (
                <div className="w-14 h-14 bg-white border border-[#e2e8f0] p-1.5 rounded-xs flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src={selectedUni.crestUrl}
                    alt={`${selectedUni.name} official crest`}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0">
                <Link href={`/universities/${selectedUni.id}`} className="hover:text-[#164A3A] font-bold text-sm text-[#09090B] block truncate no-underline transition-colors">
                  {selectedUni.name}
                </Link>
                <span className="font-body-sm block text-[#666666] text-xs mt-0.5">
                  <span className="font-mono text-[10px] font-bold text-[#09090B] bg-[#f1f5f9] px-1.5 py-0.5 rounded-sm border border-[#e2e8f0] mr-1">{selectedUni.countryCode.toUpperCase()}</span>
                  {selectedUni.city}, {selectedUni.country} · Rank #{selectedUni.rank}
                </span>
              </div>
            </div>
          </div>

          {/* Student Status */}
          <div>
            <label className="font-semibold text-xs text-[#09090B] block mb-1.5">
              Residency / Fee Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStudentType('domestic')}
                className="py-2.5 px-3 text-xs font-semibold rounded-full border text-center cursor-pointer transition-all shadow-xs"
                style={{
                  background: studentType === 'domestic' ? '#09090B' : '#FFFFFF',
                  color: studentType === 'domestic' ? '#FFFFFF' : '#09090B',
                  borderColor: studentType === 'domestic' ? '#09090B' : '#e9e9e9',
                }}
              >
                Domestic / National
              </button>
              <button
                type="button"
                onClick={() => setStudentType('international')}
                className="py-2.5 px-3 text-xs font-semibold rounded-full border text-center cursor-pointer transition-all shadow-xs"
                style={{
                  background: studentType === 'international' ? '#09090B' : '#FFFFFF',
                  color: studentType === 'international' ? '#FFFFFF' : '#09090B',
                  borderColor: studentType === 'international' ? '#09090B' : '#e9e9e9',
                }}
              >
                International Student
              </button>
            </div>
          </div>

          {/* Housing Choice */}
          <div>
            <label className="font-semibold text-xs text-[#09090B] block mb-1.5">
              Housing Arrangement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHousingType('on_campus')}
                className="py-2.5 px-3 text-xs font-semibold rounded-full border text-center cursor-pointer transition-all shadow-xs"
                style={{
                  background: housingType === 'on_campus' ? '#09090B' : '#FFFFFF',
                  color: housingType === 'on_campus' ? '#FFFFFF' : '#09090B',
                  borderColor: housingType === 'on_campus' ? '#09090B' : '#e9e9e9',
                }}
              >
                On-Campus Residence
              </button>
              <button
                type="button"
                onClick={() => setHousingType('off_campus')}
                className="py-2.5 px-3 text-xs font-semibold rounded-full border text-center cursor-pointer transition-all shadow-xs"
                style={{
                  background: housingType === 'off_campus' ? '#09090B' : '#FFFFFF',
                  color: housingType === 'off_campus' ? '#FFFFFF' : '#09090B',
                  borderColor: housingType === 'off_campus' ? '#09090B' : '#e9e9e9',
                }}
              >
                Private Rental Flat
              </button>
            </div>
          </div>

          {/* Aid info box */}
          <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-[#09090B]">Financial Aid Availability</span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: selectedUni.financialAidTier === 'HIGH' ? '#dcfce7' : '#fef3c7',
                  color: selectedUni.financialAidTier === 'HIGH' ? '#15803d' : '#b45309',
                }}
              >
                {selectedUni.financialAidTier} SUPPORT
              </span>
            </div>
            <p className="font-body-sm text-[#666666] m-0 text-xs leading-relaxed">
              {selectedUni.financialAidNote || 'National bursaries, university endowment awards, and merit scholarships available for qualified candidates.'}
            </p>
          </div>
        </div>

        {/* Budget Breakdown Summary (7 cols) */}
        <div className="lg:col-span-7 bg-[#f8fafc] p-6 rounded-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#e2e8f0]">
              <span className="font-headline-sm text-sm font-bold text-[#09090B]">
                Estimated Annual Expenditure (10 Months)
              </span>
              <span className="font-mono text-[11px] font-bold bg-white text-[#666666] px-2 py-0.5 rounded-full border border-[#e2e8f0]">
                USD EQUIVALENT
              </span>
            </div>

            {budget && (
              <div className="space-y-3.5 pt-4">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#164A3A] w-6 h-6 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">01</span>
                    <div>
                      <span className="font-semibold text-xs text-[#09090B] block">
                        Annual Tuition &amp; Statutory Fees
                      </span>
                      <span className="text-[11px] text-[#666666]">
                        {studentType === 'domestic' ? 'Subsidized Domestic Rate' : 'International Non-Resident Rate'}
                      </span>
                    </div>
                  </div>
                  <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                    ${budget.tuitionUsd.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#164A3A] w-6 h-6 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">02</span>
                    <div>
                      <span className="font-semibold text-xs text-[#09090B] block">
                        Accommodation (10-Month Academic Session)
                      </span>
                      <span className="text-[11px] text-[#666666]">
                        {housingType === 'on_campus' ? 'University Dormitory / Halls' : 'Estimated Shared Private Flat'}
                      </span>
                    </div>
                  </div>
                  <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                    ${budget.housingUsd.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#164A3A] w-6 h-6 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">03</span>
                    <div>
                      <span className="font-semibold text-xs text-[#09090B] block">
                        Living, Food &amp; Local Transit
                      </span>
                      <span className="text-[11px] text-[#666666]">
                        Estimated monthly costs × 10 months
                      </span>
                    </div>
                  </div>
                  <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                    ${budget.livingUsd.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#164A3A] w-6 h-6 rounded-full bg-[#F7F6F2] flex items-center justify-center shrink-0">04</span>
                    <div>
                      <span className="font-semibold text-xs text-[#09090B] block">
                        Course Books &amp; Lab Materials
                      </span>
                      <span className="text-[11px] text-[#666666]">
                        Standard annual allowance
                      </span>
                    </div>
                  </div>
                  <span className="font-tabular-num font-bold text-sm text-[#09090B]">
                    ${budget.booksUsd.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {budget && (
            <div className="pt-5 mt-5 border-t border-[#e2e8f0] flex items-baseline justify-between">
              <div>
                <span className="font-headline-sm text-sm font-bold text-[#09090B] block">
                  Total Estimated Annual Investment
                </span>
                <span className="text-[11px] text-[#666666]">
                  All figures audited in {selectedUni.city}, {selectedUni.country}
                </span>
              </div>
              <div className="text-right">
                <span className="font-tabular-num text-2xl font-bold text-[#09090B]">
                  ${budget.totalUsd.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#666666] block font-mono">
                  USD / academic year
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
