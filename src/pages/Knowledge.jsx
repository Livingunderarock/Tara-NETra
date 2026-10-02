import React, { useState } from 'react';
import { getLearnedMappings, deleteLearnedMapping, exportKnowledge, importKnowledge, clearLearnedMappings } from '../services/storage';

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
          <div className="page-tag">Persistent Archive</div>
          <h1 className="page-title">TĀRĀ Memory</h1>
          <div className="page-subtitle">
            Curated repository of learned configuration semantics ({mappings.length} rules inscribed)
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
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
            placeholder="Paste TĀRĀ-NETRA knowledge JSON here..."
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
            Use the TĀRĀ Learning Studio to instruct the system on unfamiliar syntax.
          </div>
        </div>
      ) : (
        <div className="memory-archive-ledger">
          <div className="ledger-header">
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
              Raw Directive Pattern &amp; Normalized Semantic Concept
            </span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--color-ink-muted)' }}>
              Confidence &amp; Source
            </span>
          </div>

          {mappings.map((mapping) => (
            <div key={mapping.id} className="ledger-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ledger-command">
                  {mapping.rawCommand || mapping.pattern}
                </div>
                <div className="ledger-meta">
                  <span className="ledger-arrow">⟶</span>
                  <strong style={{ color: 'var(--color-ochre)' }}>
                    {mapping.controlName || mapping.semantic}
                  </strong>
                  <span>•</span>
                  <span>{mapping.category}</span>
                  {mapping.timestamp && (
                    <>
                      <span>•</span>
                      <span>{new Date(mapping.timestamp).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span className="badge badge-learned">
                  {mapping.confidence || 97}% • {mapping.source || 'Admin'}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(mapping.id)}
                  title="Remove from memory"
                  style={{ padding: '4px 8px', fontSize: '0.7rem' }}
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
