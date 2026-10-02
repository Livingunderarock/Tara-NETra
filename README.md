# TĀRĀ-NETRA
## Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance
### *The Guiding Eye for Network Security* (तारानेत्र)

> **"Different vendors speak different configuration languages. TĀRĀ-NETRA learns the security meaning behind them."**

[![Deploy TARA-NETRA](https://github.com/manas/Tara-NETra/actions/workflows/deploy.yml/badge.svg)](https://github.com/manas/Tara-NETra/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Zero Backend](https://img.shields.io/badge/Architecture-100%25%20Client--Side-brightgreen)](https://github.com/manas/Tara-NETra)

---

## 1. Executive Summary & Problem Statement

Heterogeneous enterprise and critical infrastructure networks are composed of multi-vendor routers, firewalls, switches, cloud security groups, and white-box appliances (Cisco IOS, Fortinet FortiOS, Juniper Junos, Linux iptables, Arista EOS, and proprietary operating systems). 

Historically, security compliance auditing has required:
- Brittle, vendor-specific syntax parsers that break whenever novel syntax or minor firmware upgrades occur.
- Cloud-dependent SaaS assessment tools that expose sensitive network topologies and credentials to third-party servers.
- Opaque scoring dashboards that fail to provide an explainable cryptographic chain of custody for auditors.

**TĀRĀ-NETRA** resolves this fundamental challenge through a **zero-backend, client-side reasoning engine** that translates disparate CLI syntaxes into a vendor-neutral **Security Baseline Model (SBM)**. By combining confidence-aware semantic interpretation, a zero-scroll **Human-in-the-Loop Learning Studio**, and deterministic multi-framework rule evaluation, TĀRĀ-NETRA ensures that a new vendor never requires a software redeployment.

```
       ┌─────────────────────────────────────────────────────────────┐
       │               THE TĀRĀ-NETRA LEARNING CYCLE                 │
       │                                                             │
       │   UNKNOWN  ──►  EXPLAIN  ──►  TEACH  ──►  LEARN  ──► AUDIT  │
       │   (Novel CLI)   (AI Hypo)   (Admin)     (Memory)   (Proof)  │
       └─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Engine & Backend Architecture (100% Client-Side)

TĀRĀ-NETRA operates entirely within the user's browser, utilizing the browser as a hardened, high-performance execution environment. No server-side runtime, cloud API, or remote telemetry is required.

```
                      GITHUB PAGES / STATIC WEB SERVER
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │      TĀRĀ-NETRA Client        │
                      │    (React 19 + Vite Engine)   │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌──────────────┐              ┌──────────────┐              ┌──────────────┐
│ Ingestion &  │              │   Learning   │              │ TĀRĀ PROOF   │
│ Normalizer   │              │   Studio     │              │ Report Engine│
└───────┬──────┘              └───────┬──────┘              └───────┬──────┘
        │                             │                             │
        └──────────────────────┬──────┘                             │
                               ▼                                    │
               ┌───────────────────────────────┐                    │
               │    TĀRĀ Intelligence Core     │                    │
               │ (5-Layer Semantic Interpreter)│                    │
               └───────────────┬───────────────┘                    │
                               │                                    │
                               ▼                                    │
               ┌───────────────────────────────┐                    │
               │    Security Baseline Model    │                    │
               │   (Vendor-Neutral SBM JSON)   │                    │
               └───────────────┬───────────────┘                    │
                               │                                    │
               ┌───────────────┴───────────────┐                    │
               ▼                               ▼                    │
┌──────────────────────────────┐ ┌───────────────────────────┐      │
│ Deterministic Audit Engine   │ │ TĀRĀ Persistent Memory    │      │
│ ├── CIS Benchmarks (v2.0)    │ │ ├── localStorage (Sync)   │      │
│ ├── NIST SP 800-53 (Rev 5)   │ │ └── IndexedDB (Dual-Tier) │      │
│ ├── DISA STIGs (SRG-APP)     │ └───────────────────────────┘      │
│ └── ISO/IEC 27001:2022       │               │                    │
└──────────────┬───────────────┘               ▼                    │
               │                      Web Crypto API                │
               ▼                    (SHA-256 Hashing)               │
┌──────────────────────────────┐               │                    │
│ Findings, Heatmap & Debt     │               ▼                    ▼
│ + TĀRĀ RESOLVE CLI Fixes     │ ════════════► Audit-Grade Evidence PDF
└──────────────────────────────┘
```

### 2.1 The 5-Layer Semantic Interpretation Engine

When a configuration is analyzed, each CLI line traverses a strict hierarchical resolution pipeline implemented in [`interpreter.js`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/core/interpreter.js):

1. **Layer 1: Learned Mappings (Human Ground Truth — 97% Confidence)**:
   - Queries persistent TĀRĀ Memory for administrator-taught regex patterns.
   - Evaluated first so that human decisions take absolute precedence over generic automated heuristics.
   - Directly assigns the taught SBM category and flags the directive as `✓ LEARNED`.
2. **Layer 2: Exact Vendor Pattern Matching (95–100% Confidence)**:
   - High-precision regex catalog covering syntax idioms for Cisco IOS, Fortinet FortiOS, Juniper Junos, and Linux iptables.
   - Flags directives as `RECOGNIZED`.
3. **Layer 3: Cross-Vendor Heuristic Inference (70–85% Confidence)**:
   - Architectural deduction applied across vendor boundaries (e.g., standardizing interface-level ACL bindings, session timeout timers).
   - Flags directives as `INFERRED`.
4. **Layer 4: Fuzzy Semantic Aliases (40–65% Confidence)**:
   - NLP token extraction and compound keyword analysis (e.g., matching `session-limit`, `admin-access`, `inactivity-timer` to `session_timeout`).
   - Flags directives as `LOW_CONFIDENCE` and suggests an AI hypothesis.
5. **Layer 5: Unknown Construct Detection (0% Confidence)**:
   - Flags unmapped CLI syntax, extracts command keywords, and formulates an intelligent hypothesis for the Learning Studio.
   - Flags directives as `UNKNOWN`.

### 2.2 The Security Baseline Model (SBM) Specification

The SBM is an abstract, vendor-agnostic object representation of network security policy spanning seven core domains:

| SBM Domain | Normalized Schema Fields | Semantic Purpose |
|------------|--------------------------|------------------|
| `ACCESS_CONTROL` | `action` (`PERMIT`/`DENY`), `protocol`, `src_ip`, `dst_ip`, `dst_port`, `is_default_deny` | Universal firewall and ACL representation. |
| `MANAGEMENT_PLANE` | `ssh_enabled`, `ssh_v2_only`, `telnet_disabled`, `http_disabled`, `https_enabled`, `mgmt_acls`, `idle_timeout_seconds` | Remote administrative access hygiene. |
| `AUTHENTICATION` | `aaa_enabled`, `local_users`, `min_password_length`, `max_failed_logins`, `lockout_duration_seconds` | Identity, credential complexity, and brute-force protection. |
| `LOGGING_MONITORING` | `syslog_servers`, `logging_level`, `admin_audit_enabled`, `buffered_logging` | Security operations telemetry and audit trail capture. |
| `TIME_SYNCHRONIZATION`| `ntp_servers`, `ntp_version`, `ntp_authenticated`, `auth_key_configured` | Monotonic timestamp integrity for digital forensics. |
| `CRYPTOGRAPHY` | `approved_ciphers`, `deprecated_ciphers`, `min_key_length`, `tls_min_version` | Posture against eavesdropping and cryptanalysis. |
| `BANNER_LEGAL` | `banner_configured`, `banner_type` (`MOTD`/`LOGIN`), `has_warning_text` | Legal warning against unauthorized access. |

### 2.3 Deterministic Compliance Engine

While machine learning and heuristic deduction assist in understanding CLI syntax, **all compliance evaluations are 100% deterministic**. Hardcoded boolean compliance logic cross-examines the normalized SBM against 16 standardized controls across 4 authoritative frameworks:
- **CIS Benchmarks** (v2.0)
- **NIST SP 800-53** (Rev 5)
- **DISA STIGs** (SRG-APP)
- **ISO/IEC 27001:2022**

### 2.4 TĀRĀ Memory & Dual Persistence Architecture

TĀRĀ-NETRA features a zero-maintenance, dual-tier local persistence architecture implemented in [`storage.js`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/services/storage.js):
- **Fast Synchronous Tier (`localStorage`)**: Maintains immediate cache of taught rules, UI preferences, and theme tokens for sub-millisecond access during interpretation.
- **High-Capacity Durable Tier (`IndexedDB`)**: Stores comprehensive configuration audit histories, full diff snapshots, and batch learning models.
- **Batch Training API (`saveLearnedMappingsBatch`)**: Atomically writes multi-rule inscriptions with cryptographic timestamping.

---

## 3. Frontend Architecture & Ancient Indian Astronomical Design System

TĀRĀ-NETRA avoids generic SaaS dashboards in favor of an **Ancient Indian Astronomical Instrument and Manuscript Design System**, drawing inspiration from Jantar Mantar observatories, Yantra geometry, and classical Indian scholar traditions.

```
       ASTRONOMICAL CORE (YANTRA SBM SCHEMATIC)
                    SECURITY SEMANTICS
                            ●
                       ╭────┴────╮
          VENDORS  ●──┤ TĀRĀ CORE ├──●  FRAMEWORKS
                       ╰────┬────╯
                            ●
                    REMEDIATION & PROOF
```

### 3.1 Design Language & Celestial Color Palette

- **Warm Aged Parchment (`#DED1BA` base, `#E8DCB8` surface, `#C4B496` borders)**: Evokes the tactile gravitas of historical astronomical treatises and physical manuscripts.
- **Deep Indigo Ink (`#20263A`)**: Crisp typographic contrast providing readability without harsh digital black glare.
- **Muted Gold & Brass (`#B08A3C`)**: Signifies precision instruments, astrolabe markings, and astronomical coordinates.
- **Scholar’s Vermilion (`#8C2D19`)**: Dignified indicator for non-compliant findings, unknown constructs, and critical risks.
- **Forest Green (`#2A5A3B`)**: Indicates audited compliance pass, verified evidence, and learned mappings.
- **Typography**:
  - *Headings & Titles*: Roman serif display fonts (**Cinzel**, **Cormorant Garamond**) with classical proportion and letter-spacing.
  - *UI & Telemetry*: High-legibility modern sans-serif (**Outfit**, **Inter**) paired with technical monospace (**JetBrains Mono**) for configuration code and cryptographic hashes.

### 3.2 Key Workbenches & Interactive Modules

1. **Astronomical Instrument SBM Schematic ([`Overview.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/Overview.jsx))**:
   - Prominently positioned on the landing page.
   - Precision vector SVG with concentric orbital arcs, segmented crosshair axes, celestial bindu markers, and protective stroke halo isolation.
2. **Interactive 3-Panel Config Analyzer ([`Analyze.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/Analyze.jsx))**:
   - *Left Pane*: Raw CLI viewer with line numbers, status badges (`RECOGNIZED`, `INFERRED`, `UNKNOWN`, `LEARNED`), and syntax highlighting.
   - *Center Pane*: Live SBM Model Inspector displaying normalized parameters, confidence gauges, and raw mapping evidence.
   - *Right Pane*: Real-time compliance crosswalk updating dynamically as configurations are modified.
3. **Zero-Scroll Master-Detail Learning Studio ([`TrainingStudio.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/TrainingStudio.jsx))**:
   - *Split-Pane Layout*: 65% Constructs Ledger + 35% Pinned Scholar's Teaching Desk.
   - *Contained Internal Scroll*: Restricts construct listing to a bounded viewport (`max-height: calc(100vh - 280px)`), completely preventing page-level jumping.
   - *✧ Learn All Hypotheses*: 1-click batch learning button that automatically synthesizes regex patterns and SBM mappings for all unfamiliar directives simultaneously.
   - *Inline "✓ Accept"*: Per-row one-click learning action for instant single-construct acceptance.
   - *Filter Tabs & Search*: Live filtering by syntax text or status (`All`, `Untaught`, `Learned`).
4. **Step-by-Step Guided Instrument Tutorial ([`App.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/App.jsx))**:
   - 6-step interactive modal walkthrough detailing every feature: Analyzer, Training Studio, Compliance Dashboard, Heatmap, Findings, and PDF Evidence.
5. **Multi-Framework Compliance Dashboard ([`Compliance.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/Compliance.jsx))**:
   - Radar framework metrics, category heatmap matrix, and weighted **Security Debt** vulnerability scores.
6. **TĀRĀ RESOLVE: Explainable Remediation ([`Remediation.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/Remediation.jsx))**:
   - 5-step explainability chain: `Raw CLI → SBM Interpretation → Security Control → Framework → Finding → Remediation → Verification`.
   - Generates copy-pasteable CLI commands tailored to the target vendor OS and verification test scripts.
7. **TĀRĀ PROOF: Tamper-Evident Audit Evidence ([`Evidence.jsx`](file:///c:/Users/manas/Documents/SIH%202026/Tara-NETra/src/pages/Evidence.jsx))**:
   - Computes SHA-256 hashes of source configurations and audit outputs using the browser's native Web Crypto API.
   - One-click export of audit-grade, branded PDF compliance packages.

---

## 4. Security Controls & Framework Crosswalk

TĀRĀ-NETRA deterministically assesses 16 critical network security controls cross-mapped across international frameworks:

| Control ID | Semantic Concept | CIS Benchmark (v2.0) | NIST SP 800-53 (Rev 5) | DISA STIG | ISO/IEC 27001:2022 |
|:----------:|:-----------------|:--------------------:|:----------------------:|:---------:|:------------------:|
| `SSH-001`  | SSH Management Protocol Enabled | 1.1.1 | AC-17 | SRG-APP-000142 | A.13.1.1 |
| `SSH-002`  | SSH Protocol Version 2 Enforced | 1.1.2 | SC-8 | SRG-APP-000142 | A.10.1.1 |
| `TEL-001`  | Telnet Protocol Disabled | 1.1.3 | AC-17(2) | SRG-APP-000142 | A.13.1.1 |
| `HTTP-001` | Plaintext HTTP Web Management Disabled | 1.1.4 | SC-8 | SRG-APP-000142 | A.13.1.1 |
| `HTTPS-001`| Encrypted HTTPS Web Management Enabled | 1.1.5 | SC-8 | SRG-APP-000142 | A.13.1.1 |
| `MGMT-001` | Management Plane Access List Filtering | 1.2.1 | AC-3 | SRG-APP-000142 | A.9.1.2 |
| `SESS-001` | Administrative Idle Timeout (≤ 900s) | 1.2.2 | AC-12 | SRG-APP-000190 | A.11.2.8 |
| `AAA-001`  | Centralized AAA Authentication Enabled | 2.1.1 | IA-2 | SRG-APP-000148 | A.9.2.1 |
| `PASS-001` | Minimum Password Length (≥ 14 Chars) | 2.2.1 | IA-5(1) | SRG-APP-000164 | A.9.4.3 |
| `LOCK-001` | Consecutive Login Lockout Threshold | 2.2.2 | AC-7 | SRG-APP-000345 | A.9.4.2 |
| `LOG-001`  | Remote Syslog Logging Configured | 3.1.1 | AU-6 | SRG-APP-000358 | A.12.4.1 |
| `LOG-002`  | Administrative Command Execution Auditing | 3.1.2 | AU-2 | SRG-APP-000091 | A.12.4.1 |
| `NTP-001`  | Network Time Protocol (NTP) Synchronization | 3.2.1 | AU-8 | SRG-APP-000371 | A.12.4.4 |
| `NTP-002`  | Cryptographic NTP Authentication Key | 3.2.2 | AU-8(1) | SRG-APP-000372 | A.12.4.4 |
| `CRYP-001` | Approved Cryptographic Ciphers (AES/SHA) | 4.1.1 | SC-13 | SRG-APP-000416 | A.10.1.1 |
| `BAN-001`  | Authorized Access Legal Warning Banner | 1.3.1 | AC-8 | SRG-APP-000068 | A.13.1.2 |

---

## 5. Two-Minute Live Demonstration Script

Follow this curated sequence to demonstrate the end-to-end capabilities of TĀRĀ-NETRA:

1. **Overview & Astronomical SBM Core (0:00 - 0:20)**:
   - Load the homepage. Highlight the **Yantra SBM Astronomical Core** diagram representing the convergence of Vendors, Semantics, Frameworks, and Remediation.
   - Click **"✧ Instrument Guide & Tutorial"** to demonstrate the self-guided onboarding modal.
2. **Analyze Unknown Vendor Configuration (0:20 - 0:45)**:
   - Navigate to `#/analyze` and click **"Load Unknown Vendor Sample"** (`BRANCH-GW-04`).
   - Note that the vendor is identified with unrecognized directives highlighted in amber and red.
   - Select line `set secure-admin session-limit 900` to inspect its normalized SBM hypothesis in the central inspector.
3. **Zero-Scroll Training Studio: Batch Learning (0:45 - 1:15)**:
   - Click **"Open Training Studio"** (`#/training`).
   - Observe the two-column master-detail layout: the left ledger scrolls internally, while the right Scholar’s Teaching Desk remains pinned.
   - Demonstrate the **"✧ Learn All Hypotheses"** button: click it once to inscribe all unknown directives into persistent TĀRĀ Memory in a single batch.
   - Observe the instant re-analysis: all constructs transition to `✓ LEARNED` with 97% confidence.
4. **Compliance Heatmap & Security Debt (1:15 - 1:35)**:
   - Navigate to `#/compliance`.
   - Inspect compliance scores across CIS, NIST, STIG, and ISO.
   - Toggle the **Heatmap Matrix** to visualize category-by-category adherence.
   - Review the **Security Debt** panel calculating weighted vulnerability exposure.
5. **Explainability & TĀRĀ RESOLVE (1:35 - 1:50)**:
   - Navigate to `#/findings` and select a failing control.
   - Trace the 5-step explainability chain: `Raw CLI → SBM Interpretation → Security Control → Framework → Result`.
   - Switch to `#/remediation` (**TĀRĀ RESOLVE**), inspect the vendor-tailored CLI fix and verification command, and click **"Approve Remediation"**.
6. **Tamper-Evident Evidence & TĀRĀ PROOF PDF (1:50 - 2:00)**:
   - Navigate to `#/evidence` (**TĀRĀ PROOF**).
   - Verify the SHA-256 hash generated via the native Web Crypto API.
   - Click **"Generate TĀRĀ PROOF PDF"** to produce an audit-ready, cryptographically sealed compliance package.

---

## 6. Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/manas/Tara-NETra.git
cd Tara-NETra

# 2. Install dependencies
npm install

# 3. Launch local Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173/Tara-NETra/`.

### Production Build
```bash
# Build the production bundle
npm run build

# Preview the production bundle locally
npm run preview
```

---

## 7. Automated Deployment to GitHub Pages

TĀRĀ-NETRA requires zero backend infrastructure and is configured for automated deployment to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```yaml
name: Deploy TARA-NETRA
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: actions/deploy-pages@v4
        id: deployment
```

To enable GitHub Pages in your repository:
1. Navigate to **Settings** > **Pages** in your GitHub repository.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main`; the workflow will automatically compile and publish the site.

---

## 8. Data Privacy & Security Sovereignty

- **100% In-Browser Execution**: Network configurations, topology diagrams, hostnames, and credentials never leave the user's browser.
- **Air-Gapped Operation**: Once assets are cached by the browser, TĀRĀ-NETRA functions fully in air-gapped and disconnected environments.
- **Cryptographic Evidence Seals**: Web Crypto API SHA-256 hashing guarantees tamper-evident validation for all inputs and assessment artifacts.
- **No Third-Party Telemetry**: Zero analytics trackers, third-party cookies, or telemetry beacons.

---

## 9. Project Metadata & Hackathon Information

- **Project**: TĀRĀ-NETRA (तारानेत्र)
- **Initiative**: Smart India Hackathon (SIH 2026)
- **Theme**: Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance
- **License**: [MIT License](LICENSE)

**TĀRĀ-NETRA: Understand. Learn. Audit. Assure.**
