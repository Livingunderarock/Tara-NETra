# Tārā-NETra

## Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance

### The Guiding Eye for Network Security

**Understand. Learn. Audit. Assure.**

> **Core idea:** Different vendors speak different configuration
> languages. Tārā-NETra learns the security meaning behind them.

------------------------------------------------------------------------

# 1. Executive Summary

Tārā-NETra is a browser-based, vendor-agnostic network security
compliance engine designed to solve one of the hardest problems in
heterogeneous enterprise infrastructure: understanding security
configuration across different vendors, operating systems, configuration
syntaxes and security frameworks.

Instead of building a separate parser every time a new vendor or
unfamiliar configuration structure appears, Tārā-NETra uses an
AI-assisted interpretation layer, a vendor-neutral **Security Baseline
Model (SBM)** and a human-in-the-loop learning mechanism.

The central workflow is:

**UNKNOWN → EXPLAIN → TEACH → LEARN → VERIFY → AUDIT**

A user can upload one or multiple configuration files. Tārā-NETra
identifies recognizable security constructs, highlights unknown or
low-confidence commands, proposes their semantic meaning, and allows an
administrator to teach the system through a visual Training Studio.

Once taught, the semantic mapping is stored in the browser's local
knowledge base and immediately reused when the configuration is analyzed
again.

The result is not simply a compliance score. Tārā-NETra provides an
evidence chain:

**Raw CLI → Semantic Meaning → Security Control → Framework Requirement
→ Finding → Remediation → Verification**

This makes the system explainable, demonstrable and suitable for
audit-oriented workflows.

------------------------------------------------------------------------

# 2. Why Tārā-NETra?

Enterprise networks do not speak a single configuration language.

A security requirement such as:

> "Administrative access must use secure encrypted protocols."

may appear as completely different syntax across Cisco IOS, FortiOS,
Junos, cloud security groups or an unfamiliar vendor.

Traditional rule-based compliance tools often depend heavily on
vendor-specific parsers. When syntax changes or an unfamiliar vendor
appears, parser maintenance becomes a bottleneck.

Tārā-NETra changes the abstraction.

Instead of asking:

> "Which parser handles this vendor?"

it asks:

> "What security meaning does this configuration express?"

The system therefore separates:

1.  **Configuration syntax**
2.  **Semantic security meaning**
3.  **Compliance requirements**
4.  **Remediation instructions**

This separation allows new syntax to be learned without changing the
compliance engine itself.

------------------------------------------------------------------------

# 3. Problem Statement Alignment

The official challenge focuses on heterogeneous enterprise networks
containing:

-   Firewalls and SASE platforms
-   Routers and switches
-   White-box networking
-   Cloud-native security controls
-   Specialized networking infrastructure
-   Multiple vendors and OS/firmware versions

The requested system must address:

### Challenge A --- Syntactic Diversity

Different vendors use:

-   Proprietary CLI syntax
-   Hierarchical configuration structures
-   Different terminology
-   Different operating systems
-   Different firmware versions

### Challenge B --- Scalability and Adaptation

A practical compliance engine must adapt to:

-   New vendors
-   Unknown configuration structures
-   White-box networking
-   Cloud security groups
-   Specialized infrastructure
-   Evolving configuration syntax

### Tārā-NETra's response

  Challenge                     Tārā-NETra mechanism
  ----------------------------- --------------------------------------------
  Vendor-specific syntax        Semantic normalization
  Unknown commands              Confidence-aware interpretation
  New configuration structure   Human-in-the-loop Training Studio
  Repeated unknown syntax       Persistent browser knowledge base
  Multiple standards            Framework crosswalk
  Audit requirements            Evidence chain + PDF report
  New vendors                   Vendor-neutral semantic model
  Demo deployment               Static browser architecture + GitHub Pages

------------------------------------------------------------------------

# 4. The Tārā-NETra Experience

## 4.1 The visual identity

Tārā means **star** and **Netra** means **eye**.

The interface should therefore feel like a cyber-security command center
built around the concept of a **guiding eye**.

### Design language

-   Deep near-black background
-   Dark navy surfaces
-   White/soft-gray typography
-   Electric cyan for active intelligence
-   Star-gold/golden amber for the Tārā identity
-   Red for critical findings
-   Green for verified compliance
-   Purple/blue for learning and AI interpretation
-   Thin luminous borders
-   Subtle radial "eye" motifs
-   Minimal glass panels
-   Monospace configuration text
-   Clean technical diagrams

### Do NOT make it look like

-   A generic admin dashboard
-   A banking dashboard
-   A stock-market UI
-   A template SaaS dashboard
-   A neon cyberpunk gaming website

The visual style should be:

**Mission Control + Security Operations Center + Indian astronomical
symbolism**

------------------------------------------------------------------------

# 5. Brand System

## Product name

# Tārā-NETra

### Expansion

**Trustworthy Adaptive Risk Analytics --- Network Reasoning &
Assurance**

### Primary tagline

**The Guiding Eye for Network Security**

### Secondary tagline

**Understand. Learn. Audit. Assure.**

### Hero statement

> **Different vendors speak different configuration languages.
> Tārā-NETra learns the security meaning behind them.**

### Signature workflow

``` text
UNKNOWN
   ↓
EXPLAIN
   ↓
TEACH
   ↓
LEARN
   ↓
VERIFY
   ↓
AUDIT
```

