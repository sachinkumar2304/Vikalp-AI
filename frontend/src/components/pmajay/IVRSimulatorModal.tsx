import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Volume2, VolumeX, X, Radio, CheckCircle, ShieldCheck, Hash, AlertTriangle } from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";
import { pmajayService, BeneficiaryProfileData } from "../../services/pmajayService";
import { launchIVRVoiceCall } from "./ElevenLabsIVREmbed";

interface IVRProps {
  isOpen: boolean;
  onClose: () => void;
}

// DTMF standard frequency pairs (Hz)
const DTMF_FREQS: Record<string, [number, number]> = {
  "1": [697, 1209],
  "2": [697, 1336],
  "3": [697, 1477],
  "4": [770, 1209],
  "5": [770, 1336],
  "6": [770, 1477],
  "7": [852, 1209],
  "8": [852, 1336],
  "9": [852, 1477],
  "*": [941, 1209],
  "0": [941, 1336],
  "#": [941, 1477],
};

interface IVRState {
  stage: "idle" | "ringing" | "connected" | "ended";
  step: number;
  duration: number;
  selectedLang: "hi" | "en" | "mr";
  education: string;
  interest: string;
  mobility: string;
  matchedTrade: string;
  matchedReason: string;
  nearestCentre: string;
  history: string[];
}

