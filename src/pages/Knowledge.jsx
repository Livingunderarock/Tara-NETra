import React, { useState } from 'react';
import { getLearnedMappings, deleteLearnedMapping, exportKnowledge, importKnowledge, clearLearnedMappings, saveLearnedMapping } from '../services/storage';
import { synthesizeGeneralizedPattern } from '../core/patternGeneralizer';

export default function Knowledge({ showToast }) {
  const [mappings, setMappings] = useState(getLearnedMappings());
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const refresh = () => setMappings(getLearnedMappings());

  const handleDelete = (id) => {
    deleteLearnedMapping(id);
    refresh();
    showToast('Knowledge mapping removed');
  };

  const handleExport = () => {
    exportKnowledge();
    showToast('Knowledge archive exported as JSON');
  };

  const handleImport = () => {
    const result = importKnowledge(importText);
    if (result.success) {
      refresh();
      setShowImport(false);
      setImportText('');
      showToast(`Imported ${result.imported} knowledge mappings`);
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleClear = () => {
    if (confirm('Clear all learned mappings? This will reset custom knowledge.')) {
      clearLearnedMappings();
      refresh();
      showToast('All custom knowledge cleared');
    }
  };

  const handleSeedDemoPattern = () => {
    const generalized = synthesizeGeneralizedPattern(
      'set secure-admin session-limit 900',
      'ADMIN_SESSION_TIMEOUT',
      900,
      'BRANCH-GW-04'
    );
    saveLearnedMapping(generalized);
    refresh();
    showToast('Seeded demonstration pattern: set secure-admin session-limit <VALUE>');
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = importKnowledge(ev.target.result);
        if (result.success) {
          refresh();
          showToast(`Imported ${result.imported} knowledge mappings`);
        } else {
          showToast(result.error, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Persistent Knowledge Layer</div>
          <h1 className="page-title">Tārā Memory</h1>
          <div className="page-subtitle">
            Curated repository of generalized configuration semantics and human-taught ground truths ({mappings.length} rule{mappings.length !== 1 ? 's' : ''} inscribed)
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSeedDemoPattern}>
          ✦ Inscribe Demo Rule (Session Timeout)
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
          Export Knowledge Pack
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowImport(!showImport)}>
          Import Text JSON
        </button>
        <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
          Import from Disk
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />
        </label>
        {mappings.length > 0 && (
          <button type="button" className="btn btn-danger btn-sm" onClick={handleClear} style={{ marginLeft: 'auto' }}>
            Clear Archive
          </button>
        )}
      </div>

      {/* Import Drawer */}
      {showImport && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', borderTop: '2px solid var(--color-ochre)' }}>
          <div className="card-title">Inscribe External Knowledge JSON</div>
          <textarea
            className="form-textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste Tārā-NETra knowledge JSON here..."
            style={{ minHeight: '120px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleImport}>Inscribe</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setShowImport(false); setImportText(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Editorial Ledger Archive */}
      {mappings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-symbol">☵</span>
          <div className="empty-state-text">No learned mappings inscribed in memory</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            Use the Tārā Learning Studio to instruct the system on unfamiliar syntax, or click <strong>"Inscribe Demo Rule"</strong> above.
          </div>
        </div>
      ) : (
        <div className="memory-archive-ledger">
          <div className="ledger-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', padding: '10px 16px', background: 'var(--color-bg-base)', borderBottom: 'var(--border-hairline)' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
              Generalized Pattern &amp; Normalized Semantic Concept
            </span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--color-ink-muted)', textAlign: 'right' }}>
              Knowledge Provenance &amp; Actions
            </span>
          </div>

          {mappings.map((mapping) => (
            <div key={mapping.id} className="ledger-item" style={{ padding: '14px 16px', borderBottom: 'var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Generalized Pattern in Gold/Indigo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                    {mapping.learnedPattern || mapping.rawCommand || mapping.pattern}
                  </span>
                  {mapping.learnedPattern && mapping.learnedPattern.includes('<') && (
                    <span className="badge badge-learned" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                      ✓ GENERALIZED PATTERN
                    </span>
                  )}
                </div>

                {/* Original Training Command */}
                {mapping.rawExample && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                    Training Example: <code style={{ color: 'var(--color-ink-secondary)', background: 'var(--color-bg-base)', padding: '1px 5px', borderRadius: '2px' }}>{mapping.rawExample}</code>
                  </div>
                )}

                {/* Semantic Target & Parameter details */}
                <div className="ledger-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                  <span className="ledger-arrow">⟶</span>
                  <strong style={{ color: 'var(--color-ochre)' }}>
                    {mapping.semanticControl || mapping.controlName || mapping.semantic}
                  </strong>
                  <span style={{ color: 'var(--color-ink-muted)' }}>({mapping.semantic})</span>
                  <span>•</span>
                  <span>{mapping.category}</span>
                  {mapping.parameter && (
                    <>
                      <span>•</span>
                      <span style={{ color: 'var(--color-pass)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                        Extracted: {mapping.parameter} ({mapping.parameterType || 'value'} = {String(mapping.value ?? mapping.extractedValue)})
                      </span>
                    </>
                  )}
                  {mapping.originDevice && (
                    <>
                      <span>•</span>
                      <span style={{ color: 'var(--color-ink-muted)' }}>From: {mapping.originDevice}</span>
                    </>
                  )}
                  {mapping.timestamp && (
                    <>
                      <span>•</span>
                      <span style={{ color: 'var(--color-ink-muted)' }}>{new Date(mapping.timestamp).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Provenance & Delete Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-learned" style={{ display: 'block', fontSize: '0.68rem', textAlign: 'center' }}>
                    {mapping.confidence || 97}% • {mapping.source || 'HUMAN_TRAINED'}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--color-gold)', display: 'block', marginTop: '2px' }}>
                    Tārā Memory
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(mapping.id)}
                  title="Remove from memory"
                  style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

