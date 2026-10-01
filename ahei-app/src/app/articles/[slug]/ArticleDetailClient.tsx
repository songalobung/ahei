'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/data/articles';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { Share2, Clock, Calendar, Check, ChevronDown, ArrowRight, BookOpen } from 'lucide-react';

interface Props {
  article: Article;
  relatedArticles: Article[];
}

export function ArticleDetailClient({ article, relatedArticles }: Props) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article.title);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen text-[#232323]">
      {/* ─── Top Editorial Masthead ─── */}
      <header className="border-b border-[#e9e9e9] py-10 md:py-14 bg-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Breadcrumbs */}
          <nav className="text-xs text-[#838383] flex items-center gap-2">
            <Link href="/" className="hover:text-[#09090B] transition-colors no-underline text-[#838383]">
              Home
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-[#09090B] transition-colors no-underline text-[#838383]">
              Articles
            </Link>
            <span>/</span>
            <span className="text-[#164A3A] font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.category}
            </span>
          </nav>

          {/* Category Pill & Read Time */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="font-code-badge text-white px-3 py-1 font-semibold text-xs"
              style={{ background: '#164A3A', borderRadius: '20px' }}
            >
              {article.category}
            </span>
            <span className="text-xs text-[#838383] font-mono flex items-center gap-1 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-[#164A3A]" />
              {article.readTime}
            </span>
            <span className="text-xs text-[#838383]">•</span>
            <span className="text-xs text-[#676963]">
              Published {new Date(article.publishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#232323] leading-tight m-0">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-[#676963] leading-relaxed m-0 border-l-3 border-[#164A3A] pl-4 font-sans">
            {article.excerpt}
          </p>

          {/* Author Card & Social Share */}
          <div className="pt-5 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#164A3A]"
              />
              <div>
                <div className="text-sm font-serif font-bold text-[#232323]">
                  {article.author.name}
                </div>
                <div className="text-xs text-[#838383]">
                  {article.author.role}
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#f8fafc] hover:bg-[#F7F6F2] text-[#232323] hover:text-[#164A3A] border border-[#e2e8f0] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#f8fafc] hover:bg-white text-[#232323] border border-[#e2e8f0] rounded-full transition-colors cursor-pointer"
                title="Share on X"
              >
                𝕏 Share
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#f8fafc] hover:bg-white text-[#232323] border border-[#e2e8f0] rounded-full transition-colors cursor-pointer"
                title="Share on LinkedIn"
              >
                in Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Top Ad Banner ─── */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <GoogleAdSpace slotId="article-top-leaderboard" format="leaderboard" />
      </div>

      {/* ─── Main Article Content ─── */}
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Cover Photo */}
        <div className="the-card bg-white border border-[#e9e9e9] rounded-none overflow-hidden shadow-sm">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto max-h-[480px] object-cover"
          />
        </div>

        {/* Key Takeaways Callout */}
        <div className="the-card bg-[#f8fafc] border border-[#e2e8f0] rounded-none p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#164A3A]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#164A3A] m-0">
              Key Strategic Takeaways
            </h2>
          </div>
          <ul className="text-xs sm:text-sm text-[#232323] space-y-2 pl-4 list-disc marker:text-[#164A3A] leading-relaxed m-0">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx}>
                <strong>{takeaway.split(':')[0]}:</strong>
                {takeaway.includes(':') ? takeaway.substring(takeaway.indexOf(':') + 1) : ''}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-10 shadow-sm space-y-8">
          {article.contentSections.map((sec, idx) => (
            <section key={idx} className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323] m-0 mb-1.5 leading-tight">
                  {sec.heading}
                </h2>
                {sec.subheading && (
                  <p className="text-sm font-semibold text-[#838383] m-0 font-sans">
                    {sec.subheading}
                  </p>
                )}
              </div>

              {/* Paragraphs */}
              <div className="space-y-3.5 text-sm sm:text-base text-[#232323] leading-relaxed font-sans">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="m-0 leading-relaxed text-[#374151]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Callout if any */}
              {sec.callout && (
                <div
                  className={`p-4 sm:p-5 rounded-xs border text-xs sm:text-sm leading-relaxed ${
                    sec.callout.type === 'stat'
                      ? 'bg-[#F7F6F2] border-[#D9D7D0] text-[#1e3a8a]'
                      : 'bg-[#faf5ff] border-[#e9d5ff] text-[#581c87]'
                  }`}
                >
                  <div className="font-bold text-xs uppercase tracking-wider mb-1 font-mono">
                    {sec.callout.title}
                  </div>
                  <p className="m-0">{sec.callout.text}</p>
                </div>
              )}

              {/* Data Table if any */}
              {sec.tableData && (
                <div className="overflow-x-auto my-4 border border-[#e2e8f0] rounded-xs overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#f8fafc] text-[#232323] border-b border-[#e2e8f0]">
                      <tr>
                        {sec.tableData.headers.map((th, hIdx) => (
                          <th key={hIdx} className="px-4 py-3 font-bold uppercase tracking-wider text-[11px] font-mono">
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] bg-white">
                      {sec.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 font-mono text-xs text-[#232323]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* ─── In-Article AdSense Banner ─── */}
        <div>
          <GoogleAdSpace slotId="article-mid-content" format="in-feed" />
        </div>

        {/* ─── Frequently Asked Questions (FAQ Accordion) ─── */}
        <section className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-8 shadow-sm space-y-4">
          <div className="pb-4 border-b border-[#e9e9e9]">
            <span className="text-[11px] font-mono font-bold text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5">
              SEARCH FAQ SCHEMA
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {article.faqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div key={fIdx} className="py-4 first:pt-2 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-serif font-bold text-base text-[#232323] hover:text-[#164A3A] transition-colors cursor-pointer bg-none border-none p-0"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'bg-[#F7F6F2] text-[#164A3A] rotate-180' : 'bg-[#f8fafc] text-[#838383]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 text-xs sm:text-sm text-[#676963] leading-relaxed font-sans pr-8">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Author Bio Box ─── */}
        <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#164A3A] shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold text-[#164A3A] bg-[#F7F6F2] px-2 py-0.5 rounded-full uppercase tracking-wider">
              AUTHOR PROFILE
            </span>
            <h3 className="text-base font-serif font-bold text-[#232323] m-0 mt-1">
              {article.author.name}
            </h3>
            <p className="text-xs text-[#838383] m-0">
              {article.author.role}
            </p>
            <p className="text-xs text-[#676963] pt-2 m-0 leading-relaxed font-sans">
              {article.author.bio}
            </p>
          </div>
        </div>

        {/* ─── Related Articles ─── */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
              <h2 className="text-2xl font-serif font-bold text-[#232323] m-0">
                Related Higher Education Analysis
              </h2>
              <Link href="/articles" className="text-xs font-semibold text-[#164A3A] hover:underline no-underline">
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="the-card bg-white border border-[#e9e9e9] rounded-none p-5 shadow-sm hover:border-[#164A3A] transition-all no-underline block space-y-2 group"
                >
                  <span className="text-[10px] font-mono font-bold text-[#164A3A] uppercase">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#232323] group-hover:text-[#164A3A] transition-colors leading-snug m-0 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#676963] line-clamp-2 m-0 leading-relaxed font-sans">
                    {rel.excerpt}
                  </p>
                  <span className="text-[11px] font-semibold text-[#164A3A] flex items-center gap-1 pt-1">
                    Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
