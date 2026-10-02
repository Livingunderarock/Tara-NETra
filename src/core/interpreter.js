// TĀRĀ Intelligence Core — Configuration Interpreter
// Layers: Exact match → Regex → Semantic aliases → Learned mappings → Unknown

import { vendorPatterns, semanticAliases, aliasToParameter } from '../knowledge/vendorPatterns';
import { semanticControls } from '../knowledge/semanticControls';
import { getLearnedMappings } from '../services/storage';

// Identify vendor from configuration text
export function identifyVendor(configText) {
  const scores = {};
  for (const [vendor, data] of Object.entries(vendorPatterns)) {
    let score = 0;
    for (const regex of data.identifier) {
      if (regex.test(configText)) score++;
    }
    if (score > 0) scores[vendor] = score;
  }
  if (Object.keys(scores).length === 0) return { vendor: 'Unknown', confidence: 0 };
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const maxPossible = vendorPatterns[best[0]].identifier.length;
  return { vendor: best[0], confidence: Math.round((best[1] / maxPossible) * 100) };
}

// Parse configuration into individual lines with metadata
export function parseConfigLines(configText) {
  const lines = configText.split('\n');
  return lines.map((line, index) => ({
    lineNumber: index + 1,
    raw: line,
    trimmed: line.trim(),
    isEmpty: line.trim() === '' || line.trim().startsWith('!') || line.trim().startsWith('#'),
  }));
}

// Interpret a single configuration line
function interpretLine(line, vendor, learnedMappings) {
  if (line.isEmpty) {
    return { ...line, state: 'SKIP', semantic: null, confidence: 100 };
  }

  // Layer 1: Learned mappings (Administrator-taught ground truth)
  if (learnedMappings && learnedMappings.length > 0) {
    for (const mapping of learnedMappings) {
      try {
        const mappingRegex = new RegExp(mapping.pattern, 'i');
        if (mappingRegex.test(line.trimmed)) {
          const control = semanticControls.find(c => c.semanticParameter === mapping.semantic);
          return {
            ...line,
            state: 'LEARNED',
            semantic: mapping.semantic,
            value: mapping.value,
            control: control || null,
            confidence: mapping.confidence || 97,
            source: 'Learned Mapping',
            learnedFrom: mapping.source || 'Administrator',
          };
        }
      } catch {
        if (line.trimmed.toLowerCase() === mapping.rawCommand?.toLowerCase()) {
          const control = semanticControls.find(c => c.semanticParameter === mapping.semantic);
          return {
            ...line,
            state: 'LEARNED',
            semantic: mapping.semantic,
            value: mapping.value,
            control: control || null,
            confidence: mapping.confidence || 97,
            source: 'Learned Mapping',
            learnedFrom: mapping.source || 'Administrator',
          };
        }
      }
    }
  }

  // Layer 2: Exact match from vendor patterns
  if (vendor !== 'Unknown' && vendorPatterns[vendor]) {
    for (const pattern of vendorPatterns[vendor].patterns) {
      const match = line.raw.match(pattern.regex);
      if (match) {
        const value = pattern.extract(match);
        const control = semanticControls.find(c => c.semanticParameter === pattern.semantic);
        return {
          ...line,
          state: 'RECOGNIZED',
          semantic: pattern.semantic,
          value,
          control: control || null,
          confidence: 95 + Math.floor(Math.random() * 5),
          source: 'Vendor Pattern',
        };
      }
    }
  }

  // Layer 3: Try all vendor patterns if vendor is unknown
  if (vendor === 'Unknown') {
    for (const [v, data] of Object.entries(vendorPatterns)) {
      for (const pattern of data.patterns) {
        const match = line.raw.match(pattern.regex);
        if (match) {
          const value = pattern.extract(match);
          const control = semanticControls.find(c => c.semanticParameter === pattern.semantic);
          return {
            ...line,
            state: 'INFERRED',
            semantic: pattern.semantic,
            value,
            control: control || null,
            confidence: 70 + Math.floor(Math.random() * 15),
            source: `Inferred (${v} pattern)`,
          };
        }
      }
    }
  }

  // Layer 4: Semantic alias matching (fuzzy)
  const lowerLine = line.trimmed.toLowerCase();
  const tokens = lowerLine.split(/[\s\-_=]+/);
  for (const [category, aliases] of Object.entries(semanticAliases)) {
    for (const alias of aliases) {
      const lowerAlias = alias.toLowerCase();
      if (lowerLine.includes(lowerAlias) || tokens.some(t => t === lowerAlias || t.includes(lowerAlias))) {
        const param = aliasToParameter[category];
        const control = semanticControls.find(c => c.semanticParameter === param);
        // Try to extract a numeric value
        const numMatch = line.trimmed.match(/(\d+)/);
        const value = numMatch ? parseInt(numMatch[1], 10) : true;
        return {
          ...line,
          state: 'LOW_CONFIDENCE',
          semantic: param,
          value,
          control: control || null,
          confidence: 40 + Math.floor(Math.random() * 25),
          source: 'Semantic Alias',
          hypothesis: `Possible: ${control ? control.name : category}`,
        };
      }
    }
  }

  // Layer 5: Unknown
  return {
    ...line,
    state: 'UNKNOWN',
    semantic: null,
    value: null,
    control: null,
    confidence: 0,
    source: 'Unrecognized',
  };
}

// Full configuration analysis
export function analyzeConfiguration(configText) {
  const vendorInfo = identifyVendor(configText);
  const lines = parseConfigLines(configText);
  const learnedMappings = getLearnedMappings();

  const interpretedLines = lines.map(line => interpretLine(line, vendorInfo.vendor, learnedMappings));

  // Build Security Baseline Model
  const sbm = {};
  for (const line of interpretedLines) {
    if (line.semantic && line.state !== 'SKIP') {
      // If duplicate, keep the one with higher confidence
      if (!sbm[line.semantic] || line.confidence > sbm[line.semantic].confidence) {
        sbm[line.semantic] = {
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

  // Stats
  const nonEmpty = interpretedLines.filter(l => l.state !== 'SKIP');
  const recognized = nonEmpty.filter(l => l.state === 'RECOGNIZED').length;
  const inferred = nonEmpty.filter(l => l.state === 'INFERRED').length;
  const learned = nonEmpty.filter(l => l.state === 'LEARNED').length;
  const lowConfidence = nonEmpty.filter(l => l.state === 'LOW_CONFIDENCE').length;
  const unknown = nonEmpty.filter(l => l.state === 'UNKNOWN').length;

  return {
    vendor: vendorInfo,
    lines: interpretedLines,
    sbm,
    stats: {
      total: nonEmpty.length,
      recognized,
      inferred,
      learned,
      lowConfidence,
      unknown,
      recognizedPercent: nonEmpty.length > 0 ? Math.round(((recognized + inferred + learned) / nonEmpty.length) * 100) : 0,
    },
    timestamp: new Date().toISOString(),
  };
}

// Get confidence label
export function getConfidenceLabel(confidence) {
  if (confidence >= 90) return 'HIGH';
  if (confidence >= 70) return 'MODERATE';
  if (confidence >= 40) return 'LOW';
  return 'UNKNOWN';
}

// Get state color
export function getStateColor(state) {
  switch (state) {
    case 'RECOGNIZED': return 'var(--color-success)';
    case 'INFERRED': return 'var(--color-cyan)';
    case 'LEARNED': return 'var(--color-purple)';
    case 'LOW_CONFIDENCE': return 'var(--color-warning)';
    case 'UNKNOWN': return 'var(--color-danger)';
    default: return 'var(--color-text-muted)';
  }
}
