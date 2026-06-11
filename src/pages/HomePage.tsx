import { useNavigate } from 'react-router-dom';

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

const C = {
  bg:        '#070A18',
  bgAlt:     '#0C1226',
  card:      '#101A2E',
  text:      '#EDF1FF',
  textSub:   '#7D97C9',
  textMuted: '#3B5282',
  textDim:   '#1A2640',
  border:    'rgba(237,241,255,.06)',
  borderHov: 'rgba(237,241,255,.15)',
  red:       '#FF4B4B',
  blue:      '#4EAAFF',
  gold:      '#FFA824',
};

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{
      height: 'calc(100vh - 60px)',
      display: 'grid', gridTemplateColumns: '52% 48%',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 28% 55%, #0E1B38 0%, #070A18 68%)',
      fontFamily: SANS,
    }}>

      {/* LEFT — headline + subtext + CTAs */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 64px',
        borderRight: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 22, fontFamily: SANS }}>
          PLFS 2023-24 · 622 Million Workers Mapped
        </div>
        <h1 style={{
          fontFamily: SERIF,
          fontSize: 'clamp(38px, 4.8vw, 64px)',
          fontWeight: 900, color: C.text,
          lineHeight: 1.08, letterSpacing: '-.5px',
          margin: '0 0 22px',
        }}>
          India's AI problem<br />is becoming a<br />
          <em style={{ color: C.red, fontStyle: 'italic' }}>fiscal crisis.</em>
        </h1>
        <p style={{ fontSize: 16, color: C.textSub, lineHeight: 1.65, margin: '0 0 36px', maxWidth: 440, fontFamily: SANS }}>
          622 million workers mapped against AI disruption exposure and tax contribution — for the first time.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/explore')}>
            Explore the Data →
          </button>
          <button className="btn-ghost" onClick={() => navigate('/methodology')}>
            Read Methodology
          </button>
        </div>
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid ${C.textDim}`, fontSize: 11.5, color: C.textMuted, lineHeight: 1.7, fontFamily: SANS }}>
          Source: PLFS 2023-24 · NCO-2004 · CBDT Annual Reports · Open Government Data.<br />
          AI scores are LLM-inferred estimates. Not official statistics.
        </div>
      </div>

      {/* RIGHT — 3 KPI cards */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 52px', gap: 12,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 6, fontFamily: SANS }}>
          Key Findings
        </div>

        {/* 146M */}
        <div style={{ background: C.card, borderRadius: 10, padding: '22px 26px', border: `1px solid ${C.border}`, borderTop: `2px solid ${C.red}` }}>
          <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 700, color: C.red, letterSpacing: -1.5, lineHeight: 1, marginBottom: 9 }}>146M</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3, fontFamily: SANS }}>Workers at medium-to-high AI risk</div>
          <div style={{ fontSize: 12.5, color: C.textSub, fontFamily: SANS }}>IT, Finance, Legal, Admin — nearly 1 in 4 Indians</div>
        </div>

        {/* 91% */}
        <div style={{ background: C.card, borderRadius: 10, padding: '22px 26px', border: `1px solid ${C.border}`, borderTop: `2px solid ${C.blue}` }}>
          <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 700, color: C.blue, letterSpacing: -1.5, lineHeight: 1, marginBottom: 9 }}>91%</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3, fontFamily: SANS }}>Of direct taxpayers in AI-exposed occupations</div>
          <div style={{ fontSize: 12.5, color: C.textSub, fontFamily: SANS }}>Only 3.5M out of 38.3M direct taxpayers are in low-risk roles</div>
        </div>

        {/* 14.3M */}
        <div style={{ background: C.card, borderRadius: 10, padding: '22px 26px', border: `1px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderLeft: `3px solid ${C.gold}` }}>
          <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 700, color: C.gold, letterSpacing: -1.5, lineHeight: 1, marginBottom: 9 }}>14.3M</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3, fontFamily: SANS }}>
            Workers in the fiscal{' '}
            <span style={{ color: C.gold, fontFamily: SERIF, fontStyle: 'italic' }}>"Danger Zone"</span>
          </div>
          <div style={{ fontSize: 12.5, color: C.textSub, fontFamily: SANS }}>At the exact intersection of AI job risk and direct tax contribution</div>
        </div>
      </div>
    </div>
  );
}
