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
      showToast('TĀRĀ PROOF audit certificate generated');
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
    setGenerating(false);
  };

  const handleComputeHash = async () => {
    if (!configText) return;
    const hash = await computeSHA256(configText);
    setHashes(prev => ({ ...prev, configHash: hash }));
    showToast('Configuration SHA-256 digest computed');
  };

  const hasData = !!analysisResult && !!complianceResult;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Cryptographic Assurance</div>
          <h1 className="page-title">TĀRĀ Proof</h1>
          <div className="page-subtitle">
            Audit-ready evidence generation with tamper-evident SHA-256 verification
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <span className="empty-state-symbol">◎</span>
          <div className="empty-state-text">Analyze a configuration first to compile audit evidence</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-xl)' }}>
          {/* Certificate Document Preview */}
          <div className="card" style={{ borderTop: '2px solid var(--color-indigo)' }}>
            <div className="card-title">Audit Document Preview</div>
            <div className="card-subtext">Verified snapshot of current device security posture</div>

            {/* Device Profile Table */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-label">Device &amp; Inspection Context</div>
              <table className="audit-table" style={{ fontSize: '0.78rem' }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, width: '160px' }}>Device Identifier</td>
                    <td>{analysisResult.deviceName || 'Unknown Appliance'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Operating System</td>
                    <td>{analysisResult.vendor?.vendor || 'Unknown'} ({analysisResult.vendor?.confidence || 0}% confidence)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Inspection Timestamp</td>
                    <td>{new Date(analysisResult.timestamp).toUTCString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Assessment Metrics Table */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-label">Compliance Evaluation Summary</div>
              <table className="audit-table" style={{ fontSize: '0.78rem' }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, width: '160px' }}>Controls Evaluated</td>
                    <td>{complianceResult.summary.total}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--color-pass)' }}>Satisfied (Pass)</td>
                    <td style={{ color: 'var(--color-pass)' }}>{complianceResult.summary.pass}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--color-fail)' }}>Deficiencies (Fail)</td>
                    <td style={{ color: 'var(--color-fail)' }}>{complianceResult.summary.fail}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--color-unknown)' }}>Unverified (Unknown)</td>
                    <td style={{ color: 'var(--color-unknown)' }}>{complianceResult.summary.unknown}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Compliance Index</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-indigo)' }}>{complianceResult.summary.compliancePercent}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Regulatory Crosswalk List */}
            <div>
              <div className="detail-label">Regulatory Benchmark Alignment</div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', marginTop: 'var(--space-xs)' }}>
                {Object.entries(complianceResult.frameworkScores).map(([fw, score]) => (
                  <div key={fw} style={{ fontSize: '0.78rem' }}>
                    <strong style={{ color: 'var(--color-indigo)' }}>{fw}:</strong> {score.percent}% ({score.pass}/{score.total})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic Hashes & Export */}
          <div>
            <div className="card" style={{ borderTop: '2px solid var(--color-ochre)', marginBottom: 'var(--space-lg)' }}>
              <div className="card-title">Cryptographic Integrity Signatures</div>
              <div className="card-subtext">SHA-256 hashes verifying immutable evidentiary state</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <div className="detail-label">Source Configuration SHA-256 Digest</div>
                  <div className="hash-container">
                    {hashes?.configHash || 'Digest not yet computed'}
                  </div>
                </div>

                {hashes?.reportHash && (
                  <div>
                    <div className="detail-label">Audit Content SHA-256 Digest</div>
                    <div className="hash-container">
                      {hashes.reportHash}
                    </div>
                  </div>
                )}

                {!hashes?.configHash && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleComputeHash}
                    >
                      Compute SHA-256 Digest
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Export Action */}
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <span className="empty-state-symbol">◎</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-indigo)', marginBottom: 'var(--space-xs)' }}>
                TĀRĀ PROOF Certificate
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-lg)' }}>
                Render an archival PDF audit certificate with tamper-evident cryptographic digests and full evidence chain.
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerateReport}
                disabled={generating}
                style={{ width: '100%' }}
              >
                {generating ? 'Compiling Audit Certificate...' : 'Generate TĀRĀ PROOF PDF'}
              </button>

              <div style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)', marginTop: 'var(--space-md)' }}>
                🔒 Generated entirely within the browser. Zero remote transmission.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
