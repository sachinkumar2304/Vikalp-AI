import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  pmajayService,
  BeneficiaryProfileData,
  RecommendationResult,
  RecommendationItem
} from "@/services/pmajayService";
import { WhatIfParams } from "@/components/pmajay/WhatIfSimulator";

const STORAGE_KEY_PROFILE = "pmajay_current_profile";
const STORAGE_KEY_RESULT = "pmajay_recommendation_result";
const STORAGE_KEY_WHATIF = "pmajay_what_if_params";

const DEFAULT_WHATIF_PARAMS: WhatIfParams = {
  travelRadiusKm: 5,
  dailyHours: 6,
  pathwayFilter: "all",
};

export interface BeneficiaryContextType {
  profile: BeneficiaryProfileData;
  result: RecommendationResult | null;
  whatIfParams: WhatIfParams;
  loading: boolean;
  syncing: boolean;
  hasActiveSession: boolean;
  primaryMatch: RecommendationItem | null;
  filteredRecommendations: RecommendationItem[];
  // Actions
  setProfile: (profile: BeneficiaryProfileData) => void;
  updateProfile: (
    updater: Partial<BeneficiaryProfileData> | ((prev: BeneficiaryProfileData) => BeneficiaryProfileData)
  ) => void;
  setWhatIfParams: (params: WhatIfParams) => void;
  resetWhatIfParams: () => void;
  runEvaluation: (customProfile?: BeneficiaryProfileData) => Promise<RecommendationResult>;
  confirmConstraint: (userWords?: string) => Promise<RecommendationResult>;
  eraseSession: () => Promise<void>;
  submitTurn: (userTranscript: string, turn: number) => Promise<any>;
  initSession: (candidateName?: string, language?: string) => Promise<string>;
  setLanguage: (lang: string) => void;
  reloadFromStorage: () => void;
}

const BeneficiaryContext = createContext<BeneficiaryContextType | undefined>(undefined);

