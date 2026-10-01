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
    <div className="fixed inset-0 bg-[#09090B]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#d5d5d5] shadow-none relative flex flex-col">
        {/* Header strip */}
        <div className="sticky top-0 bg-[#f2f2f2] border-b border-[#d5d5d5] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 font-code-badge text-[11px] uppercase tracking-wider text-[#164A3A]">
            <span className="font-bold">{article.category}</span>
            <span className="text-[#d5d5d5]">•</span>
            <span>{article.readTime}</span>
            <span className="text-[#d5d5d5]">•</span>
            <span>Peer-Reviewed Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#838383] hover:text-[#09090B] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Article Body */}
        <div className="p-8 space-y-6">
          <div>
            <h2 className="font-headline-lg text-[28px] lg:text-[34px] font-serif text-[#09090B] leading-tight mb-3">
              {article.title}
            </h2>
            <div className="flex items-center gap-4 text-body-sm text-[12px] text-[#838383] pb-4 border-b border-[#E6E3DC]">
              <span className="font-semibold text-[#09090B]">Author: {article.author}</span>
              <span>•</span>
              <span>Published: {article.date}</span>
              <span>•</span>
              <span className="text-[#164A3A] font-code-badge text-[11px]">AHEI Working Paper No. 2027-04</span>
            </div>
          </div>

          <div className="bg-[#f9f9f9] p-4 border-l-3 border-[#164A3A] font-body-lg text-[16px] text-[#232323] italic font-serif leading-relaxed">
            "{article.excerpt}"
          </div>

          <div className="space-y-4 font-body-md text-[15px] text-[#838383] leading-relaxed font-serif">
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
          <div className="pt-6 border-t border-[#d5d5d5]">
            <h4 className="font-code-badge text-[11px] uppercase tracking-wider text-[#09090B] font-bold mb-3">
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
                    className="p-3 bg-[#f9f9f9] hover:bg-[#E6E3DC] text-left border border-[#d5d5d5] cursor-pointer transition-colors"
                  >
                    <span className="font-code-badge text-[10px] text-[#164A3A] uppercase block mb-1">
                      {a.category}
                    </span>
                    <span className="font-title-md text-[13px] text-[#09090B] font-bold line-clamp-2">
                      {a.title}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f9f9f9] border-t border-[#d5d5d5] px-6 py-3 flex justify-between items-center text-xs text-[#838383]">
          <span>African Higher Education Index • Research Working Papers Archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#09090B] text-white font-title-md text-xs cursor-pointer hover:bg-[#2A6B55]"
          >
            Close Paper
          </button>
        </div>
      </div>
    </div>
  );
};
