# AuraShield AI — Real-Time Employment Fraud & Credential Verification Suite

AuraShield AI is an intelligent forensic platform designed to protect students, job seekers, and corporate HR teams from fraudulent employment advertisements, pay-to-work schemes, fake internship certificates, and unauthorized LinkedIn experience claims using real-time data inputs and multimodal AI auditing.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions and architectural choices were confirmed during Phase 1:
> - **Brand Identity**: The app is officially named **AuraShield AI**, combining melodious brand aesthetics with high-integrity cybersecurity defense.
> - **Real-Time Input Coverage**: In addition to sample test cases, the system natively supports all four real-time data ingestion pipelines:
>   1. Universal Live Input (raw text, offer letters, employment contracts)
>   2. Direct Job Post & Domain URL live fetch and inspection
>   3. Quick Multimodal Image & Document scan (certificate and offer letter uploads)
>   4. Multi-channel Chat Forward Parser (WhatsApp forwards, Telegram recruitment messages, SMS alerts)
> - **Immediate Risk Display**: Results feature a prominent Hero Gauge showcasing the exact **Risk Percentage (0–100%)** alongside direct tier badges: **CRITICAL RISK**, **HIGH RISK**, **LOW RISK**, or **NO RISK / SAFE**.
> - **Scope Expansion**: Covers full-time job scams, freelance/task traps, internship fraud, fake certificate forensics, and company HR LinkedIn verification.

---

## 1. Overview & Core Concept

### What It Does
AuraShield AI analyzes real-time employment listings, offers, contracts, and certificates to detect fraud indicators including advance-fee extortion, shell company domains, unrealistic compensation schemes, and forged credentials. It provides immediate risk percentages, categorized forensic red flags, company domain audits, and legal enforcement templates for HR recruiters.

### Target Audience
- **Students & Freshers**: Verifying internship offers, freelance gigs, and campus job listings.
- **Job Seekers & Freelancers**: Checking remote work contracts and task assignments.
- **Company HR & Legal Teams**: Catching candidates claiming fake certificates or inflated job titles on LinkedIn.
- **Colleges & Placement Cells**: Verifying student internship certificates before granting academic credits.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AuraShield AI Workspace                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
   [Offer & Job Scanner]                           [Certificate Forensics]
   - Paste custom real-time text                   - Upload scan / image / PDF
   - Enter live job URL                            - Verify QR / Registry URL
   - Upload contract/document                      - Check date paradoxes & seals
   - Parse WhatsApp/Telegram chat                  - Flag CEO signature forgeries
           │                                                 │
           └────────────────────────┬────────────────────────┘
                                    │
                                    ▼
                [Prominent Hero Gauge & Instant Verdict]
                - Risk Percentage (e.g. 96%)
                - Direct Tier Badge (CRITICAL RISK | HIGH | LOW | NO RISK)
                - Suspicious Phrases Inspector (Click to reveal context)
                - Payment & Deposit Detection Alert
                - Company Registry & Domain Authentication Matrix
                - Action Checklist & Safe Questions for Recruiter
                                    │
                                    ▼
                 [Company HR Verification & Enforcement]
                 - Audit LinkedIn announcement text against official roster
                 - One-click Formal HR Discrepancy / Cease-and-Desist Notice
                 - One-click LinkedIn Fraud & Trademark Infringement Report
```

### Visual Identity & Theme
- **Aesthetic Direction**: High-trust Cyber-Defense & Corporate Integrity Console. Deep neutral slate canvas (`#090D16`), cool steel borders (`#1E293B`), and crisp typography.
- **Typography**: 
  - Brand & Section Headers: `Plus Jakarta Sans` (clean geometric clarity)
  - Data & Telemetry Figures: `JetBrains Mono` with `tabular-nums`
- **Color Discipline (60-30-10)**:
  - 60% Slate canvas (`bg-slate-950`)
  - 30% Structural cards and hairline borders (`bg-slate-900/90`, `border-slate-800`)
  - 10% Semantic accents:
    - `CRITICAL RISK`: Crimson (`#E11D48` / `text-rose-400`)
    - `HIGH RISK`: Amber-Orange (`#F97316` / `text-orange-400`)
    - `LOW RISK`: Golden Honey (`#EAB308` / `text-amber-400`)
    - `NO RISK / SAFE`: Emerald Mint (`#10B981` / `text-emerald-400`)
