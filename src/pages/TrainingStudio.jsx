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
          <h1 className="page-title">⚡ Training Studio</h1>
          <p className="page-subtitle">Teach TĀRĀ-NETRA to understand unknown configuration constructs</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⚡</div>
          <div className="empty-state-text">Analyze a configuration first to discover unknown constructs</div>
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
    showToast(`Learned: "${selectedItem.trimmed.substring(0, 40)}..." → ${control?.name || mappingSemantic}`);
    setSelectedItem(null);
    setMappingCategory('');
    setMappingSemantic('');
    setMappingValue('');
  };

  const handleTeachAndReprocess = () => {
    handleTeach();
    setTimeout(() => {
      onReanalyze();
    }, 500);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">⚡ Training Studio</h1>
        <p className="page-subtitle">
          {unknownLines.length} unknown or low-confidence constructs detected —
          Teach TĀRĀ to understand them
        </p>
      </div>

      {/* Learning Transition Demo */}
      {Object.keys(taught).length > 0 && (
        <div className="learning-transition">
          <div className="learning-before">
            <span className="badge badge-unknown" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>Before</span>
            <div style={{ marginTop: 'var(--space-sm)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-danger)' }}>UNKNOWN</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Confidence: ~50%</div>
          </div>
          <div className="learning-arrow">⟶</div>
          <div style={{ textAlign: 'center', flex: 0.5 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-purple)', textTransform: 'uppercase', letterSpacing: '1px' }}>Human Training</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Knowledge Update</div>
          </div>
          <div className="learning-arrow">⟶</div>
          <div className="learning-after">
            <span className="badge badge-learned" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>After</span>
            <div style={{ marginTop: 'var(--space-sm)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-success)' }}>LEARNED</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Confidence: 97%</div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Unknown constructs list */}
        <div>
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Unknown Constructs</div>
          {unknownLines.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>✓</div>
              <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>All constructs recognized!</div>
            </div>
          ) : (
            unknownLines.map((line, i) => (
              <div
                key={i}
                className="training-card"
                style={{
                  marginBottom: 'var(--space-sm)',
                  cursor: 'pointer',
                  borderColor: selectedItem?.lineNumber === line.lineNumber ? 'var(--color-purple)' : taught[line.lineNumber] ? 'rgba(0, 230, 118, 0.3)' : undefined,
                  opacity: taught[line.lineNumber] ? 0.6 : 1,
                }}
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
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: taught[line.lineNumber] ? 'var(--color-success)' : 'var(--color-text)' }}>
                    {line.trimmed.substring(0, 50)}{line.trimmed.length > 50 ? '...' : ''}
                  </span>
                  <span className={`badge ${taught[line.lineNumber] ? 'badge-learned' : line.state === 'UNKNOWN' ? 'badge-unknown' : 'badge-low-confidence'}`}>
                    {taught[line.lineNumber] ? 'LEARNED' : line.state}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Line {line.lineNumber} • Confidence: {taught[line.lineNumber] ? '97%' : `${line.confidence}%`}
                  {line.hypothesis && !taught[line.lineNumber] && ` • ${line.hypothesis}`}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Teaching Panel */}
        <div>
          {selectedItem ? (
            <div className="card" style={{ border: '2px solid rgba(124, 77, 255, 0.3)' }}>
              <div className="card-title" style={{ color: 'var(--color-purple)' }}>Teach TĀRĀ</div>

              {/* Raw Evidence */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="form-label">Raw Command</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: 'var(--space-md)', background: 'var(--color-bg-deep)', borderRadius: 'var(--radius-sm)', color: 'var(--color-cyan)' }}>
                  {selectedItem.trimmed}
                </div>
              </div>

              {/* AI Hypothesis */}
              {selectedItem.hypothesis && (
                <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(255, 171, 0, 0.05)', border: '1px solid rgba(255, 171, 0, 0.15)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>TĀRĀ Hypothesis</div>
                  <div style={{ fontSize: '0.85rem' }}>{selectedItem.hypothesis}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Confidence: {selectedItem.confidence}%</div>
                </div>
              )}

              {/* Mapping Form */}
              <div className="form-group">
                <label className="form-label">Security Concept</label>
                <select
                  className="form-select"
                  value={mappingSemantic}
                  onChange={(e) => {
                    setMappingSemantic(e.target.value);
                    const ctrl = semanticControls.find(c => c.semanticParameter === e.target.value);
                    if (ctrl) setMappingCategory(ctrl.category);
                  }}
                >
                  <option value="">Select security concept...</option>
                  {semanticControls.map(c => (
                    <option key={c.id} value={c.semanticParameter}>
                      {c.name} ({c.semanticParameter})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={mappingCategory}
                  onChange={(e) => setMappingCategory(e.target.value)}
                  placeholder="e.g. Administrative Access"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Extracted Value (optional)</label>
                <input
                  className="form-input"
                  value={mappingValue}
                  onChange={(e) => setMappingValue(e.target.value)}
                  placeholder="e.g. 900 or true"
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleTeach}
                  disabled={!mappingSemantic}
                  style={{ opacity: mappingSemantic ? 1 : 0.5 }}
                >
                  Accept Mapping
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleTeachAndReprocess}
                  disabled={!mappingSemantic}
                  style={{ opacity: mappingSemantic ? 1 : 0.5 }}
                >
                  ⚡ Teach & Reprocess
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>⚡</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Select an unknown construct to teach TĀRĀ its security meaning
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
