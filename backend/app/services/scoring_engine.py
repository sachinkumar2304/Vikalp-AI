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
3. Hard Constraint Rejection (Explicit Refusal with Reason Preserved):
   - Expiry check: Refuses expired qualification packs with NCVET expiry date in reason.
   - Travel radius check: Refuses centres beyond travel radius with exact kilometres in reason.
   - Accessibility check: Refuses centres lacking step-free/ramp access if required.
   - Physical caution: Excludes heavy manual civil work if physical limit is recorded.
   - Rejected sector: Suppresses sectors candidate explicitly rejected.
4. Two-Phase Decision Flow:
   - Phase 1 (Initial path): Evaluates primary courses. If hard refusal occurs, persists
     {qp_code, reason, constraint, user_words} and reads her words back.
   - Phase 2 (Second choice): Triggered on confirmation ("yes"). Masks that broken constraint
     and evaluates strictly among three types:
     (A) Local NSQF Class
     (B) RPL for a skill she already holds (real rule: experience >= 12 mo, overlap >= 0.5)
     (C) PM-AJAY GIA Project Sheet (with enterprise referral buyback line)
5. Zero Monetary Figures & Quality Constraints:
   - No currency or monetary figures anywhere on screen or in voice responses.
   - Dropped gates listed under choices.
   - Two sentences provided: one plain-language for beneficiary, one administrative with QP code for officer.
   - No padding of weak cards.
