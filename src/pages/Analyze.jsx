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

  const getLineClass = (state) => {
    switch (state) {
      case 'RECOGNIZED': return 'recognized';
      case 'INFERRED': return 'inferred';
      case 'LEARNED': return 'learned';
      case 'LOW_CONFIDENCE': return 'low-confidence';
      case 'UNKNOWN': return 'unknown-line';
      default: return '';
    }
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
      <div className="page-header">
        <h1 className="page-title">⬡ Configuration Analysis</h1>
        <p className="page-subtitle">Upload a configuration file or load a demo sample</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="upload-icon">⬡</span>
        <div className="upload-title">Drop Configuration Here</div>
        <div className="upload-formats">.txt &nbsp; .cfg &nbsp; .conf &nbsp; .log</div>
        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
          Select File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.cfg,.conf,.log"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
        />
      </div>

      {/* Demo Shortcuts */}
      <div className="sample-configs">
        <button className="sample-btn" onClick={() => loadSample('cisco')}>▶ Load Cisco Sample</button>
        <button className="sample-btn" onClick={() => loadSample('fortinet')}>▶ Load Fortinet Sample</button>
        <button className="sample-btn" onClick={() => loadSample('junos')}>▶ Load JunOS Sample</button>
        <button className="sample-btn" onClick={() => loadSample('unknown')}>▶ Load Unknown Vendor Sample</button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <div className="mandala-divider" />

          {/* Vendor & Stats */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value" style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}>
                {analysisResult.vendor.vendor}
              </div>
              <div className="metric-label">Detected Vendor</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{analysisResult.vendor.confidence}%</div>
              <div className="metric-label">Vendor Confidence</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'var(--color-success)' }}>{analysisResult.stats.recognized + analysisResult.stats.inferred + analysisResult.stats.learned}</div>
              <div className="metric-label">Recognized</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'var(--color-warning)' }}>{analysisResult.stats.lowConfidence}</div>
              <div className="metric-label">Low Confidence</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'var(--color-danger)' }}>{analysisResult.stats.unknown}</div>
              <div className="metric-label">Unknown</div>
            </div>
          </div>

          {/* Vendor unknown warning */}
          {analysisResult.vendor.vendor === 'Unknown' && (
            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 171, 0, 0.05)', border: '1px solid rgba(255, 171, 0, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', fontSize: '0.85rem', color: 'var(--color-warning)' }}>
              ⚠ Vendor identification is uncertain. Semantic analysis is continuing with confidence-aware interpretation.
            </div>
          )}

          {/* Three-Panel View */}
          <div className="three-panel">
            {/* Raw Config */}
            <div className="panel">
              <div className="panel-title">Raw Configuration</div>
              <div className="config-viewer">
                {analysisResult.lines.map((line, i) => (
                  <div
                    key={i}
                    className={`config-line ${getLineClass(line.state)}`}
                    onClick={() => setSelectedLine(line)}
                  >
                    <span className="config-line-number">{line.lineNumber}</span>
                    <span className="config-line-content">{line.raw || ' '}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TĀRĀ Interpretation */}
            <div className="panel">
              <div className="panel-title">TĀRĀ Interpretation</div>
              <div className="config-viewer">
                {analysisResult.lines.filter(l => l.state !== 'SKIP').map((line, i) => (
                  <div
                    key={i}
                    className={`config-line ${getLineClass(line.state)}`}
                    onClick={() => setSelectedLine(line)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="config-line-content" style={{ fontSize: '0.75rem' }}>
                      {line.state === 'UNKNOWN' ? (
                        <span style={{ color: 'var(--color-danger)' }}>UNKNOWN — Unrecognized construct</span>
                      ) : line.hypothesis ? (
                        <span style={{ color: 'var(--color-warning)' }}>{line.hypothesis}</span>
                      ) : (
                        <span style={{ color: 'var(--color-success)' }}>{line.control?.name || line.semantic || '—'}</span>
                      )}
                    </span>
                    <span className="config-line-badge">
                      <span className={`badge ${getBadgeClass(line.state)}`} style={{ fontSize: '0.6rem' }}>
                        {line.confidence > 0 ? `${line.confidence}%` : line.state}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Model */}
            <div className="panel">
              <div className="panel-title">Semantic Model</div>
              {selectedLine && selectedLine.state !== 'SKIP' ? (
                <div style={{ fontSize: '0.8rem' }}>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Raw Command</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)', marginTop: '4px', padding: 'var(--space-sm)', background: 'var(--color-bg-deep)', borderRadius: 'var(--radius-sm)' }}>{selectedLine.trimmed}</div>
                  </div>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>State</div>
                    <span className={`badge ${getBadgeClass(selectedLine.state)}`}>{selectedLine.state}</span>
                  </div>
                  {selectedLine.semantic && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Semantic Parameter</div>
                      <div style={{ color: 'var(--color-gold)', fontWeight: 600, marginTop: '4px' }}>{selectedLine.semantic}</div>
                    </div>
                  )}
                  {selectedLine.value !== null && selectedLine.value !== undefined && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Value</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '4px' }}>{String(selectedLine.value)}</div>
                    </div>
                  )}
                  {selectedLine.control && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Control</div>
                      <div style={{ color: 'var(--color-text)', marginTop: '4px' }}>{selectedLine.control.id} — {selectedLine.control.name}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>{selectedLine.control.category}</div>
                    </div>
                  )}
                  {selectedLine.control?.frameworks && (
                    <div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Framework Mappings</div>
                      {Object.entries(selectedLine.control.frameworks).map(([fw, ref]) => (
                        <div key={fw} style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--color-success)' }}>✓</span> {fw}: {ref}
                        </div>
                      ))}
                    </div>
                  )}
                  {(selectedLine.state === 'UNKNOWN' || selectedLine.state === 'LOW_CONFIDENCE') && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 'var(--space-md)' }}
                      onClick={() => navigate('/training')}
                    >
                      ⚡ Teach TĀRĀ
                    </button>
                  )}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
                  <div className="empty-state-icon">◈</div>
                  <div className="empty-state-text">Click a configuration line to view semantic details</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-primary" onClick={() => navigate('/compliance')}>◆ View Compliance</button>
            <button className="btn btn-secondary" onClick={() => navigate('/findings')}>⚠ View Findings</button>
            {(analysisResult.stats.unknown > 0 || analysisResult.stats.lowConfidence > 0) && (
              <button className="btn btn-ghost" onClick={() => navigate('/training')} style={{ borderColor: 'rgba(124, 77, 255, 0.3)', color: 'var(--color-purple)' }}>
                ⚡ Open Training Studio ({analysisResult.stats.unknown + analysisResult.stats.lowConfidence} items)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
