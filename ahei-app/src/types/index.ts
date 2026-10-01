export interface Institution {
  institution_id: string;
  country: string;
  country_iso2: string;
  institution_name: string;
  institution_name_local?: string;
  institution_type?: string;
  sector: string;
  city: string;
  region: string;
  coordinates_lat?: number | string;
  coordinates_lon?: number | string;
  official_website?: string;
  official_email?: string;
  official_phone?: string;
  founding_year?: number | string;
  regulator?: string;
  recognition_status?: string;
  recognition_scope?: string;
  accreditation_body?: string;
  accreditation_status?: string;
  wikidata_id?: string;
  faculties_count?: number | string;
  departments_count?: number | string;
  programs_undergraduate?: number | string;
  programs_postgraduate?: number | string;
  programs_doctoral?: number | string;
  total_enrollment?: number | string;
  undergraduate_enrollment?: number | string;
  postgraduate_enrollment?: number | string;
  tuition_local_undergrad?: string;
  tuition_international_undergrad?: string;
  tuition_currency?: string;
  tuition_academic_year?: string;
  admission_deadline_fall?: string;
  admission_deadline_spring?: string;
  admission_requirements?: string;
  scholarships_available?: string;
  research_publication_count?: number | string;
  research_citation_count?: number | string;
  h_index?: number | string;
  source_url?: string;
  source_accessed_date?: string;
  data_completeness_score: number | string;
  last_verified_date?: string;
  notes?: string;
}

export interface CountrySummary {
  country: string;
  country_iso2: string;
  wikidata_count: number;
  regulator_url: string;
  regulator_status: string;
  deep_profile_count: number;
}

export interface RankingEntry {
  rank: number;
  previous_rank?: number;
  projected_rank_next_year?: number;
  projected_rank_delta?: number;
  projected_score_next_year?: number;
  trajectory?: 'Surging' | 'Advancing' | 'Consolidating' | 'At Risk';
  momentum_velocity?: number;
  institution_id: string;
  institution_name: string;
  country: string;
  country_iso2: string;
  region: string;
  sector: string;
  composite_score: number;
  academic_reputation_score: number;
  research_impact_score: number;
  governance_completeness_score: number;
  confidence_score?: number;
  confidence_level: 'High' | 'Medium' | 'Preliminary';
  audit_certification?: string;
}
