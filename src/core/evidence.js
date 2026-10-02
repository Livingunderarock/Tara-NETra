// TĀRĀ Evidence & Hashing Service — SHA-256 + PDF generation

import jsPDF from 'jspdf';

// SHA-256 hash using Web Crypto API
export async function computeSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate audit-ready PDF report
export async function generateReport(analysisData, complianceData, configText) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  const margin = 15;
  const lineHeight = 6;
  const maxWidth = pageWidth - margin * 2;

  const configHash = await computeSHA256(configText);

  // Helper functions
  const addLine = (text, size = 10, style = 'normal', color = [220, 220, 220]) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight;
  };

  const addSeparator = () => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setDrawColor(212, 168, 67);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // Background
  doc.setFillColor(13, 15, 25);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 168, 67);
  doc.text('TARA-NETRA', margin, y);
  y += 10;

  addLine('TARA PROOF — Audit Evidence Report', 14, 'bold', [0, 229, 255]);
  y += 3;
  addLine('Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance', 8, 'normal', [150, 150, 150]);
  y += 5;
  addSeparator();

  // Report metadata
  addLine('REPORT METADATA', 12, 'bold', [212, 168, 67]);
  y += 2;
  addLine(`Report Generated: ${new Date().toLocaleString()}`, 9);
  addLine(`Report ID: TARA-${Date.now()}`, 9);
  y += 3;

  // Device information
  addSeparator();
  addLine('DEVICE INFORMATION', 12, 'bold', [212, 168, 67]);
  y += 2;
  addLine(`Device: ${analysisData.deviceName || 'Unknown'}`, 9);
  addLine(`Vendor: ${analysisData.vendor?.vendor || 'Unknown'}`, 9);
  addLine(`Vendor Confidence: ${analysisData.vendor?.confidence || 0}%`, 9);
  addLine(`Configuration Hash (SHA-256): ${configHash}`, 8, 'normal', [0, 229, 255]);
  y += 3;

  // Interpretation Summary
  addSeparator();
  addLine('INTERPRETATION SUMMARY', 12, 'bold', [212, 168, 67]);
  y += 2;
  const stats = analysisData.stats;
  addLine(`Total Lines Analyzed: ${stats.total}`, 9);
  addLine(`Recognized: ${stats.recognized} | Inferred: ${stats.inferred} | Learned: ${stats.learned}`, 9);
  addLine(`Low Confidence: ${stats.lowConfidence} | Unknown: ${stats.unknown}`, 9);
  addLine(`Recognition Rate: ${stats.recognizedPercent}%`, 9, 'bold', [0, 230, 118]);
  y += 3;

  // Compliance Summary
  addSeparator();
  addLine('COMPLIANCE SUMMARY', 12, 'bold', [212, 168, 67]);
  y += 2;
  const summary = complianceData.summary;
  addLine(`Total Controls Evaluated: ${summary.total}`, 9);
  addLine(`PASS: ${summary.pass}`, 9, 'normal', [0, 230, 118]);
  addLine(`FAIL: ${summary.fail}`, 9, 'normal', [255, 82, 82]);
  addLine(`UNKNOWN: ${summary.unknown}`, 9, 'normal', [255, 171, 0]);
  addLine(`Overall Compliance: ${summary.compliancePercent}%`, 10, 'bold', [0, 229, 255]);
  y += 3;

  // Framework Scores
  addSeparator();
  addLine('FRAMEWORK SCORES', 12, 'bold', [212, 168, 67]);
  y += 2;
  for (const [fw, score] of Object.entries(complianceData.frameworkScores)) {
    addLine(`${fw}: ${score.percent}% (${score.pass}/${score.total} pass)`, 9);
  }
  y += 3;

  // Findings Detail
  addSeparator();
  addLine('FINDINGS', 12, 'bold', [212, 168, 67]);
  y += 2;

  for (const result of complianceData.results) {
    if (y > 250) { doc.addPage(); y = 20; 
      doc.setFillColor(13, 15, 25);
      doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
    }

    const statusColor = result.status === 'PASS' ? [0, 230, 118] : result.status === 'FAIL' ? [255, 82, 82] : [255, 171, 0];
    addLine(`[${result.status}] ${result.controlId} — ${result.controlName}`, 9, 'bold', statusColor);
    addLine(`  Category: ${result.category} | Severity: ${result.severity}`, 8, 'normal', [180, 180, 180]);
    addLine(`  Expected: ${JSON.stringify(result.expected)} | Observed: ${JSON.stringify(result.observed)}`, 8, 'normal', [180, 180, 180]);
    if (result.evidence) {
      addLine(`  Evidence: Line ${result.evidence.lineNumber} (${result.evidence.source})`, 8, 'normal', [150, 150, 150]);
    }
    y += 2;
  }

  // Evidence Hashes
  doc.addPage();
  y = 20;
  doc.setFillColor(13, 15, 25);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  addSeparator();
  addLine('TAMPER-EVIDENT HASHES', 12, 'bold', [212, 168, 67]);
  y += 2;
  addLine(`Configuration SHA-256:`, 9, 'bold', [0, 229, 255]);
  addLine(configHash, 8, 'normal', [180, 180, 180]);
  y += 3;

  const reportContent = JSON.stringify({ analysisData: analysisData.stats, complianceData: complianceData.summary });
  const reportHash = await computeSHA256(reportContent);
  addLine(`Report Content SHA-256:`, 9, 'bold', [0, 229, 255]);
  addLine(reportHash, 8, 'normal', [180, 180, 180]);
  y += 5;

  addSeparator();
  addLine('TARA-NETRA — The Guiding Eye for Network Security', 10, 'italic', [212, 168, 67]);
  addLine('Understand. Learn. Audit. Assure.', 9, 'italic', [150, 150, 150]);
  y += 3;
  addLine('This report was generated entirely in-browser. No configuration data was transmitted externally.', 8, 'normal', [100, 100, 100]);

  // Save
  doc.save(`TARA-NETRA-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  return { configHash, reportHash };
}
