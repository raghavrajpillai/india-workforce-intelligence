import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

const C = {
  bg:        '#070A18',
  bgAlt:     '#0C1226',
  card:      '#101A2E',
  cardAlt:   '#0C1525',
  text:      '#EDF1FF',
  textSub:   '#7D97C9',
  textMuted: '#3B5282',
  border:    'rgba(237,241,255,.06)',
  borderSub: 'rgba(237,241,255,.04)',
  red:       '#FF4B4B',
  gold:      '#FFA824',
  goldLight: '#FFBF50',
  blue:      '#4EAAFF',
};

const sources = [
  { name: 'PLFS 2023-24',          org: 'NSO / MoSPI',            use: 'Workforce size, occupation distribution, earnings data' },
  { name: 'NCO-2004 Taxonomy',      org: 'DGE / Min. of Labour',   use: '116 occupation group classification (3-digit, ISCO-88)' },
  { name: 'CBDT Annual Reports',    org: 'Central Board of Direct Taxes', use: 'Direct taxpayer count, income distribution tiers' },
  { name: 'NASSCOM IT Report 2024', org: 'NASSCOM',                use: 'IT sector AI automation estimates' },
  { name: 'Union Budget 2024',      org: 'Ministry of Finance',    use: 'AI reskilling and displacement budget allocations' },
  { name: '7th Pay Commission',     org: 'Govt of India',          use: 'Earnings reference for formal sector occupations' },
];

const scoreDims = [
  ['AI Exposure',       'Overall likelihood of disruption by current LLMs and agentic AI systems'],
  ['Automation',        'Share of tasks directly automatable today'],
  ['Human Dependency',  'Degree requiring human judgment, empathy, or physical presence (higher = safer)'],
  ['Physical Presence', 'Whether the job requires being physically present (higher = safer)'],
  ['Future Demand',     'Whether demand for this occupation is likely to grow despite AI'],
];

const taxTiers = [
  { tier: 'Direct Tax',      color: C.blue, desc: 'Formal organised-sector workers. ~38.3M. Associated with personal income tax (TDS/ITR). Actual ITR filers ~22.4M — many earn below ₹12L effective threshold.' },
  { tier: 'GST / Indirect',  color: C.gold, desc: 'Semi-formal workers contributing through GST, professional tax, EPFO, or indirect consumption taxes. ~262.6M workers.' },
  { tier: 'Non-Contributor', color: C.textSub, desc: 'Informal, subsistence, and agricultural workers largely outside the formal fiscal system. ~320.9M workers.' },
];

const limitations = [
  'Workforce counts are GROUP-LEVEL ESTIMATES ±25–35%, derived from PLFS sector totals. Precise counts require unit-level microdata.',
  'AI scores are LLM-INFERRED — not official statistics, not displacement predictions. Elevated risk over a 3-5 year horizon.',
  'Tax contribution tiers are inferred from PLFS earnings + CBDT data — not from direct tax microdata joins.',
  'State-level figures carry ±30% margin of error due to PLFS sample sizes at sub-national level.',
  'NCO-2015 examples are illustrative concordance only — not a validated crosswalk.',
  'Dataset total (~622M) slightly exceeds PLFS reported ~616M due to estimation rounding.',
];

const TABS = ['Overview', 'AI Scoring', 'Tax Tiers', 'Sources', 'Limitations'];

