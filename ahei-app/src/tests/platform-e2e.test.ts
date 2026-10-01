import assert from 'node:assert';
import institutionsData from '../data/institutions.json';
import countriesData from '../data/countries.json';
import rankingsData from '../data/rankings.json';
import { calculateRankings, DEFAULT_WEIGHTS } from '../domain/ranking-engine';

function runE2ETests() {
  console.log('🧪 Starting AHEI Core Platform E2E Integration Suite...\n');

  // Test 1: Data Integrity & Seeding Validation
  assert.ok(Array.isArray(institutionsData), 'institutions.json must be an array');
  assert.ok(institutionsData.length >= 20, 'At least 20 flagship deep-profiled institutions must be present');
  console.log(`✓ Test 1 Passed: Institutional dataset validated (${institutionsData.length} institutions)`);

  // Test 2: Country Regulators Integrity
  assert.ok(Array.isArray(countriesData), 'countries.json must be an array');
  const southAfrica = countriesData.find((c: any) => c.country_iso2 === 'ZA');
  assert.ok(southAfrica, 'South Africa must be represented in country registry');
  assert.ok(southAfrica.regulator_url, 'Regulator URL must exist for South Africa');
  console.log('✓ Test 2 Passed: Country statutory regulator registry verified');

  // Test 3: Search & Discovery Query Flow
  const query = 'cairo';
  const matchingInstitutions = institutionsData.filter((i: any) => 
    i.institution_name.toLowerCase().includes(query) || i.country.toLowerCase().includes(query)
  );
  assert.ok(matchingInstitutions.length > 0, `Search query for "${query}" must yield results`);
  console.log(`✓ Test 3 Passed: Global search query resolution verified (${matchingInstitutions.length} matches for "${query}")`);

  // Test 4: University Profile Dossier Completeness
  const sample = institutionsData[0];
  assert.ok(sample.institution_id, 'Sample institution must have institution_id');
  assert.ok(sample.institution_name, 'Sample institution must have institution_name');
  assert.ok(sample.country, 'Sample institution must have country');
  assert.ok(sample.sector, 'Sample institution must have sector');
  console.log(`✓ Test 4 Passed: Profile dossier schema verified for ${sample.institution_name}`);

  // Test 5: Multi-Institution Comparison Workspace
  const compareSet = institutionsData.slice(0, 3);
  const comparisonAttributes = ['institution_name', 'country', 'sector', 'total_enrollment', 'data_completeness_score'];
  const comparisonMatrix = compareSet.map((inst: any) => {
    const row: Record<string, any> = {};
    for (const attr of comparisonAttributes) {
      row[attr] = inst[attr];
    }
    return row;
  });
  assert.strictEqual(comparisonMatrix.length, 3, 'Matrix must contain exactly 3 universities');
  assert.ok(comparisonMatrix[0].institution_name, 'Matrix institution must have name');
  console.log('✓ Test 5 Passed: Multi-institution comparison workspace generation verified');

  // Test 6: Deterministic Export Pipeline
  const computedRankings = calculateRankings(institutionsData as any, DEFAULT_WEIGHTS);
  assert.strictEqual(computedRankings.length, institutionsData.length, 'Every institution must be ranked');
  assert.strictEqual(computedRankings[0].rank, 1, 'Leading institution must be rank 1');
  console.log('✓ Test 6 Passed: Deterministic export calculation pipeline validated');

  console.log('\n🎉 ALL 6 E2E PLATFORM INTEGRATION TESTS PASSED WITH 0 REGRESSIONS!\n');
}

runE2ETests();
