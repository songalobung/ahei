import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Institutional Data Correction & Verification Desk | AHEI',
  description:
    'Institutional registrars and accredited officers can submit formal corrections, gazetted fees, and audited records for peer verification.',
  alternates: {
    canonical: `${siteUrl}/about/corrections`,
  },
  openGraph: {
    title: 'Submit Institutional Data Correction | AHEI',
    description:
      'Official verification portal for institutional officers to submit auditable corrections.',
    url: `${siteUrl}/about/corrections`,
    type: 'website',
  },
};

export default function CorrectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
