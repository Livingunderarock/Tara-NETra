import React, { useState, useEffect } from 'react';

const tutorialSteps = [
  {
    id: 'sbm-core',
    title: 'Astronomical Core & Security Baseline Model',
    tagline: 'Universal Network Abstraction',
    icon: '☉',
    path: '/',
    description:
      'Heterogeneous vendors (Cisco IOS, Juniper Junos, Fortinet FortiOS) speak different configuration languages. Tārā-NETra normalizes these syntax dialects into a single, standardized, vendor-neutral Security Baseline Model (SBM).',
    howToUse:
      'The central astronomical compass on the home page visualizes this architectural core. It anchors the translation between raw CLI vendor dialects and canonical cybersecurity controls.',
    cybersecurityImpact:
      'Eliminates vendor lock-in and syntax confusion. Security architects and auditors can reason about network defenses in one universal language.'
  },
  {
    id: 'analyzer',
    title: 'Configuration Analyzer',
    tagline: 'Deep Semantic Ingestion',
    icon: '◬',
    path: '/analyze',
    description:
      'Ingests raw router and firewall configuration files (.cfg, .conf, .txt, .log) and executes line-by-line semantic extraction. It identifies recognized security parameters and highlights unknown or emerging vendor syntax.',
    howToUse:
      'Drag and drop any network config file into the ingestion dropzone, or choose any of the 4 preloaded observatory samples (Cisco, Fortinet, Juniper, or Unknown Vendor) to test instantaneous interpretation.',
    cybersecurityImpact:
      'Provides instant visibility into network configuration posture, extracting active protocols, AAA policies, ACL boundaries, and interface hardening status.'
  },
  {
    id: 'learning-studio',
    title: 'Tārā Learning Studio',
    tagline: 'Human-in-the-Loop Intelligence',
    icon: '⚚',
    path: '/training',
    description:
      'When new, proprietary, or unknown vendor commands are ingested, Tārā does not guess blindly. The Learning Studio provides an interactive scholar desk where network administrators teach Tārā the true security meaning.',
    howToUse:
      'Review Tārā’s initial hypothesis, select the canonical security control (e.g. SSH_V2_ENFORCED, ADMIN_SESSION_TIMEOUT), confirm the semantic value, and save the mapping to permanently expand system intelligence.',
    cybersecurityImpact:
      'Prevents blind audit gaps when organizations deploy novel firmware versions or custom vendor appliances.'
  },
  {
    id: 'knowledge-memory',
    title: 'Tārā Memory',
    tagline: 'Curated Knowledge Archive',
    icon: '☵',
    path: '/knowledge',
    description:
      'The immutable knowledge ledger storing all learned syntax-to-semantics rules. Mappings are persisted locally and deterministically, complete with timestamp, confidence metric, and teaching administrator attribution.',
    howToUse:
      'Search through learned commands, filter by category or vendor dialect, inspect rule confidence, or export the entire knowledge bank as a portable JSON package for air-gapped security enclaves.',
    cybersecurityImpact:
      'Ensures organizational knowledge retention. What one senior engineer teaches Tārā benefits every subsequent network audit across the enterprise.'
  },
  {
    id: 'compliance-ledger',
    title: 'Compliance Ledger',
    tagline: 'Multi-Framework Automated Audit',
    icon: '◫',
    path: '/compliance',
    description:
      'Simultaneously maps the normalized Security Baseline Model against four global cybersecurity standards: CIS Benchmarks, NIST SP 800-53, DISA STIG, and ISO/IEC 27001.',
    howToUse:
      'Switch between framework tabs to review control-by-control audit verdicts (Pass, Fail, Unknown, N/A), inspect the compliance heatmap across 7 defense categories, and track total compliance debt.',
    cybersecurityImpact:
      'Automates tedious compliance cross-referencing. One configuration analysis satisfies requirements for civilian, defense, and international standards.'
  },
  {
    id: 'findings-provenance',
    title: 'Audit Findings & Provenance Chain',
    tagline: 'Unbroken Explainability',
    icon: '△',
    path: '/findings',
    description:
      'Unlike black-box AI tools, Tārā guarantees 100% explainability. Every single finding displays a rigorous 5-step provenance chain from raw configuration line to audit conclusion.',
    howToUse:
      'Filter findings by severity (High, Medium, Low) or framework. Click any finding to inspect the Raw CLI → Semantic Interpretation → Security Control → Benchmark Rule → Audit Verdict progression.',
    cybersecurityImpact:
      'Zero hallucinations. External auditors and CISOs can verify the exact technical rationale behind every single non-compliance warning.'
  },
  {
    id: 'remediation-resolve',
    title: 'Tārā Resolve',
    tagline: 'Directives & Verification Checks',
    icon: '↻',
    path: '/remediation',
    description:
      'Translates compliance gaps into precise, vendor-specific corrective CLI commands. Includes automated verification instructions to prove the vulnerability was closed post-deployment.',
    howToUse:
      'Review detected misconfigurations alongside the exact recommended fix. Copy CLI directives directly to your clipboard, or review the pre-flight verification command (e.g., "show running-config | include telnet").',
    cybersecurityImpact:
      'Dramatically shrinks Mean Time to Remediation (MTTR) while preventing syntax mistakes during emergency configuration changes.'
  },
  {
    id: 'evidence-proof',
    title: 'Tārā Proof',
    tagline: 'Cryptographic Integrity & PDF Certificates',
    icon: '◎',
    path: '/evidence',
    description:
      'Generates a tamper-evident audit certificate in the manuscript aesthetic, featuring an immutable SHA-256 cryptographic digest of the ingested configuration file.',
    howToUse:
      'Inspect the cryptographic integrity block and click "Export Audit Certificate (PDF)" to download a formal, beautifully formatted multi-page audit document with double manuscript borders and celestial yantra watermarks.',
    cybersecurityImpact:
      'Provides legally defensible, tamper-evident proof of network state for regulatory audits, board presentations, and security certifications.'
  }
];

