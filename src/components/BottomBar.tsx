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

      {/* Export */}
      <div className="export-group">
        <button className="export-btn" onClick={downloadJSON}>⬇ JSON</button>
        <button className="export-btn primary" onClick={exportPDF}>⬇ PDF</button>
      </div>
    </div>
  );
}
