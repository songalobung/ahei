'use client';

import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      style={{
        borderTop: '2px solid #09090B',
        background: '#f2f2f2',
        padding: '48px 0 32px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '20px',
                fontWeight: 600,
                color: '#09090B',
                marginBottom: '8px',
              }}
            >
              AHEI
            </div>
            <p className="font-body-sm" style={{ color: '#838383', maxWidth: '280px' }}>
              The African Higher Education Index — an authoritative, peer-reviewed continental
              academic registry and university rankings evaluating institutions across 54 African nations.
            </p>
            <p className="font-body-sm" style={{ color: '#838383', marginTop: '16px' }}>
              © {new Date().getFullYear()} AHEI. All rights reserved.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>
              Academic Intelligence
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { label: 'Continental Rankings 2027', href: '/rankings' },
                { label: 'Articles & Insights', href: '/articles' },
                { label: 'Universities Directory', href: '/universities' },
                { label: 'AI Career Match & Roadmaps', href: '/careers' },
                { label: 'Subject League Tables', href: '/subjects' },
                { label: 'Compare Universities', href: '/compare' },
                { label: 'Tuition & Cost Calculator', href: '/calculator' },
                { label: 'Explore Macro-Regions', href: '/explore' },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '8px' }}>
                  <Link
                    href={link.href}
                    className="font-body-md no-underline transition-colors duration-200"
                    style={{ color: '#232323' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#09090B')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#232323')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance & Trust column */}
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>
              Governance &amp; Trust
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { label: 'Audit Methodology', href: '/about/methodology' },
                { label: 'Frequently Asked Questions', href: '/about/faq' },
                { label: 'Submit Factual Correction', href: '/about/corrections' },
                { label: 'Terms of Use & License', href: '/about/terms' },
                { label: 'Privacy Policy', href: '/about/privacy' },
                { label: 'Auditor Security Gate', href: '/admin' },
              ].map((link) => (
                <li key={link.label} style={{ marginBottom: '8px' }}>
                  <Link
                    href={link.href}
                    className="font-body-md no-underline transition-colors duration-200"
                    style={{ color: '#232323' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#09090B')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#232323')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
