import { useState, useMemo } from 'react';
import { STATES, StateData } from '../data/statesData';
import { OccupationData } from '../types/occupation';

interface Props {
  activeState: StateData | null;
  onSelectState: (s: StateData | null) => void;
  filtered: OccupationData[];
  hasActiveFilters: boolean;
}

type SortKey = 'high_risk_pct' | 'filteredWorkforce' | 'filteredHighRisk' | 'filteredDirectTax';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'high_risk_pct',      label: '% High Risk' },
  { key: 'filteredWorkforce',  label: 'Filtered Workers' },
  { key: 'filteredHighRisk',   label: 'High Risk (filtered)' },
  { key: 'filteredDirectTax',  label: 'Direct Tax (filtered)' },
];

export default function StatePanel({ activeState, onSelectState, filtered, hasActiveFilters }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('high_risk_pct');

  // Compute live metrics per state from filtered occupations
  const stateMetrics = useMemo(() => {
    return STATES.map(st => {
      const stateOccs = filtered.filter(o => st.dominant_divisions.includes(o.division_code));
      const filteredWorkforce = stateOccs.reduce((s, o) => s + o.workforce_million, 0);
      const filteredHighRisk = stateOccs.filter(o => o.ai_risk_tier === 'high').reduce((s, o) => s + o.workforce_million, 0);
      const filteredDirectTax = stateOccs.filter(o => o.tax_contributor_tier === 'direct_tax').reduce((s, o) => s + o.workforce_million, 0);
      const filteredGST = stateOccs.filter(o => o.tax_contributor_tier === 'indirect_gst').reduce((s, o) => s + o.workforce_million, 0);
      return { ...st, filteredWorkforce, filteredHighRisk, filteredDirectTax, filteredGST };
    });
  }, [filtered]);

  const sorted = [...stateMetrics].sort((a, b) => b[sortKey] - a[sortKey]);
  const totalFiltered = stateMetrics.reduce((s, st) => s + st.filteredWorkforce, 0);

  return (
    <div className="state-panel">
      {/* Panel header */}
      <div className="sp-header">
        <span className="sp-title">State Risk Ranking</span>
        <span className="sp-note">⚠ Est. ±30%</span>
      </div>

      {/* Sort control */}
      <div className="sp-sort">
        <span className="sp-sort-label">Sort:</span>
        <select className="sp-sort-select" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* National reference */}
      <div className="sp-national">
        <div className="sp-nat-row">
          <span className="sp-nat-label">🇮🇳 All India</span>
          <span className="sp-nat-val" style={{ color: hasActiveFilters ? '#93c5fd' : undefined }}>
            {totalFiltered.toFixed(1)}M {hasActiveFilters ? 'filtered' : 'total'}
          </span>
        </div>
        <div className="sp-risk-bar">
          <div className="sp-risk-seg sp-seg-high" style={{ width: '6.1%' }} />
          <div className="sp-risk-seg sp-seg-medium" style={{ width: '17.4%' }} />
          <div className="sp-risk-seg sp-seg-low" style={{ width: '76.5%' }} />
        </div>
        <div className="sp-bar-labels">
          <span style={{ color: '#f87171' }}>6.1% high</span>
          <span style={{ color: '#fbbf24' }}>17.4% med</span>
          <span style={{ color: '#4ade80' }}>76.5% low</span>
        </div>
      </div>

      {/* Clear state button */}
      {activeState && (
        <button className="sp-clear" onClick={() => onSelectState(null)}>
          ✕ Clear: {activeState.name}
        </button>
      )}

      {/* State list */}
      <div className="sp-list">
        {sorted.map((st, i) => {
          const isActive = activeState?.code === st.code;
          const hasData = st.filteredWorkforce > 0;
          return (
            <div
              key={st.code}
              className={`sp-row${isActive ? ' sp-row-active' : ''}${!hasData ? ' sp-row-dim' : ''}`}
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
                <div className="sp-risk-seg sp-seg-high" style={{ width: `${st.high_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-medium" style={{ width: `${st.medium_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-low" style={{ width: `${st.low_risk_pct}%` }} />
              </div>

              <div className="sp-stats">
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#f87171' }}>
                    {hasActiveFilters ? st.filteredHighRisk.toFixed(1) : st.high_risk_million.toFixed(1)}M
                  </span>
                  <span className="sp-stat-lbl"> high</span>
                </span>
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#60a5fa' }}>
                    {hasActiveFilters ? st.filteredDirectTax.toFixed(1) : st.direct_tax_million.toFixed(1)}M
                  </span>
                  <span className="sp-stat-lbl"> tax</span>
                </span>
                <span className="sp-stat sp-total">
                  {hasActiveFilters ? `${st.filteredWorkforce.toFixed(1)}M` : `${st.workforce_million.toFixed(0)}M`} total
                </span>
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
