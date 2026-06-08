import { useEffect } from 'react';
import { MetricKey, OccupationData, DatasetMetadata } from '../types/occupation';
import { METRIC_CONFIG, DIVISION_COLORS } from '../utils/colorScale';

interface Division { code: string; name: string; total_workforce_million?: number; }

interface Props {
  metric: MetricKey;
  divisions: Division[];
  activeDivisions: string[];
  onToggleDivision: (c: string) => void;
  occupations: OccupationData[];
  metadata: DatasetMetadata;
}

export default function BottomBar({
  metric, divisions, activeDivisions, onToggleDivision, occupations, metadata,
}: Props) {
  const cfg = METRIC_CONFIG[metric];
  const gradStyle = { background: `linear-gradient(to right, ${cfg.colorRange.join(', ')})` };

  async function downloadJSON() {
    const blob = new Blob([JSON.stringify({ metadata, occupations }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'india-workforce-data.json'; a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPDF() {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const el = document.querySelector('.main-area') as HTMLElement;
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: '#080c18', scale: 1.5, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfW / canvas.width, pdfH / canvas.height);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save('india-workforce-intelligence.pdf');
    } catch {
      window.print();
    }
  }

  // Wire header export buttons to these functions
  useEffect(() => {
    const jsonBtn = document.getElementById('header-export-json');
    const pdfBtn  = document.getElementById('header-export-pdf');
    if (jsonBtn) jsonBtn.onclick = downloadJSON;
    if (pdfBtn)  pdfBtn.onclick  = exportPDF;
  });

  return (
    <div className="bottom-bar">
      {/* Legend gradient */}
      <div className="legend-block">
        <span className="legend-title">{cfg.label}:</span>
        <span className="legend-end">{cfg.lowLabel}</span>
        <div className="legend-grad" style={gradStyle} />
        <span className="legend-end">{cfg.highLabel}</span>
      </div>

      <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />

      {/* Division dots */}
      <div className="legend-divs">
        {divisions.map(d => {
          const active = activeDivisions.length === 0 || activeDivisions.includes(d.code);
          return (
            <div
              key={d.code}
              className="legend-div-item"
              style={{ opacity: active ? 1 : 0.3 }}
              onClick={() => onToggleDivision(d.code)}
              title={d.name}
            >
              <div className="legend-div-dot" style={{ background: DIVISION_COLORS[d.code] }} />
              <span>{d.name.split(',')[0].split('&')[0].trim().split(' ').slice(0, 2).join(' ')}</span>
            </div>
          );
        })}
      </div>

      {/* Author credit — bottom right */}
      <a
        href="https://www.linkedin.com/in/raghavendrachandrasekar/"
        target="_blank"
        rel="noopener noreferrer"
        className="bottom-author"
      >
        <img src="https://github.com/raghavrajpillai.png" alt="Raghavendra" className="bottom-author-avatar" />
        <div className="bottom-author-text">
          <span className="bottom-author-built">Built by</span>
          <span className="bottom-author-name">Raghavendra Chandrasekar</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a66c2" style={{ flexShrink: 0 }}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
    </div>
  );
}
