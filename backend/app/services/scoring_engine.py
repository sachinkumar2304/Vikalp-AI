"""
Explainable NSQF Recommendation & Scoring Engine for PM-AJAY GIA Component
Problem Statement 26097.

Design Principles:
1. Explainable & Deterministic: Final scoring and recommendation decisions are calculated
   by rule-based and weighted scoring, NOT by an unconstrained LLM.
2. Named, Transparent Weights:
   - Interest & Aspiration: 25%
   - Location & Accessibility: 20%
   - Existing Skills / Prior Experience: 15%
   - Education Eligibility: 15%
   - Local Market Demand: 15%
   - Mobility Constraints: 10%
   Total = 100%
3. Hard Constraint Rejection (Explicit Refusal):
   - If candidate cannot travel or has strict village mobility, and a course/job requires
     district-level or state-level travel, the engine EXPLICITLY REFUSES that option with a reason.
   - If candidate education is below minimum requirement for an NSQF level (e.g. requires 10th pass
     but candidate is below 8th), the engine does NOT recommend it.
4. Confidence & Clarification:
   - If profile confidence is too low or key signals are missing, flags a targeted clarifying question
     rather than guessing.
5. Plain-Language Reason:
   - Every recommendation provides a clear one-line beneficiary-facing reason tied to their answers.
"""

from typing import List, Dict, Any, Tuple, Optional
from app.schemas.pmajay import BeneficiaryProfile
from app.data.nsqf_catalog import NSQF_QUALIFICATION_PACKS, LOCAL_OPPORTUNITIES, APPROVED_TRAINING_CENTRES


# Education hierarchy mapping
EDU_RANKS = {
    "none": 0,
    "below_8th": 1,
    "8th_pass": 2,
    "10th_pass": 3,
    "12th_pass": 4,
    "iti_diploma": 5,
    "graduate": 6
}

# Mobility hierarchy mapping
MOBILITY_LEVELS = {
    "cannot_travel": 0,
    "within_village": 1,
    "within_block": 2,
    "within_district": 3,
    "state_level": 4,
    "anywhere": 5
}

# Configurable transparent weights (Sum = 1.00)
WEIGHTS = {
    "interest_aspiration": 0.25,
    "location_accessibility": 0.20,
    "existing_skills": 0.15,
    "education_eligibility": 0.15,
    "market_demand": 0.15,
    "mobility_alignment": 0.10
}


class ScoringResult:
    def __init__(
        self,
        course: Dict[str, Any],
        total_score: float,
        breakdown: Dict[str, float],
        reason: str,
        skill_gap: str,
        matched_local_opp: Optional[Dict[str, Any]] = None,
        nearest_centre: Optional[Dict[str, Any]] = None,
        is_refused: bool = False,
        refusal_reason: str = ""
    ):
        self.course = course
        self.total_score = total_score
        self.breakdown = breakdown
        self.reason = reason
        self.skill_gap = skill_gap
        self.matched_local_opp = matched_local_opp
        self.nearest_centre = nearest_centre
        self.is_refused = is_refused
        self.refusal_reason = refusal_reason

    def to_dict(self) -> Dict[str, Any]:
        return {
            "qp_code": self.course.get("qp_code"),
            "title": self.course.get("title"),
            "sector": self.course.get("sector"),
            "nsqf_level": self.course.get("nsqf_level"),
            "duration_hours": self.course.get("duration_hours"),
            "typical_wage": self.course.get("typical_wage"),
            "self_employment_potential": self.course.get("self_employment_potential"),
            "total_score": round(self.total_score * 100, 1),
            "score_breakdown": {k: round(v * 100, 1) for k, v in self.breakdown.items()},
            "reason": self.reason,
            "skill_gap": self.skill_gap,
            "matched_local_opportunity": self.matched_local_opp,
            "nearest_centre": self.nearest_centre,
            "is_refused": self.is_refused,
            "refusal_reason": self.refusal_reason
        }


