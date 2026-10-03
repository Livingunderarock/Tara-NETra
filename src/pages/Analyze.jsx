import React, { useState, useRef, useCallback, useMemo } from 'react';
import { sampleConfigs } from '../knowledge/sampleConfigs';
import { calculateLearningImpact } from '../core/learningImpact';
import LearningImpactSection from '../components/LearningImpactSection';
import SecuritySemanticDriftModal from '../components/SecuritySemanticDriftModal';

export default function Analyze({ analysisResult, complianceResult, onAnalyze, configText, navigate }) {
  const [dragging, setDragging] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [isDriftOpen, setIsDriftOpen] = useState(false);
  const fileInputRef = useRef(null);

  const impactData = useMemo(() => {
    return calculateLearningImpact(configText, analysisResult, complianceResult);
  }, [configText, analysisResult, complianceResult]);

  const unseenLearnedLines = useMemo(() => {
    return analysisResult?.lines?.filter(l => l.isUnseenVariant) || [];
  }, [analysisResult]);

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
          Unknown Device A (BRANCH-GW-04)
        </button>
        <button
          type="button"
          className="sample-btn"
          onClick={() => loadSample('unknownB')}
          style={{ color: 'var(--color-gold)', border: '1px dashed rgba(176, 138, 60, 0.6)' }}
          title="Never used during training — tests generalized learning"
        >
          ✦ Unseen Device B (CAMPUS-GW-05)
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

          {/* TĀRĀ Learning Proof: Visual Proof Architecture */}
          {unseenLearnedLines.length > 0 ? (
            <div className="card" style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(84, 58, 122, 0.15) 0%, rgba(32, 38, 58, 0.45) 100%)',
              border: '1.5px solid var(--color-purple)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: 'var(--space-lg)',
              boxShadow: '0 4px 16px rgba(84, 58, 122, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-learned" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                      ✓ TĀRĀ LEARNING PROOF
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                      Generalization Confirmed
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-indigo)', marginTop: '4px', fontWeight: 600 }}>
                    "This configuration was not used during training."
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                    Pattern learned from another configuration (<strong>{unseenLearnedLines[0].originDevice || 'BRANCH-GW-04'}</strong>) and successfully generalized to unseen device <strong>{analysisResult.deviceName}</strong>.
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-recognized" style={{ fontSize: '0.68rem' }}>
                    Knowledge Source: TĀRĀ Memory
                  </span>
                </div>
              </div>

              {/* 5-Step Visual Generalization Pipeline */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
                background: 'var(--color-bg-base)',
                padding: '12px',
                borderRadius: 'var(--radius-xs)',
                border: 'var(--border-hairline)',
                alignItems: 'center',
              }}>
                <div style={{ textAlign: 'center', padding: '6px' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>1. Device A (Training)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-indigo)', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
                    {unseenLearnedLines[0].originalExample || 'session-limit 900'}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--color-ochre)', fontSize: '0.8rem' }}>→</div>

                <div style={{ textAlign: 'center', padding: '6px' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>2. Human Teaches</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ochre)', fontWeight: 600, marginTop: '2px' }}>
                    {unseenLearnedLines[0].control?.name || unseenLearnedLines[0].semantic}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--color-gold)', fontSize: '0.8rem' }}>→</div>

                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(176, 138, 60, 0.1)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 600 }}>3. Generalized Pattern</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-indigo)', fontWeight: 700, marginTop: '2px' }}>
                    {unseenLearnedLines[0].learnedPattern || 'command <VALUE>'}
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--color-purple)', fontSize: '0.8rem' }}>→</div>

                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(84, 58, 122, 0.15)', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-purple)', textTransform: 'uppercase', fontWeight: 600 }}>4. Unseen Device B</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-pass)', fontWeight: 700, marginTop: '2px' }}>
                    ✓ MATCH: {unseenLearnedLines[0].parameter || 'Value'} = {String(unseenLearnedLines[0].value)}
                  </div>
                </div>
              </div>
            </div>
          ) : analysisResult.stats.learned > 0 ? (
            <div style={{
              padding: '12px 18px',
              background: 'rgba(84, 58, 122, 0.12)',
              border: '1px solid var(--color-purple)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <span className="badge badge-learned" style={{ fontSize: '0.72rem', marginRight: '8px' }}>
                  ✓ HUMAN LEARNED
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-ink-primary)' }}>
                  <strong>Ground Truth Active:</strong> {analysisResult.stats.learned} construct(s) recognized via TĀRĀ Memory.
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => loadSample('unknownB')}
                style={{ fontSize: '0.74rem', color: 'var(--color-gold)', borderColor: 'rgba(176, 138, 60, 0.5)' }}
              >
                ✦ Test on Unseen Device B (CAMPUS-GW-05) →
              </button>
            </div>
          ) : null}

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
              <strong>Observation Note:</strong> Vendor identification is unverified. Semantic interpretation is proceeding using cross-vendor heuristics, learned patterns, and confidence thresholds.
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
                      <div className="interpretation-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span>Line {line.lineNumber}</span>
                        <span>•</span>
                        <span style={{ color: line.state === 'LEARNED' ? 'var(--color-purple)' : 'var(--color-ink-muted)', fontSize: '0.66rem' }}>
                          {line.provenance || line.source}
                        </span>
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

                  <div className="detail-section">
                    <div className="detail-label">Knowledge Provenance</div>
                    <span className={`badge ${selectedLine.state === 'LEARNED' ? 'badge-learned' : 'badge-recognized'}`} style={{ fontSize: '0.7rem' }}>
                      {selectedLine.provenance || selectedLine.source}
                    </span>
                  </div>

                  {selectedLine.isUnseenVariant && (
                    <div className="detail-section" style={{ background: 'rgba(84, 58, 122, 0.12)', padding: '10px 12px', borderRadius: 'var(--radius-xs)', border: '1px dashed var(--color-purple)' }}>
                      <div className="detail-label" style={{ color: 'var(--color-purple)', fontWeight: 600 }}>TĀRĀ Learning Proof (Generalization)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-primary)', marginTop: '2px' }}>
                        Pattern learned from another configuration (<strong>{selectedLine.originDevice}</strong>)
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ochre)', marginTop: '3px' }}>
                        Generalized Pattern: {selectedLine.learnedPattern}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-pass)', marginTop: '3px' }}>
                        Dynamically Extracted: {selectedLine.parameter} = {String(selectedLine.value)}
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
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/compliance')}>
              View Compliance Audit
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/findings')}>
              Inspect Findings
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsDriftOpen(true)}>
              Compare Semantic Drift ◬
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

          {/* Real Calculated Learning Impact Section */}
          <LearningImpactSection
            impactData={impactData}
            onNavigateToFindings={() => navigate('/findings')}
          />

          {/* Security Semantic Drift Modal */}
          <SecuritySemanticDriftModal
            isOpen={isDriftOpen}
            onClose={() => setIsDriftOpen(false)}
            currentConfigText={configText}
            currentDeviceName={analysisResult?.deviceName}
          />
        </div>
      )}
    </div>
  );
}
