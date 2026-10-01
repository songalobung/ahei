import React, { useState } from 'react';
import { University } from '../data/universities';

interface CompareScreenProps {
  allUniversities: University[];
  selectedIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (id: string) => void;
  onSelectUniversity: (id: string) => void;
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => void;
  onOpenMethodology: () => void;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({
  allUniversities,
  selectedIds,
  onRemoveFromCompare,
  onAddToCompare,
  onSelectUniversity,
  onNavigate,
  onOpenMethodology,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Get active universities object list
  const activeUnis = allUniversities.filter((u) => selectedIds.includes(u.id));

  // Color assignments for comparison
  const colors = [
    { border: '#3c6657', fill: 'rgba(60, 102, 87, 0.25)', stroke: '#3c6657', bar: 'bg-[#3c6657]', text: 'text-[#3c6657]' },
    { border: '#a14013', fill: 'rgba(161, 64, 19, 0.2)', stroke: '#a14013', bar: 'bg-[#a14013]', text: 'text-[#a14013]' },
    { border: '#c8941e', fill: 'rgba(200, 148, 30, 0.3)', stroke: '#c8941e', bar: 'bg-[#c8941e]', text: 'text-[#c8941e]' },
    { border: '#00241a', fill: 'rgba(0, 36, 26, 0.25)', stroke: '#00241a', bar: 'bg-[#00241a]', text: 'text-[#00241a]' },
  ];

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCSV = () => {
    let csv = 'Indicator';
    activeUnis.forEach((u) => {
      csv += `,"${u.name}"`;
    });
    csv += '\n';

    const addRow = (label: string, getter: (u: University) => string | number) => {
      csv += `"${label}"`;
      activeUnis.forEach((u) => {
        csv += `,"${getter(u)}"`;
      });
      csv += '\n';
    };

    addRow('AHEI Overall Score', (u) => `${u.aheiScore} / 100`);
    addRow('Continental Rank', (u) => `#${u.rank}`);
    addRow('Regional Rank', (u) => `#${u.regionalRank} (${u.region})`);
    addRow('Research Output', (u) => u.researchScore);
    addRow('Teaching Quality', (u) => u.teachingScore);
    addRow('Graduate Employability', (u) => `${u.employabilityScore}%`);
    addRow('Doctoral Faculty Share', (u) => `${u.phdFacultyShare}%`);
    addRow('Student-to-Faculty Ratio', (u) => u.studentFacultyRatio);
    addRow('Domestic Tuition', (u) => u.domesticTuitionAverage);
    addRow('International Tuition', (u) => u.internationalTuitionAnnual);
    addRow('Monthly Living Cost', (u) => u.averageMonthlyLiving);
    addRow('Total Enrollment', (u) => u.totalEnrollment);
    addRow('International Diversity', (u) => `${u.internationalDiversityPct}%`);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AHEI_University_Comparison_Matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Convert radar vector (0-100) to SVG coordinates for 5 axes
  // Center is (200, 200), radius is 160
  // Axis angles (in radians):
  // 0: top (Research Output) -> -PI/2
  // 1: top-right (Employability) -> -PI/2 + 2PI/5
  // 2: bottom-right (Teaching Impact) -> -PI/2 + 4PI/5
  // 3: bottom-left (Faculty PhD Ratio) -> -PI/2 + 6PI/5
  // 4: top-left (Global Outlook) -> -PI/2 + 8PI/5
  const getRadarPoint = (value: number, axisIndex: number) => {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / 5;
    const r = (Math.max(0, Math.min(100, value)) / 100) * 150;
    const x = 200 + r * Math.cos(angle);
    const y = 200 + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const candidateUnis = allUniversities.filter(
    (u) =>
      !selectedIds.includes(u.id) &&
      (modalSearch === '' ||
        u.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        u.country.toLowerCase().includes(modalSearch.toLowerCase()) ||
        u.city.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full bg-[#faf9fd]">
      {/* Top Banner & Control Deck */}
      <div className="w-full bg-[#f5f3f7] py-8 border-b border-[#c0c8c3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-1.5 font-code-badge text-[11px] text-[#a14013] uppercase font-semibold mb-1">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                <span>Comparative Assessment Dossier • 2027 AHEI Standard</span>
              </div>
              <h1 className="font-headline-lg text-[32px] lg:text-[40px] text-[#00241a] tracking-tight font-serif font-bold uppercase">
                COMPARE AFRICAN UNIVERSITIES
              </h1>
              <p className="font-body-md text-[14px] text-[#414845] mt-1">
                Side-by-side performance, admissions, tuition, and research benchmarking across up to 4 African universities. All metrics calibrated against verified continental audit protocols.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-white text-[#00241a] px-3.5 py-2 font-title-md text-[13px] hover:bg-[#efedf1] transition-colors border border-[#c0c8c3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#a14013]">picture_as_pdf</span>
                <span>Export Comparison PDF</span>
              </button>
              <button
                onClick={handleShareLink}
                className="flex items-center gap-1.5 bg-white text-[#00241a] px-3.5 py-2 font-title-md text-[13px] hover:bg-[#efedf1] transition-colors border border-[#c0c8c3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedLink ? 'check' : 'share'}
                </span>
                <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 bg-[#00241a] text-white px-3.5 py-2 font-title-md text-[13px] hover:bg-[#0e3b2e] transition-colors border border-[#00241a] cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Active Selection Strip */}
          <div className="bg-white p-4 border border-[#c0c8c3]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#414845] font-semibold">
                Active Institutional Selection ({activeUnis.length} / 4 Maximum)
              </span>
              <span className="font-code-badge text-[11px] text-[#414845]">Click to cycle or swap</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeUnis.map((uni, idx) => {
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={uni.id}
                    className="flex items-center justify-between p-2.5 bg-[#f5f3f7] border border-[#c0c8c3] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.bar}`}></span>
                      <div className="truncate">
                        <button
                          onClick={() => {
                            onSelectUniversity(uni.id);
                            onNavigate('universities', uni.id);
                          }}
                          className="font-title-md text-[13px] text-[#00241a] block truncate font-bold text-left hover:text-[#a14013] cursor-pointer"
                        >
                          {uni.name}
                        </button>
                        <span className="font-code-badge text-[10px] text-[#414845]">
                          {uni.country} • {uni.region.replace(' Africa', '')}
                        </span>
                      </div>
                    </div>
                    {activeUnis.length > 1 && (
                      <button
                        onClick={() => onRemoveFromCompare(uni.id)}
                        className="text-[#414845] hover:text-[#ba1a1a] p-1 cursor-pointer"
                        title="Remove University"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {activeUnis.length < 4 && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 p-2.5 bg-[#e3e2e6] hover:bg-[#dbd9dd] text-[#00241a] font-title-md text-[13px] transition-colors border border-dashed border-[#c0c8c3] group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#a14013] group-hover:scale-110 transition-transform">
                    add_circle
                  </span>
                  <span>Add {activeUnis.length + 1}th Institution</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full space-y-12">
        {/* SECTION 01: EXECUTIVE DOSSIERS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#a14013] font-semibold">
                Section 01
              </span>
              <h2 className="font-headline-md text-[26px] text-[#00241a] font-serif">
                Executive Dossiers
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1 font-code-badge text-[11px] text-[#414845]">
              <span className="material-symbols-outlined text-[16px] text-[#00241a]">verified</span>
              <span>Triple Registry Alignment</span>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(activeUnis.length, 4)} gap-6`}>
            {activeUnis.map((uni, idx) => {
              const color = colors[idx % colors.length];
              return (
                <div
                  key={uni.id}
                  className="bg-white p-6 border border-[#c0c8c3] shadow-xs flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-full h-1 absolute top-0 left-0" style={{ backgroundColor: color.border }}></div>
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="font-code-badge text-[10px] bg-[#efedf1] px-2 py-0.5 text-[#414845] border border-[#c0c8c3]">
                          {uni.registryId}
                        </span>
                        <h3 className="font-headline-sm text-[20px] text-[#00241a] font-serif mt-1 font-bold">
                          {uni.name}
                        </h3>
                        <p className="font-body-sm text-[12px] text-[#414845]">
                          {uni.city}, {uni.country} • Est. {uni.estYear}
                        </p>
                      </div>
                      <img
                        className="w-14 h-14 object-contain shrink-0 bg-[#f5f3f7] p-1 border border-[#c0c8c3]"
                        src={uni.crestUrl}
                        alt={`${uni.name} crest emblem`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#f5f3f7] p-2 mb-4 text-center border border-[#c0c8c3]">
                      <div>
                        <span className="font-code-badge text-[10px] uppercase text-[#414845] block">
                          Continental
                        </span>
                        <span className="font-headline-sm text-[20px] text-[#00241a] font-serif font-bold">
                          #{uni.rank}
                        </span>
                      </div>
                      <div className="bg-white/60">
                        <span className="font-code-badge text-[10px] uppercase text-[#414845] block">
                          Regional
                        </span>
                        <span className="font-headline-sm text-[20px] text-[#00241a] font-serif font-bold">
                          #{uni.regionalRank}
                        </span>
                        <span className="font-code-badge text-[9px] text-[#a14013] block">
                          {uni.region.replace(' Africa', '')}
                        </span>
                      </div>
                      <div>
                        <span className="font-code-badge text-[10px] uppercase text-[#414845] block">
                          National
                        </span>
                        <span className="font-headline-sm text-[20px] text-[#00241a] font-serif font-bold">
                          #{uni.nationalRank}
                        </span>
                        <span className="font-code-badge text-[9px] text-[#414845] block">
                          {uni.country}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-title-md text-[13px] text-[#1b1b1f]">Overall Score</span>
                        <span className="font-tabular-num text-[18px] text-[#00241a] font-bold">
                          {uni.aheiScore.toFixed(1)}
                          <span className="text-[12px] text-[#414845] font-normal"> / 100</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#efedf1] h-2 overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${uni.aheiScore}%`, backgroundColor: color.border }}
                        ></div>
                      </div>
                    </div>

                    <p className="font-body-md text-[13px] text-[#414845] leading-relaxed">
                      {uni.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-2 flex items-center justify-between font-code-badge text-[11px] text-[#414845] bg-[#f5f3f7] px-3 py-2 border border-[#c0c8c3]">
                    <span>Faculty ratio: {uni.studentFacultyRatio}</span>
                    <span className="text-[#a14013] font-bold">
                      {(uni.totalEnrollment / 1000).toFixed(1)}k Enrolled
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 02: DIMENSIONAL STRENGTH VECTORS */}
        <div className="bg-white p-6 border border-[#c0c8c3] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#a14013] font-semibold">
                Section 02
              </span>
              <h2 className="font-headline-md text-[26px] text-[#00241a] font-serif">
                Dimensional Strength Vectors
              </h2>
              <p className="font-body-sm text-[12px] text-[#414845] mt-1">
                Multi-axis comparative index normalized on a 0–100 percentile baseline.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 font-code-badge text-[11px]">
              {activeUnis.map((uni, idx) => (
                <div key={uni.id} className="flex items-center gap-2">
                  <span className={`w-3 h-3 ${colors[idx % colors.length].bar}`}></span>
                  <span className="text-[#00241a] font-bold">
                    {uni.name} ({uni.country})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* SVG Spider Radar Chart */}
            <div className="w-full bg-[#f5f3f7] p-6 flex flex-col items-center justify-center border border-[#c0c8c3]">
              <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Concentric pentagons */}
                  {[100, 75, 50, 25].map((pct, ringIdx) => {
                    const points = [0, 1, 2, 3, 4]
                      .map((axisIdx) => getRadarPoint(pct, axisIdx))
                      .join(' ');
                    return (
                      <polygon
                        key={ringIdx}
                        points={points}
                        fill="none"
                        stroke="#c0c8c3"
                        strokeWidth={ringIdx === 0 ? '1' : '0.75'}
                        strokeDasharray={ringIdx === 3 ? '2 2' : 'none'}
                        opacity={1 - ringIdx * 0.15}
                      />
                    );
                  })}

                  {/* Spokes */}
                  {[0, 1, 2, 3, 4].map((axisIdx) => {
                    const center = '200,200';
                    const outer = getRadarPoint(100, axisIdx);
                    const [ox, oy] = outer.split(',');
                    return (
                      <line
                        key={axisIdx}
                        x1="200"
                        y1="200"
                        x2={ox}
                        y2={oy}
                        stroke="#c0c8c3"
                        strokeWidth="0.75"
                      />
                    );
                  })}

                  {/* Polygons for each university */}
                  {activeUnis.map((uni, idx) => {
                    const color = colors[idx % colors.length];
                    const pts = [
                      getRadarPoint(uni.vectors.researchOutput, 0),
                      getRadarPoint(uni.vectors.employability, 1),
                      getRadarPoint(uni.vectors.teachingImpact, 2),
                      getRadarPoint(uni.vectors.facultyPhdRatio, 3),
                      getRadarPoint(uni.vectors.globalOutlook, 4),
                    ].join(' ');

                    return (
                      <g key={uni.id}>
                        <polygon
                          points={pts}
                          fill={color.fill}
                          stroke={color.stroke}
                          strokeWidth="2"
                          strokeDasharray={idx === 1 ? '3 3' : 'none'}
                        />
                        {/* Circles on vertices */}
                        {[0, 1, 2, 3, 4].map((axisIdx) => {
                          const val = [
                            uni.vectors.researchOutput,
                            uni.vectors.employability,
                            uni.vectors.teachingImpact,
                            uni.vectors.facultyPhdRatio,
                            uni.vectors.globalOutlook,
                          ][axisIdx];
                          const [cx, cy] = getRadarPoint(val, axisIdx).split(',');
                          return <circle key={axisIdx} cx={cx} cy={cy} r="3.5" fill={color.stroke} />;
                        })}
                      </g>
                    );
                  })}
                </svg>

                {/* Radar Axis Labels */}
                <span className="absolute top-2 font-code-badge text-[11px] text-[#1b1b1f] font-bold">
                  Research Output
                </span>
                <span className="absolute right-0 top-1/3 font-code-badge text-[11px] text-[#1b1b1f] font-bold text-right">
                  Employability
                </span>
                <span className="absolute right-4 bottom-2 font-code-badge text-[11px] text-[#1b1b1f] font-bold">
                  Teaching Impact
                </span>
                <span className="absolute left-4 bottom-2 font-code-badge text-[11px] text-[#1b1b1f] font-bold">
                  Faculty PhD Ratio
                </span>
                <span className="absolute left-0 top-1/3 font-code-badge text-[11px] text-[#1b1b1f] font-bold">
                  Global Outlook
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-[#414845] mt-2">
                Equi-angular pentagonal projection mapped from AHEI 2027 audit scorecards.
              </span>
            </div>

            {/* Comparative Breakdown Bars */}
            <div className="flex flex-col gap-4">
              {/* Group 1: Research Citations */}
              <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                <div className="flex justify-between text-body-sm font-title-md text-[#00241a] mb-2 font-bold">
                  <span>Research Citations &amp; Output</span>
                  <span className="font-tabular-num text-code-badge text-[11px] text-[#414845]">
                    {activeUnis.map((u) => `${u.name.split(' ')[0]}: ${u.researchScore}`).join(' | ')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activeUnis.map((u, i) => (
                    <div key={u.id} className="w-full bg-[#e9e7ec] h-2.5">
                      <div
                        className="h-full"
                        style={{ width: `${u.researchScore}%`, backgroundColor: colors[i % colors.length].border }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 2: Employability */}
              <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                <div className="flex justify-between text-body-sm font-title-md text-[#00241a] mb-2 font-bold">
                  <span>Graduate Employability Rate</span>
                  <span className="font-tabular-num text-code-badge text-[11px] text-[#414845]">
                    {activeUnis.map((u) => `${u.name.split(' ')[0]}: ${u.employabilityScore}%`).join(' | ')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activeUnis.map((u, i) => (
                    <div key={u.id} className="w-full bg-[#e9e7ec] h-2.5">
                      <div
                        className="h-full"
                        style={{ width: `${u.employabilityScore}%`, backgroundColor: colors[i % colors.length].border }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: Doctoral Faculty */}
              <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                <div className="flex justify-between text-body-sm font-title-md text-[#00241a] mb-2 font-bold">
                  <span>Faculty Holding Doctoral Qualifications</span>
                  <span className="font-tabular-num text-code-badge text-[11px] text-[#414845]">
                    {activeUnis.map((u) => `${u.name.split(' ')[0]}: ${u.phdFacultyShare}%`).join(' | ')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activeUnis.map((u, i) => (
                    <div key={u.id} className="w-full bg-[#e9e7ec] h-2.5">
                      <div
                        className="h-full"
                        style={{ width: `${u.phdFacultyShare}%`, backgroundColor: colors[i % colors.length].border }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 4: International Diversity */}
              <div className="p-3 bg-[#f5f3f7] border border-[#c0c8c3]">
                <div className="flex justify-between text-body-sm font-title-md text-[#00241a] mb-2 font-bold">
                  <span>International Student Integration</span>
                  <span className="font-tabular-num text-code-badge text-[11px] text-[#414845]">
                    {activeUnis.map((u) => `${u.name.split(' ')[0]}: ${u.internationalDiversityPct}%`).join(' | ')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activeUnis.map((u, i) => (
                    <div key={u.id} className="w-full bg-[#e9e7ec] h-2.5">
                      <div
                        className="h-full"
                        style={{ width: `${Math.min(100, u.internationalDiversityPct * 4)}%`, backgroundColor: colors[i % colors.length].border }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 03: COMPREHENSIVE PERFORMANCE MATRIX */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <span className="font-code-badge text-[11px] uppercase tracking-wider text-[#a14013] font-semibold">
                Section 03
              </span>
              <h2 className="font-headline-md text-[26px] text-[#00241a] font-serif">
                Comprehensive Performance Matrix
              </h2>
            </div>
            <div className="flex items-center gap-2 font-code-badge text-[11px] text-[#414845]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#a14013]"></span>
              <span>Curated Institutional Benchmarks</span>
            </div>
          </div>

          <div className="bg-white border border-[#c0c8c3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efedf1] text-[#414845] font-title-md text-code-badge uppercase tracking-wider text-[11px] border-b border-[#c0c8c3]">
                    <th className="py-3 px-4 w-1/4">Evaluation Indicator</th>
                    {activeUnis.map((uni, idx) => (
                      <th
                        key={uni.id}
                        className="py-3 px-4 w-1/4 text-[#00241a] font-bold border-l border-[#c0c8c3]"
                        style={{ backgroundColor: `${colors[idx % colors.length].stroke}10` }}
                      >
                        {uni.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efedf1] text-[13px] font-body-md text-[#1b1b1f]">
                  {/* Group 1 */}
                  <tr className="bg-[#f5f3f7] font-title-md text-[#00241a]">
                    <td
                      className="py-2.5 px-4 tracking-wider uppercase font-bold text-[#a14013] flex items-center gap-1.5"
                      colSpan={activeUnis.length + 1}
                    >
                      <span className="material-symbols-outlined text-[16px]">school</span>
                      <span>Group 1: Academic &amp; Research Performance</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">AHEI Overall Score</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num font-bold text-[#00241a] border-l border-[#efedf1]">
                        {u.aheiScore.toFixed(1)} / 100
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Research Output &amp; Citations</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.researchScore.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Teaching Quality Score</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.teachingScore.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Graduate Employability (12 Mo.)</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.employabilityScore.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Faculty with PhD Qualifications</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.phdFacultyShare}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Student-to-Faculty Ratio</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num font-semibold text-[#00241a] border-l border-[#efedf1]">
                        {u.studentFacultyRatio}
                      </td>
                    ))}
                  </tr>

                  {/* Group 2 */}
                  <tr className="bg-[#f5f3f7] font-title-md text-[#00241a]">
                    <td
                      className="py-2.5 px-4 tracking-wider uppercase font-bold text-[#a14013] flex items-center gap-1.5"
                      colSpan={activeUnis.length + 1}
                    >
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      <span>Group 2: Costs &amp; Affordability (Annual Estimates)</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Domestic Tuition (Avg STEM)</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.domesticTuitionAverage}
                        <span className="text-[11px] text-[#717974] block">({u.domesticTuitionUsd})</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">International Student Tuition</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.internationalTuitionAnnual}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">On-Campus Accommodation / yr</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.onCampusAccommodation}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Average Monthly Living Cost</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.averageMonthlyLiving}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Financial Aid &amp; Scholarships</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 border-l border-[#efedf1]">
                        <span className="inline-block px-1.5 py-0.5 bg-[#bfecd9] text-[#002117] font-bold font-code-badge text-[10px] mb-1">
                          {u.financialAidTier}
                        </span>
                        <span className="block text-[#414845] font-code-badge text-[11px]">{u.financialAidNote}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Group 3 */}
                  <tr className="bg-[#f5f3f7] font-title-md text-[#00241a]">
                    <td
                      className="py-2.5 px-4 tracking-wider uppercase font-bold text-[#a14013] flex items-center gap-1.5"
                      colSpan={activeUnis.length + 1}
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Group 3: Programmes &amp; Accreditation</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Total Accredited Programmes</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num border-l border-[#efedf1]">
                        {u.programmes.length || 142}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Primary Statutory Accreditation</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-medium text-[#00241a] border-l border-[#efedf1]">
                        {u.accreditationBody}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Notable Flagship Faculties</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 text-[#414845] text-[12px] border-l border-[#efedf1]">
                        {u.flagshipFaculties.join(', ')}
                      </td>
                    ))}
                  </tr>

                  {/* Group 4 */}
                  <tr className="bg-[#f5f3f7] font-title-md text-[#00241a]">
                    <td
                      className="py-2.5 px-4 tracking-wider uppercase font-bold text-[#a14013] flex items-center gap-1.5"
                      colSpan={activeUnis.length + 1}
                    >
                      <span className="material-symbols-outlined text-[16px]">location_city</span>
                      <span>Group 4: Student Body &amp; Campus Environment</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Total Enrollment</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num font-medium border-l border-[#efedf1]">
                        {u.totalEnrollment.toLocaleString()} students
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd] bg-[#f5f3f7]/50">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">International Student Proportion</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 font-tabular-num font-semibold text-[#00241a] border-l border-[#efedf1]">
                        {u.internationalDiversityPct}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#faf9fd]">
                    <td className="py-2.5 px-4 font-semibold text-[#1b1b1f]">Campus Topology &amp; Setting</td>
                    {activeUnis.map((u) => (
                      <td key={u.id} className="py-2.5 px-4 text-[#414845] border-l border-[#efedf1]">
                        {u.campusSetting}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f5f3f7] border-t border-[#c0c8c3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 font-code-badge text-[11px] text-[#414845]">
                <span className="material-symbols-outlined text-[16px] text-[#a14013]">info</span>
                <span>All comparative indicators derived from verified 2026/2027 institutional audits. DEMO DATA.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenMethodology}
                  className="font-title-md text-[12px] text-[#a14013] hover:text-[#00241a] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
                >
                  Read Scoring Methodology
                </button>
                <span className="text-[#c0c8c3]">•</span>
                <button
                  onClick={() => alert('Discrepancy reporting portal open for registered university registrars until July 31.')}
                  className="font-title-md text-[12px] text-[#a14013] hover:text-[#00241a] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
                >
                  Report Discrepancy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 04: PROSPECTUSES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeUnis.slice(0, 3).map((uni) => (
            <div key={uni.id} className="bg-white p-4 border border-[#c0c8c3] shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-40 w-full mb-3 overflow-hidden relative border border-[#c0c8c3]">
                  <img
                    className="w-full h-full object-cover"
                    src={uni.prospectusImg}
                    alt={`${uni.name} prospectus`}
                  />
                  <span className="absolute top-2 left-2 bg-[#00241a] text-white font-code-badge text-[10px] px-2 py-0.5 uppercase">
                    {uni.city}, {uni.country}
                  </span>
                </div>
                <h4 className="font-title-lg text-[17px] text-[#00241a] font-serif font-bold">
                  {uni.name} Prospectus
                </h4>
                <p className="font-body-sm text-[12px] text-[#414845] mt-1 leading-relaxed">
                  Direct entry requirements, admission deadlines, and verified regional student qualification schedules.
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectUniversity(uni.id);
                  onNavigate('universities', uni.id);
                }}
                className="mt-4 text-[#a14013] font-title-md text-[13px] flex items-center gap-1 hover:text-[#00241a] transition-colors cursor-pointer text-left font-bold"
              >
                <span>Explore {uni.name.split(' ')[0]} Academic Registry</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Institution Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#00241a]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-lg w-full shadow-2xl border border-[#c0c8c3] relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline-sm text-[22px] text-[#00241a] font-serif font-bold">
                  Add Benchmark University
                </h3>
                <p className="font-body-sm text-[12px] text-[#414845]">
                  Search database of 1,000+ verified African institutions
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#414845] hover:text-[#00241a] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center bg-[#faf9fd] border border-[#c0c8c3] px-3 py-2 mb-4">
              <span className="material-symbols-outlined text-[#414845] mr-2">search</span>
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Type university name, city or country (e.g., Cairo, Ibadan)..."
                className="w-full bg-transparent font-body-sm text-[13px] outline-none text-[#1b1b1f]"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {candidateUnis.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => {
                    onAddToCompare(uni.id);
                    setModalOpen(false);
                  }}
                  className="p-3 bg-[#f5f3f7] hover:bg-[#efedf1] flex items-center justify-between cursor-pointer transition-colors border border-[#efedf1]"
                >
                  <div>
                    <span className="font-title-md text-[13px] text-[#00241a] block font-bold">
                      {uni.name}
                    </span>
                    <span className="font-code-badge text-[11px] text-[#414845]">
                      {uni.country} • {uni.region} • Rank #{uni.rank}
                    </span>
                  </div>
                  <span className="font-code-badge text-[11px] text-[#a14013] font-bold">
                    + Select
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 font-title-md text-[13px] text-[#414845] hover:text-[#00241a] border border-[#c0c8c3] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
