import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Explore African Higher Education by Region & Discipline',
  description:
    'Comprehensive discovery guide for studying in Africa. Explore regional academic corridors, destination countries, subject rankings, and scholarship opportunities.',
  alternates: {
    canonical: `${siteUrl}/explore`,
  },
  openGraph: {
    title: 'Explore African Higher Education | AHEI Discovery Hub',
    description:
      'Explore regional corridors, destination country guides, and specialized disciplines across African universities.',
    url: `${siteUrl}/explore`,
    type: 'website',
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
