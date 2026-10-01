'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface BookmarksContextType {
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
  clearBookmarks: () => {},
});

export function useBookmarks() {
  return useContext(BookmarksContext);
}

const STORAGE_KEY = 'ahei_saved_universities';

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore local storage errors
    }
    setMounted(true);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const isBookmarked = useCallback(
    (id: string) => (mounted ? bookmarks.includes(id) : false),
    [bookmarks, mounted]
  );

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
}
