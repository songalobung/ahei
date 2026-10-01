'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/data/articles';
import { UniversityVideo } from '@/data/videos';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { Search, Play, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';

interface Props {
  articles: Article[];
  videos: UniversityVideo[];
}

const CATEGORIES = [
  'All Topics',
  'Rankings & Analysis',
  'Scholarships & Funding',
  'Costs & Student Life',
  'STEM & Innovation',
  'Medicine & Healthcare',
] as const;

export function ArticlesHubClient({ articles, videos }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);

  const activeVideo = videos[activeVideoIndex] || videos[0];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === 'All Topics' || art.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = filteredArticles.filter((a) => a.slug !== featuredArticle.slug);

  return (
    <div className="min-h-screen text-[#232323]">
      {/* ─── Breadcrumb & Masthead ─── */}
      <div className="border-b border-[#e9e9e9] py-8 sm:py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <nav className="text-xs text-[#838383] flex items-center gap-2">
            <Link href="/" className="hover:text-[#09090B] transition-colors no-underline text-[#838383]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#164A3A] font-semibold">Articles &amp; Insights</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="font-code-badge text-white px-3 py-1 font-semibold text-xs"
                  style={{ background: '#164A3A', borderRadius: '20px' }}
                >
                  AHEI CONTINENTAL JOURNAL
                </span>
                <span className="font-mono text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
                  RESEARCH &amp; ANALYSIS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#232323] m-0">
                Higher Education Analysis &amp; Guides
              </h1>
            </div>
            <p className="text-sm text-[#676963] max-w-md m-0 leading-relaxed">
              Authoritative research, admissions roadmaps, verified scholarship directories, and student life intelligence across 54 African countries.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Top AdSense Banner ─── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <GoogleAdSpace slotId="articles-hub-top" format="leaderboard" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* ─── Filters & Search Toolbar ─── */}
        <div className="the-card bg-white border border-[#e9e9e9] p-4 sm:p-5 rounded-none shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-[#09090B] text-white border-[#09090B] shadow-xs'
                        : 'bg-white text-[#676963] border-[#e2e8f0] hover:border-[#164A3A] hover:text-[#164A3A]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, universities, fees..."
                className="w-full text-xs px-4 py-2.5 pl-9 border border-[#e2e8f0] rounded-full focus:outline-none focus:border-[#164A3A] bg-[#f8fafc] focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#838383]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#838383] hover:text-[#232323] cursor-pointer bg-none border-none"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Featured Article Hero Card ─── */}
        {selectedCategory === 'All Topics' && !searchQuery && featuredArticle && (
          <div className="the-card bg-white border border-[#e9e9e9] rounded-none overflow-hidden shadow-sm hover:border-[#164A3A] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between space-y-5">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full">
                      FEATURED ANALYSIS
                    </span>
                    <span className="text-xs font-semibold text-[#838383]">
                      {featuredArticle.category}
                    </span>
                    <span className="text-xs text-[#838383]">•</span>
                    <span className="text-xs text-[#838383] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <Link href={`/articles/${featuredArticle.slug}`} className="block no-underline group">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323] group-hover:text-[#164A3A] transition-colors leading-tight m-0">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-[#676963] leading-relaxed line-clamp-3 m-0">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#232323] mb-2 font-mono">
                      Key Takeaways:
                    </div>
                    <ul className="text-xs text-[#676963] space-y-1.5 pl-4 list-disc marker:text-[#164A3A] m-0">
                      {featuredArticle.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                        <li key={idx} className="leading-relaxed">{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#232323]">
                        {featuredArticle.author.name}
                      </div>
                      <div className="text-[11px] text-[#838383]">
                        {new Date(featuredArticle.publishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164A3A] hover:underline no-underline"
                  >
                    Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#09090B]">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── Articles Grid ─── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
                {selectedCategory === 'All Topics' ? 'All Published Guides & Reports' : selectedCategory}
              </h2>
              <span className="text-xs text-[#838383] mt-0.5 block">
                Showing {filteredArticles.length} peer-reviewed resources
              </span>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="the-card bg-white border border-[#e9e9e9] p-12 text-center rounded-none shadow-sm">
              <p className="text-base text-[#676963] mb-3">
                No articles found matching &quot;{searchQuery}&quot; in this category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Topics');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#164A3A] hover:underline cursor-pointer bg-none border-none"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'All Topics' && !searchQuery ? regularArticles : filteredArticles).map((art) => (
                <article
                  key={art.slug}
                  className="the-card bg-white border border-[#e9e9e9] rounded-none overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#164A3A] hover:shadow-none transition-all group"
                >
                  <div>
                    {/* Thumbnail */}
                    <Link href={`/articles/${art.slug}`} className="block relative aspect-video overflow-hidden bg-[#232323] no-underline">
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-[#09090B]/85 text-white text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        {art.category}
                      </span>
                    </Link>

                    {/* Body */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#838383] font-mono">
                        <span>{art.readTime}</span>
                        <span>•</span>
                        <span>
                          {new Date(art.publishDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <Link href={`/articles/${art.slug}`} className="block no-underline">
                        <h3 className="text-lg font-serif font-bold text-[#232323] group-hover:text-[#164A3A] transition-colors leading-snug m-0 line-clamp-2">
                          {art.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#676963] leading-relaxed line-clamp-3 m-0">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 sm:p-6 pt-0 mt-2">
                    <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={art.author.avatar}
                          alt={art.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#e2e8f0]"
                        />
                        <span className="text-xs font-medium text-[#232323] truncate max-w-[140px]">
                          {art.author.name}
                        </span>
                      </div>
                      <Link
                        href={`/articles/${art.slug}`}
                        className="text-xs font-semibold text-[#164A3A] hover:underline no-underline flex items-center gap-1"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ─── Middle AdSpace ─── */}
        <div className="py-2">
          <GoogleAdSpace slotId="articles-hub-middle" format="in-feed" />
        </div>

        {/* ─── REAL & VERIFIED CAMPUS VIDEOS SHOWCASE ─── */}
        <section className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e9e9e9]">
            <div>
              <span className="font-mono text-[11px] font-bold text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-2.5 py-0.5 rounded-full block w-fit mb-1.5 uppercase tracking-wider">
                VERIFIED MULTIMEDIA HUB
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
                Official Campus Video Tours &amp; Academic Insights
              </h2>
            </div>
            <span className="text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 rounded-full">
              8 Verified Playable Documentaries &amp; Student Tours
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Player */}
            <div className="lg:col-span-8 space-y-4">
              <div className="aspect-video w-full bg-[#09090B] rounded-none overflow-hidden shadow-sm relative">
                <iframe
                  key={activeVideo.youtubeId}
                  className="w-full h-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&autoplay=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-[#F7F6F2] text-[#164A3A] border border-[#D9D7D0] px-2.5 py-0.5 rounded-full">
                    {activeVideo.category}
                  </span>
                  <span className="text-xs font-semibold text-[#838383]">
                    {activeVideo.duration} • Channel: {activeVideo.channelName}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#232323] m-0 mb-2">
                  {activeVideo.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#676963] leading-relaxed m-0">
                  {activeVideo.description}
                </p>

                <div className="mt-3.5 pt-3.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                  <span className="text-[#838383]">
                    Location: <strong className="text-[#232323]">{activeVideo.country} ({activeVideo.region})</strong>
                  </span>
                  <Link
                    href={`/universities/${activeVideo.institutionId}`}
                    className="text-[#164A3A] font-semibold hover:underline no-underline"
                  >
                    View University Dossier →
                  </Link>
                </div>
              </div>
            </div>

            {/* Video Playlist Selector */}
            <div className="lg:col-span-4 flex flex-col space-y-2 overflow-y-auto max-h-[520px] pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#232323] pb-2 border-b border-[#e9e9e9] font-mono">
                Select Campus Tour:
              </div>
              {videos.map((vid, idx) => {
                const isCurrent = idx === activeVideoIndex;
                return (
                  <button
                    key={vid.id}
                    onClick={() => setActiveVideoIndex(idx)}
                    className={`w-full text-left p-3 rounded-xs border transition-all cursor-pointer flex gap-3 ${
                      isCurrent
                        ? 'bg-[#09090B] text-white border-[#09090B] shadow-xs'
                        : 'bg-[#f8fafc] text-[#232323] border-[#e2e8f0] hover:bg-white hover:border-[#164A3A]'
                    }`}
                  >
                    <div className="w-16 h-12 bg-[#232323] rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white">
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-[10px] font-mono uppercase truncate ${
                          isCurrent ? 'text-[#d5d5d5]' : 'text-[#838383]'
                        }`}
                      >
                        {vid.institutionName} • {vid.duration}
                      </div>
                      <div className="text-xs font-semibold leading-snug line-clamp-2 mt-0.5">
                        {vid.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
