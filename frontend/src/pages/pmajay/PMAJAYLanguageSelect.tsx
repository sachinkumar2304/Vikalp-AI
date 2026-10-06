import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { Volume2, Check, ArrowRight, PhoneCall, ShieldCheck, HelpCircle } from "lucide-react";
import { IVRSimulatorModal } from "@/components/pmajay/IVRSimulatorModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  voiceSampleText: string;
  asrEngine: "Sarvam AI" | "Bhashini" | "Browser Fallback";
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "hi-IN",
    nativeName: "हिन्दी",
    englishName: "Hindi (Standard & Regional Dialects)",
    voiceSampleText: "नमस्ते! पीएम-अजय विकल्प AI में आपका स्वागत है।",
    asrEngine: "Sarvam AI",
  },
  {
    code: "bho-IN",
    nativeName: "भोजपुरी / अवधी",
    englishName: "Bhojpuri / Awadhi (Eastern UP & Bihar)",
    voiceSampleText: "प्रणाम! रउआ के काम और कौशल सीखे खातिर मदद मिली।",
    asrEngine: "Bhashini",
  },
  {
    code: "en-IN",
    nativeName: "English (Indian)",
    englishName: "Indian English (Semi-Urban / Administrative)",
    voiceSampleText: "Welcome to PM-AJAY Voice Livelihood Assistant.",
    asrEngine: "Sarvam AI",
  },
  {
    code: "mr-IN",
    nativeName: "मराठी",
    englishName: "Marathi (Vidarbha & Rural Maharashtra)",
    voiceSampleText: "नमस्कार! कौशल्य प्रशिक्षण योजनेमध्ये तुमचे स्वागत आहे.",
    asrEngine: "Bhashini",
  },
  {
    code: "ta-IN",
    nativeName: "தமிழ்",
    englishName: "Tamil (Rural Tamil Nadu Clusters)",
    voiceSampleText: "வணக்கம்! உங்கள் தொழில் திறன் பயிற்சிக்கு வரவேற்கிறோம்.",
    asrEngine: "Sarvam AI",
  },
  {
    code: "te-IN",
    nativeName: "తెలుగు",
    englishName: "Telugu (Rayalaseema / Rural AP & Telangana)",
    voiceSampleText: "నమస్కారం! ఉపాధి మరియు నైపుణ్య శిక్షణకు స్వాగతం.",
    asrEngine: "Bhashini",
  },
];

export const PMAJAYLanguageSelect: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return lang === "en" ? "en-IN" : lang === "mr" ? "mr-IN" : "hi-IN";
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isIVROpen, setIsIVROpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePlayVoiceSample = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang;
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    const shortCode = selectedLang.startsWith("en") ? "en" : selectedLang.startsWith("mr") ? "mr" : "hi";
    setLang(shortCode);
    localStorage.setItem("pmajay_selected_lang", selectedLang);
    navigate(`/pmajay/interview?lang=${selectedLang}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator / Breadcrumb */}
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 mb-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 tracking-wide">
            <span className="text-[#002147] font-extrabold uppercase">चरण 1 / STEP 1:</span>
            <span className="text-slate-400">|</span>
            <span>आधिकारिक क्षेत्रीय भाषा चयन (Regional Voice Language Selection)</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
            GIGW 3.0 Multilingual Compliant
          </span>
        </div>

        {/* Title Card */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6 shadow-xs border-t-4 border-t-[#002147]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-2 tracking-tight">
                अपनी भाषा चुनें / Choose Your Voice Language
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                लाभार्थी अपनी मातृभाषा अथवा स्थानीय बोली में स्वाभाविक रूप से बोल सकते हैं। हमारी वाक् पहचान प्रणाली (ASR) 
                ग्रामीण एवं उप-नगरीय उच्चारणों के लिए विशेष रूप से प्रशिक्षित है।
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsIVROpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shrink-0 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <span>साधारण फोन IVR डायल करें</span>
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all text-left ${
                  isSelected
                    ? "bg-blue-50/60 border-[#002147] shadow-md ring-2 ring-[#002147]/10"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#002147]">{lang.nativeName}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{lang.englishName}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {lang.asrEngine}
                    </span>
                    {isSelected && (
                      <span className="mt-2 w-5 h-5 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Voice preview button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-600 italic truncate max-w-[210px]">
                    "{lang.voiceSampleText}"
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoiceSample(lang.voiceSampleText);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#002147] hover:text-blue-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ऑडियो सुनें</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 max-w-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">सुविधा प्रदाताओं (Facilitators) हेतु निर्देश:</strong> जो लाभार्थी साक्षर नहीं हैं अथवा स्क्रीन नहीं पढ़ सकते, उनके लिए सहायक पहले स्वयं बोलकर प्रश्न समझाएगा।
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#002147] hover:bg-[#003366] text-white px-7 py-3 rounded-lg font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
          >
            <span>आगे बढ़ें / Begin Voice Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <IVRSimulatorModal isOpen={isIVROpen} onClose={() => setIsIVROpen(false)} />
    </div>
  );
};

