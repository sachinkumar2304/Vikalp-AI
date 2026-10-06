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
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Printer,
  FileText,
  Clock,
  IndianRupee,
  ExternalLink,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { WhatIfSimulator, WhatIfParams } from "@/components/pmajay/WhatIfSimulator";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";

export const PMAJAYRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [showWeightsModal, setShowWeightsModal] = useState<boolean>(false);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);

  // Dynamic what-if filtering state
  const [whatIfParams, setWhatIfParams] = useState<WhatIfParams>({
    travelRadiusKm: 10,
    dailyHours: 6,
    minIncome: 12000,
    pathwayFilter: "all",
    isRPLEligible: true,
  });

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
      utterance.rate = 0.94;
      utterance.onstart = () => setIsPlayingTTS(true);
      utterance.onend = () => setIsPlayingTTS(false);
      utterance.onerror = () => setIsPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <PMAJAYNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-[#002147] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-bold text-[#002147]">पारदर्शी स्कोरिंग इंजन गणना कर रहा है...</h2>
          <p className="text-xs text-slate-600 mt-1">
            Evaluating NSQF Qualification Packs against educational prerequisites, mobility constraints, and local demand...
          </p>
        </div>
      </div>
    );
  }

  // Clarification Required State
  if (result?.status === "needs_clarification") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <PMAJAYNavbar />
        <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full text-center">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 border border-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300">
            स्पष्टीकरण आवश्यक • Clarification Needed
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
            सटीक मिलान हेतु एक और प्रश्न आवश्यक है
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            स्कोरिंग इंजन ने बिना पर्याप्त जानकारी के अनुमान लगाने से इंकार कर दिया क्योंकि फ़ील्ड{" "}
            <strong>"{result.missing_field}"</strong> का आत्मविश्वास स्तर बहुत कम था।
          </p>
          <div className="bg-white border-2 border-slate-300 rounded-xl p-6 text-left shadow-xs mb-6">
            <div className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">
              Clarifying Question:
            </div>
            <p className="text-base text-slate-900 font-semibold italic">
              "{result.clarification_question}"
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/pmajay/interview")}
            className="inline-flex items-center gap-2 bg-[#002147] hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all"
          >
            <span>वॉयस साक्षात्कार पर लौटें</span>
          </button>
        </main>
      </div>
    );
  }

  const rawTopMatches = result?.top_recommendations || [];
  const rawRefusals = result?.refused_options || [];

  // Apply What-If parameters filtering
  const filteredMatches = rawTopMatches.filter((item) => {
    if (whatIfParams.pathwayFilter === "self") {
      if (item.self_employment_potential.toLowerCase().includes("low")) return false;
    } else if (whatIfParams.pathwayFilter === "wage") {
      if (!item.typical_wage) return false;
    }
    return true;
  });

  const primaryMatch = filteredMatches[0] || rawTopMatches[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator & Header */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              चरण ४ / ५ • Step 4 of 5
            </span>
            <span>•</span>
            <span>NSQF अनुशंसाएं, तर्क एवं ₹50,000 टूलकिट सहायता</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
                प्रमाणित कौशल पाठ्यक्रम एवं आजीविका मिलान
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                निर्णय पूर्णतः पारदर्शी ६ गणितीय पैमानों पर आधारित है। कोई मनमाना या अस्पष्ट निर्णय नहीं।
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>आजीविका पासपोर्ट प्रिंट करें</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWeightsModal(!showWeightsModal)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showWeightsModal ? "Hide Scoring Formula" : "View Scoring Formula"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════ COMPETITOR UPGRADE: INTERACTIVE WHAT-IF SIMULATOR ════ */}
        <div className="mb-6">
          <WhatIfSimulator
            initialParams={whatIfParams}
            onChange={(p) => setWhatIfParams(p)}
          />
        </div>

        {/* Transparent Weights Formula Breakdown Banner */}
        {showWeightsModal && (
          <div className="mb-6 bg-white border-2 border-[#002147]/20 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-[#002147] mb-1">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <span>पारदर्शी गणितीय पैमाना (Auditable Scoring Weights Configuration)</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              PM-AJAY GIA परिचालन मानकों के अनुसार छह निश्चित भार जिनका योग 100% है:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">25%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">ट्रेड रुचि / Aspiration</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">20%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">स्थान व केंद्र निकटता</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">15%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">पूर्व कौशल (RPL Fit)</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">15%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">शिक्षा योग्यता अर्हता</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">15%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">स्थानीय बाजार मांग</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-xl font-black text-[#002147] font-mono">10%</div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">मोबिलिटी बाधा अनुरूपता</div>
              </div>
            </div>
          </div>
        )}

        {/* Audio TTS Voice Summary Banner */}
        {result?.voice_summary && (
          <div className="mb-6 bg-[#002147] text-white border-2 border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Volume2 className={`w-5 h-5 ${isPlayingTTS ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <span>लाभार्थी हेतु आधिकारिक ध्वनि सारांश (Official Voice Brief)</span>
                  {isPlayingTTS && <span className="text-emerald-300 italic font-mono">• Playing...</span>}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-3xl">
                  "{result.voice_summary.text_hi}"
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakVoiceSummary(result.voice_summary?.text_hi || "")}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>दोबारा सुनें</span>
            </button>
          </div>
        )}

        {/* Primary Recommended Qualification Pack Card */}
        {primaryMatch && (
          <div className="mb-8 bg-white border-2 border-[#002147] rounded-xl p-6 shadow-md relative overflow-hidden">
            {/* Top Rank Badge */}
            <div className="absolute top-0 right-0 bg-[#002147] text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-bl-lg font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>शीर्ष अनुशंसित विकल्प • {primaryMatch.total_score}% Score</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 mb-4 pt-1">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#002147] bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded">
                    QP Code: {primaryMatch.qp_code}
                  </span>
                  <span className="text-xs font-bold text-white bg-emerald-700 px-2 py-0.5 rounded">
                    NSQF Level {primaryMatch.nsqf_level}
                  </span>
                  {whatIfParams.isRPLEligible && (
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                      RPL Fast-Track (४० घंटे परीक्षा)
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {primaryMatch.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Sector: <strong>{primaryMatch.sector}</strong> • Duration: {primaryMatch.duration_hours} Notional Hours
                </p>
              </div>

              <div className="text-left md:text-right">
                <div className="text-xs text-slate-500">अनुमानित मासिक आमदनी</div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono">
                  {primaryMatch.typical_wage}
                </div>
              </div>
            </div>

            {/* Plain-Language Reason tied to beneficiary statements */}
            <div className="mb-4 bg-amber-50/60 border-l-4 border-amber-600 p-3.5 rounded-r-lg">
              <div className="text-xs font-bold text-amber-900 mb-1">
                स्पष्ट कारण (क्यों मिला यह सुझाव?):
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium">
                "{primaryMatch.reason}"
              </p>
            </div>

            {/* Skill Gap & Bridge Training Analysis */}
            <div className="mb-4 bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs">
              <div className="font-bold text-slate-900 mb-1">
                कौशल अंतराल विश्लेषण (Skill Gap & Bridge Module):
              </div>
              <p className="text-slate-600 leading-relaxed">{primaryMatch.skill_gap}</p>
            </div>

            {/* Nearest Accredited Kaushal Kendra */}
            {primaryMatch.nearest_centre && (
              <div className="bg-slate-100 border border-slate-300 rounded-lg p-3.5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>निकटतम PM-AJAY मान्यता प्राप्त कौशल केंद्र (Accredited Kendra):</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1">
                    {primaryMatch.nearest_centre.name} ({primaryMatch.nearest_centre.distance_km} km away)
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    {primaryMatch.nearest_centre.address} • हेल्पलाइन: {primaryMatch.nearest_centre.contact_phone}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-white border border-slate-300 text-emerald-800 px-2 py-1 rounded text-[10.5px] font-bold">
                    100% Free GIA Grant
                  </span>
                  <span className="bg-white border border-slate-300 text-amber-800 px-2 py-1 rounded text-[10.5px] font-bold">
                    ₹50,000 टूलकिट अनुदान
                  </span>
                </div>
              </div>
            )}

            {/* Score Attribution Breakdown Meters */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                गणितीय पैमाना विवरण (Sub-Score Breakdown):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(primaryMatch.score_breakdown).map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span className="capitalize">{k.replace("_", " ")}</span>
                      <span className="font-bold text-slate-900 font-mono">{v}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#002147] h-full" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alternative Ranked Recommendations */}
        {filteredMatches.length > 1 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-[#002147] mb-3">
              वैकल्पिक अनुशंसाएं (Alternative Viable NSQF Matches)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.slice(1).map((alt) => (
                <div
                  key={alt.qp_code}
                  className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
                          {alt.qp_code} • NSQF Level {alt.nsqf_level}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{alt.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-[#002147] bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono">
                        {alt.total_score}% Score
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed italic">
                      "{alt.reason}"
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-medium">
                    <span>Wage: {alt.typical_wage}</span>
                    <span>Duration: {alt.duration_hours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hard Constraint Refusals Section (Key Requirement) */}
        {rawRefusals.length > 0 && (
          <div className="mb-8 bg-rose-50/50 border-2 border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>कठिन बाधाओं के कारण निरस्त विकल्प (Explicit Constraint Refusals)</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              वे विकल्प जो लाभार्थी की यात्रा सीमा, पूर्व-अर्हता या स्वरोजगार प्राथमिकता के विपरीत हैं, उन्हें भ्रामक रूप से सुझाने के बजाय स्पष्ट कारण सहित निरस्त किया गया है:
            </p>
            <div className="space-y-2.5">
              {rawRefusals.slice(0, 3).map((ref, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-rose-200 p-3 rounded-lg text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-900">{ref.title}</span>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      निरस्तीकरण कारण: {ref.refusal_reason}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                    Refused (Incompatible)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Link to Local Cluster Opportunities */}
        <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            <strong>अगला चरण:</strong> वाराणसी व चंदौली जिले के वास्तविक आजीविका अवसरों, टूलकिट संस्वीकृति एवं क्लस्टर लिंकेज को देखें।
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPassportOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-3 rounded-lg font-bold text-xs shadow-xs transition-all"
            >
              <Award className="w-4 h-4" />
              <span>आजीविका पासपोर्ट जारी करें</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/pmajay/opportunities")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-xs shadow-md transition-all"
            >
              <span>स्थानीय क्लस्टर अवसर देखें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Livelihood Passport Modal */}
      <LivelihoodPassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
        matchedTrade={primaryMatch?.title}
        qpCode={primaryMatch?.qp_code}
        nsqfLevel={primaryMatch?.nsqf_level}
        trainingCentre={primaryMatch?.nearest_centre?.name}
        isRPL={whatIfParams.isRPLEligible}
      />
    </div>
  );
};