### Signature product statement

> **A new vendor should not require a new parser deployment.**

------------------------------------------------------------------------

# 6. Website / Application Structure

The website should not behave like a static project showcase.

It should feel like a real security product.

## Main navigation

``` text
Tārā-NETra
────────────────────────────────────────
Overview
Analyze
Training Studio
Knowledge
Compliance
Findings
Remediation
Evidence
System
```

------------------------------------------------------------------------

# 7. Landing / Overview Screen

The first screen should immediately communicate the innovation.

## Hero

``` text
Tārā-NETra

THE GUIDING EYE
FOR NETWORK SECURITY

Understand. Learn. Audit. Assure.

AI-assisted vendor-agnostic configuration
interpretation and compliance assurance.

[ ANALYZE CONFIGURATION ]

[ OPEN LIVE DEMO ]
```

Behind the hero:

A subtle animated circular eye/star visualization.

The center represents the **Security Baseline Model**.

Around it:

``` text
VENDORS
   ↓
CONFIGURATION
   ↓
SEMANTIC UNDERSTANDING
   ↓
COMPLIANCE
   ↓
ASSURANCE
```

------------------------------------------------------------------------

# 8. Overview Dashboard

The dashboard should contain a visual "Tārā Core" at the center.

## Top metrics

``` text
DEVICES ANALYZED       08
CONTROLS EVALUATED     126
UNKNOWN CONSTRUCTS     04
LEARNED MAPPINGS       17
COMPLIANCE             82%
```

These values must come from actual application state.

Never fabricate competition-demo metrics.

## Main panels

### Tārā Core

A circular visualization showing:

``` text
                SECURITY
                   ↑
                   |
VENDOR ←──── Tārā CORE ────→ FRAMEWORK
                   |
                   ↓
              REMEDIATION
```

### Compliance Pulse

Framework cards:

``` text
CIS
██████████████░░  86%

NIST
█████████████░░░  81%

STIG
████████████░░░░  76%

ISO
██████████████░░  84%
```

### Learning Status

``` text
AI INTERPRETATION
────────────────────

Recognized       91%
Low confidence   06%
Unknown          03%

[ OPEN TRAINING STUDIO ]
```

------------------------------------------------------------------------

# 9. Analyze Screen

This is the main demonstration screen.

## Upload area

``` text
┌───────────────────────────────────────┐
│                                       │
│        DROP CONFIGURATION HERE        │
│                                       │
│       .txt   .cfg   .conf   .log      │
│                                       │
│      [ SELECT FILE ]                  │
│                                       │
└───────────────────────────────────────┘
```

Support:

-   Single configuration
-   Bulk upload
-   Demo sample configurations

### Demo shortcut

``` text
[ LOAD CISCO SAMPLE ]
[ LOAD FORTINET SAMPLE ]
[ LOAD JUNOS SAMPLE ]
[ LOAD UNKNOWN VENDOR SAMPLE ]
```

------------------------------------------------------------------------

# 10. Configuration Interpretation View

After upload, split the screen into three panels.

``` text
┌────────────────┬──────────────────┬────────────────────┐
│ RAW CONFIG     │ Tārā INTERPRET    │ SEMANTIC MODEL     │
├────────────────┼──────────────────┼────────────────────┤
│ command        │ probable meaning  │ control            │
│ command        │ probable meaning  │ parameter          │
│ UNKNOWN ←──────│ confidence 62%    │ UNKNOWN            │
└────────────────┴──────────────────┴────────────────────┘
```

Each configuration line receives a state:

-   **Recognized**
-   **Inferred**
-   **Low Confidence**
-   **Unknown**
-   **Learned**

------------------------------------------------------------------------

# 11. The Defining Feature --- Training Studio

This is the part judges should remember.

When Tārā-NETra encounters an unfamiliar command:

``` text
UNKNOWN CONFIGURATION CONSTRUCT

> set secure-admin session-limit 900

Tārā-NETra HYPOTHESIS

Possible meaning:
Administrative session timeout

Confidence:
62%

[ TEACH Tārā ]
```

The Training Studio opens.

## Three-column layout

### Column 1 --- Raw Evidence

``` text
set secure-admin session-limit 900
```

### Column 2 --- AI Interpretation

``` text
Security concept:
ADMIN_SESSION_TIMEOUT

Parameter:
900 seconds

Confidence:
62%

[ ACCEPT ]
[ MODIFY ]
```

### Column 3 --- Semantic Mapping

``` text
Security Category:
Administrative Access

Control:
Session Timeout

Expected:
≤ 900 seconds

Framework mappings:
✓ CIS
✓ NIST
✓ STIG
○ ISO
```

Then:

``` text
[ TEACH & REPROCESS ]
```

------------------------------------------------------------------------

# 12. Learning Loop

The system must visibly demonstrate learning.

Before:

``` text
UNKNOWN
Confidence: 62%
```

After administrator teaching:

``` text
LEARNED
Confidence: 97%
Source: Administrator
```

Then the same configuration is reprocessed.

The UI should show:

``` text
BEFORE
Unknown Construct
      ↓
Human Training
      ↓
Knowledge Update
      ↓
AFTER
Recognized Semantic Control
      ↓
Compliance Evaluation
```

This is the project's strongest demo moment.

------------------------------------------------------------------------

# 13. Knowledge Screen

Call this:

# Tārā MEMORY

The page displays everything the system has learned.

