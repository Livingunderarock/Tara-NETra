// TĀRĀ Intelligence Core — Generalized Pattern Synthesis & Matching Engine
// Bridges raw vendor CLI syntaxes to the Security Baseline Model (SBM)
// Synthesizes generalized parameterized patterns (e.g. "command <VALUE>")
// and extracts dynamic values from previously unseen configurations.

import { semanticControls } from '../knowledge/semanticControls.js';

/**
 * Maps common high-level concept aliases to their canonical SBM semanticParameter
 */
export const CONCEPT_TO_SEMANTIC_PARAM = {
  'ADMIN_SESSION_TIMEOUT': 'session_timeout',
  'SESSION_TIMEOUT': 'session_timeout',
  'LOGIN_MAX_RETRIES': 'login_lockout',
  'ACCOUNT_LOCKOUT': 'login_lockout',
  'LOGIN_LOCKOUT': 'login_lockout',
  'PASSWORD_MIN_LENGTH': 'password_min_length',
  'MIN_PASSWORD_LENGTH': 'password_min_length',
  'SSH_V2_ENFORCED': 'ssh_version',
  'SSH_VERSION_2': 'ssh_version',
  'SSH_ENABLED': 'ssh_enabled',
  'TELNET_DISABLED': 'telnet_enabled',
  'DISABLE_TELNET': 'telnet_enabled',
  'HTTP_DISABLED': 'http_management',
  'HTTPS_ENABLED': 'https_management',
  'LOGIN_BANNER_CONFIGURED': 'login_banner',
  'BANNER_LEGAL': 'login_banner',
  'STRONG_ENCRYPTION_CIPHERS': 'strong_encryption',
  'NTP_SERVER_CONFIGURED': 'ntp_enabled',
  'NTP_AUTH_ENABLED': 'ntp_auth',
  'REMOTE_SYSLOG_ENABLED': 'syslog_enabled',
  'ADMIN_LOGGING_ENABLED': 'admin_logging',
  'AUTH_LOGGING_ENABLED': 'auth_logging',
  'ACL_EXPLICIT_DENY_LOGGED': 'acl_present',
  'MANAGEMENT_ACCESS_FILTER': 'mgmt_acl',
};

/**
 * Resolves a semantic identifier (either canonical param or uppercase concept alias)
 * to both the canonical semanticParameter and the corresponding semanticControl object.
 */
export function resolveSemanticBinding(identifier) {
  if (!identifier) return { semanticParam: 'unknown_parameter', control: null };

  // 1. Direct check against semanticControls semanticParameter
  let control = semanticControls.find(c => c.semanticParameter === identifier);
  if (control) {
    return { semanticParam: identifier, control };
  }

  // 2. Check concept alias mapping
  const canonicalParam = CONCEPT_TO_SEMANTIC_PARAM[identifier];
  if (canonicalParam) {
    control = semanticControls.find(c => c.semanticParameter === canonicalParam);
    if (control) {
      return { semanticParam: canonicalParam, control };
    }
    return { semanticParam: canonicalParam, control: null };
  }

  // 3. Fallback check by control ID (e.g. SESS-001)
  control = semanticControls.find(c => c.id === identifier);
  if (control) {
    return { semanticParam: control.semanticParameter, control };
  }

  return { semanticParam: identifier, control: null };
}

/**
 * Synthesizes a generalized pattern with dynamic parameter extraction from a raw CLI command.
 * Transforms commands like "set secure-admin session-limit 900" into "set secure-admin session-limit <VALUE>"
 * with parameterized regex patterns for runtime extraction on unseen devices.
 */
