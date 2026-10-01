import React from 'react';
import { University } from '../data/universities';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  allUniversities: University[];
  onRemoveBookmark: (id: string) => void;
  onSelectUniversity: (id: string) => void;
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedIds,
  allUniversities,
  onRemoveBookmark,
  onSelectUniversity,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const savedUnis = allUniversities.filter((u) => savedIds.includes(u.id));

  return (
    <div className="fixed inset-0 bg-[#00241a]/40 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-[#c0c8c3] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#faf9fd] border-b border-[#c0c8c3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a14013] text-[22px]">bookmark</span>
            <div>
              <h3 className="font-title-lg text-[16px] text-[#00241a] font-bold">
                Saved Institutional Dossiers
              </h3>
              <span className="font-code-badge text-[10px] text-[#414845]">
                {savedUnis.length} Universities Pinned
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#414845] hover:text-[#00241a] p-1 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedUnis.length === 0 ? (
            <div className="text-center py-12 text-[#414845] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#c0c8c3]">bookmark_border</span>
              <p className="font-body-md text-sm">No institutional dossiers bookmarked yet.</p>
              <p className="font-body-sm text-xs text-[#717974]">
                Click "Bookmark" on any university profile to save it for quick comparative reference.
              </p>
            </div>
          ) : (
            savedUnis.map((uni) => (
              <div
                key={uni.id}
                className="p-4 bg-[#f5f3f7] border border-[#c0c8c3] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-code-badge text-[10px] bg-white px-2 py-0.5 border border-[#c0c8c3] text-[#414845]">
                      Rank #{uni.rank} • {uni.country}
                    </span>
                    <h4 className="font-title-md text-[14px] text-[#00241a] font-bold mt-1">
                      {uni.name}
                    </h4>
                    <span className="text-[12px] text-[#414845]">
                      {uni.city} • Rating: {uni.aheiScore} / 100
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(uni.id)}
                    className="text-[#414845] hover:text-[#ba1a1a] p-1 cursor-pointer"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#efedf1]">
                  <button
                    onClick={() => {
                      onSelectUniversity(uni.id);
                      onNavigate('universities', uni.id);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-[#00241a] text-white text-xs font-semibold text-center hover:bg-[#0e3b2e] cursor-pointer"
                  >
                    View Dossier
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('compare');
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-white border border-[#c0c8c3] text-[#00241a] text-xs font-semibold text-center hover:bg-[#efedf1] cursor-pointer"
                  >
                    Compare
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedUnis.length > 0 && (
          <div className="p-4 bg-[#f5f3f7] border-t border-[#c0c8c3]">
            <button
              onClick={() => {
                onNavigate('compare');
                onClose();
              }}
              className="w-full bg-[#a14013] text-white py-2 text-xs font-semibold hover:bg-[#702500] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Launch Multi-University Comparison</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
