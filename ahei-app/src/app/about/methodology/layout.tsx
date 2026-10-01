import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Ranking Methodology & Audit Pillars | AHEI',
  description:
    'Detailed breakdown of the AHEI evaluation framework: Research Impact (30%), Teaching Quality (25%), Graduate Employability (20%), Continental Integration (15%), and Civic & Economic Impact (10%).',
  alternates: {
    canonical: `${siteUrl}/about/methodology`,
  },
  openGraph: {
    title: 'AHEI Audit Methodology & Evaluation Pillars',
    description:
      'Rigorous, primary-sourced university ranking methodology calibrated for African higher education.',
    url: `${siteUrl}/about/methodology`,
    type: 'website',
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
