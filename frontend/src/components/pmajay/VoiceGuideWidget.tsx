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
  Sparkles,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  ShieldAlert,
  X
} from "lucide-react";

interface TourStep {
  targetId?: string;
  speechKey: string;
  titleKey: string;
}

export const VoiceGuideWidget: React.FC = () => {
  const { lang, t, playVoice, stopVoice, isSpeaking } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [dismissedPageBanner, setDismissedPageBanner] = useState<boolean>(false);

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
      saathi_name: "वाणी साथी (वॉयस गाइड)",
      speaking_status: "बोल रहा है...",
      idle_status: "आपकी सहायता के लिए तैयार",
      start_tour_btn: "वेबसाइट का मार्गदर्शन सुनें (Voice Tour)",
      stop_btn: "आवाज बंद करें",
      resume_btn: "फिर से सुनें",
      next_btn: "अगला भाग",
      close_guide: "बंद करें",
      tab_tour: "वेबसाइट टूर",
      tab_ask: "सवाल पूछें (AMA)",
      ask_placeholder: "पीएम-अजय, कोर्स या टूलकिट के बारे में पूछें...",
      ask_btn: "पूछें",
      ask_mic_listening: "सुन रहा हूँ... बोलिए",
      ask_guideline: "सुरक्षा नियम: केवल पीएम-अजय, कौशल कोर्स और पात्रता के सवाल ही पूछें।",
      lockout_alert: "सख्त चेतावनी: 10 उल्लंघनों के बाद खाते पर 4 दिन की रोक लग सकती है।",
      interview_cue: "नमस्ते! क्या आप अपना वॉयस इंटरव्यू शुरू करने के लिए तैयार हैं? बस माइक बटन दबाएं!",
      recommendations_cue: "यहाँ आपके हुनर और सुविधा अनुसार चुने गए सरकारी कोर्सेस हैं।",
      opportunities_cue: "यहाँ आपके नजदीकी प्रशिक्षण केंद्र और रोजगार के अवसर दिखाए गए हैं।",
      admin_cue: "यह प्रशासनिक डैशबोर्ड है जहाँ अधिकारियों द्वारा डेटा मॉनिटर होता है।",
      tour_step1_title: "1. मुख्य द्वार (Hero)",
      tour_step1_speech: "नमस्ते भाई-बहनों! मैं आपका वाणी साथी हूँ। यह भारत सरकार के सामाजिक न्याय मंत्रालय का पीएम-अजय पोर्टल है। यहाँ आपको कोई कागज़ी फॉर्म नहीं भरना है। बस अपनी बोली में बोलकर आप मुफ्त सरकारी ट्रेनिंग और 50,000 रुपये तक की टूलकिट पा सकते हैं।",
      tour_step2_title: "2. आसान 4 चरण",
      tour_step2_speech: "नीचे देखिए — पहला चरण है बोलकर अपनी जानकारी देना। दूसरा चरण है प्रोफाइल मैपिंग। तीसरा चरण है सही कोर्स चुनना और चौथा चरण है नजदीकी कौशल केंद्र से जुड़ना।",
      tour_step3_title: "3. 18 सरकारी कोर्स (NSQF)",
      tour_step3_speech: "यहाँ 18 प्रमाणित सरकारी कोर्स हैं जैसे सोलर रूफटॉप, सिलाई, प्लंबिंग और इलेक्ट्रिशियन। हर कोर्स में आपको छात्रवृत्ति और सरकारी प्रमाणपत्र मिलता है।",
      tour_step4_title: "4. सहायता और संपर्क",
      tour_step4_speech: "यदि आपको कोई भी समस्या हो तो ऊपर दिए गए टोल-फ्री नंबर 1800-11-2026 पर कॉल कर सकते हैं। क्या आप अभी वॉयस इंटरव्यू शुरू करना चाहते हैं? नीचे हरे बटन पर क्लिक करें।",
      tour_complete: "मार्गदर्शन पूरा हुआ! अब आप माइक दबाकर बोलना शुरू कर सकते हैं।"
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
      ask_placeholder: "Ask about PM-AJAY, courses, or toolkits...",
      ask_btn: "Ask",
      ask_mic_listening: "Listening... speak now",
      ask_guideline: "Safety boundary: Only PM-AJAY and skill related queries permitted.",
      lockout_alert: "Strict Alert: 10 violations may result in 4-day temporary restriction.",
      interview_cue: "Welcome! Are you ready to begin your voice interview? Just tap the green mic button!",
      recommendations_cue: "Here are government skill courses matched to your profile and location.",
      opportunities_cue: "Explore training centers and livelihood opportunities near you.",
      admin_cue: "This is the administrative dashboard for real-time monitoring.",
      tour_step1_title: "1. Welcome & Introduction",
      tour_step1_speech: "Hello and welcome! I am your Vaani Saathi. This is the PM-AJAY portal by the Government of India. You do not need to fill complex forms. Simply speak in your mother tongue to access 100% free NSQF skilling and up to 50,000 rupees toolkit grant.",
      tour_step2_title: "2. Simple 4-Step Process",
      tour_step2_speech: "Look below — Step 1 is speaking your details. Step 2 maps your prior experience. Step 3 matches government courses, and Step 4 connects you to your nearest skill center.",
      tour_step3_title: "3. 18 Government NSQF Trades",
      tour_step3_speech: "Here you can explore 18 certified trades including Solar Technician, Tailoring, Plumbing, and Electrician, all with stipend and official certificates.",
      tour_step4_title: "4. Help & Support",
      tour_step4_speech: "For immediate help, call toll-free 1800-11-2026 anytime. Ready to begin? Tap the voice interview button to start.",
      tour_complete: "Tour complete! You can now start by clicking the microphone button."
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
      ask_placeholder: "पीएम-अजय, कोर्सेस किंवा टूलकिटबद्दल विचारा...",
      ask_btn: "विचारा",
      ask_mic_listening: "ऐकत आहे... बोला",
      ask_guideline: "सुरक्षा नियम: केवळ पीएम-अजय आणि कौशल्यासंबंधी प्रश्न विचारा.",
      lockout_alert: "कडक इशारा: १० उल्लंघनांनंतर ४ दिवसांची तात्पुरती बंदी येऊ शकते.",
      interview_cue: "नमस्कार! तुम्ही व्हॉइस मुलाखत सुरू करण्यास तयार आहात का? खालील हिरवे माइक बटण दाबा!",
      recommendations_cue: "येथे आपल्या कौशल्यानुसार निवडलेले सरकारी NSQF अभ्यासक्रम आहेत.",
      opportunities_cue: "येथे आपल्या जवळची प्रशिक्षण केंद्रे आणि रोजगाराच्या संधी दाखवल्या आहेत.",
      admin_cue: "हा प्रशासकीय डॅशबोर्ड आहे जिथे अधिकारी माहितीचे निरीक्षण करतात.",
      tour_step1_title: "१. मुख्य पृष्ठ परिचय",
      tour_step1_speech: "नमस्कार बंधू आणि भगिनींनो! मी तुमचा वाणी साथी आहे. हे भारत सरकारच्या सामाजिक न्याय मंत्रालयाचे पीएम-अजय पोर्टल आहे. येथे कोणताही फॉर्म भरण्याची गरज नाही. फक्त आपल्या भाषेत बोलून मोफत प्रशिक्षण व ५०,००० रुपयांपर्यंत टूलकिट मिळवा.",
      tour_step2_title: "२. सोप्या ४ पायऱ्या",
      tour_step2_speech: "खाली पहा — पहिली पायरी आवाजाने माहिती देणे, दुसरी प्रोफाइल मॅपिंग, तिसरी योग्य कोर्स निवड आणि चौथी नजीकच्या केंद्राशी जोडणी.",
      tour_step3_title: "३. १८ सरकारी कोर्सेस",
      tour_step3_speech: "येथे सोलर, टेलरिंग, प्लंबिंग यासारखे १८ प्रमाणित कोर्सेस आहेत ज्यामध्ये सरकारी प्रमाणपत्र मिळते.",
      tour_step4_title: "४. मदत आणि संपर्क",
      tour_step4_speech: "कोणतीही अडचण आल्यास १८००-११-२०२६ या टोल-फ्री क्रमांकावर संपर्क साधा. आताच संवाद सुरू करण्यासाठी मुलाखत बटणावर क्लिक करा.",
      tour_complete: "मार्गदर्शन पूर्ण झाले! आता आपण बोलणे सुरू करू शकता."
    }
  };

  const curLang = lang in texts ? lang : "hi";
  const tr = texts[curLang];

  const tourSteps: TourStep[] = [
    { targetId: "hero-section", titleKey: "tour_step1_title", speechKey: "tour_step1_speech" },
    { targetId: "steps-section", titleKey: "tour_step2_title", speechKey: "tour_step2_speech" },
    { targetId: "trades-section", titleKey: "tour_step3_title", speechKey: "tour_step3_speech" },
    { targetId: "cta-section", titleKey: "tour_step4_title", speechKey: "tour_step4_speech" }
  ];

  // Route-specific guidance when navigating
  useEffect(() => {
    setDismissedPageBanner(false);
    if (location.pathname === "/pmajay/interview") {
      // Do not interrupt the interview question with tour speech
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
        el.classList.add("ring-4", "ring-[#FF9933]", "ring-offset-4", "transition-all", "duration-500");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-[#FF9933]", "ring-offset-4");
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

  // ─── ASK ME ANYTHING (AMA) HANDLER WITH BOUNDARIES ───
  const handleAskQuestion = async (queryText?: string) => {
    const textToAsk = queryText || userQuery;
    if (!textToAsk.trim()) return;

    setIsAnswering(true);
    try {
      const res = await pmajayService.askSaathi(textToAsk, lang);
      setLastAnswer(res.answer);
      setViolationCount(res.violations || 0);
      setLockoutWarning(!!res.is_lockout_warning);

      // Play answer in voice immediately
      playVoice(res.answer);
      setUserQuery("");
    } catch (err) {
      console.error("Ask question failed:", err);
      const fallbackMsg =
        lang === "hi"
          ? "मैं केवल पीएम-अजय कौशल योजना के सवालों के उत्तर दे सकता हूँ।"
          : "I can answer questions regarding PM-AJAY skill programs only.";
      setLastAnswer(fallbackMsg);
      playVoice(fallbackMsg);
    } finally {
      setIsAnswering(false);
    }
  };

  // Browser STT for Ask Me Anything mic
  const toggleSpeechRecognition = () => {
    if (isListeningUser) {
      setIsListeningUser(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your query.");
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
        // Automatically ask after speech recognition
        handleAskQuestion(spokenText);
      };

      recognition.onerror = () => {
        setIsListeningUser(false);
      };

      recognition.onend = () => {
        setIsListeningUser(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Recognition start error:", e);
      setIsListeningUser(false);
    }
  };

  const isHome = location.pathname === "/pmajay" || location.pathname === "/";

  return (
    <aside
      aria-label="Voice Assistant Guide Widget"
      className="fixed bottom-4 right-4 z-50 font-sans max-w-sm sm:max-w-md w-[calc(100vw-2rem)] select-none pointer-events-auto"
    >
      {/* ── EXPANDED WIDGET BOX ── */}
      {isOpen ? (
        <div className="bg-[#00245A]/95 backdrop-blur-md text-white rounded-2xl border-2 border-[#FF9933] shadow-2xl p-4 transition-all duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              {/* Animated Avatar / Sound Indicator */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSpeaking
                      ? "bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-[0_0_15px_#FF9933] animate-pulse"
                      : "bg-[#003366] border border-blue-300"
                  }`}
                >
                  {isSpeaking ? (
                    <Volume2 className="w-5 h-5 text-white animate-bounce" />
                  ) : (
                    <span className="text-lg">🎙️</span>
                  )}
                </div>
                {/* Ripples when speaking */}
                {isSpeaking && (
                  <span className="absolute -inset-1 rounded-full border-2 border-[#FF9933] animate-ping opacity-60 pointer-events-none" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-[#FFC107] leading-tight">
                    {tr.saathi_name}
                  </h4>
                  <span className="bg-[#138808] text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider text-white">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-blue-200">
                  {isSpeaking ? (
                    <span className="text-emerald-300 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      {tr.speaking_status}
                    </span>
                  ) : (
                    <span>{tr.idle_status}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Minimize Toggle */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Guide"
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sound Wave Visualizer when speaking */}
          {isSpeaking && (
            <div className="bg-[#001838] rounded-lg p-2 mb-2 border border-blue-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 flex-1">
                <span className="text-[11px] text-blue-300">आवाज़ का स्रोत:</span>
                <span className="text-xs font-semibold text-emerald-300">
                  यह साथी आपको उत्तर/मार्गदर्शन दे रहा है
                </span>
              </div>
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 bg-[#FF9933] rounded-full animate-[pulse_0.4s_infinite] h-3" />
                <span className="w-1 bg-white rounded-full animate-[pulse_0.6s_infinite] h-4" />
                <span className="w-1 bg-[#138808] rounded-full animate-[pulse_0.3s_infinite] h-2" />
                <span className="w-1 bg-[#FF9933] rounded-full animate-[pulse_0.5s_infinite] h-4" />
                <span className="w-1 bg-white rounded-full animate-[pulse_0.7s_infinite] h-2.5" />
              </div>
            </div>
          )}

          {/* Tab Selector: Website Tour vs Ask Questions (AMA) */}
          <div className="grid grid-cols-2 gap-1 bg-[#001c45] p-1 rounded-xl mb-2.5 border border-blue-400/20 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("tour")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "tour"
                  ? "bg-[#003366] text-[#FFC107] shadow-sm border border-blue-400/40"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{tr.tab_tour}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ask")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "ask"
                  ? "bg-[#003366] text-[#FFC107] shadow-sm border border-blue-400/40"
                  : "text-blue-200 hover:text-white"
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
                    <div className="bg-[#001c45] p-2.5 rounded-xl border border-blue-400/30">
                      <div className="flex items-center justify-between text-xs text-[#FFC107] font-semibold mb-1">
                        <span>{tr[tourSteps[currentStepIndex].titleKey]}</span>
                        <span className="text-white/60">
                          {currentStepIndex + 1}/{tourSteps.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-[#138808] hover:bg-[#0f6b06] text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow transition-all"
                        >
                          <span>{tr.next_btn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => playStep(currentStepIndex)}
                          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-all"
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
                      className="w-full bg-gradient-to-r from-[#FF9933] to-[#e67e00] hover:from-[#e67e00] hover:to-[#c96c00] text-[#00245A] font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <Compass className="w-4 h-4 text-[#00245A]" />
                      <span>{tr.start_tour_btn}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-blue-200 bg-[#001c45] p-2.5 rounded-xl border border-blue-400/20 leading-relaxed">
                    {location.pathname === "/pmajay/interview" && tr.interview_cue}
                    {location.pathname === "/pmajay/recommendations" && tr.recommendations_cue}
                    {location.pathname === "/pmajay/opportunities" && tr.opportunities_cue}
                    {location.pathname === "/pmajay/admin" && tr.admin_cue}
                  </div>

                  {location.pathname === "/pmajay/interview" ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Trigger interview mic button
                        const micBtn = document.querySelector('button[title*="Voice Input"], button[title*="Listening"]') as HTMLButtonElement;
                        if (micBtn) {
                          micBtn.click();
                        } else {
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }
                      }}
                      className="w-full bg-gradient-to-r from-[#138808] to-[#0f6b06] hover:from-[#0f6b06] hover:to-[#0b4d04] text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <Mic className="w-4 h-4 text-white animate-pulse" />
                      <span>माइक दबाकर बोलना शुरू करें (Start Mic)</span>
                    </button>
                  ) : (
                    <Link
                      to="/pmajay/interview"
                      className="w-full bg-gradient-to-r from-[#FF9933] to-[#e67e00] hover:from-[#e67e00] hover:to-[#c96c00] text-[#00245A] font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <Mic className="w-4 h-4 text-[#00245A]" />
                      <span>वॉयस इंटरव्यू शुरू करें</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ════ TAB 2: ASK ME ANYTHING (AMA WITH BOUNDARIES) ════ */}
          {activeTab === "ask" && (
            <div className="space-y-2">
              {/* Boundary guideline badge */}
              <div className="flex items-center gap-1 text-[10px] text-blue-300 bg-[#001c45] px-2 py-1 rounded-lg">
                <HelpCircle className="w-3 h-3 text-[#FF9933] shrink-0" />
                <span className="truncate">{tr.ask_guideline}</span>
              </div>

              {/* Lockout or Violation Warning Banner */}
              {violationCount > 0 && (
                <div
                  className={`p-2 rounded-xl text-xs flex items-start gap-2 border ${
                    lockoutWarning
                      ? "bg-red-950/80 border-red-500 text-red-200"
                      : "bg-amber-950/70 border-amber-500 text-amber-200"
                  }`}
                >
                  {lockoutWarning ? (
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-snug">
                    <span className="font-bold">
                      {lockoutWarning ? "सुरक्षा प्रतिबंध अलर्ट" : `सीमा उल्लंघन (${violationCount}/10)`}
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {lockoutWarning ? tr.lockout_alert : "असंबंधित सवाल पूछने की अनुमति नहीं है।"}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Answer Box */}
              {lastAnswer && (
                <div className="bg-[#001838] border border-blue-400/30 p-2.5 rounded-xl text-xs max-h-28 overflow-y-auto">
                  <div className="flex items-center justify-between text-[#FFC107] font-semibold text-[11px] mb-1">
                    <span>वाणी साथी का उत्तर:</span>
                    <button
                      type="button"
                      onClick={() => playVoice(lastAnswer)}
                      className="text-blue-300 hover:text-white flex items-center gap-0.5"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>सुनें</span>
                    </button>
                  </div>
                  <p className="text-white/95 leading-relaxed">{lastAnswer}</p>
                </div>
              )}

              {/* Input Box: Text + Mic + Send */}
              <div className="flex items-center gap-1.5 bg-[#001838] border border-blue-500/40 rounded-xl p-1">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder={isListeningUser ? tr.ask_mic_listening : tr.ask_placeholder}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white placeholder-blue-300/50 outline-none"
                />

                {/* Speak Question Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-1.5 rounded-lg transition-all ${
                    isListeningUser
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#003366] text-[#FFC107] hover:bg-blue-800"
                  }`}
                  title="बोलकर सवाल पूछें"
                >
                  {isListeningUser ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Submit Question Button */}
                <button
                  type="button"
                  disabled={!userQuery.trim() || isAnswering}
                  onClick={() => handleAskQuestion()}
                  className="bg-[#FF9933] hover:bg-[#e68a00] disabled:opacity-40 text-[#00245A] font-bold p-1.5 rounded-lg transition-all"
                  title={tr.ask_btn}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Row: Stop / Mute & Voice Interview Action */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-xs">
            {isSpeaking ? (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 bg-red-600/90 hover:bg-red-700 text-white font-semibold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{tr.stop_btn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => playVoice(t("welcome_speech"))}
                className="flex-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white font-medium py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 border border-blue-400/30 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{tr.resume_btn}</span>
              </button>
            )}

            {/* Quick jump to Voice Interview if not already there */}
            {location.pathname !== "/pmajay/interview" && (
              <button
                type="button"
                onClick={() => navigate("/pmajay/interview")}
                className="bg-[#138808] hover:bg-[#0f6b06] text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow transition-all shrink-0"
              >
                <span>🎙️ इंटरव्यू</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── COLLAPSED FLOATING PILL / ICON ── */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border-2 border-[#FF9933] shadow-2xl transition-all duration-300 ml-auto ${
            isSpeaking
              ? "bg-[#00245A] text-white animate-pulse shadow-[0_0_20px_#FF9933]"
              : "bg-[#00245A]/95 text-white hover:bg-[#003366]"
          }`}
        >
          <div className="relative">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                isSpeaking ? "bg-[#FF9933] text-[#00245A]" : "bg-[#003366] text-white"
              }`}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : "🎙️"}
            </div>
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-full border-2 border-[#FF9933] animate-ping" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#FFC107]">{tr.saathi_name}</div>
            <div className="text-[10px] text-blue-200">
              {isSpeaking ? tr.speaking_status : "मार्गदर्शन / सवाल पूछें"}
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-white/70" />
        </button>
      )}
    </aside>
  );
};