Example:

``` text
Tārā MEMORY

17 LEARNED MAPPINGS

┌────────────────────────────────────────────┐
│ secure-admin session-limit *               │
│ → ADMIN_SESSION_TIMEOUT                    │
│ Confidence: 97%                            │
│ Source: Administrator                      │
│ Vendor: Unknown                            │
└────────────────────────────────────────────┘
```

Actions:

``` text
[ EDIT ]
[ EXPORT KNOWLEDGE ]
[ IMPORT KNOWLEDGE ]
[ DELETE ]
```

The knowledge store should use JSON and browser storage.

------------------------------------------------------------------------

# 14. Security Baseline Model

The Security Baseline Model is the heart of Tārā-NETra.

Vendor syntax is converted into standardized security concepts.

Example:

``` json
{
  "device_management": {
    "ssh_enabled": true,
    "telnet_enabled": false,
    "http_management": false,
    "https_management": true
  },
  "authentication": {
    "aaa_enabled": true,
    "password_min_length": 14,
    "lockout_threshold": 5
  },
  "logging": {
    "syslog_enabled": true,
    "admin_logging": true
  },
  "time": {
    "ntp_enabled": true
  }
}
```

The compliance engine should never depend directly on vendor syntax.

------------------------------------------------------------------------

# 15. Semantic Control Model

Each control should contain:

``` json
{
  "id": "SSH-001",
  "name": "SSH Protocol Version",
  "category": "Administrative Access",
  "severity": "HIGH",
  "expected": {
    "ssh_protocol_version": 2
  },
  "frameworks": [
    "CIS",
    "NIST",
    "STIG"
  ],
  "remediation": {
    "Cisco IOS": "ip ssh version 2"
  }
}
```

The semantic layer becomes the bridge between:

``` text
Vendor Syntax
      ↓
Semantic Security Meaning
      ↓
Framework Control
```

------------------------------------------------------------------------

# 16. Compliance Engine

Tārā-NETra should use deterministic rules for final compliance
decisions.

AI can interpret configuration.

AI should NOT be the final authority on PASS/FAIL.

The final pipeline is:

``` text
Configuration
      ↓
AI-assisted interpretation
      ↓
Semantic Security Baseline
      ↓
Deterministic compliance rule
      ↓
PASS / FAIL / UNKNOWN
```

This reduces hallucination risk.

If the system does not have enough evidence:

``` text
UNKNOWN
```

should be preferred over inventing a compliance result.

------------------------------------------------------------------------

# 17. Framework Layer

The supplied challenge references:

-   CIS Benchmarks
-   NIST SP 800-53
-   DISA STIGs
-   ISO/IEC 27001
-   Vendor-specific CLI configuration samples

The project should represent these as modular framework packs.

``` text
knowledge/
├── frameworks/
│   ├── cis.json
│   ├── nist-800-53.json
│   ├── disa-stig.json
│   └── iso-27001.json
│
├── vendors/
│   ├── cisco.json
│   ├── fortinet.json
│   ├── juniper.json
│   └── generic.json
│
├── semantic-controls.json
└── learned-mappings.json
```

### Important

Do not claim complete coverage of the full standards in a one-day
prototype.

Instead:

> "Prototype implementation covering a curated high-value control
> subset."

The report should clearly distinguish:

-   Source standard
-   Prototype control implemented
-   Mapping status
-   Evidence source

------------------------------------------------------------------------

# 18. Suggested Initial Controls

For a one-day competition build, implement approximately 15--25
high-value controls.

### Administrative Access

-   SSH enabled
-   SSH version 2
-   Telnet disabled
-   HTTP management disabled
-   HTTPS management enabled
-   Management access restriction
-   Session timeout

### Authentication

-   AAA enabled
-   Password minimum length
-   Login lockout
-   Privileged account protection

### Monitoring

-   Syslog enabled
-   Administrative logging
-   Authentication logging

### Time

-   NTP enabled
-   Approved NTP source

### Network Security

-   Insecure protocols
-   Weak encryption
-   ACL presence
-   Management-plane filtering

### Services

-   Unused services
-   Unnecessary management protocols

------------------------------------------------------------------------

# 19. Findings Screen

Every finding should answer four questions:

1.  What was found?
2.  Why does it matter?
3.  Which framework/control applies?
4.  How can it be remediated?

Example:

``` text
HIGH
TELNET ENABLED

Device:
EDGE-FW-01

Semantic Control:
INSECURE_REMOTE_MANAGEMENT

Framework:
CIS

Evidence:
line 27

Expected:
Telnet disabled

Observed:
Telnet enabled

[ VIEW EVIDENCE ]
[ VIEW REMEDIATION ]
```

------------------------------------------------------------------------

# 20. Evidence Chain

Clicking a finding should open an evidence drawer.

``` text
RAW CONFIG
    ↓
CONFIGURATION LINE
    ↓
SEMANTIC INTERPRETATION
    ↓
SECURITY CONTROL
    ↓
FRAMEWORK REQUIREMENT
    ↓
COMPLIANCE RESULT
```

Example:

``` text
Raw:
service telnet

Meaning:
INSECURE_REMOTE_MANAGEMENT

Control:
TELNET-001

Requirement:
Telnet must be disabled

Result:
FAIL

Severity:
HIGH
```

This is one of the strongest explainability features.

------------------------------------------------------------------------

# 21. Remediation Screen

