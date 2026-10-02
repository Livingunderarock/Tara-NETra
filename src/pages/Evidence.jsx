import React, { useState } from 'react';
import { generateReport, computeSHA256 } from '../core/evidence';

export default function Evidence({ analysisResult, complianceResult, configText, showToast }) {
  const [generating, setGenerating] = useState(false);
  const [hashes, setHashes] = useState(null);

  const handleGenerateReport = async () => {
    if (!analysisResult || !complianceResult || !configText) {
      showToast('Analyze a configuration first', 'error');
      return;
    }
    setGenerating(true);
    try {
      const result = await generateReport(analysisResult, complianceResult, configText);
      setHashes(result);
      showToast('TĀRĀ PROOF report generated and downloaded');
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
    setGenerating(false);
  };

  const handleComputeHash = async () => {
    if (!configText) return;
    const hash = await computeSHA256(configText);
    setHashes(prev => ({ ...prev, configHash: hash }));
    showToast('SHA-256 hash computed');
  };

  const hasData = !!analysisResult && !!complianceResult;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">◎ TĀRĀ Proof</h1>
        <p className="page-subtitle">Audit-ready evidence generation with tamper-evident hashing</p>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <div className="empty-state-text">Analyze a configuration first to generate evidence</div>
        </div>
      ) : (
        <>
          {/* Report Preview */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-title">Report Preview</div>

            <div className="grid-2">
              {/* Device Info */}
              <div>
                <div className="form-label">Device Information</div>
                <table className="data-table" style={{ fontSize: '0.8rem' }}>
                  <tbody>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Device ID</td><td>{analysisResult.deviceName || 'Unknown'}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Vendor</td><td>{analysisResult.vendor?.vendor || 'Unknown'}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Vendor Confidence</td><td>{analysisResult.vendor?.confidence || 0}%</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Analysis Timestamp</td><td>{analysisResult.timestamp}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Assessment Summary */}
              <div>
                <div className="form-label">Assessment Summary</div>
                <table className="data-table" style={{ fontSize: '0.8rem' }}>
                  <tbody>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Controls Evaluated</td><td>{complianceResult.summary.total}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-success)' }}>PASS</td><td>{complianceResult.summary.pass}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-danger)' }}>FAIL</td><td>{complianceResult.summary.fail}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-warning)' }}>UNKNOWN</td><td>{complianceResult.summary.unknown}</td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--color-text)' }}>Compliance</td><td style={{ fontWeight: 700, color: 'var(--color-cyan)' }}>{complianceResult.summary.compliancePercent}%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interpretation Stats */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <div className="form-label">Interpretation Summary</div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                <span>Lines: <strong>{analysisResult.stats.total}</strong></span>
                <span style={{ color: 'var(--color-success)' }}>Recognized: <strong>{analysisResult.stats.recognized}</strong></span>
                <span style={{ color: 'var(--color-cyan)' }}>Inferred: <strong>{analysisResult.stats.inferred}</strong></span>
                <span style={{ color: 'var(--color-purple)' }}>Learned: <strong>{analysisResult.stats.learned}</strong></span>
                <span style={{ color: 'var(--color-warning)' }}>Low Confidence: <strong>{analysisResult.stats.lowConfidence}</strong></span>
                <span style={{ color: 'var(--color-danger)' }}>Unknown: <strong>{analysisResult.stats.unknown}</strong></span>
              </div>
            </div>

            {/* Framework Scores */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <div className="form-label">Framework Scores</div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                {Object.entries(complianceResult.frameworkScores).map(([fw, score]) => (
                  <div key={fw} style={{ fontSize: '0.8rem' }}>
                    <strong>{fw}:</strong> {score.percent}% ({score.pass}/{score.total})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SHA-256 Hashes */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="card-title">Tamper-Evident Hashes</div>
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  Configuration SHA-256
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-bg-deep)',
                  borderRadius: 'var(--radius-sm)',
                  color: hashes?.configHash ? 'var(--color-text)' : 'var(--color-text-muted)',
                  wordBreak: 'break-all',
                }}>
                  {hashes?.configHash || 'Not yet computed — generate report to calculate'}
                </div>
              </div>
              {hashes?.reportHash && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Report Content SHA-256
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'var(--color-bg-deep)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text)',
                    wordBreak: 'break-all',
                  }}>
                    {hashes.reportHash}
                  </div>
                </div>
              )}
            </div>

            {!hashes?.configHash && (
              <button className="btn btn-secondary btn-sm" onClick={handleComputeHash} style={{ marginTop: 'var(--space-md)' }}>
                # Compute Hash
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
              disabled={generating}
            >
              {generating ? '⟳ Generating...' : '◎ Generate TĀRĀ PROOF PDF'}
            </button>
          </div>

          {/* Security Notice */}
          <div style={{
            marginTop: 'var(--space-xl)',
            padding: 'var(--space-md)',
            background: 'rgba(0, 229, 255, 0.03)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            🔒 This report was generated entirely in-browser. No configuration data was transmitted to external services.
            All processing occurs locally using the TĀRĀ Intelligence Core.
          </div>
        </>
      )}
    </div>
  );
}