export const BeneficiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<BeneficiaryProfileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return pmajayService.createDefaultProfile("eval-init", "hi-IN");
      }
    }
    return pmajayService.createDefaultProfile("eval-init", "hi-IN");
  });

  const [result, setResultState] = useState<RecommendationResult | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RESULT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [whatIfParams, setWhatIfParamsState] = useState<WhatIfParams>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WHATIF);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_WHATIF_PARAMS;
      }
    }
    return DEFAULT_WHATIF_PARAMS;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Sync profile state to localStorage
  const setProfile = useCallback((newProfile: BeneficiaryProfileData) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch {
      // Storage quota or error safe
    }
  }, []);

  const updateProfile = useCallback((
    updater: Partial<BeneficiaryProfileData> | ((prev: BeneficiaryProfileData) => BeneficiaryProfileData)
  ) => {
    setProfileState((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
  }, []);

  // Sync result state to localStorage
  const setResult = useCallback((newResult: RecommendationResult | null) => {
    setResultState(newResult);
    try {
      if (newResult) {
        localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(newResult));
      } else {
        localStorage.removeItem(STORAGE_KEY_RESULT);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Evaluate recommendations
  const runEvaluation = useCallback(async (customProfile?: BeneficiaryProfileData): Promise<RecommendationResult> => {
    const targetProfile = customProfile || profile;
    setLoading(true);
    try {
      const evalData = await pmajayService.evaluateRecommendations(targetProfile);
      setResult(evalData);
      return evalData;
    } finally {
      setLoading(false);
    }
  }, [profile, setResult]);

  // Set what-if parameters and re-evaluate if radius changed
  const setWhatIfParams = useCallback((newParams: WhatIfParams) => {
    setWhatIfParamsState(newParams);
    try {
      localStorage.setItem(STORAGE_KEY_WHATIF, JSON.stringify(newParams));
    } catch {
      // Safe fallback
    }

    // Live sync: If travel radius changed, update candidate constraint and re-evaluate
    setProfileState((prev) => {
      const currentRadius = prev.constraints.max_travel_km;
      if (currentRadius !== newParams.travelRadiusKm) {
        const updatedProfile: BeneficiaryProfileData = {
          ...prev,
          constraints: {
            ...prev.constraints,
            max_travel_km: newParams.travelRadiusKm,
          },
        };
        try {
          localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
        } catch {
          // Safe fallback
        }
        // Trigger re-evaluation in background
        pmajayService.evaluateRecommendations(updatedProfile).then((newEval) => {
          setResult(newEval);
        });
        return updatedProfile;
      }
      return prev;
    });
  }, [setResult]);

  const resetWhatIfParams = useCallback(() => {
    setWhatIfParams(DEFAULT_WHATIF_PARAMS);
  }, [setWhatIfParams]);

  // Confirm refusal and proceed to second decision phase
  const confirmConstraint = useCallback(async (userWords?: string): Promise<RecommendationResult> => {
    setLoading(true);
    try {
      const words = userWords || result?.read_back_info?.user_words || "Babatpur 35 km door hai, main 5 km se zyada door nahi ja sakti";
      const secondDecision = await pmajayService.confirmConstraint(profile.session_id, true, words);
      setResult(secondDecision);

      const updatedProfile: BeneficiaryProfileData = {
        ...profile,
        second_decision_active: true,
        masked_constraints: [
          ...(profile.masked_constraints || []),
          secondDecision.masked_constraint || result?.read_back_info?.constraint || "travel_radius",
        ],
        refusal_record: {
          qp_code: result?.read_back_info?.qp_code || "ELE/Q1401",
          course_title: result?.read_back_info?.course_title || "Solar PV Installer (Suryamitra)",
          reason: secondDecision.saved_refusal_reason || result?.read_back_info?.reason || "",
          constraint: result?.read_back_info?.constraint || "travel_radius",
          user_words: words,
          confirmed: true,
          distance_km: result?.read_back_info?.distance_km,
        },
      };

      setProfile(updatedProfile);
      return secondDecision;
    } finally {
      setLoading(false);
    }
  }, [profile, result, setProfile, setResult]);

  // Erase session completely from memory, storage, and backend
  const eraseSession = useCallback(async () => {
    setLoading(true);
    try {
      if (profile?.session_id) {
        await pmajayService.eraseSession(profile.session_id);
      }
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_RESULT);
      localStorage.removeItem(STORAGE_KEY_WHATIF);

      const blank = pmajayService.createDefaultProfile("session-" + Date.now(), profile.language || "hi-IN");
      setProfileState(blank);
      setResultState(null);
      setWhatIfParamsState(DEFAULT_WHATIF_PARAMS);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Submit interview turn and update profile in real-time
  const submitTurn = useCallback(async (userTranscript: string, turn: number) => {
    setSyncing(true);
    try {
      const res = await pmajayService.submitTurn(profile.session_id, userTranscript, turn);
      if (res?.updated_profile) {
        setProfile(res.updated_profile);
        if (res.is_complete) {
          // Auto evaluate when interview completes
          runEvaluation(res.updated_profile);
        }
      }
      return res;
    } finally {
      setSyncing(false);
    }
  }, [profile.session_id, runEvaluation, setProfile]);

  // Initialize fresh interview session
  const initSession = useCallback(async (candidateName?: string, language?: string): Promise<string> => {
    setLoading(true);
    try {
      const targetLang = language || profile.language || "hi-IN";
      const res = await pmajayService.initInterview(candidateName, targetLang);
      if (res?.profile) {
        setProfile(res.profile);
        setResultState(null);
      }
      return res.session_id;
    } finally {
      setLoading(false);
    }
  }, [profile.language, setProfile]);

  const setLanguage = useCallback((lang: string) => {
    updateProfile({ language: lang });
  }, [updateProfile]);

  const reloadFromStorage = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        setProfileState(JSON.parse(saved));
      } catch {
        // Safe fallback
      }
    }
    const savedResult = localStorage.getItem(STORAGE_KEY_RESULT);
    if (savedResult) {
      try {
        setResultState(JSON.parse(savedResult));
      } catch {
        // Safe fallback
      }
    }
  }, []);

  // Filter recommendations based on active what-if pathway filter
  const filteredRecommendations = useMemo(() => {
    const rawMatches = result?.top_recommendations || [];
    return rawMatches.filter((item) => {
      if (whatIfParams.pathwayFilter === "self") {
        if (item.category === "nsqf_class" && item.self_employment_potential.toLowerCase().includes("moderate")) {
          return false;
        }
      }
      return true;
    });
  }, [result?.top_recommendations, whatIfParams.pathwayFilter]);

  const primaryMatch = useMemo(() => {
    return filteredRecommendations[0] || result?.top_recommendations[0] || null;
  }, [filteredRecommendations, result?.top_recommendations]);

  const hasActiveSession = useMemo(() => {
    const hasName = Boolean(profile.basic_info?.name?.value);
    const hasSkills = Boolean(profile.current_livelihood?.skills?.length);
    const isCompleted = profile.metadata?.interview_status === "completed";
    return Boolean(hasName || hasSkills || isCompleted || result);
  }, [profile, result]);

  const contextValue = useMemo<BeneficiaryContextType>(() => ({
    profile,
    result,
    whatIfParams,
    loading,
    syncing,
    hasActiveSession,
    primaryMatch,
    filteredRecommendations,
    setProfile,
    updateProfile,
    setWhatIfParams,
    resetWhatIfParams,
    runEvaluation,
    confirmConstraint,
    eraseSession,
    submitTurn,
    initSession,
    setLanguage,
    reloadFromStorage,
  }), [
    profile,
    result,
    whatIfParams,
    loading,
    syncing,
    hasActiveSession,
    primaryMatch,
    filteredRecommendations,
    setProfile,
    updateProfile,
    setWhatIfParams,
    resetWhatIfParams,
    runEvaluation,
    confirmConstraint,
    eraseSession,
    submitTurn,
    initSession,
    setLanguage,
    reloadFromStorage,
  ]);

  return (
    <BeneficiaryContext.Provider value={contextValue}>
      {children}
    </BeneficiaryContext.Provider>
  );
};

export const useBeneficiary = (): BeneficiaryContextType => {
  const context = useContext(BeneficiaryContext);
  if (!context) {
    throw new Error("useBeneficiary must be used within a BeneficiaryProvider");
  }
  return context;
};
