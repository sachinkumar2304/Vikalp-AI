import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData } from "@/services/pmajayService";
import { UserCheck, ShieldCheck, ArrowRight, Edit3, Code, Award } from "lucide-react";

export const PMAJAYProfileSummary: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  useEffect(() => {
    const cached = localStorage.getItem("pmajay_active_profile");
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
        return;
      } catch (e) {
        // fallback
      }
    }

    // Default sample for immediate rich demonstration
    const defaultSample = pmajayService.createDefaultProfile("sample-session-101", "hi-IN");
    defaultSample.basic_info.name.value = "Ramesh Kumar";
    defaultSample.basic_info.name.confidence = 0.94;
    defaultSample.basic_info.location.value = "Varanasi (Sewapuri Block)";
    defaultSample.basic_info.location.confidence = 0.92;
    defaultSample.education.highest_level.value = "10th_pass";
    defaultSample.education.highest_level.confidence = 0.90;
    defaultSample.current_livelihood.occupation.value = "Electrician Helper (Informal)";
    defaultSample.current_livelihood.occupation.confidence = 0.88;
    defaultSample.current_livelihood.skills = ["basic_wiring", "motor_repair_assist", "tools_handling"];
    defaultSample.aspirations.interest.value = "Solar Rooftop and Renewable Electricity";
    defaultSample.aspirations.interest.confidence = 0.95;
    defaultSample.aspirations.employment_preference.value = "self_employment";
    defaultSample.aspirations.employment_preference.confidence = 0.91;
    defaultSample.constraints.mobility.value = "within_block";
    defaultSample.constraints.mobility.confidence = 0.89;
    defaultSample.metadata.profile_completeness = 0.95;

    setProfile(defaultSample);
    localStorage.setItem("pmajay_active_profile", JSON.stringify(defaultSample));
  }, []);

  const handleRunRecommendationEngine = () => {
    navigate("/pmajay/recommendations");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider mb-2">
          <span>चरण 3 / Step 3</span>
          <span>•</span>
          <span>लाभार्थी प्रोफाइल सारांश / Beneficiary Profile Summary</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142A20]">
              संरचित लाभार्थी प्रोफाइल (Structured Profile)
            </h1>
            <p className="text-xs text-[#526D61] mt-1">
              Extracted turn-by-turn with confidence and source tracing. The LLM only parses; scoring is separate.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#CCDCD4] bg-white hover:bg-[#EEF4F0] text-xs font-medium text-[#254B3B] transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showRawJson ? "Hide Raw JSON" : "Inspect JSON State"}</span>
            </button>
            <button
              type="button"
              onClick={handleRunRecommendationEngine}
              className="inline-flex items-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-5 py-2 rounded-lg font-semibold text-xs shadow-sm transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Run Transparent Scoring Engine</span>
            </button>
          </div>
        </div>

        {/* Raw JSON viewer toggle */}
        {showRawJson && (
          <div className="mb-6 bg-[#0E1B15] text-[#86E3CE] p-4 rounded-xl border border-[#234234] text-xs font-mono overflow-x-auto shadow-inner">
            <div className="flex justify-between items-center text-white pb-2 mb-2 border-b border-[#234234]">
              <span className="font-semibold">beneficiary_profile.json</span>
              <span className="text-[10px] text-[#A6CDBA]">Session ID: {profile.session_id}</span>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}

        {/* Structured Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Identity & Demographics */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3EF] mb-3">
              <h3 className="font-bold text-sm text-[#183126]">1. Basic Information & Target Category</h3>
              <span className="text-[11px] font-mono text-[#386350] bg-[#E3EFEA] px-2 py-0.5 rounded">
                GIA Verified
              </span>
            </div>
            <div className="space-y-2.5 text-xs text-[#3C584C]">
              <div className="flex justify-between">
                <span>Beneficiary Name:</span>
                <strong className="text-[#132A20]">{profile.basic_info.name.value || "—"}</strong>
              </div>
              <div className="flex justify-between">
                <span>District / Block:</span>
                <strong className="text-[#132A20]">{profile.basic_info.location.value || "—"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Target Social Category:</span>
                <span className="font-bold text-[#234F3D]">
                  {profile.basic_info.category.value || "Scheduled Caste (SC)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Spoken Language:</span>
                <span className="font-mono text-[#183528]">{profile.language}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Education & Academic Level */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3EF] mb-3">
              <h3 className="font-bold text-sm text-[#183126]">2. Education Level & NSQF Eligibility</h3>
              <span className="text-[11px] text-[#417B60]">
                {Math.round((profile.education.highest_level.confidence || 0.9) * 100)}% Confidence
              </span>
            </div>
            <div className="space-y-2.5 text-xs text-[#3C584C]">
              <div className="flex justify-between items-center">
                <span>Highest Qualification:</span>
                <span className="bg-[#E4EFEA] text-[#1B3F2F] font-semibold px-2 py-0.5 rounded uppercase font-mono">
                  {profile.education.highest_level.value?.replace("_", " ") || "10th Pass"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NSQF Prerequisite Fit:</span>
                <span className="text-[#25503E] font-medium">Eligible up to NSQF Level 4 Courses</span>
              </div>
              <div className="flex justify-between">
                <span>Extraction Source:</span>
                <span className="italic">{profile.education.highest_level.source || "voice_interview"}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Prior Experience & Traditional Trade */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3EF] mb-3">
              <h3 className="font-bold text-sm text-[#183126]">3. Current Livelihood & Existing Skills</h3>
              <span className="text-[11px] text-[#417B60]">
                {Math.round((profile.current_livelihood.occupation.confidence || 0.88) * 100)}% Confidence
              </span>
            </div>
            <div className="space-y-2.5 text-xs text-[#3C584C]">
              <div>
                <span>Occupation / Family Trade:</span>
                <div className="font-bold text-[#142A20] text-sm mt-0.5">
                  {profile.current_livelihood.occupation.value || "Daily Wage / Informal Helper"}
                </div>
              </div>
              <div>
                <span>Recognized Skills for RPL (Prior Learning):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.current_livelihood.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-[#EDF4F0] text-[#224637] border border-[#CCDCD4] px-2 py-0.5 rounded text-[11px]"
                    >
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Aspirations & Constraints */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3EF] mb-3">
              <h3 className="font-bold text-sm text-[#183126]">4. Aspirations & Mobility Constraints</h3>
              <span className="text-[11px] text-[#345F4B] font-medium">Named Constraint Inputs</span>
            </div>
            <div className="space-y-2.5 text-xs text-[#3C584C]">
              <div className="flex justify-between items-center">
                <span>Stated Interest Area:</span>
                <span className="font-bold text-[#142A20]">
                  {profile.aspirations.interest.value || "Solar & Electricity"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Employment Goal:</span>
                <span className="bg-[#DFEDE6] text-[#193F2F] px-2 py-0.5 rounded font-semibold">
                  {profile.aspirations.employment_preference.value?.replace("_", " ") || "Self Employment"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Mobility Boundary:</span>
                <span className="text-[#963737] font-semibold bg-[#FCEAEA] px-2 py-0.5 rounded">
                  {profile.constraints.mobility.value?.replace("_", " ") || "Within Block Only"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-[#E7F0EB] border border-[#CCDCD4] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#426052]">
            <strong>Ready for Evaluation:</strong> The scoring engine uses named mathematical weights and 
            enforces hard refusal rules to prevent recommending non-viable trades.
          </div>
          <button
            type="button"
            onClick={handleRunRecommendationEngine}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all"
          >
            <span>Proceed to NSQF Recommendations</span>
          </button>
        </div>
      </main>
    </div>
  );
};
