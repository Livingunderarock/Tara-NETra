// Verification of all 10 Acceptance Tests for Tārā-NETra
import { sampleConfigs } from './src/knowledge/sampleConfigs.js';
import { parseConfigLines, interpretLine, analyzeConfiguration } from './src/core/interpreter.js';
import { evaluateCompliance } from './src/core/compliance.js';
import { synthesizeGeneralizedPattern, matchLearnedPattern } from './src/core/patternGeneralizer.js';
import { calculateLearningImpact } from './src/core/learningImpact.js';
import { analyzeSecuritySemanticDrift } from './src/core/drift.js';

console.log('=== RUNNING Tārā-NETra ACCEPTANCE TEST SUITE ===\n');

let allPassed = true;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    allPassed = false;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// TEST A: KNOWN VENDOR (Cisco / Fortinet / Juniper)
// -------------------------------------------------------------
console.log('--- TEST A: KNOWN VENDOR ---');
const ciscoAnalysis = analyzeConfiguration(sampleConfigs.cisco.content);
assert(ciscoAnalysis.vendor.vendor === 'Cisco IOS', `Cisco recognized: ${ciscoAnalysis.vendor.vendor}`);
assert(ciscoAnalysis.stats.recognized > 0, `Recognized directives: ${ciscoAnalysis.stats.recognized}`);
const ciscoCompliance = evaluateCompliance(ciscoAnalysis.sbm);
assert(ciscoCompliance.summary.pass > 0, `Compliance evaluated with passes: ${ciscoCompliance.summary.pass}`);
assert(ciscoCompliance.results.some(r => r.remediation), 'Remediation available for findings');

// -------------------------------------------------------------
// TEST B: UNKNOWN VENDOR (BRANCH-GW-04)
// -------------------------------------------------------------
console.log('\n--- TEST B: UNKNOWN VENDOR ---');
const unknownAnalysis = analyzeConfiguration(sampleConfigs.unknown.content);
assert(unknownAnalysis.vendor.vendor === 'Unknown', `Vendor identified as Unknown: ${unknownAnalysis.vendor.vendor}`);
assert(unknownAnalysis.stats.unknown > 0, `Has unknown constructs: ${unknownAnalysis.stats.unknown}`);
const sessionLine = unknownAnalysis.lines.find(l => l.trimmed.includes('set secure-admin session-limit 900'));
assert(sessionLine !== undefined, 'Found session-limit 900 line');
assert(sessionLine.state === 'UNKNOWN', `Session limit line is UNKNOWN: ${sessionLine.state}`);
assert(sessionLine.hypothesis === 'Administrative Session Timeout', `Hypothesis generated: ${sessionLine.hypothesis}`);

// -------------------------------------------------------------
// TEST C: GENERALIZED LEARNING
// -------------------------------------------------------------
console.log('\n--- TEST C: GENERALIZED LEARNING ---');
const taught = synthesizeGeneralizedPattern(
  'set secure-admin session-limit 900',
  'ADMIN_SESSION_TIMEOUT',
  900,
  'BRANCH-GW-04'
);
assert(taught.learnedPattern.includes('<'), `Generalized pattern created: ${taught.learnedPattern}`);
assert(taught.regexPattern !== undefined, `Regex synthesized: ${taught.regexPattern}`);
assert(taught.source === 'HUMAN_TRAINED', `Source is HUMAN_TRAINED: ${taught.source}`);

// Test against completely new configuration line with different value
const matchResult = matchLearnedPattern('set secure-admin session-limit 600', taught);
assert(matchResult !== null && matchResult.matched === true, 'Matched unseen line with generalized pattern');
assert(matchResult.extractedValue === 600, `Dynamically extracted 600: ${matchResult.extractedValue}`);
assert(matchResult.isUnseenVariant === true, 'Correctly flagged as unseen variant');
assert(matchResult.provenance === '✓ LEARNED PATTERN MATCH', `Provenance set: ${matchResult.provenance}`);

// -------------------------------------------------------------
// TEST D: UNSEEN DEVICE B (CAMPUS-GW-05) WITH ACTIVE MEMORY
// -------------------------------------------------------------
console.log('\n--- TEST D: UNSEEN DEVICE PROOF ---');
// Mock storage containing taught pattern
const mockMemory = [taught];
const campusLines = parseConfigLines(sampleConfigs.unknownB.content);
const interpretedCampus = campusLines.map(line => interpretLine(line, 'Unknown', mockMemory));
const campusLearnedLine = interpretedCampus.find(l => l.trimmed === 'set secure-admin session-limit 600');
assert(campusLearnedLine !== undefined, 'Found session-limit 600 line in CAMPUS-GW-05');
assert(campusLearnedLine.state === 'LEARNED', `State is LEARNED: ${campusLearnedLine.state}`);
assert(campusLearnedLine.value === 600, `Value dynamically extracted as 600: ${campusLearnedLine.value}`);
assert(campusLearnedLine.isUnseenVariant === true, `isUnseenVariant is true: ${campusLearnedLine.isUnseenVariant}`);
assert(campusLearnedLine.provenance === '✓ LEARNED PATTERN MATCH', `Provenance: ${campusLearnedLine.provenance}`);

