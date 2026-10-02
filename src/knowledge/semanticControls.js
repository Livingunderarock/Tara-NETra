// TĀRĀ-NETRA Security Semantic Controls Database
// Maps vendor-neutral security concepts to framework requirements

export const semanticControls = [
  {
    id: 'SSH-001',
    name: 'SSH Protocol Enabled',
    category: 'Administrative Access',
    severity: 'HIGH',
    semanticParameter: 'ssh_enabled',
    expectedValue: true,
    description: 'Secure Shell (SSH) must be enabled for encrypted remote management.',
    frameworks: {
      CIS: 'CIS 1.1.1 – Enable SSH for remote management',
      NIST: 'NIST AC-17 – Remote Access',
      STIG: 'SRG-APP-000142 – Encrypted remote access',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'ip ssh version 2\nline vty 0 4\n transport input ssh',
      'FortiOS': 'config system global\n set admin-ssh-port 22\nend',
      'JunOS': 'set system services ssh',
      'Generic': 'Enable SSH service and disable Telnet'
    },
    verification: {
      'Cisco IOS': 'show ip ssh',
      'FortiOS': 'get system global | grep ssh',
      'JunOS': 'show system services',
      'Generic': 'Verify SSH service status'
    }
  },
  {
    id: 'SSH-002',
    name: 'SSH Protocol Version 2',
    category: 'Administrative Access',
    severity: 'HIGH',
    semanticParameter: 'ssh_version',
    expectedValue: 2,
    description: 'SSH must use version 2. SSH v1 is cryptographically weak.',
    frameworks: {
      CIS: 'CIS 1.1.2 – Set SSH version 2',
      NIST: 'NIST SC-8 – Transmission Confidentiality',
      STIG: 'SRG-APP-000142 – SSH v2 requirement',
      ISO: 'ISO A.10.1.1 – Cryptographic controls'
    },
    remediation: {
      'Cisco IOS': 'ip ssh version 2',
      'FortiOS': 'config system global\n set admin-ssh-v1 disable\nend',
      'JunOS': 'set system services ssh protocol-version v2',
      'Generic': 'Set SSH protocol version to 2'
    },
    verification: {
      'Cisco IOS': 'show ip ssh | include version',
      'Generic': 'Verify SSH version configuration'
    }
  },
  {
    id: 'TEL-001',
    name: 'Telnet Disabled',
    category: 'Administrative Access',
    severity: 'HIGH',
    semanticParameter: 'telnet_enabled',
    expectedValue: false,
    description: 'Telnet sends credentials in cleartext and must be disabled.',
    frameworks: {
      CIS: 'CIS 1.1.3 – Disable Telnet',
      NIST: 'NIST AC-17(2) – Protection of Remote Access',
      STIG: 'SRG-APP-000142 – Disable insecure protocols',
      ISO: 'ISO A.13.1.1 – Network security controls'
    },
    remediation: {
      'Cisco IOS': 'no service telnet\nline vty 0 4\n transport input ssh',
      'FortiOS': 'config system global\n set admin-telnet disable\nend',
      'JunOS': 'delete system services telnet',
      'Generic': 'Disable Telnet service entirely'
    },
    verification: {
      'Cisco IOS': 'show running-config | include telnet',
      'Generic': 'Verify Telnet is not listening'
    }
  },
  {
    id: 'HTTP-001',
    name: 'HTTP Management Disabled',
    category: 'Administrative Access',
    severity: 'MEDIUM',
    semanticParameter: 'http_management',
    expectedValue: false,
    description: 'Unencrypted HTTP management interface must be disabled.',
    frameworks: {
      CIS: 'CIS 1.1.4 – Disable HTTP management',
      NIST: 'NIST SC-8 – Transmission Confidentiality',
      STIG: 'SRG-APP-000142 – Encrypted management',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'no ip http server',
      'FortiOS': 'config system global\n set admin-http disable\nend',
      'Generic': 'Disable HTTP management interface'
    },
    verification: {
      'Cisco IOS': 'show running-config | include ip http server',
      'Generic': 'Verify HTTP management is disabled'
    }
  },
  {
    id: 'HTTPS-001',
    name: 'HTTPS Management Enabled',
    category: 'Administrative Access',
    severity: 'MEDIUM',
    semanticParameter: 'https_management',
    expectedValue: true,
    description: 'HTTPS must be enabled for secure web-based management.',
    frameworks: {
      CIS: 'CIS 1.1.5 – Enable HTTPS management',
      NIST: 'NIST SC-8 – Transmission Confidentiality',
      STIG: 'SRG-APP-000142 – Encrypted management',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'ip http secure-server',
      'FortiOS': 'config system global\n set admin-https enable\nend',
      'Generic': 'Enable HTTPS management interface'
    },
    verification: {
      'Cisco IOS': 'show running-config | include ip http secure',
      'Generic': 'Verify HTTPS management is active'
    }
  },
  {
    id: 'MGMT-001',
    name: 'Management Access Restriction',
    category: 'Administrative Access',
    severity: 'HIGH',
    semanticParameter: 'mgmt_acl',
    expectedValue: true,
    description: 'Management access must be restricted to authorized sources.',
    frameworks: {
      CIS: 'CIS 1.2.1 – Restrict management access',
      NIST: 'NIST AC-3 – Access Enforcement',
      STIG: 'SRG-APP-000142 – Management plane filtering',
      ISO: 'ISO A.9.1.2 – Access to networks'
    },
    remediation: {
      'Cisco IOS': 'access-list 10 permit 10.0.0.0 0.0.0.255\nline vty 0 4\n access-class 10 in',
      'FortiOS': 'config system interface\n set allowaccess ping https ssh\nend',
      'Generic': 'Apply ACL to management interfaces'
    },
    verification: {
      'Cisco IOS': 'show running-config | section line vty',
      'Generic': 'Verify management ACL applied'
    }
  },
  {
    id: 'SESS-001',
    name: 'Session Timeout',
    category: 'Administrative Access',
    severity: 'MEDIUM',
    semanticParameter: 'session_timeout',
    expectedValue: { max: 900 },
    description: 'Administrative sessions must have an idle timeout ≤ 900 seconds.',
    frameworks: {
      CIS: 'CIS 1.2.2 – Set session timeout',
      NIST: 'NIST AC-12 – Session Termination',
      STIG: 'SRG-APP-000190 – Session timeout',
      ISO: 'ISO A.11.2.8 – Unattended equipment'
    },
    remediation: {
      'Cisco IOS': 'line con 0\n exec-timeout 15 0\nline vty 0 4\n exec-timeout 15 0',
      'FortiOS': 'config system global\n set admintimeout 15\nend',
      'JunOS': 'set system login idle-timeout 15',
      'Generic': 'Set session idle timeout to 15 minutes or less'
    },
    verification: {
      'Cisco IOS': 'show running-config | include exec-timeout',
      'Generic': 'Verify session timeout value'
    }
  },
  {
    id: 'AAA-001',
    name: 'AAA Enabled',
    category: 'Authentication',
    severity: 'HIGH',
    semanticParameter: 'aaa_enabled',
    expectedValue: true,
    description: 'Authentication, Authorization, and Accounting must be enabled.',
    frameworks: {
      CIS: 'CIS 2.1.1 – Enable AAA',
      NIST: 'NIST IA-2 – Identification and Authentication',
      STIG: 'SRG-APP-000148 – AAA requirement',
      ISO: 'ISO A.9.2.1 – User registration'
    },
    remediation: {
      'Cisco IOS': 'aaa new-model\naaa authentication login default local',
      'FortiOS': 'config user local\nend',
      'Generic': 'Enable AAA authentication services'
    },
    verification: {
      'Cisco IOS': 'show running-config | include aaa',
      'Generic': 'Verify AAA configuration'
    }
  },
  {
    id: 'PWD-001',
    name: 'Password Minimum Length',
    category: 'Authentication',
    severity: 'HIGH',
    semanticParameter: 'password_min_length',
    expectedValue: { min: 8 },
    description: 'Passwords must have a minimum length of 8 characters.',
    frameworks: {
      CIS: 'CIS 2.1.2 – Password minimum length',
      NIST: 'NIST IA-5 – Authenticator Management',
      STIG: 'SRG-APP-000164 – Password complexity',
      ISO: 'ISO A.9.4.3 – Password management'
    },
    remediation: {
      'Cisco IOS': 'security passwords min-length 8',
      'FortiOS': 'config system password-policy\n set min-length 8\nend',
      'Generic': 'Set minimum password length to 8 or greater'
    },
    verification: {
      'Cisco IOS': 'show running-config | include min-length',
      'Generic': 'Verify password policy'
    }
  },
  {
    id: 'PWD-002',
    name: 'Login Lockout',
    category: 'Authentication',
    severity: 'HIGH',
    semanticParameter: 'login_lockout',
    expectedValue: true,
    description: 'Accounts must lock after repeated failed login attempts.',
    frameworks: {
      CIS: 'CIS 2.1.3 – Login failure lockout',
      NIST: 'NIST AC-7 – Unsuccessful Logon Attempts',
      STIG: 'SRG-APP-000065 – Account lockout',
      ISO: 'ISO A.9.4.2 – Secure log-on'
    },
    remediation: {
      'Cisco IOS': 'login block-for 120 attempts 3 within 60',
      'FortiOS': 'config system global\n set admin-lockout-threshold 3\n set admin-lockout-duration 120\nend',
      'Generic': 'Configure login failure lockout policy'
    },
    verification: {
      'Cisco IOS': 'show login',
      'Generic': 'Verify lockout configuration'
    }
  },
  {
    id: 'PWD-003',
    name: 'Privileged Account Protection',
    category: 'Authentication',
    severity: 'HIGH',
    semanticParameter: 'enable_secret',
    expectedValue: true,
    description: 'Privileged EXEC mode must be protected with an encrypted secret.',
    frameworks: {
      CIS: 'CIS 2.2.1 – Enable secret',
      NIST: 'NIST IA-5 – Authenticator Management',
      STIG: 'SRG-APP-000164 – Privileged access',
      ISO: 'ISO A.9.2.3 – Privileged access management'
    },
    remediation: {
      'Cisco IOS': 'enable algorithm-type scrypt secret <password>',
      'FortiOS': 'config system admin\n edit admin\n set password <password>\nend',
      'Generic': 'Set encrypted privileged access password'
    },
    verification: {
      'Cisco IOS': 'show running-config | include enable secret',
      'Generic': 'Verify privileged access protection'
    }
  },
  {
    id: 'LOG-001',
    name: 'Syslog Enabled',
    category: 'Monitoring',
    severity: 'MEDIUM',
    semanticParameter: 'syslog_enabled',
    expectedValue: true,
    description: 'System logging must be enabled and sent to a central syslog server.',
    frameworks: {
      CIS: 'CIS 3.1.1 – Enable syslog',
      NIST: 'NIST AU-2 – Audit Events',
      STIG: 'SRG-APP-000089 – Audit logging',
      ISO: 'ISO A.12.4.1 – Event logging'
    },
    remediation: {
      'Cisco IOS': 'logging host 10.0.0.100\nlogging trap informational',
      'FortiOS': 'config log syslogd setting\n set status enable\n set server 10.0.0.100\nend',
      'JunOS': 'set system syslog host 10.0.0.100 any info',
      'Generic': 'Configure syslog to remote server'
    },
    verification: {
      'Cisco IOS': 'show logging',
      'Generic': 'Verify syslog configuration'
    }
  },
  {
    id: 'LOG-002',
    name: 'Administrative Logging',
    category: 'Monitoring',
    severity: 'MEDIUM',
    semanticParameter: 'admin_logging',
    expectedValue: true,
    description: 'All administrative actions must be logged.',
    frameworks: {
      CIS: 'CIS 3.1.2 – Log administrative actions',
      NIST: 'NIST AU-12 – Audit Generation',
      STIG: 'SRG-APP-000089 – Administrative logging',
      ISO: 'ISO A.12.4.3 – Administrator logs'
    },
    remediation: {
      'Cisco IOS': 'archive\n log config\n  logging enable\n  notify syslog',
      'FortiOS': 'config log setting\n set log-admin-activity enable\nend',
      'Generic': 'Enable administrative action logging'
    },
    verification: {
      'Cisco IOS': 'show archive log config all',
      'Generic': 'Verify admin logging enabled'
    }
  },
  {
    id: 'LOG-003',
    name: 'Authentication Logging',
    category: 'Monitoring',
    severity: 'MEDIUM',
    semanticParameter: 'auth_logging',
    expectedValue: true,
    description: 'Authentication events (success/failure) must be logged.',
    frameworks: {
      CIS: 'CIS 3.1.3 – Log authentication events',
      NIST: 'NIST AU-2 – Audit Events',
      STIG: 'SRG-APP-000089 – Authentication logging',
      ISO: 'ISO A.12.4.1 – Event logging'
    },
    remediation: {
      'Cisco IOS': 'login on-failure log\nlogin on-success log',
      'FortiOS': 'config log setting\n set log-auth-event enable\nend',
      'Generic': 'Enable authentication event logging'
    },
    verification: {
      'Cisco IOS': 'show running-config | include login on-',
      'Generic': 'Verify auth logging configuration'
    }
  },
  {
    id: 'NTP-001',
    name: 'NTP Enabled',
    category: 'Time',
    severity: 'MEDIUM',
    semanticParameter: 'ntp_enabled',
    expectedValue: true,
    description: 'Network Time Protocol must be enabled for log correlation.',
    frameworks: {
      CIS: 'CIS 4.1.1 – Enable NTP',
      NIST: 'NIST AU-8 – Time Stamps',
      STIG: 'SRG-APP-000116 – Time synchronization',
      ISO: 'ISO A.12.4.4 – Clock synchronization'
    },
    remediation: {
      'Cisco IOS': 'ntp server 10.0.0.1',
      'FortiOS': 'config system ntp\n set ntpsync enable\n set server-mode enable\nend',
      'JunOS': 'set system ntp server 10.0.0.1',
      'Generic': 'Configure NTP server'
    },
    verification: {
      'Cisco IOS': 'show ntp status',
      'Generic': 'Verify NTP synchronization'
    }
  },
  {
    id: 'NTP-002',
    name: 'Approved NTP Source',
    category: 'Time',
    severity: 'LOW',
    semanticParameter: 'ntp_auth',
    expectedValue: true,
    description: 'NTP should use authenticated, approved time sources.',
    frameworks: {
      CIS: 'CIS 4.1.2 – NTP authentication',
      NIST: 'NIST AU-8 – Time Stamps',
      STIG: 'SRG-APP-000116 – NTP authentication',
      ISO: 'ISO A.12.4.4 – Clock synchronization'
    },
    remediation: {
      'Cisco IOS': 'ntp authenticate\nntp authentication-key 1 md5 <key>\nntp trusted-key 1',
      'Generic': 'Enable NTP authentication'
    },
    verification: {
      'Cisco IOS': 'show ntp associations detail',
      'Generic': 'Verify NTP authentication'
    }
  },
  {
    id: 'PROTO-001',
    name: 'Insecure Protocols Disabled',
    category: 'Network Security',
    severity: 'HIGH',
    semanticParameter: 'insecure_protocols',
    expectedValue: false,
    description: 'Insecure protocols (Telnet, FTP, TFTP, HTTP) must be disabled.',
    frameworks: {
      CIS: 'CIS 5.1.1 – Disable insecure protocols',
      NIST: 'NIST CM-7 – Least Functionality',
      STIG: 'SRG-APP-000142 – Disable insecure services',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'no service telnet\nno ip ftp server\nno service pad',
      'Generic': 'Disable all insecure management protocols'
    },
    verification: {
      'Cisco IOS': 'show running-config | include service',
      'Generic': 'Verify insecure protocols are disabled'
    }
  },
  {
    id: 'CRYPTO-001',
    name: 'Strong Encryption Required',
    category: 'Network Security',
    severity: 'HIGH',
    semanticParameter: 'strong_encryption',
    expectedValue: true,
    description: 'Only strong encryption algorithms should be permitted.',
    frameworks: {
      CIS: 'CIS 5.2.1 – Strong encryption',
      NIST: 'NIST SC-13 – Cryptographic Protection',
      STIG: 'SRG-APP-000179 – Approved encryption',
      ISO: 'ISO A.10.1.1 – Cryptographic controls'
    },
    remediation: {
      'Cisco IOS': 'ip ssh server algorithm encryption aes256-ctr aes128-ctr',
      'Generic': 'Configure strong cipher suites only'
    },
    verification: {
      'Cisco IOS': 'show ip ssh | include Encryption',
      'Generic': 'Verify encryption algorithms'
    }
  },
  {
    id: 'ACL-001',
    name: 'Access Control Lists Present',
    category: 'Network Security',
    severity: 'HIGH',
    semanticParameter: 'acl_present',
    expectedValue: true,
    description: 'Access Control Lists must be configured for traffic filtering.',
    frameworks: {
      CIS: 'CIS 5.3.1 – Configure ACLs',
      NIST: 'NIST AC-4 – Information Flow Enforcement',
      STIG: 'SRG-APP-000038 – Access control',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'access-list 100 deny ip any any log',
      'FortiOS': 'config firewall policy\nend',
      'Generic': 'Configure traffic filtering ACLs'
    },
    verification: {
      'Cisco IOS': 'show access-lists',
      'Generic': 'Verify ACL configuration'
    }
  },
  {
    id: 'SVC-001',
    name: 'Unused Services Disabled',
    category: 'Services',
    severity: 'MEDIUM',
    semanticParameter: 'unused_services',
    expectedValue: false,
    description: 'Unused and unnecessary services must be disabled.',
    frameworks: {
      CIS: 'CIS 6.1.1 – Disable unused services',
      NIST: 'NIST CM-7 – Least Functionality',
      STIG: 'SRG-APP-000141 – Minimize functionality',
      ISO: 'ISO A.12.6.2 – Restrictions on software'
    },
    remediation: {
      'Cisco IOS': 'no service pad\nno service finger\nno service udp-small-servers\nno service tcp-small-servers\nno ip bootp server\nno ip finger\nno ip source-route\nno cdp run',
      'Generic': 'Disable all unnecessary services'
    },
    verification: {
      'Cisco IOS': 'show running-config | include service',
      'Generic': 'Verify service inventory'
    }
  },
  {
    id: 'BANNER-001',
    name: 'Login Banner Configured',
    category: 'Administrative Access',
    severity: 'LOW',
    semanticParameter: 'login_banner',
    expectedValue: true,
    description: 'A legal notice or warning banner must be displayed before login.',
    frameworks: {
      CIS: 'CIS 1.3.1 – Set login banner',
      NIST: 'NIST AC-8 – System Use Notification',
      STIG: 'SRG-APP-000068 – Login banner',
      ISO: 'ISO A.9.1.1 – Access control policy'
    },
    remediation: {
      'Cisco IOS': 'banner login ^ Authorized Access Only ^',
      'FortiOS': 'config system global\n set pre-login-banner enable\nend',
      'Generic': 'Configure authorized access warning banner'
    },
    verification: {
      'Cisco IOS': 'show running-config | include banner',
      'Generic': 'Verify login banner'
    }
  },
  {
    id: 'SNMP-001',
    name: 'SNMP Community Strings Changed',
    category: 'Services',
    severity: 'HIGH',
    semanticParameter: 'snmp_default_community',
    expectedValue: false,
    description: 'Default SNMP community strings (public/private) must be changed.',
    frameworks: {
      CIS: 'CIS 6.2.1 – Change SNMP defaults',
      NIST: 'NIST IA-5 – Authenticator Management',
      STIG: 'SRG-APP-000142 – Default credentials',
      ISO: 'ISO A.9.4.3 – Password management'
    },
    remediation: {
      'Cisco IOS': 'no snmp-server community public\nno snmp-server community private\nsnmp-server community <custom> RO',
      'Generic': 'Remove default SNMP community strings'
    },
    verification: {
      'Cisco IOS': 'show snmp community',
      'Generic': 'Verify SNMP community strings'
    }
  },
  {
    id: 'SVC-002',
    name: 'CDP/LLDP Restricted',
    category: 'Services',
    severity: 'LOW',
    semanticParameter: 'cdp_restricted',
    expectedValue: true,
    description: 'Discovery protocols should be disabled on external interfaces.',
    frameworks: {
      CIS: 'CIS 6.3.1 – Restrict CDP/LLDP',
      NIST: 'NIST CM-7 – Least Functionality',
      STIG: 'SRG-APP-000142 – Minimize information disclosure',
      ISO: 'ISO A.13.1.1 – Network controls'
    },
    remediation: {
      'Cisco IOS': 'no cdp run\ninterface GigabitEthernet0/0\n no cdp enable',
      'Generic': 'Disable discovery protocols on external-facing interfaces'
    },
    verification: {
      'Cisco IOS': 'show cdp',
      'Generic': 'Verify CDP/LLDP status'
    }
  },
  {
    id: 'ENCRYPT-001',
    name: 'Password Encryption Service',
    category: 'Authentication',
    severity: 'HIGH',
    semanticParameter: 'password_encryption',
    expectedValue: true,
    description: 'Password encryption service must be enabled to protect stored credentials.',
    frameworks: {
      CIS: 'CIS 2.3.1 – Enable password encryption',
      NIST: 'NIST IA-5 – Authenticator Management',
      STIG: 'SRG-APP-000164 – Encrypted credentials',
      ISO: 'ISO A.10.1.1 – Cryptographic controls'
    },
    remediation: {
      'Cisco IOS': 'service password-encryption',
      'FortiOS': 'config system global\n set strong-crypto enable\nend',
      'Generic': 'Enable password encryption service'
    },
    verification: {
      'Cisco IOS': 'show running-config | include service password',
      'Generic': 'Verify password encryption'
    }
  }
];

export const frameworkInfo = {
  CIS: {
    name: 'CIS Benchmarks',
    fullName: 'Center for Internet Security Benchmarks',
    description: 'Industry-accepted system hardening standards',
    color: '#00E5FF'
  },
  NIST: {
    name: 'NIST SP 800-53',
    fullName: 'NIST Special Publication 800-53 Rev. 5',
    description: 'Security and Privacy Controls for Information Systems',
    color: '#7C4DFF'
  },
  STIG: {
    name: 'DISA STIGs',
    fullName: 'Defense Information Systems Agency Security Technical Implementation Guides',
    description: 'DoD security configuration standards',
    color: '#FF6D00'
  },
  ISO: {
    name: 'ISO 27001',
    fullName: 'ISO/IEC 27001:2022',
    description: 'International information security management standard',
    color: '#00E676'
  }
};

export const categories = [
  'Administrative Access',
  'Authentication',
  'Monitoring',
  'Time',
  'Network Security',
  'Services'
];
