// TĀRĀ Evidence & Hashing Service — SHA-256 + Audit Certificate PDF Generation
// Designed as an ancient astronomical manuscript & precision audit document

import jsPDF from 'jspdf';

// SHA-256 hash using Web Crypto API
export async function computeSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate audit-ready PDF document in parchment & ink aesthetic
export async function generateReport(analysisData, complianceData, configText) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 24;
  const margin = 18;
  const lineHeight = 5.5;
  const maxWidth = pageWidth - margin * 2;

  const configHash = await computeSHA256(configText);

  // Helper to paint page background & subtle astronomical border
  const paintPageGround = () => {
    // Aged warm parchment background
    doc.setFillColor(232, 222, 204);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Thin double manuscript border
    doc.setDrawColor(176, 138, 60);
    doc.setLineWidth(0.4);
    doc.rect(margin - 6, margin - 6, pageWidth - (margin - 6) * 2, pageHeight - (margin - 6) * 2);

    doc.setDrawColor(112, 105, 92);
    doc.setLineWidth(0.15);
    doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

    // Corner yantra tick marks
    const tickLen = 5;
    doc.setDrawColor(166, 106, 44);
    doc.setLineWidth(0.5);
    // Top-left
    doc.line(margin - 6, margin - 6 + tickLen, margin - 6 + tickLen, margin - 6);
    // Top-right
    doc.line(pageWidth - margin + 6 - tickLen, margin - 6, pageWidth - margin + 6, margin - 6 + tickLen);
    // Bottom-left
    doc.line(margin - 6, pageHeight - margin + 6 - tickLen, margin - 6 + tickLen, pageHeight - margin + 6);
    // Bottom-right
    doc.line(pageWidth - margin + 6 - tickLen, pageHeight - margin + 6, pageWidth - margin + 6, pageHeight - margin + 6 - tickLen);
  };

  const addLine = (text, size = 9.5, style = 'normal', color = [39, 35, 29], indent = 0) => {
    if (y > 265) {
      doc.addPage();
      paintPageGround();
      y = 24;
    }
    doc.setFontSize(size);
    doc.setFont('times', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    doc.text(lines, margin + indent, y);
    y += lines.length * lineHeight;
  };

  const addSeparator = (title = null) => {
    if (y > 255) {
      doc.addPage();
      paintPageGround();
      y = 24;
    }
    y += 2;
    doc.setDrawColor(176, 138, 60);
    doc.setLineWidth(0.35);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    if (title) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(166, 106, 44);
      doc.text(title.toUpperCase(), margin, y);
      y += 5;
    }
  };

  // ─── First Page ───
  paintPageGround();

  // Document Title & Heading
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.setTextColor(32, 38, 58);
  doc.text('TĀRĀ-NETRA', margin, y);
  y += 7;

  doc.setFontSize(11);
  doc.setFont('times', 'italic');
  doc.setTextColor(166, 106, 44);
  doc.text('TĀRĀ PROOF — Compliance & Verification Audit Certificate', margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(112, 105, 92);
  doc.text('Trustworthy Adaptive Risk Analytics • Network Reasoning & Assurance', margin, y);
  y += 6;

  // Metadata Block
  addSeparator('Audit Metadata');
  addLine(`Timestamp: ${new Date().toUTCString()}`, 9);
  addLine(`Report Certificate ID: TN-${Date.now().toString(36).toUpperCase()}`, 9);
  addLine(`Target Device: ${analysisData.deviceName || 'Unknown Appliance'}`, 9);
  addLine(`Detected Operating System: ${analysisData.vendor?.vendor || 'Unknown'} (${analysisData.vendor?.confidence || 0}% confidence)`, 9);

  // Interpretation Summary Block
  addSeparator('Observation & Parsing Precision');
  const stats = analysisData.stats;
  addLine(`Total Directives Analyzed: ${stats.total}`, 9);
  addLine(`Recognized: ${stats.recognized}  |  Cross-Vendor Inferred: ${stats.inferred}  |  Locally Learned: ${stats.learned}`, 9);
  addLine(`Low Confidence: ${stats.lowConfidence}  |  Unresolved Constructs: ${stats.unknown}`, 9);
  addLine(`Recognition Precision Rate: ${stats.recognizedPercent}%`, 9.5, 'bold', [45, 107, 63]);

  // Compliance Summary
  addSeparator('Compliance Assurance Evaluation');
  const summary = complianceData.summary;
  addLine(`Total Standard Controls Evaluated: ${summary.total}`, 9);
  addLine(`Satisfied (Pass): ${summary.pass}`, 9, 'normal', [45, 107, 63]);
  addLine(`Deficiencies (Fail): ${summary.fail}`, 9, 'normal', [166, 52, 40]);
  addLine(`Unverified (Unknown): ${summary.unknown}`, 9, 'normal', [181, 121, 43]);
  addLine(`Aggregate Compliance Index: ${summary.compliancePercent}%`, 10, 'bold', [32, 38, 58]);

  // Framework Breakdown
  addSeparator('Standard Regulatory Crosswalk');
  for (const [fw, score] of Object.entries(complianceData.frameworkScores)) {
    addLine(`${fw}: ${score.percent}% assurance (${score.pass}/${score.total} controls compliant)`, 9);
  }

  // Findings Detail Section
  addSeparator('Specific Audit Findings');
  for (const result of complianceData.results) {
    if (y > 250) {
      doc.addPage();
      paintPageGround();
      y = 24;
    }

    const statusColor = result.status === 'PASS' ? [45, 107, 63] : result.status === 'FAIL' ? [166, 52, 40] : [181, 121, 43];
    addLine(`[${result.status}] ${result.controlId} — ${result.controlName}`, 9, 'bold', statusColor);
    addLine(`Domain: ${result.category} | Severity: ${result.severity}`, 8, 'normal', [112, 105, 92], 4);
    addLine(`Expected: ${JSON.stringify(result.expected)} | Observed: ${JSON.stringify(result.observed) || 'None'}`, 8, 'normal', [39, 35, 29], 4);
    if (result.evidence) {
      addLine(`Evidence: Line ${result.evidence.lineNumber} (${result.evidence.source})`, 7.5, 'italic', [112, 105, 92], 4);
    }
    y += 1.5;
  }

  // Final Page: Cryptographic Hashes & Tamper-Evident Signatures
  doc.addPage();
  paintPageGround();
  y = 24;

  addSeparator('Cryptographic Integrity Verification');
  addLine('Configuration SHA-256 Digest:', 9, 'bold', [166, 106, 44]);
  addLine(configHash, 8, 'normal', [32, 38, 58], 4);
  y += 3;

  const reportContent = JSON.stringify({ analysis: analysisData.stats, compliance: complianceData.summary, ts: analysisData.timestamp });
  const reportHash = await computeSHA256(reportContent);
  addLine('Audit Findings SHA-256 Digest:', 9, 'bold', [166, 106, 44]);
  addLine(reportHash, 8, 'normal', [32, 38, 58], 4);
  y += 6;

  addSeparator();
  addLine('TĀRĀ-NETRA — The Guiding Eye for Network Security', 10, 'italic', [166, 106, 44]);
  addLine('Understand. Learn. Audit. Assure.', 9, 'italic', [112, 105, 92]);
  y += 3;
  addLine('This audit certificate was rendered entirely within the local browser runtime using Web Crypto SHA-256 primitives. No proprietary configuration text or administrative credentials were transmitted across the network.', 8, 'normal', [112, 105, 92]);

  doc.save(`TARA-NETRA-Audit-${new Date().toISOString().split('T')[0]}.pdf`);
  return { configHash, reportHash };
}
