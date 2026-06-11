// The full interactive dashboard — preserved as-is from original App
// Only addition: a slim nav bar at top linking back to the editorial site

import { useState, useMemo, useCallback } from 'react';
import rawData from '../data/data.json';
import { Dataset, OccupationData, MetricKey } from '../types/occupation';
import { StateData } from '../data/statesData';
import Header from '../components/Header';
import Controls from '../components/Controls';
import TreemapChart from '../components/TreemapChart';
import BottomBar from '../components/BottomBar';
import StatePanel from '../components/StatePanel';

const data = rawData as Dataset;

export default function ExplorePage() {
  const [metric, setMetric] = useState<MetricKey>('ai_exposure');
  const [search, setSearch] = useState('');
  const [activeDivisions, setActiveDivisions] = useState<string[]>([]);
  const [activeRisk, setActiveRisk] = useState<string[]>([]);
  const [activeTax, setActiveTax] = useState<string[]>([]);
  const [activeState, setActiveState] = useState<StateData | null>(null);

  const toggleDivision = useCallback((c: string) =>
    setActiveDivisions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]), []);
  const toggleRisk = useCallback((r: string) =>
    setActiveRisk(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]), []);
  const toggleTax = useCallback((t: string) =>
    setActiveTax(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]), []);

  const filtered = useMemo<OccupationData[]>(() =>
    data.occupations.filter(o => {
      if (activeDivisions.length > 0 && !activeDivisions.includes(o.division_code)) return false;
      if (activeRisk.length > 0 && !activeRisk.includes(o.ai_risk_tier)) return false;
      if (activeTax.length > 0 && !activeTax.includes(o.tax_contributor_tier)) return false;
      if (activeState && !activeState.dominant_divisions.includes(o.division_code)) return false;
      return true;
    }),
    [activeDivisions, activeRisk, activeTax, activeState]
  );

  const fiscalSummary = useMemo(() => {
    const directTax = filtered.filter(o => o.tax_contributor_tier === 'direct_tax')
      .reduce((s, o) => s + o.workforce_million, 0);
    const indirect = filtered.filter(o => o.tax_contributor_tier === 'indirect_gst')
      .reduce((s, o) => s + o.workforce_million, 0);
    const nonContrib = filtered.filter(o => o.tax_contributor_tier === 'non_contributor')
      .reduce((s, o) => s + o.workforce_million, 0);
    const total = directTax + indirect + nonContrib;
    return { directTax, indirect, nonContrib, total };
  }, [filtered]);

  const highAiCount = useMemo(() => data.occupations.filter(o => o.ai_risk_tier === 'high').length, []);
  const metaWithCount = useMemo(() => ({ ...data.metadata, occupations: data.occupations }) as any, []);

  const hasActiveFilters =
    activeDivisions.length > 0 || activeRisk.length > 0 || activeTax.length > 0 ||
    activeState !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div className="app" style={{ flex: 1, minHeight: 0 }}>
        <Header
          metadata={metaWithCount}
          totalShown={fiscalSummary.total}
          highAiCount={highAiCount}
          fiscalSummary={fiscalSummary}
          hasActiveFilters={hasActiveFilters}
          activeStateName={activeState?.name}
        />
        <Controls
          search={search} onSearch={setSearch}
          metric={metric} onMetric={setMetric}
          activeDivisions={activeDivisions} onToggleDivision={toggleDivision}
          activeRisk={activeRisk} onToggleRisk={toggleRisk}
          activeTax={activeTax} onToggleTax={toggleTax}
          divisions={data.divisions}
        />
        <div className="main-area">
          <StatePanel activeState={activeState} onSelectState={setActiveState} filtered={filtered} hasActiveFilters={hasActiveFilters} totalWorkforce={data.metadata.total_workforce_million} />
          <div className="treemap-area">
            <TreemapChart
              occupations={filtered}
              allOccupations={data.occupations}
              metric={metric}
              search={search}
            />
          </div>
        </div>
        <BottomBar
          metric={metric}
          divisions={data.divisions}
          activeDivisions={activeDivisions}
          onToggleDivision={toggleDivision}
          occupations={data.occupations}
          metadata={data.metadata}
        />
      </div>
    </div>
  );
}
