import React, { useState } from 'react';
import { sampleConfigs } from '../knowledge/sampleConfigs.js';
import { synthesizeGeneralizedPattern } from '../core/patternGeneralizer.js';
import { saveLearnedMapping } from '../services/storage.js';

export default function TaraDemoModal({ isOpen, onClose, onAnalyze, navigate, showToast }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const STEPS = [
    {
      stepNumber: 1,
      title: 'Unknown Vendor Ingestion',
      subtitle: 'BRANCH-GW-04 (SecureOS)',
      narration: 'Enterprise networks run devices from dozens of vendors. Here we ingest an unknown appliance (BRANCH-GW-04) running novel SecureOS syntax. Notice vendor is UNKNOWN with zero pre-existing parsers.',
      actionText: 'Load Unknown Vendor Config',
      action: () => {
        onAnalyze(sampleConfigs.unknown.content, sampleConfigs.unknown.name);
        navigate('/analyze');
        showToast('Loaded Unknown Vendor Appliance (BRANCH-GW-04)');
      }
    },
    {
      stepNumber: 2,
      title: 'Identify Unknown Construct & AI Hypothesis',
      subtitle: 'set secure-admin session-limit 900',
      narration: 'Tārā detects recognized keywords, but line 10 contains an unfamiliar directive: "set secure-admin session-limit 900". Instead of failing, Tārā generates a semantic hypothesis: "Administrative Session Timeout".',
      actionText: 'Inspect in Analyzer',
      action: () => {
        navigate('/analyze');
        showToast('Inspecting unfamiliar construct: set secure-admin session-limit 900');
      }
    },
    {
      stepNumber: 3,
      title: 'Human-in-the-Loop Teaching',
      subtitle: 'Synthesizing Generalized Pattern',
      narration: 'The network administrator confirms the security intent: "ADMIN_SESSION_TIMEOUT". Tārā does NOT just memorize the exact line "900". It synthesizes a generalized parameterized pattern: "set secure-admin session-limit <VALUE>".',
      actionText: 'Teach Tārā & Inscribe Generalized Pattern',
      action: () => {
        const generalized = synthesizeGeneralizedPattern(
          'set secure-admin session-limit 900',
          'ADMIN_SESSION_TIMEOUT',
          900,
          'BRANCH-GW-04'
        );
        saveLearnedMapping(generalized);
        onAnalyze(sampleConfigs.unknown.content, sampleConfigs.unknown.name);
        navigate('/training');
        showToast('Inscribed Generalized Pattern: set secure-admin session-limit <VALUE>');
      }
    },
    {
      stepNumber: 4,
      title: 'Test Unseen Device B (CAMPUS-GW-05)',
      subtitle: 'Configuration Never Seen During Training',
      narration: 'To prove TRUE generalization rather than memorization, we now ingest CAMPUS-GW-05. This device was NEVER seen by Tārā during training and uses a different parameter value: "session-limit 600".',
      actionText: 'Analyze Unseen Device B',
      action: () => {
        onAnalyze(sampleConfigs.unknownB.content, sampleConfigs.unknownB.name);
        navigate('/analyze');
        showToast('Ingested Unseen Device B (CAMPUS-GW-05)');
      }
    },
    {
      stepNumber: 5,
      title: 'Learned Pattern Match & Generalization Proof',
      subtitle: 'Dynamic Parameter Extraction (600s)',
      narration: 'Observe the result: ✓ LEARNED PATTERN MATCH! Tārā automatically matched the generalized pattern from BRANCH-GW-04 and dynamically extracted 600 seconds. "This configuration was not used during training."',
      actionText: 'Verify Match in Analyzer',
      action: () => {
        navigate('/analyze');
        showToast('Verified: Pattern learned from another configuration!');
      }
    },
    {
      stepNumber: 6,
      title: 'Learning Impact on Compliance',
      subtitle: 'Learning Changes the Audit',
      narration: 'Look at the Compliance Audit. What was previously an UNVERIFIED control is now deterministically evaluated as PASS (600s ≤ 900s limit). Real calculated metrics prove: Learning changes the audit.',
      actionText: 'View Compliance & Learning Impact',
      action: () => {
        navigate('/compliance');
        showToast('Observing real calculated Learning Impact delta');
      }
    },
    {
      stepNumber: 7,
      title: 'Traceable Evidence Chain',
      subtitle: 'Raw CLI → SBM → Control → Framework → Result',
      narration: 'Every finding in Tārā is explainable and tamper-evident. Clicking any control reveals the full 5-step evidence chain from the raw configuration text to CIS/NIST/DISA STIG citations.',
      actionText: 'Inspect Findings Evidence Chain',
      action: () => {
        navigate('/findings');
        showToast('Inspecting 5-step Evidence Chain');
      }
    },
    {
      stepNumber: 8,
      title: 'Tārā Resolve & Cryptographic SHA-256 Proof',
      subtitle: 'Deterministic Remediation & Archival Audit Certificate',
      narration: 'Review recommended vendor remediation in Tārā Resolve, verify the Web Crypto SHA-256 integrity hash, and download the archival PDF audit certificate. "Different syntax. One security language."',
      actionText: 'View SHA-256 Proof & Export PDF',
      action: () => {
        navigate('/evidence');
        showToast('Tārā PROOF Cryptographic Integrity Active');
      }
    }
  ];

  const current = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleExecuteCurrentStep = () => {
    if (current.action) {
      current.action();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 22, 34, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-md)',
    }}>
      <div
        className="modal-content animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid rgba(176, 138, 60, 0.5)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '680px',
          width: '100%',
          boxShadow: 'var(--shadow-elevation-high)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: 'var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div className="page-tag" style={{ color: 'var(--color-gold)' }}>Competition Demonstration</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-indigo)', margin: 0 }}>
              Tārā 2-Minute Guided Flow
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
              Step {current.stepNumber} of {STEPS.length}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ fontSize: '1.1rem', padding: '2px 6px' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div style={{ display: 'flex', height: '3px', background: 'var(--color-bg-base)' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i <= currentStep ? 'var(--color-gold)' : 'transparent',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step Body */}
        <div style={{ padding: '24px 20px', flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--color-ochre)',
            fontWeight: 600,
            marginBottom: '4px',
          }}>
            {current.subtitle}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-indigo)',
            marginTop: 0,
            marginBottom: '12px',
          }}>
            {current.title}
          </h3>

          <p style={{
            fontSize: '0.86rem',
            color: 'var(--color-ink-primary)',
            lineHeight: 1.6,
            background: 'var(--color-bg-base)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-xs)',
            borderLeft: '3px solid var(--color-indigo)',
            margin: '0 0 20px 0',
          }}>
            {current.narration}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecuteCurrentStep}
              style={{ padding: '10px 24px', fontSize: '0.88rem' }}
            >
              ✦ {current.actionText}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: 'var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-bg-base)',
        }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          <span style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
            "Different syntax. One security language."
          </span>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleNext}
          >
            {currentStep === STEPS.length - 1 ? 'Finish Demo' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
