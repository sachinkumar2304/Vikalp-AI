import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { Volume2, Check, ArrowRight, Sparkles } from "lucide-react";

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
    voiceSampleText: "नमस्ते! पीएम-अजय कौशल मित्र में आपका स्वागत है।",
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
  const [selectedLang, setSelectedLang] = useState<string>("hi-IN");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
    localStorage.setItem("pmajay_selected_lang", selectedLang);
    navigate(`/pmajay/interview?lang=${selectedLang}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider mb-3">
          <span>चरण 1 / Step 1</span>
          <span>•</span>
          <span>भाषा चयन / Language Selection</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142A20] mb-2">
          अपनी भाषा चुनें / Choose Your Voice Language
        </h1>
        <p className="text-sm text-[#4E665A] mb-8 leading-relaxed">
          Beneficiary can speak naturally in their mother tongue or regional dialect. Our voice pipeline uses 
          Sarvam AI and Bhashini models fine-tuned for Indian rural accents.
        </p>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`relative cursor-pointer rounded-xl border p-5 transition-all text-left ${
                  isSelected
                    ? "bg-[#EBF4F0] border-[#31634D] ring-2 ring-[#31634D]/20 shadow-sm"
                    : "bg-white border-[#D5E2DB] hover:border-[#ADC7BB]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#142A20]">{lang.nativeName}</h3>
                    <p className="text-xs text-[#526D61] mt-0.5">{lang.englishName}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#DCECE4] text-[#224838]">
                      {lang.asrEngine}
                    </span>
                    {isSelected && (
                      <span className="mt-2 w-5 h-5 rounded-full bg-[#31634D] text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Voice preview button */}
                <div className="mt-4 pt-3 border-t border-[#DDE7E2] flex items-center justify-between">
                  <p className="text-xs text-[#456154] italic truncate max-w-[220px]">
                    "{lang.voiceSampleText}"
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoiceSample(lang.voiceSampleText);
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-[#295441] hover:text-[#173327] bg-[#E3EFEA] hover:bg-[#D5E7E0] px-2 py-1 rounded transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#E7F0EB] border border-[#CCDCD4] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#426052]">
            <strong>Note for Facilitators:</strong> For beneficiaries who cannot read, the voice assistant will 
            speak first to guide them through the questions.
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all"
          >
            <span>आगे बढ़ें / Begin Voice Assessment</span>
          </button>
        </div>
      </main>
    </div>
  );
};
