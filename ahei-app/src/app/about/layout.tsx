import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'About AHEI — Mission, Ethics & Sovereign Governance',
  description:
    'Learn about the African Higher Education Index (AHEI), our independent audit methodology, sovereign registry data sources, and governance committee.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About AHEI — Mission & Governance',
    description:
      'The independent, peer-reviewed evaluation framework for higher education across Africa.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
