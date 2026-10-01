import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ARTICLES_DATA } from '@/data/articles';
import { VERIFIED_CAMPUS_VIDEOS } from '@/data/videos';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { ArticlesHubClient } from './ArticlesHubClient';

export const metadata: Metadata = {
  title: 'Higher Education Articles, Rankings Analysis & Guides | AHEI',
  description: 'In-depth research reports, university rankings analysis, fully funded scholarship guides, tuition cost comparisons, and verified campus video tours across Africa.',
  keywords: [
    'African higher education blog',
    'Best universities in Africa 2026',
    'Scholarships for African students',
    'Cost of studying in South Africa',
    'Medical schools in Africa',
    'African university rankings analysis'
  ],
  alternates: {
    canonical: 'https://ahei.africa/articles',
  },
  openGraph: {
    title: 'African Higher Education Insights & Guides | AHEI',
    description: 'Data-driven rankings, fully funded scholarships, medical school comparisons, and campus culture across Africa.',
    url: 'https://ahei.africa/articles',
    type: 'website',
  },
};

export default function ArticlesPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AHEI African Higher Education Journal & Analysis Hub',
    description: 'Authoritative analysis, university rankings guides, scholarships, and campus video tours across Africa.',
    url: 'https://ahei.africa/articles',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: ARTICLES_DATA.map((art, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://ahei.africa/articles/${art.slug}`,
        name: art.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <ArticlesHubClient articles={ARTICLES_DATA} videos={VERIFIED_CAMPUS_VIDEOS} />
    </>
  );
}
