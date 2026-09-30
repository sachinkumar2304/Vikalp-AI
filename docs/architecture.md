# Vikalp AI — System Architecture

**Team:** BinaryDNF | **PS ID:** SIH26097  
**Ministry:** MoSJE, Government of India

---

## End-to-End System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BENEFICIARY (SC Rural)                             │
│                    Speaks in Hindi / Bhojpuri / Marathi / English           │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     VOICE INPUT LAYER (Frontend — Browser)                  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────┐                  │
│  │  Web Speech API (Chrome/Edge)                        │                  │
│  │  - Language: hi-IN / en-IN / mr-IN                   │                  │
│  │  - continuous=true, interimResults=true              │                  │
│  │  - 0ms latency, no GPU, no cloud ASR needed          │                  │
│  └──────────────────────────────────────────────────────┘                  │
│                                                                             │
│  Fallback: Manual text input / Quick Preset Answers                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  HTTP POST /pmajay/interview/turn
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERVIEW ENGINE (Backend — FastAPI)                      │
│                                                                             │
│  Turn 1:  Name, Location, Caste Category                                   │
│  Turn 2:  Education level                                                   │
│  Turn 3:  Current occupation / livelihood                                   │
│  Turn 4:  Prior skills and trades                                           │
│  Turn 5:  Aspirations / interest areas                                      │
│  Turn 6:  Mobility constraints (village / district / state)                 │
│                                                                             │
│  Per Turn:                                                                  │
│  ┌─────────────────────────────────────────────────────┐                   │
│  │  Slot Extraction → Confidence Score (0.0–1.0)       │                   │
│  │  If confidence < 0.5 → Clarification question       │                   │
│  │  Source tracked: {value, confidence, source, turn}  │                   │
│  └─────────────────────────────────────────────────────┘                   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BENEFICIARY PROFILE (Pydantic Schema)                  │
│                                                                             │
│  basic_info:           { name, location, category: SC }                    │
│  education:            { highest_level, confidence }                        │
│  current_livelihood:   { occupation, income_range, skills[] }              │
│  aspirations:          { interest, preferred_trade, employment_mode }       │
│  constraints:          { mobility_range, family_commitment }                │
│  system_inferred:      { informal_skills[], district_tier }                 │
│  metadata:             { profile_completeness, total_turns, session_id }   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONSTRAINT FILTER (Hard Rules — No ML)                   │
│                                                                             │
│  CHECK 1: mobility_required > beneficiary_mobility_range?                  │
│           → REFUSE (reason: "Course requires district travel, beneficiary   │
│             stated within-village mobility only")                           │
│                                                                             │
│  CHECK 2: education_required > beneficiary_education?                      │
│           → REFUSE (reason: "Minimum 10th pass required; beneficiary       │
│             stated 8th pass")                                               │
│                                                                             │
│  CHECK 3: trade_prerequisites not met?                                     │
│           → REFUSE with gap summary                                         │
│                                                                             │
│  PASS → Proceed to Scoring Engine                                           │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             DETERMINISTIC SCORING ENGINE (Transparent — No LLM)             │
│                                                                             │
│  Weight 1: Interest / Aspiration Match     25%                              │
│  Weight 2: Location / Distance Score       20%                              │
│  Weight 3: Prior Skills Match              15%                              │
│  Weight 4: Education Level Fit             15%                              │
│  Weight 5: Local Market Demand             15%                              │
│  Weight 6: Mobility Feasibility            10%                              │
│                                                           ─────             │
│  Final Score = Σ (weight × match_value)   TOTAL:         100%              │
│                                                                             │
│  Output per course:                                                         │
│  - match_score (0–100)                                                      │
│  - match_reasons[] (plain language)                                         │
│  - skill_gaps[] (what beneficiary needs to learn)                           │
│  - voice_summary (TTS-ready 2-line Hindi/English summary)                  │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              NSQF-ALIGNED PATHWAY (18 Curated Rural Packs)                  │
│                                                                             │
│  Sample Packs (NSQF Level 3–5):                                             │
│  • Solar PV Installer / Suryamitra (L4, 300 hrs)                           │
│  • Self-Employed Tailor & Boutique (L4, 340 hrs)                           │
│  • Home Appliance Repair Technician (L4, 360 hrs)                          │
│  • Jal Jeevan Pipeline Operator (L3, 240 hrs)                              │
│  • Food Processing Entrepreneur (L3, 200 hrs)                              │
│  • Construction Mason (L3, 180 hrs)                                         │
│  • (+ 12 more trades mapped to Varanasi/Chandauli district)                │
│                                                                             │
│  Output: Top 3 ranked recommendations with full attribution                │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              TRAINING & OPPORTUNITY LINKAGE (District Cluster)              │
│                                                                             │
│  Nearest Kaushal Kendras:                                                   │
│  • PMKK Karaundi (Varanasi) — 7.6 km                                       │
│  • Baroda RSETI — Sewapuri Block                                            │
│  • Sewapuri ITI Centre — 5 km                                               │
│                                                                             │
│  PM-AJAY GIA Toolkit Subsidy:                                               │
│  • Up to ₹50,000 capital subsidy for self-employment tools/equipment        │
│  • PM Surya Ghar Muft Bijli Yojana linkage (Solar trades)                  │
│  • BDO / Nodal Officer contact included per opportunity card                │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MINISTRY ADMIN AUDIT (MoSJE Monitoring)                  │
│                                                                             │
│  Dashboard KPIs:                                                            │
│  • Total Beneficiaries Interviewed                                          │
│  • High-Confidence Matches (score ≥ 80%)                                   │
│  • Hard Constraint Refusals (with reason log)                               │
│  • Clarification Triggers (low-confidence pauses)                          │
│                                                                             │
│  Every case record stored with:                                             │
│  session_id, beneficiary_name, district, education, interest,              │
│  matched_course, score, refusal_reason (if applicable), confidence         │
│                                                                             │
│  Export: Audit Report button (prototype — CSV format planned)              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌─────────────┐     REST API      ┌──────────────────────────┐
│  React SPA  │◄─────────────────►│  FastAPI Backend          │
│  (Vercel)   │                   │  (Render)                 │
│             │  /interview/start  │                           │
│  7 Screens  │  /interview/turn  │  interview_manager.py     │
│             │  /recommendations  │  scoring_engine.py        │
│  VoiceGuide │  /admin/dashboard │  nsqf_catalog.py          │
│  Widget     │  /ask-saathi      │  pmajay.py (router)       │
└─────────────┘                   └──────────────────────────┘
       │                                      │
  Web Speech API                         SQLite DB
  (Browser-Native)                  (session storage — prototype)
       │
  SpeechSynthesis API
  (Browser TTS — zero latency)
```

---

## Data Flow: Profile Field Lifecycle

```
Spoken Text → Slot Extractor → Raw Value
                                    │
                              Confidence Score
                              (0.0 = unverified, 1.0 = certain)
                                    │
                          If confidence < 0.5 → Clarification Q
                          If confidence ≥ 0.5 → Accepted & Stored
                                    │
                    BeneficiaryProfile JSON {value, confidence, source, turn}
                                    │
                          Constraint Filter → Scoring Engine
                                    │
                          Recommendation Output with Attribution
```

---

## Security Architecture

```
Internet
   │
   ▼
[Vercel CDN — Frontend]
   │  HTTPS only
   ▼
[React App — Browser]
   │  CORS-restricted requests
   ▼
[Render — Backend FastAPI]
   │
   ├── SlowAPI Rate Limiter (per IP)
   ├── Security Headers Middleware (XSS, X-Frame, HSTS)
   ├── CORS Whitelist (Vercel domains + localhost only)
   ├── Pydantic strict input validation
   └── AMA guardrail: topic boundary + 10-tier violation tracking
```

---

*Vikalp AI — BinaryDNF | SIH 2026 | PS ID: SIH26097*
