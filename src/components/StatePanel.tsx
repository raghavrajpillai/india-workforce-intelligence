import { STATES, StateData } from '../data/statesData';

interface Props {
  activeState: StateData | null;
  onSelectState: (s: StateData | null) => void;
}

type SortKey = 'high_risk_pct' | 'high_risk_million' | 'workforce_million' | 'fiscal_exposure_pct';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'high_risk_pct',       label: '% High Risk' },
  { key: 'high_risk_million',   label: 'High Risk Workers' },
  { key: 'fiscal_exposure_pct', label: 'Fiscal Exposure' },
  { key: 'workforce_million',   label: 'Total Workforce' },
];

import { useState } from 'react';

export default function StatePanel({ activeState, onSelectState }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('high_risk_pct');

  const sorted = [...STATES].sort((a, b) => b[sortKey] - a[sortKey]);

  const totalHighRisk = STATES.reduce((s, st) => s + st.high_risk_million, 0);
  const totalFiscal = STATES.reduce((s, st) => s + st.direct_tax_million, 0);

  return (
    <div className="state-panel">
      {/* Panel header */}
      <div className="sp-header">
        <span className="sp-title">State Risk Ranking</span>
        <span className="sp-note">⚠ Estimates ±30%</span>
      </div>

      {/* Sort control */}
      <div className="sp-sort">
        <span className="sp-sort-label">Sort:</span>
        <select
          className="sp-sort-select"
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.key} value={o.key}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* National reference row */}
      <div className="sp-national">
        <div className="sp-nat-row">
          <span className="sp-nat-label">🇮🇳 All India</span>
          <span className="sp-nat-val">{totalHighRisk.toFixed(0)}M high-risk</span>
        </div>
        <div className="sp-risk-bar">
          <div className="sp-risk-seg sp-seg-high" style={{ width: '6.1%' }} title="High: 6.1%" />
          <div className="sp-risk-seg sp-seg-medium" style={{ width: '17.4%' }} title="Medium: 17.4%" />
          <div className="sp-risk-seg sp-seg-low" style={{ width: '76.5%' }} title="Low: 76.5%" />
        </div>
        <div className="sp-bar-labels">
          <span style={{ color: '#f87171' }}>6.1% high</span>
          <span style={{ color: '#fbbf24' }}>17.4% med</span>
          <span style={{ color: '#4ade80' }}>76.5% low</span>
        </div>
      </div>

      {/* Clear button if state selected */}
      {activeState && (
        <button className="sp-clear" onClick={() => onSelectState(null)}>
          ✕ Clear: {activeState.name}
        </button>
      )}

      {/* State list */}
      <div className="sp-list">
        {sorted.map((st, i) => {
          const isActive = activeState?.code === st.code;
          return (
            <div
              key={st.code}
              className={`sp-row${isActive ? ' sp-row-active' : ''}`}
              onClick={() => onSelectState(isActive ? null : st)}
            >
              {/* Rank + name */}
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

              {/* Risk bar */}
              <div className="sp-risk-bar">
                <div className="sp-risk-seg sp-seg-high" style={{ width: `${st.high_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-medium" style={{ width: `${st.medium_risk_pct}%` }} />
                <div className="sp-risk-seg sp-seg-low" style={{ width: `${st.low_risk_pct}%` }} />
              </div>

              {/* Stats row */}
              <div className="sp-stats">
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#f87171' }}>{st.high_risk_million.toFixed(1)}M</span>
                  <span className="sp-stat-lbl"> high-risk</span>
                </span>
                <span className="sp-stat">
                  <span className="sp-stat-val" style={{ color: '#60a5fa' }}>{st.direct_tax_million.toFixed(1)}M</span>
                  <span className="sp-stat-lbl"> direct tax</span>
                </span>
                <span className="sp-stat sp-total">
                  {st.workforce_million.toFixed(0)}M total
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sp-footer">
        PLFS 2023-24 · 20 major states · modelled ±30%
      </div>
    </div>
  );
}