Call this:

# Tārā RESOLVE

The remediation view should generate vendor-specific commands from the
semantic finding.

Example:

``` text
Finding:
Telnet Enabled

Device:
Cisco IOS

Suggested remediation:

no service telnet

Verification:

show running-config | include telnet
```

Use the sequence:

``` text
DETECT
  ↓
RECOMMEND
  ↓
SIMULATE
  ↓
HUMAN APPROVAL
  ↓
EXPORT
```

Do not automatically modify real network devices in the competition
prototype.

------------------------------------------------------------------------

# 22. Evidence Screen

Call this:

# Tārā PROOF

Generate an audit-ready PDF containing:

### Device information

-   Device ID
-   Vendor
-   Model
-   Serial number if present
-   OS/version if available
-   Configuration hash

### Assessment

-   Framework
-   Control
-   Status
-   Severity
-   Evidence

### Remediation

-   Recommended CLI
-   Verification command
-   Confidence
-   Human approval status

### Learning activity

-   Unknown construct
-   Original interpretation
-   Administrator mapping
-   Updated interpretation

------------------------------------------------------------------------

# 23. Tamper-Evident Evidence

Instead of adding unnecessary blockchain infrastructure, calculate
SHA-256 hashes for:

``` text
Source Configuration
       ↓
Configuration Hash

Generated Report
       ↓
Report Hash
```

The PDF can display:

``` text
CONFIG SHA-256
a83f...92c1

REPORT SHA-256
91be...4a7d
```

This makes the evidence package more defensible without adding
unnecessary infrastructure.

------------------------------------------------------------------------

# 24. GitHub Pages Architecture

## Critical deployment decision

GitHub Pages is a static hosting platform.

Therefore, the competition architecture should NOT depend on:

-   FastAPI running continuously
-   A Python backend server
-   A private database server
-   Netmiko live connections
-   A paid AI API
-   A cloud VM

The live demo should run entirely in the browser.

GitHub Pages can host HTML/CSS/JavaScript and a built static frontend.
GitHub officially supports publishing Pages sites through GitHub
Actions. citeturn0search0turn0search4

------------------------------------------------------------------------

# 25. Tārā-NETra Browser-First Architecture

``` text
                    GITHUB PAGES
                         │
                         ▼
              ┌─────────────────────┐
              │   Tārā-NETra WEB UI │
              │   React / Vite      │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   Configuration     Training        Reports
      Parser          Studio          Engine
          │              │              │
          └──────────────┼──────────────┘
                         ▼
               Tārā INTELLIGENCE CORE
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  Interpreter       Semantic SBM      Compliance
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  Tārā MEMORY
             IndexedDB / localStorage
                         │
                         ▼
                 Evidence Generator
                         │
                         ▼
                    PDF Export
```

------------------------------------------------------------------------

# 26. Browser Modules

Recommended implementation:

``` text
src/
├── app/
├── components/
├── pages/
│   ├── Overview/
│   ├── Analyze/
│   ├── TrainingStudio/
│   ├── Knowledge/
│   ├── Compliance/
│   ├── Findings/
│   ├── Remediation/
│   └── Evidence/
│
├── core/
│   ├── interpreter/
│   ├── normalizer/
│   ├── compliance/
│   ├── remediation/
│   ├── evidence/
│   └── hashing/
│
├── knowledge/
│   ├── frameworks/
│   ├── vendors/
│   ├── semantic-controls/
│   └── samples/
│
├── workers/
│   └── analysis.worker.js
│
├── services/
│   ├── storage.js
│   ├── parser.js
│   └── report.js
│
└── styles/
    ├── theme.css
    └── components.css
```

------------------------------------------------------------------------

# 27. Why Web Workers?

Configuration analysis can be moved into a Web Worker.

``` text
Browser UI
    │
    ├── Upload
    │
    ▼
Web Worker
    │
    ├── Parse
    ├── Normalize
    ├── Interpret
    ├── Evaluate
    └── Generate findings
    │
    ▼
Browser UI
```

This prevents large configuration analysis from freezing the interface.

It also makes the product feel like a real application.

------------------------------------------------------------------------

# 28. Local Persistence

Use:

### IndexedDB

for:

-   Learned mappings
-   Analysis history
-   Device profiles
-   Training events
-   User preferences

Use:

### localStorage

for:

-   Theme
-   Selected framework
-   UI settings
-   Demo state

Allow:

``` text
EXPORT KNOWLEDGE
```

to download a JSON knowledge pack.

Allow:

``` text
IMPORT KNOWLEDGE
```

to restore it on another browser.

This is important because GitHub Pages itself should not be treated as
the application's mutable database.

------------------------------------------------------------------------

# 29. AI Strategy Without a Backend

The competition prototype can be built without paying for an AI API.

Use a layered interpretation engine:

``` text
Layer 1
Exact pattern matching

        ↓

Layer 2
Regex + token similarity

        ↓

Layer 3
Semantic aliases

        ↓

Layer 4
Known vendor patterns

        ↓

Layer 5
Learned mappings

        ↓

UNKNOWN
```

The UI can call this:

# Tārā INTELLIGENCE CORE

The architecture is AI-augmented because it performs:

-   Pattern recognition
-   Semantic interpretation
-   Confidence estimation
-   Learning from administrator mappings
-   Generalization of learned concepts

If a true LLM is later added, it should sit behind the interpretation
layer rather than directly controlling compliance decisions.

