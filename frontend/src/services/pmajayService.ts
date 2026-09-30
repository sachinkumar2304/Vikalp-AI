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
}

export interface RecommendationItem {
  qp_code: string;
  title: string;
  sector: string;
  nsqf_level: number;
  duration_hours: number;
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
}

export interface RecommendationResult {
  status: "success" | "needs_clarification";
  session_id?: string;
  clarification_question?: string;
  missing_field?: string;
  weights_used: Record<string, number>;
  top_recommendations: RecommendationItem[];
  refused_options: RecommendationItem[];
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
      // Offline fallback state for resilient client-side demo if backend is offline
      const session_id = "local-" + Math.random().toString(36).substring(2, 9);
      const isHi = language.startsWith("hi");
      return {
        session_id,
        language,
        current_turn: 1,
        total_turns: 6,
        question_prompt: isHi
          ? "Namaskar! PM-AJAY Kaushal Mitra me aapka swagat hai. Kripya apna naam aur apna gaon ya zila batayein?"
          : "Welcome to PM-AJAY Skill Assistant! Please tell us your name and your village or district?",
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

  // Evaluate profile with the deterministic scoring engine
  async evaluateRecommendations(profile: BeneficiaryProfileData): Promise<RecommendationResult> {
    try {
      const res = await axios.post(`${API_BASE}/recommendations/evaluate`, profile);
      return res.data;
    } catch {
      // Fallback evaluation client-side matching engine to guarantee 100% demo uptime
      return pmajayService.mockEvaluateProfile(profile);
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
              "Beneficiary strictly restricted to village mobility; commercial fleet driving requires interstate travel.",
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
    };
  },

  mockEvaluateProfile(profile: BeneficiaryProfileData): RecommendationResult {
    const isSolar = (profile.aspirations.interest.value || "").toLowerCase().includes("solar") ||
      (profile.aspirations.interest.value || "").toLowerCase().includes("bijli");

    const topItem: RecommendationItem = isSolar
      ? {
          qp_code: "ELE/Q1401",
          title: "Solar PV Installer (Suryamitra)",
          sector: "Green Jobs / Power",
          nsqf_level: 4,
          duration_hours: 300,
          typical_wage: "₹15,000 - ₹22,000 / month",
          self_employment_potential: "High (local solar maintenance & battery enterprise)",
          total_score: 93.5,
          score_breakdown: {
            interest_aspiration: 95.0,
            location_accessibility: 92.0,
            existing_skills: 85.0,
            education_eligibility: 100.0,
            market_demand: 95.0,
            mobility_alignment: 90.0,
          },
          reason:
            "Matches your interest in renewable electricity and prior wiring familiarity, offering high wage growth in the Varanasi solar belt.",
          skill_gap: "Needs technical certification on safety, inverter inverter troubleshooting, and DC earthing.",
          matched_local_opportunity: {
            id: "opp-01",
            sector: "Green Jobs / Power",
            title: "Solar Rooftop Technician & AMC Assistant",
            type: "wage_employment",
            employer_or_model: "Surya Urja Vikas Samiti & Local EPC Contractors",
            location: "Babatpur Block, Varanasi",
            distance_km: 7.5,
            stipend_or_wage: "₹16,000 / mo + conveyance",
            openings: 12,
            matched_qp_code: "ELE/Q1401",
            eligible_schemes: ["PM-AJAY GIA Capital Subsidy", "PM Surya Ghar Muft Bijli Yojana"],
            contact_person: "District Skill Nodal Officer, ITI Karaundi",
          },
          nearest_centre: {
            id: "tc-01",
            name: "Pradhan Mantri Kaushal Kendra (PMKK) & ITI Karaundi Campus",
            address: "Karaundi, Near BHU, Varanasi",
            distance_km: 8.0,
            hostel_facility: true,
            stipend_supported: true,
            contact_phone: "0542-2578901",
          },
          is_refused: false,
          refusal_reason: "",
        }
      : {
          qp_code: "AMH/Q1947",
          title: "Self Employed Tailor & Boutique Manager",
          sector: "Apparel & Home Furnishing",
          nsqf_level: 4,
          duration_hours: 340,
          typical_wage: "₹12,000 - ₹25,000 / month (self income)",
          self_employment_potential: "Excellent (micro-enterprise at home with PM-AJAY capital subsidy)",
          total_score: 91.0,
          score_breakdown: {
            interest_aspiration: 92.0,
            location_accessibility: 95.0,
            existing_skills: 88.0,
            education_eligibility: 90.0,
            market_demand: 90.0,
            mobility_alignment: 95.0,
          },
          reason:
            "Directly fulfills your self-employment preference within your village with 100% PM-AJAY sewing machine & toolkit capital subsidy.",
          skill_gap: "Needs commercial pattern cutting, costing, and boutique management training.",
          matched_local_opportunity: {
            id: "opp-02",
            sector: "Apparel & Home Furnishing",
            title: "Micro Boutique & Village Stitching Enterprise",
            type: "self_employment",
            employer_or_model: "Self-Employed / PM-AJAY GIA Grant Support",
            location: "Arajiline Block / Village Level",
            distance_km: 1.2,
            stipend_or_wage: "Estimated ₹12,000 - ₹20,000 / mo net profit",
            openings: "Unlimited (Self-employment)",
            matched_qp_code: "AMH/Q1947",
            eligible_schemes: ["PM-AJAY GIA Tool Kit & Machinery Grant (up to ₹50,000)", "Mudra Shishu Loan"],
            contact_person: "Block Development Officer (BDO), Social Welfare Wing",
          },
          nearest_centre: {
            id: "tc-02",
            name: "RSETI Rural Self Employment Training Institute",
            address: "Baroda RSETI, Near Ring Road, Chiraigaon",
            distance_km: 5.5,
            hostel_facility: true,
            stipend_supported: true,
            contact_phone: "0542-2345678",
          },
          is_refused: false,
          refusal_reason: "",
        };

    const secondItem: RecommendationItem = {
      qp_code: "ELE/Q3102",
      title: "Field Technician - Home Appliances",
      sector: "Electronics",
      nsqf_level: 4,
      duration_hours: 360,
      typical_wage: "₹12,000 - ₹18,000 / month",
      self_employment_potential: "Very High (independent village repair shop)",
      total_score: 84.5,
      score_breakdown: {
        interest_aspiration: 80.0,
        location_accessibility: 90.0,
        existing_skills: 82.0,
        education_eligibility: 90.0,
        market_demand: 88.0,
        mobility_alignment: 85.0,
      },
      reason:
        "High local repair demand in your block with grant eligible toolkit for motor and home equipment servicing.",
      skill_gap: "Needs PCB board diagnostics and digital multimeter usage training.",
      nearest_centre: {
        id: "tc-01",
        name: "Pradhan Mantri Kaushal Kendra (PMKK) & ITI Karaundi Campus",
        address: "Karaundi, Near BHU, Varanasi",
        distance_km: 8.0,
        hostel_facility: true,
        stipend_supported: true,
        contact_phone: "0542-2578901",
      },
      is_refused: false,
      refusal_reason: "",
    };

    const refusedItem: RecommendationItem = {
      qp_code: "ASC/Q9701",
      title: "Commercial Vehicle Driver & Fleet Operator",
      sector: "Logistics",
      nsqf_level: 4,
      duration_hours: 300,
      typical_wage: "₹16,000 - ₹28,000 / month",
      self_employment_potential: "Moderate",
      total_score: 0.0,
      score_breakdown: {},
      reason: "",
      skill_gap: "Constraint conflict",
      is_refused: true,
      refusal_reason:
        "Mobility constraint: Candidate is restricted to village/block level, but commercial fleet operations require state-wide mobility.",
    };

    return {
      status: "success",
      session_id: profile.session_id,
      weights_used: {
        interest_aspiration: 0.25,
        location_accessibility: 0.2,
        existing_skills: 0.15,
        education_eligibility: 0.15,
        market_demand: 0.15,
        mobility_alignment: 0.1,
      },
      top_recommendations: [topItem, secondItem],
      refused_options: [refusedItem],
      voice_summary: {
        text_hi: `Aapke liye sabse behtar vikalp hai '${topItem.title}'. Karan: ${topItem.reason} Aapka nikat-tam training centre '${topItem.nearest_centre?.name}' lagbhag ${topItem.nearest_centre?.distance_km} km door hai. PM-AJAY ke tehat isme 100% muft prashikshan aur toolkit sahayata uplabdh hai.`,
        text_en: `The best recommended course for you is '${topItem.title}'. Reason: ${topItem.reason} Your nearest training centre is '${topItem.nearest_centre?.name}', approximately ${topItem.nearest_centre?.distance_km} km away, with 100% grant and toolkit subsidy under PM-AJAY GIA.`,
      },
    };
  },

  async askSaathi(
    question: string,
    language: string = "hi",
    sessionId: string = "guest"
  ): Promise<{
    answer: string;
    is_valid: boolean;
    is_lockout_warning?: boolean;
    violations: number;
  }> {
    try {
      const res = await axios.post(`${API_BASE}/ask-saathi`, {
        question,
        language,
        session_id: sessionId,
      });
      return res.data;
    } catch (e) {
      console.warn("Backend /ask-saathi failed, fallback to local rule guard:", e);
      return {
        answer:
          language === "hi"
            ? "मैं केवल पीएम-अजय कौशल योजना और सरकारी कोर्सेस से संबंधित प्रश्नों का उत्तर दे सकता हूँ।"
            : language === "mr"
            ? "मी केवळ पीएम-अजय कौशल्य अभ्यासक्रमासंबंधी प्रश्नांची उत्तरे देऊ शकतो."
            : "I can only answer questions related to PM-AJAY skilling and government courses.",
        is_valid: true,
        violations: 0,
      };
    }
  },
};

