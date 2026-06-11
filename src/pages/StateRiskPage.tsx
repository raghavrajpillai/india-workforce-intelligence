import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATES } from '../data/statesData';

const sorted = [...STATES].sort((a, b) => b.high_risk_pct - a.high_risk_pct);
const stateMap = Object.fromEntries(STATES.map(s => [s.code, s]));

function riskColor(pct: number) {
  if (pct >= 15) return '#E8655A';
  if (pct >= 10) return '#D97706';
  if (pct >= 6) return '#F59E0B';
  return '#9CA3AF';
}
function riskLabel(pct: number) {
  if (pct >= 15) return 'High';
  if (pct >= 10) return 'Med-High';
  if (pct >= 6) return 'Medium';
  return 'Lower';
}

// Choropleth state polygon paths
// Projection: x=(lon-68)*15, y=(37-lat)*15.5  |  ViewBox "0 0 460 500"
interface StateSVG { d: string; lx: number; ly: number; short: string; }

const SHAPES: Record<string, StateSVG> = {
  // States WITH risk data
  PB: { d:'M 83,72 L 118,65 L 128,85 L 125,112 L 83,115 Z', lx:103, ly:92, short:'Punjab' },
  HR: { d:'M 118,65 L 140,90 L 155,83 L 162,95 L 155,112 L 142,122 L 118,122 L 118,112 L 125,112 L 125,90 L 118,83 Z', lx:136, ly:102, short:'Haryana' },
  DL: { d:'M 142,112 L 153,112 L 153,125 L 142,125 Z', lx:148, ly:119, short:'DL' },
  UK: { d:'M 142,90 L 158,85 L 165,65 L 200,60 L 205,83 L 198,105 L 165,108 L 153,112 L 142,112 Z', lx:173, ly:92, short:'UK' },
  UP: { d:'M 153,112 L 165,108 L 198,105 L 248,105 L 262,118 L 250,158 L 233,170 L 207,177 L 178,180 L 155,173 L 138,162 L 128,148 L 128,140 L 142,122 L 155,112 Z', lx:197, ly:148, short:'UP' },
  RJ: { d:'M 10,103 L 83,72 L 83,115 L 118,115 L 118,122 L 128,140 L 128,148 L 112,162 L 95,193 L 65,212 L 28,210 L 10,195 L 7,160 Z', lx:67, ly:158, short:'Rajasthan' },
  GJ: { d:'M 7,195 L 28,210 L 65,212 L 80,227 L 77,258 L 58,278 L 30,283 L 8,270 L 0,250 L 5,225 Z', lx:38, ly:248, short:'Gujarat' },
  MP: { d:'M 95,193 L 112,162 L 128,148 L 155,173 L 178,180 L 207,177 L 237,185 L 247,197 L 242,222 L 217,238 L 178,248 L 143,248 L 112,237 L 93,218 Z', lx:168, ly:215, short:'MP' },
  MH: { d:'M 65,212 L 95,193 L 112,220 L 143,237 L 178,248 L 198,257 L 198,280 L 177,298 L 153,308 L 127,312 L 98,302 L 70,285 L 57,262 L 62,240 Z', lx:127, ly:270, short:'Maharashtra' },
  CG: { d:'M 207,177 L 237,185 L 267,177 L 273,195 L 270,227 L 252,242 L 238,258 L 218,263 L 200,253 L 198,237 L 198,217 L 207,195 Z', lx:233, ly:222, short:'CG' },
  JH: { d:'M 233,170 L 250,158 L 273,163 L 287,175 L 287,198 L 273,215 L 252,222 L 233,218 L 223,208 L 227,188 Z', lx:257, ly:195, short:'Jharkhand' },
  BR: { d:'M 207,152 L 233,145 L 257,147 L 273,163 L 250,158 L 233,170 L 227,188 L 223,208 L 207,215 L 188,215 L 175,205 L 175,185 Z', lx:224, ly:183, short:'Bihar' },
  WB: { d:'M 257,147 L 285,145 L 303,155 L 308,173 L 305,202 L 292,228 L 278,250 L 268,265 L 252,263 L 248,250 L 268,238 L 273,218 L 270,200 L 273,185 L 273,163 Z', lx:286, ly:205, short:'West Bengal' },
  OD: { d:'M 238,258 L 252,242 L 270,248 L 280,262 L 285,283 L 275,306 L 258,318 L 238,323 L 218,317 L 200,307 L 200,283 L 213,263 Z', lx:247, ly:288, short:'Odisha' },
  TG: { d:'M 158,278 L 178,268 L 198,278 L 200,295 L 218,312 L 218,327 L 205,343 L 183,348 L 163,337 L 153,323 L 148,307 Z', lx:183, ly:313, short:'Telangana' },
  AP: { d:'M 153,323 L 163,337 L 183,348 L 205,343 L 218,327 L 238,323 L 258,328 L 268,343 L 258,368 L 238,382 L 213,382 L 188,370 L 160,355 L 147,338 Z', lx:208, ly:353, short:'Andhra Pradesh' },
  KA: { d:'M 98,302 L 127,310 L 153,308 L 153,323 L 147,338 L 160,355 L 150,375 L 135,388 L 115,392 L 95,375 L 80,355 L 77,328 L 87,310 Z', lx:118, ly:350, short:'Karnataka' },
  KL: { d:'M 95,375 L 115,392 L 122,413 L 120,437 L 108,460 L 93,467 L 82,450 L 82,420 L 88,398 Z', lx:103, ly:425, short:'Kerala' },
  TN: { d:'M 115,392 L 135,388 L 157,395 L 173,413 L 173,437 L 160,465 L 143,472 L 127,465 L 115,450 L 120,437 L 122,413 Z', lx:145, ly:432, short:'Tamil Nadu' },
  AS: { d:'M 318,150 L 355,143 L 385,148 L 397,163 L 380,178 L 348,183 L 318,180 L 307,170 L 307,160 Z', lx:352, ly:165, short:'Assam' },
  // Background states (no data)
  JK: { d:'M 90,5 L 120,5 L 162,5 L 188,18 L 198,48 L 180,65 L 150,70 L 120,65 L 97,58 L 83,42 Z', lx:140, ly:35, short:'J&K' },
  HP: { d:'M 120,65 L 150,58 L 165,65 L 158,85 L 140,90 L 120,83 Z', lx:140, ly:75, short:'HP' },
  GA: { d:'M 77,322 L 87,310 L 98,312 L 98,325 L 85,328 Z', lx:88, ly:320, short:'GA' },
  SK: { d:'M 307,148 L 317,143 L 322,152 L 313,160 L 305,158 Z', lx:313, ly:153, short:'SK' },
  AR: { d:'M 355,120 L 410,118 L 428,132 L 426,153 L 397,163 L 385,148 L 355,143 L 338,130 Z', lx:388, ly:138, short:'AR' },
  ME: { d:'M 307,170 L 318,180 L 337,185 L 338,198 L 315,205 L 298,193 L 300,180 Z', lx:318, ly:191, short:'ML' },
  NL: { d:'M 380,178 L 397,170 L 412,175 L 410,192 L 395,197 L 378,192 Z', lx:394, ly:186, short:'NL' },
  MN: { d:'M 395,197 L 412,192 L 418,203 L 412,217 L 400,222 L 388,212 Z', lx:403, ly:208, short:'MN' },
  MZ: { d:'M 388,222 L 400,222 L 408,232 L 402,247 L 388,250 L 379,237 Z', lx:394, ly:237, short:'MZ' },
  TR: { d:'M 348,198 L 362,195 L 368,207 L 362,220 L 350,220 L 343,210 Z', lx:356, ly:209, short:'TR' },
};

