import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { frameworkInfo } from '../knowledge/semanticControls';
import { generateHeatmap } from '../core/compliance';
import { calculateLearningImpact } from '../core/learningImpact';
import LearningImpactSection from '../components/LearningImpactSection';

const DOMAIN_ICONS = {
  'Administrative Access': '⚙',
  'Authentication': '🔑',
  'Monitoring': '📜',
  'Time': '⏱',
  'Network Security': '🛡',
  'Services': '⚖'
};

function getHeatmapTileStyle(cell, isSelected, mode) {
  if (!cell || cell.status === 'N/A' || cell.total === 0) {
    return {
      bg: 'rgba(112, 105, 92, 0.05)',
      border: '1px dashed rgba(176, 138, 60, 0.3)',
      text: 'var(--color-ink-muted)',
      subText: 'rgba(112, 105, 92, 0.6)',
      glow: 'none',
      cursor: 'default'
    };
  }

  if (mode === 'risk') {
    if (cell.failed > 0) {
      const failRatio = cell.failed / cell.total;
      return {
        bg: failRatio >= 0.5 ? '#F4D4CD' : '#F9E2D8',
        border: failRatio >= 0.5 ? '1.5px solid #8C2D19' : '1.5px solid #B84A28',
        text: failRatio >= 0.5 ? '#6E1C0C' : '#8C2D19',
        subText: failRatio >= 0.5 ? '#8C2D19' : '#B84A28',
        glow: isSelected ? '0 0 0 3px rgba(140, 45, 25, 0.45)' : 'none',
        cursor: 'pointer'
      };
    }
    if (cell.unknown > 0) {
      return {
        bg: '#EAE6DF',
        border: '1.5px solid #70695C',
        text: '#20263A',
        subText: '#4A5568',
        glow: isSelected ? '0 0 0 3px rgba(74, 85, 104, 0.35)' : 'none',
        cursor: 'pointer'
      };
    }
    return {
      bg: '#D6EADF',
      border: '1.5px solid #2A5A3B',
      text: '#143820',
      subText: '#1E4E2C',
      glow: isSelected ? '0 0 0 3px rgba(42, 90, 59, 0.4)' : 'none',
      cursor: 'pointer'
    };
  }

  // Standard Assurance Mode:
  const pct = cell.percent;
  if (pct === 100) {
    return {
      bg: '#D6EADF',
      border: '1.5px solid #2A5A3B',
      text: '#143820',
      subText: '#1E4E2C',
      glow: isSelected ? '0 0 0 3px rgba(42, 90, 59, 0.45)' : 'none',
      cursor: 'pointer'
    };
  }
  if (pct >= 70) {
    return {
      bg: '#E2EFE7',
      border: '1.5px solid #46865A',
      text: '#204A2E',
      subText: '#2D613D',
      glow: isSelected ? '0 0 0 3px rgba(70, 134, 90, 0.4)' : 'none',
      cursor: 'pointer'
    };
  }
  if (pct >= 40) {
    return {
      bg: '#F5EBCF',
      border: '1.5px solid #B08A3C',
      text: '#5E440E',
      subText: '#7A5B18',
      glow: isSelected ? '0 0 0 3px rgba(176, 138, 60, 0.45)' : 'none',
      cursor: 'pointer'
    };
  }
  if (pct > 0) {
    return {
      bg: '#F7DFD4',
      border: '1.5px solid #B84A28',
      text: '#7A240C',
      subText: '#9E3416',
      glow: isSelected ? '0 0 0 3px rgba(184, 74, 40, 0.45)' : 'none',
      cursor: 'pointer'
    };
  }
  return {
    bg: '#F4D4CD',
    border: '1.5px solid #8C2D19',
    text: '#5C1405',
    subText: '#7E1C0A',
    glow: isSelected ? '0 0 0 3px rgba(140, 45, 25, 0.45)' : 'none',
    cursor: 'pointer'
  };
}

