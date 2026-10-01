'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Search, 
  Bookmark, 
  ShieldCheck, 
  SlidersHorizontal,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export function NavigationHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [apiResults, setApiResults] = useState<any[]>([]);

  // Debounced API search when typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/universities?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.institutions) {
            setApiResults(json.institutions.slice(0, 6));
          }
        }
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (uniId: string) => {
    router.push(`/universities/${uniId}`);
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedResultIndex(-1);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'Universities', href: '/universities' },
    { label: 'Compare', href: '/compare' },
    { label: 'Admin Desk', href: '/admin' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f2f2f2] shadow-2xs border-b border-[#d5d5d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
        
        {/* Masthead Brand */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xs bg-[#09090B] flex items-center justify-center p-1 shrink-0 text-white font-serif font-bold text-sm">
              A
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-[17px] text-[#09090B] tracking-tight whitespace-nowrap">
                African Higher Education Index
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#838383] whitespace-nowrap hidden sm:inline">
                The Authority on Continental Academics
              </span>
            </div>
          </Link>

          {/* Core Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-sans text-[13px] shrink-0 font-medium">
            {navLinks.map((link) => {
              const isActive = link.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#09090B] font-bold border-b-2 border-[#09090B]'
                      : 'text-[#838383] hover:text-[#232323]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Global Search & Auth */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Global Typeahead Search */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-[#f9f9f9] border border-[#d5d5d5] px-2.5 py-1.5 w-48 xl:w-64 focus-within:border-[#09090B] transition-colors rounded-xs">
              <Search className="w-3.5 h-3.5 text-[#838383] mr-1.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                aria-label="Search African universities or countries"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSearchResults(false);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedResultIndex((prev) => 
                      prev < apiResults.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedResultIndex >= 0 && apiResults[selectedResultIndex]) {
                      handleSelectSearchResult(apiResults[selectedResultIndex].institution_id);
                    } else if (searchQuery.trim()) {
                      router.push(`/universities?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSearchResults(false);
                    }
                  }
                }}
                placeholder="Search universities..."
                className="bg-transparent text-xs text-[#232323] placeholder-[#8c8e87] outline-none w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="text-[#8c8e87] hover:text-[#232323] text-xs cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchResults && apiResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d5d5d5] shadow-none z-50 py-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-[#838383] bg-[#f9f9f9] border-b border-[#d5d5d5] flex items-center justify-between">
                  <span>Registry Matches</span>
                  <span className="text-[#164A3A]">↑↓ Enter</span>
                </div>
                {apiResults.map((uni, idx) => (
                  <button
                    key={uni.institution_id}
                    onMouseDown={() => handleSelectSearchResult(uni.institution_id)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 border-b border-[#E6E3DC] last:border-0 cursor-pointer transition-colors ${
                      selectedResultIndex === idx ? 'bg-[#09090B]/10 border-l-2 border-l-[#09090B]' : 'hover:bg-[#f9f9f9]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-serif text-xs text-[#09090B] font-bold truncate">
                        {uni.institution_name}
                      </div>
                      <div className="text-[11px] text-[#838383] font-sans">
                        {uni.city ? `${uni.city}, ` : ''}{uni.country}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#164A3A]">
                      {uni.country_iso2}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <Link
            href="/rankings"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090B] hover:bg-[#2A6B55] text-white text-xs font-semibold rounded-xs shadow-2xs transition"
          >
            <span>Rankings 2027</span>
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-[#09090B] cursor-pointer flex items-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d5d5d5] bg-[#f2f2f2] px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 text-sm font-sans ${
                  pathname === link.href ? 'font-bold text-[#09090B]' : 'text-[#838383]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