const DATA_CODES = new Set(['PB','HR','DL','UK','UP','RJ','GJ','MP','MH','CG','JH','BR','WB','OD','TG','AP','KA','KL','TN','AS']);

export default function StateRiskPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const hovState = hovered && DATA_CODES.has(hovered) ? stateMap[hovered] : null;

  return (
    <div className="page-light">
      <section className="inner-hero">
        <div className="hp-section-inner">
          <div className="hp-eyebrow">Geographic AI Fiscal Risk · 20 States</div>
          <h1 className="inner-headline">Which states face<br />the most fiscal damage?</h1>
          <p className="inner-sub">High AI-risk workforce as % of state total. Source: PLFS 2023-24 state tables — modelled estimates ±30%.</p>
        </div>
      </section>

      <section style={{ background: '#FEF0E7', padding: '60px 0' }}>
        <div className="hp-section-inner">
          <div className="sr-layout">

            {/* MAP */}
            <div className="sr-map-wrap">
              <svg viewBox="0 0 460 500" className="sr-map-svg" style={{ width: '100%' }}>
                {/* Ocean */}
                <rect x="0" y="0" width="460" height="500" fill="#D6EAF4" rx="6" />

                {/* Background states (no data) */}
                {Object.entries(SHAPES)
                  .filter(([code]) => !DATA_CODES.has(code))
                  .map(([code, s]) => (
                    <path key={code} d={s.d} fill="#C8BDB0" stroke="#fff" strokeWidth="0.8" />
                  ))}

                {/* Data states */}
                {Object.entries(SHAPES)
                  .filter(([code]) => DATA_CODES.has(code))
                  .map(([code, s]) => {
                    const st = stateMap[code];
                    if (!st) return null;
                    const col = riskColor(st.high_risk_pct);
                    const isHov = hovered === code;
                    return (
                      <path
                        key={code}
                        d={s.d}
                        fill={col}
                        stroke="#fff"
                        strokeWidth={isHov ? 2.5 : 1}
                        opacity={hovered && !isHov ? 0.45 : 1}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHovered(code)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    );
                  })}

                {/* Labels */}
                {Object.entries(SHAPES).map(([code, s]) => {
                  const hasData = DATA_CODES.has(code);
                  return (
                    <text
                      key={`lbl-${code}`}
                      x={s.lx} y={s.ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={hasData ? 6.5 : 5}
                      fill={hasData ? '#fff' : '#7a6e63'}
                      fontWeight={hasData ? '700' : '400'}
                      pointerEvents="none"
                      style={{ userSelect: 'none' }}
                    >
                      {s.short}
                    </text>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hovState && (
                <div className="sr-tooltip">
                  <div className="sr-tt-name">{hovState.name}</div>
                  <div className="sr-tt-profile">{hovState.economic_profile}</div>
                  <div className="sr-tt-stats">
                    <div><span style={{ color: riskColor(hovState.high_risk_pct) }}>{hovState.high_risk_pct}%</span> High AI Risk</div>
                    <div><span style={{ color: '#1B6B77' }}>{hovState.workforce_million}M</span> Total workforce</div>
                    <div><span style={{ color: '#E8655A' }}>{hovState.high_risk_million}M</span> High-risk workers</div>
                    <div><span style={{ color: '#D97706' }}>{hovState.fiscal_exposure_pct}%</span> Fiscal exposure</div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="sr-legend">
                {([['#E8655A','≥15%','High'],['#D97706','10–14%','Med-High'],['#F59E0B','6–9%','Medium'],['#9CA3AF','<6%','Lower'],['#C8BDB0','—','No data']] as const).map(([c,p,l]) => (
                  <div key={l} className="sr-legend-item">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }} />
                    <span>{l}{p !== '—' ? ` (${p})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RANKINGS */}
            <div className="sr-rankings">
              <div className="sr-rankings-head">
                <h2 className="sr-rankings-title">State Rankings</h2>
                <p className="sr-rankings-sub">Ranked by high AI-risk workforce as % of state total</p>
              </div>
              <div className="sr-list">
                {sorted.map((s, i) => {
                  const col = riskColor(s.high_risk_pct);
                  const maxPct = sorted[0].high_risk_pct;
                  return (
                    <div
                      key={s.code}
                      className={`sr-row${hovered === s.code ? ' sr-row-hov' : ''}`}
                      onMouseEnter={() => setHovered(s.code)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="sr-rank" style={{ color: col }}>#{i + 1}</div>
                      <div className="sr-row-body">
                        <div className="sr-row-top">
                          <span className="sr-row-name">{s.name}</span>
                          <span className="sr-row-pct" style={{ color: col }}>{s.high_risk_pct}%</span>
                        </div>
                        <div className="sr-bar-bg">
                          <div className="sr-bar-fill" style={{ width: `${(s.high_risk_pct / maxPct) * 100}%`, background: col }} />
                        </div>
                        <div className="sr-row-meta">
                          <span style={{ color: col }}>{riskLabel(s.high_risk_pct)} risk</span>
                          &nbsp;·&nbsp;{s.economic_profile}
                          &nbsp;·&nbsp;{s.high_risk_million}M at risk
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section style={{ background: '#F5E6D8', padding: '60px 0' }}>
        <div className="hp-section-inner">
          <h2 className="hp-section-headline" style={{ marginBottom: 40 }}>The concentration problem</h2>
          <div className="sr-summary-grid">
            <div className="sr-summary-card" style={{ borderColor: '#FACDC8' }}>
              <div className="sr-summary-num" style={{ color: '#E8655A' }}>4</div>
              <div className="sr-summary-label">States account for 57% of all high-AI-risk formal workers</div>
              <div className="sr-summary-sub">Delhi · Karnataka · Maharashtra · Telangana</div>
            </div>
            <div className="sr-summary-card" style={{ borderColor: '#C5DFE8' }}>
              <div className="sr-summary-num" style={{ color: '#1B6B77' }}>35%</div>
              <div className="sr-summary-label">of Delhi's workforce is in high AI-risk occupations — the highest of any state</div>
              <div className="sr-summary-sub">Admin & Financial Hub concentration</div>
            </div>
            <div className="sr-summary-card" style={{ borderColor: '#FDE8CC' }}>
              <div className="sr-summary-num" style={{ color: '#D97706' }}>₹0</div>
              <div className="sr-summary-label">State-level AI workforce transition plans exist for any of these high-risk states</div>
              <div className="sr-summary-sub">Policy vacuum as of June 2026</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-primary" onClick={() => navigate('/explore')}>
              Explore by State in the Tool &rarr;
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="hp-section-inner hp-section-center">
          <p className="footer-note">PLFS 2023-24 state tables · modelled estimates ±30% · not official statistics</p>
          <p className="footer-credit">
            Built by <a href="https://linkedin.com/in/raghavendrachandrasekar" target="_blank" rel="noreferrer">Raghavendra Chandrasekar</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
