export type MetricKey = 'ai_exposure' | 'automation' | 'human_dependency' | 'physical_presence' | 'future_demand';

export interface ScoreSet {
  ai_exposure: number;
  automation: number;
  human_dependency: number;
  physical_presence: number;
  future_demand: number;
  label: string;
}

export type TaxTier = 'direct_tax' | 'indirect_gst' | 'non_contributor';

export interface OccupationData {
  code: string;
  name: string;
  description: string;
  division_code: string;
  division_name: string;
  sector: string;
  workforce_million: number;
  workforce_note: string;
  median_monthly_earnings_inr: number | null;
  earnings_note: string;
  formal_share_pct: number;
  urban_share_pct: number;
  scores: ScoreSet;
  fiscal_significance: 'high' | 'medium' | 'low';
  ai_risk_tier: 'high' | 'medium' | 'low';
  tax_contributor_tier: TaxTier;
  tax_contributor_label: string;
  tax_contributor_note: string;
  nco2015_examples: string[];
  key_skills: string[];
  color?: string;
}

export interface Division {
  code: string;
  name: string;
  color: string;
  description: string;
  total_workforce_million?: number;
}

export interface DatasetMetadata {
  version: string;
  generated: string;
  plfs_year: string;
  nco_taxonomy: string;
  total_workforce_million: number;
  sources: string[];
  caveats: string[];
}

export interface Dataset {
  metadata: DatasetMetadata;
  divisions: Division[];
  occupations: OccupationData[];
}

export interface FilterState {
  sectors: string[];
  ai_risk_tiers: string[];
  formality: 'all' | 'formal' | 'informal';
  min_workforce: number;
  max_workforce: number;
  division_codes: string[];
}

export interface TreemapNode {
  data: OccupationData;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  depth: number;
  value: number;
}
