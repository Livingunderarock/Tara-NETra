import React, { useState, useMemo } from 'react';
import { semanticControls } from '../knowledge/semanticControls';
import { saveLearnedMapping } from '../services/storage';

// Helper to deduce best canonical hypothesis for any unfamiliar line
function deduceHypothesis(line) {
  if (line.semantic) {
    const ctrl = semanticControls.find(c => c.semanticParameter === line.semantic);
    return {
      semantic: line.semantic,
      category: ctrl?.category || 'General',
      controlName: ctrl?.name || line.semantic,
      value: line.value !== null && line.value !== undefined ? line.value : (line.trimmed.match(/(\d+)/) ? parseInt(line.trimmed.match(/(\d+)/)[1], 10) : true),
      confidence: line.confidence || 75,
      hypothesisText: line.hypothesis || `Matches standard: ${ctrl?.name || line.semantic}`
    };
  }

  const lower = line.trimmed.toLowerCase();
  const numMatch = line.trimmed.match(/(\d+)/);
  const numVal = numMatch ? parseInt(numMatch[1], 10) : true;

  if (lower.includes('session') || lower.includes('timeout') || lower.includes('idle')) {
    return { semantic: 'ADMIN_SESSION_TIMEOUT', category: 'Administrative Access', controlName: 'Admin Session Timeout', value: numVal !== true ? numVal : 900, confidence: 70, hypothesisText: 'Possible: Admin Session Timeout Policy' };
  }
  if (lower.includes('lockout') || lower.includes('attempts') || lower.includes('retry')) {
    return { semantic: 'LOGIN_MAX_RETRIES', category: 'Administrative Access', controlName: 'Account Lockout Threshold', value: numVal !== true ? numVal : 5, confidence: 75, hypothesisText: 'Possible: Account Lockout Retry Threshold' };
  }
  if (lower.includes('ssh')) {
    return { semantic: 'SSH_V2_ENFORCED', category: 'Management Plane Hardening', controlName: 'SSH Protocol Version 2 Enforced', value: true, confidence: 85, hypothesisText: 'Possible: Enforcing SSH Version 2' };
  }
  if (lower.includes('telnet')) {
    return { semantic: 'TELNET_DISABLED', category: 'Management Plane Hardening', controlName: 'Insecure Telnet Protocol Disabled', value: true, confidence: 85, hypothesisText: 'Possible: Disabling Insecure Telnet' };
  }
  if (lower.includes('banner') || lower.includes('motd')) {
    return { semantic: 'LOGIN_BANNER_CONFIGURED', category: 'Administrative Access', controlName: 'Authorized Access Login Banner', value: true, confidence: 80, hypothesisText: 'Possible: Legal Warning Login Banner' };
  }
  if (lower.includes('cipher') || lower.includes('crypto') || lower.includes('encryption')) {
    return { semantic: 'STRONG_ENCRYPTION_CIPHERS', category: 'Control Plane Security', controlName: 'Cryptographic Ciphers & Algorithms', value: true, confidence: 75, hypothesisText: 'Possible: Modern Cryptographic Cipher Suite' };
  }
  if (lower.includes('ntp') || lower.includes('time-sync')) {
    return { semantic: 'NTP_SERVER_CONFIGURED', category: 'Audit & Accountability', controlName: 'Network Time Protocol (NTP) Synchronized', value: true, confidence: 80, hypothesisText: 'Possible: NTP Time Synchronization Server' };
  }
  if (lower.includes('syslog') || lower.includes('logging') || lower.includes('monitor')) {
    return { semantic: 'REMOTE_SYSLOG_ENABLED', category: 'Audit & Accountability', controlName: 'Centralized Remote Logging Enabled', value: true, confidence: 80, hypothesisText: 'Possible: Centralized Remote Syslog Logging' };
  }
  if (lower.includes('password') || lower.includes('min-chars')) {
    return { semantic: 'PASSWORD_MIN_LENGTH', category: 'Authentication & Credentials', controlName: 'Minimum Password Length Policy', value: numVal !== true ? numVal : 14, confidence: 75, hypothesisText: 'Possible: Password Complexity & Length Policy' };
  }
  if (lower.includes('acl') || lower.includes('firewall') || lower.includes('permit') || lower.includes('deny')) {
    return { semantic: 'ACL_EXPLICIT_DENY_LOGGED', category: 'Traffic Filtering & Access Lists', controlName: 'Explicit Deny-All Rule at End of ACLs', value: true, confidence: 70, hypothesisText: 'Possible: Firewall Boundary Filtering Rule' };
  }

  return { semantic: 'UNAUTHENTICATED_ACCESS_DISABLED', category: 'Administrative Access', controlName: 'General Administrative Control', value: true, confidence: 60, hypothesisText: 'Unclassified Administrative Directive' };
}

