import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'African Universities Directory & Sovereign Gazette',
  description:
    'Search and browse verified profiles of chartered universities across Africa. View official regulatory accreditations, tuition bands, student enrollments, and academic programs.',
  keywords: [
    'African universities directory',
    'accredited universities Africa',
    'African university search',
    'sovereign higher education directory',
    'chartered universities Africa'
  ],
  alternates: {
    canonical: `${siteUrl}/universities`,
  },
  openGraph: {
    title: 'African Universities Directory & Sovereign Gazette | AHEI',
    description:
      'Search verified profiles of chartered universities across all 54 African countries with official accreditation data.',
    url: `${siteUrl}/universities`,
    type: 'website',
  },
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
