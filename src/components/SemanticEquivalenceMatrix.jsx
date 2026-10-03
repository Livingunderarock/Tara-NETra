import React, { useState } from 'react';
import { EQUIVALENCE_DATA } from '../knowledge/equivalenceData.js';

export default function SemanticEquivalenceMatrix() {
  const [selectedIntentId, setSelectedIntentId] = useState('ssh_v2');

  const activeIntent = EQUIVALENCE_DATA.find(d => d.id === selectedIntentId) || EQUIVALENCE_DATA[0];

  return (
    <div className="semantic-equivalence-container" style={{
      marginTop: 'var(--space-2xl)',
      padding: 'var(--space-xl)',
      background: 'var(--color-surface)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div>
          <div className="page-tag" style={{ color: 'var(--color-gold)' }}>Core Philosophy</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-indigo)', margin: '4px 0' }}>
            One Security Intent • Many Configuration Syntaxes
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary)', maxWidth: '640px', lineHeight: 1.5 }}>
            Different vendors use completely disparate configuration languages. Tārā-NETra does not translate one vendor CLI into another — it normalizes heterogeneous syntax into a single, unified <strong>Security Baseline Model (SBM)</strong>.
          </p>
        </div>

        <div style={{
          padding: '8px 14px',
          background: 'var(--color-bg-base)',
          border: '1px solid rgba(176, 138, 60, 0.4)',
          borderRadius: 'var(--radius-xs)',
          textAlign: 'right',
        }}>
          <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ochre)' }}>
            Common Security Abstraction
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-indigo)', fontWeight: 600 }}>
            {activeIntent.semanticMeaning}
          </div>
        </div>
      </div>

      {/* Interactive Intent Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
        {EQUIVALENCE_DATA.map(item => (
          <button
            key={item.id}
            type="button"
            className={`btn-filter ${selectedIntentId === item.id ? 'active' : ''}`}
            onClick={() => setSelectedIntentId(item.id)}
            style={{ fontSize: '0.74rem' }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Visual Architectural Convergence Diagram */}
      <div style={{
        background: 'var(--color-bg-base)',
        border: 'var(--border-hairline)',
        padding: '16px',
        borderRadius: 'var(--radius-xs)',
        marginBottom: 'var(--space-lg)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'center',
        }}>
          {activeIntent.mappings.map(m => (
            <div key={m.vendor} style={{
              padding: '10px 12px',
              background: m.isLearned ? 'rgba(84, 58, 122, 0.15)' : 'var(--color-surface)',
              border: m.isLearned ? '1px dashed var(--color-purple)' : 'var(--border-hairline)',
              borderRadius: 'var(--radius-xs)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-indigo)' }}>{m.vendor}</span>
                <span style={{ fontSize: '0.6rem', color: m.isLearned ? 'var(--color-purple)' : 'var(--color-ink-muted)' }}>
                  {m.provenance}
                </span>
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                margin: 0,
                color: m.isLearned ? 'var(--color-ochre)' : 'var(--color-ink-primary)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {m.raw}
              </pre>
            </div>
          ))}
        </div>

        {/* Convergence Arrow to SBM */}
        <div style={{ textAlign: 'center', margin: '12px 0 6px 0', color: 'var(--color-ochre)', fontSize: '0.85rem' }}>
          ↓ All heterogeneous syntax dialects normalize to the same Security Baseline Model ↓
        </div>

        <div style={{
          textAlign: 'center',
          padding: '8px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-gold)',
          borderRadius: 'var(--radius-xs)',
          maxWidth: '460px',
          margin: '0 auto',
        }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ink-muted)' }}>
            Security Baseline Model (SBM) Canonical Key:
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 700 }}>
            {activeIntent.semanticMeaning}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Vendor / Dialect</th>
              <th style={{ width: '38%' }}>Raw CLI Syntax</th>
              <th style={{ width: '24%' }}>Normalized SBM Semantic Meaning</th>
              <th style={{ width: '20%' }}>Knowledge Provenance</th>
            </tr>
          </thead>
          <tbody>
            {activeIntent.mappings.map(m => (
              <tr key={m.vendor}>
                <td style={{ fontWeight: 600, color: 'var(--color-indigo)' }}>
                  {m.vendor}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: m.isLearned ? 'var(--color-ochre)' : 'inherit' }}>
                  {m.raw}
                  {m.isGeneralized && (
                    <span style={{ display: 'block', fontSize: '0.66rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      ✦ Generalized Parameterized Pattern
                    </span>
                  )}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)', fontWeight: 600 }}>
                  {activeIntent.semanticMeaning}
                </td>
                <td>
                  <span className={`badge ${m.isLearned ? 'badge-learned' : 'badge-recognized'}`} style={{ fontSize: '0.66rem' }}>
                    {m.provenance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
