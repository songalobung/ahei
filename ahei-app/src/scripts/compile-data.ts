import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const dataResearchDir = path.resolve(process.cwd(), '../data-research');
const outputDir = path.resolve(process.cwd(), 'src/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Process Batch 1, Batch 2, Batch 3
const batches = [
  'institution_deep_profiles_batch1_2026-09-30.csv',
  'institution_deep_profiles_batch2_2026-09-30.csv',
  'institution_deep_profiles_batch3_2026-09-30.csv'
];

let allInstitutions: any[] = [];
const seenIds = new Set<string>();

for (const batchFile of batches) {
  const filePath = path.join(dataResearchDir, batchFile);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
    for (const row of parsed.data as any[]) {
      if (row.institution_id && !seenIds.has(row.institution_id)) {
        seenIds.add(row.institution_id);
        allInstitutions.push(row);
      }
    }
  }
}

console.log(`Loaded ${allInstitutions.length} deep-profile institutions.`);

// 2. Generate rankings from deep profiles + quality signals
const rankings = allInstitutions.map((inst, index) => {
  const enrollment = parseInt(inst.total_enrollment || '0', 10);
  const pubs = parseInt(inst.research_publication_count || '0', 10);
  const cites = parseInt(inst.research_citation_count || '0', 10);
  const completeness = parseFloat(inst.data_completeness_score || '0.7');

  // Deterministic scoring formula following AHEI methodology
  const academicScore = Math.min(99, Math.round(60 + (enrollment > 20000 ? 20 : enrollment > 10000 ? 15 : 10) + (pubs > 1000 ? 15 : 8)));
  const researchScore = Math.min(98, Math.round(55 + (pubs > 5000 ? 25 : pubs > 1000 ? 18 : 10) + (cites > 10000 ? 15 : 5)));
  const governanceScore = Math.round(completeness * 100);

  const composite = Math.round((academicScore * 0.45) + (researchScore * 0.35) + (governanceScore * 0.20));

  return {
    institution_id: inst.institution_id,
    institution_name: inst.institution_name,
    country: inst.country,
    country_iso2: inst.country_iso2,
    region: inst.region,
    sector: inst.sector,
    composite_score: composite,
    academic_reputation_score: academicScore,
    research_impact_score: researchScore,
    governance_completeness_score: governanceScore,
    confidence_level: completeness >= 0.85 ? 'High' : completeness >= 0.70 ? 'Medium' : 'Preliminary'
  };
});

// Sort rankings descending by composite score
rankings.sort((a, b) => b.composite_score - a.composite_score);
const rankedList = rankings.map((r, i) => ({ rank: i + 1, ...r }));

// 3. Process Country Summary from coverage tracker
const countryTrackerPath = path.join(dataResearchDir, 'country_coverage_tracker.csv');
let countrySummaries: any[] = [];
if (fs.existsSync(countryTrackerPath)) {
  const content = fs.readFileSync(countryTrackerPath, 'utf-8');
  const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
  countrySummaries = (parsed.data as any[]).map(c => ({
    country: c.country,
    country_iso2: c.country_iso2,
    wikidata_count: parseInt(c.wikidata_candidate_count || '0', 10),
    regulator_url: c.official_regulator_source_url || '',
    regulator_status: c.regulator_source_status || '',
    deep_profile_count: allInstitutions.filter(inst => inst.country_iso2 === c.country_iso2).length
  }));
}

// Write to JSON files for superfast instant imports in the web app
fs.writeFileSync(path.join(outputDir, 'institutions.json'), JSON.stringify(allInstitutions, null, 2));
fs.writeFileSync(path.join(outputDir, 'rankings.json'), JSON.stringify(rankedList, null, 2));
fs.writeFileSync(path.join(outputDir, 'countries.json'), JSON.stringify(countrySummaries, null, 2));

console.log('Successfully generated JSON data seeds in src/data/');
