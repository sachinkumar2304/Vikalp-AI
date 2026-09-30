# Vikalp AI — Project Report

**Team:** BinaryDNF  
**Smart India Hackathon 2026 | PS ID: SIH26097**  
**Ministry of Social Justice and Empowerment (MoSJE), Government of India**  
**Problem Statement:** AI-Driven Voice Assistant for Livelihood Mapping and NSQF-Aligned Skilling Recommendations for SC Communities under the GIA Component of PM-AJAY

---

## 1. Overview

Vikalp AI is a voice-first, dialect-aware AI system designed for rural Scheduled Caste (SC) beneficiaries under the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Grant-in-Aid (GIA) skilling component.

The system allows beneficiaries to speak in Hindi, Bhojpuri, Marathi, or Indian English to receive personalised, constraint-verified NSQF-aligned skilling recommendations — with no paperwork, no complex forms, and no English literacy required.

---

## 2. Problem

### 2.1 Target Beneficiaries
Rural SC youth, artisans, women SHGs, and daily wage workers in districts such as Varanasi, Chandauli, and similar Tier-3/Tier-4 clusters.

### 2.2 Core Challenges

| Challenge | Real-World Impact |
|---|---|
| English-only portals | Beneficiaries cannot self-register or navigate |
| No informal skill recognition | Prior trade skills (carpentry, tailoring) go unmapped |
| Mobility constraints | Women and daily wage workers cannot travel beyond village radius |
| Generic AI chatbots | Recommend ineligible courses with no constraint checking |
| No transparency | Black-box decisions cannot be audited by ministry officials |

### 2.3 Specific Gap Addressed
Existing systems map beneficiaries to courses without verifying mobility feasibility, educational prerequisites, or geographic distance to training centres. A woman restricted to within-village radius being mapped to a 3-month residential course 120 km away is a concrete failure mode that Vikalp AI explicitly prevents.

---

## 3. Solution

Vikalp AI introduces a three-layer approach:

**Layer 1 — Voice-First Input**  
Browser-native Web Speech API (Hindi/Bhojpuri/Marathi/English) captures beneficiary responses across 6 structured interview turns. No app download or internet-heavy infrastructure needed.

**Layer 2 — Transparent Profile Extraction**  
Each spoken response is parsed into a structured `BeneficiaryProfile` JSON with field-level `{value, confidence, source, turn}` tracking. The system knows how confident it is about each data point and triggers clarification when confidence is too low.

**Layer 3 — Deterministic Scoring with Hard Constraints**  
A rule-based scoring engine (not an LLM) makes final course recommendations using 6 transparent named weights. Hard constraint checks explicitly refuse courses where eligibility or mobility requirements conflict, with plain-language refusal reasons available to ministry auditors.

---

## 4. Main Modules

### 4.1 Voice Interview Engine (`interview_manager.py`)
- 6 core questions: Name/Location, Education, Occupation, Skills, Aspirations, Mobility
- Turn-by-turn slot extraction with confidence scoring
- Clarification triggers for low-confidence responses
- Supports Hindi and English instruction sets

### 4.2 Beneficiary Profile Schema (`schemas/pmajay.py`)
- Strict Pydantic v2 model
- Fields: `basic_info`, `education`, `current_livelihood`, `aspirations`, `constraints`, `system_inferred`, `metadata`
- Each field: `{value, confidence (0.0–1.0), source, turn}`

### 4.3 Deterministic Scoring Engine (`scoring_engine.py`)
- 6 Named Weights:
  - Interest/Aspiration: 25%
  - Location/Distance: 20%
  - Prior Skills Match: 15%
  - Education Level: 15%
  - Local Market Demand: 15%
  - Mobility Range: 10%
- Hard refusals when: mobility_required > beneficiary_range, education < minimum_required, trade prerequisites unmet
- Returns: match score, plain-language reasons, skill gaps, voice summary string

### 4.4 NSQF Qualification Catalog (`data/nsqf_catalog.py`)
- 18 curated NSQF Level 3–5 rural qualification packs
- Includes: Solar PV Installer (Suryamitra), Self-Employed Tailor, Food Processing, Electrician, Plumber, Mason, EV Mechanic, Jal Jeevan Pipeline Operator, Home Appliance Repair, and more
- District cluster opportunities (Varanasi / Chandauli) with wage ranges, distances, employer contacts
- 3 nearest accredited PMKK training centres

### 4.5 API Layer (`api/v1/endpoints/pmajay.py`)
| Endpoint | Method | Purpose |
|---|---|---|
| `/pmajay/interview/start` | POST | Create session, return Q1 |
| `/pmajay/interview/turn` | POST | Process response, return next Q |
| `/pmajay/profile/{session_id}` | GET | Retrieve built profile |
| `/pmajay/recommendations/evaluate` | POST | Run scoring, return ranked matches |
| `/pmajay/admin/dashboard` | GET | Ministry audit metrics |
| `/pmajay/ask-saathi` | POST | AMA agent with topic boundary guardrails |

