import React from 'react';
import { Metadata } from 'next';
import { UNIVERSITIES } from '@/data/universities';
import institutionsData from '@/data/institutions.json';
import { UniversityDetailClient } from './UniversityDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = new Set<string>();
  UNIVERSITIES.forEach((u) => {
    ids.add(u.id.toLowerCase());
  });
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const normalized = id.toLowerCase().trim();
  const u = UNIVERSITIES.find(
    (uni) =>
      uni.id.toLowerCase() === normalized ||
      uni.registryId.toLowerCase() === normalized ||
      uni.name.toLowerCase().includes(normalized)
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

  if (!u) {
    return {
      title: 'University Profile & Academic Audit | AHEI',
      description: 'Audited African university profile, rankings, degree programmes, and admissions.',
    };
  }

  const title = `${u.name} — 2026/2027 Ranking, Programs, Fees & Admissions | AHEI`;
  const description = `Official audited dossier for ${u.name} in ${u.city}, ${u.country} (Rank #${u.rank} in Africa, AHEI Score ${u.aheiScore.toFixed(1)}). Review accredited faculties, domestic and international tuition bands, student body metrics, and regulatory accreditation by ${u.accreditationBody}.`;
  const url = `${siteUrl}/universities/${u.id}`;

  return {
    title,
    description,
    keywords: [
      u.name,
      `${u.name} ranking`,
      `${u.name} tuition fees`,
      `${u.name} courses and admissions`,
      u.country,
      u.city,
      u.accreditationBody,
      ...u.flagshipFaculties,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: u.crestUrl || `${siteUrl}/og-image.png`,
          width: 800,
          height: 800,
          alt: `${u.name} Official Emblem`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function UniversityPage({ params }: Props) {
  const { id } = await params;
  const normalized = id.toLowerCase().trim();
  const u = UNIVERSITIES.find(
    (uni) =>
      uni.id.toLowerCase() === normalized ||
      uni.registryId.toLowerCase() === normalized ||
      uni.name.toLowerCase().includes(normalized)
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

  const jsonLd = u ? {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: u.name,
    alternateName: u.nativeMotto,
    url: u.website || `${siteUrl}/universities/${u.id}`,
    logo: u.crestUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: u.city,
      addressCountry: u.country,
    },
    foundingDate: String(u.estYear),
    description: u.description,
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <UniversityDetailClient id={id} />
    </>
  );
}
