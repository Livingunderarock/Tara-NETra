import React from 'react';
import { frameworkInfo } from '../knowledge/semanticControls';

export default function Overview({ analysisResult, complianceResult, history, onAnalyze, navigate }) {
  const stats = analysisResult?.stats || {};
  const summary = complianceResult?.summary || {};
  const frameworkScores = complianceResult?.frameworkScores || {};

  const hasData = !!analysisResult;

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      {!hasData && (
        <div className="hero">
          {/* Eye Visualization */}
          <div className="eye-viz">
            <div className="eye-outer">
              <div className="eye-star" style={{ top: '-3px', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="eye-star" style={{ bottom: '-3px', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="eye-star" style={{ top: '50%', left: '-3px', transform: 'translateY(-50%)' }} />
              <div className="eye-star" style={{ top: '50%', right: '-3px', transform: 'translateY(-50%)' }} />
            </div>
            <div className="eye-middle" />
            <div className="eye-inner" />
            <div className="eye-pupil" />
          </div>

          <h1 className="hero-title">TĀRĀ-NETRA</h1>
          <h2 className="hero-subtitle">The Guiding Eye<br/>for Network Security</h2>
          <p className="hero-tagline">Understand. Learn. Audit. Assure.</p>
          <p className="hero-description">
            AI-assisted vendor-agnostic configuration interpretation and compliance assurance.
            Different vendors speak different configuration languages — TĀRĀ-NETRA learns the security meaning behind them.
          </p>

          {/* Workflow */}
          <div className="workflow">
            {['Unknown', 'Explain', 'Teach', 'Learn', 'Verify', 'Audit'].map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && <span className="workflow-arrow">→</span>}
                <span className="workflow-step">{step}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="hero-actions" style={{ marginTop: 'var(--space-xl)' }}>
            <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
              ⬡ Analyze Configuration
            </button>
            <button className="btn btn-secondary" onClick={() => {
              import('../knowledge/sampleConfigs').then(m => {
                onAnalyze(m.sampleConfigs.cisco.content, m.sampleConfigs.cisco.name);
              });
            }}>
              ▶ Run TĀRĀ Demo
            </button>
          </div>
        </div>
      )}

      {/* Dashboard when data exists */}
      {hasData && (
        <>
          <div className="page-header">
            <h1 className="page-title">◉ TĀRĀ-NETRA Overview</h1>
            <p className="page-subtitle">Security posture dashboard — {analysisResult.deviceName || 'Unknown Device'}</p>
          </div>

          {/* Top Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{String(history.length).padStart(2, '0')}</div>
              <div className="metric-label">Devices Analyzed</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{summary.total || 0}</div>
              <div className="metric-label">Controls Evaluated</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: stats.unknown > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                {String(stats.unknown || 0).padStart(2, '0')}
              </div>
              <div className="metric-label">Unknown Constructs</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: 'var(--color-purple)' }}>
                {String(stats.learned || 0).padStart(2, '0')}
              </div>
              <div className="metric-label">Learned Mappings</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: summary.compliancePercent >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {summary.compliancePercent || 0}%
              </div>
              <div className="metric-label">Compliance</div>
            </div>
          </div>

          <div className="grid-2">
            {/* Compliance Pulse */}
            <div className="card">
              <div className="card-title">Compliance Pulse</div>
              {Object.entries(frameworkScores).map(([fw, score]) => (
                <div key={fw} style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem', color: frameworkInfo[fw]?.color || 'var(--color-text)' }}>
                      {frameworkInfo[fw]?.name || fw}
                    </span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                      {score.percent}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${fw.toLowerCase()}`} style={{ width: `${score.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Status */}
            <div className="card">
              <div className="card-title">TĀRĀ Intelligence Status</div>
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>Recognized</span>
                    <span style={{ fontWeight: 700 }}>{stats.recognizedPercent || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.recognizedPercent || 0}%`, background: 'var(--color-success)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-warning)' }}>Low Confidence</span>
                    <span style={{ fontWeight: 700 }}>{stats.total > 0 ? Math.round((stats.lowConfidence / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.total > 0 ? (stats.lowConfidence / stats.total) * 100 : 0}%`, background: 'var(--color-warning)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>Unknown</span>
                    <span style={{ fontWeight: 700 }}>{stats.total > 0 ? Math.round((stats.unknown / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.total > 0 ? (stats.unknown / stats.total) * 100 : 0}%`, background: 'var(--color-danger)' }} />
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/training')} style={{ marginTop: 'var(--space-sm)' }}>
                  ⚡ Open Training Studio
                </button>
              </div>
            </div>
          </div>

          {/* Security Fingerprint */}
          {complianceResult && (
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <div className="card-title">Device Security Fingerprint</div>
              <div className="fingerprint">
                {Object.entries(complianceResult.categoryScores).map(([cat, score]) => (
                  <div key={cat} className="fingerprint-row">
                    <span className="fingerprint-label">{cat.split(' ').map(w => w[0]).join('')}</span>
                    <div className="fingerprint-bar">
                      <div className="fingerprint-fill" style={{ width: `${score.percent}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', minWidth: '35px', textAlign: 'right' }}>{score.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
