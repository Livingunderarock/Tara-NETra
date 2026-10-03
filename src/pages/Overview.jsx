import React, { useState } from 'react';
import { frameworkInfo } from '../knowledge/semanticControls';
import SemanticEquivalenceMatrix from '../components/SemanticEquivalenceMatrix';
import TaraDemoModal from '../components/TaraDemoModal';

export default function Overview({ analysisResult, complianceResult, history, onAnalyze, onOpenTutorial, navigate, showToast }) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const stats = analysisResult?.stats || {};
  const summary = complianceResult?.summary || {};
  const frameworkScores = complianceResult?.frameworkScores || {};

  const hasData = !!analysisResult;

  return (
    <div className="animate-fadeIn">
      {/* Editorial Header & SBM Astronomical Core */}
      <div className="hero-scholarly">
        <div className="hero-scholarly-devanagari">तारानेत्र</div>
        <h1 className="hero-scholarly-title">Tārā-NETra</h1>
        <div className="hero-scholarly-subtitle">Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance</div>

        {/* Astronomical Instrument Security Baseline Model Diagram - Center Stage on Page Open */}
        <div className="yantra-diagram-wrapper">
          <svg className="yantra-svg" viewBox="0 0 520 260" fill="none">
            {/* Subtle concentric orbital arcs */}
            <circle cx="260" cy="130" r="82" stroke="#B08A3C" strokeWidth="0.8" strokeDasharray="3 3.5"/>
            <circle cx="260" cy="130" r="56" stroke="#20263A" strokeWidth="0.8" opacity="0.65"/>
            
            {/* Central Core Medallion with parchment backdrop to prevent any line intersection */}
            <circle cx="260" cy="130" r="42" stroke="#A66A2C" strokeWidth="1.2" fill="var(--color-bg-base)"/>

            {/* Central Bindu celestial marker */}
            <circle cx="260" cy="105" r="3.5" fill="#A66A2C"/>
            <circle cx="260" cy="105" r="1.5" fill="var(--color-bg-base)"/>

            {/* Segmented Cross-Axes that stop cleanly before the central medallion */}
            {/* Horizontal axes */}
            <line x1="80" y1="130" x2="216" y2="130" stroke="#70695C" strokeWidth="0.7" strokeDasharray="3 3"/>
            <line x1="304" y1="130" x2="440" y2="130" stroke="#70695C" strokeWidth="0.7" strokeDasharray="3 3"/>
            
            {/* Vertical axes */}
            <line x1="260" y1="48" x2="260" y2="86" stroke="#70695C" strokeWidth="0.7" strokeDasharray="3 3"/>
            <line x1="260" y1="174" x2="260" y2="212" stroke="#70695C" strokeWidth="0.7" strokeDasharray="3 3"/>

            {/* Node Markers & Labels */}
            {/* Top: Security Semantics (Ample breathing room above circle apex) */}
            <circle cx="260" cy="48" r="3.5" fill="#20263A"/>
            <text x="260" y="20" textAnchor="middle" className="yantra-label">SECURITY SEMANTICS</text>

            {/* Bottom: Remediation & Proof (Ample breathing room below circle apex) */}
            <circle cx="260" cy="212" r="3.5" fill="#20263A"/>
            <text x="260" y="242" textAnchor="middle" className="yantra-label">REMEDIATION &amp; PROOF</text>

            {/* Left: Heterogeneous Vendors */}
            <circle cx="80" cy="130" r="3.5" fill="#20263A"/>
            <text x="68" y="122" textAnchor="end" className="yantra-label">VENDORS</text>
            <text x="68" y="139" textAnchor="end" className="yantra-sublabel">Cisco • Fortinet • Junos</text>

            {/* Right: Regulatory Frameworks */}
            <circle cx="440" cy="130" r="3.5" fill="#20263A"/>
            <text x="452" y="122" textAnchor="start" className="yantra-label">FRAMEWORKS</text>
            <text x="452" y="139" textAnchor="start" className="yantra-sublabel">CIS • NIST • STIG • ISO</text>

            {/* Central Core Text: Pristine, centered, and undisturbed */}
            <text x="260" y="126" textAnchor="middle" className="yantra-node-text">TĀRĀ CORE</text>
            <text x="260" y="141" textAnchor="middle" className="yantra-subnode-text">Security Baseline Model</text>
          </svg>
        </div>

        <p className="hero-scholarly-quote">
          "Different syntax. One security language. Tārā-NETra does not treat an unknown vendor as a missing parser — it treats unknown syntax as a learnable semantic mapping."
        </p>

        {/* Primary Actions */}
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
            Analyze Configuration
          </button>
          <button className="btn btn-secondary" onClick={() => setIsDemoOpen(true)} title="Experience the 2-minute competition story">
            ✦ Run TĀRĀ Demo (2-Min Flow)
          </button>
          <button className="btn btn-tutorial" onClick={onOpenTutorial} title="Explore every feature step-by-step">
            <span>✧</span> Instrument Guide &amp; Tutorial
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

      {/* Semantic Equivalence: One Security Intent, Many Syntaxes */}
      <SemanticEquivalenceMatrix />

      {/* Guided 2-Minute Competition Demo Modal */}
      <TaraDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onAnalyze={onAnalyze}
        navigate={navigate}
        showToast={showToast}
      />
    </div>
  );
}
