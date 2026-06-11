import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import rawData from '../data/data.json';
import { Dataset, OccupationData } from '../types/occupation';

const data = rawData as Dataset;

function riskColor(tier: string) {
  return tier === 'high' ? '#E8655A' : tier === 'medium' ? '#D97706' : '#10B981';
}
function taxColor(tier: string) {
  return tier === 'direct_tax' ? '#1B6B77' : tier === 'indirect_gst' ? '#D97706' : '#9CA3AF';
}
function taxLabel(tier: string) {
  return tier === 'direct_tax' ? 'Direct Tax' : tier === 'indirect_gst' ? 'GST / Indirect' : 'Non-Contributor';
}
function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#EDD5C4', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value * 10}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function OccCard({ occ, expanded, onToggle }: { occ: OccupationData; expanded: boolean; onToggle: () => void }) {
  const col = riskColor(occ.ai_risk_tier);
  return (
    <div className={`occ-card${expanded ? ' occ-card-open' : ''}`} onClick={onToggle}>
      <div className="occ-card-top">
        <div className="occ-card-meta">
          <div className="occ-code">{occ.code}</div>
          <div className="occ-division">{occ.division_name}</div>
        </div>
        <div className={`occ-risk-badge occ-risk-${occ.ai_risk_tier}`}>{occ.ai_risk_tier.toUpperCase()} RISK</div>
      </div>
      <div className="occ-name">{occ.name}</div>
      <div className="occ-score-row">
        <span className="occ-score-lbl">AI Exposure</span>
        <ScoreBar value={occ.scores.ai_exposure} color={col} />
        <span className="occ-workforce">{occ.workforce_million.toFixed(1)}M workers</span>
      </div>

      {expanded && (
        <div className="occ-expanded" onClick={e => e.stopPropagation()}>
          <div className="occ-exp-section">
            <div className="occ-exp-label">All Scores</div>
            <div className="occ-scores-grid">
              {[
                ['AI Exposure', occ.scores.ai_exposure, col],
                ['Automation', occ.scores.automation, col],
                ['Human Dependency', occ.scores.human_dependency, '#10B981'],
                ['Physical Presence', occ.scores.physical_presence, '#10B981'],
                ['Future Demand', occ.scores.future_demand, '#1B6B77'],
              ].map(([lbl, val, c]) => (
                <div key={lbl as string} className="occ-score-row-full">
                  <span className="occ-score-lbl-full">{lbl as string}</span>
                  <ScoreBar value={val as number} color={c as string} />
                </div>
              ))}
            </div>
          </div>
          <div className="occ-exp-two-col">
            <div className="occ-exp-section">
              <div className="occ-exp-label">Tax Contribution</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: taxColor(occ.tax_contributor_tier), flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2B3A' }}>{taxLabel(occ.tax_contributor_tier)}</span>
              </div>
              <p style={{ fontSize: 13, color: '#4A5E6E', marginTop: 6, lineHeight: 1.5 }}>{occ.tax_contributor_note}</p>
            </div>
            <div className="occ-exp-section">
              <div className="occ-exp-label">Workforce Profile</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                <div style={{ fontSize: 13, color: '#4A5E6E' }}>Formal share: <strong style={{ color: '#1A2B3A' }}>{occ.formal_share_pct}%</strong></div>
                <div style={{ fontSize: 13, color: '#4A5E6E' }}>Urban share: <strong style={{ color: '#1A2B3A' }}>{occ.urban_share_pct}%</strong></div>
                {occ.median_monthly_earnings_inr && (
                  <div style={{ fontSize: 13, color: '#4A5E6E' }}>Median earnings: <strong style={{ color: '#1A2B3A' }}>₹{occ.median_monthly_earnings_inr.toLocaleString()}/mo</strong></div>
                )}
              </div>
            </div>
          </div>
          {occ.description && (
            <div className="occ-exp-section">
              <div className="occ-exp-label">About this occupation</div>
              <p style={{ fontSize: 14, color: '#4A5E6E', marginTop: 6, lineHeight: 1.6 }}>{occ.description}</p>
            </div>
          )}
          {occ.nco2015_examples && occ.nco2015_examples.length > 0 && (
            <div className="occ-exp-section">
              <div className="occ-exp-label">Example Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {occ.nco2015_examples.map(ex => (
                  <span key={ex} className="occ-tag">{ex}</span>
                ))}
              </div>
            </div>
          )}
          {occ.key_skills && occ.key_skills.length > 0 && (
            <div className="occ-exp-section">
              <div className="occ-exp-label">Key Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {occ.key_skills.map(sk => (
                  <span key={sk} className="occ-tag occ-tag-skill">{sk}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OccupationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [taxFilter, setTaxFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.occupations.filter(o => {
      if (riskFilter !== 'all' && o.ai_risk_tier !== riskFilter) return false;
      if (taxFilter !== 'all' && o.tax_contributor_tier !== taxFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.name.toLowerCase().includes(q) ||
          o.division_name.toLowerCase().includes(q) ||
          (o.description || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, riskFilter, taxFilter]);

  return (
    <div className="page-light">
      <section className="inner-hero">
        <div className="hp-section-inner">
          <div className="hp-eyebrow">116 NCO-2004 Occupation Groups</div>
          <h1 className="inner-headline">Occupation Explorer</h1>
          <p className="inner-sub">Search and compare AI exposure scores across every occupation group mapped from PLFS 2023-24.</p>
        </div>
      </section>

      <section style={{ background: '#FEF0E7', padding: '40px 0 80px' }}>
        <div className="hp-section-inner">
          {/* Filters */}
          <div className="occ-filters">
            <div className="occ-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="occ-search"
                placeholder="Search occupations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="occ-filter-chips">
              {['all','high','medium','low'].map(r => (
                <button key={r}
                  className={`occ-chip${riskFilter === r ? ' occ-chip-active' : ''}`}
                  style={riskFilter === r && r !== 'all' ? { borderColor: riskColor(r), color: riskColor(r) } : {}}
                  onClick={() => setRiskFilter(r)}>
                  {r === 'all' ? 'All Risk' : r.charAt(0).toUpperCase() + r.slice(1) + ' Risk'}
                </button>
              ))}
              <div style={{ width: 1, height: 24, background: '#EDD5C4', margin: '0 4px' }} />
              {['all','direct_tax','indirect_gst','non_contributor'].map(t => (
                <button key={t}
                  className={`occ-chip${taxFilter === t ? ' occ-chip-active' : ''}`}
                  style={taxFilter === t && t !== 'all' ? { borderColor: taxColor(t), color: taxColor(t) } : {}}
                  onClick={() => setTaxFilter(t)}>
                  {t === 'all' ? 'All Tax Tiers' : taxLabel(t)}
                </button>
              ))}
            </div>
            <div className="occ-count">{filtered.length} occupation groups</div>
          </div>

          {/* Cards grid */}
          <div className="occ-grid">
            {filtered.map(occ => (
              <OccCard
                key={occ.code}
                occ={occ}
                expanded={expanded === occ.code}
                onToggle={() => setExpanded(expanded === occ.code ? null : occ.code)}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: '#9CA3AF', fontSize: 16 }}>
                No occupations match your filters.
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="btn-ghost" onClick={() => navigate('/explore')}>
              View all in interactive treemap &rarr;
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="hp-section-inner hp-section-center">
          <p className="footer-note">NCO-2004 · PLFS 2023-24 · AI scores LLM-inferred estimates</p>
          <p className="footer-credit">Built by <a href="https://linkedin.com/in/raghavendrachandrasekar" target="_blank" rel="noreferrer">Raghavendra Chandrasekar</a></p>
        </div>
      </footer>
    </div>
  );
}
