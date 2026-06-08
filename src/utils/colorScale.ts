import * as d3 from 'd3';
import { MetricKey } from '../types/occupation';

export const METRIC_CONFIG: Record<MetricKey, {
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  colorRange: string[];
  reversed: boolean;
}> = {
  ai_exposure: {
    label: 'AI Exposure',
    description: 'How much current/near-term AI reshapes core tasks. LLM-inferred estimate.',
    lowLabel: 'Resilient',
    highLabel: 'High Exposure',
    colorRange: ['#22c55e', '#86efac', '#fde047', '#f97316', '#ef4444'],
    reversed: false,
  },
  automation: {
    label: 'Automation Potential',
    description: 'Susceptibility to automation given India wage levels. LLM-inferred estimate.',
    lowLabel: 'Hard to Automate',
    highLabel: 'High Automation Risk',
    colorRange: ['#22c55e', '#86efac', '#fde047', '#f97316', '#ef4444'],
    reversed: false,
  },
  human_dependency: {
    label: 'Human Dependency',
    description: 'Degree the role requires human presence, judgment, or empathy. LLM-inferred estimate.',
    lowLabel: 'Low Human Dep.',
    highLabel: 'Highly Human',
    colorRange: ['#ef4444', '#f97316', '#fde047', '#86efac', '#22c55e'],
    reversed: true,
  },
  physical_presence: {
    label: 'Physical Presence',
    description: 'Must the work be done at a specific physical location. LLM-inferred estimate.',
    lowLabel: 'Remote Possible',
    highLabel: 'On-site Required',
    colorRange: ['#3b82f6', '#60a5fa', '#94a3b8', '#f97316', '#dc2626'],
    reversed: false,
  },
  future_demand: {
    label: 'Future Demand',
    description: 'Inferred demand trajectory (5=stable, >5=growing, <5=declining). LLM-inferred estimate.',
    lowLabel: 'Declining',
    highLabel: 'Growing',
    colorRange: ['#ef4444', '#f97316', '#94a3b8', '#86efac', '#22c55e'],
    reversed: false,
  },
};

export function getMetricColor(value: number, metric: MetricKey): string {
  const config = METRIC_CONFIG[metric];
  const scale = d3.scaleLinear<string>()
    .domain([0, 2.5, 5, 7.5, 10])
    .range(config.colorRange)
    .clamp(true);
  return scale(value);
}

export function getScoreLabel(value: number, metric: MetricKey): string {
  if (metric === 'future_demand') {
    if (value >= 7) return 'Growing';
    if (value >= 5.5) return 'Stable+';
    if (value >= 4.5) return 'Stable';
    return 'Declining';
  }
  if (value >= 7.5) return 'Very High';
  if (value >= 6) return 'High';
  if (value >= 4) return 'Medium';
  if (value >= 2.5) return 'Low';
  return 'Very Low';
}

export const DIVISION_COLORS: Record<string, string> = {
  '0': '#6366f1',
  '1': '#8b5cf6',
  '2': '#3b82f6',
  '3': '#06b6d4',
  '4': '#10b981',
  '5': '#f59e0b',
  '6': '#22c55e',
  '7': '#f97316',
  '8': '#ef4444',
  '9': '#94a3b8',
};
