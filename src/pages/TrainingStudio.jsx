import React, { useState } from 'react';
import { semanticControls } from '../knowledge/semanticControls';
import { saveLearnedMapping } from '../services/storage';

export default function TrainingStudio({ analysisResult, onReanalyze, showToast }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mappingCategory, setMappingCategory] = useState('');
  const [mappingSemantic, setMappingSemantic] = useState('');
  const [mappingValue, setMappingValue] = useState('');
  const [taught, setTaught] = useState({});

  if (!analysisResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Adaptive Reasoning</div>
            <h1 className="page-title">TĀRĀ Learning Studio</h1>
            <div className="page-subtitle">Teach TĀRĀ the security meaning of unfamiliar configuration</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-state-symbol">⚚</span>
          <div className="empty-state-text">
            Analyze a configuration first to discover unknown constructs
          </div>
        </div>
      </div>
    );
  }

  const unknownLines = analysisResult.lines.filter(l =>
    l.state === 'UNKNOWN' || l.state === 'LOW_CONFIDENCE'
  );

  const handleTeach = () => {
    if (!selectedItem || !mappingSemantic) return;

    const pattern = selectedItem.trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '\\d+');
    const control = semanticControls.find(c => c.semanticParameter === mappingSemantic);

    let parsedValue = mappingValue;
    if (mappingValue === 'true') parsedValue = true;
    else if (mappingValue === 'false') parsedValue = false;
    else if (mappingValue !== '' && !isNaN(Number(mappingValue))) parsedValue = Number(mappingValue);
    else if (mappingValue === '') parsedValue = true;

    saveLearnedMapping({
      pattern,
      rawCommand: selectedItem.trimmed,
      semantic: mappingSemantic,
      value: parsedValue,
      category: mappingCategory || control?.category || 'General',
      controlId: control?.id || null,
      controlName: control?.name || mappingSemantic,
      confidence: 97,
      source: 'Administrator',
    });

    setTaught(prev => ({ ...prev, [selectedItem.lineNumber]: true }));
    showToast(`Knowledge acquired: ${control?.name || mappingSemantic}`);
    setSelectedItem(null);
    setMappingCategory('');
    setMappingSemantic('');
    setMappingValue('');
  };

  const handleTeachAndReprocess = () => {
    handleTeach();
    setTimeout(() => {
      onReanalyze();
    }, 450);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Adaptive Knowledge Acquisition</div>
          <h1 className="page-title">TĀRĀ Learning Studio</h1>
          <div className="page-subtitle">
            Teach TĀRĀ the security meaning of unfamiliar configuration
          </div>
        </div>
      </div>

      {/* Before / After Learning Transition Indicator */}
      {Object.keys(taught).length > 0 && (
        <div className="learning-transition-card">
          <div className="learning-state-box">
            <div className="state-caption">Initial Observation</div>
            <div className="state-title" style={{ color: 'var(--color-fail)' }}>UNKNOWN</div>
            <div className="state-score">Confidence ~50%</div>
          </div>

          <div className="learning-divider-arrow">⟶</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-ochre)', fontWeight: 600 }}>
              Human Instruction
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              Persistent Knowledge Inscribed
            </div>
          </div>

          <div className="learning-divider-arrow">⟶</div>

          <div className="learning-state-box">
            <div className="state-caption">Updated Knowledge</div>
            <div className="state-title" style={{ color: 'var(--color-pass)' }}>LEARNED</div>
            <div className="state-score">Confidence 97%</div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Unfamiliar List + Scholar Teaching Panel */}
      <div className="training-studio-grid">
        {/* Column 1: Unfamiliar Constructs */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ink-muted)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
            Unfamiliar Constructs ({unknownLines.length})
          </div>

          {unknownLines.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ color: 'var(--color-pass)', fontSize: '1.4rem', marginBottom: 'var(--space-xs)' }}>✓</div>
              <div style={{ fontWeight: 600, color: 'var(--color-ink-primary)' }}>All constructs recognized</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                The configuration is completely parsed by the current baseline model.
              </div>
            </div>
          ) : (
            unknownLines.map((line, i) => (
              <div
                key={i}
                className={`training-item-card ${selectedItem?.lineNumber === line.lineNumber ? 'selected' : ''} ${taught[line.lineNumber] ? 'taught' : ''}`}
                onClick={() => {
                  if (!taught[line.lineNumber]) {
                    setSelectedItem(line);
                    const numMatch = line.trimmed.match(/(\d+)/);
                    setMappingValue(numMatch ? numMatch[1] : (line.value !== null && line.value !== undefined ? String(line.value) : ''));
                    if (line.semantic) {
                      setMappingSemantic(line.semantic);
                      const ctrl = semanticControls.find(c => c.semanticParameter === line.semantic);
                      if (ctrl) setMappingCategory(ctrl.category);
                    } else {
                      setMappingSemantic('');
                      setMappingCategory('');
                    }
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: taught[line.lineNumber] ? 'var(--color-pass)' : 'var(--color-ink-primary)' }}>
                    {line.trimmed}
                  </span>
                  <span className={`badge ${taught[line.lineNumber] ? 'badge-learned' : line.state === 'UNKNOWN' ? 'badge-fail' : 'badge-warning'}`}>
                    {taught[line.lineNumber] ? 'LEARNED' : line.state}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Line {line.lineNumber} • Confidence: {taught[line.lineNumber] ? '97%' : `${line.confidence}%`}
                  {line.hypothesis && !taught[line.lineNumber] && ` • ${line.hypothesis}`}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 2: Scholar Teaching Instrument Panel */}
        <div>
          {selectedItem ? (
            <div className="card" style={{ borderTop: '2px solid var(--color-ochre)' }}>
              <div className="card-title">Inscribe Security Meaning</div>

              {/* 3 Step Flow inside Teaching Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {/* 1. Raw Command */}
                <div>
                  <div className="form-label">1. Raw Command</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    padding: '8px 12px',
                    background: 'var(--color-bg-subtle)',
                    border: 'var(--border-hairline)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--color-indigo)'
                  }}>
                    {selectedItem.trimmed}
                  </div>
                </div>

                {/* 2. TĀRĀ Hypothesis */}
                {selectedItem.hypothesis && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'var(--color-unknown-bg)',
                    borderLeft: '3px solid var(--color-unknown)',
                    borderRadius: 'var(--radius-xs)'
                  }}>
                    <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ochre)', fontWeight: 600 }}>
                      2. TĀRĀ Hypothesis ({selectedItem.confidence}%)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-primary)', marginTop: '2px' }}>
                      {selectedItem.hypothesis}
                    </div>
                  </div>
                )}

                {/* 3. Security Meaning Form */}
                <div>
                  <div className="form-label">3. Map to Security Baseline Concept</div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--color-ink-muted)', fontSize: '0.66rem' }}>
                      Security Concept
                    </label>
                    <select
                      className="form-select"
                      value={mappingSemantic}
                      onChange={(e) => {
                        setMappingSemantic(e.target.value);
                        const ctrl = semanticControls.find(c => c.semanticParameter === e.target.value);
                        if (ctrl) setMappingCategory(ctrl.category);
                      }}
                    >
                      <option value="">Select standard security concept...</option>
                      {semanticControls.map(c => (
                        <option key={c.id} value={c.semanticParameter}>
                          {c.name} ({c.semanticParameter})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--color-ink-muted)', fontSize: '0.66rem' }}>
                      Category
                    </label>
                    <input
                      className="form-input"
                      value={mappingCategory}
                      onChange={(e) => setMappingCategory(e.target.value)}
                      placeholder="e.g. Administrative Access"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: 'var(--color-ink-muted)', fontSize: '0.66rem' }}>
                      Extracted Parameter Value
                    </label>
                    <input
                      className="form-input"
                      value={mappingValue}
                      onChange={(e) => setMappingValue(e.target.value)}
                      placeholder="e.g. 900 or true"
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleTeach}
                    disabled={!mappingSemantic}
                    style={{ opacity: mappingSemantic ? 1 : 0.5 }}
                  >
                    Accept Mapping
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleTeachAndReprocess}
                    disabled={!mappingSemantic}
                    style={{ opacity: mappingSemantic ? 1 : 0.5 }}
                  >
                    Teach &amp; Reprocess Configuration
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
              <span className="empty-state-symbol">⚚</span>
              <div className="empty-state-text" style={{ fontSize: '1rem' }}>
                Select an unfamiliar construct to guide TĀRĀ's interpretation
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-ink-muted)', marginTop: '6px' }}>
                The mapped semantic rule will be persisted locally and applied across future configuration audits.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
