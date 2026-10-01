import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  Award,
  BookOpen,
  Compass,
  TrendingUp,
  Scale
} from 'lucide-react';
import { MACRO_REGIONS, MacroRegion } from '@/data/macroRegions';
import { 
  universitiesRepository, 
  rankingsRepository, 
  countriesRepository 
} from '@/domain/repositories';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MACRO_REGIONS.map((r) => ({
    slug: r.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const region = MACRO_REGIONS.find(r => r.id === slug);
  if (!region) return { title: 'Region Not Found | AHEI' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  return {
    title: `${region.name} Higher Education Intelligence & Regional Directory | AHEI`,
    description: `${region.name} academic league table, cross-border research corridors, and statutory university registry across ${region.nationsCount} member states.`,
    alternates: {
      canonical: `${siteUrl}/regions/${region.id}`,
    },
    openGraph: {
      title: `${region.name} Higher Education Directory | AHEI`,
      description: `Official higher education intelligence and university directory for ${region.name}.`,
      url: `${siteUrl}/regions/${region.id}`,
    },
  };
}

export default async function RegionDirectoryPage({ params }: Props) {
  const { slug } = await params;
  const region = MACRO_REGIONS.find(r => r.id === slug);

  if (!region) {
    notFound();
  }

  const institutions = universitiesRepository.getByRegionSlug(slug);
  const rankings = rankingsRepository.getByRegionSlug(slug);
  const memberCountries = countriesRepository.getByRegionSlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  const regionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${region.name} Higher Education Intelligence & Regional Directory`,
    description: `${region.name} academic league table, cross-border research corridors, and statutory university registry.`,
    url: `${siteUrl}/regions/${region.id}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Explore Regions',
          item: `${siteUrl}/explore`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: region.name,
          item: `${siteUrl}/regions/${region.id}`,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: institutions.map((inst, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/universities/${inst.institution_id.toLowerCase()}`,
        name: inst.institution_name,
      })),
    },
  };

  return (
    <div className="min-h-screen text-[#232323]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(regionJsonLd) }}
      />
      {/* ─── Breadcrumb Strip ─── */}
      <div className="border-b border-[#e9e9e9] py-3 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-[#838383]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#09090B] transition">Home</Link>
            <span className="text-[#d5d5d5]">/</span>
            <Link href="/rankings" className="hover:text-[#09090B] transition">Rankings</Link>
            <span className="text-[#d5d5d5]">/</span>
            <span className="text-[#232323] font-semibold">{region.name}</span>
          </div>
          <span className="font-mono text-[11px] text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-2.5 py-0.5 rounded-full font-bold">
            MACRO-REGIONAL CORRIDOR
          </span>
        </div>
      </div>

      {/* ─── Masthead Header Strip ─── */}
      <div className="py-10 border-b border-[#e9e9e9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link 
            href="/rankings" 
            className="inline-flex items-center gap-1.5 text-xs text-[#838383] hover:text-[#164A3A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Continental League Table
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Compass className="w-3.5 h-3.5" /> Continental Macro-Region
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] m-0">
                {region.name} Academic Corridor
              </h1>
              <p className="text-sm sm:text-base text-[#676963] max-w-2xl leading-relaxed m-0">
                {region.description}
              </p>
            </div>

            {/* Statistical Pill Card */}
            <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-5 flex items-center gap-6 shrink-0 shadow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#838383] block">Member States</span>
                <span className="text-2xl font-bold font-mono text-[#232323] tabular-nums">
                  {region.nationsCount}
                </span>
              </div>
              <div className="w-px h-8 bg-[#e9e9e9]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#838383] block">Median AHEI</span>
                <span className="text-2xl font-bold font-mono text-[#164A3A] tabular-nums">
                  {region.medianScore}
                </span>
              </div>
              <div className="w-px h-8 bg-[#e9e9e9]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#838383] block">Top Field</span>
                <span className="text-xs font-semibold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2 py-0.5 rounded-full">
                  {region.topField}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Member Countries Strip */}
        <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e9e9e9]">
            <h2 className="font-serif font-bold text-xl text-[#232323] flex items-center gap-2 m-0">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              Member State Regulatory Registers ({memberCountries.length} countries mapped)
            </h2>
            <span className="text-xs text-[#838383] font-mono">Verified national directories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {memberCountries.map(c => (
              <Link
                key={c.country_iso2}
                href={`/countries/${c.country_iso2.toLowerCase()}`}
                className="p-3.5 border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#164A3A] hover:bg-white rounded-xs transition-all group no-underline shadow-2xs"
              >
                <span className="font-mono text-[10px] text-[#164A3A] block font-bold">{c.country_iso2}</span>
                <span className="text-xs font-bold text-[#232323] group-hover:text-[#164A3A] block truncate mt-0.5">
                  {c.country}
                </span>
                <span className="text-[10px] text-[#838383] block mt-1">
                  {c.wikidata_count} candidate HEIs
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Regional League Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#232323] m-0">
                Top Ranked Institutions in {region.name} ({institutions.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#676963] m-0 mt-0.5">
                Peer-reviewed evaluation across teaching scale, citation impact, and governance completeness.
              </p>
            </div>
            <Link
              href="/compare"
              className="text-xs font-semibold text-[#164A3A] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Compare Institutions <Scale className="w-3.5 h-3.5" />
            </Link>
          </div>

          {institutions.length === 0 ? (
            <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-12 text-center space-y-3 shadow-sm">
              <BookOpen className="w-10 h-10 text-[#838383] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-[#232323] m-0">
                Audited Institutions Ingesting for {region.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#676963] max-w-md mx-auto m-0 leading-relaxed">
                National regulator lists for member states in this region are compiled. Flagship profiles will appear here as soon as verified by the Governance Desk.
              </p>
            </div>
          ) : (
            <div className="the-card border border-[#e9e9e9] bg-white rounded-none overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#f8fafc] text-[#232323] text-[11px] font-semibold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <tr>
                      <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                      <th className="py-3.5 px-5">University Name</th>
                      <th className="py-3.5 px-4">Country</th>
                      <th className="py-3.5 px-4">Sector</th>
                      <th className="py-3.5 px-4 text-center">Enrollment</th>
                      <th className="py-3.5 px-4 text-center">Completeness</th>
                      <th className="py-3.5 px-5 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {institutions.map((inst, idx) => {
                      const rankEntry = rankings.find(r => r.institution_id === inst.institution_id);
                      return (
                        <tr key={inst.institution_id} className="hover:bg-[#f8fafc] transition-colors h-14">
                          <td className="py-3 px-4 text-center font-mono font-bold text-sm text-[#164A3A]">
                            {rankEntry ? `#${rankEntry.rank}` : String(idx + 1).padStart(2, '0')}
                          </td>
                          <td className="py-3 px-5">
                            <Link 
                              href={`/universities/${inst.institution_id}`}
                              className="font-bold text-sm text-[#232323] hover:text-[#164A3A] transition block font-serif no-underline"
                            >
                              {inst.institution_name}
                            </Link>
                            <span className="text-[11px] text-[#838383] font-mono">{inst.city}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/countries/${inst.country_iso2.toLowerCase()}`}
                              className="font-semibold text-[#232323] hover:text-[#164A3A] hover:underline"
                            >
                              {inst.country}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] px-2.5 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] text-[#232323] rounded-full">
                              {inst.sector}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono tabular-nums text-[#676963]">
                            {inst.total_enrollment ? Number(inst.total_enrollment).toLocaleString() : '—'}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-[#059669] tabular-nums">
                            {Math.round(Number(inst.data_completeness_score || 0) * 100)}%
                          </td>
                          <td className="py-3 px-5 text-right">
                            <Link
                              href={`/universities/${inst.institution_id}`}
                              className="text-xs font-semibold text-[#164A3A] hover:underline no-underline"
                            >
                              Inspect →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
