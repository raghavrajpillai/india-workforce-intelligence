import { OccupationData, MetricKey } from '../types/occupation';
import { getMetricColor, METRIC_CONFIG } from '../utils/colorScale';
import { formatWorkforceLong, formatEarnings, formatPct } from '../utils/format';

interface Props {
  occ: OccupationData;
  x: number;
  y: number;
  activeMetric: MetricKey;
}

const SCORE_KEYS: MetricKey[] = ['ai_exposure','automation','human_dependency','physical_presence','future_demand'];

export default function HoverCard({ occ, x, y, activeMetric }: Props) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardW = 300;
  const cardH = 400;
  const left = x + 16 + cardW > vw ? x - cardW - 12 : x + 16;
  const top = y + cardH > vh ? Math.max(8, vh - cardH - 8) : y;

  return (
    <div className="hover-card" style={{ left, top }}>
      <div className="hc-top">
        <div className="hc-code">NCO-2004: {occ.code}</div>
        <div className="hc-name">{occ.name}</div>
        <div className="hc-division">{occ.division_name} · {occ.sector}</div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <span className={`hc-badge badge-risk-${occ.ai_risk_tier}`}>
          AI Risk: {occ.ai_risk_tier.toUpperCase()}
        </span>
        <span className={`hc-badge badge-tax-${occ.tax_contributor_tier}`}>
          {occ.tax_contributor_label}
        </span>
      </div>

      <div className="hc-stats">
        <div className="hc-stat">
          <div className="hc-stat-label">Workforce</div>
          <div className="hc-stat-value">{formatWorkforceLong(occ.workforce_million)}</div>
          <div className="hc-stat-note">Est. PLFS 2023-24</div>
        </div>
        <div className="hc-stat">
          <div className="hc-stat-label">Med. Earnings</div>
          <div className="hc-stat-value">{formatEarnings(occ.median_monthly_earnings_inr)}</div>
          <div className="hc-stat-note">Est. PLFS 2023-24</div>
        </div>
        <div className="hc-stat">
          <div className="hc-stat-label">Formal Share</div>
          <div className="hc-stat-value">{formatPct(occ.formal_share_pct)}</div>
          <div className="hc-stat-note">% formal employment</div>
        </div>
        <div className="hc-stat">
          <div className="hc-stat-label">Urban Share</div>
          <div className="hc-stat-value">{formatPct(occ.urban_share_pct)}</div>
          <div className="hc-stat-note">% urban workers</div>
        </div>
      </div>

      <div className="hc-scores">
        <div className="hc-scores-title">
          <span>AI Scores (0–10)</span>
          <span>⚠ LLM-inferred estimates</span>
        </div>
        {SCORE_KEYS.map(k => {
          const val = occ.scores[k];
          const cfg = METRIC_CONFIG[k];
          const color = getMetricColor(val, k);
          const isActive = k === activeMetric;
          return (
            <div className="score-row" key={k}>
              <div className="score-row-label" style={{ color: isActive ? '#e2e8f0' : undefined }}>
                {isActive ? '▶ ' : ''}{cfg.label}
              </div>
              <div className="score-bar-bg">
                <div
                  className="score-bar-fill"
                  style={{ width: `${val * 10}%`, background: color }}
                />
              </div>
              <div className="score-val">{val.toFixed(1)}</div>
            </div>
          );
        })}
      </div>

      {occ.nco2015_examples.length > 0 && (
        <div className="hc-examples">
          <div className="hc-examples-title">NCO-2015 examples (concordance)</div>
          <div className="hc-example-tags">
            {occ.nco2015_examples.slice(0,4).map(e => (
              <span className="hc-tag" key={e}>{e}</span>
            ))}
          </div>
        </div>
      )}

      <div className="hc-desc">{occ.description}</div>
    </div>
  );
}
