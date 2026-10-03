import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Findings({ complianceResult, analysisResult, configText }) {
  const navigate = useNavigate();
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [filter, setFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Explainable Reasoning</div>
            <h1 className="page-title">Security Findings</h1>
            <div className="page-subtitle">Evidence-backed compliance observations</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-state-symbol">△</span>
          <div className="empty-state-text">Analyze a configuration first to generate findings</div>
        </div>
      </div>
    );
  }

  const results = complianceResult.results;
  let filtered = results;
  if (filter !== 'all') filtered = filtered.filter(r => r.status === filter);
  if (severityFilter !== 'all') filtered = filtered.filter(r => r.severity === severityFilter);

  const configLines = configText ? configText.split('\n') : [];
  const targetVendor = analysisResult?.vendor?.vendor || 'Generic';

  const getRemediationText = (rem) => {
    if (!rem) return 'Apply vendor hardening template.';
    if (typeof rem === 'string') return rem;
    return rem[targetVendor] || rem['Generic'] || Object.values(rem)[0] || 'Apply vendor hardening template.';
  };

  const getVerificationText = (ver) => {
    if (!ver) return 'show running-config';
    if (typeof ver === 'string') return ver;
    return ver[targetVendor] || ver['Generic'] || Object.values(ver)[0] || 'show running-config';
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Audit Discoveries</div>
          <h1 className="page-title">Security Findings</h1>
          <div className="page-subtitle">
            {analysisResult?.deviceName || 'Target Appliance'} ({analysisResult?.vendor?.vendor || 'Unknown OS'}) • {results.length} controls evaluated • {results.filter(r => r.status === 'FAIL').length} deficiencies identified
          </div>
        </div>
      </div>

      {/* Filter Segment */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="segmented-nav" style={{ marginBottom: 0 }}>
          {['all', 'FAIL', 'PASS', 'UNKNOWN'].map(f => (
            <button
              key={f}
              type="button"
              className={`segmented-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f} {f !== 'all' && `(${results.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="segmented-nav" style={{ marginBottom: 0 }}>
          {['all', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button
              key={s}
              type="button"
              className={`segmented-btn ${severityFilter === s ? 'active' : ''}`}
              onClick={() => setSeverityFilter(s)}
            >
              {s === 'all' ? 'All Severity' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Two-Column Layout */}
      <div className="findings-layout">
        {/* Left Column: Finding Cards */}
        <div>
          {filtered.map((finding, i) => (
            <div
              key={i}
              className={`finding-card ${selectedFinding?.controlId === finding.controlId ? 'selected' : ''} ${
                finding.status === 'FAIL' ? 'fail' : finding.status === 'PASS' ? 'pass' : 'unknown'
              }`}
              onClick={() => setSelectedFinding(finding)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className={`badge badge-${finding.severity.toLowerCase()}`}>
                    {finding.severity}
                  </span>
                  <span className={`badge ${
                    finding.status === 'PASS' ? 'badge-pass' : finding.status === 'FAIL' ? 'badge-fail' : 'badge-warning'
                  }`}>
                    {finding.status}
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
                  {finding.controlId}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                {finding.controlName}
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary)', marginTop: '4px' }}>
                {finding.category}
              </div>

              <div style={{
                marginTop: 'var(--space-sm)',
                paddingTop: 'var(--space-xs)',
                borderTop: 'var(--border-hairline)',
                display: 'flex',
                gap: 'var(--space-md)',
                fontSize: '0.72rem',
                color: 'var(--color-ink-muted)'
              }}>
                <span>Expected: <strong style={{ color: 'var(--color-indigo)' }}>{JSON.stringify(finding.expected)}</strong></span>
                <span>Observed: <strong style={{ color: finding.status === 'FAIL' ? 'var(--color-fail)' : 'var(--color-pass)' }}>
                  {JSON.stringify(finding.observed) || 'None'}
                </strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: 5-Step Evidence Chain */}
        <div>
          {selectedFinding ? (
            <div className="card" style={{ borderTop: '2px solid var(--color-indigo)' }}>
              {/* 4 Core Questions Summary */}
              <div style={{
                background: 'var(--color-bg-base)',
                border: 'var(--border-hairline)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-xs)',
                marginTop: 'var(--space-md)',
                display: 'grid',
                gap: '8px',
                fontSize: '0.74rem',
              }}>
                <div>
                  <strong style={{ color: 'var(--color-indigo)' }}>1. What was found? </strong>
                  <span>{selectedFinding.controlName} — Observed: <code>{JSON.stringify(selectedFinding.observed) || 'None'}</code> (Expected: <code>{JSON.stringify(selectedFinding.expected)}</code>)</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-indigo)' }}>2. Why does it matter? </strong>
                  <span>{selectedFinding.description} (Risk Severity: <strong>{selectedFinding.severity}</strong>)</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-indigo)' }}>3. Which standard applies? </strong>
                  <span>{selectedFinding.controlId} ({Object.entries(selectedFinding.frameworks).map(([k, v]) => `${k} ${v}`).join(', ')})</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-indigo)' }}>4. How can it be remediated? </strong>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ochre)', whiteSpace: 'pre-wrap' }}>
                    {getRemediationText(selectedFinding.remediation)}
                  </span>
                </div>
              </div>

              <div className="chain-container" style={{ marginTop: 'var(--space-md)' }}>
                {/* Step 1: Raw Configuration */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">1. Raw Configuration Evidence</div>
                    <div className="chain-value">
                      {selectedFinding.evidence?.lineNumber && configLines[selectedFinding.evidence.lineNumber - 1]
                        ? configLines[selectedFinding.evidence.lineNumber - 1].trim()
                        : 'No direct directive in configuration file'}
                    </div>
                    {selectedFinding.evidence?.lineNumber && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                        Line {selectedFinding.evidence.lineNumber} ({selectedFinding.evidence.source})
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Semantic Interpretation */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">2. Semantic Interpretation</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                      {selectedFinding.controlName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                      {selectedFinding.description}
                    </div>
                  </div>
                </div>

                {/* Step 3: Security Control */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">3. Baseline Security Control (SBM)</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-ochre)', fontWeight: 600 }}>
                      {selectedFinding.controlId}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      Domain Category: {selectedFinding.category}
                    </div>
                  </div>
                </div>

                {/* Step 4: Framework Citations */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">4. Regulatory Requirements</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      {Object.entries(selectedFinding.frameworks).map(([fw, ref]) => (
                        <div key={fw} style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                          <strong style={{ color: 'var(--color-indigo)' }}>{fw}:</strong> {ref}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step 5: Compliance Result */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div
                      className="chain-dot"
                      style={{
                        borderColor: selectedFinding.status === 'PASS' ? 'var(--color-pass)' : selectedFinding.status === 'FAIL' ? 'var(--color-fail)' : 'var(--color-unknown)'
                      }}
                    />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content" style={{
                    background: selectedFinding.status === 'PASS' ? 'var(--color-pass-bg)' : selectedFinding.status === 'FAIL' ? 'var(--color-fail-bg)' : 'var(--color-unknown-bg)'
                  }}>
                    <div className="chain-label" style={{
                      color: selectedFinding.status === 'PASS' ? 'var(--color-pass)' : selectedFinding.status === 'FAIL' ? 'var(--color-fail)' : 'var(--color-unknown)'
                    }}>
                      5. Deterministic Audit Conclusion
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span className={`badge ${
                        selectedFinding.status === 'PASS' ? 'badge-pass' : selectedFinding.status === 'FAIL' ? 'badge-fail' : 'badge-warning'
                      }`} style={{ fontSize: '0.78rem', padding: '3px 10px' }}>
                        {selectedFinding.status}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-ink-secondary)' }}>
                        {selectedFinding.reason}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 6: Technical Remediation CLI */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                    <div className="chain-line" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">6. Technical Remediation Directive</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--color-ochre)', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                      {getRemediationText(selectedFinding.remediation)}
                    </div>
                  </div>
                </div>

                {/* Step 7: Technical Verification Command */}
                <div className="chain-step">
                  <div className="chain-indicator">
                    <div className="chain-dot" />
                  </div>
                  <div className="chain-content">
                    <div className="chain-label">7. Operational Verification Command</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--color-indigo)', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                      {getVerificationText(selectedFinding.verification)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/remediation')}
                >
                  Open Tārā Resolve ✦
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
              <span className="empty-state-symbol">△</span>
              <div className="empty-state-text" style={{ fontSize: '1rem' }}>
                Select a finding to trace its 5-step evidence chain
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