------------------------------------------------------------------------

# 30. Optional Future AI Adapter

Design the code so an AI provider can be added later:

``` text
Interpreter Interface
       │
       ├── LocalInterpreter
       ├── RuleInterpreter
       └── AIInterpreter
```

For the competition:

``` text
LocalInterpreter
+
RuleInterpreter
+
Training Memory
```

are sufficient.

This keeps the live demo:

-   Free
-   Fast
-   Offline-capable
-   Reproducible
-   Independent of API keys
-   Safe for public deployment

------------------------------------------------------------------------

# 31. Dataset Strategy

The challenge provides/references:

-   NCIIPC
-   CIS Benchmarks
-   NIST SP 800-53
-   DISA STIGs
-   ISO/IEC 27001
-   Vendor-specific CLI configuration samples

Use these as the **source knowledge layer**.

The project should create a curated internal dataset:

``` text
dataset/
├── frameworks/
│   ├── cis/
│   ├── nist/
│   ├── disa-stig/
│   └── iso-27001/
│
├── vendor-configs/
│   ├── cisco/
│   ├── fortinet/
│   ├── juniper/
│   └── unknown/
│
├── semantic-controls/
│
└── mappings/
```

Do not simply dump documents into the application.

Convert the relevant information into structured records.

------------------------------------------------------------------------

# 32. Dataset Normalization Pipeline

``` text
Official / Supplied Sources
          ↓
Relevant Controls
          ↓
Structured Control Records
          ↓
Semantic Security Model
          ↓
Vendor Syntax Mappings
          ↓
Tārā Knowledge Pack
```

Each record should contain:

``` json
{
  "control_id": "SSH-001",
  "title": "SSH Protocol Version",
  "category": "Administrative Access",
  "severity": "HIGH",
  "semantic_parameter": "ssh_protocol_version",
  "expected_value": 2,
  "framework": "CIS",
  "source_reference": "official benchmark/control reference",
  "remediation": {
    "Cisco IOS": "ip ssh version 2"
  }
}
```

------------------------------------------------------------------------

# 33. Dataset Governance

Because the source list includes official cybersecurity standards and
potentially organization-specific configuration material:

### Never publish sensitive real-world configurations.

Only publish:

-   Sanitized examples
-   Synthetic examples
-   Officially public material
-   Challenge-provided material that is permitted for redistribution

Remove:

-   Public IPs if unnecessary
-   Internal hostnames
-   Passwords
-   API keys
-   SNMP community strings
-   Certificates/private keys
-   Device serial numbers
-   Credentials
-   Internal topology information

GitHub Pages sites are publicly accessible, so sensitive configuration
data should not be placed in the public repository.
citeturn0search3turn0search8

------------------------------------------------------------------------

# 34. Framework Crosswalk

The same semantic control can map to multiple frameworks.

Example:

``` text
SEMANTIC CONTROL

Secure Administrative Access
          │
          ├── CIS
          │
          ├── NIST SP 800-53
          │
          ├── DISA STIG
          │
          └── ISO/IEC 27001
```

This is much more scalable than writing separate vendor-specific
compliance engines.

------------------------------------------------------------------------

# 35. Unknown Vendor Mode

A major differentiator.

The system should not require perfect vendor identification before
analysis.

Example:

``` text
Vendor:
UNKNOWN

OS:
UNKNOWN

Syntax family:
PARTIALLY IDENTIFIED

Semantic analysis:
AVAILABLE
```

Tārā-NETra can still interpret recognized security concepts.

The UI should display:

> Vendor identification is uncertain. Semantic analysis is continuing
> with confidence-aware interpretation.

------------------------------------------------------------------------

# 36. Confidence System

Every interpreted construct should have confidence.

Example:

``` text
SSH ENABLED
98%

SESSION TIMEOUT
93%

AAA
88%

UNKNOWN COMMAND
41%
```

Suggested thresholds:

``` text
90–100%  HIGH CONFIDENCE
70–89%   MODERATE
40–69%   LOW
0–39%    UNKNOWN
```

These thresholds are application heuristics, not claims about
statistical model accuracy.

------------------------------------------------------------------------

# 37. Compliance States

Use four states rather than only PASS/FAIL:

``` text
PASS
FAIL
UNKNOWN
NOT APPLICABLE
```

This makes the system more honest.

Example:

``` text
PASS       72
FAIL       14
UNKNOWN     4
N/A        10
```

------------------------------------------------------------------------

# 38. Compliance Heatmap

Create a visual matrix:

``` text
                 CIS   NIST   STIG   ISO

SSH               ●      ●      ●      ●
AAA               ●      ●      ●      ●
TELNET            ●      ●      ●      ○
NTP               ●      ●      ○      ●
LOGGING           ●      ●      ●      ●
PASSWORD POLICY   ●      ●      ●      ●
```

Clicking a cell opens the underlying evidence.

------------------------------------------------------------------------

# 39. Security Debt

Optional visual metric:

``` text
SECURITY DEBT

HIGH     ███████
MEDIUM   ████
LOW      ██
```

Security debt should be calculated from actual findings and severity
weights.

Do not present it as a universal industry metric.

------------------------------------------------------------------------

# 40. Configuration Fingerprint

Generate a compact semantic fingerprint:

