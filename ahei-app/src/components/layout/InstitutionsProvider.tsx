'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UNIVERSITIES, University } from '@/data/universities';

interface InstitutionsContextType {
  universities: University[];
  addUniversity: (newUni: University) => void;
  updateUniversity: (id: string, updates: Partial<University>) => void;
  updateRankings: (rankedList: Array<{ id: string; rank: number; score: number }>) => void;
  resetToDefaults: () => void;
  getUniversityById: (id: string) => University | undefined;
}

const STORAGE_KEY = 'ahei_live_universities_v2';

const InstitutionsContext = createContext<InstitutionsContextType>({
  universities: UNIVERSITIES,
  addUniversity: () => {},
  updateUniversity: () => {},
  updateRankings: () => {},
  resetToDefaults: () => {},
  getUniversityById: () => undefined,
});

export function useUniversities() {
  return useContext(InstitutionsContext);
}

export function InstitutionsProvider({ children }: { children: ReactNode }) {
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES);
  const [mounted, setMounted] = useState(false);

  // Load persisted universities on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom/updated universities with canonical defaults
          const merged = [...parsed];
          UNIVERSITIES.forEach((canon) => {
            if (!merged.some((u) => u.id === canon.id)) {
              merged.push(canon);
            }
          });
          setUniversities(merged.sort((a, b) => a.rank - b.rank));
        }
      }
    } catch (e) {
      console.warn('Failed to load live universities from localStorage:', e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage helper
  const persist = (list: University[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist universities to localStorage:', e);
    }
  };

  const addUniversity = useCallback((newUni: University) => {
    setUniversities((prev) => {
      // If already exists, replace; else append
      const filtered = prev.filter((u) => u.id !== newUni.id);
      const next = [...filtered, newUni].sort((a, b) => a.rank - b.rank);
      persist(next);
      return next;
    });
  }, []);

  const updateUniversity = useCallback((id: string, updates: Partial<University>) => {
    setUniversities((prev) => {
      const next = prev.map((u) => {
        if (u.id !== id) return u;
        const merged = { ...u, ...updates };
        // If a specific pillar percentage was updated and aheiScore was not explicitly given, automatically recalculate
        if (
          (updates.researchScore !== undefined ||
           updates.teachingScore !== undefined ||
           updates.employabilityScore !== undefined ||
           updates.continentalRelevanceScore !== undefined ||
           updates.internationalScore !== undefined) &&
          updates.aheiScore === undefined
        ) {
          const r = Number(merged.researchScore) || 0;
          const t = Number(merged.teachingScore) || 0;
          const e = Number(merged.employabilityScore) || 0;
          const c = Number(merged.continentalRelevanceScore) || 0;
          const i = Number(merged.internationalScore) || 0;
          merged.aheiScore = Number(((r * 0.30) + (t * 0.25) + (e * 0.20) + (c * 0.15) + (i * 0.10)).toFixed(1));
        }
        return merged;
      }).sort((a, b) => a.rank - b.rank);
      persist(next);
      return next;
    });
  }, []);

  const updateRankings = useCallback((rankedList: Array<{ id: string; rank: number; score: number }>) => {
    setUniversities((prev) => {
      const next = prev.map((u) => {
        const update = rankedList.find((r) => r.id === u.id);
        if (update) {
          return {
            ...u,
            rank: update.rank,
            aheiScore: update.score,
            shift: {
              type: update.rank < u.rank ? ('up' as const) : update.rank > u.rank ? ('down' as const) : ('equal' as const),
              val: Math.abs(update.rank - u.rank),
            },
          };
        }
        return u;
      }).sort((a, b) => a.rank - b.rank);
      persist(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setUniversities(UNIVERSITIES);
  }, []);

  const getUniversityById = useCallback(
    (id: string) => {
      const normalized = id.toLowerCase().trim();
      return universities.find(
        (u) =>
          u.id.toLowerCase() === normalized ||
          u.registryId.toLowerCase() === normalized ||
          u.name.toLowerCase().includes(normalized)
      );
    },
    [universities]
  );

  return (
    <InstitutionsContext.Provider
      value={{
        universities,
        addUniversity,
        updateUniversity,
        updateRankings,
        resetToDefaults,
        getUniversityById,
      }}
    >
      {children}
    </InstitutionsContext.Provider>
  );
}
