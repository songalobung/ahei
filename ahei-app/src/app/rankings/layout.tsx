import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: '2026/2027 African University Rankings — Master League Table',
  description:
    'Explore the authoritative, peer-reviewed 2026/2027 rankings of universities across 54 African nations. Compare research output, teaching quality, graduate employability, and regional performance.',
  keywords: [
    'African university rankings 2026',
    'African university rankings 2027',
    'best universities in Africa',
    'top African universities',
    'AHEI league table',
    'university ranking Africa'
  ],
  alternates: {
    canonical: `${siteUrl}/rankings`,
  },
  openGraph: {
    title: '2026/2027 African University Rankings | AHEI Master League Table',
    description:
      'Compare research productivity, employability scores, and continental relevance across sovereign African universities.',
    url: `${siteUrl}/rankings`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026/2027 African University Rankings | AHEI',
    description: 'The definitive academic rankings of higher education institutions in Africa.',
  },
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
