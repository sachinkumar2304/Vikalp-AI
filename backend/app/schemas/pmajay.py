"""
PM-AJAY GIA Component - Beneficiary Profile & Scoring Engine Schemas
Problem Statement 26097: AI-Driven Voice Assistant for Livelihood Mapping
and NSQF-Aligned Skilling Recommendations for SC Communities
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import uuid
from datetime import datetime


class ProfileField(BaseModel):
    value: Any = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    source: str = Field(default="voice_interview", description="e.g. voice_interview, inferred, direct_clarification")
    turn: int = Field(default=1, description="Interview turn number where extracted")


class BasicInfo(BaseModel):
    name: ProfileField = Field(default_factory=lambda: ProfileField(value=""))
    age: ProfileField = Field(default_factory=lambda: ProfileField(value=None))
    gender: ProfileField = Field(default_factory=lambda: ProfileField(value=""))
    location: ProfileField = Field(default_factory=lambda: ProfileField(value=""))  # District / Block / Village
    category: ProfileField = Field(default_factory=lambda: ProfileField(value="SC"))  # Target group under PM-AJAY GIA


class Education(BaseModel):
    highest_level: ProfileField = Field(
        default_factory=lambda: ProfileField(value="")
    )  # e.g., below_8th, 8th_pass, 10th_pass, 12th_pass, iti_diploma, graduate


class CurrentLivelihood(BaseModel):
    occupation: ProfileField = Field(default_factory=lambda: ProfileField(value=""))
    work_type: ProfileField = Field(default_factory=lambda: ProfileField(value=""))  # daily_wage, agricultural_labor, informal_trade, unemployed
    skills: List[str] = Field(default_factory=list)


class Aspirations(BaseModel):
    interest: ProfileField = Field(default_factory=lambda: ProfileField(value=""))  # technical, craft, sales, solar, tailoring, driving, etc.
    employment_preference: ProfileField = Field(
        default_factory=lambda: ProfileField(value="")
    )  # wage_employment vs self_employment


class Constraints(BaseModel):
    mobility: ProfileField = Field(
        default_factory=lambda: ProfileField(value="")
    )  # within_village, within_block, within_district, state_level, cannot_travel
    financial: ProfileField = Field(
        default_factory=lambda: ProfileField(value="")
    )  # immediate_stipend_needed, low_cost_only, subsidy_grant_needed


class SystemInferred(BaseModel):
    skill_level: ProfileField = Field(default_factory=lambda: ProfileField(value="beginner"))
    suitable_sectors: List[str] = Field(default_factory=list)


class BeneficiaryMetadata(BaseModel):
    profile_completeness: float = 0.0
    last_turn: int = 0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    interview_status: str = "in_progress"  # in_progress, completed, needs_clarification


class BeneficiaryProfile(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    language: str = "hi-IN"
    basic_info: BasicInfo = Field(default_factory=BasicInfo)
    education: Education = Field(default_factory=Education)
    current_livelihood: CurrentLivelihood = Field(default_factory=CurrentLivelihood)
    aspirations: Aspirations = Field(default_factory=Aspirations)
    constraints: Constraints = Field(default_factory=Constraints)
    system_inferred: SystemInferred = Field(default_factory=SystemInferred)
    metadata: BeneficiaryMetadata = Field(default_factory=BeneficiaryMetadata)
