import { OccupationData, DatasetMetadata } from '../types/occupation';

interface Props {
  occupations: OccupationData[];
  metadata: DatasetMetadata;
}

export default function ExportButtons({ occupations, metadata }: Props) {

  function downloadJSON() {
    const payload = { metadata, occupations };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'india-workforce-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPDF() {
    try {
      // Dynamic import to avoid bundling issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const el = document.querySelector('.main-area') as HTMLElement;
      if (!el) return;

      const canvas = await html2canvas(el, {
        backgroundColor: '#080c18',
        scale: 1.5,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3',
      });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfW / canvas.width, pdfH / canvas.height);

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save('india-workforce-intelligence.pdf');
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF export failed. Try using Ctrl+P / browser print instead.');
    }
  }

  return (
    <div className="export-bar">
      <span className="data-note">
        Data: PLFS 2023-24 (NSO/MoSPI) · NCO-2004 (DGE/MoLE) · AI scores: LLM-inferred estimates
      </span>
      <button className="export-btn" onClick={downloadJSON} title="Download canonical dataset as JSON">
        ⬇ JSON
      </button>
      <button className="export-btn primary" onClick={exportPDF} title="Export visualisation as PDF">
        ⬇ PDF
      </button>
    </div>
  );
}
