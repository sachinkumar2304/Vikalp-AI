import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Volume2, VolumeX, X, Radio, CheckCircle, ShieldCheck, Hash } from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";

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

  // Start Call
  const handleDialCall = () => {
    setIvr((prev) => ({
      ...prev,
      stage: "ringing",
      step: 1,
      duration: 0,
      history: ["कॉल डायल की जा रही है: 1800-11-2026 (टोल-फ्री)..."],
    }));

    setTimeout(() => {
      setIvr((prev) => ({
        ...prev,
        stage: "connected",
        history: [
          ...prev.history,
          "कॉल कनेक्ट हो गई। आईवीआर स्वागत संदेश शुरू हुआ।",
        ],
      }));

      // Start duration timer
      timerRef.current = setInterval(() => {
        setIvr((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      speakIVR(
        "नमस्ते! भारत सरकार, सामाजिक न्याय एवं अधिकारिता मंत्रालय के पीएम-अजय कौशल हेल्पलाइन 1800-11-2026 में आपका स्वागत है। हिंदी के लिए 1 दबाएं। For English press 2. मराठीसाठी 3 दाबा।",
        "hi-IN"
      );
    }, 1800);
  };

  // End Call
  const handleEndCall = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSpeaking(false);
    setIvr((prev) => ({
      ...prev,
      stage: "ended",
      history: [...prev.history, "कॉल समाप्त हुई (Call Disconnected)"],
    }));
  };

  // Reset simulator
  const handleReset = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSpeaking(false);
    setIvr({
      stage: "idle",
      step: 1,
      duration: 0,
      selectedLang: "hi",
      education: "",
      interest: "",
      mobility: "",
      matchedTrade: "",
      history: [],
    });
  };

  // Handle Keypad Press
  const handleKeyPress = (digit: string) => {
    playDTMFTone(digit);
    if (ivr.stage !== "connected") return;

    if (ivr.step === 1) {
      // Language selection
      let lang = "hi";
      let langCode = "hi-IN";
      if (digit === "2") {
        lang = "en";
        langCode = "en-IN";
      } else if (digit === "3") {
        lang = "mr";
        langCode = "mr-IN";
      }

      setIvr((prev) => ({
        ...prev,
        selectedLang: lang as any,
        step: 2,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: भाषा सेट - ${lang.toUpperCase()}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          lang === "hi"
            ? "अपनी उच्चतम शिक्षा चुनें: आठवीं पास के लिए 1, दसवीं पास के लिए 2, आठवीं से कम या अनपढ़ के लिए 3 दबाएं।"
            : lang === "mr"
            ? "तुमचे शिक्षण निवडा: ८वी उत्तीर्णसाठी १, १०वी उत्तीर्णसाठी २, निरक्षर किंवा ८वी पेक्षा कमीसाठी ३ दाबा."
            : "Select your highest education: Press 1 for 8th pass, 2 for 10th pass, 3 for below 8th or non-formal.";
        speakIVR(prompt, langCode);
      }, 400);
    } else if (ivr.step === 2) {
      // Education selection
      const eduMap: Record<string, string> = {
        "1": "8th_pass",
        "2": "10th_pass",
        "3": "below_8th",
      };
      const chosenEdu = eduMap[digit] || "8th_pass";

      setIvr((prev) => ({
        ...prev,
        education: chosenEdu,
        step: 3,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: शिक्षा - ${chosenEdu.replace("_", " ")}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          ivr.selectedLang === "hi"
            ? "आप किस काम में रुचि रखते हैं? सोलर व बिजली कार्य के लिए 1, सिलाई व बुटीक के लिए 2, प्लंबिंग नल जल के लिए 3, मोटर मैकेनिक के लिए 4 दबाएं।"
            : "Select interest: Press 1 for Solar/Electrical, 2 for Tailoring/Boutique, 3 for Plumbing, 4 for Automotive Mechanic.";
        speakIVR(prompt, ivr.selectedLang === "hi" ? "hi-IN" : "en-IN");
      }, 400);
    } else if (ivr.step === 3) {
      // Interest selection
      const tradeMap: Record<string, string> = {
        "1": "Solar PV Installer (Suryamitra) - ELE/Q1401",
        "2": "Self Employed Tailor & Boutique - AMH/Q1947",
        "3": "General Plumber (Jal Jeevan) - PLU/Q0101",
        "4": "Two-Wheeler & EV Technician - ASC/Q9702",
      };
      const chosenTrade = tradeMap[digit] || tradeMap["1"];

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
            : "Mobility range: Press 1 for within village only, 2 for block level, 3 for within district.";
        speakIVR(prompt, ivr.selectedLang === "hi" ? "hi-IN" : "en-IN");
      }, 400);
    } else if (ivr.step === 4) {
      // Mobility selection & Final recommendation
      const mobMap: Record<string, string> = {
        "1": "within_village",
        "2": "within_block",
        "3": "within_district",
      };
      const chosenMob = mobMap[digit] || "within_block";

      const matched =
        ivr.interest.includes("Tailor") || chosenMob === "within_village"
          ? "Self Employed Tailor & Boutique (AMH/Q1947) - 100% Village Friendly"
          : ivr.interest || "Solar PV Installer (ELE/Q1401)";

      setIvr((prev) => ({
        ...prev,
        mobility: chosenMob,
        matchedTrade: matched,
        step: 5,
        history: [
          ...prev.history,
          `कुंजी ${digit} दबाई गई: यात्रा सीमा - ${chosenMob.replace("_", " ")}`,
          `सफलतापूर्वक मिलान: ${matched}`,
        ],
      }));

      setTimeout(() => {
        const prompt =
          ivr.selectedLang === "hi"
            ? `बधाई हो! आपकी जानकारी के अनुसार आपके लिए उपयुक्त सरकारी कोर्स '${matched}' है। आपको पीएम-अजय योजना के तहत ₹50,000 की टूलकिट सब्सिडी और 100% मुफ्त ट्रेनिंग मिलेगी। आपके मोबाइल नंबर पर एसएमएस द्वारा विवरण भेज दिया गया है। कॉल करने के लिए धन्यवाद!`
            : `Congratulations! Matched trade is '${matched}'. Eligible for ₹50,000 toolkit subsidy and free NSQF training under PM-AJAY GIA. Confirmation sent via SMS. Thank you!`;
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
      <div className="bg-[#0b1c2d] border-2 border-[#b45309] rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#002147] text-white px-5 py-3 border-b-2 border-[#b45309] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmblemOfIndia size={32} variant="gold" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded">
                  ग्रामीण फीचर फोन आईवीआर सिम्युलेटर
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  DTMF + ASR Toll-Free 1800-11-2026
                </span>
              </div>
              <h3 id="ivr-modal-title" className="text-sm sm:text-base font-bold text-white">
                PM-AJAY GIA Feature-Phone Telephony Channel
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

        {/* Content Body: Feature Phone Interface on Left + Live Call Transcript / Audit on Right */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1">
          {/* Nokia / Feature Phone Mockup */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-[260px] bg-[#1e293b] border-4 border-[#334155] rounded-3xl p-3.5 shadow-2xl flex flex-col items-center ring-2 ring-amber-500/30">
              {/* Phone Earpiece */}
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-3" />

              {/* LCD Screen */}
              <div className="w-full bg-[#143224] border-2 border-[#22553b] rounded-xl p-2.5 text-[#86efac] font-mono text-xs shadow-inner mb-3.5 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-center text-[10px] text-[#4ade80] border-b border-[#22553b] pb-1 mb-1">
                  <div className="flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>BSNL 4G</span>
                  </div>
                  <span>{formatTime(ivr.duration)}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center text-center py-1">
                  <div className="text-[10px] uppercase text-emerald-300 tracking-wider font-sans font-semibold">
                    PM-AJAY HELPLINE
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
                      {/* Audio wave animation */}
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

                <div className="text-[9px] text-[#22553b] text-center pt-1 border-t border-[#1e4833]">
                  Ministry of Social Justice & Empowerment
                </div>
              </div>

              {/* Call Control Buttons */}
              <div className="w-full grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={handleDialCall}
                  disabled={ivr.stage === "connected" || ivr.stage === "ringing"}
                  className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call (डायल)</span>
                </button>
                <button
                  type="button"
                  onClick={handleEndCall}
                  disabled={ivr.stage !== "connected"}
                  className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>End (काटें)</span>
                </button>
              </div>

              {/* Physical DTMF Keypad Grid */}
              <div className="w-full grid grid-cols-3 gap-1.5">
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
                    onClick={() => handleKeyPress(item.k)}
                    className="h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white flex flex-col items-center justify-center border border-slate-700 transition-colors shadow-xs group"
                  >
                    <span className="font-bold text-sm leading-none font-mono group-active:text-white">
                      {item.k}
                    </span>
                    {item.sub && (
                      <span className="text-[7.5px] text-slate-400 leading-none mt-0.5 font-mono">
                        {item.sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Call Audit Transcript & Beneficiary Output */}
          <div className="md:col-span-6 flex flex-col bg-[#0f172a] border border-slate-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-700 mb-3">
              <div>
                <h4 className="font-bold text-sm text-amber-300">
                  टेलीफोनी सत्र विवरण (Live IVR Log)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Dual-Tone Multi-Frequency (DTMF) Auditable State
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-slate-300 hover:text-white underline underline-offset-2"
              >
                रीसेट (Reset)
              </button>
            </div>

            {/* Turn by turn progress checklist */}
            <div className="space-y-2 mb-4 text-xs">
              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 1
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>1. भाषा चयन (Language)</span>
                <span className="font-bold font-mono">
                  {ivr.selectedLang.toUpperCase()}
                </span>
              </div>

              <div
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  ivr.step > 2
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-slate-800/40 border-slate-700 text-slate-400"
                }`}
              >
                <span>2. शिक्षा स्तर (Education)</span>
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
                <span>3. ट्रेड व हुनर रुचि (Interest)</span>
                <span className="font-bold font-mono truncate max-w-[140px]">
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
                  <span>आईवीआर परिणाम (Calculated Match):</span>
                </div>
                <div className="font-bold text-white text-sm">
                  {ivr.matchedTrade}
                </div>
                <div className="text-[11px] text-emerald-200/90 mt-1">
                  Grant Support: ₹50,000 PM-AJAY Toolkit Subsidy + SMS Reference Sent to SIM
                </div>
              </div>
            )}

            {/* History Logs */}
            <div className="flex-1 bg-[#020617] rounded-lg p-2.5 font-mono text-[10.5px] text-slate-300 space-y-1 overflow-y-auto max-h-36 border border-slate-800">
              <div className="text-slate-500">// IVR Telephony Gateway Logs:</div>
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
            <span>
              MoSJE GIA Component • Designed for low-literacy basic keypad phone users
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
