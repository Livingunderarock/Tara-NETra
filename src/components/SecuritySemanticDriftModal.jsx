import React, { useState, useMemo } from 'react';
import { analyzeSecuritySemanticDrift } from '../core/drift.js';
import { sampleConfigs } from '../knowledge/sampleConfigs.js';

export default function SecuritySemanticDriftModal({ isOpen, onClose, currentConfigText, currentDeviceName }) {
  const [selectedBaselineKey, setSelectedBaselineKey] = useState('unknown');
  const [selectedTargetKey, setSelectedTargetKey] = useState('unknownB');

  const baselineConfig = sampleConfigs[selectedBaselineKey]?.content || currentConfigText || '';
  const baselineName = sampleConfigs[selectedBaselineKey]?.name || 'Baseline Config';

  const targetConfig = sampleConfigs[selectedTargetKey]?.content || currentConfigText || '';
  const targetName = sampleConfigs[selectedTargetKey]?.name || currentDeviceName || 'Target Config';

  const driftReport = useMemo(() => {
    return analyzeSecuritySemanticDrift(baselineConfig, targetConfig, baselineName, targetName);
  }, [baselineConfig, targetConfig, baselineName, targetName]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 22, 34, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-md)',
    }}>
      <div
        className="modal-content animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid rgba(176, 138, 60, 0.4)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-elevation-high)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: 'var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div className="page-tag" style={{ color: 'var(--color-gold)' }}>Semantic Verification</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-indigo)', margin: 0 }}>
              Security Semantic Drift
            </h2>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)' }}>
              Compares security intent rather than raw syntax lines
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ fontSize: '1.2rem', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Configuration Selection Pickers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            background: 'var(--color-bg-base)',
            padding: '12px',
            borderRadius: 'var(--radius-xs)',
          }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.66rem' }}>Configuration A (Baseline)</label>
              <select
                className="form-select"
                value={selectedBaselineKey}
                onChange={e => setSelectedBaselineKey(e.target.value)}
                style={{ fontSize: '0.76rem' }}
              >
                {Object.entries(sampleConfigs).map(([k, s]) => (
                  <option key={k} value={k}>{s.name} ({s.vendor})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.66rem' }}>Configuration B (Comparison)</label>
              <select
                className="form-select"
                value={selectedTargetKey}
                onChange={e => setSelectedTargetKey(e.target.value)}
                style={{ fontSize: '0.76rem' }}
              >
                {Object.entries(sampleConfigs).map(([k, s]) => (
                  <option key={k} value={k}>{s.name} ({s.vendor})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contrast Banners: Raw Line Diff vs Semantic Security Changes */}
          {driftReport && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: 'var(--space-lg)',
              }}>
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--color-bg-base)',
                  borderLeft: '3px solid var(--color-ink-muted)',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-ink-primary)' }}>
                    {driftReport.rawLinesChanged} lines
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Raw Configuration Line Changes
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: 'var(--color-bg-base)',
                  borderLeft: `3px solid ${driftReport.securityRelevantChanges > 0 ? 'var(--color-fail)' : 'var(--color-pass)'}`,
                  borderRadius: 'var(--radius-xs)',
                }}>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: driftReport.securityRelevantChanges > 0 ? 'var(--color-ochre)' : 'var(--color-pass)' }}>
                    {driftReport.securityRelevantChanges}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Security-Relevant Semantic Changes
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: 'var(--color-bg-base)',
                  borderLeft: '3px solid var(--color-indigo)',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-indigo)' }}>
                    {driftReport.unchangedParametersCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Safeguards In Full Consensus
                  </div>
                </div>
              </div>

              {/* Drift Table */}
              <div style={{ marginTop: 'var(--space-md)' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-indigo)', marginBottom: '8px' }}>
                  Semantic Security Alterations:
                </div>

                {driftReport.semanticChanges.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', background: 'var(--color-bg-base)', borderRadius: 'var(--radius-xs)', color: 'var(--color-pass)' }}>
                    ✓ Zero Security Semantic Drift detected. Both configurations share identical security intent.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', fontSize: '0.76rem' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '15%' }}>Severity</th>
                          <th style={{ width: '25%' }}>Security Safeguard</th>
                          <th style={{ width: '30%' }}>Drift (A → B)</th>
                          <th style={{ width: '30%' }}>Operational Security Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {driftReport.semanticChanges.map((change, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className={`badge badge-${change.severity.toLowerCase()}`}>
                                {change.severity}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--color-indigo)' }}>
                              {change.controlName}
                              <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
                                {change.parameter}
                              </div>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                              <span style={{ color: 'var(--color-ink-muted)' }}>
                                {JSON.stringify(change.beforeValue) ?? 'NONE'}
                              </span>
                              {' → '}
                              <strong style={{ color: 'var(--color-ochre)' }}>
                                {JSON.stringify(change.afterValue) ?? 'NONE'}
                              </strong>
                            </td>
                            <td style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                              {change.impact}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: 'var(--border-hairline)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