### 4.6 Frontend — 7 Dedicated Screens
| Screen | Route | Purpose |
|---|---|---|
| Landing Portal | `/pmajay` | Scheme overview, voice CTAs |
| Language Selection | `/pmajay/language` | Dialect selector with audio samples |
| Voice Interview | `/pmajay/interview` | Live 6-turn speech conversation |
| Profile Summary | `/pmajay/profile` | Extracted profile + confidence + JSON view |
| NSQF Recommendations | `/pmajay/recommendations` | Ranked matches, refusal logs, audio summary |
| Local Opportunities | `/pmajay/opportunities` | District cluster vacancies and grants |
| Admin Dashboard | `/pmajay/admin` | Ministry KPI audit and case logs |

### 4.7 Vikalp AI Voice Guide Widget (`VoiceGuideWidget.tsx`)
- Persistent floating audio indicator on all 7 screens
- Glowing animated mic avatar with soundwave visualizer
- Interactive step-by-step website tour
- AMA (Ask Me Anything) voice agent with:
  - Allowed: PM-AJAY, 18 NSQF courses, ₹50,000 toolkit, eligibility, documents, interview steps
  - Blocked: Generic trivia, prompt injections, backend API probing
  - 10-tier violation tracker with session lockout after repeated boundary crossings

---

## 5. Architecture

See: [`architecture.md`](architecture.md) for full flow diagram.

**Summary flow:**
```
Beneficiary Voice → ASR (Browser) → Interview Engine (Backend) 
→ Profile JSON → Constraint Filter → Scoring Engine → NSQF Pathway 
→ District Opportunity → Admin Audit
```

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Voice Input (ASR) | Browser Web Speech API (Chrome/Edge) |
| Voice Output (TTS) | Browser SpeechSynthesis + Sarvam/Bhashini (Prototype) |
| Backend | FastAPI, Python 3.11, Pydantic v2 |
| Scoring Engine | Custom deterministic rule-based (no LLM for decisions) |
| Database | SQLite (prototype), Supabase (legacy LMS, not used in PM-AJAY) |
| Auth | JWT (FastAPI) |
| Deployment | Vercel (Frontend), Render (Backend) |
| Rate Limiting | SlowAPI |
| Security | Custom security headers middleware, CORS, input validation |

---

## 7. Edge Cases Handled

| Edge Case | Handling |
|---|---|
| Low-confidence response | System asks targeted clarification question instead of guessing |
| Mobility conflict | Hard refusal: course refused if mobility_required > beneficiary_stated_range |
| Education below minimum | Course excluded with clear reason returned |
| No prior skills | Fallback to market-demand-only ranking |
| API offline | Frontend offline-resilient demo fallback mode |
| Voice not supported | Alert shown; beneficiary can type or use quick-preset answers |
| Invalid/harmful AMA queries | 10-tier refusal + session lockout warning after 10 violations |

---

## 8. Privacy & Security

- **No PII storage in production** — profile data is session-scoped and not persisted beyond demo
- **Credentials via environment variables only** — `.env.example` provided, real secrets never committed
- **Security headers middleware** — X-Content-Type-Options, X-Frame-Options, XSS protection
- **CORS restricted** — only Vercel deployment domains and localhost whitelisted
- **Rate limiting** — SlowAPI enforces per-IP request caps
- **AMA boundary guardrails** — blocks backend API probing, prompt injection, and off-topic queries

---

## 9. Expected Impact

| Metric | Estimate (Based on PM-AJAY Pilot Scale) |
|---|---|
| Target beneficiaries reachable | 2.1 lakh SC youth in Varanasi / Chandauli cluster |
| Form-filling barrier eliminated | 100% voice-based — zero literacy requirement |
| Ineligible course assignments prevented | Hard constraint engine refuses ~35–40% of naive LLM matches |
| Ministry audit transparency | Every match and refusal logged with reason and confidence score |
| Cost per interview | Near zero — browser ASR, no GPU server required |

> Note: These are estimates based on PM-AJAY scheme documentation and district-level beneficiary data. No real deployment metrics are available at prototype stage.

---

## 10. Future Scope

| Feature | Priority |
|---|---|
| Bhashini/Sarvam live ASR + TTS API integration | High |
| Aadhaar-linked beneficiary session persistence | High |
| SMS/WhatsApp follow-up with training center contacts | High |
| Offline kiosk deployment (Raspberry Pi, village van) | Medium |
| Pre-skilling assessment quiz (MCQ voice-based) | Medium |
| Digital certificate generation post-training | Medium |
| Gamified skilling progress tracker | Low |
| Multi-state district cluster expansion | High |

---

## 11. References

1. Ministry of Social Justice and Empowerment — PM-AJAY Scheme Guidelines (2023)
2. National Skills Qualifications Framework (NSQF) — MoSDE, 2015: [nqr.gov.in](https://nqr.gov.in)
3. SIH 2026 Problem Statement SIH26097 — MoSJE
4. Sarvam AI — Indic Speech AI: [sarvam.ai](https://www.sarvam.ai)
5. Bhashini — National Language Technology Mission: [bhashini.gov.in](https://bhashini.gov.in)
6. AI4Bharat IndicTrans2 — Multilingual Translation: [github.com/AI4Bharat/IndicTrans2](https://github.com/AI4Bharat/IndicTrans2)
7. PM Kaushal Vikas Yojana 4.0 — Training Network: [pmkvyofficial.org](https://pmkvyofficial.org)
8. ILO Report — "Skills for Better Life" — Rural Skilling in South Asia, 2022

---

*This document is prepared for Smart India Hackathon 2026 evaluation. All features not yet deployed are clearly labelled as Prototype / Planned / Future Scope.*
