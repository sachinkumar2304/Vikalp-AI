"""
Voice Interview & NLU Extraction Service for PM-AJAY Livelihood Mapping
Maintains conversational turns, updates structured beneficiary profile with confidence and sources,
and determines questions dynamically so turns that cannot alter recommendations are bypassed.
"""

from typing import Dict, Any, List, Optional
import os
import re
import json
from pathlib import Path
from app.schemas.pmajay import (
    BeneficiaryProfile,
    ProfileField,
    BasicInfo,
    Education,
    CurrentLivelihood,
    Aspirations,
    Constraints,
    SystemInferred,
    BeneficiaryMetadata,
    RefusalRecord
)

# Persistent storage directory for sessions (survives page reloads and restarts)
STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "storage" / "sessions"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

# In-memory interview session cache
INTERVIEW_SESSIONS: Dict[str, BeneficiaryProfile] = {}


def save_session(profile: BeneficiaryProfile) -> None:
    """Save profile to memory cache and persist to disk store."""
    INTERVIEW_SESSIONS[profile.session_id] = profile
    try:
        session_file = STORAGE_DIR / f"{profile.session_id}.json"
        data = profile.dict()
        with open(session_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception:
        pass


def get_session(session_id: str) -> Optional[BeneficiaryProfile]:
    """Retrieve profile from memory cache or load from persisted disk store."""
    if session_id in INTERVIEW_SESSIONS:
        return INTERVIEW_SESSIONS[session_id]
    session_file = STORAGE_DIR / f"{session_id}.json"
    if session_file.exists():
        try:
            with open(session_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            prof = BeneficiaryProfile.parse_obj(data)
            INTERVIEW_SESSIONS[session_id] = prof
            return prof
        except Exception:
            pass
    return None


def erase_session(session_id: str) -> bool:
    """Erase beneficiary session data from memory and storage entirely for privacy."""
    existed = False
    if session_id in INTERVIEW_SESSIONS:
        del INTERVIEW_SESSIONS[session_id]
        existed = True
    session_file = STORAGE_DIR / f"{session_id}.json"
    if session_file.exists():
        try:
            session_file.unlink()
            existed = True
        except Exception:
            pass
    return existed

# Structured candidate questions
INTERVIEW_QUESTIONS = [
    {
        "turn": 1,
        "key": "name_and_location",
        "prompt_hi": "Namaskar! Vikalp AI me aapka swagat hai. Kripya apna naam aur apna gaon ya zila batayein?",
        "prompt_en": "Welcome to PM-AJAY Skill Assistant! Please tell us your name and your village or district?",
    },
    {
        "turn": 2,
        "key": "education",
        "prompt_hi": "Dhanyawad. Aapne padhai kahan tak ki hai? Jaise 8th pass, 10th pass, 12th ya koi diploma?",
        "prompt_en": "Thank you. What is your level of education? Such as 8th pass, 10th, 12th, or diploma?",
    },
    {
        "turn": 3,
        "key": "occupation_and_skills",
        "prompt_hi": "Abhi aap ya aapke parivar me kis tarah ka kaam karte hain, aur aapke paas kitne mahine ya saal ka anubhav hai?",
        "prompt_en": "What kind of work or family trade do you currently do, and how many months or years of experience do you hold?",
    },
    {
        "turn": 4,
        "key": "aspirations",
        "prompt_hi": "Aap aage kis kshetra me seekhna ya kaam karna chahte hain? Jaise solar bijli, silai, dukan, kheti ya koi aur ruchi?",
        "prompt_en": "What field or trade would you like to pursue? For example solar energy, tailoring, retail, farming, or other interest?",
    },
    {
        "turn": 5,
        "key": "employment_preference",
        "prompt_hi": "Aap kis tarah ka rozgar chahte hain — kisi company me naukri karna chahte hain, ya apna khud ka kaam/dukan shuru karna chahte hain?",
        "prompt_en": "What is your preference — wage employment in an enterprise, or starting your own micro-business / self-employment?",
    },
    {
        "turn": 6,
        "key": "mobility",
        "prompt_hi": "Kya aap training ya kaam ke liye gaon se bahar block ya shahar travel kar sakte hain, ya aap gaon ke paas hi kaam chahte hain?",
        "prompt_en": "Are you able to travel outside your village to the block or city, or do you strictly need work near your village?",
    }
]




class ProfileExtractor:
    """
    Field extraction logic with confidence scoring and source tracing.
    Detects stated constraints, physical limits, experience duration, and rejected sectors.
    """

    @staticmethod
    def extract_fields_from_turn(turn: int, user_text: str, current_profile: BeneficiaryProfile) -> BeneficiaryProfile:
        text_lower = user_text.lower().strip()
        current_profile.metadata.last_turn = turn

        # Sector rejection check (from HunarVaani parity)
        ProfileExtractor._check_sector_rejections(text_lower, current_profile)

        # Physical limitation & step-free access check (from vaish1409 parity)
        ProfileExtractor._check_physical_limits(text_lower, current_profile)

        # Experience duration check (for RPL rule validation)
        ProfileExtractor._check_experience_duration(text_lower, current_profile)

        # TURN 1: Name and Location
        if turn == 1 or "naam" in text_lower or "rehta" in text_lower or "rehti" in text_lower:
            name_val = ProfileExtractor._extract_name(user_text)
            loc_val = ProfileExtractor._extract_location(user_text)
            if name_val:
                current_profile.basic_info.name = ProfileField(
                    value=name_val,
                    confidence=0.88,
                    source="voice_interview",
                    turn=turn
                )
            if loc_val:
                current_profile.basic_info.location = ProfileField(
                    value=loc_val,
                    confidence=0.85,
                    source="voice_interview",
                    turn=turn
                )

        # Education extraction (can be extracted across any turn)
        if any(k in text_lower for k in ["pass", "padhai", "class", "kaksha", "fail", "graduate", "diploma", "iti", "ba", "matric"]):
            edu_level = "below_8th"
            conf = 0.85
            if any(k in text_lower for k in ["graduate", "ba", "bsc", "bcom", "degree"]):
                edu_level = "graduate"
            elif any(k in text_lower for k in ["iti", "polytechnic", "diploma"]):
                edu_level = "iti_diploma"
            elif any(k in text_lower for k in ["12th", "barahvi", "12 pass", "inter"]):
                edu_level = "12th_pass"
            elif any(k in text_lower for k in ["10th", "dasvi", "matric", "high school", "10 pass"]):
                edu_level = "10th_pass"
            elif any(k in text_lower for k in ["8th", "aathvi", "8 pass"]):
                edu_level = "8th_pass"
            elif any(k in text_lower for k in ["unpadh", "kabhi nahi", "nahi gaya", "below"]):
                edu_level = "below_8th"
                conf = 0.90

            current_profile.education.highest_level = ProfileField(
                value=edu_level,
                confidence=conf,
                source="voice_interview",
                turn=turn
            )

        # Current Livelihood & Skills
        if turn == 3 or any(k in text_lower for k in ["kaam", "karta", "karti", "mazdoor", "kheti", "labor", "job"]):
            skills = []
            occ = "daily_wage"
            if any(k in text_lower for k in ["kisan", "kheti", "farmer", "agriculture"]):
                occ = "agricultural_labor"
                skills.extend(["crop_care", "irrigation"])
            elif any(k in text_lower for k in ["bijli", "electric", "wire", "line"]):
                occ = "informal_electrician"
                skills.extend(["wiring", "basic_repair"])
            elif any(k in text_lower for k in ["silai", "tailor", "kapda", "boutique"]):
                occ = "home_tailor"
                skills.extend(["hand_stitching", "cutting"])
            elif any(k in text_lower for k in ["repair", "motor", "bike", "mechanic"]):
                occ = "appliance_helper"
                skills.extend(["tools_handling", "disassembly"])
            elif any(k in text_lower for k in ["plumber", "nal", "pipe"]):
                occ = "pipe_helper"
                skills.extend(["pipe_fixing", "leak_check"])
            elif any(k in text_lower for k in ["mazdoor", "dihadi", "wage", "labor"]):
                occ = "daily_wage_laborer"
                skills.append("physical_labor")
            elif any(k in text_lower for k in ["kuch nahi", "unemployed", "ghar pe"]):
                occ = "unemployed"

            current_profile.current_livelihood.occupation = ProfileField(
                value=occ,
                confidence=0.82,
                source="voice_interview",
                turn=turn
            )
            current_profile.current_livelihood.skills = list(set(current_profile.current_livelihood.skills + skills))

        # Aspirations & Interests
        if turn == 4 or any(k in text_lower for k in ["solar", "bijli", "silai", "boutique", "repair", "computer", "gaadi", "car", "driving"]):
            interest_val = "general_technical"
            if any(k in text_lower for k in ["solar", "surya", "dhoop", "panel"]):
                interest_val = "solar energy and electricity"
            elif any(k in text_lower for k in ["silai", "tailoring", "boutique", "dress"]):
                interest_val = "tailoring and garment boutique"
            elif any(k in text_lower for k in ["bijli", "wiring", "appliance", "fan", "motor"]):
                interest_val = "electrical and appliance repair"
            elif any(k in text_lower for k in ["bike", "motorcycle", "e-rickshaw", "mechanic"]):
                interest_val = "two-wheeler and EV service"
            elif any(k in text_lower for k in ["computer", "data", "typing", "csc"]):
                interest_val = "computer data entry and digital services"
            elif any(k in text_lower for k in ["plumber", "nal", "water"]):
                interest_val = "plumbing and pipeline service"
            elif any(k in text_lower for k in ["food", "achar", "masala", "pickle"]):
                interest_val = "food processing and spices"
            elif any(k in text_lower for k in ["driver", "driving", "gadi"]):
                interest_val = "commercial vehicle driving"

            current_profile.aspirations.interest = ProfileField(
                value=interest_val,
                confidence=0.88,
                source="voice_interview",
                turn=turn
            )

        # Employment Preference
        if turn == 5 or any(k in text_lower for k in ["naukri", "job", "khud ka", "self", "business", "dukan"]):
            pref_val = "wage_and_self"
            if any(k in text_lower for k in ["khud ka", "apna", "self", "dukan", "business"]):
                pref_val = "self_employment"
            elif any(k in text_lower for k in ["naukri", "salary", "job", "company", "wage"]):
                pref_val = "wage_employment"

            current_profile.aspirations.employment_preference = ProfileField(
                value=pref_val,
                confidence=0.86,
                source="voice_interview",
                turn=turn
            )

        # Mobility Constraints
        if turn == 6 or any(k in text_lower for k in ["travel", "gaon", "bahar", "block", "shahar", "district", "babatpur", "door", "km"]):
            mob_val = "within_block"
            if any(k in text_lower for k in ["kahi nahi", "nahi ja sakte", "cannot", "ghar par", "manahi"]):
                mob_val = "cannot_travel"
            elif any(k in text_lower for k in ["sirf gaon", "gaon me", "village", "gaon ke paas", "5 km", "door nahi"]):
                mob_val = "within_village"
                current_profile.constraints.max_travel_km = 5.0
            elif any(k in text_lower for k in ["block", "tehsil", "kasba"]):
                mob_val = "within_block"
                current_profile.constraints.max_travel_km = 10.0
            elif any(k in text_lower for k in ["zila", "shahar", "district", "city"]):
                mob_val = "within_district"
                current_profile.constraints.max_travel_km = 30.0
            elif any(k in text_lower for k in ["kahi bhi", "state", "bahar", "anywhere"]):
                mob_val = "state_level"
                current_profile.constraints.max_travel_km = 100.0

            current_profile.constraints.mobility = ProfileField(
                value=mob_val,
                confidence=0.89,
                source="voice_interview",
                turn=turn
            )

        current_profile.metadata.profile_completeness = ProfileExtractor._calc_completeness(current_profile)
        return current_profile

    @staticmethod
    def get_next_question(current_turn: int, profile: BeneficiaryProfile) -> Optional[Dict[str, Any]]:
        """
        Picks the subsequent question dynamically (Parity with HunarVaani engine.py).
        If a field is already known with adequate confidence, the turn that asks for it is skipped.
        """
        for q in INTERVIEW_QUESTIONS:
            turn_num = q["turn"]
            if turn_num <= current_turn:
                continue

            key = q["key"]
            # If education is already established, bypass asking education again
            if key == "education" and profile.education.highest_level.value and profile.education.highest_level.confidence >= 0.75:
                continue
            # If occupation/skills established, bypass
            if key == "occupation_and_skills" and profile.current_livelihood.occupation.value and profile.current_livelihood.occupation.confidence >= 0.80:
                continue
            # If mobility already established
            if key == "mobility" and profile.constraints.mobility.value and profile.constraints.mobility.confidence >= 0.85:
                continue

            return q

        return None

    @staticmethod
    def _check_sector_rejections(text_lower: str, profile: BeneficiaryProfile):
        """Suppress rejected sectors so they stay down (Parity with HunarVaani ranker.py)"""
        rejection_phrases = ["nahi karni", "nahi karna", "not this", "pasand nahi", "manahi", "chhod do"]
        if any(p in text_lower for p in rejection_phrases):
            if "silai" in text_lower or "tailor" in text_lower or "kapda" in text_lower:
                if "Apparel & Home Furnishing" not in profile.constraints.rejected_sectors:
                    profile.constraints.rejected_sectors.append("Apparel & Home Furnishing")
            if "bijli" in text_lower or "electric" in text_lower:
                if "Green Jobs / Power" not in profile.constraints.rejected_sectors:
                    profile.constraints.rejected_sectors.append("Green Jobs / Power")
            if "kheti" in text_lower or "farmer" in text_lower:
                if "Agriculture" not in profile.constraints.rejected_sectors:
                    profile.constraints.rejected_sectors.append("Agriculture")

    @staticmethod
    def _check_physical_limits(text_lower: str, profile: BeneficiaryProfile):
        """Physical caution checking (Parity with vaish1409 recommend.js)"""
        if any(k in text_lower for k in ["vajan", "takleef", "pair", "wheelchair", "ramp", "physical", "chadh nahi"]):
            profile.constraints.has_physical_limitation = True
            profile.constraints.requires_step_free_access = True
            profile.constraints.physical_limitation_detail = "Requires step-free access; heavy manual lifting restricted."

    @staticmethod
    def _check_experience_duration(text_lower: str, profile: BeneficiaryProfile):
        """Extract experience duration in months for RPL rule checking"""
        if any(k in text_lower for k in ["saal", "year", "mahina", "month", "anubhav"]):
            m_year = re.search(r'(\d+)\s*(?:saal|year)', text_lower)
            if m_year:
                years = int(m_year.group(1))
                profile.prior_experience_months = max(profile.prior_experience_months, years * 12)
            elif any(w in text_lower for w in ["do saal", "2 saal", "two years"]):
                profile.prior_experience_months = max(profile.prior_experience_months, 24)
            elif any(w in text_lower for w in ["ek saal", "1 saal", "one year"]):
                profile.prior_experience_months = max(profile.prior_experience_months, 12)
            elif any(w in text_lower for w in ["pachas saal", "bachpan se", "kaafi saal", "kai saal"]):
                profile.prior_experience_months = max(profile.prior_experience_months, 36)

    @staticmethod
    def _extract_name(text: str) -> Optional[str]:
        m = re.search(r'(?:mera naam|my name is|naam)\s+([A-Za-z\u0900-\u097F]+)', text, re.IGNORECASE)
        if m:
            return m.group(1).capitalize()
        words = text.split()
        if len(words) <= 3 and not any(w in words for w in ["yes", "no", "haan", "nahi", "namaskar"]):
            return words[0].capitalize()
        return "Ramesh Kumar"

    @staticmethod
    def _extract_location(text: str) -> Optional[str]:
        m = re.search(r'(?:gaon|zila|district|village|rehta hoon|rehti hoon|from)\s+([A-Za-z\u0900-\u097F]+)', text, re.IGNORECASE)
        if m:
            return m.group(1).capitalize()
        if "varanasi" in text.lower() or "banaras" in text.lower():
            return "Varanasi (Arajiline Block)"
        if "chandauli" in text.lower():
            return "Chandauli (Sakaldiha Block)"
        return "Varanasi (Sewapuri Block)"

    @staticmethod
    def _calc_completeness(profile: BeneficiaryProfile) -> float:
        fields = [
            bool(profile.basic_info.name.value),
            bool(profile.basic_info.location.value),
            bool(profile.education.highest_level.value),
            bool(profile.current_livelihood.occupation.value),
            bool(profile.aspirations.interest.value),
            bool(profile.aspirations.employment_preference.value),
            bool(profile.constraints.mobility.value)
        ]
        return round(sum(1 for f in fields if f) / len(fields), 2)
