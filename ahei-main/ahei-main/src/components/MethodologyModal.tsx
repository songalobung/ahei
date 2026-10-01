import React from 'react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00241a]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-[#c0c8c3] shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#faf9fd] border-b border-[#c0c8c3] flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="font-code-badge text-[10px] text-[#a14013] uppercase font-bold tracking-wider">
              ISO/AHEI Academic Intelligence Framework v4.2
            </span>
            <h3 className="font-headline-sm text-[22px] font-serif text-[#00241a] font-bold">
              Data Integrity &amp; Methodology Standards
            </h3>
          </div>
          <button onClick={onClose} className="text-[#414845] hover:text-[#00241a] p-1 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-[#414845] font-body-md text-[14px] leading-relaxed">
          <div>
            <h4 className="font-title-md text-[16px] text-[#00241a] font-bold mb-2">
              The 5 Foundational Indicators of the 2027 Index
            </h4>
            <div className="space-y-3 font-body-sm text-[13px]">
              <div className="p-3 bg-[#f5f3f7] border-l-2 border-[#00241a]">
                <strong className="text-[#00241a] block">1. Research Citation Parity (30% Weight)</strong>
                Measures field-weighted citation index (FWCI) normalized across 27 disciplines, including regional indexing in AJOL (African Journals Online) and sovereign intellectual property databases.
              </div>
              <div className="p-3 bg-[#f5f3f7] border-l-2 border-[#a14013]">
                <strong className="text-[#00241a] block">2. Teaching Capacity &amp; Professoriate Depth (25% Weight)</strong>
                Evaluates the proportion of full-time academic staff holding terminal doctoral qualifications (PhD/MD), audited hospital-bed bedside instruction hours, and teaching expenditure per enrolled candidate.
              </div>
              <div className="p-3 bg-[#f5f3f7] border-l-2 border-[#00241a]">
                <strong className="text-[#00241a] block">3. Graduate Employability &amp; Corporate Trust (20% Weight)</strong>
                Compiled from annual tracer surveys of 18,400 African corporate employers and longitudinal alumni employment rates at 6 and 12 months post-convocation.
              </div>
              <div className="p-3 bg-[#f5f3f7] border-l-2 border-[#a14013]">
                <strong className="text-[#00241a] block">4. Continental Relevance &amp; Agenda 2063 (15% Weight)</strong>
                Tracks alignment with African Union continental development targets: agricultural food security, indigenous vaccine development, regional renewable power grids, and cross-border trade legal frameworks.
              </div>
              <div className="p-3 bg-[#f5f3f7] border-l-2 border-[#00241a]">
                <strong className="text-[#00241a] block">5. Internationalization &amp; Pan-African Mobility (10% Weight)</strong>
                Measures cross-border intra-African student enrollment, co-authorship with international laboratories, and faculty exchange programmes.
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#efedf1] border border-[#c0c8c3] text-xs space-y-1">
            <span className="font-bold text-[#00241a] block">Annual Institutional Review Timetable:</span>
            <p>• Data Submission Window: January 15 – April 30</p>
            <p>• Independent Verification &amp; Cross-Auditing: May 1 – July 15</p>
            <p>• Dispute Resolution Period: July 16 – August 31</p>
            <p>• Official League Table Publication: October 28 annually</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#faf9fd] border-t border-[#c0c8c3] flex justify-between items-center">
          <span className="font-code-badge text-[11px] text-[#414845]">AHEI Methodology Directorate • Nairobi, Kenya</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00241a] text-white text-xs font-semibold cursor-pointer hover:bg-[#0e3b2e]"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
