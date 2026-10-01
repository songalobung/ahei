import { permanentRedirect, notFound } from 'next/navigation';
import { MACRO_REGIONS } from '@/data/macroRegions';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MACRO_REGIONS.map((r) => ({
    slug: r.id,
  }));
}

export default async function ExploreRegionRedirectPage({ params }: Props) {
  const { slug } = await params;
  const region = MACRO_REGIONS.find((r) => r.id === slug);
  if (!region) {
    notFound();
  }
  permanentRedirect(`/regions/${slug}`);
}
