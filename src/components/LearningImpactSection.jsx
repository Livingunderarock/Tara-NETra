import React, { useState } from 'react';

/**
 * LearningImpactSection — Visual proof that "Learning changes the audit"
 * Renders real calculated values showing before vs after compliance metrics
 * and traceable impact chains.
 */
export default function LearningImpactSection({ impactData, onNavigateToFindings }) {
  const [selectedControlId, setSelectedControlId] = useState(null);

  if (!impactData || !impactData.hasImpact) {
    return null;
  }

  const { before, after, delta, resolvedControls } = impactData;
  const selectedResolved = resolvedControls.find(r => r.controlId === selectedControlId) || resolvedControls[0];

  return (
    <div className="learning-impact-card" style={{
      marginTop: 'var(--space-2xl)',
      padding: 'var(--space-xl)',
      background: 'var(--color-surface)',
      border: '1px solid rgba(166, 106, 44, 0.4)',
      borderRadius: 'var(--radius-sm)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div>
          <div className="page-tag" style={{ color: 'var(--color-gold)' }}>Audit Transformation</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-indigo)', margin: '4px 0' }}>
            Learning Impact • How Knowledge Inscription Changed the Audit
          </h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary)', maxWidth: '600px', lineHeight: 1.5 }}>
            TĀRĀ does not merely store syntax tags — learned semantic patterns directly activate deterministic compliance rules, turning unverified configurations into actionable audit evidence.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-learned" style={{ fontSize: '0.74rem' }}>
            ✓ {impactData.learnedLinesCount} Learned Pattern(s) Active
          </span>
        </div>
      </div>

      {/* Before vs After Impact Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        {/* Before Learning */}
        <div style={{
          padding: '16px',
          background: 'var(--color-bg-base)',
          border: 'var(--border-hairline)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ink-muted)', marginBottom: '8px' }}>
            Before Learning (Pure Baseline)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-indigo)' }}>
              {before.compliancePercent}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>Baseline Compliance</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center', fontSize: '0.72rem' }}>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-pass)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{before.pass}</span>
              PASS
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-fail)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{before.fail}</span>
              FAIL
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-ochre)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{before.unknown}</span>
              UNKNOWN
            </div>
          </div>
        </div>

        {/* Transition Arrow / Transform Center */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: '4px' }}>
            → ⚚ →
          </div>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-indigo)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            TĀRĀ Learned Patterns
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
            Deterministic Rules Re-evaluated
          </div>
        </div>

        {/* After Learning */}
        <div style={{
          padding: '16px',
          background: 'rgba(32, 38, 58, 0.45)',
          border: '1px solid rgba(176, 138, 60, 0.5)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
            After Learning (Knowledge Active)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-gold)' }}>
              {after.compliancePercent}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-pass)', fontWeight: 600 }}>
              {delta.percentDelta >= 0 ? `+${delta.percentDelta}%` : `${delta.percentDelta}%`} Delta
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center', fontSize: '0.72rem' }}>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-pass)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{after.pass}</span>
              PASS
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-fail)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{after.fail}</span>
              FAIL
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '6px 4px', borderRadius: '2px' }}>
              <span style={{ color: 'var(--color-ochre)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{after.unknown}</span>
              UNKNOWN
            </div>
          </div>
        </div>
      </div>

      {/* 3 Impact Stat Banners */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        <div style={{
          padding: '12px 16px',
          background: 'var(--color-bg-base)',
          borderLeft: '3px solid var(--color-gold)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-indigo)' }}>
            {delta.unknownConstructsResolved || impactData.learnedLinesCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
            Previously unknown constructs resolved
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          background: 'var(--color-bg-base)',
          borderLeft: '3px solid var(--color-pass)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-pass)' }}>
            {delta.actionableDecisions || resolvedControls.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
            Compliance decisions became actionable
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          background: 'var(--color-bg-base)',
          borderLeft: '3px solid var(--color-purple)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-purple)' }}>
            {delta.newControlsEvaluated || resolvedControls.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
            New security control(s) evaluated
          </div>
        </div>
      </div>

      {/* Traceable Transformation Chain (Unknown construct -> Semantic meaning -> Security control -> Framework -> Result) */}
      {resolvedControls.length > 0 && (
        <div style={{
          background: 'var(--color-bg-base)',
          border: 'var(--border-hairline)',
          padding: '16px',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-indigo)', fontWeight: 600, marginBottom: '12px' }}>
            Traceable Evidence of Learning Action:
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {resolvedControls.map(rc => (
              <button
                key={rc.controlId}
                type="button"
                className={`btn-filter ${selectedResolved?.controlId === rc.controlId ? 'active' : ''}`}
                onClick={() => setSelectedControlId(rc.controlId)}
                style={{ fontSize: '0.72rem' }}
              >
                {rc.controlId} ({rc.statusAfter})
              </button>
            ))}
          </div>

          {selectedResolved && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.76rem',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>1. Unknown Construct</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-indigo)', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
                    {selectedResolved.rawConstruct}
                  </div>
                  {selectedResolved.learnedPattern && (
                    <div style={{ fontSize: '0.64rem', color: 'var(--color-ochre)', marginTop: '2px' }}>
                      Pattern: {selectedResolved.learnedPattern}
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>2. Semantic Meaning</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)', fontWeight: 600, marginTop: '2px' }}>
                    {selectedResolved.controlName}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Observed: {JSON.stringify(selectedResolved.observedValue)}
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>3. Security Control</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-indigo)', fontWeight: 600, marginTop: '2px' }}>
                    {selectedResolved.controlId}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Category: {selectedResolved.category}
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>4. Compliance Result</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ textDecoration: 'line-through', color: 'var(--color-ink-muted)' }}>UNKNOWN</span>
                    <span>→</span>
                    <span className={`badge ${selectedResolved.statusAfter === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                      {selectedResolved.statusAfter}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                    Severity: {selectedResolved.severity}
                  </div>
                </div>
              </div>

              {onNavigateToFindings && (
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', color: 'var(--color-gold)' }}
                    onClick={onNavigateToFindings}
                  >
                    Inspect in Findings Desk →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
