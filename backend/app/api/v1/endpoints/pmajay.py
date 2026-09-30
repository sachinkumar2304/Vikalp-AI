"""
PM-AJAY GIA Voice Assistant Endpoints
Problem Statement 26097: AI-Driven Voice Assistant for Livelihood Mapping & NSQF-Aligned Skilling Recommendations
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid
import os
import shutil
from datetime import datetime

from app.schemas.pmajay import BeneficiaryProfile
from app.services.interview_manager import (
    INTERVIEW_SESSIONS,
    INTERVIEW_QUESTIONS,
    ProfileExtractor
)
from app.services.scoring_engine import RecommendationEngine

router = APIRouter()
engine = RecommendationEngine()

# Admin metrics store
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
        "matched_course": "None (Refused - Mobility/Licence Constraint)",
        "score": 0.0,
        "status": "refused",
        "refused": True,
        "refusal_reason": "Beneficiary strictly restricted to village mobility; commercial fleet driving requires interstate travel.",
        "confidence": 0.82,
        "date": "2026-09-25T09:15:00"
    },
    {
        "session_id": "seed-004",
        "beneficiary_name": "Anita Kumari",
        "language": "hi-IN",
        "district": "Chandauli",
        "education": "None",
        "interest": "Unclear / General",
        "matched_course": "Pending Clarification",
        "score": 42.0,
        "status": "low_confidence",
        "refused": False,
        "confidence": 0.38,
        "date": "2026-09-25T10:05:00"
    }
]


class StartSessionRequest(BaseModel):
    language: str = "hi-IN"
    candidate_name: Optional[str] = None


class ProcessTurnRequest(BaseModel):
    session_id: str
    turn: int
    user_transcript: str


@router.post("/interview/start")
def start_interview_session(req: StartSessionRequest):
    """
    Initialize a new beneficiary interview session with a fresh structured JSON profile.
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
        "profile": profile.dict()
    }


@router.post("/interview/turn")
def process_interview_turn(req: ProcessTurnRequest):
    """
    Update profile turn by turn with confidence and source tracking.
    Advances to the next question or concludes interview.
    """
    profile = INTERVIEW_SESSIONS.get(req.session_id)
    if not profile:
        profile = BeneficiaryProfile(session_id=req.session_id)
        INTERVIEW_SESSIONS[req.session_id] = profile

    # Update profile fields based on turn and transcript
    updated_profile = ProfileExtractor.extract_fields_from_turn(
        turn=req.turn,
        user_text=req.user_transcript,
        current_profile=profile
    )
    INTERVIEW_SESSIONS[req.session_id] = updated_profile

    next_turn = req.turn + 1
    is_completed = next_turn > len(INTERVIEW_QUESTIONS)

    next_prompt = ""
    if not is_completed:
        q = INTERVIEW_QUESTIONS[next_turn - 1]
        next_prompt = q["prompt_hi"] if "hi" in updated_profile.language else q["prompt_en"]
    else:
        updated_profile.metadata.interview_status = "completed"
        next_prompt = (
            "Dhanyawad! Aapki sabhi jaankari darj ho gayi hai. Ab hum aapke liye sabse behtar NSQF course nikaal rahe hain..."
            if "hi" in updated_profile.language
            else "Thank you! All your details have been recorded. We are now generating your tailored NSQF skill recommendations..."
        )

    return {
        "session_id": updated_profile.session_id,
        "turn": req.turn,
        "next_turn": next_turn if not is_completed else None,
        "is_completed": is_completed,
        "next_prompt": next_prompt,
        "profile": updated_profile.dict()
    }


