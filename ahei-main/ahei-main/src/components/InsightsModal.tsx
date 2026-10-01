import React from 'react';
import { InsightArticle } from '../data/macroRegions';

interface InsightsModalProps {
  article: InsightArticle | null;
  onClose: () => void;
  allArticles: InsightArticle[];
  onSelectArticle: (article: InsightArticle) => void;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({
  article,
  onClose,
  allArticles,
  onSelectArticle,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-[#00241a]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#c0c8c3] shadow-2xl relative flex flex-col">
        {/* Header strip */}
        <div className="sticky top-0 bg-[#faf9fd] border-b border-[#c0c8c3] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 font-code-badge text-[11px] uppercase tracking-wider text-[#a14013]">
            <span className="font-bold">{article.category}</span>
            <span className="text-[#c0c8c3]">•</span>
            <span>{article.readTime}</span>
            <span className="text-[#c0c8c3]">•</span>
            <span>Peer-Reviewed Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#414845] hover:text-[#00241a] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Article Body */}
        <div className="p-8 space-y-6">
          <div>
            <h2 className="font-headline-lg text-[28px] lg:text-[34px] font-serif text-[#00241a] leading-tight mb-3">
              {article.title}
            </h2>
            <div className="flex items-center gap-4 text-body-sm text-[12px] text-[#414845] pb-4 border-b border-[#efedf1]">
              <span className="font-semibold text-[#00241a]">Author: {article.author}</span>
              <span>•</span>
              <span>Published: {article.date}</span>
              <span>•</span>
              <span className="text-[#a14013] font-code-badge text-[11px]">AHEI Working Paper No. 2027-04</span>
            </div>
          </div>

          <div className="bg-[#f5f3f7] p-4 border-l-3 border-[#a14013] font-body-lg text-[16px] text-[#1b1b1f] italic font-serif leading-relaxed">
            "{article.excerpt}"
          </div>

          <div className="space-y-4 font-body-md text-[15px] text-[#414845] leading-relaxed font-serif">
            {article.fullBody ? (
              article.fullBody.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>
                This working paper explores the multi-year longitudinal findings compiled during the 2026/2027 African Higher Education Index audit cycle, verifying institutional outputs against continental policy frameworks.
              </p>
            )}
          </div>

          {/* Related Articles Strip */}
          <div className="pt-6 border-t border-[#c0c8c3]">
            <h4 className="font-code-badge text-[11px] uppercase tracking-wider text-[#00241a] font-bold mb-3">
              Related Working Papers in Series
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allArticles
                .filter((a) => a.id !== article.id)
                .slice(0, 2)
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onSelectArticle(a)}
                    className="p-3 bg-[#f5f3f7] hover:bg-[#efedf1] text-left border border-[#c0c8c3] cursor-pointer transition-colors"
                  >
                    <span className="font-code-badge text-[10px] text-[#a14013] uppercase block mb-1">
                      {a.category}
                    </span>
                    <span className="font-title-md text-[13px] text-[#00241a] font-bold line-clamp-2">
                      {a.title}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f5f3f7] border-t border-[#c0c8c3] px-6 py-3 flex justify-between items-center text-xs text-[#414845]">
          <span>African Higher Education Index • Research Working Papers Archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00241a] text-white font-title-md text-xs cursor-pointer hover:bg-[#0e3b2e]"
          >
            Close Paper
          </button>
        </div>
      </div>
    </div>
  );
};
