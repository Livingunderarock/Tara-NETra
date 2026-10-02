# TĀRĀ-NETRA
## Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance
### *The Guiding Eye for Network Security*

> **"Different vendors speak different configuration languages. TĀRĀ-NETRA learns the security meaning behind them."**

[![Deploy TARA-NETRA](https://github.com/manas/Tara-NETra/actions/workflows/deploy.yml/badge.svg)](https://github.com/manas/Tara-NETra/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

---

## 1. Executive Summary

**TĀRĀ-NETRA** is a browser-based, vendor-agnostic network security compliance engine engineered for heterogeneous enterprise and critical infrastructure networks (routers, firewalls, switches, cloud security groups, and white-box network appliances).

Instead of maintaining brittle, vendor-specific syntax parsers for every proprietary operating system (Cisco IOS, Fortinet FortiOS, Juniper Junos, White-box Linux, etc.), TĀRĀ-NETRA introduces:
1. **TĀRĀ Intelligence Core**: A multi-layered semantic interpretation engine that normalizes raw CLI constructs into a vendor-neutral **Security Baseline Model (SBM)**.
2. **Confidence-Aware Interpretation**: Assigns confidence scores (`RECOGNIZED`, `INFERRED`, `LOW_CONFIDENCE`, `UNKNOWN`, `LEARNED`) to configuration directives.
3. **Human-in-the-Loop Training Studio**: An interactive learning interface where administrators teach the system unknown commands, persistently updating the browser knowledge base without rebuilding or redeploying code.
4. **Deterministic Compliance Engine**: AI assists in understanding syntax, but deterministic security rules decide compliance (`PASS`, `FAIL`, `UNKNOWN`) against **CIS Benchmarks**, **NIST SP 800-53**, **DISA STIGs**, and **ISO/IEC 27001**.
5. **Tamper-Evident Audit Evidence (TĀRĀ PROOF)**: Generates audit-ready PDF packages with SHA-256 cryptographic hashes for the source configuration and assessment results.

---

## 2. The Core Innovation: The Learning Loop

Traditional compliance tools break when encountering unfamiliar configuration syntax. TĀRĀ-NETRA handles syntactic diversity through an intuitive learning loop:

```
    ┌──────────┐
    │ UNKNOWN  │ (Unknown vendor or novel CLI syntax detected)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ EXPLAIN  │ (TĀRĀ Core presents confidence-aware hypothesis)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  TEACH   │ (Administrator assigns security concept in Training Studio)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  LEARN   │ (Stored in persistent TĀRĀ Memory via IndexedDB / localStorage)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  VERIFY  │ (Reprocess configuration with updated 97% confidence)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  AUDIT   │ (Multi-framework compliance report + SHA-256 evidence)
    └──────────┘
```

> **Signature Statement:** *A new vendor should not require a new parser deployment.*

---

## 3. Architecture

TĀRĀ-NETRA is designed with a **Browser-First Architecture**, meaning the entire ingestion, parsing, semantic normalization, compliance evaluation, and report generation happens client-side in the browser:

```
                            GITHUB PAGES (Static Host)
                                        │
                                        ▼
                           ┌──────────────────────────┐
                           │    TĀRĀ-NETRA Web UI     │
                           │   (React 19 + Vite + CSS)│
                           └────────────┬─────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
      Config Ingestion           Training Studio            Reporting Engine
      (Dropzone / Raw)         (Interactive Learn)          (TĀRĀ PROOF PDF)
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        ▼
                           ┌──────────────────────────┐
                           │  TĀRĀ Intelligence Core  │
                           │(Layered Pattern Matcher) │
                           └────────────┬─────────────┘
                                        │
                                        ▼
                           ┌──────────────────────────┐
                           │ Security Baseline Model  │
                           │ (Vendor-Neutral Semantics│
                           └────────────┬─────────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     ▼                                     ▼
          Compliance Engine (Rules)                   TĀRĀ Memory
          ├── CIS Benchmarks                     (IndexedDB / Storage)
          ├── NIST SP 800-53                               │
          ├── DISA STIGs                                   ▼
          └── ISO/IEC 27001                          Evidence Hash
                     │                            (Web Crypto SHA-256)
                     ▼                                     │
          Findings & Remediation                           ▼
          (TĀRĀ RESOLVE CLI Fixes)                  Downloadable PDF
```

### Layered Interpretation Engine:
- **Layer 1 (Exact Pattern Matching)**: Matches known vendor CLI idioms with high confidence (95–100%).
- **Layer 2 (Cross-Vendor Inference)**: Applies heuristic patterns across vendors for unknown operating systems (70–85%).
- **Layer 3 (Learned Mappings)**: Checks administrator-trained mappings stored in TĀRĀ Memory (97%).
- **Layer 4 (Fuzzy Semantic Aliases)**: Identifies keywords and compound tokens (e.g., `session-limit`, `admin-access`) to propose hypotheses (40–65%).
- **Layer 5 (Unknown Construct Detection)**: Accurately flags unmapped commands for human-in-the-loop teaching.

---

## 4. Visual Identity & Design System

The application features an **Ancient Indian Cyber-SOC Design System** combining Mission Control, modern Security Operations, and Vedic astronomical symbolism:
- **Aesthetic**: Deep void backgrounds (`#0a0c14`, `#0d0f19`), star-gold accents (`#D4A843`), electric cyan telemetry (`#00E5FF`), and purple learning indicators (`#7C4DFF`).
- **Motifs**: Concentric celestial eye/star visualizations, sacred geometry mandala dividers, and Vedic glyphs (`◉`, `⬡`, `⚡`, `◈`, `◆`, `⚠`, `⟳`, `◎`).
- **Typography**: Clean, technical display using **Rajdhani**, **Noto Sans Devanagari**, and **JetBrains Mono**.

---

## 5. Security Controls & Framework Crosswalk

TĀRĀ-NETRA evaluates high-value controls mapped across global cybersecurity standards:

| Control ID | Semantic Concept | CIS Benchmark | NIST SP 800-53 | DISA STIG | ISO/IEC 27001 |
|------------|------------------|---------------|----------------|-----------|---------------|
| `SSH-001`  | SSH Enabled | 1.1.1 | AC-17 | SRG-APP-000142 | A.13.1.1 |
| `SSH-002`  | SSH Protocol Version 2 | 1.1.2 | SC-8 | SRG-APP-000142 | A.10.1.1 |
| `TEL-001`  | Telnet Disabled | 1.1.3 | AC-17(2) | SRG-APP-000142 | A.13.1.1 |
| `HTTP-001` | HTTP Web Management Disabled | 1.1.4 | SC-8 | SRG-APP-000142 | A.13.1.1 |
| `HTTPS-001`| HTTPS Web Management Enabled | 1.1.5 | SC-8 | SRG-APP-000142 | A.13.1.1 |
| `MGMT-001` | Management Access Filtering | 1.2.1 | AC-3 | SRG-APP-000142 | A.9.1.2 |
| `SESS-001` | Session Idle Timeout (≤ 900s) | 1.2.2 | AC-12 | SRG-APP-000190 | A.11.2.8 |
| `AAA-001`  | AAA Authentication Enabled | 2.1.1 | IA-2 | SRG-APP-000148 | A.9.2.1 |
| `PASS-001` | Minimum Password Length (≥ 14) | 2.2.1 | IA-5(1) | SRG-APP-000164 | A.9.4.3 |
| `LOCK-001` | Account Lockout Threshold | 2.2.2 | AC-7 | SRG-APP-000345 | A.9.4.2 |
| `LOG-001`  | Remote Syslog Enabled | 3.1.1 | AU-6 | SRG-APP-000358 | A.12.4.1 |
| `LOG-002`  | Administrative Activity Logging | 3.1.2 | AU-2 | SRG-APP-000091 | A.12.4.1 |
| `NTP-001`  | NTP Synchronization Enabled | 3.2.1 | AU-8 | SRG-APP-000371 | A.12.4.4 |
| `NTP-002`  | NTP Cryptographic Authentication| 3.2.2 | AU-8(1) | SRG-APP-000372 | A.12.4.4 |
| `CRYP-001` | Strong Encryption Ciphers | 4.1.1 | SC-13 | SRG-APP-000416 | A.10.1.1 |
| `BAN-001`  | Authorized Access Login Banner | 1.3.1 | AC-8 | SRG-APP-000068 | A.13.1.2 |

---

## 6. Two-Minute Live Demonstration Script

Follow this sequence to experience TĀRĀ-NETRA's end-to-end capabilities:

1. **Overview (0:00 - 0:15)**:
   - Observe the Mission Control dashboard, the animated **TĀRĀ Core** eye motif, and real-time metrics.
2. **Analyze Unknown Vendor (0:15 - 0:35)**:
   - Navigate to `#/analyze` and click **"Load Unknown Vendor Sample"** (`BRANCH-GW-04`).
   - Observe: Vendor is detected as `Unknown (0%)`, with recognized constructs and low-confidence/unknown directives highlighted in red/amber.
   - Click line `set secure-admin session-limit 900` to inspect the Semantic Model panel.
3. **Training Studio: Teach TĀRĀ (0:35 - 1:05)**:
   - Click **"Open Training Studio"**.
   - Select the unknown construct (`set secure-admin session-limit 900`).
   - Select concept: `Session Timeout (session_timeout)`.
   - Click **"⚡ Teach & Reprocess"**.
   - Notice the **Before (Unknown 62%) → Human Training → After (Learned 97%)** transition animation.
4. **Compliance & Heatmap (1:05 - 1:25)**:
   - Navigate to `#/compliance`.
   - View compliance scores across CIS, NIST, STIG, and ISO.
   - Switch to the **Heatmap** tab for a visual matrix across categories.
   - Switch to **Security Debt** to view weighted vulnerability metrics.
5. **Evidence Chain & Remediation (1:25 - 1:45)**:
   - Navigate to `#/findings` and click any failing control.
   - Trace the 5-step explainability chain: `Raw CLI → Semantic Interpretation → Security Control → Framework → Compliance Result`.
   - Navigate to `#/remediation` (**TĀRĀ RESOLVE**), inspect vendor-specific CLI remediation and verification commands, and click **"Approve Remediation"**.
6. **Audit Evidence & SHA-256 (1:45 - 2:00)**:
   - Navigate to `#/evidence` (**TĀRĀ PROOF**).
   - View the configuration SHA-256 hash.
   - Click **"Generate TĀRĀ PROOF PDF"** to download an audit-grade evidence package.

---

## 7. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/manas/Tara-NETra.git
cd Tara-NETra

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/Tara-NETra/` in your browser.

---

## 8. Deployment to GitHub Pages

TĀRĀ-NETRA requires zero backend infrastructure. It deploys automatically to GitHub Pages using the included GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```bash
# Build the production bundle
npm run build

# Output will be generated in ./dist
```

To enable GitHub Pages in your repository:
1. Go to **Settings** > **Pages** in your GitHub repository.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Push changes to the `main` branch; the workflow will build and publish your site automatically.

---

## 9. Security & Governance

- **Zero Cloud Leakage**: All configuration analysis is executed locally inside the browser. No configuration text or device credentials are ever sent to external endpoints.
- **Synthesized Benchmarks**: Sample datasets use sanitized configurations containing non-routable IP addresses and placeholder credentials.
- **Cryptographic Integrity**: Source configurations and generated compliance evidence are hashed with SHA-256 using the native Web Crypto API.

---

## 10. Team & Acknowledgments

Built for **Smart India Hackathon (SIH 2026)**.

**TĀRĀ-NETRA: Understand. Learn. Audit. Assure.**
