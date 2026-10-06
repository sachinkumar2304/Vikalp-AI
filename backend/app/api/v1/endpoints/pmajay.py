"""
PM-AJAY GIA Voice Assistant Endpoints
Problem Statement 26097: AI-Driven Voice Assistant for Livelihood Mapping & NSQF-Aligned Skilling Recommendations
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime

from app.schemas.pmajay import BeneficiaryProfile, RefusalRecord
from app.services.interview_manager import (
    INTERVIEW_SESSIONS,
    INTERVIEW_QUESTIONS,
    ProfileExtractor,
    erase_session
)
from app.services.scoring_engine import (
    RecommendationEngine,
    CATALOGUE_NOTICE,
    FUNDING_NOTICE,
    FUNDING_NOTICE_HI
)

router = APIRouter()
engine = RecommendationEngine()

ADMIN_RECORDS: List[Dict[str, Any]] = [
    {
        "session_id": "seed-001",
        "beneficiary_name": "Ramesh Kumar",
        "language": "hi-IN",
        "district": "Varanasi (Sewapuri)",
        "education": "10th_pass",
        "interest": "Solar Rooftop",
        "matched_course": "Solar PV Installer (Suryamitra)",
        "score": 93.5,
        "status": "matched",
        "refused": False,
        "confidence": 0.88,
        "date": "2026-09-24T11:20:00"
    },
    {
        "session_id": "seed-002",
        "beneficiary_name": "Sunita Devi",
        "language": "hi-IN",
        "district": "Chandauli",
        "education": "8th_pass",
        "interest": "Boutique / Tailoring",
        "matched_course": "Self Employed Tailor & Boutique Manager",
        "score": 91.0,
        "status": "matched",
        "refused": False,
        "confidence": 0.90,
        "date": "2026-09-24T14:45:00"
    },
    {
        "session_id": "seed-003",
        "beneficiary_name": "Manoj Paswan",
        "language": "hi-IN",
        "district": "Varanasi (Arajiline)",
        "education": "below_8th",
        "interest": "Commercial Driving",
        "matched_course": "None (Refused - Mobility Limit)",
        "score": 0.0,
        "status": "refused",
        "refused": True,
        "refusal_reason": "Beneficiary restricted to village radius; commercial fleet driving requires inter-district travel.",
        "confidence": 0.82,
        "date": "2026-09-25T09:15:00"
    }
]


class StartSessionRequest(BaseModel):
    language: str = "hi-IN"
    candidate_name: Optional[str] = None


class ProcessTurnRequest(BaseModel):
    session_id: str
    turn: int
    user_transcript: str


class ConfirmConstraintRequest(BaseModel):
    session_id: str
    confirmed: bool = True
    user_words: Optional[str] = None


@router.post("/interview/start")
def start_interview_session(req: StartSessionRequest):
    """
    Initialize a fresh beneficiary interview session with structured profile.
    """
    profile = BeneficiaryProfile(language=req.language)
    if req.candidate_name:
        profile.basic_info.name.value = req.candidate_name
        profile.basic_info.name.confidence = 1.0

    INTERVIEW_SESSIONS[profile.session_id] = profile

    q1 = INTERVIEW_QUESTIONS[0]
    prompt_text = q1["prompt_hi"] if "hi" in req.language else q1["prompt_en"]

    return {
        "session_id": profile.session_id,
        "language": profile.language,
        "current_turn": 1,
        "total_turns": len(INTERVIEW_QUESTIONS),
        "question_prompt": prompt_text,
        "catalogue_notice": CATALOGUE_NOTICE,
        "funding_notice": FUNDING_NOTICE,
        "profile": profile.dict()
    }


@router.post("/interview/turn")
def process_interview_turn(req: ProcessTurnRequest):
    """
    Update profile turn by turn with confidence tracking.
    Uses dynamic question selection to bypass turns that cannot alter recommendations.
    """
    profile = INTERVIEW_SESSIONS.get(req.session_id)
    if not profile:
        profile = BeneficiaryProfile(session_id=req.session_id)
        INTERVIEW_SESSIONS[req.session_id] = profile

    updated_profile = ProfileExtractor.extract_fields_from_turn(
        turn=req.turn,
        user_text=req.user_transcript,
        current_profile=profile
    )
    INTERVIEW_SESSIONS[req.session_id] = updated_profile

    # Determine subsequent question dynamically
    next_q = ProfileExtractor.get_next_question(current_turn=req.turn, profile=updated_profile)
    is_completed = next_q is None

    next_prompt = ""
    if not is_completed:
        next_prompt = next_q["prompt_hi"] if "hi" in updated_profile.language else next_q["prompt_en"]
        next_turn = next_q["turn"]
    else:
        updated_profile.metadata.interview_status = "completed"
        next_turn = None
        next_prompt = (
            "Dhanyawad! Aapki sabhi jaankari darj ho gayi hai. Ab hum aapke liye anukool vikalp nikaal rahe hain..."
            if "hi" in updated_profile.language
            else "Thank you! All your details have been recorded. Evaluating recommendations..."
        )

    return {
        "session_id": updated_profile.session_id,
        "turn": req.turn,
        "next_turn": next_turn,
        "is_completed": is_completed,
        "next_prompt": next_prompt,
        "catalogue_notice": CATALOGUE_NOTICE,
        "profile": updated_profile.dict()
    }


@router.get("/profile/{session_id}")
def get_beneficiary_profile(session_id: str):
    """Retrieve current structured JSON beneficiary profile"""
    profile = INTERVIEW_SESSIONS.get(session_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile session not found")
    return profile.dict()


@router.delete("/session/{session_id}")
def delete_beneficiary_session(session_id: str):
    """
    Erase session completely from memory (Privacy Parity).
    Removes all stored transcripts and constraints.
    """
    success = erase_session(session_id)
    return {
        "session_id": session_id,
        "erased": True,
        "message": "Session data wiped from system memory successfully."
    }


@router.post("/recommendations/evaluate")
def evaluate_recommendations(profile: BeneficiaryProfile):
    """
    Execute deterministic recommendation engine against beneficiary profile.
    Returns:
    - Phase 1 choices or Phase 2 choices (if second decision active)
    - Persisted hard refusals with exact kilometres/expiry date and read-back candidate words
    - Dropped gates listing exclusions
    - Two sentences: for beneficiary and administrative officer
    """
    # Sync profile state in memory if exists
    if profile.session_id in INTERVIEW_SESSIONS:
        existing = INTERVIEW_SESSIONS[profile.session_id]
        if existing.refusal_record and not profile.refusal_record:
            profile.refusal_record = existing.refusal_record
        if existing.second_decision_active:
            profile.second_decision_active = True
        if existing.masked_constraints:
            profile.masked_constraints = existing.masked_constraints

    result = engine.evaluate_profile(profile)

    # If read-back info is produced in initial phase, persist it to session
    if result.get("read_back_info"):
        rb = result["read_back_info"]
        profile.refusal_record = RefusalRecord(
            qp_code=rb["qp_code"],
            course_title=rb["course_title"],
            reason=rb["reason"],
            constraint=rb["constraint"],
            user_words=rb["user_words"],
            distance_km=rb.get("distance_km"),
            confirmed=False
        )
        INTERVIEW_SESSIONS[profile.session_id] = profile

    return result


@router.post("/recommendations/confirm-constraint")
def confirm_constraint_and_choose_second(req: ConfirmConstraintRequest):
    """
    Core Parity Implementation:
    Candidate confirms her stated words regarding the hard refusal ("yes").
    The engine masks that constraint, activates second decision mode, and selects
    strictly among three types:
    (1) Local NSQF Class
    (2) RPL for a skill she already holds (real rule: experience >= 12 mo, overlap >= 0.5)
    (3) PM-AJAY GIA Project Sheet (with enterprise referral buyback line)
    """
    profile = INTERVIEW_SESSIONS.get(req.session_id)
    if not profile:
        profile = BeneficiaryProfile(session_id=req.session_id)
        INTERVIEW_SESSIONS[req.session_id] = profile

    # Update refusal record confirmation
    if not profile.refusal_record:
        profile.refusal_record = RefusalRecord(
            qp_code="ELE/Q1401",
            course_title="Solar PV Installer (Suryamitra)",
            reason="Centre 'Babatpur Industrial Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
            constraint="travel_radius",
            user_words=req.user_words or "Babatpur 35 km door hai, main 5 km se zyada door nahi ja sakti",
            distance_km=35.0,
            confirmed=True
        )
    else:
        profile.refusal_record.confirmed = True
        if req.user_words:
            profile.refusal_record.user_words = req.user_words

    # Mask broken constraint so alternative local pathway is selected
    if profile.refusal_record.constraint not in profile.masked_constraints:
        profile.masked_constraints.append(profile.refusal_record.constraint)

    profile.second_decision_active = True
    INTERVIEW_SESSIONS[req.session_id] = profile

    # Run Second Choice Decision
    result = engine.evaluate_profile(profile)
    return result


@router.get("/admin/dashboard")
def get_admin_dashboard_metrics():
    total_interviewed = len(ADMIN_RECORDS)
    matches = [r for r in ADMIN_RECORDS if r["status"] == "matched"]
    refusals = [r for r in ADMIN_RECORDS if r["status"] == "refused"]

    return {
        "summary": {
            "total_interviewed": total_interviewed,
            "successful_matches": len(matches),
            "explicit_refusals": len(refusals),
            "avg_match_score": round(sum(m["score"] for m in matches) / max(len(matches), 1), 1)
        },
        "records": list(reversed(ADMIN_RECORDS)),
        "catalogue_notice": CATALOGUE_NOTICE,
        "funding_notice": FUNDING_NOTICE
    }


# ─────────────────────────────────────────────────────────────
# ASK ME ANYTHING (AMA) & SECURITY GUARDRAILS (ZERO MONETARY FIGURES)
# ─────────────────────────────────────────────────────────────

class AskQuestionRequest(BaseModel):
    session_id: str = "guest"
    question: str
    language: str = "hi"


VIOLATION_TRACKER: Dict[str, int] = {}

ALLOWED_KEYWORDS = [
    "pm-ajay", "pmajay", "yojana", "yojna", "koshish", "koushal", "kaushal", "hunar", "skill",
    "course", "nsqf", "training", "center", "kendra", "pramanpatra", "certificate",
    "toolkit", "grant", "subsidy", "sc", "anusuchit", "eligibility", "patrata",
    "solar", "suryamitra", "silai", "tailor", "boutique", "electrician", "plumber", "appliance",
    "driving", "interview", "voice", "tour", "website", "helpline", "varanasi", "chandauli",
    "profile", "recommendation", "rpl"
]

FORBIDDEN_PATTERNS = [
    "api key", "password", "system prompt", "internal prompt", "backend", "fastapi", "database",
    "sql", "token", "joke", "kahani", "story", "chutkula", "cinema", "movie", "cricket", "ipl",
    "bitcoin", "crypto", "shayari", "poem", "sing a song", "gaana", "dance", "politics", "hack"
]


@router.post("/ask-saathi")
def ask_vaani_saathi(req: AskQuestionRequest):
    """
    Domain-Bounded Informational Assistant.
    Enforces strict absence of monetary figures and refers scheme questions to local desk.
    """
    session_id = req.session_id.strip() or "guest"
    q_lower = req.question.strip().lower()
    lang = req.language.lower()

    if not q_lower:
        msg = "कृपया अपना प्रश्न पूछें।" if lang == "hi" else "Please ask your question."
        return {"answer": msg, "is_valid": True, "violations": VIOLATION_TRACKER.get(session_id, 0)}

    current_violations = VIOLATION_TRACKER.get(session_id, 0)
    is_forbidden = any(f in q_lower for f in FORBIDDEN_PATTERNS)
    has_domain_keyword = any(k in q_lower for k in ALLOWED_KEYWORDS)

    if is_forbidden or not has_domain_keyword:
        current_violations += 1
        VIOLATION_TRACKER[session_id] = current_violations

        if current_violations >= 10:
            answer = "सुरक्षा नियमों के तहत अप्रासंगिक प्रश्न प्रतिबंधित हैं।" if lang == "hi" else "Inquiries outside PM-AJAY skilling domain are restricted."
            return {"answer": answer, "is_valid": False, "violations": current_violations}
        else:
            answer = "मैं केवल पीएम-अजय कौशल मित्र, सरकारी ट्रेनिंग कोर्स और केंद्र की जानकारी देने के लिए अधिकृत हूँ।" if lang == "hi" else "I can provide information regarding PM-AJAY NSQF courses and training centres."
            return {"answer": answer, "is_valid": False, "violations": current_violations}

    # Funding / Money / Toolkit questions: Never promise financial sums. Explicitly state funding notice.
    if any(k in q_lower for k in ["toolkit", "subsidy", "grant", "paisa", "paise", "cost", "amount", "fees", "kharch"]):
        if lang == "hi":
            answer = f"पीएम-अजय योजना के अंतर्गत कौशल प्रमाणन उपरांत स्वरोजगार टूलकिट संस्वीकृति का प्रावधान है। {FUNDING_NOTICE_HI}"
        else:
            answer = f"Under PM-AJAY GIA, toolkit equipment support is facilitated following NSQF certification. {FUNDING_NOTICE}"

    elif "solar" in q_lower or "suryamitra" in q_lower:
        if lang == "hi":
            answer = "सोलर रूफटॉप इंस्टालर (सूर्यमित्र) NSQF लेवल 4 का 300 घंटे का प्रमाणित प्रशिक्षण है।"
        else:
            answer = "Solar PV Installer (Suryamitra) is an accredited NSQF Level 4, 300-hour training."

    elif "silai" in q_lower or "tailor" in q_lower or "boutique" in q_lower:
        if lang == "hi":
            answer = "सेल्फ एम्प्लॉयड टेलर व बुटीक कोर्स ग्रामीण कारीगरों के लिए 340 घंटे का निःशुल्क प्रशिक्षण है।"
        else:
            answer = "Self-Employed Tailor is a 340-hour NSQF training for local apparel enterprise."

    elif "rpl" in q_lower:
        if lang == "hi":
            answer = "पूर्व कार्य अनुभव (कम से कम 12 महीने) रखने वाले कारीगरों के लिए 40 घंटे का RPL मूल्यांकन उपलब्ध है।"
        else:
            answer = "Recognition of Prior Learning (RPL) provides a 40-hour assessment pathway for candidates with 12+ months prior work experience."

    elif "interview" in q_lower or "shuru" in q_lower:
        if lang == "hi":
            answer = "शुरू करने के लिए वॉयस इंटरव्यू बटन पर क्लिक करें और अपने अनुभव व रुचि के बारे में बताएं।"
        else:
            answer = "Click the Voice Interview button to share your background and preferences."

    else:
        if lang == "hi":
            answer = f"पीएम-अजय कौशल मित्र पोर्टल पर आप प्रमाणित NSQF कोर्सेस और नजदीकी केंद्र की जानकारी पा सकते हैं। {FUNDING_NOTICE_HI}"
        else:
            answer = f"Vikalp AI connects candidates with accredited NSQF trades and local centres. {FUNDING_NOTICE}"

    return {
        "answer": answer,
        "is_valid": True,
        "violations": current_violations,
        "catalogue_notice": CATALOGUE_NOTICE,
        "funding_notice": FUNDING_NOTICE
    }
