import { Institution, RankingEntry } from '@/types';

export interface RankingWeights {
  academicScale: number;          // Default: 0.45
  researchImpact: number;         // Default: 0.35
  governanceCompleteness: number; // Default: 0.20
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  academicScale: 0.45,
  researchImpact: 0.35,
  governanceCompleteness: 0.20,
};

export interface CalculatedRankResult extends RankingEntry {
  confidence_score: number;
  data_freshness_status: 'recent' | 'provisional' | 'stale';
}

/**
 * Pure, deterministic scoring function.
 * Normalizes metrics across inputs and applies versioned indicator weights.
 */
export function calculateRankings(
  institutions: Institution[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): CalculatedRankResult[] {
  if (!institutions || institutions.length === 0) return [];

  // 1. Calculate max benchmarks for min-max bounding
  const maxEnrollment = Math.max(
    ...institutions.map(i => Number(i.total_enrollment) || 1),
    100000
  );

  const maxCitations = Math.max(
    ...institutions.map(i => Number(i.research_publication_count) || 1),
    20000
  );

  // 2. Score each institution deterministically
  const scored = institutions.map(inst => {
    const enrollment = Number(inst.total_enrollment) || 0;
    const pubCount = Number(inst.research_publication_count) || 0;
    const completeness = Number(inst.data_completeness_score) || 0.5;

    // Academic Reputation Score (0 - 100)
    const academicScore = Math.min(
      100,
      Math.round((enrollment / maxEnrollment) * 40 + (inst.programs_undergraduate ? 30 : 15) + (inst.sector === 'Public' ? 30 : 25))
    );

    // Research Impact Score (0 - 100)
    const researchScore = Math.min(
      100,
      Math.round((pubCount / maxCitations) * 85 + (inst.h_index ? 15 : 5))
    );

    // Governance & Provenance Score (0 - 100)
    const governanceScore = Math.min(
      100,
      Math.round(completeness * 70 + (inst.recognition_status ? 30 : 10))
    );

    // Weighted Composite Score
    const composite = (
      academicScore * weights.academicScale +
      researchScore * weights.researchImpact +
      governanceScore * weights.governanceCompleteness
    );

    // Confidence index (0 - 1)
    const confidence = Math.min(
      1,
      Number((completeness * 0.7 + (inst.source_url ? 0.3 : 0.1)).toFixed(2))
    );

    const confidenceLevel: 'High' | 'Medium' | 'Preliminary' = 
      confidence >= 0.85 ? 'High' : confidence >= 0.65 ? 'Medium' : 'Preliminary';

    const freshness: 'recent' | 'provisional' | 'stale' = 
      inst.last_verified_date && inst.last_verified_date.startsWith('2026') 
        ? 'recent' 
        : 'provisional';

    return {
      institution_id: inst.institution_id,
      institution_name: inst.institution_name,
      country: inst.country,
      country_iso2: inst.country_iso2,
      region: inst.region || 'Continental',
      sector: inst.sector,
      composite_score: Number(composite.toFixed(1)),
      academic_reputation_score: academicScore,
      research_impact_score: researchScore,
      governance_completeness_score: governanceScore,
      confidence_score: confidence,
      confidence_level: confidenceLevel,
      data_freshness_status: freshness,
      rank: 0,
    };
  });

  // 3. Sort deterministically: highest score first; ties broken by research then alphabetical
  scored.sort((a, b) => {
    if (b.composite_score !== a.composite_score) {
      return b.composite_score - a.composite_score;
    }
    if (b.research_impact_score !== a.research_impact_score) {
      return b.research_impact_score - a.research_impact_score;
    }
    return a.institution_name.localeCompare(b.institution_name);
  });

  // 4. Assign sequential integer ranks
  return scored.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * AHEI Next-Year Intelligent Ranking & Predictive Model (AHEI-NYPM v1.0)
 * Evaluates current baseline indicators and projects next-year score trajectory,
 * compound publication velocity, accreditation momentum, and deterministic rank shift.
 */
export function calculateNextYearPredictiveRankings(
  institutions: Institution[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): CalculatedRankResult[] {
  const currentRanked = calculateRankings(institutions, weights);
  if (currentRanked.length === 0) return [];

  // Compute momentum velocity and next-year score projection
  const projectedList = currentRanked.map(inst => {
    const researchVelocity = Number(((inst.research_impact_score / 100) * 2.4).toFixed(2));
    const institutionalVelocity = Number((Math.min(2.0, (inst.confidence_score * 1.5))).toFixed(2));
    const momentumVelocity = Number((researchVelocity + institutionalVelocity * 0.6).toFixed(2));
    const projectedScore = Number(Math.min(99.4, inst.composite_score + momentumVelocity).toFixed(1));

    return {
      ...inst,
      momentum_velocity: momentumVelocity,
      projected_score_next_year: projectedScore,
      audit_certification: `AU-AHEI-2027-${inst.country_iso2}-${inst.institution_id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`
    };
  });

  // Re-sort to establish next year projected ranks
  const sortedNextYear = [...projectedList].sort((a, b) => 
    b.projected_score_next_year - a.projected_score_next_year ||
    b.research_impact_score - a.research_impact_score ||
    a.institution_name.localeCompare(b.institution_name)
  );

  const projectedRankMap = new Map<string, number>();
  sortedNextYear.forEach((item, idx) => {
    projectedRankMap.set(item.institution_id, idx + 1);
  });

  return projectedList.map(item => {
    const projectedRank = projectedRankMap.get(item.institution_id) || item.rank;
    const delta = item.rank - projectedRank;
    const trajectory: 'Surging' | 'Advancing' | 'Consolidating' | 'At Risk' = 
      delta >= 3 ? 'Surging' : delta >= 1 ? 'Advancing' : delta === 0 ? 'Consolidating' : 'At Risk';

    return {
      ...item,
      projected_rank_next_year: projectedRank,
      projected_rank_delta: delta,
      trajectory,
    };
  });
}

