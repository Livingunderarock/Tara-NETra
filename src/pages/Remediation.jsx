import React, { useState } from 'react';

export default function Remediation({ complianceResult, analysisResult }) {
  const [selectedFix, setSelectedFix] = useState(null);
  const [approved, setApproved] = useState({});

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">⟳ TĀRĀ Resolve</h1>
          <p className="page-subtitle">Vendor-specific remediation recommendations</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⟳</div>
          <div className="empty-state-text">Analyze a configuration first to generate remediations</div>
        </div>
      </div>
    );
  }

  const failures = complianceResult.results.filter(r => r.status === 'FAIL');
  const vendor = analysisResult?.vendor?.vendor || 'Generic';

  // Workflow steps
  const workflowSteps = ['Detect', 'Recommend', 'Simulate', 'Human Approval', 'Export'];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">⟳ TĀRĀ Resolve</h1>
        <p className="page-subtitle">{failures.length} remediation recommendations for {analysisResult?.deviceName || 'device'}</p>
      </div>

      {/* Workflow */}
      <div className="workflow" style={{ marginBottom: 'var(--space-xl)' }}>
        {workflowSteps.map((step, i) => (
          <React.Fragment key={step}>
            {i > 0 && <span className="workflow-arrow">→</span>}
            <span className={`workflow-step ${i <= 1 ? 'active' : ''}`}>{step}</span>
          </React.Fragment>
        ))}
      </div>

      {failures.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✓</div>
          <div style={{ color: 'var(--color-success)', fontSize: '1.1rem', fontWeight: 600 }}>All evaluated controls are passing!</div>
          <div style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>No remediation actions required.</div>
        </div>
      ) : (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Remediation List */}
          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            {failures.map((finding, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 'var(--space-md)',
                  cursor: 'pointer',
                  borderColor: selectedFix === finding ? 'var(--color-gold)' : approved[finding.controlId] ? 'rgba(0, 230, 118, 0.3)' : undefined,
                }}
                onClick={() => setSelectedFix(finding)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '4px' }}>
                      <span className={`badge badge-${finding.severity.toLowerCase()}`}>{finding.severity}</span>
                      {approved[finding.controlId] && <span className="badge badge-pass">APPROVED</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{finding.controlName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{finding.controlId} • {finding.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Remediation Detail */}
          <div>
            {selectedFix ? (
              <div className="card">
                <div className="card-title">Remediation Detail</div>

                {/* Finding */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="form-label">Finding</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-danger)' }}>
                    {selectedFix.controlName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {selectedFix.description}
                  </div>
                </div>

                {/* Device */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="form-label">Device</div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {analysisResult?.deviceName || 'Unknown'} ({vendor})
                  </div>
                </div>

                {/* Suggested Remediation */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="form-label">Suggested Remediation</div>
                  {selectedFix.remediation ? (
                    <div>
                      {Object.entries(selectedFix.remediation).map(([v, cmd]) => (
                        <div key={v} style={{ marginBottom: 'var(--space-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginBottom: '2px' }}>{v}:</div>
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                            padding: 'var(--space-md)',
                            background: 'var(--color-bg-deep)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-cyan)',
                            whiteSpace: 'pre-wrap',
                            border: v === vendor ? '1px solid rgba(0, 229, 255, 0.2)' : 'var(--border-subtle)',
                          }}>
                            {cmd}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-text-muted)' }}>No specific remediation available</div>
                  )}
                </div>

                {/* Verification */}
                {selectedFix.verification && (
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="form-label">Verification Command</div>
                    {Object.entries(selectedFix.verification).map(([v, cmd]) => (
                      <div key={v} style={{ marginBottom: 'var(--space-sm)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginBottom: '2px' }}>{v}:</div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                          padding: 'var(--space-sm) var(--space-md)',
                          background: 'var(--color-bg-deep)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-success)',
                        }}>
                          {cmd}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Approval */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  {approved[selectedFix.controlId] ? (
                    <span className="badge badge-pass" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                      ✓ Approved for Implementation
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setApproved(prev => ({ ...prev, [selectedFix.controlId]: true }))}
                    >
                      ✓ Approve Remediation
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>⟳</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Select a finding to view vendor-specific remediation
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
