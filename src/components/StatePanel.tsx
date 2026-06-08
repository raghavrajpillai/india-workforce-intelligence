import { useState, useMemo } from 'react';
import { STATES, StateData } from '../data/statesData';
import { OccupationData } from '../types/occupation';

interface Props {
  activeState: StateData | null;
  onSelectState: (s: StateData | null) => void;
  filtered: OccupationData[];
  hasActiveFilters: boolean;
  totalWorkforce: number;
}

export default function StatePanel({ activeState, onSelectState, filtered, hasActiveFilters, totalWorkforce }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  // Compute relevance per state from filtered occupations
  const relevanceMap = useMemo(() => {
    const filteredDivisions = new Set(filtered.map(o => o.division_code));
    const map: Record<string, number> = {};
    for (const st of STATES) {
      const overlap = st.dominant_divisions.filter(d => filteredDivisions.has(d)).length;
      map[st.code] = overlap / st.dominant_divisions.length; // 0–1
    }
    return map;
  }, [filtered]);

  // Sort: when filters active → by relevance desc, then by high_risk_million
  // When no filters → by workforce_million desc
  const sorted = useMemo(() => {
    return [...STATES].sort((a, b) => {
      if (hasActiveFilters) {
        const rDiff = relevanceMap[b.code] - relevanceMap[a.code];
        if (rDiff !== 0) return rDiff;
        return b.high_risk_million - a.high_risk_million;
      }
      return b.workforce_million - a.workforce_million;
    });
  }, [hasActiveFilters, relevanceMap]);

  // Split into impacted vs not impacted when filters active
  const impacted    = hasActiveFilters ? sorted.filter(st => relevanceMap[st.code] > 0) : sorted;
  const notImpacted = hasActiveFilters ? sorted.filter(st => relevanceMap[st.code] === 0) : [];

  const nationalHigh = STATES.reduce((s, st) => s + st.high_risk_million, 0);
  const nationalTax  = STATES.reduce((s, st) => s + st.direct_tax_million, 0);

  if (collapsed) {
    return (
      <div className="state-panel state-panel-collapsed" onClick={() => setCollapsed(false)} title="Expand State Risk Ranking">
        <div className="sp-collapsed-content">
          <span className="sp-collapsed-label">STATE RISK</span>
          {activeState && <span className="sp-collapsed-active">● {activeState.name}</span>}
          <span className="sp-collapsed-arrow">›</span>
        </div>
      </div>
    );
  }

  const renderRow = (st: StateData, i: number, dimmed: boolean) => {
    const isActive = activeState?.code === st.code;
    const relevance = relevanceMap[st.code];
    return (
      <div
        key={st.code}
        className={`sp-row${isActive ? ' sp-row-active' : ''}${dimmed ? ' sp-row-dim' : ''}`}
        style={!dimmed && hasActiveFilters && relevance > 0 && !isActive
          ? { background: `rgba(59,130,246,${relevance * 0.1})` }
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
  };

  return (
    <div className="state-panel">
      {/* Header */}
      <div className="sp-header">
        <span className="sp-title">State Risk Ranking</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="sp-note">⚠ Est. ±30%</span>
          <button className="sp-collapse-btn" onClick={() => setCollapsed(true)} title="Collapse">‹</button>
        </div>
      </div>

      {/* All India reference */}
      <div className="sp-national">
        <div className="sp-nat-row">
          <span className="sp-nat-label">🇮🇳 All India</span>
          <span className="sp-nat-val">{totalWorkforce.toFixed(0)}M workers</span>
        </div>
        <div className="sp-risk-bar" style={{ marginBottom: 3 }}>
          <div className="sp-risk-seg sp-seg-high"   style={{ width: '6.1%' }} />
          <div className="sp-risk-seg sp-seg-medium" style={{ width: '17.4%' }} />
          <div className="sp-risk-seg sp-seg-low"    style={{ width: '76.5%' }} />
        </div>
        <div className="sp-bar-labels">
          <span style={{ color: '#f87171' }}>{nationalHigh.toFixed(0)}M high</span>
          <span style={{ color: '#60a5fa' }}>{nationalTax.toFixed(0)}M tax</span>
        </div>
      </div>

      {/* Clear button */}
      {activeState && (
        <button className="sp-clear" onClick={() => onSelectState(null)}>
          ✕ Clear: {activeState.name}
        </button>
      )}

      {/* State list */}
      <div className="sp-list">
        {hasActiveFilters && impacted.length > 0 && (
          <div className="sp-section-label sp-section-impacted">
            ▲ Impacted ({impacted.length} states)
          </div>
        )}
        {impacted.map((st, i) => renderRow(st, i + 1, false))}

        {hasActiveFilters && notImpacted.length > 0 && (
          <div className="sp-section-label sp-section-not-impacted">
            ▼ Less Affected ({notImpacted.length} states)
          </div>
        )}
        {notImpacted.map((st, i) => renderRow(st, impacted.length + i + 1, true))}
      </div>

      <div className="sp-footer">
        PLFS 2023-24 · 20 of 36 states/UTs · modelled ±30%
      </div>
    </div>
  );
}
