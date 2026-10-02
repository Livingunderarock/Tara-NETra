import React, { useState, useRef, useCallback } from 'react';
import { sampleConfigs } from '../knowledge/sampleConfigs';

export default function Analyze({ analysisResult, complianceResult, onAnalyze, configText, navigate }) {
  const [dragging, setDragging] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const name = file.name.replace(/\.[^/.]+$/, '').toUpperCase();
      onAnalyze(text, name);
    };
    reader.readAsText(file);
  }, [onAnalyze]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const loadSample = (key) => {
    const sample = sampleConfigs[key];
    onAnalyze(sample.content, sample.name);
  };

  const getBadgeClass = (state) => {
    switch (state) {
      case 'RECOGNIZED': return 'badge-recognized';
      case 'INFERRED': return 'badge-inferred';
      case 'LEARNED': return 'badge-learned';
      case 'LOW_CONFIDENCE': return 'badge-low-confidence';
      case 'UNKNOWN': return 'badge-unknown';
      default: return '';
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Precision Ingestion</div>
          <h1 className="page-title">Configuration Analyzer</h1>
          <div className="page-subtitle">
            Upload heterogeneous network device configurations for semantic interpretation
          </div>
        </div>
      </div>

      {/* Upload Zone (Parchment & Hairline) */}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="upload-icon">◬</span>
        <div className="upload-title">Drop Configuration File</div>
        <div className="upload-formats">Supported: .cfg • .conf • .txt • .log</div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        >
          Select File from Disk
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.cfg,.conf,.log"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
        />
      </div>

      {/* Sample Configurations Shortcuts */}
      <div className="sample-configs-bar">
        <span className="sample-configs-label">Observatory Samples:</span>
        <button type="button" className="sample-btn" onClick={() => loadSample('cisco')}>Cisco IOS (EDGE-FW-01)</button>
        <button type="button" className="sample-btn" onClick={() => loadSample('fortinet')}>Fortinet FortiOS (CORE-FW-02)</button>
        <button type="button" className="sample-btn" onClick={() => loadSample('junos')}>Juniper JunOS (DIST-SW-03)</button>
        <button type="button" className="sample-btn" onClick={() => loadSample('unknown')} style={{ color: 'var(--color-ochre)' }}>
          Unknown Vendor (BRANCH-GW-04)
        </button>
      </div>

      {/* Analysis Output */}
      {analysisResult && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          {/* Detected Vendor & Line Stats */}
          <div className="metrics-row" style={{ padding: 'var(--space-md) 0' }}>
            <div className="metric-item">
              <div className="metric-number" style={{ fontSize: '1.6rem', color: 'var(--color-indigo)' }}>
                {analysisResult.vendor.vendor}
              </div>
              <div className="metric-caption">Detected Operating System</div>
            </div>

            <div className="metric-item">
              <div className="metric-number" style={{ fontSize: '1.6rem' }}>
                {analysisResult.vendor.confidence}%
              </div>
              <div className="metric-caption">Vendor Confidence</div>
            </div>

            <div className="metric-item">
              <div className="metric-number" style={{ fontSize: '1.6rem', color: 'var(--color-pass)' }}>
                {analysisResult.stats.recognized + analysisResult.stats.inferred + analysisResult.stats.learned}
              </div>
              <div className="metric-caption">Recognized Directives</div>
            </div>

            <div className="metric-item">
              <div className="metric-number" style={{ fontSize: '1.6rem', color: 'var(--color-unknown)' }}>
                {analysisResult.stats.lowConfidence}
              </div>
              <div className="metric-caption">Low Confidence Hypotheses</div>
            </div>

            <div className="metric-item">
              <div className="metric-number" style={{ fontSize: '1.6rem', color: 'var(--color-fail)' }}>
                {analysisResult.stats.unknown}
              </div>
              <div className="metric-caption">Unknown Constructs</div>
            </div>
          </div>

          {/* Unknown Vendor Alert if applicable */}
          {analysisResult.vendor.vendor === 'Unknown' && (
            <div style={{
              padding: '10px 16px',
              background: 'var(--color-unknown-bg)',
              borderLeft: '3px solid var(--color-unknown)',
              marginBottom: 'var(--space-md)',
              fontSize: '0.8rem',
              color: 'var(--color-ink-primary)'
            }}>
              <strong>Observation Note:</strong> Vendor identification is unverified. Semantic interpretation is proceeding using cross-vendor heuristics and confidence thresholds.
            </div>
          )}

          {/* Synchronized 3-Panel View */}
          <div className="three-panel">
            {/* Panel 1: Raw Configuration in Dark Indigo Technical Surface */}
            <div className="panel panel-dark">
              <div className="panel-title">Raw Configuration (CLI)</div>
              <div className="config-viewer-dark">
                {analysisResult.lines.map((line, i) => (
                  <div
                    key={i}
                    className={`config-line-dark ${selectedLine?.lineNumber === line.lineNumber ? 'selected' : ''} ${line.state === 'UNKNOWN' ? 'unknown-highlight' : ''}`}
                    onClick={() => setSelectedLine(line)}
                  >
                    <span className="config-line-num">{line.lineNumber}</span>
                    <span className="config-line-code">{line.raw || ' '}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: TĀRĀ Interpretation */}
            <div className="panel">
              <div className="panel-title">TĀRĀ Interpretation</div>
              <div className="interpretation-list">
                {analysisResult.lines.filter(l => l.state !== 'SKIP').map((line, i) => (
                  <div
                    key={i}
                    className={`interpretation-item ${selectedLine?.lineNumber === line.lineNumber ? 'selected' : ''} ${
                      line.state === 'UNKNOWN' ? 'item-unknown' :
                      line.state === 'LOW_CONFIDENCE' ? 'item-low' :
                      line.state === 'LEARNED' ? 'item-learned' : 'item-recognized'
                    }`}
                    onClick={() => setSelectedLine(line)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="interpretation-name">
                        {line.state === 'UNKNOWN' ? (
                          <span style={{ color: 'var(--color-fail)' }}>Unrecognized Command</span>
                        ) : line.control ? (
                          line.control.name
                        ) : line.semantic ? (
                          line.semantic
                        ) : (
                          'Directive'
                        )}
                      </div>
                      <div className="interpretation-sub">
                        Line {line.lineNumber} • {line.source}
                      </div>
                    </div>
                    <span className={`badge ${getBadgeClass(line.state)}`}>
                      {line.confidence > 0 ? `${line.confidence}%` : 'Unknown'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Semantic Model Detail */}
            <div className="panel">
              <div className="panel-title">Security Semantic Model</div>
              {selectedLine && selectedLine.state !== 'SKIP' ? (
                <div className="semantic-detail-panel">
                  <div className="detail-section">
                    <div className="detail-label">Raw CLI Syntax</div>
                    <div className="detail-value-code">{selectedLine.trimmed}</div>
                  </div>

                  <div className="detail-section">
                    <div className="detail-label">Classification State</div>
                    <span className={`badge ${getBadgeClass(selectedLine.state)}`}>
                      {selectedLine.state} ({selectedLine.confidence}%)
                    </span>
                  </div>

                  {selectedLine.semantic && (
                    <div className="detail-section">
                      <div className="detail-label">Normalized Semantic Parameter</div>
                      <div className="detail-value-text" style={{ color: 'var(--color-ochre)', fontFamily: 'var(--font-mono)' }}>
                        {selectedLine.semantic}
                      </div>
                    </div>
                  )}

                  {selectedLine.value !== null && selectedLine.value !== undefined && (
                    <div className="detail-section">
                      <div className="detail-label">Observed Value</div>
                      <div className="detail-value-text">
                        {String(selectedLine.value)}
                      </div>
                    </div>
                  )}

                  {selectedLine.control && (
                    <div className="detail-section">
                      <div className="detail-label">Control Mapping</div>
                      <div className="detail-value-text" style={{ fontWeight: 600 }}>
                        {selectedLine.control.id} — {selectedLine.control.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                        Category: {selectedLine.control.category}
                      </div>
                    </div>
                  )}

                  {selectedLine.control?.frameworks && (
                    <div className="detail-section">
                      <div className="detail-label">Regulatory Crosswalk</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                        {Object.entries(selectedLine.control.frameworks).map(([fw, ref]) => (
                          <div key={fw} style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                            <strong style={{ color: 'var(--color-indigo)' }}>{fw}:</strong> {ref}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedLine.state === 'UNKNOWN' || selectedLine.state === 'LOW_CONFIDENCE') && (
                    <div style={{ marginTop: 'var(--space-md)' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate('/training')}
                      >
                        Teach TĀRĀ this Construct
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
                  <span className="empty-state-symbol">☉</span>
                  <div className="empty-state-text" style={{ fontSize: '0.95rem' }}>
                    Select any configuration line to inspect its security semantics
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/compliance')}>
              View Compliance Audit
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/findings')}>
              Inspect Findings
            </button>
            {(analysisResult.stats.unknown > 0 || analysisResult.stats.lowConfidence > 0) && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/training')}
                style={{ color: 'var(--color-ochre)', borderColor: 'rgba(166, 106, 44, 0.4)' }}
              >
                Open Learning Studio ({analysisResult.stats.unknown + analysisResult.stats.lowConfidence} items)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
