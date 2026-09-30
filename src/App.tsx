/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UNIVERSITIES, University } from './data/universities';
import { INSIGHT_ARTICLES, InsightArticle } from './data/macroRegions';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { RankingsScreen } from './components/RankingsScreen';
import { UniversityProfileScreen } from './components/UniversityProfileScreen';
import { CompareScreen } from './components/CompareScreen';
import { InsightsModal } from './components/InsightsModal';
import { AuthModal } from './components/AuthModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { MethodologyModal } from './components/MethodologyModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'rankings' | 'universities' | 'compare' | 'insights'>('home');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('uon');
  const [comparedUniversityIds, setComparedUniversityIds] = useState<string[]>(['uon', 'mak', 'uct']);
  const [savedUniversityIds, setSavedUniversityIds] = useState<string[]>(['uon']);
  
  // Modals state
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [bookmarksDrawerOpen, setBookmarksDrawerOpen] = useState<boolean>(false);
  const [methodologyModalOpen, setMethodologyModalOpen] = useState<boolean>(false);
  const [rankingsInitialFilter, setRankingsInitialFilter] = useState<{ country?: string; region?: string; search?: string } | undefined>(undefined);

  // Scroll to top on screen switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen, selectedUniversityId]);

  const handleNavigate = (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => {
    if (universityId) {
      setSelectedUniversityId(universityId);
    }
    if (screen === 'insights') {
      // open first article or switch to insights modal
      setActiveArticle(INSIGHT_ARTICLES[0]);
      return;
    }
    setCurrentScreen(screen);
  };

  const handleToggleBookmark = (id: string) => {
    setSavedUniversityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCompare = (id: string) => {
    setComparedUniversityIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 4) {
        // replace last
        return [...prev.slice(0, 3), id];
      }
      return [...prev, id];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedUniversityIds((prev) => prev.filter((item) => item !== id));
  };

  const selectedUniversity =
    UNIVERSITIES.find((u) => u.id === selectedUniversityId) || UNIVERSITIES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9fd] text-[#1b1b1f]">
      {/* Broadsheet Fixed Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedUniversities={savedUniversityIds}
        onOpenBookmarks={() => setBookmarksDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMethodology={() => setMethodologyModalOpen(true)}
        allUniversities={UNIVERSITIES}
        onSelectUniversity={(id) => setSelectedUniversityId(id)}
      />

      {/* Main Content Area (padded for fixed 112px header) */}
      <main className="w-full pt-28 flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            universities={UNIVERSITIES}
            onNavigate={handleNavigate}
            onSelectUniversity={(id) => setSelectedUniversityId(id)}
            onAddToCompare={handleAddToCompare}
            onOpenArticle={(art) => setActiveArticle(art)}
            onOpenMethodology={() => setMethodologyModalOpen(true)}
            onApplyRankingsFilter={(filter) => {
              setRankingsInitialFilter(filter);
              setCurrentScreen('rankings');
            }}
          />
        )}

        {currentScreen === 'rankings' && (
          <RankingsScreen
            universities={UNIVERSITIES}
            onSelectUniversity={(id) => {
              setSelectedUniversityId(id);
              setCurrentScreen('universities');
            }}
            onAddToCompare={handleAddToCompare}
            comparedIds={comparedUniversityIds}
            initialFilters={rankingsInitialFilter}
          />
        )}

        {currentScreen === 'universities' && (
          <UniversityProfileScreen
            university={selectedUniversity}
            onNavigate={handleNavigate}
            onSelectUniversity={(id) => setSelectedUniversityId(id)}
            onAddToCompare={handleAddToCompare}
            isBookmarked={savedUniversityIds.includes(selectedUniversity.id)}
            onToggleBookmark={handleToggleBookmark}
            allUniversities={UNIVERSITIES}
          />
        )}

        {currentScreen === 'compare' && (
          <CompareScreen
            allUniversities={UNIVERSITIES}
            selectedIds={comparedUniversityIds}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={handleAddToCompare}
            onSelectUniversity={(id) => setSelectedUniversityId(id)}
            onNavigate={handleNavigate}
            onOpenMethodology={() => setMethodologyModalOpen(true)}
          />
        )}
      </main>

      {/* Authority Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenMethodology={() => setMethodologyModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <InsightsModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        allArticles={INSIGHT_ARTICLES}
        onSelectArticle={(art) => setActiveArticle(art)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <BookmarksDrawer
        isOpen={bookmarksDrawerOpen}
        onClose={() => setBookmarksDrawerOpen(false)}
        savedIds={savedUniversityIds}
        allUniversities={UNIVERSITIES}
        onRemoveBookmark={handleToggleBookmark}
        onSelectUniversity={(id) => setSelectedUniversityId(id)}
        onNavigate={handleNavigate}
      />

      <MethodologyModal
        isOpen={methodologyModalOpen}
        onClose={() => setMethodologyModalOpen(false)}
      />
    </div>
  );
}
