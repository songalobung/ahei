import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | AHEI',
  description:
    'Answers to common questions about university selection, data verification, scoring confidence, and citing AHEI rankings.',
  alternates: {
    canonical: `${siteUrl}/about/faq`,
  },
  openGraph: {
    title: 'AHEI FAQ — Frequently Asked Questions',
    description:
      'Questions and answers regarding institutional eligibility, methodology, and dispute resolution.',
    url: `${siteUrl}/about/faq`,
    type: 'website',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
