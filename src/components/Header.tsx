import { DatasetMetadata } from '../types/occupation';
import { formatWorkforce } from '../utils/format';

interface FiscalSummary {
  directTax: number;
  indirect: number;
  nonContrib: number;
  total: number;
}

interface Props {
  metadata: DatasetMetadata & { occupations?: unknown[] };
  totalShown: number;
  highAiCount: number;
  fiscalSummary: FiscalSummary;
  hasActiveFilters: boolean;
}

export default function Header({ metadata, totalShown, highAiCount, fiscalSummary, hasActiveFilters }: Props) {
  const { directTax, indirect, nonContrib, total } = fiscalSummary;

  const directPct = total > 0 ? Math.round((directTax / total) * 100) : 0;
  const indirectPct = total > 0 ? Math.round((indirect / total) * 100) : 0;
  const nonPct = total > 0 ? Math.round((nonContrib / total) * 100) : 0;

  // Bar widths for fiscal breakdown
  const barTotal = directTax + indirect + nonContrib || 1;

  return (
    <div className="header">
      {/* Row 1: Title + KPIs */}
      <div className="header-row1">
        <span className="header-title">🇮🇳 India Workforce Intelligence</span>
        <div className="header-kpis">
          {/* Primary: shows filtered total; shows 622M reference only when nothing filtered */}
          <div className="kpi-chip" style={{ background: hasActiveFilters ? 'rgba(59,130,246,0.12)' : undefined, borderColor: hasActiveFilters ? 'rgba(59,130,246,0.35)' : undefined }}>
            <span className="val" style={{ color: hasActiveFilters ? '#93c5fd' : undefined }}>
              {formatWorkforce(totalShown)}
            </span>
            <span className="lbl">
              {hasActiveFilters ? `showing (of ${formatWorkforce(metadata.total_workforce_million)})` : 'total workforce'}
            </span>
          </div>
          <div className="kpi-chip">
            <span className="val">116</span>
            <span className="lbl">NCO-2004 groups</span>
          </div>
          <div className="kpi-chip">
            <span className="val" style={{ color: '#f87171' }}>{highAiCount}</span>
            <span className="lbl">high AI-risk groups</span>
          </div>

          {/* Fiscal breakdown KPIs — update live with filters */}
          <div className="kpi-sep" />
          <div className="kpi-chip" title="Formal high-income: pay personal income tax (TDS/ITR)">
            <span className="val" style={{ color: '#60a5fa' }}>{formatWorkforce(directTax)}</span>
            <span className="lbl">Direct Tax</span>
            {hasActiveFilters && <span className="kpi-pct" style={{ color: '#60a5fa' }}>{directPct}%</span>}
          </div>
          <div className="kpi-chip" title="Semi-formal workers: GST, professional tax, EPFO">
            <span className="val" style={{ color: '#fbbf24' }}>{formatWorkforce(indirect)}</span>
            <span className="lbl">GST/Indirect</span>
            {hasActiveFilters && <span className="kpi-pct" style={{ color: '#fbbf24' }}>{indirectPct}%</span>}
          </div>
          <div className="kpi-chip" title="Informal/subsistence: largely outside fiscal system">
            <span className="val" style={{ color: '#94a3b8' }}>{formatWorkforce(nonContrib)}</span>
            <span className="lbl">Non-Contributor</span>
            {hasActiveFilters && <span className="kpi-pct" style={{ color: '#94a3b8' }}>{nonPct}%</span>}
          </div>

          <div className="kpi-chip" style={{ marginLeft: 'auto' }}>
            <span className="val" style={{ color: '#4ade80' }}>PLFS {metadata.plfs_year}</span>
            <span className="lbl">source</span>
          </div>

          {/* Author chip */}
          <a
            href="https://www.linkedin.com/in/raghavendrachandrasekar/"
            target="_blank"
            rel="noopener noreferrer"
            className="author-chip"
          >
            <img
              src="https://github.com/raghavrajpillai.png"
              alt="Raghavendra Chandrasekar"
              className="author-avatar"
            />
            <span className="author-name">Raghavendra</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#0a66c2" style={{ flexShrink: 0 }}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Row 2: Fiscal breakdown bar + caveat */}
      <div className="header-row2">
        {/* Stacked fiscal bar */}
        <div className="fiscal-bar-wrap" title="Fiscal contribution breakdown of currently shown workforce">
          <div className="fiscal-bar">
            <div
              className="fiscal-seg"
              style={{ width: `${(directTax / barTotal) * 100}%`, background: '#3b82f6' }}
              title={`Direct Tax: ${formatWorkforce(directTax)}`}
            />
            <div
              className="fiscal-seg"
              style={{ width: `${(indirect / barTotal) * 100}%`, background: '#f59e0b' }}
              title={`GST/Indirect: ${formatWorkforce(indirect)}`}
            />
            <div
              className="fiscal-seg"
              style={{ width: `${(nonContrib / barTotal) * 100}%`, background: '#475569' }}
              title={`Non-Contributor: ${formatWorkforce(nonContrib)}`}
            />
          </div>
          <span className="fiscal-bar-label">Fiscal split of {hasActiveFilters ? 'filtered' : 'total'} workforce</span>
        </div>

        <span className="caveat-pill">
          ⚠ <strong>Estimates:</strong> workforce modelled ±25-35%; AI scores LLM-inferred; tax tiers inferred from PLFS earnings + CBDT data — not from tax microdata. Hard stats GoI only.
        </span>
      </div>
    </div>
  );
}
