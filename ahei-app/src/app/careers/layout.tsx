import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'African Graduate Careers & Pan-African Degree Pathways',
  description:
    'Discover in-demand industries across the African continent, high-growth career tracks, degree alignment, and median starting compensation ranges.',
  alternates: {
    canonical: `${siteUrl}/careers`,
  },
  openGraph: {
    title: 'African Graduate Careers & Degree Pathways | AHEI',
    description:
      'Explore high-growth career paths, industry growth forecasts, and university degree alignments across Africa.',
    url: `${siteUrl}/careers`,
    type: 'website',
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
