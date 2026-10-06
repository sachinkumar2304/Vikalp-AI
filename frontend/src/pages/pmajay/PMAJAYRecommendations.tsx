import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData, RecommendationResult, RecommendationItem } from "@/services/pmajayService";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  MapPin,
  Clock,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Briefcase
} from "lucide-react";
import { WhatIfSimulator, WhatIfParams } from "@/components/pmajay/WhatIfSimulator";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";
import { useBeneficiary } from "@/contexts/BeneficiaryContext";

export const PMAJAYRecommendations: React.FC = () => {
  const {
    profile,
    result,
    loading,
    whatIfParams,
    setWhatIfParams,
    confirmConstraint,
    eraseSession,
    primaryMatch,
    filteredRecommendations: filteredMatches,
    runEvaluation,
  } = useBeneficiary();

  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [showGatesDrawer, setShowGatesDrawer] = useState<boolean>(true);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [isConfirmingRefusal, setIsConfirmingRefusal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) {
      runEvaluation().then((evalData) => {
        if (evalData?.voice_summary) {
          speakVoiceSummary(evalData.voice_summary.text_hi || evalData.voice_summary.text_en);
        }
      });
    } else if (result?.voice_summary) {
      speakVoiceSummary(result.voice_summary.text_hi || result.voice_summary.text_en);
    }
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

  const handleConfirmRefusal = async () => {
    if (!profile) return;
    setIsConfirmingRefusal(true);
    const userWords = result?.read_back_info?.user_words || "Babatpur 35 km door hai, main 5 km se zyada door nahi ja sakti";
    const secondDecisionResult = await confirmConstraint(userWords);
    setIsConfirmingRefusal(false);

    if (secondDecisionResult?.voice_summary) {
      speakVoiceSummary(secondDecisionResult.voice_summary.text_hi || secondDecisionResult.voice_summary.text_en);
    }
  };

  const handleEraseSession = async () => {
    await eraseSession();
    navigate("/pmajay");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <PMAJAYNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-[#002147] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-base font-bold text-[#002147]">पारदर्शी एल्गोरिथ्म गणना कर रहा है...</h2>
          <p className="text-xs text-slate-500 mt-1">
            दूरी, शैक्षणिक योग्यता, और पूर्व अनुभव के अनुसार सत्यापन जारी है।
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
            स्कोरिंग इंजन ने बिना पर्याप्त जानकारी के अनुमान लगाने से परहेज किया क्योंकि फ़ील्ड{" "}
            <strong>"{result.missing_field}"</strong> पर स्पष्टता आवश्यक है।
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
            <span>वॉयस संवाद पर लौटें</span>
          </button>
        </main>
      </div>
    );
  }

  const rawTopMatches = result?.top_recommendations || [];
  const rawRefusals = result?.refused_options || [];
  const isSecondDecision = result?.decision_phase === "second";
  const readBackInfo = result?.read_back_info;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Top Official Notices & Session Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-100 border border-slate-300 rounded-xl p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-200 text-slate-800 font-semibold px-2.5 py-0.5 rounded border border-slate-300">
              {result?.catalogue_notice || "Sample list of Qualification Packs (नमुना सूची)"}
            </span>
            <span className="text-slate-600 font-medium">
              {result?.funding_notice || "Consult the local desk; this screen does not grant funds."}
            </span>
          </div>

          <button
            type="button"
            onClick={handleEraseSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold transition-colors ml-auto"
            title="सत्र डेटा मिटाएं"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-700" />
            <span>सत्र मिटाएं (Erase Session)</span>
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {isSecondDecision ? "दूसरा विकल्प निर्णय • Second Choice Phase" : "प्राथमिक मूल्यांकन • Initial Phase"}
                </span>
                <span>•</span>
                <span>PM-AJAY GIA Livelihood Convergence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">
                {isSecondDecision
                  ? "सत्यापित दूसरा आजीविका विकल्प (Second Choice)"
                  : "आपके लिए अनुशंसित सरकारी आजीविका विकल्प"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {isSecondDecision
                  ? `सुरक्षित कारण के आधार पर बाधा को मास्क कर दूसरा विकल्प चुना गया है: "${result?.saved_refusal_reason}"`
                  : "पारदर्शी 6 पैमानों (कौशल, दूरी, पूर्व अनुभव, शैक्षणिक योग्यता) पर आधारित स्पष्ट सिफारिश।"}
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

        {/* ════ CORE PARITY 1: READ-BACK CONFIRMATION CARD (PERSIST HARD REFUSAL) ════ */}
        {readBackInfo && !isSecondDecision && (
          <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-500/80 rounded-2xl p-6 shadow-md animate-in fade-in space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <span>कठिन बाधा अस्वीकृति एवं शब्द सत्यापन (Hard Refusal Read-Back)</span>
                  <span className="bg-rose-100 text-rose-900 px-2 py-0.2 rounded font-mono text-[10.5px] border border-rose-300">
                    {readBackInfo.qp_code}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {readBackInfo.reason}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                  <strong>पाठ्यक्रम:</strong> {readBackInfo.course_title} ({readBackInfo.qp_code})
                </p>

                {/* Candidate Words Read Back */}
                <div className="bg-white/90 border border-amber-300 rounded-xl p-3.5 my-3 shadow-2xs">
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                    आपने अपने शब्दों में बताया था (Candidate Words Read Back):
                  </div>
                  <div className="text-sm font-semibold text-slate-900 italic mt-0.5">
                    "{readBackInfo.user_words}"
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {readBackInfo.read_back_prompt_hi}
                </p>

                {/* Confirmation Button: Triggers Second Decision Flow */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmRefusal}
                    disabled={isConfirmingRefusal}
                    className="inline-flex items-center gap-2 bg-[#002147] hover:bg-blue-900 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {isConfirmingRefusal
                        ? "दूसरा विकल्प खोजा जा रहा है..."
                        : "हाँ, यह सही है — दूसरा विकल्प चुनें (Confirm & Choose Second)"}
                    </span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    पुष्टि करने पर यह सीमा मास्क कर दी जाएगी और दूसरा विकल्प चुना जाएगा।
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ SECOND DECISION SUMMARY BANNER (IF ACTIVE) ════ */}
        {isSecondDecision && (
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>दूसरा विकल्प सक्रिय • Second Choice Activated (Constraint Masked)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              सत्यापित बाधा: <strong>"{result.saved_refusal_reason}"</strong>
            </p>
            <div className="text-[11.5px] text-emerald-900 font-medium bg-emerald-100/80 p-2.5 rounded-lg border border-emerald-300">
              यह दूसरा निर्णय कठोर रूप से केवल 3 प्रकारों में से चुना गया है: (1) स्थानीय NSQF क्लास, (2) पूर्व अनुभव हेतु RPL मूल्यांकन, (3) PM-AJAY GIA प्रोजेक्ट शीट। कोई कमजोर तीसरा कार्ड नहीं जोड़ा गया है।
            </div>
            {result.physical_caution && (
              <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded border border-amber-300">
                शारीरिक सावधानी: {result.physical_caution}
              </div>
            )}
          </div>
        )}

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

        {/* ════ RECOMMENDATIONS CARDS (STRICTLY THREE TYPES) ════ */}
        <div className="space-y-5">
          {filteredMatches.map((match, idx) => (
            <div
              key={match.qp_code || idx}
              className="bg-white border-2 border-[#002147]/80 rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden space-y-4"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {match.category === "project_sheet"
                        ? "प्रकार 3: PM-AJAY GIA प्रोजेक्ट शीट"
                        : match.category === "rpl_certification"
                        ? "प्रकार 2: पूर्व कौशल RPL मूल्यांकन (40 घंटे)"
                        : "प्रकार 1: स्थानीय NSQF क्लास"}
                    </span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {match.qp_code}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    NSQF Level {match.nsqf_level}
                  </span>
                  <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    {match.duration_hours > 0 ? `${match.duration_hours} घंटे` : "क्लस्टर आधारित"}
                  </span>
                </div>
              </div>

              {/* Title & Sector */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
                  {match.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  सेक्टर: <strong>{match.sector}</strong> • {match.self_employment_potential}
                </p>
              </div>

              {/* Enterprise Referral Buyback Line (if present on Project Sheet) */}
              {match.referral_line && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-950">
                  <Briefcase className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">रोजगार लिंकेज (Enterprise Referral Line):</span>
                    <p className="text-blue-900 font-medium mt-0.5">{match.referral_line}</p>
                    <span className="text-[10.5px] text-blue-700 italic">
                      रोजगार इस शीट की एक संस्थागत रेफरल लाइन है, कोई अलग चौथा रूट प्रकार नहीं।
                    </span>
                  </div>
                </div>
              )}

              {/* ════ CORE PARITY 5: TWO SENTENCES (BENEFICIARY & OFFICER) ════ */}
              {match.two_sentences && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Sentence 1: For Beneficiary */}
                  <div className="bg-amber-50/80 border-l-4 border-amber-600 p-3.5 rounded-r-xl">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide mb-1">
                      आपके लिए सरल सारांश (For Beneficiary):
                    </div>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      "{match.two_sentences.for_beneficiary}"
                    </p>
                  </div>

                  {/* Sentence 2: For Administrative Officer */}
                  <div className="bg-slate-100/90 border-l-4 border-[#002147] p-3.5 rounded-r-xl">
                    <div className="text-[11px] font-bold text-[#002147] uppercase tracking-wide mb-1">
                      प्रशासनिक अधिकारी संदर्भ (For Officer - Rule & QP):
                    </div>
                    <p className="text-xs text-slate-900 font-mono leading-relaxed">
                      "{match.two_sentences.for_officer}"
                    </p>
                  </div>
                </div>
              )}

              {/* Nearest Center info */}
              {match.nearest_centre && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>प्रशिक्षण / क्रियान्वयन केंद्र:</span>
                    </div>
                    <div className="text-slate-900 font-bold mt-0.5">
                      {match.nearest_centre.name} ({match.nearest_centre.distance_km} किमी दूर)
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-300">
                    मान्यता प्राप्त PM-AJAY केंद्र
                  </span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
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
          ))}
        </div>

        {/* ════ CORE PARITY 4: DROPPED GATES SECTION ════ */}
        {result?.dropped_gates && result.dropped_gates.length > 0 && (
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-slate-600" />
                <span>फ़िल्टर नियम व छोड़े गए विकल्प (Dropped Gates Audit Trail)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGatesDrawer(!showGatesDrawer)}
                className="text-xs font-semibold text-[#002147] flex items-center gap-1"
              >
                <span>{showGatesDrawer ? "छिपाएं" : "देखें"}</span>
                {showGatesDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              यह सूची दर्शाती है कि किन नियमों (दूरी, NCVET समाप्ति तिथि, व्हीलचेयर रैंप, शारीरिक सीमा) ने अन्य विकल्पों को हटाया:
            </p>

            {showGatesDrawer && (
              <div className="space-y-1.5 font-mono text-[11px] text-slate-700 bg-white p-3 rounded-xl border border-slate-200 max-h-56 overflow-y-auto">
                {result.dropped_gates.map((gate, gIdx) => (
                  <div key={gIdx} className="flex items-start gap-1.5 py-0.5 border-b border-slate-100 last:border-b-0">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{gate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Polite Constraint Refusals Section (if any remaining) */}
        {rawRefusals.length > 0 && (
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>कठिन बाधाओं के कारण निरस्त विकल्प (Explicit Constraint Refusals)</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              वे विकल्प जो आपकी यात्रा सीमा या योग्यता के अनुकूल नहीं हैं, उन्हें स्पष्ट कारण सहित निरस्त रखा गया है:
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
        beneficiaryName={profile?.basic_info?.name?.value || "रामेश्वर कुमार"}
        district={profile?.basic_info?.location?.value || "सेवापुरी ब्लॉक, वाराणसी"}
        education={profile?.education?.highest_level?.value ? profile.education.highest_level.value.replace("_", " ") : "8th Pass"}
        matchedTrade={primaryMatch?.title}
        qpCode={primaryMatch?.qp_code}
        nsqfLevel={primaryMatch?.nsqf_level}
        trainingCentre={primaryMatch?.nearest_centre?.name}
        isRPL={primaryMatch?.category === "rpl_certification"}
      />
    </div>
  );
};
