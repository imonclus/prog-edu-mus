import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function PdfExportButton({ targetId, filename }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    setIsExporting(true);

    try {
      const opt = {
        margin: [15, 15, 15, 15],
        filename: filename || 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hi ha hagut un error en generar el PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn btn-primary"
      title="Descarregar com a PDF"
    >
      {isExporting ? (
        <Loader2 size={18} className="spinner" />
      ) : (
        <Download size={18} />
      )}
      <span>{isExporting ? 'Generant...' : 'Descarregar PDF'}</span>
    </button>
  );
}
