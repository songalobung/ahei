import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Compare African Universities Side-by-Side',
  description:
    'Compare up to 4 African universities across academic metrics, research expenditures, faculty ratios, tuition costs, and international student living expenses.',
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  openGraph: {
    title: 'Compare African Universities Side-by-Side | AHEI Workspace',
    description:
      'Multi-pillar institutional comparison tool for prospective students, researchers, and university leadership.',
    url: `${siteUrl}/compare`,
    type: 'website',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
