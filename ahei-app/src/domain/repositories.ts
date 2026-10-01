import institutionsData from '@/data/institutions.json';
import rankingsData from '@/data/rankings.json';
import countriesData from '@/data/countries.json';
import { Institution, RankingEntry, CountrySummary } from '@/types';

export const COUNTRY_TO_MACRO_REGION: Record<string, string> = {
  // East Africa
  ke: 'east-africa', ug: 'east-africa', tz: 'east-africa', rw: 'east-africa', bi: 'east-africa',
  et: 'east-africa', so: 'east-africa', ss: 'east-africa', dj: 'east-africa', er: 'east-africa',
  sc: 'east-africa', mu: 'east-africa', km: 'east-africa', mg: 'east-africa',

  // West Africa
  ng: 'west-africa', gh: 'west-africa', sn: 'west-africa', ci: 'west-africa', bf: 'west-africa',
  ml: 'west-africa', ne: 'west-africa', gn: 'west-africa', bj: 'west-africa', tg: 'west-africa',
  sl: 'west-africa', lr: 'west-africa', mr: 'west-africa', gm: 'west-africa', cv: 'west-africa',
  gw: 'west-africa',

  // North Africa
  eg: 'north-africa', ma: 'north-africa', dz: 'north-africa', tn: 'north-africa', ly: 'north-africa',
  sd: 'north-africa',

  // Southern Africa
  za: 'southern-africa', zw: 'southern-africa', zm: 'southern-africa', bw: 'southern-africa',
  na: 'southern-africa', mz: 'southern-africa', ao: 'southern-africa', mw: 'southern-africa',
  ls: 'southern-africa', sz: 'southern-africa',

  // Central Africa
  cm: 'central-africa', cd: 'central-africa', cg: 'central-africa', ga: 'central-africa',
  td: 'central-africa', cf: 'central-africa', gq: 'central-africa', st: 'central-africa'
};

export const universitiesRepository = {
  getAll: (): Institution[] => {
    return institutionsData as unknown as Institution[];
  },

  getById: (id: string): Institution | undefined => {
    const list = institutionsData as unknown as Institution[];
    const normalized = id.toLowerCase().trim();
    return list.find(inst => 
      inst.institution_id.toLowerCase() === normalized ||
      inst.institution_id.toLowerCase().includes(normalized) ||
      inst.institution_name.toLowerCase().includes(normalized) ||
      (normalized === 'uon' && inst.institution_id === 'KE-UON-001') ||
      (normalized === 'ku' && inst.institution_id === 'KE-KU-002') ||
      (normalized === 'uct' && inst.institution_id === 'ZA-UCT-003') ||
      (normalized === 'legon' && inst.institution_id === 'GH-UG-004') ||
      (normalized === 'unilag' && inst.institution_id === 'NG-UNILAG-005') ||
      (normalized === 'cairo' && inst.institution_id === 'EG-CU-006') ||
      (normalized === 'udsm' && inst.institution_id === 'TZ-UDSM-007') ||
      (normalized === 'mak' && inst.institution_id === 'UG-MAK-008') ||
      (normalized === 'wits' && inst.institution_id === 'ZA-WITS-009') ||
      (normalized === 'aau' && inst.institution_id === 'ET-AAU-010') ||
      (normalized === 'ibadan' && inst.institution_id === 'NG-UI-011') ||
      (normalized === 'ur' && inst.institution_id === 'RW-UR-012') ||
      (normalized === 'ucad' && inst.institution_id === 'SN-UCAD-013') ||
      (normalized === 'um5' && inst.institution_id === 'MA-UM5-014') ||
      (normalized === 'jkuat' && inst.institution_id === 'KE-JKUAT-015') ||
      (normalized === 'moi' && inst.institution_id === 'KE-MOI-016') ||
      (normalized === 'strathmore' && inst.institution_id === 'KE-STRATH-017') ||
      (normalized === 'stell' && inst.institution_id === 'ZA-SU-018') ||
      (normalized === 'up' && inst.institution_id === 'ZA-UP-019') ||
      (normalized === 'covenant' && inst.institution_id === 'NG-CU-020')
    );
  },

  getByCountry: (countryIso2: string): Institution[] => {
    return (institutionsData as unknown as Institution[]).filter(inst => inst.country_iso2.toLowerCase() === countryIso2.toLowerCase());
  },

  getByRegionSlug: (regionSlug: string): Institution[] => {
    return (institutionsData as unknown as Institution[]).filter(inst => {
      const mapped = COUNTRY_TO_MACRO_REGION[inst.country_iso2.toLowerCase()];
      return mapped === regionSlug.toLowerCase();
    });
  },

  search: (query: string, sector?: string, country?: string): Institution[] => {
    let results = institutionsData as unknown as Institution[];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(inst => 
        inst.institution_name.toLowerCase().includes(q) ||
        inst.country.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q)
      );
    }
    if (sector && sector !== 'all') {
      results = results.filter(inst => inst.sector.toLowerCase() === sector.toLowerCase());
    }
    if (country && country !== 'all') {
      results = results.filter(inst => inst.country_iso2.toLowerCase() === country.toLowerCase());
    }
    return results;
  }
};

export const rankingsRepository = {
  getAll: (): RankingEntry[] => {
    return rankingsData as unknown as RankingEntry[];
  },

  getByRegion: (region: string): RankingEntry[] => {
    return (rankingsData as unknown as RankingEntry[]).filter(r => r.region.toLowerCase() === region.toLowerCase());
  },

  getByRegionSlug: (regionSlug: string): RankingEntry[] => {
    return (rankingsData as unknown as RankingEntry[]).filter(r => {
      const mapped = COUNTRY_TO_MACRO_REGION[r.country_iso2.toLowerCase()];
      return mapped === regionSlug.toLowerCase();
    });
  }
};

export const countriesRepository = {
  getAll: (): CountrySummary[] => {
    return countriesData as unknown as CountrySummary[];
  },

  getByIso2: (iso2: string): CountrySummary | undefined => {
    return (countriesData as unknown as CountrySummary[]).find(
      c => c.country_iso2.toLowerCase() === iso2.toLowerCase()
    );
  },

  getByRegionSlug: (regionSlug: string): CountrySummary[] => {
    return (countriesData as unknown as CountrySummary[]).filter(c => {
      const mapped = COUNTRY_TO_MACRO_REGION[c.country_iso2.toLowerCase()];
      return mapped === regionSlug.toLowerCase();
    });
  }
};