- **Top Bar Contract**:
  - Left: `AuraShield AI` wordmark in `Plus Jakarta Sans`
  - Center: Single-line navigation links (`Offers & Jobs`, `Certificate Forensics`, `HR Portal`, `Scam Blacklist`, `Safety Guide`)
  - Right: Primary action button (`Run Real-Time Scan`)

---

## 3. Key Product Decisions & Trade-Offs

### 1. Real-Time URL Fetch & Multi-Channel Forward Parsing
- **Chosen Approach**: Built-in server proxy `/api/fetch-url` that pulls live web page content from user-provided job posting URLs (LinkedIn, Indeed, company portals, or suspicious landing pages) and feeds extracted text into the forensic pipeline. In parallel, a client-side and server-side chat parser unpacks unstructured forwards from WhatsApp and Telegram, automatically extracting contacts, phone numbers, and payment prompts.
- **Why**: Students frequently receive job offers via informal links or chat forwards rather than structured job descriptions.

### 2. Immediate Risk Percentage & 4-Tier Classification
- **Chosen Approach**: Prominent Hero Gauge rendering the computed percentage (0–100%) and four standard tiers:
  - `90% – 100%`: **CRITICAL RISK** (Confirmed Advance-Fee Scam / Task Trap / Identity Theft)
  - `50% – 89%`: **HIGH RISK** (Multiple deceptive phrases, webmail recruiter, unverified entity)
  - `15% – 49%`: **LOW RISK** (Minor ambiguities or unusual terms; requires clarification)
  - `0% – 14%`: **NO RISK / VERIFIED SAFE** (Legitimate corporate hiring standards)
- **Why**: Directly satisfies user instruction for immediate risk visibility upon scanning.

### 3. Comprehensive HR Verification & Anti-Impersonation Portal
- **Chosen Approach**: Dedicated corporate portal allowing HR departments to:
  - Cross-check candidate claims against their official intern/employee roster.
  - Automatically audit candidate LinkedIn post text for role inflation or forged credentials.
  - Generate ready-to-send formal Cease-and-Desist notices and LinkedIn trademark infringement reports.
- **Why**: Directly addresses the user's specific request for HR departments to identify and take action against people posting fake certificates on LinkedIn.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AuraShield AI Client                          │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Real-Time Input Tabs: Text | Live URL | Image/PDF | Chat Forward │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│                                ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Prominent Hero Gauge (0-100% Risk) + Tier Badge (4 Levels)      │  │
│  │ Suspicious Phrases | Fee Traps | Domain Audit | Action Steps    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTP / JSON
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Express Backend (server.ts)                      │
│                                                                        │
│  POST /api/detect/offer        POST /api/detect/certificate           │
│  POST /api/hr/verify-claim     POST /api/fetch-live-url                │
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │ Gemini 3.8 Flash Engine│ <─fail─>│ Local Forensic Heuristics    │  │
│  │ (Low Thinking Latency) │         │ (Zero-Lag Guaranteed Fallback)│  │
│  └────────────────────────┘         └───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Structure
1. **`Navbar.tsx`**: Updated with `AuraShield AI` branding, single-line links, and quick scan button.
2. **`JobScanner/`**:
   - `JobScanner.tsx`: Real-time input switcher supporting:
     - Direct text / custom job details
     - Live URL input with "Fetch & Analyze" button
     - Multi-channel Chat Forward input with automatic regex entity extraction
     - Image & PDF drag-and-drop
     - Sample presets for quick testing
   - `JobRiskReport.tsx`: Prominent Hero Gauge, 4-tier risk badge (`CRITICAL RISK`, `HIGH RISK`, `LOW RISK`, `NO RISK`), suspicious phrases inspector, payment fee alerts, and printable report export.
3. **`CertificateScanner/`**:
   - `CertificateScanner.tsx`: Image/PDF upload + metadata verification.
   - `CertificateReport.tsx`: Forensic authenticity gauge, template-mill checks, date paradox analysis, and credential ID sanity checks.
4. **`HrPortal/`**:
   - `HrPortal.tsx`: LinkedIn claim auditor, internal verified roster, formal notice generator, and fraud ledger.
5. **`ScamDirectory/` & `SafetyGuide/`**:
   - Community blacklist directory with live scam reporting and official legal verification guides.