export function synthesizeGeneralizedPattern(rawCommand, semanticIdentifier = null, explicitValue = null, deviceName = null) {
  const trimmed = (rawCommand || '').trim();
  const { semanticParam, control } = resolveSemanticBinding(semanticIdentifier);

  // Helper to escape regex special characters while preserving whitespace flexibility
  const escapePrefix = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');

  // Case 1: Command ending with or containing an explicit number
  // e.g., "set secure-admin session-limit 900", "password min-length 14"
  const numMatch = trimmed.match(/^(.+?)\s+(\d+)\s*$/);
  if (numMatch) {
    const prefix = numMatch[1].trim();
    const val = parseInt(numMatch[2], 10);
    const paramName = semanticParam.includes('timeout') ? 'TIMEOUT_SECONDS' :
                      semanticParam.includes('retries') || semanticParam.includes('lockout') ? 'ATTEMPTS' :
                      semanticParam.includes('length') ? 'CHARACTERS' : 'VALUE';
    const regexPattern = `^${escapePrefix(prefix)}\\s+(\\d+)$`;
    const extractedValue = explicitValue !== null && explicitValue !== undefined ? explicitValue : val;
    return {
      rawExample: trimmed,
      rawCommand: trimmed,
      learnedPattern: `${prefix} <${paramName}>`,
      regexPattern,
      pattern: regexPattern,
      parameter: paramName,
      parameterType: 'number',
      extractedValue,
      value: extractedValue,
      semantic: semanticParam,
      semanticControl: control?.name || semanticIdentifier || 'General Security Policy',
      controlName: control?.name || semanticIdentifier || 'General Security Policy',
      controlId: control?.id || null,
      category: control?.category || 'Administrative Access',
      source: 'HUMAN_TRAINED',
      originDevice: deviceName || 'Unknown Device',
      confidence: 97,
      timestamp: new Date().toISOString(),
    };
  }

  // Case 2: Command ending with an IPv4 address
  // e.g., "monitor syslog-server 10.4.100.50", "ntp server 10.1.100.10"
  const ipMatch = trimmed.match(/^(.+?)\s+(\d{1,3}(?:\.\d{1,3}){3})\s*$/);
  if (ipMatch) {
    const prefix = ipMatch[1].trim();
    const val = ipMatch[2];
    const regexPattern = `^${escapePrefix(prefix)}\\s+(\\d{1,3}(?:\\.\\d{1,3}){3})$`;
    return {
      rawExample: trimmed,
      rawCommand: trimmed,
      learnedPattern: `${prefix} <IP_ADDRESS>`,
      regexPattern,
      pattern: regexPattern,
      parameter: 'IP_ADDRESS',
      parameterType: 'ip',
      extractedValue: val,
      value: val,
      semantic: semanticParam,
      semanticControl: control?.name || semanticIdentifier || 'Network Service Endpoint',
      controlName: control?.name || semanticIdentifier || 'Network Service Endpoint',
      controlId: control?.id || null,
      category: control?.category || 'Monitoring & Logging',
      source: 'HUMAN_TRAINED',
      originDevice: deviceName || 'Unknown Device',
      confidence: 97,
      timestamp: new Date().toISOString(),
    };
  }

  // Case 3: Quoted banner, message, or legal text
  // e.g., banner-message "AUTHORIZED PERSONNEL ONLY"
  const strMatch = trimmed.match(/^(.+?)\s+"([^"]+)"\s*$/);
  if (strMatch) {
    const prefix = strMatch[1].trim();
    const val = strMatch[2];
    const regexPattern = `^${escapePrefix(prefix)}\\s+"([^"]+)"$`;
    return {
      rawExample: trimmed,
      rawCommand: trimmed,
      learnedPattern: `${prefix} "<TEXT>"`,
      regexPattern,
      pattern: regexPattern,
      parameter: 'TEXT',
      parameterType: 'string',
      extractedValue: val,
      value: val,
      semantic: semanticParam,
      semanticControl: control?.name || semanticIdentifier || 'Legal Notice Banner',
      controlName: control?.name || semanticIdentifier || 'Legal Notice Banner',
      controlId: control?.id || null,
      category: control?.category || 'Administrative Access',
      source: 'HUMAN_TRAINED',
      originDevice: deviceName || 'Unknown Device',
      confidence: 97,
      timestamp: new Date().toISOString(),
    };
  }

  // Case 4: Boolean or state keyword (enable/disable, permit/deny, true/false)
  // e.g., "security admin-access telnet disable", "time-sync ntp-auth enabled"
  const stateMatch = trimmed.match(/^(.+?)\s+(enable|enabled|disable|disabled|permit|deny|true|false)\s*$/i);
  if (stateMatch) {
    const prefix = stateMatch[1].trim();
    const stateStr = stateMatch[2].toLowerCase();
    const isPositive = ['enable', 'enabled', 'permit', 'true'].includes(stateStr);
    const regexPattern = `^${escapePrefix(prefix)}\\s+(enable|enabled|disable|disabled|permit|deny|true|false)$`;
    const extractedValue = explicitValue !== null && explicitValue !== undefined ? explicitValue : isPositive;
    return {
      rawExample: trimmed,
      rawCommand: trimmed,
      learnedPattern: `${prefix} <STATE>`,
      regexPattern,
      pattern: regexPattern,
      parameter: 'STATE',
      parameterType: 'state',
      extractedValue,
      value: extractedValue,
      semantic: semanticParam,
      semanticControl: control?.name || semanticIdentifier || 'Administrative Toggle',
      controlName: control?.name || semanticIdentifier || 'Administrative Toggle',
      controlId: control?.id || null,
      category: control?.category || 'Administrative Access',
      source: 'HUMAN_TRAINED',
      originDevice: deviceName || 'Unknown Device',
      confidence: 97,
      timestamp: new Date().toISOString(),
    };
  }

  // Case 5: Single trailing token / mode keyword
  const tokenMatch = trimmed.match(/^(.+?)\s+(\S+)\s*$/);
  if (tokenMatch && !trimmed.startsWith('!')) {
    const prefix = tokenMatch[1].trim();
    const token = tokenMatch[2];
    const regexPattern = `^${escapePrefix(prefix)}\\s+(\\S+)$`;
    const extractedValue = explicitValue !== null && explicitValue !== undefined ? explicitValue : token;
    return {
      rawExample: trimmed,
      rawCommand: trimmed,
      learnedPattern: `${prefix} <VALUE>`,
      regexPattern,
      pattern: regexPattern,
      parameter: 'VALUE',
      parameterType: 'token',
      extractedValue,
      value: extractedValue,
      semantic: semanticParam,
      semanticControl: control?.name || semanticIdentifier || 'Policy Directive',
      controlName: control?.name || semanticIdentifier || 'Policy Directive',
      controlId: control?.id || null,
      category: control?.category || 'General',
      source: 'HUMAN_TRAINED',
      originDevice: deviceName || 'Unknown Device',
      confidence: 97,
      timestamp: new Date().toISOString(),
    };
  }

  // Case 6: Exact directive without variable parameters
  const regexPattern = `^${escapePrefix(trimmed)}$`;
  const extractedValue = explicitValue !== null && explicitValue !== undefined ? explicitValue : true;
  return {
    rawExample: trimmed,
    rawCommand: trimmed,
    learnedPattern: trimmed,
    regexPattern,
    pattern: regexPattern,
    parameter: null,
    parameterType: 'exact',
    extractedValue,
    value: extractedValue,
    semantic: semanticParam,
    semanticControl: control?.name || semanticIdentifier || 'Standard Security Directive',
    controlName: control?.name || semanticIdentifier || 'Standard Security Directive',
    controlId: control?.id || null,
    category: control?.category || 'General',
    source: 'HUMAN_TRAINED',
    originDevice: deviceName || 'Unknown Device',
    confidence: 97,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Matches an arbitrary CLI line from ANY device against a learned mapping.
 * Dynamically extracts parameters and determines if this represents an unseen variant.
 */
export function matchLearnedPattern(lineText, mapping) {
  if (!lineText || !mapping) return null;
  const trimmed = lineText.trim();
  if (!trimmed) return null;

  try {
    const patternStr = mapping.regexPattern || mapping.pattern;
    const regex = new RegExp(patternStr, 'i');
    const match = trimmed.match(regex);

    if (match) {
      let extractedValue = mapping.extractedValue !== undefined ? mapping.extractedValue : mapping.value;

      // If regex captured a parameter group, dynamically extract and coerce it!
      if (match[1] !== undefined) {
        const rawParam = match[1];
        if (mapping.parameterType === 'number') {
          const num = parseInt(rawParam, 10);
          if (!isNaN(num)) extractedValue = num;
        } else if (mapping.parameterType === 'state') {
          const lower = rawParam.toLowerCase();
          extractedValue = ['enable', 'enabled', 'permit', 'true'].includes(lower);
        } else {
          extractedValue = rawParam;
        }
      }

      // Check whether this line is from an unseen device / different parameter
      const isUnseenVariant = mapping.rawExample && (trimmed.toLowerCase() !== mapping.rawExample.toLowerCase());

      return {
        matched: true,
        extractedValue,
        isUnseenVariant,
        learnedPattern: mapping.learnedPattern || mapping.rawExample,
        originalExample: mapping.rawExample,
        originDevice: mapping.originDevice,
        parameter: mapping.parameter,
        parameterType: mapping.parameterType,
        confidence: mapping.confidence || 97,
        source: 'TĀRĀ Memory',
        provenance: isUnseenVariant ? '✓ LEARNED PATTERN MATCH' : '✓ HUMAN LEARNED',
        explanation: isUnseenVariant
          ? `Pattern learned from ${mapping.originDevice || 'training'} (generalized from: "${mapping.rawExample}")`
          : `Direct administrator-taught ground truth from ${mapping.originDevice || 'TĀRĀ Memory'}`
      };
    }
  } catch {
    // Fallback: direct string comparison
    if (trimmed.toLowerCase() === mapping.rawCommand?.toLowerCase() || trimmed.toLowerCase() === mapping.rawExample?.toLowerCase()) {
      return {
        matched: true,
        extractedValue: mapping.extractedValue !== undefined ? mapping.extractedValue : mapping.value,
        isUnseenVariant: false,
        learnedPattern: mapping.learnedPattern || trimmed,
        originalExample: mapping.rawExample || trimmed,
        originDevice: mapping.originDevice,
        parameter: mapping.parameter,
        parameterType: mapping.parameterType || 'exact',
        confidence: mapping.confidence || 97,
        source: 'TĀRĀ Memory',
        provenance: '✓ HUMAN LEARNED',
        explanation: `Direct administrator-taught ground truth from ${mapping.originDevice || 'TĀRĀ Memory'}`
      };
    }
  }

  return null;
}