export default function TutorialGuide({ isOpen, onClose, navigate }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState('tour'); // 'tour' | 'atlas'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (viewMode === 'tour') {
        if (e.key === 'ArrowRight' && currentStepIndex < tutorialSteps.length - 1) {
          setCurrentStepIndex(i => i + 1);
        } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
          setCurrentStepIndex(i => i - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, viewMode, currentStepIndex, onClose]);

  if (!isOpen) return null;

  const currentStep = tutorialSteps[currentStepIndex];

  const handleJumpToStep = (index) => {
    setCurrentStepIndex(index);
    setViewMode('tour');
  };

  const handleNavigateToFeature = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="tutorial-backdrop" onClick={onClose}>
      <div className="tutorial-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tutorial-modal-header">
          <div className="tutorial-title-area">
            {/* Engraved Yantra Mini Emblem */}
            <svg className="tutorial-emblem" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="#B08A3C" strokeWidth="0.8" strokeDasharray="1.5 2.5"/>
              <circle cx="18" cy="18" r="13" stroke="#20263A" strokeWidth="1"/>
              <path d="M 8 18 C 11.5 12, 24.5 12, 28 18 C 24.5 24, 11.5 24, 8 18 Z" stroke="#20263A" strokeWidth="1.2"/>
              <circle cx="18" cy="18" r="3.5" stroke="#B08A3C" strokeWidth="0.8"/>
              <circle cx="18" cy="18" r="1.5" fill="#A66A2C"/>
            </svg>
            <div>
              <h2 className="tutorial-modal-title">Tārā-NETra Instrument Guide</h2>
              <div className="tutorial-modal-subtitle">Comprehensive Tour of Operational Chambers &amp; Features</div>
            </div>
          </div>
          <button className="tutorial-close-btn" onClick={onClose} title="Close Guide (Esc)">✕</button>
        </div>

        {/* View Mode Tabs */}
        <div className="tutorial-mode-tabs">
          <button
            className={`tutorial-tab-btn ${viewMode === 'tour' ? 'active' : ''}`}
            onClick={() => setViewMode('tour')}
          >
            Step-by-Step Tour ({currentStepIndex + 1}/{tutorialSteps.length})
          </button>
          <button
            className={`tutorial-tab-btn ${viewMode === 'atlas' ? 'active' : ''}`}
            onClick={() => setViewMode('atlas')}
          >
            Feature Atlas ({tutorialSteps.length} Chambers)
          </button>
        </div>

        {/* Body Content */}
        <div className="tutorial-modal-body">
          {viewMode === 'tour' ? (
            <div className="tutorial-step-container">
              <div className="tutorial-step-header">
                <span className="tutorial-step-counter">
                  Chamber {currentStepIndex + 1} of {tutorialSteps.length}
                </span>
                <span className="tutorial-step-path-badge">{currentStep.path}</span>
              </div>

              <div className="tutorial-step-main">
                <div className="tutorial-step-icon-wrap">
                  {currentStep.icon}
                </div>
                <div className="tutorial-step-details">
                  <h3>{currentStep.title}</h3>
                  <div className="tutorial-step-tagline">{currentStep.tagline}</div>
                  <p className="tutorial-step-desc">{currentStep.description}</p>

                  <div className="tutorial-step-box">
                    <strong>How to Operate:</strong>
                    {currentStep.howToUse}
                  </div>

                  <div className="tutorial-step-box" style={{ borderLeftColor: 'var(--color-ochre)' }}>
                    <strong>Cybersecurity &amp; Compliance Impact:</strong>
                    {currentStep.cybersecurityImpact}
                  </div>

                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleNavigateToFeature(currentStep.path)}
                    >
                      Open {currentStep.title.split(':')[0]} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tutorial-atlas-grid">
              {tutorialSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="tutorial-atlas-card"
                  onClick={() => handleJumpToStep(idx)}
                >
                  <div className="tutorial-atlas-top">
                    <span className="tutorial-atlas-icon">{step.icon}</span>
                    <span className="tutorial-atlas-title">{step.title}</span>
                  </div>
                  <p className="tutorial-atlas-desc">{step.description}</p>
                  <div className="tutorial-atlas-action">
                    Inspect Feature &amp; Tour →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {viewMode === 'tour' && (
          <div className="tutorial-modal-footer">
            <div className="tutorial-progress-dots">
              {tutorialSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`tutorial-dot ${idx === currentStepIndex ? 'active' : ''}`}
                  onClick={() => setCurrentStepIndex(idx)}
                  title={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="tutorial-footer-actions">
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(i => i - 1)}
              >
                ← Previous
              </button>
              {currentStepIndex < tutorialSteps.length - 1 ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setCurrentStepIndex(i => i + 1)}
                >
                  Next Chamber →
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onClose}
                >
                  Complete Tour ✦
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