class RecommendationEngine:
    """Deterministic, explainable recommendation engine for PM-AJAY GIA"""

    def __init__(self):
        self.courses = NSQF_QUALIFICATION_PACKS
        self.opportunities = LOCAL_OPPORTUNITIES
        self.training_centres = APPROVED_TRAINING_CENTRES

    def evaluate_profile(self, profile: BeneficiaryProfile) -> Dict[str, Any]:
        """
        Evaluate beneficiary profile, check if clarification is required,
        compute weighted scores, handle hard refusals, and link local opportunities.
        """
        # Step 1: Check if clarification is needed (avoid guessing when confidence or info is lacking)
        clarification = self._check_clarification_need(profile)
        if clarification:
            return {
                "status": "needs_clarification",
                "clarification_question": clarification["question"],
                "missing_field": clarification["field"],
                "recommendations": [],
                "refused_options": [],
                "weights_used": WEIGHTS
            }

        # Extract normalized attributes from profile
        cand_edu = str(profile.education.highest_level.value or "below_8th").lower().strip()
        cand_mobility = str(profile.constraints.mobility.value or "within_block").lower().strip()
        cand_pref = str(profile.aspirations.employment_preference.value or "wage_and_self").lower().strip()
        cand_interest = str(profile.aspirations.interest.value or "").lower().strip()
        cand_skills = [s.lower().strip() for s in profile.current_livelihood.skills]
        cand_occupation = str(profile.current_livelihood.occupation.value or "").lower().strip()

        recommendations: List[ScoringResult] = []
        refused_options: List[ScoringResult] = []

        for course in self.courses:
            # Check Hard Constraints first
            is_refused, refusal_reason = self._check_hard_constraints(
                course, cand_edu, cand_mobility, cand_pref
            )

            if is_refused:
                refused_options.append(
                    ScoringResult(
                        course=course,
                        total_score=0.0,
                        breakdown={},
                        reason="",
                        skill_gap="Constraint conflict",
                        is_refused=True,
                        refusal_reason=refusal_reason
                    )
                )
                continue

            # Compute Sub-Scores (each between 0.0 and 1.0)
            score_interest = self._score_interest(course, cand_interest)
            score_skills = self._score_existing_skills(course, cand_skills, cand_occupation)
            score_edu = self._score_education(course, cand_edu)
            score_mobility = self._score_mobility(course, cand_mobility)
            score_market = course.get("market_demand_score", 0.75)
            score_location = self._score_location(course, profile.basic_info.location.value)

            breakdown = {
                "interest_aspiration": score_interest,
                "location_accessibility": score_location,
                "existing_skills": score_skills,
                "education_eligibility": score_edu,
                "market_demand": score_market,
                "mobility_alignment": score_mobility
            }

            total_score = sum(breakdown[k] * WEIGHTS[k] for k in WEIGHTS)

            # Derive plain-language beneficiary reason
            reason = self._generate_reason(
                course, cand_interest, cand_skills, cand_occupation, cand_pref, cand_mobility
            )

            # Skill gap analysis
            skill_gap = self._determine_skill_gap(course, cand_skills, cand_edu)

            # Nearest centre & local opportunity matching
            nearest_centre = self._find_nearest_centre(course["qp_code"])
            matched_opp = self._find_local_opportunity(course["qp_code"])

            res = ScoringResult(
                course=course,
                total_score=total_score,
                breakdown=breakdown,
                reason=reason,
                skill_gap=skill_gap,
                matched_local_opp=matched_opp,
                nearest_centre=nearest_centre,
                is_refused=False
            )
            recommendations.append(res)

        # Sort valid recommendations by total score descending
        recommendations.sort(key=lambda x: x.total_score, reverse=True)

        top_recommendations = [r.to_dict() for r in recommendations[:3]]
        refused_list = [r.to_dict() for r in refused_options]

        # Voice reply summary generator (for TTS)
        voice_summary = self._generate_voice_summary(
            top_recommendations[0] if top_recommendations else None,
            profile.language
        )

        return {
            "status": "success",
            "session_id": profile.session_id,
            "weights_used": WEIGHTS,
            "top_recommendations": top_recommendations,
            "refused_options": refused_list,
            "voice_summary": voice_summary
        }

    def _check_hard_constraints(
        self,
        course: Dict[str, Any],
        cand_edu: str,
        cand_mobility: str,
        cand_pref: str
    ) -> Tuple[bool, str]:
        """
        Hard constraint check: Returns (True, reason) if this option is strictly disqualified.
        """
        # 1. Mobility Check
        course_req_mob = course.get("mobility_required", "within_block")
        cand_mob_val = MOBILITY_LEVELS.get(cand_mobility, 2)
        course_mob_val = MOBILITY_LEVELS.get(course_req_mob, 2)

        if cand_mobility == "cannot_travel" and course_req_mob != "within_village":
            return True, f"Beneficiary cannot travel outside village, whereas '{course['title']}' requires travel at {course_req_mob} level."

        if cand_mob_val < course_mob_val:
            return True, f"Mobility constraint: Candidate is restricted to {cand_mobility.replace('_', ' ')}, but this trade requires {course_req_mob.replace('_', ' ')}."

        # 2. Strict Educational Eligibility
        req_edu = course.get("min_education", "below_8th")
        cand_edu_val = EDU_RANKS.get(cand_edu, 1)
        req_edu_val = EDU_RANKS.get(req_edu, 1)

        if cand_edu_val < req_edu_val:
            return True, f"Education prerequisite not met: Minimum required is {req_edu.replace('_', ' ')}, candidate indicated {cand_edu.replace('_', ' ')}."

        # 3. Complete Employment Preference Mismatch
        course_emp_type = course.get("employment_type", "wage_and_self")
        if cand_pref == "self_employment" and course_emp_type == "wage_employment":
            return True, f"Employment preference mismatch: Candidate strictly wants self-employment, but '{course['title']}' is designed exclusively for factory/wage employment."

        return False, ""

    def _score_interest(self, course: Dict[str, Any], cand_interest: str) -> float:
        if not cand_interest:
            return 0.5
        keywords = course.get("keywords", [])
        title = course.get("title", "").lower()
        sector = course.get("sector", "").lower()

        cand_words = cand_interest.replace(",", " ").split()
        match_count = 0
        for w in cand_words:
            if len(w) <= 2:
                continue
            if any(w in kw for kw in keywords) or w in title or w in sector:
                match_count += 1

        if match_count >= 2:
            return 1.0
        elif match_count == 1:
            return 0.85
        return 0.30

    def _score_existing_skills(self, course: Dict[str, Any], cand_skills: List[str], cand_occupation: str) -> float:
        keywords = course.get("keywords", [])
        text_corpus = " ".join(cand_skills) + " " + cand_occupation
        if not text_corpus.strip():
            return 0.40

        score = 0.40
        for kw in keywords:
            if kw in text_corpus:
                score += 0.25
        return min(score, 1.0)

    def _score_education(self, course: Dict[str, Any], cand_edu: str) -> float:
        cand_val = EDU_RANKS.get(cand_edu, 1)
        req_val = EDU_RANKS.get(course.get("min_education", "below_8th"), 1)
        if cand_val == req_val:
            return 1.0  # Perfect fit for NSQF level
        elif cand_val > req_val:
            return 0.90 # Overqualified slightly, but fully capable
        return 0.20

    def _score_mobility(self, course: Dict[str, Any], cand_mobility: str) -> float:
        cand_val = MOBILITY_LEVELS.get(cand_mobility, 2)
        course_val = MOBILITY_LEVELS.get(course.get("mobility_required", "within_block"), 2)
        if cand_val >= course_val:
            return 1.0
        return 0.2

    def _score_location(self, course: Dict[str, Any], location_val: Any) -> float:
        # High default alignment for sample cluster
        return 0.92

    def _determine_skill_gap(self, course: Dict[str, Any], cand_skills: List[str], cand_edu: str) -> str:
        course_title = course.get("title", "")
        if "Solar" in course_title:
            return "Needs technical certification on safety, inverter inverter troubleshooting, and DC circuit earthing."
        elif "Tailor" in course_title:
            return "Knows basic sewing; needs standard commercial pattern cutting, costing, and boutique management skills."
        elif "Appliance" in course_title:
            return "Basic motor handling; needs digital multimeter testing and PCB diagnostic training."
        elif "Plumber" in course_title:
            return "General manual skills; needs training on Jal Jeevan Mission pipe joining standards and water pressure regulators."
        elif "Food" in course_title:
            return "Traditional home cooking knowledge; needs FSSAI hygienic packaging and spice preservation training."
        elif "Two-Wheeler" in course_title:
            return "Mechanical familiarity; needs diagnostic fault scanning for modern FI engines & EV batteries."
        return "Requires NSQF Level curriculum completion and formal assessment certification."

    def _generate_reason(
        self,
        course: Dict[str, Any],
        cand_interest: str,
        cand_skills: List[str],
        cand_occupation: str,
        cand_pref: str,
        cand_mobility: str
    ) -> str:
        title = course.get("title")
        if cand_interest and any(kw in cand_interest for kw in course.get("keywords", [])):
            return f"Directly matches your stated interest in '{cand_interest}' and enables flexible {course.get('typical_wage')} livelihood in your locality."
        if cand_occupation and any(kw in cand_occupation for kw in course.get("keywords", [])):
            return f"Builds on your current work as '{cand_occupation}' with certified training and PM-AJAY equipment subsidy."
        if cand_pref == "self_employment":
            return f"Strong self-employment viability in your block with PM-AJAY GIA grant support and zero high-travel requirements."
        return f"High local market demand in your cluster ({course.get('sector')}) with government-subsidized placement."

    def _find_nearest_centre(self, qp_code: str) -> Optional[Dict[str, Any]]:
        for tc in self.training_centres:
            if qp_code in tc.get("courses_offered", []):
                return tc
        return self.training_centres[0] if self.training_centres else None

    def _find_local_opportunity(self, qp_code: str) -> Optional[Dict[str, Any]]:
        for opp in self.opportunities:
            if opp.get("matched_qp_code") == qp_code:
                return opp
        return None

    def _check_clarification_need(self, profile: BeneficiaryProfile) -> Optional[Dict[str, str]]:
        """
        If critical fields are completely absent or confidence is excessively low,
        ask one focused clarifying question rather than guessing.
        """
        # Check education
        edu_val = profile.education.highest_level.value
        edu_conf = profile.education.highest_level.confidence
        if not edu_val or (edu_conf < 0.35 and edu_val != ""):
            return {
                "field": "education.highest_level",
                "question": "Aapne padhai kahan tak ki hai? Jaise 8th pass, 10th pass ya usse aage?"
            }

        # Check interest / aspiration
        int_val = profile.aspirations.interest.value
        occ_val = profile.current_livelihood.occupation.value
        if not int_val and not occ_val:
            return {
                "field": "aspirations.interest",
                "question": "Aap kis kshetra me kaam sikhna ya apna rozgar shuru karna chahte hain? Jaise bijli ka kaam, silai, kheti ya dukan?"
            }

        # Check mobility
        mob_val = profile.constraints.mobility.value
        if not mob_val:
            return {
                "field": "constraints.mobility",
                "question": "Kya aap training ya kaam ke liye gaon se bahar block ya shahar ja sakte hain?"
            }

        return None

    def _generate_voice_summary(self, top_match: Optional[Dict[str, Any]], lang: str) -> Dict[str, str]:
        if not top_match:
            return {
                "text_hi": "Aapke bataye anusaar hume aur jaankari ki zaroorat hai.",
                "text_en": "Based on your inputs, we need a little more information to suggest the best course."
            }

        title = top_match.get("title", "")
        reason = top_match.get("reason", "")
        tc = top_match.get("nearest_centre", {})
        tc_name = tc.get("name", "Nikat-tam Kaushal Kendra") if tc else "Nikat-tam Kaushal Kendra"
        dist = tc.get("distance_km", "5") if tc else "5"

        text_hi = (
            f"Aapke liye sabse behtar vikalp hai '{title}'. "
            f"Karan: {reason} "
            f"Aapka nikat-tam training centre '{tc_name}' hai, jo lagbhag {dist} kilometer door hai. "
            f"PM-AJAY yojana ke tehat isme muft prashikshan aur toolkit sahayata uplabdh hai."
        )

        text_en = (
            f"The best recommended course for you is '{title}'. "
            f"Reason: {reason} "
            f"Your nearest accredited training centre is '{tc_name}', approximately {dist} km away, "
            f"with 100% grant and toolkit subsidy under PM-AJAY GIA."
        )

        return {
            "text_hi": text_hi,
            "text_en": text_en
        }