export default function MethodologyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg, fontFamily: SANS }}>

      {/* Header */}
      <div style={{ flexShrink: 0, padding: '28px 52px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 9, fontFamily: SANS }}>
              Research Methodology · Transparency
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: '-.3px', margin: 0, lineHeight: 1.15 }}>
              How this data was built
            </h1>
          </div>
          <button className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', marginBottom: 2 }} onClick={() => navigate('/explore')}>
            Explore the Data →
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '8px 18px',
              background: i === tab ? 'rgba(237,241,255,.06)' : 'transparent',
              border: 'none',
              borderBottom: i === tab ? `2px solid ${C.red}` : '2px solid transparent',
              color: i === tab ? C.text : 'rgba(237,241,255,.32)',
              fontWeight: i === tab ? 600 : 400,
              borderRadius: '5px 5px 0 0',
              cursor: 'pointer', fontSize: 13,
              fontFamily: SANS, transition: 'all .15s',
              letterSpacing: '.01em',
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '32px 52px' }}>

        {/* Overview */}
        {tab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, height: '100%' }}>
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16, letterSpacing: '-.2px' }}>The Core Question</h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, marginBottom: 14, fontFamily: SANS }}>
                Most AI-workforce research asks: <em style={{ color: C.text, fontFamily: SERIF }}>which jobs will AI displace?</em>
              </p>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, marginBottom: 14, fontFamily: SANS }}>
                This project adds a second question: <em style={{ color: C.text, fontFamily: SERIF }}>what happens to government revenue when those workers are displaced?</em>
              </p>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, fontFamily: SANS }}>
                By mapping India's entire 622-million-person workforce against AI disruption exposure AND tax contribution tier simultaneously, it surfaces a structural fiscal risk that standard labour analysis misses.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16, letterSpacing: '-.2px' }}>Method in Four Steps</h2>
              {[
                ['Classify',  'Map all occupations to NCO-2004 — 116 three-digit occupation groups (ISCO-88 based)'],
                ['Estimate',  'Model workforce counts per group from PLFS 2023-24 sector-level aggregates (±25–35%)'],
                ['Score',     'Score each group 0–10 across 5 AI exposure dimensions via LLM task-composition analysis'],
                ['Tax Tier',  'Assign each group to a fiscal tier (Direct Tax / GST-Indirect / Non-Contributor) via CBDT + PLFS'],
              ].map(([step, desc], i) => (
                <div key={step} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: C.red, flexShrink: 0, fontFamily: SANS }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 2, fontFamily: SANS }}>{step}</div>
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.55, fontFamily: SANS }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Scoring */}
        {tab === 1 && (
          <div>
            <p style={{ fontSize: 14, color: C.textSub, marginBottom: 18, maxWidth: 680, fontFamily: SANS, lineHeight: 1.6 }}>
              Each occupation group scored 0–10 across five dimensions using <strong style={{ color: C.text, fontWeight: 600 }}>LLM-based task-composition analysis</strong> with India-specific NCO-2004 occupation descriptions.
            </p>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 18 }}>
              {scoreDims.map(([dim, desc], i) => (
                <div key={dim} style={{ display: 'grid', gridTemplateColumns: '210px 1fr', background: i % 2 === 0 ? C.card : C.cardAlt }}>
                  <div style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text, borderRight: `1px solid ${C.borderSub}`, fontFamily: SANS }}>{dim}</div>
                  <div style={{ padding: '13px 16px', fontSize: 13.5, color: C.textSub, lineHeight: 1.5, fontFamily: SANS }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '13px 16px', background: 'rgba(255,168,36,.07)', borderLeft: `3px solid ${C.gold}`, borderRadius: '0 8px 8px 0' }}>
              <span style={{ color: C.goldLight, fontWeight: 600, fontFamily: SANS }}>Note — </span>
              <span style={{ color: C.textSub, fontSize: 13.5, fontFamily: SANS }}>A 9.2/10 score does not mean that occupation disappears tomorrow. It means core tasks are highly automatable — placing it at elevated disruption risk over a 3–5 year horizon.</span>
            </div>
          </div>
        )}

        {/* Tax Tiers */}
        {tab === 2 && (
          <div>
            <p style={{ fontSize: 14, color: C.textSub, marginBottom: 18, maxWidth: 680, fontFamily: SANS, lineHeight: 1.6 }}>
              Each occupation group assigned to one of three fiscal contribution tiers based on <strong style={{ color: C.text, fontWeight: 600 }}>CBDT Annual Report data</strong> and <strong style={{ color: C.text, fontWeight: 600 }}>PLFS earnings information</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {taxTiers.map(({ tier, color, desc }) => (
                <div key={tier} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <div style={{ padding: '18px', display: 'flex', alignItems: 'flex-start', gap: 9, borderRight: `1px solid ${C.borderSub}`, background: 'rgba(237,241,255,.02)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text, fontFamily: SANS }}>{tier}</span>
                  </div>
                  <div style={{ padding: '18px', fontSize: 13.5, color: C.textSub, lineHeight: 1.6, fontFamily: SANS }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {tab === 3 && (
          <div>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '195px 215px 1fr', background: 'rgba(237,241,255,.04)', padding: '9px 16px' }}>
                {['Source', 'Organisation', 'Used For'].map(h => (
                  <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: C.textMuted, letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: SANS }}>{h}</span>
                ))}
              </div>
              {sources.map((s, i) => (
                <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '195px 215px 1fr', padding: '12px 16px', borderTop: `1px solid ${C.borderSub}`, background: i % 2 === 0 ? C.card : C.cardAlt, fontSize: 13.5, fontFamily: SANS }}>
                  <span style={{ fontWeight: 600, color: C.text }}>{s.name}</span>
                  <span style={{ color: C.textSub }}>{s.org}</span>
                  <span style={{ color: C.textSub }}>{s.use}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Limitations */}
        {tab === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, height: '100%' }}>
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 16 }}>Limitations & Caveats</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {limitations.map((l, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: C.textSub, lineHeight: 1.55, fontFamily: SANS }}>
                    <span style={{ color: C.textMuted, fontWeight: 700, flexShrink: 0 }}>—</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 16 }}>What this is not</h2>
              {[
                ['Not a prediction',  'This does not predict any specific job will disappear.'],
                ['Not anti-AI',       'AI transformation creates new occupations and productivity gains. This maps risk, not doom.'],
                ['Not official data', 'All occupation-level figures are estimates derived from publicly available aggregates.'],
                ['It IS a risk map',  'Designed to surface a structural policy question India has not yet formally addressed: what happens to government revenue when the workers who fund it are disrupted first?'],
              ].map(([title, desc]) => (
                <div key={title as string} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 4, fontFamily: SANS }}>{title}</div>
                  <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.55, fontFamily: SANS }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
