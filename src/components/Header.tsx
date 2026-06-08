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
  activeStateName?: string;
}

export default function Header({ metadata, totalShown, highAiCount, fiscalSummary, hasActiveFilters, activeStateName }: Props) {
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
              {activeStateName ? `${activeStateName} workforce` : hasActiveFilters ? `showing (of ${formatWorkforce(metadata.total_workforce_million)})` : 'total workforce'}
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

          <div className="kpi-chip">
            <span className="val" style={{ color: '#4ade80' }}>PLFS {metadata.plfs_year}</span>
            <span className="lbl">source</span>
          </div>
        </div>

        {/* Export buttons stacked top-right */}
        <div className="header-export-stack">
          <button className="header-export-btn" id="header-export-json">⬇ JSON</button>
          <button className="header-export-btn header-export-pdf" id="header-export-pdf">⬇ PDF</button>
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
