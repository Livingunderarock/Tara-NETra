import React, { useState } from 'react';

export default function Remediation({ complianceResult, analysisResult }) {
  const [selectedFix, setSelectedFix] = useState(null);
  const [approved, setApproved] = useState({});

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Actionable Resolution</div>
            <h1 className="page-title">TĀRĀ Resolve</h1>
            <div className="page-subtitle">Technical remediation instructions</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-state-symbol">↻</span>
          <div className="empty-state-text">Analyze a configuration first to generate remediation instructions</div>
        </div>
      </div>
    );
  }

  const failures = complianceResult.results.filter(r => r.status === 'FAIL');
  const vendor = analysisResult?.vendor?.vendor || 'Generic';

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Technical Resolution</div>
          <h1 className="page-title">TĀRĀ Resolve</h1>
          <div className="page-subtitle">
            {failures.length} remediation directives for {analysisResult?.deviceName || 'device'} ({vendor})
          </div>
        </div>
      </div>

      {/* Process Pipeline */}
      <div className="process-line" style={{ marginBottom: 'var(--space-2xl)' }}>
        {['Detected', 'Recommended', 'Simulate', 'Human Approval', 'Export'].map((step, i) => (
          <React.Fragment key={step}>
            {i > 0 && <span className="process-arrow">→</span>}
            <span className="process-step" style={{ color: i <= 1 ? 'var(--color-indigo)' : 'var(--color-ink-muted)' }}>
              {step}
            </span>
          </React.Fragment>
        ))}
      </div>

      {failures.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ color: 'var(--color-pass)', fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>All evaluated controls passing</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            No remediation actions required for this device configuration.
          </div>
        </div>
      ) : (
        <div className="findings-layout">
          {/* Left Column: Failure list */}
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ink-muted)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              Deficiencies Requiring Correction ({failures.length})
            </div>

            {failures.map((finding, i) => (
              <div
                key={i}
                className={`finding-card fail ${selectedFix?.controlId === finding.controlId ? 'selected' : ''}`}
                onClick={() => setSelectedFix(finding)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className={`badge badge-${finding.severity.toLowerCase()}`}>
                      {finding.severity}
                    </span>
                    {approved[finding.controlId] && (
                      <span className="badge badge-pass">Approved</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
                    {finding.controlId}
                  </span>
                </div>

                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                  {finding.controlName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                  {finding.category}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Remediation Instruction Sheet */}
          <div>
            {selectedFix ? (
              <div className="card" style={{ borderTop: '2px solid var(--color-ochre)' }}>
                <div className="card-title">Remediation Directive Sheet</div>

                {/* Finding Summary */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="detail-label">Deficiency</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-fail)' }}>
                    {selectedFix.controlName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                    {selectedFix.description}
                  </div>
                </div>

                {/* Target Device */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="detail-label">Target Appliance</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-primary)' }}>
                    {analysisResult?.deviceName || 'Device'} ({vendor})
                  </div>
                </div>

                {/* Suggested Remediation Command */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="detail-label">Recommended Vendor CLI Directives</div>
                  {selectedFix.remediation ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {Object.entries(selectedFix.remediation).map(([v, cmd]) => (
                        <div key={v}>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-ochre)', fontWeight: 600, marginBottom: '2px' }}>
                            {v}:
                          </div>
                          <div className="remediation-box">
                            {cmd}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>No remediation template registered</div>
                  )}
                </div>

                {/* Verification Command */}
                {selectedFix.verification && (
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="detail-label">Verification Command</div>
                    {Object.entries(selectedFix.verification).map(([v, cmd]) => (
                      <div key={v} style={{ marginBottom: '4px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '2px' }}>
                          {v}:
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          background: 'var(--color-bg-subtle)',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--color-indigo)'
                        }}>
                          {cmd}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Approval Action */}
                <div>
                  {approved[selectedFix.controlId] ? (
                    <div style={{
                      padding: '8px 14px',
                      background: 'var(--color-pass-bg)',
                      border: '1px solid var(--color-pass-border)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--color-pass)',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}>
                      ✓ Approved for implementation by network administrator
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setApproved(prev => ({ ...prev, [selectedFix.controlId]: true }))}
                    >
                      Approve Remediation Directive
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
                <span className="empty-state-symbol">↻</span>
                <div className="empty-state-text" style={{ fontSize: '1rem' }}>
                  Select a deficiency to view vendor-specific remediation directives
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
