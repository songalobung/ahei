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
  BookOpen
} from 'lucide-react';
import { countriesRepository, universitiesRepository, rankingsRepository } from '@/domain/repositories';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  const all = countriesRepository.getAll();
  return all.map((c) => ({
    code: c.country_iso2.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  const country = countriesRepository.getByIso2(code);
  if (!country) return { title: 'Country Not Found | AHEI' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  return {
    title: `${country.country} Higher Education Registry & Directory | AHEI`,
    description: `Official registry and academic intelligence directory for universities in ${country.country}. Explore accredited institutions, tuition benchmarks, and regulatory accreditation status.`,
    alternates: {
      canonical: `${siteUrl}/countries/${country.country_iso2.toLowerCase()}`,
    },
    openGraph: {
      title: `${country.country} University Directory & Registry | AHEI`,
      description: `Official higher education registry for ${country.country} with accredited public and private institutions.`,
      url: `${siteUrl}/countries/${country.country_iso2.toLowerCase()}`,
    },
  };
}

export default async function CountryDirectoryPage({ params }: Props) {
  const { code } = await params;
  const country = countriesRepository.getByIso2(code);

  if (!country) {
    notFound();
  }

  const institutions = universitiesRepository.getByCountry(country.country_iso2);
  const allRankings = rankingsRepository.getAll();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahei.africa';
  const countryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${country.country} Higher Education Registry`,
    description: `Official registry and academic intelligence directory for universities in ${country.country}.`,
    url: `${siteUrl}/countries/${country.country_iso2.toLowerCase()}`,
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
          name: 'Universities',
          item: `${siteUrl}/universities`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: country.country,
          item: `${siteUrl}/countries/${country.country_iso2.toLowerCase()}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(countryJsonLd) }}
      />
      {/* ─── Breadcrumb Strip ─── */}
      <div className="border-b border-[#e9e9e9] py-3 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-[#838383]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#09090B] transition">Home</Link>
            <span className="text-[#d5d5d5]">/</span>
            <Link href="/universities" className="hover:text-[#09090B] transition">Universities</Link>
            <span className="text-[#d5d5d5]">/</span>
            <span className="text-[#232323] font-semibold">{country.country}</span>
          </div>
          <span className="font-mono text-[11px] text-[#164A3A] bg-[#F7F6F2] border border-[#D9D7D0] px-2 py-0.5 rounded-full font-bold">
            ISO: {country.country_iso2}
          </span>
        </div>
      </div>

      {/* ─── Header Masthead ─── */}
      <div className="py-10 border-b border-[#e9e9e9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link 
            href="/universities" 
            className="inline-flex items-center gap-1.5 text-xs text-[#838383] hover:text-[#164A3A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Continental Directory
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Member State Register
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] m-0">
                {country.country} Higher Education Registry
              </h1>
              <p className="text-sm sm:text-base text-[#676963] max-w-2xl leading-relaxed m-0">
                Statutory accreditation oversight, recognized degree-granting universities, and primary regulatory provenance records.
              </p>
            </div>

            {/* Statistical Pill Card */}
            <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-5 flex items-center gap-6 shrink-0 shadow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#838383] block">Candidate HEIs</span>
                <span className="text-2xl font-bold font-mono text-[#232323] tabular-nums">
                  {country.wikidata_count}
                </span>
              </div>
              <div className="w-px h-8 bg-[#e9e9e9]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#838383] block">Deep Profiled</span>
                <span className="text-2xl font-bold font-mono text-[#164A3A] tabular-nums">
                  {institutions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Container ─── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Statutory Regulatory Authority Overview */}
        <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e9e9] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#232323] flex items-center gap-2 m-0">
              <ShieldCheck className="w-5 h-5 text-[#164A3A]" />
              Statutory Regulatory &amp; Accreditation Body
            </h2>
            {country.regulator_url && (
              <a
                href={country.regulator_url.split(';')[0].trim()}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#164A3A] hover:underline flex items-center gap-1.5"
              >
                Visit Official Ministry Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="text-xs sm:text-sm text-[#676963] font-sans space-y-2 leading-relaxed">
            <p className="m-0">
              <strong className="text-[#232323]">Regulatory Status: </strong>
              {country.regulator_status}
            </p>
            <p className="font-mono text-[11px] text-[#838383] m-0">
              Authority URL: {country.regulator_url || 'Official gazette archived'}
            </p>
          </div>
        </div>

        {/* Institutions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-[#232323] m-0">
              Chartered Universities in {country.country} ({institutions.length})
            </h2>
            <span className="text-xs text-[#838383] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 rounded-full">
              {institutions.length > 0 ? 'Audited institutions' : 'Ingestion ongoing'}
            </span>
          </div>

          {institutions.length === 0 ? (
            <div className="the-card bg-white border border-[#e9e9e9] rounded-none p-12 text-center space-y-3 shadow-sm">
              <BookOpen className="w-10 h-10 text-[#838383] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-[#232323] m-0">
                Full Ingestion In Progress for {country.country}
              </h3>
              <p className="text-xs sm:text-sm text-[#676963] max-w-md mx-auto m-0 leading-relaxed">
                Official national registers have been extracted and crosswalked. Deep multi-attribute profiles are staged in the verification queue.
              </p>
              <Link
                href="/admin"
                className="inline-block px-5 py-2.5 bg-[#164A3A] text-white text-xs font-semibold rounded-full mt-3 shadow-xs hover:bg-[#3442db] transition"
              >
                Inspect Governance Desk →
              </Link>
            </div>
          ) : (
            <div className="the-card border border-[#e9e9e9] bg-white rounded-none overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#f8fafc] text-[#232323] text-[11px] font-semibold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <tr>
                      <th className="py-3.5 px-5">University Name</th>
                      <th className="py-3.5 px-4">City</th>
                      <th className="py-3.5 px-4">Sector</th>
                      <th className="py-3.5 px-4 text-center">Rank</th>
                      <th className="py-3.5 px-4 text-center">Enrollment</th>
                      <th className="py-3.5 px-4 text-center">Completeness</th>
                      <th className="py-3.5 px-5 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {institutions.map(inst => {
                      const rankEntry = allRankings.find(r => r.institution_id === inst.institution_id);
                      return (
                        <tr key={inst.institution_id} className="hover:bg-[#f8fafc] transition-colors h-14">
                          <td className="py-3 px-5">
                            <Link 
                              href={`/universities/${inst.institution_id}`}
                              className="font-bold text-sm text-[#232323] hover:text-[#164A3A] transition block font-serif no-underline"
                            >
                              {inst.institution_name}
                            </Link>
                            <span className="text-[11px] text-[#838383] font-mono">{inst.institution_id}</span>
                          </td>
                          <td className="py-3 px-4 text-[#676963]">{inst.city}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] px-2.5 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] text-[#232323] rounded-full">
                              {inst.sector}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-[#164A3A] tabular-nums">
                            {rankEntry ? `#${rankEntry.rank}` : '—'}
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
                              View Dossier →
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
