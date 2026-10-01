'use client';

import Link from 'next/link';

export function NavigationFooter() {
  return (
    <footer className="w-full bg-[#f9f9f9] border-t border-[#d5d5d5] mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Logo & description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#09090B] text-white flex items-center justify-center font-serif font-bold text-xs">
                A
              </div>
              <span className="font-serif text-[18px] text-[#09090B] font-bold">
                AHEI
              </span>
            </div>
            <p className="font-sans text-[12px] text-[#838383] leading-relaxed mb-4">
              The African Higher Education Index serves as the authoritative, peer-reviewed statistical registry evaluating educational excellence, scientific citation impact, and governance across Africa.
            </p>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#838383]">
              <span className="w-2 h-2 rounded-full bg-[#09090B]"></span>
              <span>54 Sovereign Registries Monitored</span>
            </div>
          </div>

          {/* Column 1: Core Navigation */}
          <div>
            <h4 className="font-mono text-[11px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Platform Registry
            </h4>
            <ul className="space-y-1.5 font-sans text-[12px] text-[#838383]">
              <li>
                <Link href="/" className="hover:text-[#09090B] transition">Home</Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-[#09090B] transition">Continental Rankings</Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-[#09090B] transition">Universities Roster</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#09090B] transition">Compare Dossiers</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#09090B] transition">Admin Verification Desk</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Corridors & Regions */}
          <div>
            <h4 className="font-mono text-[11px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Macro Regions
            </h4>
            <ul className="space-y-1.5 font-sans text-[12px] text-[#838383]">
              <li>
                <Link href="/regions/north-africa" className="hover:text-[#09090B] transition">Northern Africa</Link>
              </li>
              <li>
                <Link href="/regions/west-africa" className="hover:text-[#09090B] transition">Western Africa</Link>
              </li>
              <li>
                <Link href="/regions/east-africa" className="hover:text-[#09090B] transition">Eastern Africa</Link>
              </li>
              <li>
                <Link href="/regions/central-africa" className="hover:text-[#09090B] transition">Central Africa</Link>
              </li>
              <li>
                <Link href="/regions/southern-africa" className="hover:text-[#09090B] transition">Southern Africa</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Regulators */}
          <div>
            <h4 className="font-mono text-[11px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Flagship Jurisdictions
            </h4>
            <ul className="space-y-1.5 font-sans text-[12px] text-[#838383]">
              <li>
                <Link href="/countries/za" className="hover:text-[#09090B] transition">South Africa (CHE)</Link>
              </li>
              <li>
                <Link href="/countries/eg" className="hover:text-[#09090B] transition">Egypt (MoHE)</Link>
              </li>
              <li>
                <Link href="/countries/ng" className="hover:text-[#09090B] transition">Nigeria (NUC)</Link>
              </li>
              <li>
                <Link href="/countries/ke" className="hover:text-[#09090B] transition">Kenya (CUE)</Link>
              </li>
              <li>
                <Link href="/countries/gh" className="hover:text-[#09090B] transition">Ghana (GTEC)</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Methodology & Standards */}
          <div>
            <h4 className="font-mono text-[11px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Methodology & APIs
            </h4>
            <ul className="space-y-1.5 font-sans text-[12px] text-[#838383]">
              <li>
                <a href="/api/rankings" target="_blank" rel="noreferrer" className="hover:text-[#09090B] transition">
                  REST Rankings API
                </a>
              </li>
              <li>
                <a href="/api/universities" target="_blank" rel="noreferrer" className="hover:text-[#09090B] transition">
                  REST Universities API
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-[#09090B] transition">
                  Platform Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-[#09090B] transition">
                  Robots &amp; Crawler Index
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & sync strip */}
        <div className="border-t border-[#d5d5d5] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans text-[12px] text-[#838383]">
          <div className="flex flex-col gap-1">
            <p>© 2027 African Higher Education Index (AHEI). Registered independent academic data registry. All ranking indicators and methodological weights are open for academic peer review.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#f2f2f2] px-3 py-1.5 border border-[#d5d5d5] shrink-0 font-mono text-[11px] text-[#232323]">
            <span className="text-[#09090B]">●</span>
            <span>All 54 African Sovereign State Regulators Monitored</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
