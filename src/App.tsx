import { useState, useMemo, useCallback } from 'react';
import rawData from './data/data.json';
import { Dataset, OccupationData, MetricKey } from './types/occupation';
import { StateData } from './data/statesData';
import Header from './components/Header';
import Controls from './components/Controls';
import TreemapChart from './components/TreemapChart';
import BottomBar from './components/BottomBar';
import StatePanel from './components/StatePanel';

const data = rawData as Dataset;

export default function App() {
  const [metric, setMetric] = useState<MetricKey>('ai_exposure');
  const [search, setSearch] = useState('');
  const [activeDivisions, setActiveDivisions] = useState<string[]>([]);
  const [activeRisk, setActiveRisk] = useState<string[]>([]);
  const [activeTax, setActiveTax] = useState<string[]>([]);
  const [formality, setFormality] = useState('all');
  const [minWorkforce, setMinWorkforce] = useState(0);
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
      if (formality === 'formal' && o.formal_share_pct < 50) return false;
      if (formality === 'informal' && o.formal_share_pct >= 50) return false;
      if (o.workforce_million < minWorkforce) return false;
      // State filter: show occupations in state's dominant divisions
      if (activeState && !activeState.dominant_divisions.includes(o.division_code)) return false;
      return true;
    }),
    [activeDivisions, activeRisk, activeTax, formality, minWorkforce, activeState]
  );

  // Fiscal breakdown of currently filtered set
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
    activeDivisions.length > 0 ||
    activeRisk.length > 0 ||
    activeTax.length > 0 ||
    formality !== 'all' ||
    minWorkforce > 0 ||
    activeState !== null;

  return (
    <div className="app">
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
        formality={formality} onFormality={setFormality}
        minWorkforce={minWorkforce} onMinWorkforce={setMinWorkforce}
        divisions={data.divisions}
      />

      <div className="main-area">
        <StatePanel activeState={activeState} onSelectState={setActiveState} filtered={filtered} hasActiveFilters={hasActiveFilters} />
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
  );
}
