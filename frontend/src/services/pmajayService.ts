import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/pmajay`;

export interface ProfileFieldItem<T = any> {
  value: T;
  confidence: number;
  source: string;
  turn: number;
}

export interface BeneficiaryProfileData {
  session_id: string;
  language: string;
  basic_info: {
    name: ProfileFieldItem<string>;
    age: ProfileFieldItem<number | null>;
    gender: ProfileFieldItem<string>;
    location: ProfileFieldItem<string>;
    category: ProfileFieldItem<string>;
  };
  education: {
    highest_level: ProfileFieldItem<string>;
  };
  current_livelihood: {
    occupation: ProfileFieldItem<string>;
    work_type: ProfileFieldItem<string>;
    skills: string[];
  };
  aspirations: {
    interest: ProfileFieldItem<string>;
    employment_preference: ProfileFieldItem<string>;
  };
  constraints: {
    mobility: ProfileFieldItem<string>;
    financial: ProfileFieldItem<string>;
    max_travel_km?: number | null;
    requires_step_free_access?: boolean;
    has_physical_limitation?: boolean;
    physical_limitation_detail?: string;
    rejected_sectors?: string[];
  };
  system_inferred: {
    skill_level: ProfileFieldItem<string>;
    suitable_sectors: string[];
  };
  metadata: {
    profile_completeness: number;
    last_turn: number;
    created_at: string;
    interview_status: string;
  };
  prior_experience_months?: number;
  refusal_record?: {
    qp_code: string;
    course_title: string;
    reason: string;
    constraint: string;
    user_words: string;
    confirmed: boolean;
    distance_km?: number | null;
  } | null;
  masked_constraints?: string[];
  second_decision_active?: boolean;
}

export interface RecommendationItem {
  qp_code: string;
  title: string;
  sector: string;
  nsqf_level: number;
  duration_hours: number;
  category?: "nsqf_class" | "rpl_certification" | "project_sheet";
  typical_wage: string;
  self_employment_potential: string;
  total_score: number;
  score_breakdown: Record<string, number>;
  reason: string;
  skill_gap: string;
  matched_local_opportunity?: {
    id: string;
    sector: string;
    title: string;
    type: string;
    employer_or_model: string;
    location: string;
    distance_km: number;
    stipend_or_wage: string;
    openings: any;
    matched_qp_code: string;
    eligible_schemes: string[];
    contact_person: string;
  };
  nearest_centre?: {
    id: string;
    name: string;
    address: string;
    distance_km: number;
    hostel_facility: boolean;
    stipend_supported: boolean;
    contact_phone: string;
  };
  is_refused: boolean;
  refusal_reason: string;
  constraint_tag?: string;
  two_sentences?: {
    for_beneficiary?: string;
    for_officer?: string;
  };
  referral_line?: string;
}

export interface RecommendationResult {
  status: "success" | "needs_clarification";
  decision_phase?: "initial" | "second";
  session_id?: string;
  clarification_question?: string;
  missing_field?: string;
  weights_used: Record<string, number>;
  top_recommendations: RecommendationItem[];
  refused_options: RecommendationItem[];
  dropped_gates?: string[];
  read_back_info?: {
    qp_code: string;
    course_title: string;
    reason: string;
    constraint: string;
    user_words: string;
    distance_km?: number | null;
    read_back_prompt_hi: string;
    read_back_prompt_en: string;
  } | null;
  saved_refusal_reason?: string;
  masked_constraint?: string;
  padding_omitted?: boolean;
  padding_note?: string;
  physical_caution?: string | null;
  catalogue_notice?: string;
  funding_notice?: string;
  voice_summary?: {
    text_hi: string;
    text_en: string;
  };
}

export interface AdminMetrics {
  summary: {
    total_interviewed: number;
    successful_matches: number;
    explicit_refusals: number;
    low_confidence_clarifications: number;
    avg_match_score: number;
  };
  records: Array<{
    session_id: string;
    beneficiary_name: string;
    language: string;
    district: string;
    education: string;
    interest: string;
    matched_course: string;
    score: number;
    status: string;
    refused: boolean;
    refusal_reason?: string;
    confidence: number;
    date: string;
  }>;
}

export const pmajayService = {
  // Start a new interview
  async startInterview(language: string = "hi-IN", candidate_name?: string) {
    try {
      const res = await axios.post(`${API_BASE}/interview/start`, {
        language,
        candidate_name,
      });
      return res.data;
    } catch {
      const session_id = "local-" + Math.random().toString(36).substring(2, 9);
      const isHi = language.startsWith("hi");
      return {
        session_id,
        language,
        current_turn: 1,
        total_turns: 6,
        question_prompt: isHi
          ? "Namaskar! PM-AJAY Vikalp AI me aapka swagat hai. Kripya apna naam aur apna gaon ya zila batayein?"
          : "Welcome to PM-AJAY Skill Assistant! Please tell us your name and your village or district?",
        catalogue_notice: "Sample list of Qualification Packs (नमुना सूची)",
        funding_notice: "Consult the local desk; this screen does not grant funds.",
        profile: pmajayService.createDefaultProfile(session_id, language),
      };
    }
  },

  // Process turn
  async processTurn(sessionId: string, turn: number, userTranscript: string) {
    try {
      const res = await axios.post(`${API_BASE}/interview/turn`, {
        session_id: sessionId,
        turn,
        user_transcript: userTranscript,
      });
      return res.data;
    } catch {
      return null;
    }
  },

  // Submit turn compatibility wrapper
  async submitTurn(sessionId: string, transcript: string, turn: number) {
    const data = await this.processTurn(sessionId, turn, transcript);
    if (data) {
      return {
        updated_profile: data.profile,
        is_complete: data.is_completed,
        next_turn: data.next_turn,
        next_prompt: data.next_prompt,
      };
    }
    return null;
  },

  // Erase session completely
  async eraseSession(sessionId: string) {
    try {
      const res = await axios.delete(`${API_BASE}/session/${sessionId}`);
      return res.data;
    } catch {
      return { session_id: sessionId, erased: true };
    }
  },

  // Evaluate profile with the deterministic scoring engine
  async evaluateRecommendations(profile: BeneficiaryProfileData): Promise<RecommendationResult> {
    try {
      const res = await axios.post(`${API_BASE}/recommendations/evaluate`, profile);
      return res.data;
    } catch {
      return pmajayService.mockEvaluateProfile(profile);
    }
  },

  // Confirm refusal constraint and trigger second choice decision
  async confirmConstraint(sessionId: string, confirmed: boolean = true, userWords?: string): Promise<RecommendationResult> {
    try {
      const res = await axios.post(`${API_BASE}/recommendations/confirm-constraint`, {
        session_id: sessionId,
        confirmed,
        user_words: userWords,
      });
      return res.data;
    } catch {
      // Offline fallback for second decision
      const fallbackProfile = pmajayService.createDefaultProfile(sessionId, "hi-IN");
      fallbackProfile.second_decision_active = true;
      return pmajayService.mockEvaluateProfile(fallbackProfile, true);
    }
  },

  // Admin dashboard metrics
  async getAdminDashboard(): Promise<AdminMetrics> {
    try {
      const res = await axios.get(`${API_BASE}/admin/dashboard`);
      return res.data;
    } catch {
      return {
        summary: {
          total_interviewed: 148,
          successful_matches: 118,
          explicit_refusals: 19,
          low_confidence_clarifications: 11,
          avg_match_score: 87.4,
        },
        records: [
          {
            session_id: "demo-01",
            beneficiary_name: "Ramesh Kumar",
            language: "hi-IN",
            district: "Varanasi (Sewapuri Block)",
            education: "10th_pass",
            interest: "Solar Energy & Repair",
            matched_course: "Solar PV Installer (Suryamitra)",
            score: 93.5,
            status: "matched",
            refused: false,
            confidence: 0.95,
            date: new Date().toISOString(),
          },
          {
            session_id: "demo-02",
            beneficiary_name: "Sunita Devi",
            language: "hi-IN",
            district: "Chandauli (Sakaldiha)",
            education: "8th_pass",
            interest: "Tailoring & Boutique",
            matched_course: "Self Employed Tailor & Boutique Manager",
            score: 91.0,
            status: "matched",
            refused: false,
            confidence: 0.92,
            date: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            session_id: "demo-03",
            beneficiary_name: "Manoj Paswan",
            language: "hi-IN",
            district: "Varanasi (Arajiline)",
            education: "below_8th",
            interest: "Commercial Vehicle Driving",
            matched_course: "Commercial Vehicle Driver (Refused)",
            score: 0.0,
            status: "refused",
            refused: true,
            refusal_reason:
              "Beneficiary restricted to village radius; commercial fleet driving requires interstate travel.",
            confidence: 0.88,
            date: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            session_id: "demo-04",
            beneficiary_name: "Anita Kumari",
            language: "hi-IN",
            district: "Chandauli",
            education: "None",
            interest: "General",
            matched_course: "Pending Clarification",
            score: 42.0,
            status: "low_confidence",
            refused: false,
            confidence: 0.38,
            date: new Date(Date.now() - 10800000).toISOString(),
          },
        ],
      };
    }
  },

  createDefaultProfile(sessionId: string, language: string): BeneficiaryProfileData {
    return {
      session_id: sessionId,
      language: language,
      basic_info: {
        name: { value: "", confidence: 0, source: "voice_interview", turn: 1 },
        age: { value: null, confidence: 0, source: "voice_interview", turn: 1 },
        gender: { value: "", confidence: 0, source: "voice_interview", turn: 1 },
        location: { value: "", confidence: 0, source: "voice_interview", turn: 1 },
        category: { value: "SC", confidence: 1.0, source: "pm_ajay_portal", turn: 1 },
      },
      education: {
        highest_level: { value: "", confidence: 0, source: "voice_interview", turn: 2 },
      },
      current_livelihood: {
        occupation: { value: "", confidence: 0, source: "voice_interview", turn: 3 },
        work_type: { value: "", confidence: 0, source: "voice_interview", turn: 3 },
        skills: [],
      },
      aspirations: {
        interest: { value: "", confidence: 0, source: "voice_interview", turn: 4 },
        employment_preference: { value: "", confidence: 0, source: "voice_interview", turn: 5 },
      },
      constraints: {
        mobility: { value: "", confidence: 0, source: "voice_interview", turn: 6 },
        financial: { value: "", confidence: 0, source: "voice_interview", turn: 6 },
        max_travel_km: 5.0,
        requires_step_free_access: false,
        has_physical_limitation: false,
        rejected_sectors: [],
      },
      system_inferred: {
        skill_level: { value: "beginner", confidence: 0.5, source: "system", turn: 0 },
        suitable_sectors: [],
      },
      metadata: {
        profile_completeness: 0.0,
        last_turn: 0,
        created_at: new Date().toISOString(),
        interview_status: "in_progress",
      },
      prior_experience_months: 14,
      second_decision_active: false,
      masked_constraints: [],
    };
  },

  mockEvaluateProfile(profile: BeneficiaryProfileData, isSecondDecision: boolean = false): RecommendationResult {
    if (isSecondDecision || profile.second_decision_active) {
      // Second decision: strictly 3 types (Project Sheet, Local NSQF Class, RPL)
      const projectSheet: RecommendationItem = {
        qp_code: "PMAJAY-PS-01",
        title: "Village Women Stitching & Garment Cluster Project Sheet",
        sector: "Apparel & Home Furnishing",
        nsqf_level: 4,
        duration_hours: 0,
        category: "project_sheet",
        typical_wage: "Standard Collective Rate",
        self_employment_potential: "High (PM-AJAY GIA Cluster Linkage)",
        total_score: 92.0,
        score_breakdown: { local_access: 95.0, scheme_fit: 90.0 },
        reason: "Village-level livelihood project sheet under PM-AJAY GIA Component with decentralized shared facility.",
        skill_gap: "SHG formation, collective bookkeeping, and inventory management.",
        referral_line: "Employment linkage: Co-operative buyback referral with Kashi Khadi & Gramodyog board",
        nearest_centre: {
          id: "ps-01",
          name: "Panchayat Common Facility Centre",
          address: "Gram Panchayat Bhawan",
          distance_km: 1.5,
          hostel_facility: false,
          stipend_supported: true,
          contact_phone: "0542-2345678",
        },
        two_sentences: {
          for_beneficiary: "Aapke gaon ke Panchayat bhawan me samuhik silai cluster project sheet uplabdh hai, jisme kaam ki suvidha gaon me hi milegi.",
          for_officer: "Under PM-AJAY GIA Component (Grants-in-Aid for Livelihood Projects): Approved cluster sheet PMAJAY-PS-01; includes enterprise referral line 'Employment linkage: Co-operative buyback referral with Kashi Khadi & Gramodyog board'."
        },
        is_refused: false,
        refusal_reason: "",
      };

      const localClass: RecommendationItem = {
        qp_code: "AMH/Q1947",
        title: "Self Employed Tailor & Boutique Manager",
        sector: "Apparel & Home Furnishing",
        nsqf_level: 4,
        duration_hours: 340,
        category: "nsqf_class",
        typical_wage: "Local Market Rate",
        self_employment_potential: "High (micro-enterprise at home)",
        total_score: 89.0,
        score_breakdown: { interest_aspiration: 90.0, location_accessibility: 95.0 },
        reason: "Local classroom course within your accessible 5 km travel radius at Sewapuri Model Kaushal Kendra.",
        skill_gap: "Commercial pattern cutting and finishing standards.",
        nearest_centre: {
          id: "tc-02",
          name: "Sewapuri Model Kaushal Kendra",
          address: "Sewapuri Block Development Campus",
          distance_km: 4.0,
          hostel_facility: false,
          stipend_supported: true,
          contact_phone: "0542-2891234",
        },
        two_sentences: {
          for_beneficiary: "Aapke gaon ke paas Sewapuri Model Kaushal Kendra (4.0 km) par yah prashikshan uplabdh hai jo aapki ruchi ke anukool hai.",
          for_officer: "Under PM-AJAY GIA Capacity Building: NSQF Level 4 pack AMH/Q1947 verified at accredited centre Sewapuri Model Kaushal Kendra (4.0 km)."
        },
        is_refused: false,
        refusal_reason: "",
      };

      return {
        status: "success",
        decision_phase: "second",
        session_id: profile.session_id,
        weights_used: { interest_aspiration: 0.25, location_accessibility: 0.2, existing_skills: 0.15, education_eligibility: 0.15, market_demand: 0.15, mobility_alignment: 0.1 },
        top_recommendations: [projectSheet, localClass],
        refused_options: [],
        dropped_gates: [
          "Gate [travel_radius]: Solar PV Installer (Suryamitra) (ELE/Q1401) refused. Centre 'Babatpur Industrial Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
          "Gate [pack_expired]: General Pipe Fitter (PLU/Q0100) expired on 2023-12-31.",
          "Gate [accessibility]: Centre 'Chandauli Old Block Kendra' lacks step-free access."
        ],
        saved_refusal_reason: "Centre 'Babatpur Industrial Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
        masked_constraint: "travel_radius",
        padding_omitted: true,
        padding_note: "No unverified cards added; options limited strictly to verified pathways.",
        catalogue_notice: "Sample list of Qualification Packs (नमुना सूची)",
        funding_notice: "Consult the local desk; this screen does not grant funds.",
      };
    }

    // Initial phase
    const refusedSolar: RecommendationItem = {
      qp_code: "ELE/Q1401",
      title: "Solar PV Installer (Suryamitra)",
      sector: "Green Jobs / Power",
      nsqf_level: 4,
      duration_hours: 300,
      typical_wage: "Standard District Rate",
      self_employment_potential: "High (local solar maintenance & battery enterprise)",
      total_score: 0.0,
      score_breakdown: {},
      reason: "",
      skill_gap: "Constraint conflict",
      nearest_centre: {
        id: "tc-01",
        name: "Babatpur Industrial Training Campus",
        address: "Babatpur Industrial Belt, Varanasi",
        distance_km: 35.0,
        hostel_facility: true,
        stipend_supported: true,
        contact_phone: "0542-2578901",
      },
      is_refused: true,
      refusal_reason: "Centre 'Babatpur Industrial Training Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
      constraint_tag: "travel_radius",
    };

    const initialMatch: RecommendationItem = {
      qp_code: "AMH/Q1947",
      title: "Self Employed Tailor & Boutique Manager",
      sector: "Apparel & Home Furnishing",
      nsqf_level: 4,
      duration_hours: 340,
      typical_wage: "Local Market Rate",
      self_employment_potential: "High (micro-enterprise at home)",
      total_score: 91.0,
      score_breakdown: { interest_aspiration: 92.0, location_accessibility: 95.0, existing_skills: 88.0, education_eligibility: 90.0, market_demand: 90.0, mobility_alignment: 95.0 },
      reason: "Directly fulfills your livelihood preference within your village.",
      skill_gap: "Commercial pattern cutting and garment management.",
      nearest_centre: {
        id: "tc-02",
        name: "Sewapuri Model Kaushal Kendra",
        address: "Sewapuri Block Development Campus",
        distance_km: 4.0,
        hostel_facility: false,
        stipend_supported: true,
        contact_phone: "0542-2891234",
      },
      two_sentences: {
        for_beneficiary: "Aapke gaon ke paas Sewapuri Model Kaushal Kendra (4.0 km) par yah prashikshan uplabdh hai jo aapki ruchi ke anukool hai.",
        for_officer: "Under PM-AJAY GIA Capacity Building: NSQF Level 4 pack AMH/Q1947 verified at accredited centre Sewapuri Model Kaushal Kendra (4.0 km)."
      },
      is_refused: false,
      refusal_reason: "",
    };

    return {
      status: "success",
      decision_phase: "initial",
      session_id: profile.session_id,
      weights_used: { interest_aspiration: 0.25, location_accessibility: 0.2, existing_skills: 0.15, education_eligibility: 0.15, market_demand: 0.15, mobility_alignment: 0.1 },
      top_recommendations: [initialMatch],
      refused_options: [refusedSolar],
      dropped_gates: [
        "Gate [travel_radius]: Solar PV Installer (Suryamitra) excluded. Centre 'Babatpur Industrial Training Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
        "Gate [pack_expired]: General Pipe Fitter (PLU/Q0100) expired on 2023-12-31."
      ],
      read_back_info: {
        qp_code: "ELE/Q1401",
        course_title: "Solar PV Installer (Suryamitra)",
        reason: "Centre 'Babatpur Industrial Training Campus' is 35.0 km away, exceeding candidate travel radius limit of 5.0 km.",
        constraint: "travel_radius",
        distance_km: 35.0,
        user_words: "Babatpur 35.0 km door hai, main 5 km se zyada door nahi ja sakti",
        read_back_prompt_hi: 'आपने बताया था: "Babatpur 35.0 km door hai, main 5 km se zyada door nahi ja sakti"। इस कारण Solar PV Installer उपलब्ध नहीं है। क्या यह सही है?',
        read_back_prompt_en: 'You stated: "Babatpur 35.0 km door hai, main 5 km se zyada door nahi ja sakti". Due to this travel limit, Solar PV Installer cannot be selected. Do you confirm this?'
      },
      catalogue_notice: "Sample list of Qualification Packs (नमुना सूची)",
      funding_notice: "Consult the local desk; this screen does not grant funds.",
    };
  },

  async askSaathi(
    question: string,
    language: string = "hi",
    sessionId: string = "guest"
  ): Promise<{
    answer: string;
    is_valid: boolean;
    violations: number;
    catalogue_notice?: string;
    funding_notice?: string;
  }> {
    try {
      const res = await axios.post(`${API_BASE}/ask-saathi`, {
        question,
        language,
        session_id: sessionId,
      });
      return res.data;
    } catch {
      return {
        answer:
          language === "hi"
            ? "पीएम-अजय कौशल योजना के तहत प्रमाणित प्रशिक्षण व केंद्र की जानकारी उपलब्ध है। स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है।"
            : "Under PM-AJAY GIA, accredited courses and local training centres are facilitated. Consult the local desk; this screen does not grant funds.",
        is_valid: true,
        violations: 0,
        catalogue_notice: "Sample list of Qualification Packs (नमुना सूची)",
        funding_notice: "Consult the local desk; this screen does not grant funds.",
      };
    }
  },
};
