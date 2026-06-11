import { useNavigate } from 'react-router-dom';

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

const C = {
  bg:        '#070A18',
  card:      '#101A2E',
  text:      '#EDF1FF',
  textSub:   '#7D97C9',
  textMuted: '#3B5282',
  border:    'rgba(237,241,255,.06)',
  borderSub: 'rgba(237,241,255,.04)',
  red:       '#FF4B4B',
  blue:      '#4EAAFF',
  gold:      '#FFA824',
};

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      height: 'calc(100vh - 60px)',
      display: 'grid', gridTemplateColumns: '42% 58%',
      overflow: 'hidden',
      background: C.bg,
      fontFamily: SANS,
    }}>

      {/* LEFT — author + text + CTAs */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 52px',
        borderRight: `1px solid ${C.border}`,
      }}>
        <img
          src="/india-workforce-intelligence/avatar.png"
          alt="Raghavendra Chandrasekar"
          style={{
            width: 76, height: 76, borderRadius: '50%',
            objectFit: 'cover', objectPosition: 'center top',
            marginBottom: 22, flexShrink: 0,
            border: `2.5px solid rgba(255,168,36,.55)`,
          }}
        />

        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 9, fontFamily: SANS }}>
          Project · Author · Intent
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: '-.3px', margin: '0 0 5px', lineHeight: 1.2 }}>
          Raghavendra Chandrasekar
        </h1>
        <p style={{ fontSize: 13, color: C.textSub, margin: '0 0 20px', fontFamily: SANS }}>
          Director — Khoj Information Technology Pvt Ltd
        </p>

        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.7, margin: '0 0 14px', fontFamily: SANS }}>
          India's formal knowledge workers fund 100% of the country's direct tax base. They are also the first group AI will reach. The informal 320M who are safe from AI pay zero tax and cannot replace that revenue.
        </p>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.7, margin: '0 0 26px', fontFamily: SANS }}>
          This project was built to make that contradiction visible — with data, at scale, in public.
        </p>

        <div style={{ display: 'flex', gap: 9, marginBottom: 14, flexWrap: 'wrap' }}>
          <a href="https://linkedin.com/in/raghavendrachandrasekar" target="_blank" rel="noreferrer"
            style={{ padding: '6px 15px', border: `1px solid rgba(237,241,255,.14)`, borderRadius: 5, fontSize: 13, fontWeight: 500, color: C.blue, textDecoration: 'none', fontFamily: SANS }}>
            LinkedIn →
          </a>
          <a href="https://github.com/raghavrajpillai" target="_blank" rel="noreferrer"
            style={{ padding: '6px 15px', border: `1px solid rgba(237,241,255,.14)`, borderRadius: 5, fontSize: 13, fontWeight: 500, color: C.blue, textDecoration: 'none', fontFamily: SANS }}>
            GitHub →
          </a>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/explore')}>Explore the Data →</button>
          <button className="btn-ghost" onClick={() => navigate('/methodology')}>Methodology</button>
        </div>
      </div>

      {/* RIGHT — what was built + data note */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 60px',
      }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-.3px', margin: '0 0 18px' }}>
          What was built
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📊', title: 'Research Dataset',   desc: '116 NCO-2004 occupation groups mapped against AI exposure and tax contribution tier, built on PLFS 2023-24 data.', accent: C.blue },
            { icon: '🗺',  title: 'This Platform',      desc: 'A narrative-first intelligence platform — editorial homepage, interactive treemap, and full methodology documentation.', accent: C.gold },
          ].map(card => (
            <div key={card.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${card.accent}`, borderRadius: 9, padding: '20px 16px' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 7, fontFamily: SANS }}>{card.title}</div>
              <p style={{ fontSize: 12, color: C.textSub, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', background: 'rgba(237,241,255,.03)', borderRadius: 9, border: `1px solid ${C.border}`, marginBottom: 22 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 5, fontFamily: SANS }}>Data & Openness</div>
          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.65, margin: 0, fontFamily: SANS }}>
            All underlying data sources are publicly available from the Government of India (PLFS, NCO-2004, CBDT Annual Reports). Analysis and AI scoring methodology are documented in full on the{' '}
            <button onClick={() => navigate('/methodology')} style={{ background: 'none', border: 'none', color: C.blue, cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', padding: 0, fontFamily: SANS }}>
              Methodology page
            </button>.
            Occupation-level workforce figures are modelled estimates, not official statistics.
          </p>
        </div>

        <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
          Research feedback, data corrections, or collaboration —{' '}
          <a href="https://linkedin.com/in/raghavendrachandrasekar" target="_blank" rel="noreferrer" style={{ color: C.textSub, textDecoration: 'none' }}>reach out on LinkedIn</a>.
        </p>
      </div>
    </div>
  );
}
