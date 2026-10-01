import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CompareBar } from '@/components/layout/CompareBar';
import { CompareProvider } from '@/components/layout/CompareProvider';
import { BookmarksProvider } from '@/components/layout/BookmarksProvider';
import { InstitutionsProvider } from '@/components/layout/InstitutionsProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AHEI — African Higher Education Index',
    template: '%s | AHEI',
  },
  description:
    'The authoritative, peer-reviewed continental academic registry and university rankings evaluating higher-education institutions across 54 African countries.',
  keywords: [
    'African Higher Education Index',
    'AHEI',
    'African university rankings',
    'best universities in Africa',
    'study in Africa',
    'African degree accreditation',
    'university tuition fees Africa',
    'African higher education scholarships',
    'East Africa universities',
    'West Africa universities',
    'North Africa universities',
    'Southern Africa universities'
  ],
  authors: [{ name: 'African Higher Education Research Collective' }],
  creator: 'AHEI Intelligence Secretariat',
  publisher: 'African Higher Education Index',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'AHEI — African Higher Education Index',
    description: 'The authoritative, peer-reviewed continental academic registry and university rankings evaluating higher-education institutions across 54 African countries.',
    siteName: 'AHEI',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AHEI African Higher Education Index',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AHEI — African Higher Education Index',
    description: 'The authoritative continental academic registry and university rankings across 54 African countries.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'African Higher Education Index',
  alternateName: 'AHEI',
  url: siteUrl,
  description: 'The authoritative, peer-reviewed continental academic registry and university rankings evaluating higher-education institutions across 54 African countries.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/rankings?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'African Higher Education Index',
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  sameAs: [
    'https://twitter.com/AHEI_Africa',
    'https://www.linkedin.com/company/ahei-africa'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        {adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-[#f2f2f2] text-[#232323] antialiased selection:bg-[#D9D7D0] selection:text-[#164A3A]">
        <InstitutionsProvider>
          <CompareProvider>
            <BookmarksProvider>
              <div className="min-h-screen flex flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
                <CompareBar />
              </div>
            </BookmarksProvider>
          </CompareProvider>
        </InstitutionsProvider>
      </body>
    </html>
  );
}