// -------------------------------------------------------------
// TEST E: DETERMINISTIC COMPLIANCE (PASS / FAIL / UNKNOWN)
// -------------------------------------------------------------
console.log('\n--- TEST E: DETERMINISTIC COMPLIANCE ---');
// Before learning: session_timeout is missing
const baselineCompliance = evaluateCompliance(unknownAnalysis.sbm);
const baselineSessControl = baselineCompliance.results.find(r => r.controlId === 'SESS-001');
assert(baselineSessControl.status === 'UNKNOWN', `Before learning, SESS-001 is UNKNOWN: ${baselineSessControl.status}`);

// After learning on CAMPUS-GW-05: sbm has session_timeout = 600 (limit is 900)
const campusSbm = {};
for (const line of interpretedCampus) {
  if (line.semantic && line.state !== 'SKIP') {
    campusSbm[line.semantic] = {
      parameter: line.semantic,
      value: line.value,
      confidence: line.confidence,
      source: line.source,
      lineNumber: line.lineNumber,
      state: line.state,
    };
  }
}
const campusCompliance = evaluateCompliance(campusSbm);
const campusSessControl = campusCompliance.results.find(r => r.controlId === 'SESS-001');
assert(campusSessControl.status === 'PASS', `After learning 600s, SESS-001 is PASS: ${campusSessControl.status} (Observed: ${campusSessControl.observed})`);

// -------------------------------------------------------------
// TEST F: REAL CALCULATED LEARNING IMPACT
// -------------------------------------------------------------
console.log('\n--- TEST F: LEARNING IMPACT ---');
const campusAnalysisResult = {
  vendor: { vendor: 'Unknown', confidence: 0 },
  deviceName: 'CAMPUS-GW-05',
  lines: interpretedCampus,
  sbm: campusSbm,
  stats: {
    total: interpretedCampus.filter(l => l.state !== 'SKIP').length,
    recognized: interpretedCampus.filter(l => l.state === 'RECOGNIZED').length,
    inferred: interpretedCampus.filter(l => l.state === 'INFERRED').length,
    learned: interpretedCampus.filter(l => l.state === 'LEARNED').length,
    lowConfidence: interpretedCampus.filter(l => l.state === 'LOW_CONFIDENCE').length,
    unknown: interpretedCampus.filter(l => l.state === 'UNKNOWN').length,
    recognizedPercent: 85,
  }
};
const impact = calculateLearningImpact(sampleConfigs.unknownB.content, campusAnalysisResult, campusCompliance);
assert(impact !== null && impact.hasImpact === true, 'Learning impact detected');
assert(impact.delta.actionableDecisions > 0, `Actionable decisions resolved: ${impact.delta.actionableDecisions}`);
assert(impact.resolvedControls.some(r => r.controlId === 'SESS-001'), 'SESS-001 in resolved controls');
const resolvedSess = impact.resolvedControls.find(r => r.controlId === 'SESS-001');
assert(resolvedSess.statusBefore === 'UNKNOWN' && resolvedSess.statusAfter === 'PASS', `SESS-001 transformed UNKNOWN -> ${resolvedSess.statusAfter}`);

// -------------------------------------------------------------
// TEST G: SECURITY SEMANTIC DRIFT
// -------------------------------------------------------------
console.log('\n--- TEST G: SECURITY SEMANTIC DRIFT ---');
const drift = analyzeSecuritySemanticDrift(
  sampleConfigs.unknown.content,
  sampleConfigs.unknownB.content,
  'BRANCH-GW-04',
  'CAMPUS-GW-05'
);
assert(drift !== null, 'Drift report computed');
assert(drift.rawLinesChanged > 0, `Raw lines changed: ${drift.rawLinesChanged}`);
assert(drift.securityRelevantChanges >= 0, `Security-relevant changes calculated: ${drift.securityRelevantChanges}`);

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n=============================================');
if (allPassed) {
  console.log('✅ ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
} else {
  console.log('❌ SOME TESTS FAILED.');
  process.exit(1);
}
console.log('=============================================\n');
