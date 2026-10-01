import { NextRequest, NextResponse } from 'next/server';
import { universitiesRepository } from '@/domain/repositories';
import { calculateRankings, DEFAULT_WEIGHTS, RankingWeights } from '@/domain/ranking-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const sector = searchParams.get('sector');
  const academicWeight = searchParams.get('academicScale');
  const researchWeight = searchParams.get('researchImpact');
  const govWeight = searchParams.get('governanceCompleteness');

  const institutions = universitiesRepository.getAll();

  const weights: RankingWeights = {
    academicScale: academicWeight ? parseFloat(academicWeight) : DEFAULT_WEIGHTS.academicScale,
    researchImpact: researchWeight ? parseFloat(researchWeight) : DEFAULT_WEIGHTS.researchImpact,
    governanceCompleteness: govWeight ? parseFloat(govWeight) : DEFAULT_WEIGHTS.governanceCompleteness,
  };

  let rankings = calculateRankings(institutions, weights);

  if (region && region !== 'all') {
    rankings = rankings.filter(r => r.region.toLowerCase() === region.toLowerCase());
  }

  if (sector && sector !== 'all') {
    rankings = rankings.filter(r => r.sector.toLowerCase() === sector.toLowerCase());
  }

  return NextResponse.json({
    edition: '2026/2027 Continental Release',
    audit_date: '2026-09-30',
    weights_applied: weights,
    total_evaluated: rankings.length,
    rankings,
  });
}
