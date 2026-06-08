export function formatWorkforce(million: number): string {
  if (million >= 100) return `${Math.round(million)}M`;
  if (million >= 10) return `${million.toFixed(1)}M`;
  if (million >= 1) return `${million.toFixed(1)}M`;
  return `${(million * 1000).toFixed(0)}K`;
}

export function formatWorkforceLong(million: number): string {
  const crore = million / 10;
  if (crore >= 1) return `${crore.toFixed(1)} Cr (${million.toFixed(1)}M)`;
  const lakh = million * 10;
  return `${lakh.toFixed(0)} Lakh`;
}

export function formatEarnings(inr: number | null): string {
  if (inr === null) return 'Data unavailable';
  if (inr >= 100000) return `₹${(inr / 100000).toFixed(1)}L/mo`;
  if (inr >= 1000) return `₹${(inr / 1000).toFixed(0)}K/mo`;
  return `₹${inr}/mo`;
}

export function formatScore(value: number): string {
  return value.toFixed(1);
}

export function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

export const METRIC_LABELS: Record<string, string> = {
  ai_exposure: 'AI Exposure',
  automation: 'Automation',
  human_dependency: 'Human Dep.',
  physical_presence: 'Physical',
  future_demand: 'Future Demand',
};
