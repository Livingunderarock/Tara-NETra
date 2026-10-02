import React, { useState } from 'react';
import { frameworkInfo } from '../knowledge/semanticControls';

export default function Compliance({ complianceResult, heatmapData, analysisResult }) {
  const [activeTab, setActiveTab] = useState('frameworks');

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Regulatory Assurance</div>
            <h1 className="page-title">Compliance Audit</h1>
            <div className="page-subtitle">Deterministic evaluation against international benchmarks</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-state-symbol">◫</span>
          <div className="empty-state-text">Analyze a configuration first to evaluate compliance</div>
        </div>
      </div>
    );
  }

  const { summary, frameworkScores, categoryScores, securityDebt } = complianceResult;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Audit Assurance</div>
          <h1 className="page-title">Compliance Evaluation</h1>
          <div className="page-subtitle">
            {analysisResult?.deviceName || 'Device'} — {summary.total} controls verified across {Object.keys(frameworkScores).length} standard frameworks
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="metrics-row" style={{ padding: 'var(--space-md) 0' }}>
        <div className="metric-item">
          <div className="metric-number" style={{ color: summary.compliancePercent >= 80 ? 'var(--color-pass)' : 'var(--color-ochre)' }}>
            {summary.compliancePercent}%
          </div>
          <div className="metric-caption">Aggregate Compliance</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: 'var(--color-pass)' }}>
            {summary.pass}
          </div>
          <div className="metric-caption">Satisfied (Pass)</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: 'var(--color-fail)' }}>
            {summary.fail}
          </div>
          <div className="metric-caption">Unsatisfied (Fail)</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: 'var(--color-unknown)' }}>
            {summary.unknown}
          </div>
          <div className="metric-caption">Unverified (Unknown)</div>
        </div>

        <div className="metric-item">
          <div className="metric-number">
            {summary.total}
          </div>
          <div className="metric-caption">Total Evaluated</div>
        </div>
      </div>

      {/* Segmented Navigation */}
      <div className="segmented-nav">
        <button
          type="button"
          className={`segmented-btn ${activeTab === 'frameworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('frameworks')}
        >
          Framework Summary
        </button>
        <button
          type="button"
          className={`segmented-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('heatmap')}
        >
          Compliance Heatmap
        </button>
        <button
          type="button"
          className={`segmented-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakdown')}
        >
          Category Ledger &amp; Debt
        </button>
      </div>

      {/* Tab 1: Framework Scores Cards */}
      {activeTab === 'frameworks' && (
        <div className="framework-cards-grid">
          {Object.entries(frameworkScores).map(([fw, score]) => (
            <div key={fw} className="framework-card">
              <div className="framework-card-header">
                <div>
                  <div className="framework-name">{frameworkInfo[fw]?.name || fw}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)' }}>
                    {frameworkInfo[fw]?.fullName}
                  </div>
                </div>
                <div className="framework-score">
                  {score.percent}%
                </div>
              </div>

              <div className="progress-rule">
                <div
                  className="progress-rule-fill"
                  style={{
                    width: `${score.percent}%`,
                    background: score.percent >= 80 ? 'var(--color-pass)' : 'var(--color-ochre)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-ink-secondary)', marginTop: 'auto' }}>
                <span><span style={{ color: 'var(--color-pass)' }}>●</span> Pass: {score.pass}</span>
                <span><span style={{ color: 'var(--color-fail)' }}>●</span> Fail: {score.fail}</span>
                <span><span style={{ color: 'var(--color-unknown)' }}>○</span> Unknown: {score.unknown}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Compliance Heatmap Matrix */}
      {activeTab === 'heatmap' && heatmapData && (
        <div className="card">
          <div className="card-title">Framework Compliance Heatmap Matrix</div>
          <div className="card-subtext">Visual distribution of pass/fail assurance across architectural security domains</div>

          <div style={{ overflowX: 'auto', marginTop: 'var(--space-md)' }}>
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Security Domain</th>
                  {Object.keys(frameworkScores).map(fw => (
                    <th key={fw} style={{ color: 'var(--color-indigo)' }}>
                      {fw}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(heatmapData).map(([category, fws]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    {Object.entries(fws).map(([fw, status]) => (
                      <td key={fw}>
                        {status === 'PASS' && <span className="status-dot-pass" title="Pass" />}
                        {status === 'FAIL' && <span className="status-dot-fail" title="Fail" />}
                        {status === 'UNKNOWN' && <span className="status-dot-unknown" title="Unknown / Insufficient Evidence" />}
                        {status === 'N/A' && <span style={{ color: 'var(--color-ink-muted)' }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xl)', marginTop: 'var(--space-lg)', fontSize: '0.74rem', color: 'var(--color-ink-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot-pass" /> Satisfied Requirement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot-fail" /> Non-Compliant Finding
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot-unknown" /> Insufficient Evidence
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>—</span> Not Mapped
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Category Ledger & Security Debt */}
      {activeTab === 'breakdown' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-xl)' }}>
          {/* Category Table */}
          <div className="card">
            <div className="card-title">Category Domain Ledger</div>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Domain Category</th>
                  <th style={{ textAlign: 'center' }}>Pass</th>
                  <th style={{ textAlign: 'center' }}>Fail</th>
                  <th style={{ textAlign: 'center' }}>Unknown</th>
                  <th style={{ textAlign: 'right' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryScores).map(([cat, score]) => (
                  <tr key={cat}>
                    <td style={{ fontWeight: 500 }}>{cat}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-pass)' }}>{score.pass}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-fail)' }}>{score.fail}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-unknown)' }}>{score.unknown}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{score.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Security Debt */}
          <div className="card">
            <div className="card-title">Weighted Security Debt</div>
            <div className="card-subtext">Distribution of unmitigated findings weighted by risk severity</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-fail)' }}>High Severity</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{securityDebt.HIGH}</span>
                </div>
                <div className="progress-rule">
                  <div
                    className="progress-rule-fill"
                    style={{
                      width: `${Math.min(securityDebt.HIGH * 25, 100)}%`,
                      background: 'var(--color-fail)'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-unknown)' }}>Medium Severity</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{securityDebt.MEDIUM}</span>
                </div>
                <div className="progress-rule">
                  <div
                    className="progress-rule-fill"
                    style={{
                      width: `${Math.min(securityDebt.MEDIUM * 25, 100)}%`,
                      background: 'var(--color-unknown)'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-indigo)' }}>Low Severity</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{securityDebt.LOW}</span>
                </div>
                <div className="progress-rule">
                  <div
                    className="progress-rule-fill"
                    style={{
                      width: `${Math.min(securityDebt.LOW * 25, 100)}%`,
                      background: 'var(--color-indigo)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
