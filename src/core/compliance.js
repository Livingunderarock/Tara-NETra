// TĀRĀ Compliance Engine — Deterministic compliance evaluation
// AI interprets. Rules decide. Never hallucinate compliance.

import { semanticControls } from '../knowledge/semanticControls.js';

// Evaluate a single control against SBM
function evaluateControl(control, sbm) {
  const param = control.semanticParameter;
  const sbmEntry = sbm[param];

  if (!sbmEntry) {
    return {
      controlId: control.id,
      controlName: control.name,
      category: control.category,
      severity: control.severity,
      status: 'UNKNOWN',
      expected: control.expectedValue,
      observed: null,
      confidence: 0,
      evidence: null,
      frameworks: control.frameworks,
      remediation: control.remediation,
      verification: control.verification,
      description: control.description,
      reason: 'No evidence found in configuration',
    };
  }

  let pass = false;
  const expected = control.expectedValue;
  const observed = sbmEntry.value;

  if (typeof expected === 'boolean') {
    pass = observed === expected;
  } else if (typeof expected === 'number') {
    pass = observed === expected || Number(observed) === expected;
  } else if (typeof expected === 'object' && expected !== null) {
    const numObserved = typeof observed === 'number' ? observed : (!isNaN(Number(observed)) ? Number(observed) : null);
    if (expected.min !== undefined) {
      pass = numObserved !== null && numObserved >= expected.min;
    }
    if (expected.max !== undefined) {
      pass = numObserved !== null && numObserved <= expected.max;
    }
  }

  return {
    controlId: control.id,
    controlName: control.name,
    category: control.category,
    severity: control.severity,
    status: pass ? 'PASS' : 'FAIL',
    expected: expected,
    observed: observed,
    confidence: sbmEntry.confidence,
    evidence: {
      lineNumber: sbmEntry.lineNumber,
      source: sbmEntry.source,
      state: sbmEntry.state,
    },
    frameworks: control.frameworks,
    remediation: control.remediation,
    verification: control.verification,
    description: control.description,
    reason: pass ? 'Control requirement satisfied' : 'Control requirement not met',
  };
}

// Run full compliance evaluation
export function evaluateCompliance(sbm, selectedFrameworks = ['CIS', 'NIST', 'STIG', 'ISO']) {
  const results = [];

  for (const control of semanticControls) {
    // Check if this control maps to any selected framework
    const hasFramework = selectedFrameworks.some(fw => control.frameworks[fw]);
    if (!hasFramework) continue;

    const result = evaluateControl(control, sbm);
    results.push(result);
  }

  // Calculate summary
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const unknown = results.filter(r => r.status === 'UNKNOWN').length;
  const total = results.length;
  const compliancePercent = total > 0 ? Math.round((pass / total) * 100) : 0;

  // Per-framework scores
  const frameworkScores = {};
  for (const fw of selectedFrameworks) {
    const fwResults = results.filter(r => r.frameworks[fw]);
    const fwPass = fwResults.filter(r => r.status === 'PASS').length;
    const fwTotal = fwResults.length;
    frameworkScores[fw] = {
      pass: fwPass,
      fail: fwResults.filter(r => r.status === 'FAIL').length,
      unknown: fwResults.filter(r => r.status === 'UNKNOWN').length,
      total: fwTotal,
      percent: fwTotal > 0 ? Math.round((fwPass / fwTotal) * 100) : 0,
    };
  }

  // Per-category breakdown
  const categoryScores = {};
  const cats = [...new Set(results.map(r => r.category))];
  for (const cat of cats) {
    const catResults = results.filter(r => r.category === cat);
    const catPass = catResults.filter(r => r.status === 'PASS').length;
    categoryScores[cat] = {
      pass: catPass,
      fail: catResults.filter(r => r.status === 'FAIL').length,
      unknown: catResults.filter(r => r.status === 'UNKNOWN').length,
      total: catResults.length,
      percent: catResults.length > 0 ? Math.round((catPass / catResults.length) * 100) : 0,
    };
  }

  // Security debt
  const securityDebt = {
    HIGH: results.filter(r => r.status === 'FAIL' && r.severity === 'HIGH').length,
    MEDIUM: results.filter(r => r.status === 'FAIL' && r.severity === 'MEDIUM').length,
    LOW: results.filter(r => r.status === 'FAIL' && r.severity === 'LOW').length,
  };

  return {
    results,
    summary: { pass, fail, unknown, total, compliancePercent },
    frameworkScores,
    categoryScores,
    securityDebt,
    timestamp: new Date().toISOString(),
  };
}

// Generate rich compliance heatmap matrix data
export function generateHeatmap(complianceResults, frameworks = ['CIS', 'NIST', 'STIG', 'ISO']) {
  if (!complianceResults?.results) return {};
  const controls = complianceResults.results;
  const categories = [...new Set(controls.map(c => c.category))];
  
  const heatmap = {};
  for (const cat of categories) {
    heatmap[cat] = {};
    for (const fw of frameworks) {
      const catControls = controls.filter(c => c.category === cat && c.frameworks[fw]);
      if (catControls.length === 0) {
        heatmap[cat][fw] = {
          status: 'N/A',
          total: 0,
          passed: 0,
          failed: 0,
          unknown: 0,
          percent: null,
          controls: []
        };
      } else {
        const passed = catControls.filter(c => c.status === 'PASS').length;
        const failed = catControls.filter(c => c.status === 'FAIL').length;
        const unknown = catControls.filter(c => c.status === 'UNKNOWN').length;
        const total = catControls.length;
        const percent = Math.round((passed / total) * 100);
        const status = passed === total ? 'PASS' : failed > 0 ? (passed > 0 ? 'PARTIAL' : 'FAIL') : 'UNKNOWN';

        heatmap[cat][fw] = {
          status,
          total,
          passed,
          failed,
          unknown,
          percent,
          controls: catControls.map(c => ({
            id: c.controlId,
            name: c.name,
            status: c.status,
            requirement: c.frameworks[fw],
            severity: c.severity,
            finding: c.finding
          }))
        };
      }
    }
  }
  return heatmap;
}
