import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import {
  pmajayService,
  BeneficiaryProfileData,
  RecommendationResult,
  RecommendationItem,
} from "@/services/pmajayService";
import {
  Award,
  Volume2,
  XCircle,
  CheckCircle2,
  MapPin,
  Briefcase,
  AlertTriangle,
  HelpCircle,
  Sliders,
  ChevronRight,
} from "lucide-react";

export const PMAJAYRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [showWeightsModal, setShowWeightsModal] = useState<boolean>(false);

  useEffect(() => {
    const runEvaluation = async () => {
      setLoading(true);
      const cached = localStorage.getItem("pmajay_active_profile");
      let currentProfile: BeneficiaryProfileData;

      if (cached) {
        try {
          currentProfile = JSON.parse(cached);
        } catch {
          currentProfile = pmajayService.createDefaultProfile("eval-1", "hi-IN");
        }
      } else {
        currentProfile = pmajayService.createDefaultProfile("eval-1", "hi-IN");
      }

      setProfile(currentProfile);
      const evalData = await pmajayService.evaluateRecommendations(currentProfile);
      setResult(evalData);
      setLoading(false);

      // Auto play TTS voice reply if available
      if (evalData.voice_summary) {
        speakVoiceSummary(evalData.voice_summary.text_hi || evalData.voice_summary.text_en);
      }
    };

    runEvaluation();
  }, []);

  const speakVoiceSummary = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingTTS(true);
      utterance.onend = () => setIsPlayingTTS(false);
      utterance.onerror = () => setIsPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
        <PMAJAYNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-[#2A5643] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-bold text-[#142A20]">पारदर्शी स्कोरिंग इंजन गणना कर रहा है...</h2>
          <p className="text-xs text-[#526D61] mt-1">
            Evaluating NSQF Qualification Packs against educational prerequisites, mobility constraints, and local demand...
          </p>
        </div>
      </div>
    );
  }

  // Handle Low Confidence / Clarification condition
  if (result?.status === "needs_clarification") {
    return (
      <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
        <PMAJAYNavbar />
        <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full text-center">
          <div className="w-14 h-14 bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-[#B45309] bg-[#FEF3C7] px-3 py-1 rounded-full uppercase tracking-wider">
            स्पष्टीकरण आवश्यक / Clarification Needed
          </span>
          <h1 className="text-2xl font-bold text-[#142A20] mt-3 mb-2">
            अस्पष्टता के कारण एक और प्रश्न आवश्यक है
          </h1>
          <p className="text-sm text-[#4E665A] mb-6 leading-relaxed">
            The scoring engine refused to guess blindly because confidence for field{" "}
            <strong>"{result.missing_field}"</strong> was too low to ensure an accurate livelihood match.
          </p>
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-6 text-left shadow-sm mb-6">
            <div className="text-xs text-[#526D61] mb-1 font-semibold uppercase">Clarifying Question:</div>
            <p className="text-base text-[#152F23] font-medium italic">
              "{result.clarification_question}"
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/pmajay/interview")}
            className="inline-flex items-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all"
          >
            <span>Return to Voice Interview</span>
          </button>
        </main>
      </div>
    );
  }

  const topMatches = result?.top_recommendations || [];
  const refusals = result?.refused_options || [];
  const primaryMatch = topMatches[0];

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider mb-2">
          <span>चरण 4 / Step 4</span>
          <span>•</span>
          <span>NSQF अनुशंसाएं एवं तर्क / NSQF Recommendations & Reasoning</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142A20]">
              कौशल प्रशिक्षण एवं आजीविका मिलान (Skill Matching)
            </h1>
            <p className="text-xs text-[#526D61] mt-1">
              Scoring is strictly explainable with named weights. The LLM does NOT decide the final recommendation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowWeightsModal(!showWeightsModal)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#CCDCD4] bg-white hover:bg-[#EEF4F0] text-xs font-medium text-[#254B3B] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showWeightsModal ? "Hide Scoring Formula" : "View Scoring Weights"}</span>
          </button>
        </div>

        {/* Transparent Weights Breakdown Banner */}
        {showWeightsModal && (
          <div className="mb-6 bg-white border border-[#C5DDD2] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#142A20] mb-2 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#2E5E4A]" />
              <span>Transparent Mathematical Weights Configuration</span>
            </h3>
            <p className="text-xs text-[#526D61] mb-4">
              Weights are visible and statically auditable according to PM-AJAY GIA operational criteria:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">25%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Interest / Aspiration</div>
              </div>
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">20%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Location & Cluster</div>
              </div>
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">15%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Existing Skills (RPL)</div>
              </div>
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">15%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Education Fit</div>
              </div>
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">15%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Local Market Demand</div>
              </div>
              <div className="bg-[#F2F7F4] p-2.5 rounded-lg border border-[#D5E5DC]">
                <div className="text-lg font-extrabold text-[#1F4635]">10%</div>
                <div className="text-[11px] text-[#4E6B5E] mt-0.5">Mobility Alignment</div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Reply (TTS Audio Player) Banner */}
        {result?.voice_summary && (
          <div className="mb-6 bg-[#E8F1EC] border border-[#BFD9CB] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#274B3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className={`w-4 h-4 ${isPlayingTTS ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#264D3C] flex items-center space-x-1.5">
                  <span>Voice Summary for Beneficiary (ध्वनि संदेश)</span>
                  {isPlayingTTS && <span className="text-[10px] text-[#2F6D52] font-normal italic">• Playing...</span>}
                </div>
                <p className="text-xs text-[#395649] mt-1 leading-relaxed max-w-3xl">
                  "{result.voice_summary.text_hi}"
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakVoiceSummary(result.voice_summary?.text_hi || "")}
              className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#274B3B] hover:bg-[#34624F] text-white transition-colors shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Replay Voice</span>
            </button>
          </div>
        )}

        {/* Primary Recommended Course Card */}
        {primaryMatch && (
          <div className="mb-8 bg-white border-2 border-[#33634E] rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#33634E] text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg">
              Top Ranked Match • {primaryMatch.total_score}% Score
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#EDF3EF] mb-4">
              <div>
                <span className="text-xs font-mono font-medium text-[#46735E] bg-[#E8F2EC] px-2 py-0.5 rounded">
                  QP Code: {primaryMatch.qp_code} • NSQF Level {primaryMatch.nsqf_level}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#142A20] mt-1">
                  {primaryMatch.title}
                </h2>
                <p className="text-xs text-[#526D61] mt-0.5">
                  Sector: <strong>{primaryMatch.sector}</strong> • Duration: {primaryMatch.duration_hours} Hours
                </p>
              </div>

              <div className="text-left md:text-right">
                <div className="text-xs text-[#526D61]">Estimated Monthly Earning</div>
                <div className="text-base font-bold text-[#1A4B36]">{primaryMatch.typical_wage}</div>
              </div>
            </div>

            {/* Plain-Language Reason tied to answers */}
            <div className="mb-4 bg-[#F5FAF7] border-l-4 border-[#33634E] p-3 rounded-r-lg">
              <div className="text-xs font-bold text-[#1F4B38] mb-0.5">
                Plain-Language Reason (क्यों मिला यह सुझाव?):
              </div>
              <p className="text-xs sm:text-sm text-[#274638] leading-relaxed">
                "{primaryMatch.reason}"
              </p>
            </div>

            {/* Skill Gap Analysis */}
            <div className="mb-5 bg-[#FAFBFB] border border-[#E3ECE7] p-3.5 rounded-lg text-xs">
              <div className="font-semibold text-[#183528] mb-1">
                कौशल अंतराल (Skill Gap & Bridge Curriculum):
              </div>
              <p className="text-[#415F52] leading-relaxed">{primaryMatch.skill_gap}</p>
            </div>

            {/* Nearest PM-AJAY Accredited Training Centre */}
            {primaryMatch.nearest_centre && (
              <div className="bg-[#EBF2EE] border border-[#CCDCD4] rounded-lg p-3.5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-[#142A20]">
                    <MapPin className="w-3.5 h-3.5 text-[#2C5743]" />
                    <span>निकटतम प्रशिक्षण केंद्र / Nearest Accredited Training Centre</span>
                  </div>
                  <div className="text-[#325243] font-medium mt-0.5">
                    {primaryMatch.nearest_centre.name} ({primaryMatch.nearest_centre.distance_km} km away)
                  </div>
                  <div className="text-[#597769] text-[11px]">
                    {primaryMatch.nearest_centre.address} • Phone: {primaryMatch.nearest_centre.contact_phone}
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="bg-white border border-[#BDD1C7] text-[#1E4333] px-2 py-1 rounded text-[10px] font-semibold">
                    100% Free GIA Grant
                  </span>
                  <span className="bg-white border border-[#BDD1C7] text-[#1E4333] px-2 py-1 rounded text-[10px] font-semibold">
                    Stipend & Toolkit Eligible
                  </span>
                </div>
              </div>
            )}

            {/* Sub-Score Breakdown Meters */}
            <div className="pt-2 border-t border-[#EDF3EF]">
              <div className="text-[11px] font-bold text-[#4B6B5C] uppercase tracking-wider mb-2">
                Sub-Score Breakdown (Score Attribution):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(primaryMatch.score_breakdown).map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#415F52]">
                      <span className="capitalize">{k.replace("_", " ")}</span>
                      <span className="font-semibold text-[#183629]">{v}%</span>
                    </div>
                    <div className="w-full bg-[#E5EDE8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#2D5A46] h-full" style={{ width: `${v}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alternate Ranked Recommendations */}
        {topMatches.length > 1 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-[#142A20] mb-3">
              वैकल्पिक अनुशंसाएं / Alternative NSQF Matches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMatches.slice(1).map((alt) => (
                <div
                  key={alt.qp_code}
                  className="bg-white border border-[#D5E2DB] rounded-xl p-4 shadow-sm hover:border-[#ADC7BB] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#436E5A] bg-[#E8F2EC] px-1.5 py-0.5 rounded">
                        {alt.qp_code} • NSQF Level {alt.nsqf_level}
                      </span>
                      <h4 className="font-bold text-sm text-[#142A20] mt-1">{alt.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-[#1F4937] bg-[#E6F0EB] px-2 py-0.5 rounded">
                      {alt.total_score}% Score
                    </span>
                  </div>
                  <p className="text-xs text-[#436254] mb-3 leading-relaxed italic">
                    "{alt.reason}"
                  </p>
                  <div className="text-[11px] text-[#557767] flex justify-between border-t border-[#EDF3EF] pt-2">
                    <span>Wage: {alt.typical_wage}</span>
                    <span>Duration: {alt.duration_hours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explicit Constraint Refusals Section (Key Requirement) */}
        {refusals.length > 0 && (
          <div className="mb-8 bg-[#FBF6F6] border border-[#E9CFCF] rounded-xl p-5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#A82A2A] uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4 text-[#C53030]" />
              <span>Explicit Refusal Engine (कठिन बाधाओं के कारण निरस्त विकल्प)</span>
            </div>
            <p className="text-xs text-[#633F3F] mb-4">
              Options that conflict with the candidate's stated mobility, educational prerequisites, or self-employment preference 
              are strictly refused rather than forced into the recommendation list.
            </p>
            <div className="space-y-2.5">
              {refusals.slice(0, 3).map((ref, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#EDD5D5] p-3 rounded-lg text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <span className="font-bold text-[#7E2424]">{ref.title}</span>
                    <p className="text-[11px] text-[#693E3E] mt-0.5 font-sans">
                      {ref.refusal_reason}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#FCEAEA] text-[#9E2A2A] font-semibold px-2 py-0.5 rounded whitespace-nowrap">
                    Refused (Incompatible)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Link to Local Opportunities */}
        <div className="bg-[#E7F0EB] border border-[#CCDCD4] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#426052]">
            <strong>Next Step:</strong> View verified local livelihood vacancies and PM-AJAY toolkit subsidy options 
            for Varanasi and surrounding rural blocks.
          </div>
          <button
            type="button"
            onClick={() => navigate("/pmajay/opportunities")}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all"
          >
            <span>View Local Cluster Opportunities</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