``` text
DEVICE SECURITY FINGERPRINT

AUTH ━━━━━━━
MGMT ━━━━━
LOG  ━━━━━━━━
TIME ━━━━━━
ACL  ━━━━━
SERV ━━━
```

This provides judges with a quick visual understanding of the device's
security posture.

------------------------------------------------------------------------

# 41. Compliance Regression

After learning or configuration changes:

``` text
PREVIOUS
82%

CURRENT
91%

CHANGED CONTROLS
+ SSH
+ SESSION TIMEOUT
+ LOGGING
```

The system should retain analysis snapshots locally.

------------------------------------------------------------------------

# 42. Tārā Architecture

## Full logical architecture

``` text
                         ┌───────────────────────┐
                         │       USER            │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────┐
                    │       Tārā-NETra UI         │
                    │ React + Vite + CSS          │
                    └─────────────┬───────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       CONFIG INGESTION     TRAINING STUDIO       REPORTING
             │                    │                    │
             ▼                    ▼                    ▼
       PARSER / NORMALIZER  LEARNING ENGINE      EVIDENCE ENGINE
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                    ┌─────────────────────────────┐
                    │  Tārā INTELLIGENCE CORE    │
                    │ Interpretation + Confidence │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │ SECURITY BASELINE MODEL     │
                    │ Vendor-Neutral Semantics    │
                    └─────────────┬───────────────┘
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                  COMPLIANCE ENGINE    Tārā MEMORY
                         │                 │
                         ▼                 │
                    FINDINGS ◄─────────────┘
                         │
                         ▼
                  Tārā RESOLVE
                         │
                         ▼
                  Tārā PROOF
                         │
                         ▼
                    PDF EXPORT
```

------------------------------------------------------------------------

# 43. GitHub Repository Structure

Recommended repository:

``` text
tara-netra/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   ├── samples/
│   ├── icons/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── core/
│   ├── workers/
│   ├── services/
│   ├── knowledge/
│   └── styles/
│
├── dataset/
│   ├── frameworks/
│   ├── vendor-configs/
│   └── mappings/
│
├── docs/
│   ├── architecture.md
│   ├── dataset-methodology.md
│   └── demo-script.md
│
├── README.md
├── package.json
├── vite.config.js
└── index.html
```

------------------------------------------------------------------------

# 44. GitHub Pages Deployment

Recommended stack:

-   React
-   Vite
-   JavaScript/TypeScript
-   CSS
-   Web Workers
-   IndexedDB
-   jsPDF or equivalent browser PDF library
-   Web Crypto API for SHA-256
-   GitHub Actions
-   GitHub Pages

GitHub's current documentation supports GitHub Actions workflows that
build and publish static content to GitHub Pages.
citeturn0search0turn0search4

## Deployment flow

``` text
Developer
   │
   ▼
git push
   │
   ▼
GitHub Repository
   │
   ▼
GitHub Actions
   │
   ├── npm install
   ├── npm run build
   └── upload dist/
   │
   ▼
GitHub Pages
   │
   ▼
LIVE Tārā-NETra
```

------------------------------------------------------------------------

# 45. GitHub Actions Workflow

Use a workflow conceptually like:

``` yaml
name: Deploy Tārā-NETra

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Adapt the exact Node/action versions to the current project environment
and GitHub's supported actions.

------------------------------------------------------------------------

# 46. Vite GitHub Pages Configuration

For a project site:

``` javascript
export default {
  base: "/tara-netra/"
}
```

If the repository itself is:

``` text
username.github.io
```

the base can instead be:

``` text
/
```

GitHub Pages project sites normally use the repository name as part of
the published URL. citeturn0search8

------------------------------------------------------------------------

# 47. SPA Routing Consideration

Because GitHub Pages is static hosting, avoid relying on server-side
route handling.

Preferred options:

### Option A --- Hash routing

``` text
/#/overview
/#/analyze
/#/training
```

### Option B --- Client-side routing with a fallback strategy

For a one-day competition build, hash routing is safer and simpler.

------------------------------------------------------------------------

# 48. Offline Demo Mode

Add a switch:

``` text
● LIVE MODE
○ DEMO MODE
```

Demo Mode loads bundled sample configurations.

This prevents:

-   Internet dependency
-   Missing dataset problems
-   API failures
-   Slow analysis
-   Broken demos

The judge can immediately click:

``` text
[ RUN Tārā DEMO ]
```

------------------------------------------------------------------------

# 49. One-Day Implementation Priority

## MUST BUILD

### 1. Landing/dashboard

Tārā identity + metrics + visual core.

### 2. Configuration upload

TXT/CFG/CONF.

### 3. Semantic interpreter

Pattern-based + learned mapping.

### 4. Unknown construct detection

Clearly highlight unknown lines.

### 5. Training Studio

Human maps unknown command to semantic control.

### 6. Learning persistence

IndexedDB/localStorage.

### 7. Compliance engine

15--25 controls.

### 8. Findings

PASS / FAIL / UNKNOWN.

### 9. Remediation

Vendor-specific command suggestions.

### 10. PDF evidence

Audit-style report.

### 11. GitHub Pages

Fully deployable static build.

------------------------------------------------------------------------

# 50. SHOULD BUILD

If time remains:

-   Framework heatmap
-   Configuration diff
-   Compliance regression
-   Security fingerprint
-   SHA-256 evidence hashes
-   Knowledge export/import
-   Web Worker processing
-   Device comparison

------------------------------------------------------------------------

# 51. DO NOT BUILD IN THE ONE-DAY MVP

Avoid spending time on:

-   Full enterprise network discovery
-   Live firewall connections
-   SSH automation
-   Netmiko production integration
-   Full cloud deployment
-   Full CIS coverage
-   Full NIST coverage
-   Full STIG coverage
-   Full ISO mapping
-   Blockchain
-   Kubernetes
-   Microservices
-   Complex ML training pipelines
-   Autonomous remediation
-   Attack-path simulation
-   Digital twins

These can appear under:

# Future Scope

------------------------------------------------------------------------

# 52. Two-Minute Demo Script

## 0:00--0:15

Show the landing screen.

Say:

> "Enterprise networks don't speak one configuration language.
> Tārā-NETra doesn't try to memorize every language. It learns the
> security meaning behind them."

------------------------------------------------------------------------

## 0:15--0:30

Upload an unfamiliar configuration.

Show:

``` text
Vendor: UNKNOWN
Recognized: 91%
Unknown: 9%
```

Highlight one unknown construct.

------------------------------------------------------------------------

## 0:30--0:50

Open Training Studio.

Show:

``` text
RAW COMMAND
      ↓
