import React from 'react';
import { frameworkInfo } from '../knowledge/semanticControls';

export default function Overview({ analysisResult, complianceResult, history, onAnalyze, navigate }) {
  const stats = analysisResult?.stats || {};
  const summary = complianceResult?.summary || {};
  const frameworkScores = complianceResult?.frameworkScores || {};

  const hasData = !!analysisResult;

  return (
    <div className="animate-fadeIn">
      {/* Editorial Header & Hero */}
      <div className="hero-scholarly">
        {/* Central Astronomical Yantra Emblem */}
        <svg className="hero-yantra-emblem" viewBox="0 0 100 100" fill="none">
          {/* Outer astronomical compass ring */}
          <circle cx="50" cy="50" r="46" stroke="#B08A3C" strokeWidth="0.8" strokeDasharray="1.5 3"/>
          <circle cx="50" cy="50" r="41" stroke="#20263A" strokeWidth="1"/>
          <circle cx="50" cy="50" r="33" stroke="#B08A3C" strokeWidth="0.7"/>

          {/* Cardinal pointers (Astronomical Axis) */}
          <line x1="50" y1="2" x2="50" y2="12" stroke="#A66A2C" strokeWidth="1.5"/>
          <line x1="50" y1="88" x2="50" y2="98" stroke="#A66A2C" strokeWidth="1.5"/>
          <line x1="2" y1="50" x2="12" y2="50" stroke="#A66A2C" strokeWidth="1.5"/>
          <line x1="88" y1="50" x2="98" y2="50" stroke="#A66A2C" strokeWidth="1.5"/>

          {/* Subtle diagonal degree ticks */}
          <line x1="20" y1="20" x2="25" y2="25" stroke="#B08A3C" strokeWidth="0.8"/>
          <line x1="80" y1="20" x2="75" y2="25" stroke="#B08A3C" strokeWidth="0.8"/>
          <line x1="20" y1="80" x2="25" y2="75" stroke="#B08A3C" strokeWidth="0.8"/>
          <line x1="80" y1="80" x2="75" y2="75" stroke="#B08A3C" strokeWidth="0.8"/>

          {/* Intersecting Yantra Triangles (Harmonious Balance) */}
          <polygon points="50,22 74,65 26,65" stroke="#20263A" strokeWidth="0.8" fill="none" opacity="0.6"/>
          <polygon points="50,78 74,35 26,35" stroke="#B08A3C" strokeWidth="0.8" fill="none" opacity="0.6"/>

          {/* Precision Netra (Eye of Observation) */}
          <path d="M 28 50 C 35 38, 65 38, 72 50 C 65 62, 35 62, 28 50 Z" stroke="#20263A" strokeWidth="1.4" fill="none"/>
          <circle cx="50" cy="50" r="9" stroke="#B08A3C" strokeWidth="1" fill="none"/>

          {/* Central Bindu (Tārā Star) */}
          <circle cx="50" cy="50" r="3.2" fill="#A66A2C"/>
        </svg>

        <div className="hero-scholarly-devanagari">तारानेत्र</div>
        <h1 className="hero-scholarly-title">TĀRĀ-NETRA</h1>
        <div className="hero-scholarly-subtitle">The Guiding Eye for Network Security</div>

        <p className="hero-scholarly-quote">
          "Different vendors speak different configuration languages. TĀRĀ-NETRA learns the security meaning behind them."
        </p>

        {/* Primary Actions */}
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
            Analyze Configuration
          </button>
          <button className="btn btn-secondary" onClick={() => {
            import('../knowledge/sampleConfigs').then(m => {
              onAnalyze(m.sampleConfigs.cisco.content, m.sampleConfigs.cisco.name);
            });
          }}>
            Run Demo
          </button>
        </div>

        {/* Typographic Process Line */}
        <div className="process-line">
          {['Unknown', 'Explain', 'Teach', 'Learn', 'Verify', 'Audit'].map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <span className="process-arrow">→</span>}
              <span className="process-step">{step}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Astronomical Instrument Security Baseline Model Diagram */}
      <div className="yantra-diagram-wrapper">
        <svg className="yantra-svg" viewBox="0 0 460 220" fill="none">
          {/* Subtle concentric orbital arcs */}
          <circle cx="230" cy="110" r="90" stroke="#B08A3C" strokeWidth="0.6" strokeDasharray="2 3"/>
          <circle cx="230" cy="110" r="60" stroke="#20263A" strokeWidth="0.8" opacity="0.7"/>
          <circle cx="230" cy="110" r="28" stroke="#A66A2C" strokeWidth="1"/>

          {/* Central Core Bindu */}
          <circle cx="230" cy="110" r="5" fill="#A66A2C"/>
          <text x="230" y="114" textAnchor="middle" className="yantra-node-text" fill="#FFFFFF" fontSize="6.5">◉</text>

          {/* Primary Cross-Axes */}
          <line x1="60" y1="110" x2="400" y2="110" stroke="#70695C" strokeWidth="0.6" strokeDasharray="3 3"/>
          <line x1="230" y1="20" x2="230" y2="200" stroke="#70695C" strokeWidth="0.6" strokeDasharray="3 3"/>

          {/* Node Labels */}
          {/* Top: Security Semantics */}
          <circle cx="230" cy="30" r="3" fill="#20263A"/>
          <text x="230" y="20" textAnchor="middle" className="yantra-label">Security Semantics</text>

          {/* Bottom: Remediation & Assurance */}
          <circle cx="230" cy="190" r="3" fill="#20263A"/>
          <text x="230" y="208" textAnchor="middle" className="yantra-label">Remediation &amp; Proof</text>

          {/* Left: Heterogeneous Vendors */}
          <circle cx="70" cy="110" r="3" fill="#20263A"/>
          <text x="65" y="103" textAnchor="end" className="yantra-label">Vendors</text>
          <text x="65" y="122" textAnchor="end" fontSize="7.5" fill="#9E9585" fontFamily="var(--font-ui)">Cisco • Fortinet • Junos</text>

          {/* Right: Regulatory Frameworks */}
          <circle cx="390" cy="110" r="3" fill="#20263A"/>
          <text x="395" y="103" textAnchor="start" className="yantra-label">Frameworks</text>
          <text x="395" y="122" textAnchor="start" fontSize="7.5" fill="#9E9585" fontFamily="var(--font-ui)">CIS • NIST • STIG • ISO</text>

          {/* Central Label */}
          <text x="230" y="132" textAnchor="middle" className="yantra-node-text" letterSpacing="0.8">TĀRĀ CORE</text>
          <text x="230" y="143" textAnchor="middle" fontSize="7" fill="#70695C" fontFamily="var(--font-ui)">Security Baseline Model</text>
        </svg>
      </div>

      {/* Metrics Section using Typography & Thin Rules (No giant cards) */}
      <div className="metrics-row">
        <div className="metric-item">
          <div className="metric-number">{String(hasData ? (history.length || 1) : 0).padStart(2, '0')}</div>
          <div className="metric-caption">Configurations Analyzed</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: hasData && summary.compliancePercent >= 80 ? 'var(--color-pass)' : 'var(--color-indigo)' }}>
            {hasData ? `${summary.compliancePercent || 0}%` : '—'}
          </div>
          <div className="metric-caption">Compliance Score</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: hasData && stats.unknown > 0 ? 'var(--color-fail)' : 'var(--color-indigo)' }}>
            {hasData ? String(stats.unknown || 0).padStart(2, '0') : '—'}
          </div>
          <div className="metric-caption">Unknown Constructs</div>
        </div>

        <div className="metric-item">
          <div className="metric-number" style={{ color: hasData && stats.learned > 0 ? 'var(--color-learned)' : 'var(--color-indigo)' }}>
            {hasData ? String(stats.learned || 0).padStart(2, '0') : '—'}
          </div>
          <div className="metric-caption">Learned Mappings</div>
        </div>

        <div className="metric-item">
          <div className="metric-number">{hasData ? summary.total || 0 : '16'}</div>
          <div className="metric-caption">Controls Evaluated</div>
        </div>
      </div>

      {/* When data exists: Calm Editorial Breakdown */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
          {/* Framework Assurances */}
          <div className="card">
            <div className="card-title">Framework Assurance</div>
            <div className="card-subtext">Deterministic compliance mapping against global standards</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              {Object.entries(frameworkScores).map(([fw, score]) => (
                <div key={fw}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                      {frameworkInfo[fw]?.name || fw}
                    </span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                      {score.percent}%
                    </span>
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
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/compliance')}>
                View Audit Matrix
              </button>
            </div>
          </div>

          {/* Interpretation & Learning Intelligence */}
          <div className="card">
            <div className="card-title">Observation Precision</div>
            <div className="card-subtext">Multi-layered normalization state across configuration lines</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-pass)' }}>Recognized Directives</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{stats.recognizedPercent || 0}%</span>
                </div>
                <div className="progress-rule">
                  <div className="progress-rule-fill" style={{ width: `${stats.recognizedPercent || 0}%`, background: 'var(--color-pass)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-unknown)' }}>Low Confidence Hypotheses</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{stats.total > 0 ? Math.round((stats.lowConfidence / stats.total) * 100) : 0}%</span>
                </div>
                <div className="progress-rule">
                  <div className="progress-rule-fill" style={{ width: `${stats.total > 0 ? (stats.lowConfidence / stats.total) * 100 : 0}%`, background: 'var(--color-unknown)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-fail)' }}>Unfamiliar Directives</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{stats.total > 0 ? Math.round((stats.unknown / stats.total) * 100) : 0}%</span>
                </div>
                <div className="progress-rule">
                  <div className="progress-rule-fill" style={{ width: `${stats.total > 0 ? (stats.unknown / stats.total) * 100 : 0}%`, background: 'var(--color-fail)' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/training')}>
                Open Learning Studio ({stats.unknown + stats.lowConfidence} Unresolved)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