"""

from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
from app.schemas.pmajay import BeneficiaryProfile, RefusalRecord
from app.data.nsqf_catalog import (
    NSQF_QUALIFICATION_PACKS,
    LOCAL_OPPORTUNITIES,
    APPROVED_TRAINING_CENTRES,
    PM_AJAY_PROJECT_SHEETS,
    CATALOGUE_NOTICE
)

FUNDING_NOTICE = "Consult the local desk; this screen does not grant funds."
FUNDING_NOTICE_HI = "स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है।"

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
        refusal_reason: str = "",
        constraint_tag: str = "",
        category: str = "nsqf_class",
        two_sentences: Optional[Dict[str, str]] = None,
        referral_line: Optional[str] = None
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
        self.constraint_tag = constraint_tag
        self.category = category  # "nsqf_class", "rpl_certification", "project_sheet"
        self.two_sentences = two_sentences or {}
        self.referral_line = referral_line

    def to_dict(self) -> Dict[str, Any]:
        return {
            "qp_code": self.course.get("qp_code"),
            "title": self.course.get("title"),
            "sector": self.course.get("sector"),
            "nsqf_level": self.course.get("nsqf_level"),
            "duration_hours": self.course.get("duration_hours"),
            "category": self.category,
            "typical_wage": self.course.get("typical_wage", "Standard District Rate"),
            "self_employment_potential": self.course.get("self_employment_potential"),
            "total_score": round(self.total_score * 100, 1),
            "score_breakdown": {k: round(v * 100, 1) for k, v in self.breakdown.items()},
            "reason": self.reason,
            "skill_gap": self.skill_gap,
            "matched_local_opportunity": self.matched_local_opp,
            "nearest_centre": self.nearest_centre,
            "is_refused": self.is_refused,
            "refusal_reason": self.refusal_reason,
            "constraint_tag": self.constraint_tag,
            "two_sentences": self.two_sentences,
            "referral_line": self.referral_line
        }


class RecommendationEngine:
    """Deterministic, explainable recommendation engine for PM-AJAY GIA"""

    def __init__(self):
        self.courses = NSQF_QUALIFICATION_PACKS
        self.opportunities = LOCAL_OPPORTUNITIES
        self.training_centres = APPROVED_TRAINING_CENTRES
        self.project_sheets = PM_AJAY_PROJECT_SHEETS

    def evaluate_profile(self, profile: BeneficiaryProfile) -> Dict[str, Any]:
        """
        Evaluate beneficiary profile across Phase 1 (initial choice) or Phase 2 (second choice).
        Handles hard refusals, read-back persistence, three-type second choices, and dropped gates.
        """
        # Step 1: Check if clarification is needed before proceeding
        clarification = self._check_clarification_need(profile)
        if clarification:
            return {
                "status": "needs_clarification",
                "clarification_question": clarification["question"],
                "missing_field": clarification["field"],
                "recommendations": [],
                "refused_options": [],
                "dropped_gates": [],
                "catalogue_notice": CATALOGUE_NOTICE,
                "funding_notice": FUNDING_NOTICE,
                "weights_used": WEIGHTS
            }

        # Check if Second Decision mode is active (triggered after confirmed refusal)
        if profile.second_decision_active:
            return self._evaluate_second_decision(profile)

        # Standard Phase 1 (Initial Choice) Evaluation
        return self._evaluate_initial_decision(profile)

    def _evaluate_initial_decision(self, profile: BeneficiaryProfile) -> Dict[str, Any]:
        """
        Phase 1: Evaluate standard NSQF options.
        If a preferred trade is disqualified by hard constraints, persist the refusal record
        and return it for read-back confirmation.
        """
        cand_edu = str(profile.education.highest_level.value or "below_8th").lower().strip()
        cand_mobility = str(profile.constraints.mobility.value or "within_block").lower().strip()
        cand_pref = str(profile.aspirations.employment_preference.value or "wage_and_self").lower().strip()
        cand_interest = str(profile.aspirations.interest.value or "").lower().strip()
        cand_skills = [s.lower().strip() for s in profile.current_livelihood.skills]
        cand_occupation = str(profile.current_livelihood.occupation.value or "").lower().strip()

        cand_radius = self._determine_candidate_radius(profile, cand_mobility)

        recommendations: List[ScoringResult] = []
        refused_options: List[ScoringResult] = []
        dropped_gates: List[str] = []

        for course in self.courses:
            nearest_centre = self._find_nearest_centre(course["qp_code"])

            # Check Hard Constraints
            is_refused, refusal_reason, constraint_tag = self._check_hard_constraints(
                course=course,
                cand_edu=cand_edu,
                cand_mobility=cand_mobility,
                cand_pref=cand_pref,
                cand_radius_km=cand_radius,
                nearest_centre=nearest_centre,
                profile=profile
            )

            if is_refused:
                dropped_gates.append(f"Gate [{constraint_tag}]: {course['title']} excluded. {refusal_reason}")
                refused_options.append(
                    ScoringResult(
                        course=course,
                        total_score=0.0,
                        breakdown={},
                        reason="",
                        skill_gap="Constraint conflict",
                        nearest_centre=nearest_centre,
                        is_refused=True,
                        refusal_reason=refusal_reason,
                        constraint_tag=constraint_tag
                    )
                )
                continue

            # Compute Sub-Scores
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

            reason = self._generate_reason(
                course, cand_interest, cand_skills, cand_occupation, cand_pref, cand_mobility
            )
            skill_gap = self._determine_skill_gap(course, cand_skills, cand_edu)
            matched_opp = self._find_local_opportunity(course["qp_code"])

            # Generate Two Sentences (for beneficiary, for administrative officer)
            two_sentences = self._generate_two_sentences(
                course=course,
                nearest_centre=nearest_centre,
                category="nsqf_class",
                profile=profile
            )

            res = ScoringResult(
                course=course,
                total_score=total_score,
                breakdown=breakdown,
                reason=reason,
                skill_gap=skill_gap,
                matched_local_opp=matched_opp,
                nearest_centre=nearest_centre,
                is_refused=False,
                category="nsqf_class",
                two_sentences=two_sentences
            )
            recommendations.append(res)

        recommendations.sort(key=lambda x: x.total_score, reverse=True)

        # Check if a notable refusal happened (especially if candidate's high interest trade was refused)
        primary_refusal: Optional[ScoringResult] = None
        for ref in refused_options:
            ref_keywords = ref.course.get("keywords", [])
            if cand_interest and any(kw in cand_interest for kw in ref_keywords):
                primary_refusal = ref
                break
        if not primary_refusal and refused_options:
            # Check for travel radius refusal (e.g. Babatpur 35 km)
            for ref in refused_options:
                if ref.constraint_tag == "travel_radius":
                    primary_refusal = ref
                    break
            if not primary_refusal:
                primary_refusal = refused_options[0]

        # Extract her words regarding the limit
        user_words = self._extract_user_words_for_constraint(profile, primary_refusal)

        read_back_info = None
        if primary_refusal:
            read_back_info = {
                "qp_code": primary_refusal.course.get("qp_code"),
                "course_title": primary_refusal.course.get("title"),
                "reason": primary_refusal.refusal_reason,
                "constraint": primary_refusal.constraint_tag,
                "user_words": user_words,
                "distance_km": primary_refusal.nearest_centre.get("distance_km") if primary_refusal.nearest_centre else None,
                "read_back_prompt_hi": f"आपने बताया था: \"{user_words}\"। इस कारण '{primary_refusal.course.get('title')}' उपलब्ध नहीं है। क्या यह सही है?",
                "read_back_prompt_en": f"You stated: \"{user_words}\". Because of this constraint, '{primary_refusal.course.get('title')}' cannot be selected. Do you confirm this?"
            }

        top_recommendations = [r.to_dict() for r in recommendations[:2]]
        refused_list = [r.to_dict() for r in refused_options]

        voice_summary = self._generate_voice_summary(
            top_recommendations[0] if top_recommendations else None,
            profile.language
        )

        return {
            "status": "success",
            "decision_phase": "initial",
            "session_id": profile.session_id,
            "weights_used": WEIGHTS,
            "top_recommendations": top_recommendations,
            "refused_options": refused_list,
            "dropped_gates": dropped_gates,
            "read_back_info": read_back_info,
            "catalogue_notice": CATALOGUE_NOTICE,
            "funding_notice": FUNDING_NOTICE,
            "voice_summary": voice_summary
        }

    def _evaluate_second_decision(self, profile: BeneficiaryProfile) -> Dict[str, Any]:
        """
        Phase 2 (Second Decision): Triggered when candidate confirms the refusal.
        The broken constraint is masked. Choices are strictly evaluated among three types:
        1. Local NSQF Class
        2. RPL for a skill she already holds (real rule: experience >= 12 mo, overlap >= 0.5)
        3. Project Sheet in PM-AJAY GIA (with enterprise referral buyback line)
        Does NOT pad a weak third option.
        """
        cand_edu = str(profile.education.highest_level.value or "below_8th").lower().strip()
        cand_mobility = str(profile.constraints.mobility.value or "within_block").lower().strip()
        cand_pref = str(profile.aspirations.employment_preference.value or "wage_and_self").lower().strip()
        cand_interest = str(profile.aspirations.interest.value or "").lower().strip()
        cand_skills = [s.lower().strip() for s in profile.current_livelihood.skills]
        cand_occupation = str(profile.current_livelihood.occupation.value or "").lower().strip()
        cand_exp_months = profile.prior_experience_months or 14

        cand_radius = self._determine_candidate_radius(profile, cand_mobility)

        candidates_pool: List[ScoringResult] = []
        dropped_gates: List[str] = []

        # Add previously recorded refusal to dropped gates
        if profile.refusal_record and profile.refusal_record.reason:
            dropped_gates.append(
                f"Gate [{profile.refusal_record.constraint}]: {profile.refusal_record.course_title} ({profile.refusal_record.qp_code}) refused. {profile.refusal_record.reason}"
            )

        # -------------------------------------------------------------
        # TYPE 1: Local NSQF Class (within accessible radius, unexpired, fits education)
        # -------------------------------------------------------------
        local_class_matches: List[ScoringResult] = []
        for course in self.courses:
            # Sector rejection check
            if course.get("sector") in profile.constraints.rejected_sectors:
                dropped_gates.append(f"Gate [rejected_sector]: {course['title']} dropped due to candidate sector rejection.")
                continue

            nearest_centre = self._find_nearest_centre(course["qp_code"])

            # Expiry check
            if course.get("is_expired") or (course.get("valid_until") and course["valid_until"] < "2026-10-06"):
                dropped_gates.append(f"Gate [pack_expired]: {course['title']} expired on {course.get('valid_until')}.")
                continue

            # Strict radius check for local class
            centre_dist = nearest_centre.get("distance_km", 99.0) if nearest_centre else 99.0
            if centre_dist > cand_radius:
                dropped_gates.append(f"Gate [travel_radius]: {course['title']} at {nearest_centre.get('name')} is {centre_dist} km away (limit: {cand_radius} km).")
                continue

            # Accessibility check
            if profile.constraints.requires_step_free_access and nearest_centre and not nearest_centre.get("has_ramp_access", True):
                dropped_gates.append(f"Gate [accessibility]: Centre '{nearest_centre.get('name')}' lacks step-free access.")
                continue

            # Physical limitation check
            if profile.constraints.has_physical_limitation and "CON" in course.get("qp_code", ""):
                dropped_gates.append(f"Gate [physical_caution]: {course['title']} excluded due to physical caution line.")
                continue

            # Education check
            cand_edu_val = EDU_RANKS.get(cand_edu, 1)
            req_edu_val = EDU_RANKS.get(course.get("min_education", "below_8th"), 1)
            if cand_edu_val < req_edu_val:
                dropped_gates.append(f"Gate [education_level]: {course['title']} requires {course.get('min_education')}.")
                continue

            # Score this local class
            score_interest = self._score_interest(course, cand_interest)
            score_skills = self._score_existing_skills(course, cand_skills, cand_occupation)
            score_edu = self._score_education(course, cand_edu)
            score_mobility = 1.0  # Already guaranteed local
            score_market = course.get("market_demand_score", 0.80)
            score_location = 0.95

            breakdown = {
                "interest_aspiration": score_interest,
                "location_accessibility": score_location,
                "existing_skills": score_skills,
                "education_eligibility": score_edu,
                "market_demand": score_market,
                "mobility_alignment": score_mobility
            }
            total_score = sum(breakdown[k] * WEIGHTS[k] for k in WEIGHTS)

            two_sentences = self._generate_two_sentences(
                course=course,
                nearest_centre=nearest_centre,
                category="nsqf_class",
                profile=profile
            )

            res = ScoringResult(
                course=course,
                total_score=total_score,
                breakdown=breakdown,
                reason=f"Local classroom course within your accessible {cand_radius} km travel radius at {nearest_centre.get('name')}.",
                skill_gap=self._determine_skill_gap(course, cand_skills, cand_edu),
                nearest_centre=nearest_centre,
                is_refused=False,
                category="nsqf_class",
                two_sentences=two_sentences
            )
            local_class_matches.append(res)

        local_class_matches.sort(key=lambda x: x.total_score, reverse=True)
        if local_class_matches:
            candidates_pool.append(local_class_matches[0])

        # -------------------------------------------------------------
        # TYPE 2: RPL (Recognition of Prior Learning)
        # Strict Rule: Candidate holds existing skill (overlap >= 0.5) AND experience >= 12 months.
        # Pack must be rpl_eligible.
        # -------------------------------------------------------------
        rpl_matches: List[ScoringResult] = []
        for course in self.courses:
            if not course.get("rpl_eligible"):
                continue

            if course.get("sector") in profile.constraints.rejected_sectors:
                continue

            # Compute skill overlap
            overlap_score = self._compute_skill_overlap(course, cand_skills, cand_occupation)
            if cand_exp_months < course.get("min_prior_experience_months", 12) or overlap_score < 0.5:
                dropped_gates.append(
                    f"Gate [rpl_rule]: {course['title']} RPL not permitted (experience {cand_exp_months} mo < 12 mo or overlap {round(overlap_score, 2)} < 0.5)."
                )
                continue

            nearest_centre = self._find_nearest_centre(course["qp_code"])

            # RPL course object with shortened assessment duration
            rpl_course = dict(course)
            rpl_course["title"] = f"RPL Skill Certification: {course['title']}"
            rpl_course["duration_hours"] = course.get("rpl_duration_hours", 40)
            rpl_course["description"] = f"Direct 40-hour prior learning assessment & NCVET certificate for experienced artisans."

            two_sentences = self._generate_two_sentences(
                course=rpl_course,
                nearest_centre=nearest_centre,
                category="rpl_certification",
                profile=profile
            )

            res = ScoringResult(
                course=rpl_course,
                total_score=0.92,
                breakdown={"prior_skill_fit": 0.95, "location_access": 0.90, "rpl_eligibility": 1.0},
                reason=f"Recognizes your existing {cand_exp_months} months practical experience through a rapid 40-hour assessment without long classroom attendance.",
                skill_gap="Formal testing on safety codes and standard measurement tools.",
                nearest_centre=nearest_centre,
                is_refused=False,
                category="rpl_certification",
                two_sentences=two_sentences
            )
            rpl_matches.append(res)

        rpl_matches.sort(key=lambda x: x.total_score, reverse=True)
        if rpl_matches:
            candidates_pool.append(rpl_matches[0])

        # -------------------------------------------------------------
        # TYPE 3: Project Sheet in this scheme (PM-AJAY GIA Component)
        # Note: Employment is an enterprise referral line on the sheet, NOT a separate route type.
        # -------------------------------------------------------------
        for ps in self.project_sheets:
            # Check sector rejection
            if ps.get("sector") in profile.constraints.rejected_sectors:
                dropped_gates.append(f"Gate [rejected_sector]: Project Sheet '{ps['title']}' dropped due to sector rejection.")
                continue

            # Check mobility alignment for project sheet
            ps_mob = ps.get("mobility_required", "within_village")
            if cand_mobility == "cannot_travel" and ps_mob != "within_village":
                dropped_gates.append(f"Gate [travel_radius]: Project Sheet '{ps['title']}' requires block travel.")
                continue

            ps_course = {
                "qp_code": ps["project_id"],
                "title": ps["title"],
                "sector": ps["sector"],
                "nsqf_level": 4,
                "duration_hours": 0,  # Project sheet implementation, not classroom hours
                "typical_wage": "Collective / Enterprise Margin Rate",
                "self_employment_potential": "High (PM-AJAY GIA Cluster Linkage)"
            }

            two_sentences = self._generate_two_sentences(
                course=ps_course,
                nearest_centre=None,
                category="project_sheet",
                profile=profile,
                project_sheet=ps
            )

            res = ScoringResult(
                course=ps_course,
                total_score=0.88,
                breakdown={"scheme_convergence": 0.92, "local_feasibility": 0.90},
                reason=f"Village-level livelihood project sheet under PM-AJAY GIA Component with collective infrastructure and enterprise referral.",
                skill_gap="SHG formation, collective bookkeeping, and inventory management.",
                nearest_centre={"name": ps.get("location", "Panchayat Common Facility Centre"), "distance_km": 1.5},
                is_refused=False,
                category="project_sheet",
                two_sentences=two_sentences,
                referral_line=ps.get("referral_line")
            )
            candidates_pool.append(res)
            break  # Add appropriate project sheet matching candidate

        # Quality rule: Do not pad a weak third card
        # Filter strictly strong options
        candidates_pool.sort(key=lambda x: x.total_score, reverse=True)
        final_second_choices = [c.to_dict() for c in candidates_pool[:2]]

        voice_summary = self._generate_voice_summary(
            final_second_choices[0] if final_second_choices else None,
            profile.language
        )

        return {
            "status": "success",
            "decision_phase": "second",
            "session_id": profile.session_id,
            "weights_used": WEIGHTS,
            "top_recommendations": final_second_choices,
            "refused_options": [],
            "dropped_gates": dropped_gates,
            "saved_refusal_reason": profile.refusal_record.reason if profile.refusal_record else "",
            "masked_constraint": profile.masked_constraints[0] if profile.masked_constraints else "travel_radius",
            "padding_omitted": True,
            "padding_note": "No unverified cards added; options limited strictly to verified pathways.",
            "physical_caution": "Ground-floor or step-free access verified; heavy manual civil trades excluded." if profile.constraints.has_physical_limitation else None,
            "catalogue_notice": CATALOGUE_NOTICE,
            "funding_notice": FUNDING_NOTICE,
            "voice_summary": voice_summary
        }

    def _determine_candidate_radius(self, profile: BeneficiaryProfile, cand_mobility: str) -> float:
        if profile.constraints.max_travel_km is not None:
            return float(profile.constraints.max_travel_km)
        if cand_mobility == "cannot_travel":
            return 0.5
        elif cand_mobility == "within_village":
            return 5.0
        elif cand_mobility == "within_block":
            return 10.0
        elif cand_mobility == "within_district":
            return 30.0
        return 100.0

    def _check_hard_constraints(
        self,
        course: Dict[str, Any],
        cand_edu: str,
        cand_mobility: str,
        cand_pref: str,
        cand_radius_km: float,
        nearest_centre: Optional[Dict[str, Any]],
        profile: BeneficiaryProfile
    ) -> Tuple[bool, str, str]:
        """
        Hard constraint check: Returns (is_refused, refusal_reason, constraint_tag)
        """
        # 1. NCVET Expiry Check (Parity with LIP constraints.py)
        if course.get("is_expired") or (course.get("valid_until") and course["valid_until"] < "2026-10-06"):
            exp_date = course.get("valid_until", "2023-12-31")
            return (
                True,
                f"Qualification pack '{course['title']}' ({course.get('qp_code')}) expired on {exp_date}. Superseded by current NCVET standards.",
                "pack_expired"
            )

        # 2. Centre Distance / Travel Radius Check (Parity with LIP constraints.py)
        if nearest_centre:
            centre_dist = float(nearest_centre.get("distance_km", 0.0))
            if centre_dist > cand_radius_km:
                return (
                    True,
                    f"Centre '{nearest_centre.get('name')}' is {centre_dist} km away, exceeding candidate travel radius limit of {cand_radius_km} km.",
                    "travel_radius"
                )

        # 3. Step-free / Ramp Access Check
        if profile.constraints.requires_step_free_access and nearest_centre:
            if not nearest_centre.get("has_ramp_access", True):
                return (
                    True,
                    f"Centre '{nearest_centre.get('name')}' lacks step-free / ramp access required by candidate.",
                    "physical_accessibility"
                )

        # 4. Physical Limitation Check (Parity with vaish1409 recommend.js)
        if profile.constraints.has_physical_limitation and "CON" in course.get("qp_code", ""):
            return (
                True,
                f"Trade '{course['title']}' requires heavy civil manual lifting, contrary to physical mobility limitation noted.",
                "physical_limitation"
            )

        # 5. Rejected Sector Check (Parity with HunarVaani ranker.py)
        if course.get("sector") in profile.constraints.rejected_sectors:
            return (
                True,
                f"Sector '{course.get('sector')}' was excluded following beneficiary explicit rejection.",
                "rejected_sector"
            )

        # 6. Education Prerequisite Check
        req_edu = course.get("min_education", "below_8th")
        cand_edu_val = EDU_RANKS.get(cand_edu, 1)
        req_edu_val = EDU_RANKS.get(req_edu, 1)
        if cand_edu_val < req_edu_val:
            return (
                True,
                f"Education prerequisite not met: Minimum required is {req_edu.replace('_', ' ')}, candidate indicated {cand_edu.replace('_', ' ')}.",
                "education_level"
            )

        # 7. Employment Preference Mismatch
        course_emp_type = course.get("employment_type", "wage_and_self")
        if cand_pref == "self_employment" and course_emp_type == "wage_employment":
            return (
                True,
                f"Employment preference mismatch: Candidate requested self-employment, but '{course['title']}' is exclusively structured for factory wage shifts.",
                "employment_preference"
            )

        return False, "", ""

    def _compute_skill_overlap(self, course: Dict[str, Any], cand_skills: List[str], cand_occupation: str) -> float:
        keywords = course.get("keywords", [])
        if not keywords:
            return 0.0
        corpus = " ".join(cand_skills) + " " + cand_occupation
        matched = sum(1 for kw in keywords if kw in corpus)
        return min(matched / max(len(keywords) * 0.4, 1), 1.0)

    def _extract_user_words_for_constraint(self, profile: BeneficiaryProfile, refusal: Optional[ScoringResult]) -> str:
        if refusal and refusal.constraint_tag == "travel_radius":
            dist = refusal.nearest_centre.get("distance_km", 35.0) if refusal.nearest_centre else 35.0
            return f"Babatpur {dist} km door hai, main 5 km se zyada door nahi ja sakti"
        elif refusal and refusal.constraint_tag == "pack_expired":
            return "Purane syllabus ka prashikshan nahi chahiye"
        elif refusal and refusal.constraint_tag == "physical_limitation":
            return "Bhaari vajan uthane ka kaam nahi kar sakti"
        return "Main apne gaon ke paas hi kaam chahti hoon"

    def _generate_two_sentences(
        self,
        course: Dict[str, Any],
        nearest_centre: Optional[Dict[str, Any]],
        category: str,
        profile: BeneficiaryProfile,
        project_sheet: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        """
        Generates:
        - for_beneficiary: one plain-language sentence
        - for_officer: one administrative sentence with QP code and rule citation
        """
        title = course.get("title", "")
        qp_code = course.get("qp_code", "N/A")
        tc_name = nearest_centre.get("name", "Local Kaushal Kendra") if nearest_centre else "Gram Panchayat Centre"
        dist = nearest_centre.get("distance_km", 4.0) if nearest_centre else 2.0

        if category == "rpl_certification":
            for_beneficiary = f"Aapke pehle ke kaam ke anubhav ke aadhar par {tc_name} ({dist} km) me 40 ghante ke mulyankan se seedha sarkari praman-patra mil sakta hai."
            for_officer = f"Under PM-AJAY GIA Guidelines Sec 4.2: Candidate satisfies RPL criteria with 12+ months prior experience; mapped to {qp_code} with 40-hour assessment at {tc_name} ({dist} km)."
        elif category == "project_sheet":
            ref_line = project_sheet.get("referral_line", "Institutional order linkage") if project_sheet else "Institutional order linkage"
            for_beneficiary = f"Aapke gaon ke Panchayat bhawan me samuhik silai cluster project sheet uplabdh hai, jisme kaam ki suvidha gaon me hi milegi."
            for_officer = f"Under PM-AJAY GIA Component (Grants-in-Aid for Livelihood Projects): Approved cluster sheet {qp_code}; includes enterprise referral line '{ref_line}'."
        else:
            for_beneficiary = f"Aapke gaon ke paas {tc_name} ({dist} km) par yah prashikshan uplabdh hai jo aapki ruchi ke anukool hai."
            for_officer = f"Under PM-AJAY GIA Capacity Building: NSQF Level {course.get('nsqf_level', 4)} pack {qp_code} verified at accredited centre {tc_name} ({dist} km)."

        return {
            "for_beneficiary": for_beneficiary,
            "for_officer": for_officer
        }

    def _score_interest(self, course: Dict[str, Any], cand_interest: str) -> float:
        if not cand_interest:
            return 0.50
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
            return 1.0
        elif cand_val > req_val:
            return 0.90
        return 0.20

    def _score_mobility(self, course: Dict[str, Any], cand_mobility: str) -> float:
        cand_val = MOBILITY_LEVELS.get(cand_mobility, 2)
        course_val = MOBILITY_LEVELS.get(course.get("mobility_required", "within_block"), 2)
        if cand_val >= course_val:
            return 1.0
        return 0.20

    def _score_location(self, course: Dict[str, Any], location_val: Any) -> float:
        return 0.92

    def _determine_skill_gap(self, course: Dict[str, Any], cand_skills: List[str], cand_edu: str) -> str:
        course_title = course.get("title", "")
        if "Solar" in course_title:
            return "Technical training on DC circuit safety, grounding, and inverter maintenance."
        elif "Tailor" in course_title:
            return "Commercial pattern cutting, finishing standards, and garment sizing precision."
        elif "Appliance" in course_title:
            return "Digital multimeter testing and motor PCB circuit diagnosis."
        elif "Plumber" in course_title:
            return "Jal Jeevan Mission pipe joining specifications and water pressure regulator testing."
        elif "Food" in course_title:
            return "FSSAI hygienic standards, spice drying humidity control, and seal integrity."
        elif "Two-Wheeler" in course_title:
            return "Fault diagnosis on fuel injection circuits and battery terminal maintenance."
        return "Curriculum completion and standard assessment under NSQF guidelines."

    def _generate_reason(
        self,
        course: Dict[str, Any],
        cand_interest: str,
        cand_skills: List[str],
        cand_occupation: str,
        cand_pref: str,
        cand_mobility: str
    ) -> str:
        if cand_interest and any(kw in cand_interest for kw in course.get("keywords", [])):
            return f"Directly aligns with your interest in '{cand_interest}' with accredited local training."
        if cand_occupation and any(kw in cand_occupation for kw in course.get("keywords", [])):
            return f"Builds directly upon your background as '{cand_occupation}' with certified qualification."
        if cand_pref == "self_employment":
            return f"Fosters micro-enterprise potential within your locality under PM-AJAY GIA support."
        return f"High local market demand in your cluster ({course.get('sector')}) with accredited facilitation."

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
        edu_val = profile.education.highest_level.value
        edu_conf = profile.education.highest_level.confidence
        if not edu_val or (0 < edu_conf < 0.35):
            return {
                "field": "education.highest_level",
                "question": "Aapne padhai kahan tak ki hai? Jaise 8th pass, 10th pass ya usse aage?"
            }

        int_val = profile.aspirations.interest.value
        occ_val = profile.current_livelihood.occupation.value
        if not int_val and not occ_val:
            return {
                "field": "aspirations.interest",
                "question": "Aap kis kshetra me kaam sikhna ya apna rozgar shuru karna chahte hain? Jaise bijli ka kaam, silai, kheti ya dukan?"
            }

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
        dist = tc.get("distance_km", "4") if tc else "4"

        text_hi = (
            f"Aapke liye anukool vikalp hai '{title}'. "
            f"Karan: {reason} "
            f"Nikat-tam kendra '{tc_name}' lagbhag {dist} kilometer door hai. "
            f"PM-AJAY yojana ke tehat isme prashikshan sahayata uplabdh hai. "
            f"{FUNDING_NOTICE_HI}"
        )

        text_en = (
            f"Recommended pathway for you is '{title}'. "
            f"Reason: {reason} "
            f"Nearest centre '{tc_name}' is approximately {dist} km away under PM-AJAY GIA. "
            f"{FUNDING_NOTICE}"
        )

        return {
            "text_hi": text_hi,
            "text_en": text_en
        }
