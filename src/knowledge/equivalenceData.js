// Canonical Semantic Equivalence Data Matrix
// Demonstrates: One Security Intent, Many Vendor Configuration Syntaxes

export const EQUIVALENCE_DATA = [
  {
    id: 'ssh_v2',
    name: 'SSH Protocol Version 2',
    semanticMeaning: 'SSH_VERSION = 2',
    parameter: 'ssh_version',
    category: 'Administrative Access',
    description: 'Enforces cryptographically sound SSH v2, prohibiting deprecated, cleartext-prone v1 algorithms.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'ip ssh version 2', provenance: '◈ VENDOR PATTERN', confidence: 99 },
      { vendor: 'Fortinet FortiOS', raw: 'set admin-ssh-v1 disable', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'set system services ssh protocol-version v2', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'security admin-access ssh version 2', provenance: '✓ HUMAN LEARNED', confidence: 97, isLearned: true },
    ]
  },
  {
    id: 'telnet_disabled',
    name: 'Disable Insecure Telnet',
    semanticMeaning: 'TELNET_ENABLED = false',
    parameter: 'telnet_enabled',
    category: 'Management Plane Hardening',
    description: 'Prohibits unencrypted cleartext Telnet management protocol across all management lines.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'no service telnet\ntransport input ssh', provenance: '◈ VENDOR PATTERN', confidence: 99 },
      { vendor: 'Fortinet FortiOS', raw: 'set admin-telnet disable', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'delete system services telnet', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'security admin-access telnet disable\nservices disable telnet', provenance: '✓ HUMAN LEARNED', confidence: 97, isLearned: true },
    ]
  },
  {
    id: 'session_timeout',
    name: 'Administrative Session Timeout',
    semanticMeaning: 'SESSION_TIMEOUT = 900s (≤ 900s)',
    parameter: 'session_timeout',
    category: 'Administrative Access',
    description: 'Automatically disconnects idle administrative management sessions after 15 minutes of inactivity.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'exec-timeout 15 0', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Fortinet FortiOS', raw: 'set admintimeout 15', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'set system login idle-timeout 15', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'set secure-admin session-limit <VALUE>', provenance: '✓ LEARNED PATTERN MATCH', confidence: 97, isLearned: true, isGeneralized: true },
    ]
  },
  {
    id: 'remote_syslog',
    name: 'Centralized Remote Logging',
    semanticMeaning: 'SYSLOG_ENABLED = true',
    parameter: 'syslog_enabled',
    category: 'Audit & Accountability',
    description: 'Forwards administrative security event logs to an isolated centralized syslog collector.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'logging host 10.1.100.50', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Fortinet FortiOS', raw: 'config log syslogd setting\n  set server "10.2.100.50"', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'set system syslog host 10.3.100.50 any info', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'monitor syslog-server <IP_ADDRESS>', provenance: '✓ LEARNED PATTERN MATCH', confidence: 97, isLearned: true, isGeneralized: true },
    ]
  },
  {
    id: 'ntp_sync',
    name: 'NTP Time Synchronization',
    semanticMeaning: 'NTP_ENABLED = true',
    parameter: 'ntp_enabled',
    category: 'Audit & Accountability',
    description: 'Synchronizes system clocks with authenticated trusted enterprise time sources for forensic fidelity.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'ntp server 10.1.100.10', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Fortinet FortiOS', raw: 'config system ntp\n  set server "10.2.100.10"', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'set system ntp server 10.3.100.10', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'time-sync ntp-server <IP_ADDRESS>', provenance: '✓ LEARNED PATTERN MATCH', confidence: 97, isLearned: true, isGeneralized: true },
    ]
  },
  {
    id: 'login_banner',
    name: 'Legal Warning Login Banner',
    semanticMeaning: 'LOGIN_BANNER = true',
    parameter: 'login_banner',
    category: 'Administrative Access',
    description: 'Presents explicit legal warning notice prior to interactive authentication.',
    mappings: [
      { vendor: 'Cisco IOS', raw: 'banner motd ^C AUTHORIZED ACCESS ONLY ^C', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Fortinet FortiOS', raw: 'set pre-login-banner enable', provenance: '◈ VENDOR PATTERN', confidence: 95 },
      { vendor: 'Juniper Junos', raw: 'set system login message "AUTHORIZED ACCESS ONLY"', provenance: '◈ VENDOR PATTERN', confidence: 98 },
      { vendor: 'Unknown Vendor', raw: 'banner-message "<TEXT>"', provenance: '✓ LEARNED PATTERN MATCH', confidence: 97, isLearned: true, isGeneralized: true },
    ]
  }
];
