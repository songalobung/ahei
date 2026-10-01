import React from 'react';

interface FooterProps {
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights') => void;
  onOpenMethodology: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMethodology }) => {
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
              <span className="font-headline-sm text-[18px] font-serif text-[#09090B] font-bold">
                AHEI
              </span>
            </div>
            <p className="font-body-sm text-[12px] text-[#838383] leading-relaxed mb-4">
              The African Higher Education Index serves as the authoritative, peer-reviewed statistical registry evaluating educational excellence, scientific citation impact, and governance across Africa.
            </p>
            <div className="flex items-center gap-1.5 font-code-badge text-[11px] text-[#838383]">
              <span className="material-symbols-outlined text-[16px] text-[#09090B]">database</span>
              <span>54 Registries Monitored</span>
            </div>
          </div>

          {/* Column 1: About */}
          <div>
            <h4 className="font-title-md text-[13px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              About AHEI
            </h4>
            <ul className="space-y-1.5 font-body-sm text-[12px] text-[#838383]">
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Mission Statement
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Governance &amp; Bylaws
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Academic Advisory Board
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Data Integrity &amp; Methodology
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Press &amp; Institutional Media
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Intelligence & Rankings */}
          <div>
            <h4 className="font-title-md text-[13px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Intelligence &amp; Rankings
            </h4>
            <ul className="space-y-1.5 font-body-sm text-[12px] text-[#838383]">
              <li>
                <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Africa University Rankings 2027
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Subject &amp; Discipline Tables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Regional Deep Dives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Employability &amp; Industry Index
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Research Citations Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Services */}
          <div>
            <h4 className="font-title-md text-[13px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Institutional Services
            </h4>
            <ul className="space-y-1.5 font-body-sm text-[12px] text-[#838383]">
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  University Submissions Portal
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Verified Data Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Comparative Benchmarking
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Enterprise Research API Access
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Executive Briefings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Public Resources */}
          <div>
            <h4 className="font-title-md text-[13px] text-[#09090B] font-bold uppercase tracking-wider mb-3 border-b border-[#d5d5d5] pb-1">
              Public Resources
            </h4>
            <ul className="space-y-1.5 font-body-sm text-[12px] text-[#838383]">
              <li>
                <button onClick={() => onNavigate('rankings')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Country Higher Ed Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('universities')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Continental Scholarship Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('universities')} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Postgraduate Guidance
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Accreditation Verification
                </button>
              </li>
              <li>
                <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer text-left">
                  Statistical Glossaries
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & sync strip */}
        <div className="border-t border-[#d5d5d5] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-body-sm text-[12px] text-[#838383]">
          <div className="flex flex-col gap-1">
            <p>© 2027 African Higher Education Index (AHEI). Registered independent academic data registry. All ranking indicators and methodological weights are open for academic peer review.</p>
            <div className="flex items-center gap-3 text-code-badge font-code-badge text-[11px]">
              <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer">
                Terms of Academic License
              </button>
              <span>•</span>
              <button onClick={onOpenMethodology} className="hover:text-[#09090B] transition-colors cursor-pointer">
                Methodological Transparency Notice
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#f2f2f2] px-3 py-1.5 border border-[#d5d5d5] shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#09090B]">chevron_forward</span>
            <span className="font-code-badge text-[11px] text-[#232323]">
              Data last synchronized across 54 registries
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