Tārā HYPOTHESIS
      ↓
ADMINISTRATOR MAPPING
```

------------------------------------------------------------------------

## 0:50--1:05

Click:

**TEACH & REPROCESS**

Show:

``` text
UNKNOWN
62%

↓

LEARNED
97%
```

------------------------------------------------------------------------

## 1:05--1:25

Open Compliance.

Show:

``` text
PASS
FAIL
UNKNOWN
```

Click a failed control.

------------------------------------------------------------------------

## 1:25--1:40

Show evidence chain:

``` text
Raw CLI
 ↓
Semantic Meaning
 ↓
Framework Control
 ↓
Failure
```

------------------------------------------------------------------------

## 1:40--1:52

Open Tārā RESOLVE.

Show:

``` text
Vendor-specific remediation
+
Verification command
```

------------------------------------------------------------------------

## 1:52--2:00

Generate Tārā PROOF.

Final screen:

# Tārā-NETra

**Understand. Learn. Audit. Assure.**

> **A new vendor should not require a new parser deployment.**

------------------------------------------------------------------------

# 53. Five-Slide Competition Deck

## Slide 1 --- THE PROBLEM

### Networks don't speak one language.

Show:

``` text
Cisco
Fortinet
Juniper
Cloud
White-box
Unknown
      ↓
Different syntax
      ↓
Same security intent
```

------------------------------------------------------------------------

## Slide 2 --- THE BREAKTHROUGH

# UNKNOWN → LEARN → VERIFY

Show the Training Studio.

This slide should communicate the innovation immediately.

------------------------------------------------------------------------

## Slide 3 --- THE ARCHITECTURE

``` text
CONFIG
 ↓
Tārā INTELLIGENCE
 ↓
SECURITY BASELINE MODEL
 ↓
MULTI-FRAMEWORK COMPLIANCE
 ↓
REMEDIATION
 ↓
AUDIT EVIDENCE
```

------------------------------------------------------------------------

## Slide 4 --- THE LIVE DIFFERENTIATOR

Before:

``` text
UNKNOWN
62%
```

After:

``` text
LEARNED
97%
```

Then:

``` text
COMPLIANCE RESULT
+
EVIDENCE
+
REMEDIATION
```

------------------------------------------------------------------------

## Slide 5 --- THE IMPACT

### One semantic engine.

### Many vendors.

### Multiple frameworks.

### Continuous learning.

### Explainable compliance.

Final line:

> **Tārā-NETra turns unfamiliar configuration into actionable security
> knowledge.**

------------------------------------------------------------------------

# 54. Technical Design Principles

## Principle 1 --- Separate syntax from semantics

Vendor syntax should never directly drive compliance logic.

------------------------------------------------------------------------

## Principle 2 --- AI assists; rules decide

AI interprets.

Deterministic controls decide.

------------------------------------------------------------------------

## Principle 3 --- Unknown is a valid state

Never hallucinate compliance.

------------------------------------------------------------------------

## Principle 4 --- Learn once, reuse

A trained semantic mapping should work across future configurations
where applicable.

------------------------------------------------------------------------

## Principle 5 --- Human-in-the-loop

The administrator remains the authority for ambiguous mappings.

------------------------------------------------------------------------

## Principle 6 --- Evidence-first

Every compliance result should be traceable to configuration evidence.

------------------------------------------------------------------------

## Principle 7 --- Static-first deployment

The public demo should work entirely on GitHub Pages.

------------------------------------------------------------------------

# 55. Security Model for the Application

Even though this is a competition prototype, treat uploaded
configurations carefully.

### Browser isolation

Process files locally in the browser.

### No automatic upload

Do not send configuration files to a remote service by default.

### No secrets in repository

Never commit:

-   API keys
-   Passwords
-   Private keys
-   Credentials
-   Real production configurations

### Knowledge integrity

Validate imported knowledge JSON before adding it.

### Evidence hashing

Use SHA-256 to identify source artifacts.

------------------------------------------------------------------------

# 56. Future Production Architecture

The GitHub Pages prototype should have a clean upgrade path.

``` text
              GITHUB PAGES
                   │
                   ▼
             Tārā WEB APP
                   │
                   ▼
             API GATEWAY
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
 Interpreter   Compliance   Evidence
 Service       Service      Service
       │           │           │
       └───────────┼───────────┘
                   ▼
              Knowledge DB
                   │
                   ▼
          Vendor / Framework Packs
