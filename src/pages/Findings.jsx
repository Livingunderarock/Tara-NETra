import React, { useState } from 'react';

export default function Findings({ complianceResult, analysisResult, configText }) {
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [filter, setFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">⚠ Findings</h1>
          <p className="page-subtitle">Security findings and evidence chains</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⚠</div>
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

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">⚠ Findings</h1>
        <p className="page-subtitle">{results.length} controls evaluated — {results.filter(r => r.status === 'FAIL').length} failures detected</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {['all', 'FAIL', 'PASS', 'UNKNOWN'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f} {f !== 'all' && `(${results.filter(r => r.status === f).length})`}
          </button>
        ))}
        <span style={{ color: 'var(--color-text-muted)', alignSelf: 'center', margin: '0 var(--space-sm)' }}>|</span>
        {['all', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${severityFilter === s ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSeverityFilter(s)}
          >
            {s === 'all' ? 'All Severity' : s}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Findings List */}
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {filtered.map((finding, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 'var(--space-md)',
                cursor: 'pointer',
                borderColor: selectedFinding === finding ? 'var(--color-gold)' : undefined,
              }}
              onClick={() => setSelectedFinding(finding)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '4px' }}>
                    <span className={`badge badge-${finding.severity.toLowerCase()}`}>{finding.severity}</span>
                    <span className={`badge badge-${finding.status.toLowerCase()}`}>{finding.status}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {finding.controlName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {finding.controlId} • {finding.category}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                Expected: <span style={{ color: 'var(--color-cyan)' }}>{JSON.stringify(finding.expected)}</span>
                {' • '}
                Observed: <span style={{ color: finding.status === 'FAIL' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {JSON.stringify(finding.observed) || 'Not found'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Chain */}
        <div>
          {selectedFinding ? (
            <div className="card">
              <div className="card-title">Evidence Chain</div>
              <div className="evidence-chain">
                {/* Raw Config */}
                <div className="evidence-step">
                  <div className="evidence-connector">
                    <div className="evidence-dot" />
                    <div className="evidence-line" />
                  </div>
                  <div className="evidence-content">
                    <div className="evidence-label">Raw Configuration</div>
                    <div className="evidence-value">
                      {selectedFinding.evidence?.lineNumber && configLines[selectedFinding.evidence.lineNumber - 1]
                        ? configLines[selectedFinding.evidence.lineNumber - 1].trim()
                        : 'No direct evidence line'}
                    </div>
                    {selectedFinding.evidence?.lineNumber && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Line {selectedFinding.evidence.lineNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Semantic Interpretation */}
                <div className="evidence-step">
                  <div className="evidence-connector">
                    <div className="evidence-dot" style={{ background: 'var(--color-cyan)' }} />
                    <div className="evidence-line" style={{ background: 'linear-gradient(180deg, var(--color-cyan-dim), transparent)' }} />
                  </div>
                  <div className="evidence-content">
                    <div className="evidence-label" style={{ color: 'var(--color-cyan)' }}>Semantic Interpretation</div>
                    <div className="evidence-value">{selectedFinding.controlName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {selectedFinding.description}
                    </div>
                  </div>
                </div>

                {/* Security Control */}
                <div className="evidence-step">
                  <div className="evidence-connector">
                    <div className="evidence-dot" style={{ background: 'var(--color-purple)' }} />
                    <div className="evidence-line" style={{ background: 'linear-gradient(180deg, var(--color-purple-dim), transparent)' }} />
                  </div>
                  <div className="evidence-content">
                    <div className="evidence-label" style={{ color: 'var(--color-purple)' }}>Security Control</div>
                    <div className="evidence-value">{selectedFinding.controlId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Category: {selectedFinding.category}
                    </div>
                  </div>
                </div>

                {/* Framework Requirement */}
                <div className="evidence-step">
                  <div className="evidence-connector">
                    <div className="evidence-dot" style={{ background: 'var(--color-info)' }} />
                    <div className="evidence-line" style={{ background: 'linear-gradient(180deg, rgba(68, 138, 255, 0.3), transparent)' }} />
                  </div>
                  <div className="evidence-content">
                    <div className="evidence-label" style={{ color: 'var(--color-info)' }}>Framework Requirements</div>
                    {Object.entries(selectedFinding.frameworks).map(([fw, ref]) => (
                      <div key={fw} style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600 }}>{fw}:</span> {ref}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Result */}
                <div className="evidence-step">
                  <div className="evidence-connector">
                    <div className="evidence-dot" style={{
                      background: selectedFinding.status === 'PASS' ? 'var(--color-success)' : selectedFinding.status === 'FAIL' ? 'var(--color-danger)' : 'var(--color-warning)'
                    }} />
                  </div>
                  <div className="evidence-content" style={{
                    borderColor: selectedFinding.status === 'PASS' ? 'rgba(0,230,118,0.2)' : selectedFinding.status === 'FAIL' ? 'rgba(255,82,82,0.2)' : 'rgba(255,171,0,0.2)'
                  }}>
                    <div className="evidence-label" style={{
                      color: selectedFinding.status === 'PASS' ? 'var(--color-success)' : selectedFinding.status === 'FAIL' ? 'var(--color-danger)' : 'var(--color-warning)'
                    }}>
                      Compliance Result
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span className={`badge badge-${selectedFinding.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '4px 16px' }}>
                        {selectedFinding.status}
                      </span>
                      <span className={`badge badge-${selectedFinding.severity.toLowerCase()}`}>
                        {selectedFinding.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>⚠</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Select a finding to view its complete evidence chain
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