@router.get("/profile/{session_id}")
def get_beneficiary_profile(session_id: str):
    """Get the current structured JSON beneficiary profile"""
    profile = INTERVIEW_SESSIONS.get(session_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile session not found")
    return profile.dict()


@router.post("/recommendations/evaluate")
def evaluate_recommendations(profile: BeneficiaryProfile):
    """
    Execute the transparent scoring engine against the beneficiary profile.
    Returns:
    - Top 3 NSQF recommendations with visible score weights and plain-language reasons.
    - Explicitly refused options due to constraint conflicts.
    - Nearest accredited PM-AJAY skill training centre.
    - Matched district local livelihood opportunities.
    - Voice reply summary for TTS.
    """
    result = engine.evaluate_profile(profile)

    # Record in admin metrics
    cand_name = profile.basic_info.name.value or "Beneficiary"
    top_rec = result.get("top_recommendations", [])
    refusals = result.get("refused_options", [])

    is_refused = len(refusals) > 0 and len(top_rec) == 0
    ADMIN_RECORDS.append({
        "session_id": profile.session_id,
        "beneficiary_name": cand_name,
        "language": profile.language,
        "district": profile.basic_info.location.value or "Varanasi",
        "education": profile.education.highest_level.value or "below_8th",
        "interest": profile.aspirations.interest.value or "General",
        "matched_course": top_rec[0]["title"] if top_rec else ("Refused" if is_refused else "Pending"),
        "score": top_rec[0]["total_score"] if top_rec else 0.0,
        "status": "refused" if is_refused else ("low_confidence" if result.get("status") == "needs_clarification" else "matched"),
        "refused": is_refused,
        "refusal_reason": refusals[0]["refusal_reason"] if refusals else "",
        "confidence": profile.metadata.profile_completeness,
        "date": datetime.utcnow().isoformat()
    })

    return result


@router.get("/admin/dashboard")
def get_admin_dashboard_metrics():
    """
    Admin dashboard metrics:
    - Number interviewed
    - Total matches
    - Total refusals
    - Low-confidence cases
    - Complete interview records
    """
    total_interviewed = len(ADMIN_RECORDS)
    matches = [r for r in ADMIN_RECORDS if r["status"] == "matched"]
    refusals = [r for r in ADMIN_RECORDS if r["status"] == "refused"]
    low_conf = [r for r in ADMIN_RECORDS if r["status"] == "low_confidence"]

    return {
        "summary": {
            "total_interviewed": total_interviewed,
            "successful_matches": len(matches),
            "explicit_refusals": len(refusals),
            "low_confidence_clarifications": len(low_conf),
            "avg_match_score": round(sum(m["score"] for m in matches) / max(len(matches), 1), 1)
        },
        "records": list(reversed(ADMIN_RECORDS))
    }


# ─────────────────────────────────────────────────────────────
# ASK ME ANYTHING (AMA) & SECURITY GUARDRAILS
# ─────────────────────────────────────────────────────────────

class AskQuestionRequest(BaseModel):
    session_id: str = "guest"
    question: str
    language: str = "hi"  # hi | mr | en


# In-memory violation tracker: session_id -> count
VIOLATION_TRACKER: Dict[str, int] = {}

# Allowed Domain Keywords (PM-AJAY, courses, subsidies, eligibility, process)
ALLOWED_KEYWORDS = [
    "pm-ajay", "pmajay", "yojana", "yojna", "koshish", "koushal", "kaushal", "hunar", "skill",
    "course", "kurs", "nsqf", "training", "center", "kendra", "pramanpatra", "certificate",
    "stipend", "toolkit", "grant", "subsidy", "sc", "anusuchit", "eligibility", "patrata",
    "solar", "suryamitra", "silai", "tailor", "boutique", "electrician", "plumber", "appliance",
    "driving", "welder", "carpenter", "mason", "interview", "voice", "tour", "website",
    "helpline", "tollfree", "phone", "contact", "varanasi", "chandauli", "fees", "free",
    "dastavej", "document", "aadhaar", "ration", "caste", "jatin", "jaati", "profile", "recommendation"
]

# Strict forbidden patterns: hacking, system prompt injection, irrelevant entertainment/trivia
FORBIDDEN_PATTERNS = [
    "api key", "password", "system prompt", "internal prompt", "backend", "fastapi", "database",
    "sql", "select *", "drop table", "token", "joke", "kahani", "story", "chutkula", "cinema",
    "movie", "cricket", "ipl", "bitcoin", "crypto", "matlab kya hota", "meaning of", "ka arth",
    "president", "prime minister name", "shayari", "poem", "sing a song", "gaana", "dance",
    "politics", "election", "modi", "rahul", "hack", "bypass", "ignore previous instructions"
]

@router.post("/ask-saathi")
def ask_vaani_saathi(req: AskQuestionRequest):
    """
    Strict Domain-Bounded Ask Me Anything (AMA) Endpoint.
    
    Guards:
    1. Rejects prompt injection, jokes, movies, generic trivia, backend/hacker inquiries.
    2. Enforces PM-AJAY & livelihood domain relevance.
    3. Tracks violations per session:
       - 1 to 5 violations: Polite refusal.
       - > 5 violations: Strict warning.
       - >= 10 violations: Account / Session lockout warning (4 days restriction notice).
    """
    session_id = req.session_id.strip() or "guest"
    q_lower = req.question.strip().lower()
    lang = req.language.lower()

    if not q_lower:
        msg = "कृपया अपना प्रश्न पूछें।" if lang == "hi" else ("कृपया आपला प्रश्न विचारा." if lang == "mr" else "Please ask your question.")
        return {"answer": msg, "is_valid": True, "violations": VIOLATION_TRACKER.get(session_id, 0)}

    current_violations = VIOLATION_TRACKER.get(session_id, 0)

    # Check for forbidden hacking or irrelevant queries
    is_forbidden = any(f in q_lower for f in FORBIDDEN_PATTERNS)
    
    # Check if question has at least some domain relevance
    has_domain_keyword = any(k in q_lower for k in ALLOWED_KEYWORDS)

    # Boundary violation detected
    if is_forbidden or not has_domain_keyword:
        current_violations += 1
        VIOLATION_TRACKER[session_id] = current_violations

        if current_violations >= 10:
            if lang == "hi":
                answer = "⚠️ सख्त चेतावनी: आपने लगातार 10 से अधिक बार अप्रासंगिक या अनुचित प्रश्न पूछे हैं। सुरक्षा नियमों के तहत आपके खाते को 4 दिनों के लिए अस्थायी रूप से ब्लॉक किया जा सकता है। कृपया केवल पीएम-अजय कौशल योजना से संबंधित प्रश्न ही पूछें।"
            elif lang == "mr":
                answer = "⚠️ कडक चेतावणी: आपण वारंवार अप्रासंगिक किंवा प्रतिबंधित प्रश्न विचारले आहेत. सुरक्षेच्या नियमांनुसार आपले खाते ४ दिवसांसाठी ब्लॉक केले जाऊ शकते. कृपया फक्त पीएम-अजय कौशल्य योजनेशी संबंधित प्रश्न विचारा."
            else:
                answer = "⚠️ STRICT WARNING: You have repeatedly exceeded domain safety boundaries (10+ violations). Your session may be restricted for 4 days under security regulations. Please ask only PM-AJAY skill-related questions."
            
            return {
                "answer": answer,
                "is_valid": False,
                "is_lockout_warning": True,
                "violations": current_violations
            }

        elif current_violations > 5:
            if lang == "hi":
                answer = f"चेतावनी (उल्लंघन {current_violations}/10): मैं केवल पीएम-अजय कौशल पोर्टल, सरकारी कोर्स, सब्सिडी और वॉयस इंटरव्यू के बारे में ही उत्तर दे सकता हूँ। किसी अन्य विषय या चुटकुले/कहानियों के लिए मेरी अनुमति नहीं है।"
            elif lang == "mr":
                answer = f"चेतावणी (उल्लंघन {current_violations}/१०): मी फक्त पीएम-अजय कौशल्य पोर्टल, सरकारी कोर्सेस आणि अनुदानाबद्दल माहिती देऊ शकतो. इतर विषयांवर मी मदत करू शकत नाही."
            else:
                answer = f"Warning (Violation {current_violations}/10): I am restricted to PM-AJAY skilling, courses, and portal queries only. I cannot assist with outside topics."
            
            return {
                "answer": answer,
                "is_valid": False,
                "is_lockout_warning": False,
                "violations": current_violations
            }

        else:
            if lang == "hi":
                answer = "क्षमा करें, मैं इस विषय में आपकी सहायता नहीं कर सकता। मैं केवल पीएम-अजय कौशल मित्र, सरकारी ट्रेनिंग कोर्स, टूलकिट सहायता और पोर्टल की जानकारी देने के लिए अधिकृत हूँ।"
            elif lang == "mr":
                answer = "क्षमस्व, मी या विषयावर मदत करू शकत नाही. मी केवळ पीएम-अजय कौशल्य अभ्यासक्रम, टूलकिट अनुदान आणि पोर्टलच्या माहितीसाठी अधिकृत आहे."
            else:
                answer = "I apologize, but I cannot assist with that topic. I am authorized to answer questions strictly about PM-AJAY NSQF courses, toolkits, and portal features."

            return {
                "answer": answer,
                "is_valid": False,
                "is_lockout_warning": False,
                "violations": current_violations
            }

    # If within domain boundaries, provide accurate helpful response
    # 1. Toolkit subsidy
    if "toolkit" in q_lower or "subsidy" in q_lower or "grant" in q_lower or "50000" in q_lower or "50,000" in q_lower or "paise" in q_lower:
        if lang == "hi":
            answer = "पीएम-अजय (PM-AJAY) योजना के तहत अनुसूचित जाति (SC) के पात्र लाभार्थियों को कोर्स पूरा करने और प्रमाणन के बाद स्वरोजगार के लिए ₹50,000 तक की 100% मुफ्त टूलकिट सब्सिडी दी जाती है।"
        elif lang == "mr":
            answer = "पीएम-अजय योजनेअंतर्गत अनुसूचित जातीच्या (SC) पात्र लाभार्थ्यांना अभ्यासक्रम पूर्ण केल्यानंतर स्वयंरोजगारासाठी ₹५०,००० पर्यंत १००% मोफत टूलकिट अनुदान दिले जाते."
        else:
            answer = "Under PM-AJAY, eligible SC beneficiaries receive up to ₹50,000 in 100% free toolkit subsidy upon course completion to start their micro-enterprise."

    # 2. Solar course
    elif "solar" in q_lower or "suryamitra" in q_lower:
        if lang == "hi":
            answer = "सोलर रूफटॉप इंस्टालर (Suryamitra) NSQF लेवल 4 का कोर्स है। यह 300 घंटे की फ्री ट्रेनिंग है, जिसमें ₹15,000 से ₹22,000 तक मासिक आमदनी की संभावना होती है।"
        elif lang == "mr":
            answer = "सोलर रूफटॉप इंस्टॉलर (सूर्यमित्र) हा NSQF लेव्हल ४ चा ३०० तासांचा मोफत कोर्स आहे. यात दरमहा ₹१५,००० ते ₹२२,००० पर्यंत उत्पन्नाची संधी मिळते."
        else:
            answer = "Solar PV Installer (Suryamitra) is an NSQF Level 4, 300-hour certified training with earning potential of ₹15,000 to ₹22,000 per month."

    # 3. Tailor / Silai
    elif "silai" in q_lower or "tailor" in q_lower or "boutique" in q_lower or "kapde" in q_lower:
        if lang == "hi":
            answer = "सेल्फ एम्प्लॉयड टेलर व बुटीक कोर्स महिलाओं व कारीगरों के लिए आदर्श है। यह 340 घंटे का निःशुल्क प्रशिक्षण है और गांव में ही सिलाई केंद्र शुरू करने के लिए टूलकिट सहायता मिलती है।"
        elif lang == "mr":
            answer = "स्वयंरोजगार टेलर आणि बुटीक कोर्स ३४० तासांचा मोफत कोर्स आहे, ज्याद्वारे महिला गावात स्वतःचे टेलरिंग युनिट सुरू करू शकतात."
        else:
            answer = "Self-Employed Tailor is a 340-hour NSQF training ideal for village-based enterprise with sewing toolkit assistance."

    # 4. Fees / Free
    elif "fees" in q_lower or "paisa" in q_lower or "free" in q_lower or "muft" in q_lower or "kharch" in q_lower:
        if lang == "hi":
            answer = "यह प्रशिक्षण भारत सरकार द्वारा 100% निःशुल्क है। आपको एक भी रुपया नहीं देना है। इसके अलावा कोर्स के दौरान छात्रवृत्ति और पास होने पर टूलकिट भी दी जाती है।"
        elif lang == "mr":
            answer = "हे प्रशिक्षण भारत सरकारकडून १००% मोफत आहे. लाभार्थ्याला कोणताही खर्च करावा लागत नाही."
        else:
            answer = "All PM-AJAY NSQF skill trainings are 100% government-funded and completely free for beneficiaries."

    # 5. Documents / Eligibility
    elif "document" in q_lower or "dastavej" in q_lower or "eligibility" in q_lower or "patrata" in q_lower or "aadhaar" in q_lower or "caste" in q_lower:
        if lang == "hi":
            answer = "पात्रता के लिए लाभार्थी का अनुसूचित जाति (SC) समुदाय से होना, आधार कार्ड और निवास प्रमाण होना आवश्यक है। ऑनलाइन कोई कठिन फॉर्म नहीं भरना, बस वॉयस इंटरव्यू से जानकारी ली जाती है।"
        elif lang == "mr":
            answer = "पात्रतेसाठी लाभार्थी अनुसूचित जाती (SC) प्रवर्गातील असावा, आधार कार्ड आणि रहिवासी दाखला आवश्यक आहे. व्हॉइस मुलाखतीद्वारे पडताळणी होते."
        else:
            answer = "Eligibility requires SC category verification and Aadhaar residency. No complex paperwork—our voice interview captures your details directly."

    # 6. How to start / Interview
    elif "interview" in q_lower or "shuru" in q_lower or "kaise" in q_lower or "start" in q_lower or "tour" in q_lower:
        if lang == "hi":
            answer = "शुरू करने के लिए आप 'वॉयस संवाद' या नीचे दिए गए हरे 'इंटरव्यू' बटन पर क्लिक करें। हमारा वॉयस असिस्टेंट आपसे आसान 6 सवाल पूछेगा और आपके लिए सबसे सही कोर्स चुनेगा।"
        elif lang == "mr":
            answer = "सुरू करण्यासाठी 'व्हॉइस मुलाखत' बटणावर क्लिक करा. सहाय्यक सोपे ६ प्रश्न विचारेल आणि आपल्यासाठी योग्य कोर्स सुचवेल."
        else:
            answer = "To begin, click the Voice Interview button. Our assistant will ask 6 simple questions to recommend your best NSQF course."

    # 7. Default general answer about PM-AJAY portal
    else:
        if lang == "hi":
            answer = "पीएम-अजय कौशल मित्र पोर्टल पर आप अपनी बोली में बोलकर 18 सरकारी कौशल कोर्सेस, नजदीकी केंद्र और ₹50,000 की टूलकिट सब्सिडी की जानकारी पा सकते हैं। अधिक जानकारी के लिए वॉयस इंटरव्यू शुरू करें।"
        elif lang == "mr":
            answer = "पीएम-अजय कौशल्य मित्र पोर्टलवर आपण १८ सरकारी कोर्सेस, जवळचे केंद्र आणि ₹५०,००० टूलकिट अनुदानाची माहिती मिळवू शकता."
        else:
            answer = "PM-AJAY Kaushal Mitra connects you with 18 certified NSQF trades, local training centers, and ₹50,000 toolkit grants."

    return {
        "answer": answer,
        "is_valid": True,
        "is_lockout_warning": False,
        "violations": current_violations
    }