```

Production could eventually add:

-   FastAPI
-   PostgreSQL
-   Redis
-   Authentication
-   Organization-level knowledge bases
-   Secure AI gateway
-   Network device connectors
-   SIEM integrations
-   Cloud security integrations

But these should remain future scope for the competition prototype.

------------------------------------------------------------------------

# 57. Differentiation Statement

Tārā-NETra should not be positioned as:

> "Another AI compliance dashboard."

Position it as:

> **A self-learning semantic compliance engine that adapts to unfamiliar
> network configuration structures through human-guided learning.**

The differentiator is not merely AI.

The differentiator is the architecture:

``` text
UNKNOWN CONFIGURATION
        ↓
SEMANTIC HYPOTHESIS
        ↓
HUMAN TEACHING
        ↓
PERSISTENT KNOWLEDGE
        ↓
REPROCESSING
        ↓
COMPLIANCE
        ↓
EVIDENCE
```

------------------------------------------------------------------------

# 58. Judge-Facing One-Liner

> **Tārā-NETra is a vendor-agnostic, self-learning network security
> compliance engine that converts unfamiliar configuration syntax into
> explainable security controls without requiring a new parser
> deployment.**

------------------------------------------------------------------------

# 59. Judge-Facing 30-Second Explanation

> "Tārā-NETra solves the problem of heterogeneous network
> configurations. Instead of maintaining a separate parser for every
> vendor, we normalize configuration into a vendor-neutral Security
> Baseline Model. When the system encounters something unfamiliar, it
> doesn't guess. It shows the administrator the unknown construct,
> proposes its meaning, lets them teach it, stores that knowledge and
> immediately re-runs compliance. The same semantic layer then maps the
> result to CIS, NIST, STIG and ISO-aligned controls and produces
> evidence-backed remediation."

------------------------------------------------------------------------

# 60. Dataset Source Note

The challenge-provided source list includes:

-   NCIIPC --- National Critical Information Infrastructure Protection
    Centre
-   CIS Benchmarks
-   NIST SP 800-53
-   DISA STIGs
-   ISO/IEC 27001
-   Vendor-specific CLI configuration samples

Use the official source material supplied or authorized for the
challenge as the basis for the structured knowledge packs.

Reference:

**NCIIPC:** https://nciipc.gov.in/

**NIST SP 800-53:**
https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final

**CIS Benchmarks:** https://www.cisecurity.org/cis-benchmarks

**DISA STIGs:** https://public.cyber.mil/stigs/

For ISO/IEC 27001, use the official ISO material or the specific
challenge-provided dataset rather than copying copyrighted standard text
into the repository.

------------------------------------------------------------------------

# 61. Final Product Definition

## Tārā-NETra

### Trustworthy Adaptive Risk Analytics --- Network Reasoning & Assurance

**The Guiding Eye for Network Security**

``` text
                    ★
                 Tārā
                   │
                   ▼
                NETRA
                   │
                   ▼
        ┌─────────────────────┐
        │ UNKNOWN             │
        │        ↓            │
        │ EXPLAIN             │
        │        ↓            │
        │ TEACH               │
        │        ↓            │
        │ LEARN               │
        │        ↓            │
        │ VERIFY              │
        │        ↓            │
        │ AUDIT               │
        └─────────────────────┘
```

### Core promise

> **Different syntax. One security language.**

### Core innovation

> **A new vendor should not require a new parser deployment.**

### Core experience

> **Understand. Learn. Audit. Assure.**

### Deployment target

> **A fully functional browser-based security application deployed
> through GitHub Pages, with no mandatory backend server for the
> competition MVP.**

------------------------------------------------------------------------

# 62. Definition of Done

Tārā-NETra is competition-ready when:

-   [ ] GitHub repository is clean
-   [ ] GitHub Pages deployment works
-   [ ] Landing page looks like a real security product
-   [ ] Configuration upload works
-   [ ] At least 3 vendor examples work
-   [ ] Unknown vendor example works
-   [ ] Unknown constructs are detected
-   [ ] Training Studio works
-   [ ] Learned mappings persist
-   [ ] Semantic model is visible
-   [ ] At least 15 high-value controls work
-   [ ] CIS/NIST/STIG/ISO mappings are represented for implemented
    controls
-   [ ] PASS/FAIL/UNKNOWN results work
-   [ ] Evidence chain works
-   [ ] Remediation suggestions work
-   [ ] PDF report works
-   [ ] SHA-256 evidence hash works
-   [ ] Demo Mode works
-   [ ] No API keys are committed
-   [ ] No real sensitive configurations are committed
-   [ ] README explains architecture
-   [ ] Two-minute demo follows the UNKNOWN → LEARN → VERIFY story

------------------------------------------------------------------------

# Final Statement

Tārā-NETra should feel less like a student project and more like a **new
security product prototype**.

The judge should be able to understand the entire innovation in one
interaction:

**Upload an unfamiliar configuration → see what Tārā-NETra does not
understand → teach it → watch the knowledge update → re-run compliance →
trace the result back to raw configuration → generate remediation →
export evidence.**

That single loop is the product.

**Tārā-NETra: The Guiding Eye for Network Security.**
