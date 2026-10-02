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
    showToast('Mapping deleted');
  };

  const handleExport = () => {
    exportKnowledge();
    showToast('Knowledge exported');
  };

  const handleImport = () => {
    const result = importKnowledge(importText);
    if (result.success) {
      refresh();
      setShowImport(false);
      setImportText('');
      showToast(`Imported ${result.imported} mappings`);
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleClear = () => {
    if (confirm('Clear all learned mappings? This cannot be undone.')) {
      clearLearnedMappings();
      refresh();
      showToast('All mappings cleared');
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
          showToast(`Imported ${result.imported} mappings`);
        } else {
          showToast(result.error, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">◈ TĀRĀ Memory</h1>
        <p className="page-subtitle">{mappings.length} learned mappings stored in local knowledge base</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={handleExport}>↓ Export Knowledge</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowImport(!showImport)}>↑ Import Knowledge</button>
        <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
          📁 Import File
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />
        </label>
        {mappings.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleClear}>✕ Clear All</button>
        )}
      </div>

      {/* Import Textarea */}
      {showImport && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="card-title">Import Knowledge JSON</div>
          <textarea
            className="form-textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='Paste TĀRĀ-NETRA knowledge JSON here...'
            style={{ minHeight: '120px' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button className="btn btn-primary btn-sm" onClick={handleImport}>Import</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowImport(false); setImportText(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Mappings List */}
      {mappings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◈</div>
          <div className="empty-state-text">No learned mappings yet. Use the Training Studio to teach TĀRĀ.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {mappings.map((mapping) => (
            <div key={mapping.id} className="card" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cyan)', marginBottom: '4px' }}>
                    {mapping.rawCommand || mapping.pattern}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>→ {mapping.controlName || mapping.semantic}</span>
                    <span className="badge badge-learned" style={{ fontSize: '0.6rem' }}>LEARNED</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Confidence: {mapping.confidence}%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Source: {mapping.source}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Category: {mapping.category} • {mapping.timestamp ? new Date(mapping.timestamp).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(mapping.id)}
                  style={{ flexShrink: 0, marginLeft: 'var(--space-md)' }}
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
