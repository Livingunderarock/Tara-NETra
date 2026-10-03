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
      backgroundColor: 'rgba(28, 23, 17, 0.78)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-md)',
      animation: 'fadeIn 200ms ease forwards',
    }}>
      <div
        className="animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-surface-elevated)',
          border: '1.5px solid var(--color-gold)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '720px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(28, 23, 17, 0.45), 0 0 0 1px rgba(176, 138, 60, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(176, 138, 60, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-bg-parchment)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg viewBox="0 0 36 36" fill="none" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
              <circle cx="18" cy="18" r="16" stroke="#B08A3C" strokeWidth="0.8" strokeDasharray="1.5 2.5"/>
              <circle cx="18" cy="18" r="13" stroke="#20263A" strokeWidth="1"/>
              <path d="M 8 18 C 11.5 12, 24.5 12, 28 18 C 24.5 24, 11.5 24, 8 18 Z" stroke="#20263A" strokeWidth="1.2"/>
              <circle cx="18" cy="18" r="3.5" stroke="#B08A3C" strokeWidth="0.8"/>
              <circle cx="18" cy="18" r="1.5" fill="#A66A2C"/>
            </svg>
            <div>
              <div className="page-tag" style={{ color: 'var(--color-gold-deep)', fontWeight: 600, fontSize: '0.68rem', marginBottom: '2px' }}>
                Competition Demonstration
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-indigo)', margin: 0, fontWeight: 600 }}>
                Tārā 2-Minute Guided Flow
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--color-indigo)',
              background: 'rgba(176, 138, 60, 0.18)',
              padding: '4px 10px',
              borderRadius: '2px',
              border: '1px solid rgba(176, 138, 60, 0.45)'
            }}>
              Step {current.stepNumber} of {STEPS.length}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ fontSize: '1.2rem', padding: '2px 8px', color: 'var(--color-ink-secondary)', cursor: 'pointer' }}
              title="Close Demonstration"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div style={{ display: 'flex', height: '4px', background: 'var(--color-bg-base)' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i <= currentStep ? 'var(--color-gold)' : 'rgba(176, 138, 60, 0.25)',
                borderRight: i < STEPS.length - 1 ? '1px solid var(--color-bg-base)' : 'none',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step Body */}
        <div style={{ padding: '24px 22px', flex: 1, background: 'var(--color-bg-surface-elevated)' }}>
          <div style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: 'var(--color-ochre)',
            fontWeight: 700,
            marginBottom: '6px',
          }}>
            {current.subtitle}
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.55rem',
            color: 'var(--color-indigo)',
            fontWeight: 600,
            lineHeight: 1.25,
            marginTop: 0,
            marginBottom: '16px',
          }}>
            {current.title}
          </h3>

          <div style={{
            background: 'var(--color-bg-base)',
            border: '1px solid rgba(166, 106, 44, 0.35)',
            borderLeft: '4px solid var(--color-ochre)',
            padding: '16px 18px',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '22px',
            boxShadow: 'inset 0 1px 3px rgba(28, 23, 17, 0.04)',
          }}>
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--color-ink-primary)',
              lineHeight: 1.65,
              margin: 0,
              fontWeight: 400,
            }}>
              {current.narration}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExecuteCurrentStep}
              style={{
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                boxShadow: '0 4px 14px rgba(32, 38, 58, 0.25)',
              }}
            >
              ✦ {current.actionText}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid rgba(176, 138, 60, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-bg-parchment)',
        }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{ fontWeight: 600 }}
          >
            ← Previous
          </button>

          <span style={{
            fontSize: '0.78rem',
            color: 'var(--color-ink-secondary)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
          }}>
            "Different syntax. One security language."
          </span>

          <button
            type="button"
            className={currentStep === STEPS.length - 1 ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
            onClick={handleNext}
            style={{ fontWeight: 600 }}
          >
            {currentStep === STEPS.length - 1 ? 'Finish Demo ✓' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
