'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/components/layout/CompareProvider';
import { useBookmarks } from '@/components/layout/BookmarksProvider';
import { useUniversities } from '@/components/layout/InstitutionsProvider';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Rankings', href: '/rankings' },
  { label: 'Articles', href: '/articles' },
  { label: 'Subjects', href: '/subjects' },
  { label: 'Careers', href: '/careers' },
  { label: 'Explore', href: '/explore' },
  { label: 'Compare', href: '/compare' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'About', href: '/about' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { universities } = useUniversities();
  const { compareIds, addToCompare } = useCompare();
  const { bookmarks, toggleBookmark } = useBookmarks();

  const [searchOpen, setSearchOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setShortlistOpen(false);
    setSearchQuery('');
  }, [pathname]);

  const filteredResults = searchQuery.length >= 2
    ? universities.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const savedUniversities = universities.filter((u) => bookmarks.includes(u.id));

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="site-header sticky top-0 z-100" style={{ background: '#09090B' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo — THE style: bold white text on dark */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '20px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            AHEI
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: '10px',
              lineHeight: 1.2,
            }}
            className="hidden sm:inline"
          >
            African Higher<br />Education Index
          </span>
        </Link>

        {/* Desktop Navigation — white text on dark bg */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative no-underline transition-colors duration-200"
              style={{
                color: isActive(item.href) ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                padding: '6px 14px',
                fontSize: '14px',
                fontWeight: isActive(item.href) ? 600 : 400,
                borderBottom: isActive(item.href) ? '2px solid #164A3A' : '2px solid transparent',
              }}
            >
              {item.label}
              {item.label === 'Compare' && compareIds.length > 0 && (
                <span
                  style={{
                    background: '#164A3A',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    marginLeft: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {compareIds.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shortlist Drawer Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShortlistOpen(!shortlistOpen);
                setSearchOpen(false);
              }}
              className="flex items-center gap-1.5 p-2 transition-colors duration-200 cursor-pointer"
              style={{
                color: bookmarks.length > 0 ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                background: 'none',
                border: 'none',
              }}
              title="Saved Institutions / Shortlist"
              aria-label="View Saved Institutions"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarks.length > 0 ? '#FFFFFF' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>

              {bookmarks.length > 0 && (
                <span
                  style={{
                    background: '#FE4537',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {bookmarks.length}
                </span>
              )}
            </button>

            {shortlistOpen && (
              <div
                className="absolute right-0 top-full mt-2 z-50 bg-white shadow-none p-4"
                style={{ width: '340px', borderRadius: '16px' }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
                  <span className="font-title-md text-[#232323]">
                    My Shortlist ({bookmarks.length})
                  </span>
                  <button
                    onClick={() => setShortlistOpen(false)}
                    className="text-xs text-[#838383] hover:text-[#232323] bg-none border-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {savedUniversities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#838383]">
                    No institutions saved yet. Click &ldquo;Save to Shortlist&rdquo; on any institution card to pin it here.
                  </div>
                ) : (
                  <div>
                    <ul className="divide-y divide-[#f2f2f2] max-h-[260px] overflow-y-auto list-none p-0 my-2">
                      {savedUniversities.map((u) => (
                        <li key={u.id} className="py-2 flex items-center justify-between gap-2">
                          <div>
                            <Link
                              href={`/universities/${u.id}`}
                              className="font-semibold text-xs text-[#232323] hover:text-[#164A3A] block no-underline"
                            >
                              {u.name}
                            </Link>
                            <span className="text-[11px] text-[#838383]">
                              {u.country} · Rank #{u.rank}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => addToCompare(u.id)}
                              className="text-[10px] px-2 py-0.5 border border-[#164A3A] text-[#164A3A] cursor-pointer hover:bg-[#F7F6F2]"
                              style={{ borderRadius: '12px' }}
                            >
                              + Compare
                            </button>
                            <button
                              onClick={() => toggleBookmark(u.id)}
                              className="text-xs text-[#D91f28] bg-none border-none cursor-pointer p-1"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {savedUniversities.length >= 2 && (
                      <div className="pt-2 border-t border-[#e9e9e9]">
                        <Link
                          href={`/compare?ids=${bookmarks.slice(0, 4).join(',')}`}
                          className="btn-primary w-full text-center text-xs justify-center no-underline"
                        >
                          Compare Shortlist Side-by-Side →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setShortlistOpen(false);
              }}
              className="p-2 transition-colors duration-200 cursor-pointer"
              style={{ color: searchOpen ? '#FFFFFF' : 'rgba(255,255,255,0.6)', background: 'none', border: 'none' }}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 z-50" style={{ width: '360px' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search universities, countries…"
                    className="w-full px-4 py-3 text-sm text-[#232323] placeholder-[#838383] outline-none"
                    style={{ border: 'none', borderBottom: '1px solid #e9e9e9', background: 'transparent' }}
                  />
                  {filteredResults.length > 0 && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '320px', overflowY: 'auto' }}>
                      {filteredResults.map((u) => (
                        <li key={u.id}>
                          <Link
                            href={`/universities/${u.id}`}
                            className="block px-4 py-3 no-underline transition-colors duration-200"
                            style={{ color: '#232323', fontSize: '14px' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          >
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                            <span style={{ color: '#838383', marginLeft: '8px', fontSize: '12px' }}>
                              {u.country}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchQuery.length >= 2 && filteredResults.length === 0 && (
                    <div className="px-4 py-4 text-sm" style={{ color: '#838383' }}>
                      No results for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User icon (THE style) */}
          <button
            className="hidden sm:flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#FE4537',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
            aria-label="Account"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — dark bg continuation */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: '#09090B',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 no-underline"
              style={{
                color: isActive(item.href) ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                borderLeft: isActive(item.href) ? '3px solid #164A3A' : '3px solid transparent',
                fontSize: '14px',
                fontWeight: isActive(item.href) ? 600 : 400,
              }}
            >
              {item.label}
              {item.label === 'Compare' && compareIds.length > 0 && (
                <span
                  className="ml-2"
                  style={{
                    background: '#164A3A',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {compareIds.length}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