export default function Compliance({ complianceResult, heatmapData, analysisResult, configText }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('frameworks');
  const [selectedCell, setSelectedCell] = useState(null);
  const [heatmapMode, setHeatmapMode] = useState('assurance');

  const impactData = useMemo(() => {
    return calculateLearningImpact(configText, analysisResult, complianceResult);
  }, [configText, analysisResult, complianceResult]);

  if (!complianceResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Regulatory Assurance</div>
            <h1 className="page-title">Compliance Audit</h1>
            <div className="page-subtitle">Curated high-value control subset aligned to CIS, NIST SP 800-53, DISA STIG and ISO/IEC 27001.</div>
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
  const effectiveHeatmap = heatmapData || (complianceResult ? generateHeatmap(complianceResult) : null);
  const frameworksList = Object.keys(frameworkScores || { CIS: {}, NIST: {}, STIG: {}, ISO: {} });

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-tag">Audit Assurance</div>
          <h1 className="page-title">Compliance Evaluation</h1>
          <div className="page-subtitle">
            {analysisResult?.deviceName || 'Device'} — Curated high-value control subset aligned to CIS, NIST SP 800-53, DISA STIG and ISO/IEC 27001. ({summary.total} controls verified)
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

      {/* Tab 2: Compliance Real Heatmap Matrix */}
      {activeTab === 'heatmap' && effectiveHeatmap && (
        <div className="real-heatmap-container">
          <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Heatmap Control Bar */}
            <div className="heatmap-control-bar">
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✧</span> Framework Compliance Assurance Matrix
                </div>
                <div className="card-subtext">
                  True heat-density distribution of regulatory assurance and risk posture across architectural domains
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="heatmap-mode-group">
                <button
                  type="button"
                  className={`heatmap-mode-btn ${heatmapMode === 'assurance' ? 'active' : ''}`}
                  onClick={() => setHeatmapMode('assurance')}
                  title="Color-graded by compliance assurance percentage"
                >
                  <span>✧</span> Assurance %
                </button>
                <button
                  type="button"
                  className={`heatmap-mode-btn ${heatmapMode === 'risk' ? 'active' : ''}`}
                  onClick={() => setHeatmapMode('risk')}
                  title="Highlight risk hotspots and unmitigated findings"
                >
                  <span>⚠</span> Risk Hotspots
                </button>
                <button
                  type="button"
                  className={`heatmap-mode-btn ${heatmapMode === 'counts' ? 'active' : ''}`}
                  onClick={() => setHeatmapMode('counts')}
                  title="Show pass / fail ratio counts in each cell"
                >
                  <span>◫</span> Control Ratios
                </button>
              </div>
            </div>

            {/* Continuous Color Heat Spectrum Legend */}
            <div className="heatmap-spectrum-card">
              <div className="heatmap-spectrum-title">Continuous Assurance Gradient Scale</div>
              <div className="heatmap-spectrum-bar" />
              <div className="heatmap-spectrum-labels">
                <span>0% Critical Failure</span>
                <span>25% High Risk</span>
                <span>50% Partial / Caution</span>
                <span>75% Strong Stance</span>
                <span>100% Full Assurance</span>
              </div>
              <div className="heatmap-spectrum-aux">
                <span className="aux-legend-item">
                  <span className="aux-swatch unknown" /> Insufficient Evidence (Unknown)
                </span>
                <span className="aux-legend-item">
                  <span className="aux-swatch na" /> — Not Mapped / Out of Scope
                </span>
                <span className="aux-legend-hint">
                  Tip: Click any cell to inspect controls and requirement citations
                </span>
              </div>
            </div>

            {/* The Real Heatmap Matrix */}
            <div className="heatmap-matrix-scroll">
              <table className="real-heatmap-matrix">
                <thead>
                  <tr>
                    <th className="heatmap-corner-cell">
                      <div className="corner-label">SECURITY DOMAIN</div>
                      <div className="corner-sub">Click cell to inspect</div>
                    </th>
                    {frameworksList.map(fw => {
                      const fwScore = frameworkScores[fw] || {};
                      return (
                        <th key={fw} className="heatmap-col-header">
                          <div className="fw-header-name">{frameworkInfo[fw]?.name || fw}</div>
                          <div className="fw-header-score">
                            <span className="fw-score-pill" style={{
                              background: (fwScore.percent || 0) >= 80 ? 'rgba(42, 90, 59, 0.15)' : 'rgba(176, 138, 60, 0.18)',
                              color: (fwScore.percent || 0) >= 80 ? 'var(--color-pass)' : 'var(--color-ochre)'
                            }}>
                              {fwScore.percent || 0}% Score
                            </span>
                          </div>
                          <div className="fw-header-sub">{frameworkInfo[fw]?.fullName}</div>
                        </th>
                      );
                    })}
                    <th className="heatmap-col-header marginal">
                      <div className="fw-header-name">DOMAIN HEALTH</div>
                      <div className="fw-header-sub">Across All Frameworks</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(effectiveHeatmap).map(([category, fws]) => {
                    const catScore = categoryScores[category] || {};
                    return (
                      <tr key={category}>
                        {/* Domain Category Label */}
                        <td className="heatmap-row-header">
                          <div className="domain-row-flex">
                            <span className="domain-icon">{DOMAIN_ICONS[category] || '◈'}</span>
                            <div>
                              <div className="domain-name">{category}</div>
                              <div className="domain-count">
                                {catScore.total || 0} Controls Mapped
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Interactive Heatmap Tiles */}
                        {frameworksList.map(fw => {
                          const rawCell = fws[fw];
                          const cell = typeof rawCell === 'object' && rawCell !== null ? rawCell : {
                            status: rawCell || 'N/A',
                            total: rawCell === 'N/A' ? 0 : 1,
                            passed: rawCell === 'PASS' ? 1 : 0,
                            failed: rawCell === 'FAIL' ? 1 : 0,
                            unknown: rawCell === 'UNKNOWN' ? 1 : 0,
                            percent: rawCell === 'PASS' ? 100 : rawCell === 'FAIL' ? 0 : null,
                            controls: []
                          };

                          const isSelected = selectedCell?.category === category && selectedCell?.framework === fw;
                          const style = getHeatmapTileStyle(cell, isSelected, heatmapMode);
                          const isClickable = cell.status !== 'N/A' && cell.total > 0;

                          return (
                            <td key={fw} className="heatmap-matrix-td">
                              <button
                                type="button"
                                className={`heatmap-tile ${isSelected ? 'selected' : ''} ${!isClickable ? 'disabled' : ''}`}
                                style={{
                                  background: style.bg,
                                  border: style.border,
                                  color: style.text,
                                  boxShadow: style.glow,
                                  cursor: style.cursor
                                }}
                                onClick={() => {
                                  if (isClickable) {
                                    setSelectedCell(isSelected ? null : { category, framework: fw, cell });
                                  }
                                }}
                              >
                                {cell.status === 'N/A' ? (
                                  <div className="tile-na">
                                    <span className="tile-na-dash">—</span>
                                    <span className="tile-na-text">N/A</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="tile-primary-metric" style={{ color: style.text }}>
                                      {heatmapMode === 'counts' ? (
                                        `${cell.passed}/${cell.total}`
                                      ) : (
                                        `${cell.percent}%`
                                      )}
                                    </div>
                                    <div className="tile-sub-indicator" style={{ color: style.subText }}>
                                      {heatmapMode === 'risk' ? (
                                        cell.failed > 0 ? (
                                          <span className="chip-risk-fail">⚠ {cell.failed} Fail</span>
                                        ) : cell.unknown > 0 ? (
                                          <span className="chip-risk-unknown">? {cell.unknown} Unk</span>
                                        ) : (
                                          <span className="chip-risk-pass">✓ Clean</span>
                                        )
                                      ) : heatmapMode === 'counts' ? (
                                        <span>{cell.failed > 0 ? `${cell.failed} Failed` : 'All Passed'}</span>
                                      ) : (
                                        cell.percent === 100 ? (
                                          <span>✓ Complete</span>
                                        ) : cell.failed > 0 ? (
                                          <span>{cell.passed}P · {cell.failed}F</span>
                                        ) : (
                                          <span>{cell.unknown} Unknown</span>
                                        )
                                      )}
                                    </div>
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Marginalia: Domain Health Mini-Progress */}
                        <td className="heatmap-matrix-td marginal">
                          <div className="domain-health-widget">
                            <div className="domain-health-top">
                              <span className="domain-health-pct" style={{
                                color: (catScore.percent || 0) >= 80 ? 'var(--color-pass)' : (catScore.percent || 0) >= 50 ? 'var(--color-ochre)' : 'var(--color-fail)'
                              }}>
                                {catScore.percent || 0}%
                              </span>
                              <span className="domain-health-ratio">
                                {catScore.pass || 0}/{catScore.total || 0}
                              </span>
                            </div>
                            <div className="domain-health-bar">
                              <div
                                className="domain-health-bar-fill"
                                style={{
                                  width: `${catScore.percent || 0}%`,
                                  background: (catScore.percent || 0) >= 80 ? 'var(--color-pass)' : (catScore.percent || 0) >= 50 ? 'var(--color-ochre)' : 'var(--color-fail)'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep-Dive Detail Inspector Card */}
          <div className="heatmap-inspector-pane">
            {selectedCell ? (
              <div className="card heatmap-inspector-card animate-fadeIn">
                <div className="inspector-card-header">
                  <div className="inspector-header-left">
                    <span className="inspector-badge-icon">{DOMAIN_ICONS[selectedCell.category] || '◈'}</span>
                    <div>
                      <div className="inspector-title">
                        {selectedCell.category} <span>×</span> {frameworkInfo[selectedCell.framework]?.name || selectedCell.framework}
                      </div>
                      <div className="inspector-subtitle">
                        {frameworkInfo[selectedCell.framework]?.fullName} • Requirement Audit Breakdown
                      </div>
                    </div>
                  </div>

                  <div className="inspector-header-right">
                    <div className="inspector-stat-pill" style={{
                      background: (selectedCell.cell.percent || 0) >= 80 ? 'rgba(42, 90, 59, 0.15)' : 'rgba(140, 45, 25, 0.15)',
                      color: (selectedCell.cell.percent || 0) >= 80 ? 'var(--color-pass)' : 'var(--color-fail)',
                      border: `1px solid ${(selectedCell.cell.percent || 0) >= 80 ? 'var(--color-pass)' : 'var(--color-fail)'}`
                    }}>
                      <span className="pill-metric">{selectedCell.cell.percent || 0}% Assurance</span>
                      <span className="pill-sub">({selectedCell.cell.passed} Pass, {selectedCell.cell.failed} Fail, {selectedCell.cell.unknown} Unknown)</span>
                    </div>

                    <button
                      type="button"
                      className="btn-inspector-close"
                      onClick={() => setSelectedCell(null)}
                      title="Close Inspector"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* List of Controls in this Heatmap Cell */}
                <div className="inspector-controls-list">
                  {selectedCell.cell.controls && selectedCell.cell.controls.length > 0 ? (
                    selectedCell.cell.controls.map(ctrl => (
                      <div key={ctrl.id} className={`inspector-control-item ${ctrl.status.toLowerCase()}`}>
                        <div className="ctrl-item-head">
                          <div className="ctrl-id-badge">{ctrl.id}</div>
                          <div className="ctrl-name">{ctrl.name}</div>
                          <span className={`ctrl-status-tag ${ctrl.status.toLowerCase()}`}>
                            {ctrl.status === 'PASS' ? '✓ PASS' : ctrl.status === 'FAIL' ? '✗ FAIL' : '○ UNKNOWN'}
                          </span>
                          <span className={`ctrl-severity-tag ${(ctrl.severity || 'medium').toLowerCase()}`}>
                            {ctrl.severity}
                          </span>
                        </div>

                        <div className="ctrl-req-line">
                          <span className="ctrl-req-label">Framework Requirement:</span>
                          <span className="ctrl-req-val">{ctrl.requirement}</span>
                        </div>

                        {ctrl.finding && (
                          <div className="ctrl-finding-line">
                            <span className="ctrl-finding-label">Audit Evidence:</span>
                            <span className="ctrl-finding-val">{ctrl.finding}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-inspector-note">
                      No specific control lines recorded for this intersection.
                    </div>
                  )}
                </div>

                {/* Quick Navigation Footer */}
                <div className="inspector-footer-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/findings')}
                  >
                    Trace 5-Step Evidence Chain in Findings →
                  </button>
                  {selectedCell.cell.failed > 0 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigate('/remediation')}
                    >
                      Resolve Non-Compliant Controls in Tārā RESOLVE →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="heatmap-hint-card">
                <span className="hint-symbol">✧</span>
                <div className="hint-text">
                  <strong>Interactive Matrix Explorer</strong>: Select any colored tile in the heatmap matrix above to inspect its underlying control citations, audit findings, and remediation actions.
                </div>
              </div>
            )}
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

      {/* Real Calculated Learning Impact Section */}
      <LearningImpactSection
        impactData={impactData}
        onNavigateToFindings={() => navigate('/findings')}
      />
    </div>
  );
}
