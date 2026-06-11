import { METRIC_CONFIG, DIVISION_COLORS } from '../utils/colorScale';
import { MetricKey } from '../types/occupation';

interface Division { code: string; name: string; }

interface Props {
  search: string; onSearch: (v: string) => void;
  metric: MetricKey; onMetric: (m: MetricKey) => void;
  activeDivisions: string[]; onToggleDivision: (c: string) => void;
  activeRisk: string[]; onToggleRisk: (r: string) => void;
  activeTax: string[]; onToggleTax: (t: string) => void;
  divisions: Division[];
}

const RISK = [
  { key: 'high',   label: 'High',   color: '#f87171' },
  { key: 'medium', label: 'Med',    color: '#fbbf24' },
  { key: 'low',    label: 'Low',    color: '#4ade80' },
];

const TAX_TIERS = [
  { key: 'direct_tax',      label: 'Direct Tax',    color: '#60a5fa', title: 'Formal high-income workers: pay personal income tax (TDS/ITR) or employed by corporate taxpayers' },
  { key: 'indirect_gst',    label: 'GST/Indirect',  color: '#fbbf24', title: 'Semi-formal workers below income-tax threshold: contribute through GST, professional tax, EPFO' },
  { key: 'non_contributor', label: 'Non-Contributor',color: '#94a3b8', title: 'Informal/subsistence workers largely outside the direct fiscal system' },
];

export default function Controls(p: Props) {
  return (
    <div className="controls">

      {/* Search */}
      <div className="search-wrap">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className="search-input" type="text" placeholder="Search occupation…"
          value={p.search} onChange={e => p.onSearch(e.target.value)}
        />
      </div>

      {/* Metric */}
      <select className="metric-select" value={p.metric} onChange={e => p.onMetric(e.target.value as MetricKey)}>
        {(Object.keys(METRIC_CONFIG) as MetricKey[]).map(k => (
          <option key={k} value={k}>Color: {METRIC_CONFIG[k].label}</option>
        ))}
      </select>

      <div className="controls-sep" />

      {/* Division chips */}
      <span className="filter-label">Div:</span>
      {p.divisions.map(d => {
        const active = p.activeDivisions.includes(d.code);
        const color = DIVISION_COLORS[d.code] ?? '#6b7280';
        return (
          <button
            key={d.code}
            className={`div-chip${active ? ' active' : ''}`}
            onClick={() => p.onToggleDivision(d.code)}
            style={active ? { background: color, borderColor: color } : { borderColor: `${color}55` }}
            title={d.name}
          >
            {d.code}
          </button>
        );
      })}

      <div className="controls-sep" />

      {/* AI Risk */}
      <span className="filter-label">AI Risk:</span>
      {RISK.map(r => (
        <button
          key={r.key}
          className={`chip${p.activeRisk.includes(r.key) ? ' active' : ''}`}
          onClick={() => p.onToggleRisk(r.key)}
        >
          <span className="chip-dot" style={{ background: r.color }} />
          {r.label}
        </button>
      ))}

      <div className="controls-sep" />

      {/* ── TAX CONTRIBUTOR FILTER ── */}
      <span className="filter-label" style={{ color: '#60a5fa' }}>Tax:</span>
      {TAX_TIERS.map(t => (
        <button
          key={t.key}
          className={`chip${p.activeTax.includes(t.key) ? ' active' : ''}`}
          onClick={() => p.onToggleTax(t.key)}
          title={t.title}
          style={p.activeTax.includes(t.key) ? { borderColor: t.color, background: `${t.color}18`, color: t.color } : {}}
        >
          <span className="chip-dot" style={{ background: t.color }} />
          {t.label}
        </button>
      ))}

    </div>
  );
}
