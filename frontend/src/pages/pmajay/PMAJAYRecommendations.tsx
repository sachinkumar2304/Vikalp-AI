import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData, RecommendationEvaluationResult } from "@/services/pmajayService";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  MapPin,
  Clock,
  IndianRupee,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { WhatIfSimulator, WhatIfParams } from "@/components/pmajay/WhatIfSimulator";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";

export const PMAJAYRecommendations: React.FC = () => {
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [result, setResult] = useState<RecommendationEvaluationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const navigate = useNavigate();

  // Dynamic What-If parameters state
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
      const saved = localStorage.getItem("pmajay_current_profile");
      let currentProfile: BeneficiaryProfileData;

      if (saved) {
        try {
          currentProfile = JSON.parse(saved);
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
          <h2 className="text-base font-bold text-[#002147]">पारदर्शी स्कोरिंग इंजन गणना कर रहा है...</h2>
          <p className="text-xs text-slate-500 mt-1">
            शिक्षा, पूर्व अनुभव, यात्रा की दूरी व स्थानीय मांग के अनुसार सर्वोत्तम मिलान की खोज जारी है।
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
          <div className="bg-white border border-slate-300 rounded-xl p-6 text-left shadow-xs mb-6">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Step Indicator & Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  चरण 4 / 5 • Step 4 of 5
                </span>
                <span>•</span>
                <span>पारदर्शी कौशल मिलान एवं टूलकिट सहायता</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">
                आपके लिए अनुशंसित सरकारी आजीविका विकल्प
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                यह निर्णय पूर्णतः पारदर्शी 6 गणितीय पैमानों (कौशल, दूरी, पूर्व अनुभव, बाजार मांग) पर आधारित है।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>आजीविका पासपोर्ट प्रिंट करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════ INTERACTIVE WHAT-IF SIMULATOR ════ */}
        <WhatIfSimulator
          initialParams={whatIfParams}
          onChange={(p) => setWhatIfParams(p)}
        />

        {/* Audio TTS Voice Summary Banner */}
        {result?.voice_summary && (
          <div className="bg-[#002147] text-white border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className={`w-5 h-5 ${isPlayingTTS ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <span>ध्वनि सारांश (Spoken Summary)</span>
                  {isPlayingTTS && <span className="text-emerald-300 italic font-mono">• Playing...</span>}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-2xl">
                  "{result.voice_summary.text_hi}"
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakVoiceSummary(result.voice_summary?.text_hi || "")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>दोबारा सुनें</span>
            </button>
          </div>
        )}

        {/* ════ PRIMARY RECOMMENDED QUALIFICATION PACK CARD ════ */}
        {primaryMatch && (
          <div className="bg-white border-2 border-[#002147]/90 rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
            {/* Top Rank Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>शीर्ष अनुशंसित विकल्प • {primaryMatch.total_score}% Score</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {primaryMatch.qp_code}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  NSQF Level {primaryMatch.nsqf_level}
                </span>
                {whatIfParams.isRPLEligible && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    40-घंटे RPL फास्ट-ट्रैक
                  </span>
                )}
              </div>
            </div>

            {/* Title & Wage */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">
                  {primaryMatch.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  सेक्टर: <strong>{primaryMatch.sector}</strong> • कुल अवधि: {primaryMatch.duration_hours} घंटे
                </p>
              </div>

              <div className="text-left sm:text-right bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                <div className="text-[11px] text-emerald-800 font-medium">अनुमानित मासिक आमदनी</div>
                <div className="text-lg font-black text-emerald-900 font-mono">
                  {primaryMatch.typical_wage}
                </div>
              </div>
            </div>

            {/* Plain-Language Reason */}
            <div className="bg-amber-50/70 border-l-4 border-amber-600 p-4 rounded-r-xl mb-4">
              <div className="text-xs font-bold text-amber-900 mb-0.5">
                क्यों मिला यह सुझाव? (Plain-Language Reason):
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                "{primaryMatch.reason}"
              </p>
            </div>

            {/* Nearest Center & GIA Subsidy Highlight */}
            {primaryMatch.nearest_centre && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>नजदीकी PM-AJAY मान्यता प्राप्त कौशल केंद्र:</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1">
                    {primaryMatch.nearest_centre.name} ({primaryMatch.nearest_centre.distance_km} किमी दूर)
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {primaryMatch.nearest_centre.address} • फोन: {primaryMatch.nearest_centre.contact_phone}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-300">
                    100% मुफ्त सरकारी GIA कोर्स
                  </span>
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-300">
                    ₹50,000 टूलकिट अनुदान
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAuditDrawer(!showAuditDrawer)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#002147]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {showAuditDrawer
                    ? "तकनीकी ऑडिट व 6-पैमाना विवरण छिपाएं"
                    : "सरकारी ऑडिट व 6-पैमाना स्कोर विवरण देखें (Mathematical Trace)"}
                </span>
                {showAuditDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPassportOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>आजीविका पासपोर्ट जारी करें</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/pmajay/opportunities")}
                  className="px-5 py-2 rounded-xl bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>स्थानीय अवसर देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Collapsible Mathematical Audit Drawer */}
            {showAuditDrawer && (
              <div className="mt-5 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in">
                <div className="text-xs font-bold text-[#002147] uppercase tracking-wide">
                  पारदर्शी गणितीय पैमाना विवरण (6 Sub-Score Breakdown):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(primaryMatch.score_breakdown).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span className="capitalize">{k.replace("_", " ")}</span>
                        <span className="font-bold text-slate-900 font-mono">{v}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#002147] h-full" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
                  <strong>फॉर्मूला सत्यापन:</strong> Total = 0.25 × Interest + 0.20 × Proximity + 0.15 × PriorSkills + 0.15 × Education + 0.15 × MarketDemand + 0.10 × Mobility.
                  कोई मनमाना एलएलएम निर्णय नहीं, केवल कठोर सत्यापन।
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alternative Matches Grid */}
        {filteredMatches.length > 1 && (
          <div>
            <h3 className="text-base font-bold text-[#002147] mb-3">
              वैकल्पिक उपयुक्त विकल्प (Other Viable Matches)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.slice(1).map((alt) => (
                <div
                  key={alt.qp_code}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {alt.qp_code} • NSQF L{alt.nsqf_level}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1.5">{alt.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-[#002147] bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200">
                        {alt.total_score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      "{alt.reason}"
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-medium">
                    <span>अनुमानित आय: {alt.typical_wage}</span>
                    <span>अवधि: {alt.duration_hours} घंटे</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Polite Constraint Refusals Section */}
        {rawRefusals.length > 0 && (
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>कठिन बाधाओं के कारण निरस्त विकल्प (Explicit Constraint Refusals)</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              वे विकल्प जो आपकी यात्रा सीमा या शैक्षणिक योग्यता के अनुकूल नहीं हैं, उन्हें भ्रामक रूप से सुझाने के बजाय स्पष्ट कारण सहित निरस्त किया गया है:
            </p>
            <div className="space-y-2">
              {rawRefusals.slice(0, 3).map((ref, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-rose-200 p-3 rounded-lg text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-900">{ref.title}</span>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      कारण: {ref.refusal_reason}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded border border-rose-200">
                    Refused (Incompatible)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
