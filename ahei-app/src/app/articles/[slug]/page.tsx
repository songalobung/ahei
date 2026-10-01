import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ARTICLES_DATA, Article } from '@/data/articles';
import { GoogleAdSpace } from '@/components/ads/GoogleAdSpace';
import { ArticleDetailClient } from './ArticleDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES_DATA.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES_DATA.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article Not Found | AHEI',
      description: 'The requested article could not be located.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    title: `${article.metaTitle} | AHEI`,
    description: article.metaDescription,
    keywords: article.tags,
    alternates: {
      canonical: articleUrl,
    },
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: articleUrl,
      type: 'article',
      publishedTime: article.publishDate,
      modifiedTime: article.modifiedDate,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.coverImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES_DATA.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  // Schema 1: Article Structured Data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: [article.coverImage],
    datePublished: article.publishDate,
    dateModified: article.modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'African Higher Education Index (AHEI)',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    keywords: article.tags.join(', '),
  };

  // Schema 2: FAQPage Structured Data (Triggers rich snippets in Google Search)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Schema 3: BreadcrumbList Structured Data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  const relatedArticles = ARTICLES_DATA.filter((a) =>
    article.relatedSlugs?.includes(a.slug)
  ).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleDetailClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}
