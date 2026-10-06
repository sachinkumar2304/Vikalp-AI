import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { pmajayService } from "@/services/pmajayService";
import {
  Volume2,
  VolumeX,
  Compass,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  X,
} from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";

interface TourStep {
  targetId?: string;
  speechKey: string;
  titleKey: string;
}

export const VoiceGuideWidget: React.FC = () => {
  const { lang, t, playVoice, stopVoice, isSpeaking } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [isIVRActive, setIsIVRActive] = useState<boolean>(false);

  // AMA State
  const [activeTab, setActiveTab] = useState<"tour" | "ask">("tour");
  const [userQuery, setUserQuery] = useState<string>("");
  const [isListeningUser, setIsListeningUser] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [lastAnswer, setLastAnswer] = useState<string>("");
  const [violationCount, setViolationCount] = useState<number>(0);
  const [lockoutWarning, setLockoutWarning] = useState<boolean>(false);

  // Script text by language
  const texts: Record<string, Record<string, string>> = {
    hi: {
      saathi_name: "वाणी साथी (Voice Guide)",
      speaking_status: "बोल रहा है...",
      idle_status: "सहायता हेतु सक्रिय",
      start_tour_btn: "वेबसाइट मार्गदर्शन सुनें (Voice Tour)",
      stop_btn: "आवाज बंद करें",
      resume_btn: "फिर से सुनें",
      next_btn: "अगला भाग",
      close_guide: "बंद करें",
      tab_tour: "वेबसाइट टूर",
      tab_ask: "सवाल पूछें (AMA)",
      tab_ivr: "IVR कॉल",
      ask_placeholder: "पीएम-अजय, कोर्स या टूलकिट के बारे में पूछें...",
      ask_btn: "पूछें",
      ask_mic_listening: "सुन रहा हूँ... बोलिए",
      ask_guideline: "सुरक्षा नियम: केवल पीएम-अजय, कौशल कोर्स और पात्रता के सवाल ही पूछें।",
      lockout_alert: "सख्त चेतावनी: 10 उल्लंघनों के बाद खाते पर 4 दिन की रोक लग सकती है।",
      interview_cue: "नमस्ते! क्या आप अपना वॉयस इंटरव्यू शुरू करने के लिए तैयार हैं? बस माइक बटन दबाएं!",
      recommendations_cue: "यहाँ आपके हुनर और सुविधा अनुसार चुने गए सरकारी कोर्सेस हैं।",
      opportunities_cue: "यहाँ आपके नजदीकी प्रशिक्षण केंद्र और रोजगार के अवसर दिखाए गए हैं।",
      admin_cue: "यह प्रशासनिक डैशबोर्ड है जहाँ अधिकारियों द्वारा डेटा मॉनिटर होता है।",
      tour_step1_title: "१. मुख्य द्वार (Introduction)",
      tour_step1_speech: "नमस्ते भाई-बहनों! मैं आपका वाणी साथी हूँ। यह भारत सरकार के सामाजिक न्याय मंत्रालय का पीएम-अजय पोर्टल है। यहाँ आपको कोई कागज़ी फॉर्म नहीं भरना है। बस अपनी बोली में बोलकर आप मुफ्त सरकारी ट्रेनिंग और मान्यता प्राप्त कौशल केंद्र से जुड़ सकते हैं।",
      tour_step2_title: "२. आसान ४ चरण",
      tour_step2_speech: "नीचे देखिए — पहला चरण है बोलकर अपनी जानकारी देना। दूसरा चरण है प्रोफाइल मैपिंग। तीसरा चरण है सही कोर्स चुनना और चौथा चरण है नजदीकी कौशल केंद्र से जुड़ना।",
      tour_step3_title: "३. १८ सरकारी कोर्स (NSQF)",
      tour_step3_speech: "यहाँ १८ प्रमाणित सरकारी कोर्स हैं जैसे सोलर रूफटॉप, सिलाई, प्लंबिंग और इलेक्ट्रिशियन। हर कोर्स में आपको छात्रवृत्ति और सरकारी प्रमाणपत्र मिलता है।",
      tour_step4_title: "४. सहायता और संपर्क",
      tour_step4_speech: "यदि आपको कोई भी समस्या हो तो ऊपर दिए गए टोल-फ्री नंबर 1800-11-2026 पर कॉल कर सकते हैं। क्या आप अभी वॉयस इंटरव्यू शुरू करना चाहते हैं? नीचे दिए गए बटन पर क्लिक करें।",
      tour_complete: "मार्गदर्शन पूरा हुआ! अब आप माइक दबाकर बोलना शुरू कर सकते हैं।",
    },
    en: {
      saathi_name: "Vaani Saathi (Voice Guide)",
      speaking_status: "Speaking...",
      idle_status: "Ready to assist you",
      start_tour_btn: "Listen to Website Tour",
      stop_btn: "Mute Voice",
      resume_btn: "Replay",
      next_btn: "Next Section",
      close_guide: "Close",
      tab_tour: "Website Tour",
      tab_ask: "Ask Questions (AMA)",
      tab_ivr: "IVR Call",
      ask_placeholder: "Ask about PM-AJAY, courses, or training centers...",
      ask_btn: "Ask",
      ask_mic_listening: "Listening... speak now",
      ask_guideline: "Safety boundary: Exclusively PM-AJAY and skill related queries permitted.",
      lockout_alert: "Strict Alert: 10 violations may result in 4-day temporary restriction.",
      interview_cue: "Welcome! Are you ready to begin your voice interview? Just tap the voice interview button!",
      recommendations_cue: "Here are government skill courses matched to your profile and location.",
      opportunities_cue: "Explore training centers and livelihood opportunities near you.",
      admin_cue: "This is the administrative dashboard for real-time monitoring.",
      tour_step1_title: "1. Welcome & Introduction",
      tour_step1_speech: "Hello and welcome! I am your Vaani Saathi. This is the PM-AJAY portal by the Government of India. You do not need to fill complex forms. Simply speak in your mother tongue to access 100% free NSQF skilling and connect with accredited centers.",
      tour_step2_title: "2. Simple 4-Step Process",
      tour_step2_speech: "Look below — Step 1 is speaking your details. Step 2 maps your prior experience. Step 3 matches government courses, and Step 4 connects you to your nearest skill center.",
      tour_step3_title: "3. 18 Government NSQF Trades",
      tour_step3_speech: "Here you can explore 18 certified trades including Solar Technician, Tailoring, Plumbing, and Electrician, all with official certificates.",
      tour_step4_title: "4. Help & Support",
      tour_step4_speech: "For immediate help, call toll-free 1800-11-2026 anytime. Ready to begin? Tap the voice interview button to start.",
      tour_complete: "Tour complete! You can now start by clicking the microphone button.",
    },
    mr: {
      saathi_name: "वाणी साथी (मार्गदर्शक)",
      speaking_status: "बोलत आहे...",
      idle_status: "आपल्या मदतीसाठी तयार",
      start_tour_btn: "वेबसाइट मार्गदर्शन ऐका (Voice Tour)",
      stop_btn: "आवाज बंद करा",
      resume_btn: "पुन्हा ऐका",
      next_btn: "पुढील भाग",
      close_guide: "बंद करा",
      tab_tour: "वेबसाइट टूर",
      tab_ask: "प्रश्न विचारा (AMA)",
      tab_ivr: "IVR कॉल",
      ask_placeholder: "पीएम-अजय, कोर्सेस किंवा केंद्रांबद्दल विचारा...",
      ask_btn: "विचारा",
      ask_mic_listening: "ऐकत आहे... बोला",
      ask_guideline: "सुरक्षा नियम: केवळ पीएम-अजय आणि कौशल्यासंबंधी प्रश्न विचारा.",
      lockout_alert: "कडक इशारा: १० उल्लगंनांनंतर ४ दिवसांची तात्पुरती बंदी येऊ शकते.",
      interview_cue: "नमस्कार! तुम्ही व्हॉइस मुलाखत सुरू करण्यास तयार आहात का? खालील मुलाखत बटण दाबा!",
      recommendations_cue: "येथे आपल्या कौशल्यानुसार निवडलेले सरकारी NSQF अभ्यासक्रम आहेत.",
      opportunities_cue: "येथे आपल्या जवळची प्रशिक्षण केंद्रे आणि रोजगाराच्या संधी दाखवल्या आहेत.",
      admin_cue: "हा प्रशासकीय डॅशबोर्ड आहे जिथे अधिकारी माहितीचे निरीक्षण करतात.",
      tour_step1_title: "१. मुख्य पृष्ठ परिचय",
      tour_step1_speech: "नमस्कार बंधू आणि भगिनींनो! मी तुमचा वाणी साथी आहे. हे भारत सरकारच्या सामाजिक न्याय मंत्रालयाचे पीएम-अजय पोर्टल आहे. येथे कोणताही फॉर्म भरण्याची गरज नाही. फक्त आपल्या भाषेत बोलून मोफत प्रशिक्षण व नजीकच्या कौशल्य केंद्राची माहिती मिळवा.",
      tour_step2_title: "२. सोप्या ४ पायऱ्या",
      tour_step2_speech: "खाली पहा — पहिली पायरी आवाजाने माहिती देणे, दुसरी प्रोफाइल मॅपिंग, तिसरी योग्य कोर्स निवड आणि चौथी नजीकच्या केंद्राशी जोडणी.",
      tour_step3_title: "३. १८ सरकारी कोर्सेस",
      tour_step3_speech: "येथे सोलर, टेलरिंग, प्लंबिंग यासारखे १८ प्रमाणित कोर्सेस आहेत ज्यामध्ये सरकारी प्रमाणपत्र मिळते.",
      tour_step4_title: "४. मदत आणि संपर्क",
      tour_step4_speech: "कोणतीही अडचण आल्यास १८००-११-२०२६ या टोल-फ्री क्रमांकावर संपर्क साधा. आताच संवाद सुरू करण्यासाठी मुलाखत बटणावर क्लिक करा.",
      tour_complete: "मार्गदर्शन पूर्ण झाले! आता आपण बोलणे सुरू करू शकता.",
    },
  };

  const curLang = lang in texts ? lang : "hi";
  const tr = texts[curLang];

  const tourSteps: TourStep[] = [
    { targetId: "hero-section", titleKey: "tour_step1_title", speechKey: "tour_step1_speech" },
    { targetId: "steps-section", titleKey: "tour_step2_title", speechKey: "tour_step2_speech" },
    { targetId: "trades-section", titleKey: "tour_step3_title", speechKey: "tour_step3_speech" },
    { targetId: "cta-section", titleKey: "tour_step4_title", speechKey: "tour_step4_speech" },
  ];

  // Route-specific guidance when navigating
  useEffect(() => {
    if (location.pathname === "/pmajay/interview") {
      return;
    } else if (location.pathname === "/pmajay/recommendations") {
      const timer = setTimeout(() => {
        playVoice(tr.recommendations_cue);
      }, 700);
      return () => clearTimeout(timer);
    } else if (location.pathname === "/pmajay/opportunities") {
      const timer = setTimeout(() => {
        playVoice(tr.opportunities_cue);
      }, 700);
      return () => clearTimeout(timer);
    } else if (location.pathname === "/pmajay/admin") {
      const timer = setTimeout(() => {
        playVoice(tr.admin_cue);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, lang]);

  // Completely hide voice guide when IVR telephony is active
  useEffect(() => {
    const handleIVRState = (e: any) => {
      setIsIVRActive(!!e?.detail?.open);
    };
    window.addEventListener("vikalp:ivr-state", handleIVRState);
    return () => window.removeEventListener("vikalp:ivr-state", handleIVRState);
  }, []);

  const handleStartTour = () => {
    setIsTourRunning(true);
    setCurrentStepIndex(0);
    playStep(0);
  };

  const playStep = (index: number) => {
    const step = tourSteps[index];
    if (!step) {
      setIsTourRunning(false);
      setCurrentStepIndex(-1);
      playVoice(tr.tour_complete);
      return;
    }

    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-amber-500", "ring-offset-4", "transition-all", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-amber-500", "ring-offset-4");
        }, 5000);
      }
    }

    playVoice(tr[step.speechKey]);
  };

  const handleNextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < tourSteps.length) {
      setCurrentStepIndex(nextIdx);
      playStep(nextIdx);
    } else {
      setIsTourRunning(false);
      setCurrentStepIndex(-1);
      playVoice(tr.tour_complete);
    }
  };

  const handleStop = () => {
    stopVoice();
    setIsTourRunning(false);
    setCurrentStepIndex(-1);
  };

  const handleAskQuestion = async (queryText?: string) => {
    const textToAsk = queryText || userQuery;
    if (!textToAsk.trim()) return;

    setIsAnswering(true);
    try {
      const res = await pmajayService.askSaathi(textToAsk, lang);
      setLastAnswer(res.answer);
      setViolationCount(res.violations || 0);
      setLockoutWarning(!!res.is_lockout_warning);

      playVoice(res.answer);
      setUserQuery("");
    } catch {
      const fallbackMsg =
        lang === "hi"
          ? "मैं केवल पीएम-अजय कौशल योजना के सवालों के उत्तर दे सकता हूँ।"
          : "I can answer questions regarding PM-AJAY skill programs exclusively.";
      setLastAnswer(fallbackMsg);
      playVoice(fallbackMsg);
    } finally {
      setIsAnswering(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListeningUser) {
      setIsListeningUser(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("वॉयस पहचान इस ब्राउज़र में उपलब्ध नहीं है। कृपया टाइप करें।");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningUser(true);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setUserQuery(spokenText);
        setIsListeningUser(false);
        handleAskQuestion(spokenText);
      };

      recognition.onerror = () => {
        setIsListeningUser(false);
      };

      recognition.onend = () => {
        setIsListeningUser(false);
      };

      recognition.start();
    } catch {
      setIsListeningUser(false);
    }
  };

  const isHome = location.pathname === "/pmajay" || location.pathname === "/";

  // When IVR call is active, remove this widget completely so no duplicate boxes appear
  if (isIVRActive) return null;

  return (
    <aside
      aria-label="Voice Assistant Guide Widget"
      className="fixed bottom-4 right-4 z-50 font-sans max-w-sm sm:max-w-md w-[calc(100vw-2rem)] select-none pointer-events-auto"
    >
      {/* ── EXPANDED WIDGET BOX ── */}
      {isOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-xl text-slate-100 rounded-2xl border border-slate-700/80 shadow-2xl p-4 transition-all duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              {/* Quiet Audio Status Icon (No Bouncing, No Pinging, No Neon Glow) */}
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                <Volume2
                  className={`w-4 h-4 transition-colors ${
                    isSpeaking ? "text-emerald-400" : "text-slate-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-100 leading-tight">
                    {tr.saathi_name}
                  </h4>
                  <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    VOICE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                  {isSpeaking ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {tr.speaking_status}
                    </span>
                  ) : (
                    <span className="text-slate-400">{tr.idle_status}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Minimize Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Minimize Guide"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sound Wave Visualizer when speaking */}
          {isSpeaking && (
            <div className="bg-slate-800/80 rounded-lg p-2.5 mb-2.5 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-400 text-[11px]">ऑडियो:</span>
                <span className="text-xs font-medium text-slate-200 truncate">
                  वाणी साथी मार्गदर्शन दे रहा है
                </span>
              </div>
              <div className="flex items-center gap-1 h-3.5 shrink-0" aria-label="Audio wave indicator">
                <span className="w-0.5 bg-emerald-400 rounded-full h-2 animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald-400 rounded-full h-3.5 animate-[pulse_1.3s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald-400 rounded-full h-2.5 animate-[pulse_0.9s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald-400 rounded-full h-3 animate-[pulse_1.1s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 bg-slate-800/80 p-1 rounded-lg mb-2.5 border border-slate-700/60 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("tour")}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "tour"
                  ? "bg-slate-700 text-white shadow-2xs font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{tr.tab_tour}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ask")}
              className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "ask"
                  ? "bg-slate-700 text-white shadow-2xs font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{tr.tab_ask}</span>
            </button>
          </div>

          {/* ════ TAB 1: WEBSITE TOUR ════ */}
          {activeTab === "tour" && (
            <div>
              {isHome ? (
                <div className="space-y-2">
                  {isTourRunning && currentStepIndex >= 0 ? (
                    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                      <div className="flex items-center justify-between text-xs text-slate-200 font-semibold mb-1">
                        <span>{tr[tourSteps[currentStepIndex].titleKey]}</span>
                        <span className="text-slate-400 text-[11px]">
                          {currentStepIndex + 1}/{tourSteps.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                        >
                          <span>{tr.next_btn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => playStep(currentStepIndex)}
                          className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-all"
                          title={tr.resume_btn}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartTour}
                      className="w-full bg-slate-100 hover:bg-white text-slate-900 font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Compass className="w-4 h-4 text-slate-900" />
                      <span>{tr.start_tour_btn}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 leading-relaxed">
                    {location.pathname === "/pmajay/interview" && tr.interview_cue}
                    {location.pathname === "/pmajay/recommendations" && tr.recommendations_cue}
                    {location.pathname === "/pmajay/opportunities" && tr.opportunities_cue}
                    {location.pathname === "/pmajay/admin" && tr.admin_cue}
                  </div>

                  <Link
                    to="/pmajay/interview"
                    className="w-full bg-slate-100 hover:bg-white text-slate-900 font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Mic className="w-4 h-4 text-slate-900" />
                    <span>वॉयस संवाद शुरू करें</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 2: ASK ME ANYTHING (AMA WITH BOUNDARIES) ════ */}
          {activeTab === "ask" && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/60 px-2 py-1.5 rounded-md border border-slate-700/40">
                <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{tr.ask_guideline}</span>
              </div>

              {violationCount > 0 && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                    lockoutWarning
                      ? "bg-rose-950/60 border-rose-850 text-rose-200"
                      : "bg-amber-950/60 border-amber-850 text-amber-200"
                  }`}
                >
                  {lockoutWarning ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-snug">
                    <span className="font-semibold">
                      {lockoutWarning ? "सुरक्षा प्रतिबंध अलर्ट" : `सीमा उल्लंघन (${violationCount}/10)`}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {lockoutWarning ? tr.lockout_alert : "केवल पीएम-अजय कौशल व योजना संबंधी प्रश्न पूछें।"}
                    </p>
                  </div>
                </div>
              )}

              {lastAnswer && (
                <div className="bg-slate-800/70 border border-slate-700/60 p-2.5 rounded-xl text-xs max-h-28 overflow-y-auto">
                  <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px] mb-1">
                    <span>वाणी साथी का उत्तर:</span>
                    <button
                      type="button"
                      onClick={() => playVoice(lastAnswer)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                      <span>सुनें</span>
                    </button>
                  </div>
                  <p className="text-slate-100 leading-relaxed">{lastAnswer}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl p-1 focus-within:border-slate-500 transition-colors">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder={isListeningUser ? tr.ask_mic_listening : tr.ask_placeholder}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 outline-none"
                />

                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isListeningUser
                      ? "bg-rose-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                  title="बोलकर सवाल पूछें"
                >
                  {isListeningUser ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  disabled={!userQuery.trim() || isAnswering}
                  onClick={() => handleAskQuestion()}
                  className="bg-slate-100 hover:bg-white text-slate-900 font-semibold p-1.5 rounded-lg transition-all disabled:opacity-30 active:scale-[0.98]"
                  title={tr.ask_btn}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs">
            {isSpeaking ? (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-medium py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{tr.stop_btn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => playVoice(t("welcome_speech"))}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                <span>{tr.resume_btn}</span>
              </button>
            )}

            {location.pathname !== "/pmajay/interview" && (
              <button
                type="button"
                onClick={() => navigate("/pmajay/interview")}
                className="bg-[#002147] hover:bg-[#002f66] text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-all shrink-0 active:scale-[0.98]"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                <span>साक्षात्कार</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── COLLAPSED FLOATING DOCK PILL ── */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 hover:border-slate-500 shadow-xl transition-all ml-auto active:scale-[0.98]"
          title="वाणी साथी वॉयस गाइड खोलें"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            {isSpeaking ? (
              <div className="flex items-center gap-0.5 h-3" aria-label="Audio active">
                <span className="w-0.5 bg-emerald-400 rounded-full h-1.5 animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald-400 rounded-full h-3 animate-[pulse_1.3s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald-400 rounded-full h-2 animate-[pulse_0.9s_ease-in-out_infinite]" />
              </div>
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-100">{tr.saathi_name}</div>
            <div className="text-[10px] text-slate-400">
              {isSpeaking ? (
                <span className="text-emerald-400 font-medium">{tr.speaking_status}</span>
              ) : (
                "मार्गदर्शन एवं सवाल"
              )}
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
