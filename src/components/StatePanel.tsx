import { useState, useMemo } from 'react';
import { STATES, StateData } from '../data/statesData';
import { OccupationData } from '../types/occupation';

interface Props {
  activeState: StateData | null;
  onSelectState: (s: StateData | null) => void;
  filtered: OccupationData[];
  hasActiveFilters: boolean;
}

type SortKey = 'high_risk_pct' | 'high_risk_million' | 'direct_tax_million' | 'workforce_million';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'high_risk_pct',      label: '% High Risk' },
  { key: 'high_risk_million',  label: 'High Risk Workers' },
  { key: 'direct_tax_million', label: 'Direct Tax at Risk' },
  { key: 'workforce_million',  label: 'Total Workforce' },
];

export default function StatePanel({ activeState, onSelectState, filtered, hasActiveFilters }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('high_risk_pct');

  // When filters active: compute what % of filtered occupations overlap with each state's dominant divisions
  // This shows "relevance" without double-counting workforce
  const relevanceMap = useMemo(() => {
    if (!hasActiveFilters) return null;
    const filteredDivisions = new Set(filtered.map(o => o.division_code));
    const map: Record<string, number> = {};
    for (const st of STATES) {
      const overlap = st.dominant_divisions.filter(d => filteredDivisions.has(d)).length;
      map[st.code] = overlap / st.dominant_divisions.length; // 0–1
    }
    return map;
  }, [filtered, hasActiveFilters]);

  const sorted = [...STATES].sort((a, b) => b[sortKey] - a[sortKey]);

  const nationalTotal = STATES.reduce((s, st) => s + st.workforce_million, 0);
  const nationalHigh  = STATES.reduce((s, st) => s + st.high_risk_million, 0);
  const nationalTax   = STATES.reduce((s, st) => s + st.direct_tax_million, 0);

  return (
    <div className="state-panel">
      {/* Header */}
      <div className="sp-header">
        <span className="sp-title">State Risk Ranking</span>
        <span className="sp-note">⚠ Est. ±30%</span>
      </div>

      {/* Sort */}
      <div className="sp-sort">
        <span className="sp-sort-label">Sort:</span>
        <select className="sp-sort-select" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* All India reference row */}
      <div className="sp-national">
        <div className="sp-nat-row">
          <span className="sp-nat-label">🇮🇳 All India</span>
          <span className="sp-nat-val">{nationalTotal.toFixed(0)}M workers</span>
        </div>
        <div className="sp-risk-bar" style={{ marginBottom: 3 }}>
          <div className="sp-risk-seg sp-seg-high"   style={{ width: '6.1%' }} title="High: 37.8M" />
          <div className="sp-risk-seg sp-seg-medium" style={{ width: '17.4%' }} title="Medium: 108M" />
          <div className="sp-risk-seg sp-seg-low"    style={{ width: '76.5%' }} title="Low: 476M" />
        </div>
        <div className="sp-bar-labels">
          <span style={{ color: '#f87171' }}>{nationalHigh.toFixed(0)}M high</span>
          <span style={{ color: '#60a5fa' }}>{nationalTax.toFixed(0)}M tax</span>
        </div>
        {hasActiveFilters && (
          <div className="sp-filter-note">↑ State totals are pre-computed. Shading shows filter relevance.</div>
        )}
      </div>

      {/* Clear button */}
      {activeState && (
        <button className="sp-clear" onClick={() => onSelectState(null)}>
          ✕ Clear: {activeState.name}
        </button>
      )}

      {/* State list */}
      <div className="sp-list">
        {sorted.map((st, i) => {
          const isActive = activeState?.code === st.code;
          const relevance = relevanceMap ? relevanceMap[st.code] : 1;
          const dimmed = hasActiveFilters && relevance === 0;

          return (
            <div
              key={st.code}
              className={`sp-row${isActive ? ' sp-row-active' : ''}${dimmed ? ' sp-row-dim' : ''}`}
              style={hasActiveFilters && relevance > 0 && !isActive
                ? { background: `rgba(59,130,246,${relevance * 0.08})` }
                : undefined}
              onClick={() => onSelectState(isActive ? null : st)}
            >
              <div className="sp-row-top">
                <span className="sp-rank">#{i + 1}</span>
                <div className="sp-name-wrap">
                  <span className="sp-name">{st.name}</span>
                  <span className="sp-profile">{st.economic_profile}</span>
                </div>
                <span className="sp-high-pct" style={{ color: st.high_risk_pct > 12 ? '#f87171' : st.high_risk_pct > 8 ? '#fbbf24' : '#94a3b8' }}>
                  {st.high_risk_pct.toFixed(1)}%
                </span>
              </div>

              <div className="sp-risk-bar">
                <div className="sp-risk-seg sp-seg-high"   style={{ width: `${st.high_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-medium" style={{ width: `${st.medium_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-low"    style={{ width: `${st.low_risk_pct}%` }} />
              </div>

              <div className="sp-stats">
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#f87171' }}>{st.high_risk_million.toFixed(1)}M</span>
                  <span className="sp-stat-lbl"> high</span>
                </span>
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#60a5fa' }}>{st.direct_tax_million.toFixed(1)}M</span>
                  <span className="sp-stat-lbl"> tax</span>
                </span>
                <span className="sp-stat sp-total">{st.workforce_million.toFixed(0)}M</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sp-footer">
        PLFS 2023-24 · 20 states · modelled ±30%
      </div>
    </div>
  );
}
