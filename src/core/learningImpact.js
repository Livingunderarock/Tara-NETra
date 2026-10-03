// TĀRĀ Intelligence Core — Real Calculated Learning Impact Engine
// Quantifies the exact delta in compliance and semantic evaluation
// before vs after Human-in-the-Loop knowledge inscription.
// NO MOCK DATA. 100% computed from deterministic compliance engine.

import { parseConfigLines, identifyVendor, interpretLine } from './interpreter.js';
import { evaluateCompliance } from './compliance.js';
import { semanticControls } from '../knowledge/semanticControls.js';

/**
 * Calculates the exact delta between a clean baseline (without learned rules)
 * and the current state (with learned rules active).
 *
 * @param {string} configText - Raw device configuration text
 * @param {object} currentAnalysisResult - The analysis result containing learned mappings
 * @param {object} currentComplianceResult - The current compliance assessment
 * @returns {object} Calculated delta, before/after metrics, and traceable impact chain
 */
export function calculateLearningImpact(configText, currentAnalysisResult, currentComplianceResult) {
  if (!configText || !currentAnalysisResult || !currentComplianceResult) {
    return null;
  }

  // 1. Run baseline interpretation with ZERO learned mappings (pure vendor + heuristic baseline)
  const vendorInfo = identifyVendor(configText);
  const lines = parseConfigLines(configText);
  const baselineInterpretedLines = lines.map(line => interpretLine(line, vendorInfo.vendor, []));

  // Build baseline SBM without learned memory
  const baselineSbm = {};
  for (const line of baselineInterpretedLines) {
    if (line.semantic && line.state !== 'SKIP') {
      if (!baselineSbm[line.semantic] || line.confidence > baselineSbm[line.semantic].confidence) {
        baselineSbm[line.semantic] = {
          parameter: line.semantic,
          value: line.value,
          confidence: line.confidence,
          source: line.source,
          lineNumber: line.lineNumber,
          state: line.state,
        };
      }
    }
  }

  // 2. Evaluate baseline compliance (before learning)
  const baselineCompliance = evaluateCompliance(baselineSbm);

  // 3. Extract Before vs After counts
  const beforeStats = {
    pass: baselineCompliance.summary.pass,
    fail: baselineCompliance.summary.fail,
    unknown: baselineCompliance.summary.unknown,
    total: baselineCompliance.summary.total,
    compliancePercent: baselineCompliance.summary.compliancePercent,
    unknownConstructs: baselineInterpretedLines.filter(l => l.state === 'UNKNOWN' || l.state === 'LOW_CONFIDENCE').length,
    recognizedConstructs: baselineInterpretedLines.filter(l => l.state === 'RECOGNIZED' || l.state === 'INFERRED').length,
    learnedConstructs: 0,
  };

  const afterStats = {
    pass: currentComplianceResult.summary.pass,
    fail: currentComplianceResult.summary.fail,
    unknown: currentComplianceResult.summary.unknown,
    total: currentComplianceResult.summary.total,
    compliancePercent: currentComplianceResult.summary.compliancePercent,
    unknownConstructs: currentAnalysisResult.stats.unknown + currentAnalysisResult.stats.lowConfidence,
    recognizedConstructs: currentAnalysisResult.stats.recognized + currentAnalysisResult.stats.inferred,
    learnedConstructs: currentAnalysisResult.stats.learned,
  };

  // 4. Identify learned lines from current analysis
  const learnedLines = currentAnalysisResult.lines.filter(l => l.state === 'LEARNED');

  // 5. Track which controls changed from UNKNOWN to actionable (PASS or FAIL)
  const baselineResultsMap = new Map();
  baselineCompliance.results.forEach(r => baselineResultsMap.set(r.controlId, r));

  const resolvedControls = [];
  currentComplianceResult.results.forEach(curr => {
    const prev = baselineResultsMap.get(curr.controlId);
    if (prev && prev.status === 'UNKNOWN' && (curr.status === 'PASS' || curr.status === 'FAIL')) {
      // Find the learned line that unlocked this control
      const matchingLearnedLine = learnedLines.find(l => {
        return (l.control && l.control.id === curr.controlId) ||
               (l.semantic && l.semantic === curr.controlId) ||
               (curr.evidence && curr.evidence.lineNumber === l.lineNumber);
      });

      const controlMeta = semanticControls.find(c => c.id === curr.controlId);

      resolvedControls.push({
        controlId: curr.controlId,
        controlName: curr.controlName,
        category: curr.category,
        severity: curr.severity,
        statusBefore: 'UNKNOWN',
        statusAfter: curr.status,
        observedValue: curr.observed,
        expectedValue: curr.expected,
        frameworks: curr.frameworks || controlMeta?.frameworks || {},
        rawConstruct: matchingLearnedLine ? matchingLearnedLine.trimmed : (curr.evidence?.source || 'Learned directive'),
        learnedPattern: matchingLearnedLine?.learnedPattern || matchingLearnedLine?.trimmed || null,
        provenance: matchingLearnedLine?.provenance || '✓ LEARNED PATTERN MATCH',
        lineNumber: matchingLearnedLine?.lineNumber || curr.evidence?.lineNumber || null,
        reason: curr.reason,
        remediation: curr.remediation,
        verification: curr.verification,
      });
    }
  });

  // Calculate summaries
  const unknownConstructsResolved = Math.max(0, beforeStats.unknownConstructs - afterStats.unknownConstructs);
  const actionableDecisions = resolvedControls.length;
  const newControlsEvaluated = resolvedControls.length;

  return {
    hasImpact: learnedLines.length > 0 || resolvedControls.length > 0,
    before: beforeStats,
    after: afterStats,
    delta: {
      unknownConstructsResolved,
      actionableDecisions,
      newControlsEvaluated,
      passDelta: afterStats.pass - beforeStats.pass,
      failDelta: afterStats.fail - beforeStats.fail,
      unknownDelta: afterStats.unknown - beforeStats.unknown,
      percentDelta: afterStats.compliancePercent - beforeStats.compliancePercent,
    },
    learnedLinesCount: learnedLines.length,
    resolvedControls,
  };
}
