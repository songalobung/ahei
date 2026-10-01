import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmqjqjmelaaglzpmityg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWpxam1lbGFhZ2x6cG1pdHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTA0NjYsImV4cCI6MjEwNjM2NjQ2Nn0.4AOYzlJ6rVgQDY2gOHhcpKwwV6gG7VROQ5v8z2aE7rY';

const supabase = createClient(supabaseUrl, supabaseKey);

const COUNTRY_TO_MACRO_REGION: Record<string, string> = {
  ke: 'east-africa', ug: 'east-africa', tz: 'east-africa', rw: 'east-africa', bi: 'east-africa',
  et: 'east-africa', so: 'east-africa', ss: 'east-africa', dj: 'east-africa', er: 'east-africa',
  sc: 'east-africa', mu: 'east-africa', km: 'east-africa', mg: 'east-africa',
  ng: 'west-africa', gh: 'west-africa', sn: 'west-africa', ci: 'west-africa', bf: 'west-africa',
  ml: 'west-africa', ne: 'west-africa', gn: 'west-africa', bj: 'west-africa', tg: 'west-africa',
  sl: 'west-africa', lr: 'west-africa', mr: 'west-africa', gm: 'west-africa', cv: 'west-africa',
  gw: 'west-africa',
  eg: 'north-africa', ma: 'north-africa', dz: 'north-africa', tn: 'north-africa', ly: 'north-africa',
  sd: 'north-africa',
  za: 'southern-africa', zw: 'southern-africa', zm: 'southern-africa', bw: 'southern-africa',
  na: 'southern-africa', mz: 'southern-africa', ao: 'southern-africa', mw: 'southern-africa',
  ls: 'southern-africa', sz: 'southern-africa',
  cm: 'central-africa', cd: 'central-africa', cg: 'central-africa', ga: 'central-africa',
  td: 'central-africa', cf: 'central-africa', gq: 'central-africa', st: 'central-africa'
};

async function seed() {
  console.log('--- Starting AHEI Database Seeding ---');

  // 1. Countries
  const countriesPath = path.resolve(__dirname, '../data/countries.json');
  const countriesRaw = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));

  console.log(`Ingesting ${countriesRaw.length} countries...`);
  const countryRows = countriesRaw.map((c: any) => ({
    iso2: c.country_iso2.toUpperCase(),
    name: c.country,
    region_id: COUNTRY_TO_MACRO_REGION[c.country_iso2.toLowerCase()] || null,
    wikidata_count: Number(c.wikidata_count) || 0,
    regulator_url: c.regulator_url || null,
    regulator_status: c.regulator_status || null,
    deep_profile_count: Number(c.deep_profile_count) || 0
  }));

  const { error: countryErr } = await supabase
    .from('countries')
    .upsert(countryRows, { onConflict: 'iso2' });

  if (countryErr) {
    console.error('Error seeding countries:', countryErr);
  } else {
    console.log('✓ Countries seeded successfully.');
  }

  // 2. Flagship Institutions
  const instPath = path.resolve(__dirname, '../data/institutions.json');
  const instRaw = JSON.parse(fs.readFileSync(instPath, 'utf8'));

  console.log(`Ingesting ${instRaw.length} institutions...`);
  const instRows = instRaw.map((inst: any) => ({
    id: inst.institution_id,
    slug: inst.institution_id.toLowerCase(),
    name: inst.institution_name,
    name_local: inst.institution_name_local || null,
    country_iso2: inst.country_iso2.toUpperCase(),
    city: inst.city || 'Flagship Campus',
    region: inst.region || null,
    sector: inst.sector ? (inst.sector.charAt(0).toUpperCase() + inst.sector.slice(1).toLowerCase()) : 'Public',
    institution_type: inst.institution_type || 'university',
    coordinates_lat: inst.coordinates_lat ? Number(inst.coordinates_lat) : null,
    coordinates_lon: inst.coordinates_lon ? Number(inst.coordinates_lon) : null,
    official_website: inst.official_website || null,
    official_email: inst.official_email || null,
    official_phone: inst.official_phone || null,
    founding_year: inst.founding_year ? parseInt(inst.founding_year, 10) : null,
    regulator: inst.regulator || null,
    recognition_status: inst.recognition_status || 'accredited',
    accreditation_body: inst.accreditation_body || null,
    accreditation_status: inst.accreditation_status || 'accredited',
    wikidata_id: inst.wikidata_id || null,
    faculties_count: inst.faculties_count ? parseInt(inst.faculties_count, 10) : null,
    total_enrollment: inst.total_enrollment ? parseInt(inst.total_enrollment, 10) : null,
    tuition_local_undergrad: inst.tuition_local_undergrad || null,
    tuition_international_undergrad: inst.tuition_international_undergrad || null,
    tuition_currency: inst.tuition_currency || null,
    tuition_academic_year: inst.tuition_academic_year || null,
    research_publication_count: inst.research_publication_count ? parseInt(inst.research_publication_count, 10) : null,
    data_completeness_score: inst.data_completeness_score ? Number(inst.data_completeness_score) : 0.60,
    confidence_level: 'High',
    last_verified_date: inst.last_verified_date || '2026-09-30',
    notes: inst.notes || null
  }));

  const { error: instErr } = await supabase
    .from('universities')
    .upsert(instRows, { onConflict: 'id' });

  if (instErr) {
    console.error('Error seeding universities:', instErr);
  } else {
    console.log('✓ Universities seeded successfully.');
  }

  // 3. Initial Ranking Edition
  const editionRow = {
    id: '2027-v1-standard',
    edition_year: 2027,
    methodology_name: 'AHEI Standard Continental Index v1.0',
    weights_academic: 0.45,
    weights_research: 0.35,
    weights_governance: 0.20,
    is_published: true,
    published_at: new Date().toISOString()
  };

  const { error: editionErr } = await supabase
    .from('ranking_editions')
    .upsert([editionRow], { onConflict: 'id' });

  if (editionErr) {
    console.error('Error seeding ranking edition:', editionErr);
  } else {
    console.log('✓ Ranking edition seeded successfully.');
  }

  console.log('--- AHEI Database Seeding Complete ---');
}

seed().catch(err => {
  console.error('Fatal error seeding database:', err);
  process.exit(1);
});