export default function TrainingStudio({ analysisResult, onReanalyze, showToast }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mappingCategory, setMappingCategory] = useState('');
  const [mappingSemantic, setMappingSemantic] = useState('');
  const [mappingValue, setMappingValue] = useState('');
  const [taught, setTaught] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'untaught' | 'learned'
  const [searchQuery, setSearchQuery] = useState('');

  if (!analysisResult) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-tag">Adaptive Reasoning</div>
            <h1 className="page-title">TĀRĀ Learning Studio</h1>
            <div className="page-subtitle">Teach TĀRĀ the security meaning of unfamiliar configuration</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-state-symbol">⚚</span>
          <div className="empty-state-text">
            Analyze a configuration first to discover unknown constructs
          </div>
        </div>
      </div>
    );
  }

  const unknownLines = useMemo(() => {
    return analysisResult.lines.filter(l =>
      l.state === 'UNKNOWN' || l.state === 'LOW_CONFIDENCE' || l.state === 'LEARNED' || taught[l.lineNumber]
    );
  }, [analysisResult, taught]);

  const untaughtCount = unknownLines.filter(l => !taught[l.lineNumber] && l.state !== 'LEARNED').length;
  const taughtCount = unknownLines.filter(l => taught[l.lineNumber] || l.state === 'LEARNED').length;

  // Filtered rows for the ledger
  const filteredLines = useMemo(() => {
    return unknownLines.filter(line => {
      const isTaught = !!taught[line.lineNumber] || line.state === 'LEARNED';
      if (filterMode === 'untaught' && isTaught) return false;
      if (filterMode === 'learned' && !isTaught) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return line.trimmed.toLowerCase().includes(query) || (line.hypothesis && line.hypothesis.toLowerCase().includes(query));
      }
      return true;
    });
  }, [unknownLines, taught, filterMode, searchQuery]);

  // Single Item Inscribe Handler
  const handleTeach = (customLine = null, customSemantic = null, customValue = null, customCategory = null) => {
    const targetItem = customLine || selectedItem;
    const semantic = customSemantic || mappingSemantic;
    if (!targetItem || !semantic) return;

    const pattern = targetItem.trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '\\d+');
    const control = semanticControls.find(c => c.semanticParameter === semantic);

    let val = customValue !== null && customValue !== undefined ? customValue : mappingValue;
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val !== '' && !isNaN(Number(val))) val = Number(val);
    else if (val === '') val = true;

    saveLearnedMapping({
      pattern,
      rawCommand: targetItem.trimmed,
      semantic: semantic,
      value: val,
      category: customCategory || mappingCategory || control?.category || 'General',
      controlId: control?.id || null,
      controlName: control?.name || semantic,
      confidence: 97,
      source: 'Administrator',
    });

    setTaught(prev => ({ ...prev, [targetItem.lineNumber]: true }));
    if (!customLine) {
      setSelectedItem(null);
      setMappingCategory('');
      setMappingSemantic('');
      setMappingValue('');
    }
  };

  const handleTeachAndReprocess = () => {
    const semanticName = semanticControls.find(c => c.semanticParameter === mappingSemantic)?.name || mappingSemantic;
    handleTeach();
    showToast(`Knowledge acquired: ${semanticName}`);
    setTimeout(() => {
      onReanalyze();
    }, 350);
  };

  // 1-Click Inline Accept for a single row
  const handleInlineAccept = (line) => {
    const hyp = deduceHypothesis(line);
    handleTeach(line, hyp.semantic, hyp.value, hyp.category);
    showToast(`Inscribed: ${hyp.controlName}`);
    setTimeout(() => {
      onReanalyze();
    }, 350);
  };

  // "Learn All" Batch Inscription
  const handleBatchInscribeAll = () => {
    const untaughtLines = unknownLines.filter(l => !taught[l.lineNumber]);
    if (untaughtLines.length === 0) return;

    const newlyTaught = {};
    untaughtLines.forEach(line => {
      const hyp = deduceHypothesis(line);
      const pattern = line.trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '\\d+');
      const control = semanticControls.find(c => c.semanticParameter === hyp.semantic);

      saveLearnedMapping({
        pattern,
        rawCommand: line.trimmed,
        semantic: hyp.semantic,
        value: hyp.value,
        category: hyp.category,
        controlId: control?.id || null,
        controlName: hyp.controlName,
        confidence: 97,
        source: 'Administrator (Batch Inscribed)',
      });

      newlyTaught[line.lineNumber] = true;
    });

    setTaught(prev => ({ ...prev, ...newlyTaught }));
    setSelectedItem(null);
    showToast(`Batch Inscribed: ${untaughtLines.length} unfamiliar constructs into TĀRĀ Memory!`);
    setTimeout(() => {
      onReanalyze();
    }, 450);
  };

  const handleSelectRow = (line) => {
    if (taught[line.lineNumber]) return;
    setSelectedItem(line);

    const hyp = deduceHypothesis(line);
    setMappingSemantic(hyp.semantic);
    setMappingCategory(hyp.category);
    setMappingValue(String(hyp.value !== null && hyp.value !== undefined ? hyp.value : ''));
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-md)' }}>
        <div className="page-title-group">
          <div className="page-tag">Adaptive Knowledge Acquisition</div>
          <h1 className="page-title">TĀRĀ Learning Studio</h1>
          <div className="page-subtitle">
            Teach TĀRĀ the security meaning of unfamiliar vendor configurations
          </div>
        </div>
      </div>

      {/* Studio Action & Status Bar */}
      <div className="studio-action-bar">
        <div className="studio-stats-chips">
          <div className="studio-chip">
            <span className="studio-chip-dot" style={{ background: untaughtCount > 0 ? 'var(--color-fail)' : 'var(--color-pass)' }} />
            <span>{untaughtCount} Unfamiliar Constructs</span>
          </div>
          {taughtCount > 0 && (
            <div className="studio-chip">
              <span className="studio-chip-dot" style={{ background: 'var(--color-pass)' }} />
              <span style={{ color: 'var(--color-pass)' }}>{taughtCount} Inscribed this Session</span>
            </div>
          )}
        </div>

        {/* Learn All Button */}
        <button
          className="btn-batch-learn"
          onClick={handleBatchInscribeAll}
          disabled={untaughtCount === 0}
          title="Batch inscribe all detected hypotheses into TĀRĀ Memory in one click"
        >
          <span>✧</span>
          <span>Learn All Hypotheses ({untaughtCount})</span>
        </button>
      </div>

      {/* Master-Detail Split Workbench (Zero Scroll Outside) */}
      <div className="learning-workbench">
        {/* Left Pane: Construct Ledger */}
        <div className="constructs-ledger-pane">
          <div className="ledger-pane-header">
            <span className="ledger-pane-title">
              Construct Ledger ({filteredLines.length})
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-secondary btn-sm ${filterMode === 'all' ? 'btn-primary' : ''}`}
                style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                onClick={() => setFilterMode('all')}
              >
                All ({unknownLines.length})
              </button>
              <button
                className={`btn btn-secondary btn-sm ${filterMode === 'untaught' ? 'btn-primary' : ''}`}
                style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                onClick={() => setFilterMode('untaught')}
              >
                Untaught ({untaughtCount})
              </button>
              {taughtCount > 0 && (
                <button
                  className={`btn btn-secondary btn-sm ${filterMode === 'learned' ? 'btn-primary' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                  onClick={() => setFilterMode('learned')}
                >
                  Learned ({taughtCount})
                </button>
              )}
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ padding: '6px var(--space-md)', borderBottom: 'var(--border-hairline)', background: 'var(--color-bg-base)' }}>
            <input
              className="form-input"
              style={{ padding: '4px 8px', fontSize: '0.75rem', background: 'var(--color-bg-surface-elevated)' }}
              placeholder="Search unfamiliar commands or hypotheses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Scrollable Rows Container */}
          <div className="ledger-scroll-area">
            {filteredLines.length === 0 ? (
              <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-ink-muted)' }}>
                <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>✓</span>
                <span style={{ fontSize: '0.82rem' }}>No constructs in this filter</span>
              </div>
            ) : (
              filteredLines.map(line => {
                const isTaught = !!taught[line.lineNumber];
                const isSelected = selectedItem?.lineNumber === line.lineNumber;
                const hyp = deduceHypothesis(line);

                return (
                  <div
                    key={line.lineNumber}
                    className={`construct-row ${isSelected ? 'selected' : ''} ${isTaught ? 'taught' : ''}`}
                    onClick={() => handleSelectRow(line)}
                    title={isTaught ? 'Inscribed into TĀRĀ Memory' : 'Click to customize mapping on the right'}
                  >
                    <div className="construct-row-main">
                      <span className="construct-line-badge">L{line.lineNumber}</span>
                      <span
                        className={`construct-cmd-text ${isTaught ? 'taught' : ''}`}
                        title={line.trimmed}
                      >
                        {line.trimmed}
                      </span>
                    </div>

                    <div className="construct-row-actions">
                      {isTaught ? (
                        <span className="badge badge-learned" style={{ fontSize: '0.68rem' }}>
                          ✓ LEARNED
                        </span>
                      ) : (
                        <>
                          <span
                            className="construct-hypothesis-pill"
                            title={hyp.hypothesisText}
                          >
                            {hyp.controlName}
                          </span>
                          <button
                            className="btn-inline-accept"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInlineAccept(line);
                            }}
                            title={`Instantly map to ${hyp.controlName}`}
                          >
                            ✓ Accept
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Sticky Teaching Desk */}
        <div className="teaching-desk-pane">
          {selectedItem ? (
            <div className="teaching-desk-card animate-fadeIn">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', borderBottom: 'var(--border-hairline)', paddingBottom: '8px' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                  Inscribe Security Meaning
                </div>
                <span className="construct-line-badge">Line {selectedItem.lineNumber}</span>
              </div>

              {/* Step 1: Raw Command */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-label" style={{ fontSize: '0.68rem' }}>1. Raw Command</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  padding: '8px 12px',
                  background: 'var(--color-bg-base)',
                  border: 'var(--border-hairline)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-indigo)',
                  wordBreak: 'break-all'
                }}>
                  {selectedItem.trimmed}
                </div>
              </div>

              {/* Step 2: TĀRĀ Hypothesis */}
              {selectedItem.hypothesis && (
                <div style={{
                  padding: '8px 12px',
                  background: 'var(--color-unknown-bg)',
                  borderLeft: '3px solid var(--color-unknown)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: 'var(--space-md)'
                }}>
                  <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ochre)', fontWeight: 600 }}>
                    2. AI Hypothesis ({selectedItem.confidence}%)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-primary)', marginTop: '2px' }}>
                    {selectedItem.hypothesis}
                  </div>
                </div>
              )}

              {/* Step 3: Mapping Form */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-label" style={{ fontSize: '0.68rem' }}>3. Standard Security Concept</div>

                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <select
                    className="form-select"
                    value={mappingSemantic}
                    onChange={(e) => {
                      setMappingSemantic(e.target.value);
                      const ctrl = semanticControls.find(c => c.semanticParameter === e.target.value);
                      if (ctrl) setMappingCategory(ctrl.category);
                    }}
                  >
                    <option value="">Select standard security concept...</option>
                    {semanticControls.map(c => (
                      <option key={c.id} value={c.semanticParameter}>
                        {c.name} ({c.semanticParameter})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: 'var(--color-ink-muted)', fontSize: '0.64rem' }}>
                      Category
                    </label>
                    <input
                      className="form-input"
                      value={mappingCategory}
                      onChange={(e) => setMappingCategory(e.target.value)}
                      placeholder="e.g. Administrative Access"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: 'var(--color-ink-muted)', fontSize: '0.64rem' }}>
                      Parameter Value
                    </label>
                    <input
                      className="form-input"
                      value={mappingValue}
                      onChange={(e) => setMappingValue(e.target.value)}
                      placeholder="e.g. 900 or true"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  disabled={!mappingSemantic}
                  onClick={handleTeachAndReprocess}
                >
                  Inscribe &amp; Re-analyze ✦
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="teaching-desk-empty">
              <span style={{ fontSize: '2rem', color: 'var(--color-ochre)', marginBottom: 'var(--space-sm)' }}>⚚</span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-indigo)', marginBottom: '4px' }}>
                Scholar's Teaching Desk
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary)', maxWidth: '320px', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                Select any unfamiliar construct on the left to inspect its parameters, or use <strong>"Learn All Hypotheses"</strong> above to batch inscribe everything.
              </p>
              <div style={{
                background: 'var(--color-bg-base)',
                border: 'var(--border-hairline)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.74rem',
                color: 'var(--color-ink-muted)',
                lineHeight: 1.5
              }}>
                ✦ <strong>Quick Tip:</strong> Click the small <strong>✓ Accept</strong> button on any row for instant 1-click inscription without opening the form.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
