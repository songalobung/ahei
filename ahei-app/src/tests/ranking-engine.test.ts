import assert from 'node:assert';
import { calculateRankings, calculateNextYearPredictiveRankings, DEFAULT_WEIGHTS, RankingWeights } from '../domain/ranking-engine';
import { Institution } from '../types';

const mockInstitutions: Institution[] = [
  {
    institution_id: 'TEST-U1',
    institution_name: 'Alpha University',
    country: 'Kenya',
    country_iso2: 'KE',
    city: 'Nairobi',
    region: 'East Africa',
    sector: 'Public',
    total_enrollment: 50000,
    research_publication_count: 5000,
    data_completeness_score: 0.90,
    recognition_status: 'accredited',
    source_url: 'https://alpha.ac.ke',
    last_verified_date: '2026-09-30'
  },
  {
    institution_id: 'TEST-U2',
    institution_name: 'Beta University',
    country: 'South Africa',
    country_iso2: 'ZA',
    city: 'Cape Town',
    region: 'Southern Africa',
    sector: 'Public',
    total_enrollment: 30000,
    research_publication_count: 15000,
    data_completeness_score: 0.95,
    recognition_status: 'accredited',
    source_url: 'https://beta.ac.za',
    last_verified_date: '2026-09-30'
  },
  {
    institution_id: 'TEST-U3',
    institution_name: 'Gamma College',
    country: 'Ghana',
    country_iso2: 'GH',
    city: 'Accra',
    region: 'West Africa',
    sector: 'Private',
    total_enrollment: 5000,
    research_publication_count: 500,
    data_completeness_score: 0.70,
    recognition_status: 'chartered',
    last_verified_date: '2025-05-15'
  }
];

function runTests() {
  console.log('🧪 Starting AHEI Deterministic & Predictive Ranking Engine Tests...\n');

  // Test 1: Empty input returns empty array
  const emptyResult = calculateRankings([]);
  assert.strictEqual(emptyResult.length, 0, 'Empty input must return empty array');
  console.log('✓ Test 1 Passed: Empty input handling');

  // Test 2: Reproducibility across multiple invocations
  const run1 = calculateRankings(mockInstitutions, DEFAULT_WEIGHTS);
  const run2 = calculateRankings(mockInstitutions, DEFAULT_WEIGHTS);
  assert.deepStrictEqual(run1, run2, 'Ranking calculations must be strictly deterministic with 0 delta');
  console.log('✓ Test 2 Passed: 100% Deterministic reproducibility');

  // Test 3: Standard weights calculation produces correct sequential integer ranks
  assert.strictEqual(run1.length, 3, 'All institutions must be scored');
  assert.strictEqual(run1[0].rank, 1, 'Top institution must have rank 1');
  assert.strictEqual(run1[1].rank, 2, 'Second institution must have rank 2');
  assert.strictEqual(run1[2].rank, 3, 'Third institution must have rank 3');
  console.log('✓ Test 3 Passed: Sequential integer rank assignment');

  // Test 4: Dynamic weights change rank outcomes correctly
  const researchHeavyWeights: RankingWeights = {
    academicScale: 0.10,
    researchImpact: 0.80,
    governanceCompleteness: 0.10
  };
  const researchResults = calculateRankings(mockInstitutions, researchHeavyWeights);
  assert.strictEqual(researchResults[0].institution_id, 'TEST-U2', 'High-citation institution must rank first under research-heavy model');
  console.log('✓ Test 4 Passed: Dynamic weight sensitivity & responsiveness');

  // Test 5: Freshness and Confidence tags are assigned correctly
  assert.strictEqual(run1[0].data_freshness_status, 'recent', '2026 verified data must be tagged recent');
  assert.strictEqual(run1[2].data_freshness_status, 'provisional', 'Pre-2026 data must be tagged provisional');
  assert.strictEqual(run1[0].confidence_level, 'High', 'High completeness must produce High confidence');
  console.log('✓ Test 5 Passed: Data freshness & confidence bounding');

  // Test 6: Deterministic tie-breaking on identical scores
  const tieA: Institution = { ...mockInstitutions[0], institution_id: 'TIE-A', institution_name: 'AAA University' };
  const tieB: Institution = { ...mockInstitutions[0], institution_id: 'TIE-B', institution_name: 'ZZZ University' };
  const tieResults = calculateRankings([tieB, tieA], DEFAULT_WEIGHTS);
  assert.strictEqual(tieResults[0].institution_name, 'AAA University', 'Tied scores must resolve alphabetically by institution name');
  console.log('✓ Test 6 Passed: Deterministic alphabetical tie-breaking');

  // Test 7: Next-Year Predictive Ranking Model (AHEI-NYPM v1.0)
  const predictiveResults = calculateNextYearPredictiveRankings(mockInstitutions, DEFAULT_WEIGHTS);
  assert.strictEqual(predictiveResults.length, 3, 'All institutions must receive next-year projections');
  predictiveResults.forEach(r => {
    const projRank = r.projected_rank_next_year ?? 0;
    assert.ok(projRank >= 1 && projRank <= 3, 'Projected ranks must be bounded');
    assert.ok(typeof r.projected_score_next_year === 'number', 'Projected score must be numeric');
    assert.ok(typeof r.momentum_velocity === 'number', 'Momentum velocity must be numeric');
    assert.ok(['Surging', 'Advancing', 'Consolidating', 'At Risk'].includes(r.trajectory as string), 'Trajectory must be valid classification');
    assert.ok(r.audit_certification?.startsWith('AU-AHEI-2027'), 'Audit certification must follow statutory format');
  });
  console.log('✓ Test 7 Passed: Next-Year predictive projection & certification assignment');

  // Test 8: Deterministic sequential next-year ranks (no duplicate ranks)
  const nextRanks = predictiveResults.map(r => r.projected_rank_next_year ?? 0).sort((a, b) => a - b);
  assert.deepStrictEqual(nextRanks, [1, 2, 3], 'Next-year projected ranks must form a contiguous sequence 1..N');
  console.log('✓ Test 8 Passed: Next-year rank sequence integrity');

  console.log('\n🎉 ALL 8 RANKING & PREDICTIVE MODEL TESTS PASSED SUCCESSFULLY!');
}

runTests();
