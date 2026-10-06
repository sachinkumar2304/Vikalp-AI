# Vikalp AI

> An explainable voice assistant for livelihood mapping and NSQF-aligned skilling recommendations under the PM-AJAY scheme.

**Team:** BinaryDNF  
**Problem Statement:** SIH 2026 | PS ID: 26097  
**Target Group:** Rural artisans, women self-help groups, and youth under PM-AJAY Grants-in-Aid (GIA)  

---

## What Problem This Addresses

Many rural citizens and informal workers face hurdles when seeking government-sponsored skill development:

- Complex portals and text forms create barriers for people who communicate best through spoken language.
- Many workers hold years of uncertified practical experience in trades like tailoring, electrical repair, masonry, or plumbing.
- Real-world constraints (limited travel radius, family care duties, physical accessibility) often make distant or rigid classroom courses unviable.
- Typical software systems recommend distant or unsuitable training centres without checking whether the person can actually travel there.

---

## How Vikalp AI Works

Vikalp AI uses spoken dialogue and deterministic rules to connect candidates with suitable training pathways:

1. **Spoken Dialogue:** The candidate speaks naturally in their preferred language (Hindi, Bhojpuri, Marathi, or English) through browser speech recognition.
2. **Profile Mapping:** The system captures background details: location, education level, current trade, existing skills, practical experience months, and travel limits.
3. **Transparent Constraint Checks:** Before ranking, the engine verifies hard conditions:
   - **Distance:** Identifies training centres beyond the candidate's stated radius and records the exact kilometres.
   - **Curriculum Validity:** Checks qualification pack expiration dates against national standards.
   - **Accessibility:** Verifies step-free access and respects physical limitations by excluding heavy manual lifting where appropriate.
4. **Weighted Scoring:** Valid courses are evaluated using six transparent, named criteria weights:
   - Interest & Aspiration: 25%
   - Location & Accessibility: 20%
   - Existing Skills: 15%
   - Education Eligibility: 15%
   - Local Market Demand: 15%
   - Mobility Alignment: 10%
5. **Read-Back Confirmation:** If a preferred path cannot be taken due to a constraint, the system preserves the refusal, states the exact reason, and reads back the candidate's spoken words.
6. **Second Choice Decision Flow:** When the candidate confirms that limit, the system masks the blocked condition and re-evaluates options strictly across three categories:
   - **Local NSQF Class:** Accredited training at a centre within their reachable travel radius.
   - **Recognition of Prior Learning (RPL):** A 40-hour direct assessment pathway, applied when the candidate holds 12 or more months of documented practical experience and proven skill overlap.
   - **PM-AJAY Project Sheet:** Village-level collective enterprise sheets (such as common tailoring units or solar crop dryers) with enterprise market linkage.
7. **Two-Sentence Summaries:** Each recommendation provides clear communication:
   - One sentence in everyday language for the candidate.
   - One administrative sentence with the qualification pack code for the desk officer.
8. **Privacy Protection:** Candidates can clear their session and transcript at any point with the session erase control.

---

## Key Capabilities

- **Voice Dialogue:** Web-based speech input and spoken voice summaries without requiring specialized hardware.
- **Deterministic Engine:** Transparent arithmetic weights rather than opaque generative predictions.
- **Explicit Disqualification Logs:** Every excluded option lists the gate that removed it.
- **Keypad Simulator:** An interactive demonstration interface illustrating feature-phone keypad responses using the same underlying recommendation logic.
- **District Cluster Opportunities:** Demonstrates local employment and enterprise opportunities mapped to the Varanasi and Chandauli cluster.
- **Statutory Notice:** Clear guidance stating that final fund sanctions remain under the authority of the local administrative desk.

---

## Technical Architecture

### Frontend
- React 18 with TypeScript and Vite
- Tailwind CSS and Lucide React icons
- Web Speech API for voice recognition and text-to-speech synthesis

### Backend
- FastAPI (Python 3.11)
- Pydantic models for structured profile schemas
- Rule-based qualification pack mapping and constraint engine
- Local storage persistence for session continuity across page reloads

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- Python 3.11 or newer

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:8080/pmajay` in a Chromium-based browser (Chrome or Edge) for speech input support.

---

## Project Structure

```
Vikalp-AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/pmajay.py   # API endpoints and session routing
│   │   ├── data/nsqf_catalog.py         # Curated NSQF qualification packs and project sheets
│   │   ├── schemas/pmajay.py            # Pydantic schemas and profile structures
│   │   └── services/
│   │       ├── interview_manager.py     # Dialogue extraction and persistent session store
│   │       └── scoring_engine.py        # Weighted scoring and two-phase decision engine
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/pmajay/           # Reusable UI components and simulators
│   │   ├── pages/pmajay/                # Recommendation, interview, and opportunity screens
│   │   └── services/pmajayService.ts    # Frontend API client and state management
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## License and Attribution

Developed for Smart India Hackathon 2026, Problem Statement 26097, under the Ministry of Social Justice and Empowerment, Government of India.
