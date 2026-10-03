// Tārā Security Semantic Drift Engine
// Compares the underlying SECURITY MEANING of two configurations rather than simple text diffs.
// Distinguishes cosmetic configuration changes (e.g. comments, whitespace, non-security directives)
// from high-severity security baseline alterations.

import { analyzeConfiguration } from './interpreter.js';
import { semanticControls } from '../knowledge/semanticControls.js';

/**
 * Computes raw line diff count between two configuration strings
 */
function computeRawDiff(textA, textB) {
  const linesA = (textA || '').split('\n').map(l => l.trim()).filter(Boolean);
  const linesB = (textB || '').split('\n').map(l => l.trim()).filter(Boolean);

  const setA = new Set(linesA);
  const setB = new Set(linesB);

  let changes = 0;
  linesA.forEach(line => {
    if (!setB.has(line)) changes++;
  });
  linesB.forEach(line => {
    if (!setA.has(line)) changes++;
  });

  return Math.max(changes, Math.abs(linesA.length - linesB.length));
}

/**
 * Compares two configurations and extracts Security Semantic Drift
 *
 * @param {string} configTextA - Baseline configuration
 * @param {string} configTextB - Target / subsequent configuration
 * @param {string} nameA - Optional label for config A
 * @param {string} nameB - Optional label for config B
 * @returns {object} Semantic drift analysis report
 */
export function analyzeSecuritySemanticDrift(configTextA, configTextB, nameA = 'Configuration A', nameB = 'Configuration B') {
  if (!configTextA || !configTextB) {
    return null;
  }

  const analysisA = analyzeConfiguration(configTextA);
  const analysisB = analyzeConfiguration(configTextB);

  const sbmA = analysisA.sbm || {};
  const sbmB = analysisB.sbm || {};

  const allParams = new Set([...Object.keys(sbmA), ...Object.keys(sbmB)]);
  const semanticChanges = [];
  let unchangedCount = 0;

  for (const param of allParams) {
    const entryA = sbmA[param];
    const entryB = sbmB[param];

    // Find control metadata
    const control = semanticControls.find(c => c.semanticParameter === param);
    const controlName = control?.name || param;
    const severity = control?.severity || 'MEDIUM';

    // Case 1: Parameter modified
    if (entryA && entryB) {
      if (entryA.value !== entryB.value) {
        semanticChanges.push({
          parameter: param,
          controlName,
          controlId: control?.id || null,
          severity,
          type: 'MODIFIED',
          beforeValue: entryA.value,
          afterValue: entryB.value,
          lineNumberA: entryA.lineNumber,
          lineNumberB: entryB.lineNumber,
          impact: entryB.value === false && control?.expectedValue === true
            ? `Security control "${controlName}" has been deactivated or loosened.`
            : `Parameter value drifted from ${JSON.stringify(entryA.value)} to ${JSON.stringify(entryB.value)}.`,
        });
      } else {
        unchangedCount++;
      }
    }
    // Case 2: Parameter removed in B
    else if (entryA && !entryB) {
      semanticChanges.push({
        parameter: param,
        controlName,
        controlId: control?.id || null,
        severity: control?.severity === 'CRITICAL' || control?.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
        type: 'REMOVED',
        beforeValue: entryA.value,
        afterValue: null,
        lineNumberA: entryA.lineNumber,
        lineNumberB: null,
        impact: `Security safeguard "${controlName}" was present in ${nameA} but omitted in ${nameB}.`,
      });
    }
    // Case 3: Parameter newly introduced in B
    else if (!entryA && entryB) {
      semanticChanges.push({
        parameter: param,
        controlName,
        controlId: control?.id || null,
        severity: 'LOW',
        type: 'ADDED',
        beforeValue: null,
        afterValue: entryB.value,
        lineNumberA: null,
        lineNumberB: entryB.lineNumber,
        impact: `New security directive "${controlName}" introduced in ${nameB} with value ${JSON.stringify(entryB.value)}.`,
      });
    }
  }

  const rawDiffCount = computeRawDiff(configTextA, configTextB);

  // Determine overall drift severity
  const hasCritical = semanticChanges.some(c => c.severity === 'CRITICAL');
  const hasHigh = semanticChanges.some(c => c.severity === 'HIGH');
  const overallSeverity = hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : semanticChanges.length > 0 ? 'MEDIUM' : 'NONE';

  return {
    nameA,
    nameB,
    vendorA: analysisA.vendor.vendor,
    vendorB: analysisB.vendor.vendor,
    rawLinesChanged: rawDiffCount,
    securityRelevantChanges: semanticChanges.length,
    unchangedParametersCount: unchangedCount,
    overallSeverity,
    semanticChanges,
  };
}