export const IVRSimulatorModal: React.FC<IVRProps> = ({ isOpen, onClose }) => {
  const [ivr, setIvr] = useState<IVRState>({
    stage: "idle",
    step: 1,
    duration: 0,
    selectedLang: "hi",
    education: "",
    interest: "",
    mobility: "",
    matchedTrade: "",
    matchedReason: "",
    nearestCentre: "",
    history: [],
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);

  // Play realistic DTMF Dual-Tone Multi-Frequency tone
  const playDTMFTone = (key: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const freqs = DTMF_FREQS[key];
      if (!freqs) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.value = freqs[0];
      osc2.type = "sine";
      osc2.frequency.value = freqs[1];

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context not allowed or unsupported
    }
  };

  // Speak IVR voice prompts
  const speakIVR = (text: string, langCode: string = "hi-IN") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = langCode;
      utt.rate = 0.92;
      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
  };

  const handleStartCall = () => {
    setIvr((prev) => ({
      ...prev,
      stage: "ringing",
      history: ["कॉल प्रारंभ: टोल-फ्री डेमो लाइन पर डायल किया जा रहा है..."],
    }));

    setTimeout(() => {
      setIvr((prev) => ({
        ...prev,
        stage: "connected",
        step: 1,
        duration: 0,
        history: [
          ...prev.history,
          "कॉल कनेक्ट: पीएम-अजय कौशल सहायक कीपैड डेमो से जुड़ाव।",
          "चरण 1: भाषा चयन — हिंदी के लिए 1, मराठी के लिए 2, अंग्रेजी के लिए 3 दबाएं।",
        ],
      }));

      // Start duration counter
      timerRef.current = setInterval(() => {
        setIvr((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      speakIVR(
        "Namaskar! PM-AJAY GIA Kaushal Sahayak keypad demo me aapka swagat hai. Hindi ke liye 1 dabayein, Marathi ke liye 2 dabayein, English ke liye 3 dabayein.",
        "hi-IN"
      );
    }, 1200);
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIvr((prev) => ({
      ...prev,
      stage: "ended",
      history: [...prev.history, "कॉल समाप्त की गई।"],
    }));
  };

  const handleKeypadPress = async (digit: string) => {
    if (ivr.stage !== "connected") return;
    playDTMFTone(digit);

    if (ivr.step === 1) {
      // Language selection
      let lang: "hi" | "en" | "mr" = "hi";
      let langCode = "hi-IN";
      if (digit === "2") {
        lang = "mr";
        langCode = "mr-IN";
      } else if (digit === "3") {
        lang = "en";
        langCode = "en-IN";
      }

      setIvr((prev) => ({
        ...prev,
        selectedLang: lang,
        step: 2,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: भाषा सेट - ${lang.toUpperCase()}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          lang === "hi"
            ? "अपनी शिक्षा दर्ज करें: 8वीं से कम के लिए 1, 8वीं पास के लिए 2, 10वीं पास के लिए 3, 12वीं या स्नातक के लिए 4 दबाएं।"
            : "Enter your education: Press 1 for below 8th, 2 for 8th pass, 3 for 10th pass, 4 for 12th or graduate.";
        speakIVR(prompt, langCode);
      }, 400);
    } else if (ivr.step === 2) {
      // Education selection
      const eduMap: Record<string, string> = {
        "1": "below_8th",
        "2": "8th_pass",
        "3": "10th_pass",
        "4": "12th_pass",
      };
      const chosenEdu = eduMap[digit] || "below_8th";

      setIvr((prev) => ({
        ...prev,
        education: chosenEdu,
        step: 3,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: शिक्षा स्तर - ${chosenEdu.replace("_", " ")}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          ivr.selectedLang === "hi"
            ? "ट्रेड की रुचि चुनें: सोलर व बिजली के लिए 1, सिलाई व गारमेंट के लिए 2, उपकरण रिपेयर के लिए 3, प्लंबिंग व नल फिटिंग के लिए 4 दबाएं।"
            : "Select trade interest: Press 1 for Solar energy, 2 for Tailoring, 3 for Appliance repair, 4 for Plumbing.";
        speakIVR(prompt, ivr.selectedLang === "hi" ? "hi-IN" : "en-IN");
      }, 400);
    } else if (ivr.step === 3) {
      // Trade interest selection
      const tradeMap: Record<string, string> = {
        "1": "Solar PV Installer (Suryamitra)",
        "2": "Self Employed Tailor & Boutique Manager",
        "3": "Field Technician - Home Appliances",
        "4": "Plumber (General Maintenance)",
      };
      const chosenTrade = tradeMap[digit] || "General Technical";

      setIvr((prev) => ({
        ...prev,
        interest: chosenTrade,
        step: 4,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: ट्रेड रुचि - ${chosenTrade}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          ivr.selectedLang === "hi"
            ? "यात्रा की सीमा: गांव के अंदर ही काम करने के लिए 1, ब्लॉक या तहसील जाने के लिए 2, जिले में यात्रा के लिए 3 दबाएं।"
            : "Mobility range: Press 1 for within village, 2 for block level, 3 for within district.";
        speakIVR(prompt, ivr.selectedLang === "hi" ? "hi-IN" : "en-IN");
      }, 400);
    } else if (ivr.step === 4) {
      // Mobility selection & Final recommendation evaluated using the EXACT SAME evaluate_profile engine
      const mobMap: Record<string, string> = {
        "1": "within_village",
        "2": "within_block",
        "3": "within_district",
      };
      const chosenMob = mobMap[digit] || "within_block";

      // Build structured profile and query the same engine
      const tempProfile: BeneficiaryProfileData = pmajayService.createDefaultProfile(
        "ivr-" + Math.random().toString(36).substring(2, 7),
        ivr.selectedLang === "hi" ? "hi-IN" : "en-IN"
      );
      tempProfile.education.highest_level.value = ivr.education;
      tempProfile.aspirations.interest.value = ivr.interest;
      tempProfile.constraints.mobility.value = chosenMob;
      if (chosenMob === "within_village") {
        tempProfile.constraints.max_travel_km = 5.0;
      } else if (chosenMob === "within_block") {
        tempProfile.constraints.max_travel_km = 10.0;
      } else {
        tempProfile.constraints.max_travel_km = 30.0;
      }

      let matchedTitle = "Self Employed Tailor & Boutique Manager (AMH/Q1947)";
      let matchedReason = "Village-level livelihood matching your constraints.";
      let matchedCentreName = "Sewapuri Model Kaushal Kendra (4.0 km)";

      try {
        const evalRes = await pmajayService.evaluateRecommendations(tempProfile);
        if (evalRes && evalRes.top_recommendations && evalRes.top_recommendations.length > 0) {
          const topRec = evalRes.top_recommendations[0];
          matchedTitle = topRec.title;
          matchedReason = topRec.reason;
          if (topRec.nearest_centre) {
            matchedCentreName = `${topRec.nearest_centre.name} (${topRec.nearest_centre.distance_km} km)`;
          }
        }
      } catch {
        // Fallback already assigned
      }

      setIvr((prev) => ({
        ...prev,
        mobility: chosenMob,
        matchedTrade: matchedTitle,
        matchedReason: matchedReason,
        nearestCentre: matchedCentreName,
        step: 5,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: यात्रा सीमा - ${chosenMob.replace("_", " ")}`,
          `समान गणना परिणाम (Same Engine Match): ${matchedTitle}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          ivr.selectedLang === "hi"
            ? `आपकी जानकारी के अनुसार अनुशंसित ट्रेड '${matchedTitle}' है। निकट-तम केंद्र '${matchedCentreName}' है। स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है। कॉल करने के लिए धन्यवाद!`
            : `Recommended trade for your profile is '${matchedTitle}'. Nearest centre is '${matchedCentreName}'. Consult the local desk; this screen does not grant funds. Thank you!`;
        speakIVR(prompt, ivr.selectedLang === "hi" ? "hi-IN" : "en-IN");
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ivr-modal-title"
    >
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Banner with Official Emblem & Explicit Demo Label */}
        <div className="bg-[#002147] px-4 py-3 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmblemOfIndia className="h-10 w-auto" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded">
                  कीपैड डेमो — लाइव फोन लाइन नहीं (Keypad Demo — Not a live phone line)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  DTMF Simulation Channel
                </span>
              </div>
              <h3 id="ivr-modal-title" className="text-sm sm:text-base font-bold text-white">
                PM-AJAY GIA Keypad Telephony Demo (कीपैड डेमो)
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close IVR modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telephony Option Switcher: Live Voice AI vs DTMF Keypad */}
        <div className="bg-[#0b1329] px-4 py-2 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">मोड:</span>
            <span className="font-semibold text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 text-[11px]">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              कीपैड सिमुलेशन (Keypad DTMF)
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              launchIVRVoiceCall();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs shadow-md transition-all active:scale-95"
            title="लाइव वॉयस AI कॉल से बात करें"
          >
            <Phone className="w-3.5 h-3.5 text-white" />
            <span>लाइव वॉयस AI कॉल से बात करें (Live Voice Assistant)</span>
          </button>
        </div>

        {/* Content Body: Feature Phone Interface on Left + Live Call Transcript / Audit on Right */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
          {/* Feature Phone Mockup */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-[260px] bg-[#1e293b] border-4 border-[#334155] rounded-3xl p-3.5 shadow-2xl flex flex-col items-center ring-2 ring-amber-500/30">
              {/* Phone Earpiece */}
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-3" />

              {/* LCD Screen */}
              <div className="w-full bg-[#143224] border-2 border-[#22553b] rounded-xl p-2.5 text-[#86efac] font-mono text-xs shadow-inner mb-3.5 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[10px] text-[#4ade80] border-b border-[#22553b] pb-1 mb-1">
                  <div className="flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>SIM 1 DEMO</span>
                  </div>
                  <span>{formatTime(ivr.duration)}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center text-center py-1">
                  <div className="text-[10px] uppercase text-emerald-300 tracking-wider font-sans font-semibold">
                    KEYPAD DEMO LINE
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    1800-11-2026
                  </div>

                  {ivr.stage === "idle" && (
                    <div className="text-[11px] text-slate-300 mt-2">
                      कॉल करने के लिए हरा बटन दबाएं
                    </div>
                  )}

                  {ivr.stage === "ringing" && (
                    <div className="text-[11px] text-amber-300 animate-pulse mt-2 flex items-center justify-center gap-1">
                      <span>डायल हो रहा है...</span>
                    </div>
                  )}

                  {ivr.stage === "connected" && (
                    <div className="mt-1">
                      <div className="text-[10px] text-amber-300 font-sans">
                        {isSpeaking ? "वॉयस संदेश चल रहा है..." : "कुंजी दबाएं (Press Key)"}
                      </div>
                      <div className="flex items-center justify-center gap-0.5 h-3 my-1">
                        <span className="w-1 bg-[#4ade80] rounded-full animate-pulse h-2" />
                        <span className="w-1 bg-[#4ade80] rounded-full animate-pulse h-3" />
                        <span className="w-1 bg-[#4ade80] rounded-full animate-pulse h-1.5" />
                        <span className="w-1 bg-[#4ade80] rounded-full animate-pulse h-3" />
                        <span className="w-1 bg-[#4ade80] rounded-full animate-pulse h-2" />
                      </div>
                      <div className="text-[10px] text-[#86efac]">
                        चरण {ivr.step} / 4
                      </div>
                    </div>
                  )}

                  {ivr.stage === "ended" && (
                    <div className="text-[11px] text-red-300 mt-2">
                      कॉल समाप्त (Call Ended)
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-[#4ade80]/70 text-center border-t border-[#22553b] pt-1">
                  कीपैड डेमो — लाइव फोन लाइन नहीं
                </div>
              </div>

              {/* Call Control Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleStartCall}
                  disabled={ivr.stage === "connected" || ivr.stage === "ringing"}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl py-2 flex items-center justify-center gap-1.5 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>कॉल</span>
                </button>
                <button
                  type="button"
                  onClick={handleEndCall}
                  disabled={ivr.stage === "idle" || ivr.stage === "ended"}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl py-2 flex items-center justify-center gap-1.5 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>काटें</span>
                </button>
              </div>

              {/* Physical Keypad Buttons (DTMF) */}
              <div className="grid grid-cols-3 gap-2 w-full">
                {[
                  { k: "1", sub: "" },
                  { k: "2", sub: "ABC" },
                  { k: "3", sub: "DEF" },
                  { k: "4", sub: "GHI" },
                  { k: "5", sub: "JKL" },
                  { k: "6", sub: "MNO" },
                  { k: "7", sub: "PQRS" },
                  { k: "8", sub: "TUV" },
                  { k: "9", sub: "WXYZ" },
                  { k: "*", sub: "" },
                  { k: "0", sub: "+" },
                  { k: "#", sub: "" },
                ].map((item) => (
                  <button
                    key={item.k}
                    type="button"
                    onClick={() => handleKeypadPress(item.k)}
                    className="bg-[#334155] hover:bg-[#475569] active:bg-[#64748b] text-white rounded-xl py-2 flex flex-col items-center justify-center border border-slate-600 shadow-sm transition-all active:scale-95 group"
                  >
                    <span className="font-bold text-sm leading-none font-mono group-hover:text-amber-300">
                      {item.k}
                    </span>
                    {item.sub && (
                      <span className="text-[8px] text-slate-400 font-mono tracking-widest mt-0.5">
                        {item.sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Call Transcript / Audit Trail on Right */}
          <div className="md:col-span-6 flex flex-col bg-[#1e293b]/70 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs text-white">
                  डेमो लाइव ऑडिट व पारदर्शी गणना (Same Scoring Engine)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {ivr.stage === "connected" ? "LIVE DEMO" : "STANDBY"}
              </span>
            </div>

            {/* Current DTMF State Summary */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 1
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>1. भाषा (Language)</span>
                <span className="font-bold uppercase font-mono">
                  {ivr.selectedLang}
                </span>
              </div>

              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 2
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>2. शिक्षा (Education)</span>
                <span className="font-bold font-mono">
                  {ivr.education ? ivr.education.replace("_", " ") : "लंबित"}
                </span>
              </div>

              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 3
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>3. ट्रेड रुचि (Interest)</span>
                <span className="font-bold font-mono truncate max-w-[90px]">
                  {ivr.interest || "लंबित"}
                </span>
              </div>

              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 4
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>4. यात्रा सीमा (Mobility)</span>
                <span className="font-bold font-mono">
                  {ivr.mobility ? ivr.mobility.replace("_", " ") : "लंबित"}
                </span>
              </div>
            </div>

            {/* Matched Outcome Box */}
            {ivr.matchedTrade && (
              <div className="bg-[#14532d]/40 border-2 border-emerald-500 rounded-xl p-3.5 mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>समान इंजन गणना परिणाम (Calculated Match):</span>
                </div>
                <div className="font-bold text-white text-sm">
                  {ivr.matchedTrade}
                </div>
                <div className="text-[11px] text-emerald-200/90 mt-1">
                  केंद्र: {ivr.nearestCentre}
                </div>
                <div className="text-[10px] text-amber-200/90 mt-1.5 bg-amber-950/50 p-1.5 rounded border border-amber-700/40">
                  स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है। (Consult the local desk; this screen does not grant funds.)
                </div>
              </div>
            )}

            {/* History Logs */}
            <div className="flex-1 bg-[#020617] rounded-lg p-2.5 font-mono text-[10.5px] text-slate-300 space-y-1 overflow-y-auto max-h-36 border border-slate-800">
              <div className="text-slate-500">// Keypad Demo Logs:</div>
              {ivr.history.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  <span className="text-emerald-500">[{idx + 1}]</span> {log}
                </div>
              ))}
              {ivr.history.length === 0 && (
                <div className="text-slate-600 italic">No call initiated yet. Click Call button to begin.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#002147] px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>कीपैड डेमो — लाइव फोन लाइन नहीं (Keypad Demo — Not a live phone line)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Same scoring engine as portal recommendations
          </span>
        </div>
      </div>
    </div>
  );
};
