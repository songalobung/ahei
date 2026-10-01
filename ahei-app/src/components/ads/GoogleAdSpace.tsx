'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';

export type AdFormat = 'leaderboard' | 'in-feed' | 'rectangle' | 'billboard';

interface GoogleAdSpaceProps {
  slotId?: string;
  format?: AdFormat;
  className?: string;
  label?: string;
  sponsorName?: string;
  sponsorDescription?: string;
  sponsorCta?: string;
  sponsorUrl?: string;
}

const DEFAULT_SPONSORS: Record<AdFormat, {
  name: string;
  desc: string;
  tag: string;
  cta: string;
  url: string;
}> = {
  leaderboard: {
    name: 'African Union STEM & Climate Resilience Fellowships 2027',
    desc: 'Fully-funded postgraduate research grants at top-ranked continental universities. Open to eligible African scholars.',
    tag: 'SPONSORED ACADEMIC OPPORTUNITY',
    cta: 'Apply for AU Fellowship',
    url: 'https://au.int',
  },
  'in-feed': {
    name: 'Google Cloud for African Higher Education Labs',
    desc: 'Research credits, BigQuery academic datasets, and native AI compute grants for African university researchers.',
    tag: 'OFFICIAL RESEARCH PARTNER',
    cta: 'Access Academic Credits',
    url: 'https://cloud.google.com/edu',
  },
  rectangle: {
    name: 'Pan-African Postgraduate Discovery Grant',
    desc: 'Tuition and living stipends for cross-border engineering, health sciences, and trade law scholars.',
    tag: 'STUDENT AID NOTICE',
    cta: 'Explore Grant Criteria',
    url: '/calculator',
  },
  billboard: {
    name: 'AfCFTA Cross-Border Graduate Placement Initiative',
    desc: 'Direct corporate recruitment pipelines connecting top university graduates with continental enterprises across 54 countries.',
    tag: 'CONTINENTAL RECRUITMENT CORRIDOR',
    cta: 'View Corporate Partners',
    url: '/careers',
  },
};

export function GoogleAdSpace({
  slotId = '8492019482',
  format = 'leaderboard',
  className = '',
  label = 'ADVERTISEMENT',
  sponsorName,
  sponsorDescription,
  sponsorCta,
  sponsorUrl,
}: GoogleAdSpaceProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  const fallback = DEFAULT_SPONSORS[format];
  const name = sponsorName || fallback.name;
  const desc = sponsorDescription || fallback.desc;
  const cta = sponsorCta || fallback.cta;
  const url = sponsorUrl || fallback.url;

  useEffect(() => {
    if (typeof window !== 'undefined' && clientId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        // Fallback to broadsheet sponsor notice if AdSense is blocked or unconfigured
        setAdLoaded(false);
      }
    }
  }, [clientId]);

  // Dimension constraints per format to eliminate Cumulative Layout Shift (CLS)
  const formatStyles: Record<AdFormat, string> = {
    leaderboard: 'min-h-[100px] max-w-[1200px]',
    'in-feed': 'min-h-[96px] max-w-full my-4',
    rectangle: 'min-h-[260px] w-full max-w-[340px]',
    billboard: 'min-h-[140px] md:min-h-[180px] max-w-[1200px]',
  };

  return (
    <div
      className={`module bg-[#FFFFFF] border border-[#d5d5d5] p-3 sm:p-4 relative transition-colors ${formatStyles[format]} ${className}`}
      aria-label="Advertisement Space"
    >
      {/* Google AdSense Attribution Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f9f9f9] text-[10px] font-mono text-[#838383] uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="bg-[#f9f9f9] text-[#09090B] px-1.5 py-0.5 rounded-xs font-bold border border-[#d5d5d5]">
            {label}
          </span>
          <span className="text-[#09090B] font-semibold">Google AdSense Space</span>
        </div>
        <div className="flex items-center gap-1 text-[#838383] hover:text-[#09090B]">
          <span className="text-[9px]">AdChoices</span>
          <Info className="w-2.5 h-2.5 text-[#164A3A]" />
        </div>
      </div>

      {/* Real AdSense Placement Container (When Client ID Configured) */}
      {clientId ? (
        <ins
          className="adsbygoogle block overflow-hidden text-center"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      ) : null}

      {/* Broadsheet Academic Sponsor Creative (Displayed with pristine institutional aesthetics) */}
      {!adLoaded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-code-badge bg-[#FAF5EB] text-[#164A3A] border border-[#E0D3BC] px-1.5 py-0.2 text-[10px] font-bold rounded-xs">
                {fallback.tag}
              </span>
            </div>
            <h4 className="font-title-md text-[#232323] m-0 text-sm leading-snug">
              {name}
            </h4>
            <p className="font-body-sm text-[#838383] text-xs m-0 leading-relaxed max-w-3xl">
              {desc}
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <a
              href={url}
              target={url.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 no-underline font-semibold"
            >
              <span>{cta}</span>
              <ExternalLink className="w-3 h-3 text-[#164A3A]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
