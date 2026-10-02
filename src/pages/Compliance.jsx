import React, { useState } from 'react';
import { frameworkInfo } from '../knowledge/semanticControls';

export default function Compliance({ complianceResult, heatmapData, analysisResult }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">◆ Compliance Engine</h1>
          <p className="page-subtitle">Multi-framework compliance evaluation</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">◆</div>
          <div className="empty-state-text">Analyze a configuration first to evaluate compliance</div>
        </div>
      </div>
    );
  }

  const { summary, frameworkScores, categoryScores, securityDebt } = complianceResult;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">◆ Compliance Engine</h1>
        <p className="page-subtitle">
          {analysisResult?.deviceName || 'Device'} — {summary.total} controls evaluated across {Object.keys(frameworkScores).length} frameworks
        </p>
      </div>

      {/* Top Summary */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value" style={{ color: 'var(--color-success)' }}>{summary.pass}</div>
          <div className="metric-label">Pass</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: 'var(--color-danger)' }}>{summary.fail}</div>
          <div className="metric-label">Fail</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: 'var(--color-warning)' }}>{summary.unknown}</div>
          <div className="metric-label">Unknown</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: summary.compliancePercent >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {summary.compliancePercent}%
          </div>
          <div className="metric-label">Overall Compliance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Framework Scores</button>
        <button className={`tab ${activeTab === 'heatmap' ? 'active' : ''}`} onClick={() => setActiveTab('heatmap')}>Heatmap</button>
        <button className={`tab ${activeTab === 'debt' ? 'active' : ''}`} onClick={() => setActiveTab('debt')}>Security Debt</button>
      </div>

      {/* Framework Scores */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {Object.entries(frameworkScores).map(([fw, score]) => (
            <div key={fw} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: frameworkInfo[fw]?.color }}>
                    {frameworkInfo[fw]?.name || fw}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{frameworkInfo[fw]?.fullName}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2rem', color: frameworkInfo[fw]?.color }}>
                  {score.percent}%
                </div>
              </div>
              <div className="progress-bar" style={{ height: '8px', marginBottom: 'var(--space-md)' }}>
                <div className={`progress-fill ${fw.toLowerCase()}`} style={{ width: `${score.percent}%` }} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8rem' }}>
                <span><span style={{ color: 'var(--color-success)' }}>●</span> Pass: {score.pass}</span>
                <span><span style={{ color: 'var(--color-danger)' }}>●</span> Fail: {score.fail}</span>
                <span><span style={{ color: 'var(--color-warning)' }}>●</span> Unknown: {score.unknown}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Heatmap */}
      {activeTab === 'heatmap' && heatmapData && (
        <div className="card">
          <div className="card-title">Compliance Heatmap</div>
          <div className="heatmap-grid" style={{ gridTemplateColumns: `160px repeat(${Object.keys(frameworkScores).length}, 1fr)` }}>
            {/* Headers */}
            <div className="heatmap-header"></div>
            {Object.keys(frameworkScores).map(fw => (
              <div key={fw} className="heatmap-header" style={{ color: frameworkInfo[fw]?.color }}>{fw}</div>
            ))}

            {/* Rows */}
            {Object.entries(heatmapData).map(([category, fws]) => (
              <React.Fragment key={category}>
                <div className="heatmap-label">{category}</div>
                {Object.entries(fws).map(([fw, status]) => (
                  <div
                    key={fw}
                    className={`heatmap-cell ${status === 'PASS' ? 'pass' : status === 'FAIL' ? 'fail' : status === 'UNKNOWN' ? 'unknown-cell' : 'na'}`}
                  >
                    {status === 'PASS' ? '●' : status === 'FAIL' ? '●' : status === 'UNKNOWN' ? '○' : '—'}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Security Debt */}
      {activeTab === 'debt' && (
        <div className="card">
          <div className="card-title">Security Debt</div>
          <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            {[
              { label: 'HIGH', value: securityDebt.HIGH, color: 'var(--color-danger)' },
              { label: 'MEDIUM', value: securityDebt.MEDIUM, color: 'var(--color-warning)' },
              { label: 'LOW', value: securityDebt.LOW, color: 'var(--color-cyan)' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem', color: item.color }}>{item.label}</span>
                  <span style={{ fontWeight: 700 }}>{item.value}</span>
                </div>
                <div className="progress-bar" style={{ height: '12px' }}>
                  <div style={{
                    height: '100%', borderRadius: '3px',
                    width: `${Math.min(item.value * 20, 100)}%`,
                    background: item.color,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <div className="card-title">Category Breakdown</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Pass</th>
                  <th>Fail</th>
                  <th>Unknown</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryScores).map(([cat, score]) => (
                  <tr key={cat}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{cat}</td>
                    <td><span style={{ color: 'var(--color-success)' }}>{score.pass}</span></td>
                    <td><span style={{ color: 'var(--color-danger)' }}>{score.fail}</span></td>
                    <td><span style={{ color: 'var(--color-warning)' }}>{score.unknown}</span></td>
                    <td><span style={{ fontWeight: 700, color: score.percent >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>{score.percent}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
