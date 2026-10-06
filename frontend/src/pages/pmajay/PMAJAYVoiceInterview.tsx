import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData } from "@/services/pmajayService";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  ShieldCheck,
  Award,
  ArrowRight,
  Phone,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { IVRSimulatorModal } from "@/components/pmajay/IVRSimulatorModal";

interface TurnMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  turn: number;
  timestamp: string;
}

const SAMPLE_BENEFICIARY_RESPONSES = [
  // Turn 1: Basic Info & Location
  [
    "मेरा नाम रमेश कुमार है, सेवापुरी ब्लॉक, वाराणसी का निवासी हूँ।",
    "सुनीता देवी, सकलडीहा गांव, चंदौली जिला।",
    "My name is Amit Paswan, Babatpur rural cluster, Varanasi.",
  ],
  // Turn 2: Education
  [
    "मैंने 10वीं पास की है गांव के राजकीय विद्यालय से।",
    "आठवीं तक पढ़ाई की है (8th pass).",
    "स्कूल नहीं जा सका, केवल नाम और हस्ताक्षर कर लेता हूँ (Below 8th).",
  ],
  // Turn 3: Current Work & Prior Skills (RPL)
  [
    "अभी गांव में बिजली के तार, मोटर रिपेयर व वायरिंग में हेल्पर का काम करता हूँ 4 साल से।",
    "घर पर सिलाई और कढ़ाई का काम करती हूँ हाथों से।",
    "खेत में दैनिक मजदूरी और कभी-कभी पाइपलाइन का काम करता हूँ।",
  ],
  // Turn 4: Aspiration & Trade Interest
  [
    "मुझे सोलर रूफटॉप पैनल और आधुनिक बिजली का काम सीखना है जिससे गांव में अपनी दुकान खोल सकूँ।",
    "सिलाई और बुटीक का आधुनिक डिजाइन सीखना चाहती हूँ।",
    "नल-जल योजना में प्लंबर और मोटर पंप मरम्मत का प्रशिक्षण लेना चाहता हूँ।",
  ],
  // Turn 5: Employment Preference & Capital Goal
  [
    "मैं अपना खुद का सोलर रिपेयर सेंटर शुरू करना चाहता हूँ पीएम-अजय टूलकिट की मदद से।",
    "अपना स्वयं का सिलाई केंद्र और बुटीक चलाना चाहती हूँ (स्वरोजगार)।",
    "मुझे किसी कंपनी या विद्युत ठेकेदार के पास निश्चित मासिक वेतन वाली नौकरी चाहिए।",
  ],
  // Turn 6: Mobility Constraints (Crucial Guardrail)
  [
    "मैं ब्लॉक और तहसील तक जा सकता हूँ, लेकिन बाहर दूसरे राज्य नहीं जा सकता।",
    "सिर्फ गांव के भीतर ही काम कर सकती हूँ, बाहर यात्रा संभव नहीं है।",
    "मैं पूरे जिले और शहर में कहीं भी काम के लिए यात्रा कर सकता हूँ।",
  ],
];

export const PMAJAYVoiceInterview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedLang = searchParams.get("lang") || "hi-IN";
  const navigate = useNavigate();

  // State
  const [sessionId, setSessionId] = useState<string>("");
  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [totalTurns, setTotalTurns] = useState<number>(6);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<TurnMessage[]>([]);
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [ivrModalOpen, setIvrModalOpen] = useState<boolean>(false);

  // Audio / Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Session on mount
  useEffect(() => {
    const initSession = async () => {
      const data = await pmajayService.startInterview(selectedLang);
      if (data) {
        setSessionId(data.session_id);
        setCurrentTurn(data.current_turn || 1);
        setTotalTurns(data.total_turns || 6);
        setProfile(data.profile);

        const initialAssistantMsg: TurnMessage = {
          id: "init-1",
          sender: "assistant",
          text: data.question_prompt,
          turn: 1,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([initialAssistantMsg]);

        // Speak aloud
        speakAloud(data.question_prompt, selectedLang);
      }
    };
    initSession();
  }, [selectedLang]);

  // Speech Synthesis with replay
  const speakAloud = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang.startsWith("hi") ? "hi-IN" : "en-IN";
      utterance.rate = 0.94;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser Speech Recognition
  const toggleListening = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "माइक्रोफोन वॉयस इनपुट क्रोम और एज ब्राउज़र में समर्थित है। आप नीचे दिए गए त्वरित नमूना उत्तरों पर क्लिक करके भी टेस्ट कर सकते हैं।"
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.startsWith("hi") ? "hi-IN" : "en-IN";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        const text = (finalTranscript + interimTranscript).trim();
        if (text) {
          setUserInput(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Submit Answer & advance turn
  const handleSubmitTurn = async (overrideText?: string) => {
    const textToSend = (overrideText || userInput).trim();
    if (!textToSend || isSubmitting) return;

    setIsSubmitting(true);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // 1. Add user message
    const userMsg: TurnMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      turn: currentTurn,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");

    // 2. Call backend interview engine
    const res = await pmajayService.processTurn(sessionId, currentTurn, textToSend);

    if (res && res.profile) {
      setProfile(res.profile);
      localStorage.setItem("pmajay_active_profile", JSON.stringify(res.profile));

      if (res.is_completed) {
        const finalMsg: TurnMessage = {
          id: "assistant-" + Date.now(),
          sender: "assistant",
          text: res.next_prompt,
          turn: currentTurn,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, finalMsg]);
        speakAloud(res.next_prompt, selectedLang);

        setTimeout(() => {
          navigate("/pmajay/profile");
        }, 2200);
      } else {
        setCurrentTurn(res.next_turn);
        const nextMsg: TurnMessage = {
          id: "assistant-" + Date.now(),
          sender: "assistant",
          text: res.next_prompt,
          turn: res.next_turn,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, nextMsg]);
        speakAloud(res.next_prompt, selectedLang);
      }
    } else {
      if (currentTurn >= totalTurns) {
        navigate("/pmajay/profile");
      } else {
        setCurrentTurn((c) => c + 1);
      }
    }

    setIsSubmitting(false);
  };

  const sampleResponsesForTurn = SAMPLE_BENEFICIARY_RESPONSES[currentTurn - 1] || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        {/* Step Header Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  चरण २ / ५ • Step 2 of 5
                </span>
                <span>•</span>
                <span>मौखिक संवाद एवं आजीविका मैपिंग (Spoken Assessment)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147] mt-1">
                आजीविका एवं कौशल साक्षात्कार (Beneficiary Voice Intake)
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                योजना: प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) • अनुदान सहायता (GIA) घटक
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Feature Phone IVR Alternative Button */}
              <button
                type="button"
                onClick={() => setIvrModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="कीपैड फोन से कॉल करने का सिम्युलेटर"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>IVR डायल (1800-11-2026)</span>
              </button>

              {/* Progress Pill */}
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-[#002147]" />
                <span>Turn {currentTurn} of {totalTurns}</span>
                <div className="w-16 bg-slate-300 h-2 rounded-full overflow-hidden ml-1">
                  <div
                    className="bg-[#002147] h-full transition-all duration-300"
                    style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Left Voice Interaction & Chat, Right Real-Time Structured Profile State */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Left Column: Voice Dialogue Console */}
          <div className="lg:col-span-7 flex flex-col bg-white border-2 border-slate-200 rounded-xl shadow-xs overflow-hidden h-[600px]">
            {/* Live Audio Status Bar */}
            <div className="bg-[#002147] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-blue-900">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isListening
                      ? "bg-rose-500 animate-ping"
                      : isSpeaking
                      ? "bg-amber-400 animate-pulse"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="font-semibold">
                  {isListening
                    ? "सुन रहा हूँ... बोलिए (Listening to Beneficiary...)"
                    : isSpeaking
                    ? "सहायक बोल रहा है (Assistant Speaking...)"
                    : "संवाद के लिए तैयार (Ready for Speech)"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-mono">
                <span>Sarvam AI / Bhashini Pipeline</span>
              </div>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed border shadow-xs ${
                      m.sender === "user"
                        ? "bg-[#002147] text-white border-blue-900"
                        : "bg-white text-slate-800 border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10.5px] opacity-75 mb-1 pb-1 border-b border-current/15">
                      <span className="font-bold">
                        {m.sender === "user" ? "लाभार्थी (Beneficiary Applicant)" : "विकल्प AI (MoSJE Assistant)"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{m.timestamp}</span>
                        {m.sender === "assistant" && (
                          <button
                            type="button"
                            onClick={() => speakAloud(m.text, selectedLang)}
                            title="सवाल दोबारा सुनें"
                            className="p-0.5 hover:bg-black/10 rounded text-amber-800 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="font-sans font-medium">{m.text}</p>
                  </div>
                </div>
              ))}

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-emerald-800 italic animate-pulse bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <Radio className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>आपकी आवाज दर्ज हो रही है... "{userInput || "बोलिए..."}"</span>
                </div>
              )}
            </div>

            {/* Quick Answer Evaluation Presets (For fast evaluation without mic) */}
            <div className="bg-slate-100 border-t border-slate-200 p-2.5">
              <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>त्वरित नमूना उत्तर (Turn {currentTurn} Presets for Evaluation):</span>
                <span className="text-[10px] text-slate-500 font-mono">Tap to simulate live speech</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleResponsesForTurn.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSubmitTurn(sample)}
                    className="text-[11px] bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 px-2.5 py-1 rounded text-left transition-colors font-medium truncate max-w-full shadow-xs"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Voice Mic & Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              {/* Primary Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-rose-600 text-white shadow-md animate-pulse ring-4 ring-rose-200"
                    : "bg-[#15803d] hover:bg-[#166534] text-white shadow-sm ring-2 ring-emerald-400/30"
                }`}
                title={isListening ? "सुनना बंद करें (Stop Listening)" : "माइक से बोलें (Start Voice Input)"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitTurn()}
                placeholder={
                  isListening
                    ? "सुन रहा हूँ... बोले जा रहे शब्द यहाँ दिखेंगे"
                    : "माइक दबाकर बोलें या उत्तर यहाँ लिखें..."
                }
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />

              <button
                type="button"
                disabled={!userInput.trim() || isSubmitting}
                onClick={() => handleSubmitTurn()}
                className="p-2.5 rounded-lg bg-[#002147] hover:bg-blue-900 disabled:opacity-40 text-white transition-colors"
                title="उत्तर भेजें"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Transparent Beneficiary Profile State Inspector */}
          <div className="lg:col-span-5 flex flex-col bg-white border-2 border-slate-200 rounded-xl shadow-xs p-4 sm:p-5 h-[600px] overflow-hidden">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#002147] uppercase tracking-wide">
                  संरचित प्रोफाइल स्थिति (Live Profile State)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Turn-by-turn field confidence & RPL readiness tracking
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-full font-mono">
                  {Math.round((profile?.metadata.profile_completeness || 0) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Profile Fields List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {/* Field 1: Basic Info & Eligibility */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1.5 flex justify-between">
                  <span>१. आधार व मूल विवरण (Identity)</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    SC Verified
                  </span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    नाम: <strong className="text-slate-900">{profile?.basic_info.name.value || "—"}</strong>
                    {profile?.basic_info.name.confidence ? (
                      <span className="text-[10px] text-emerald-700 font-mono ml-1.5 font-bold">
                        ({Math.round(profile.basic_info.name.confidence * 100)}% conf)
                      </span>
                    ) : null}
                  </div>
                  <div>
                    स्थान: <strong className="text-slate-900">{profile?.basic_info.location.value || "—"}</strong>
                  </div>
                  <div>
                    श्रेणी:{" "}
                    <span className="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                      {profile?.basic_info.category.value || "SC (PM-AJAY Eligible)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 2: Education Level */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1.5 flex justify-between">
                  <span>२. शैक्षणिक योग्यता (Education)</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Conf: {Math.round((profile?.education.highest_level.confidence || 0) * 100)}%
                  </span>
                </div>
                <div>
                  {profile?.education.highest_level.value ? (
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase">
                      {profile.education.highest_level.value.replace("_", " ")}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">वॉयस उत्तर की प्रतीक्षा...</span>
                  )}
                </div>
              </div>

              {/* Field 3: Current Work & RPL Potential */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1.5 flex justify-between">
                  <span>३. वर्तमान कार्य व पूर्व अनुभव (Prior Skills)</span>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    RPL Eligible
                  </span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    कार्य: <strong className="text-slate-900">{profile?.current_livelihood.occupation.value || "—"}</strong>
                  </div>
                  <div>
                    निकाले गए हुनर:{" "}
                    {profile?.current_livelihood.skills && profile.current_livelihood.skills.length > 0 ? (
                      <span className="text-[#002147] font-semibold">
                        {profile.current_livelihood.skills.join(", ")}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">लंबित</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Field 4: Aspirations */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1.5">४. रुचि व रोजगार प्रकार (Aspirations)</div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    ट्रेड रुचि:{" "}
                    <strong className="text-slate-900">{profile?.aspirations.interest.value || "—"}</strong>
                  </div>
                  <div>
                    मॉडल:{" "}
                    {profile?.aspirations.employment_preference.value ? (
                      <span className="bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-semibold text-[11px]">
                        {profile.aspirations.employment_preference.value.replace("_", " ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>

              {/* Field 5: Mobility Constraints */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1.5">५. यात्रा सीमा (Mobility Constraint)</div>
                <div>
                  दूरी:{" "}
                  <strong className="text-rose-800 font-bold">
                    {profile?.constraints.mobility.value
                      ? profile.constraints.mobility.value.replace("_", " ")
                      : "—"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Bottom Proceed Action */}
            <div className="pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/pmajay/profile")}
                className="w-full text-center py-2.5 px-3 rounded-lg bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>प्रोफाइल सारांश व पारदर्शी स्कोरिंग पर जाएं</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Phone IVR Simulator Modal */}
      <IVRSimulatorModal isOpen={ivrModalOpen} onClose={() => setIvrModalOpen(false)} />
    </div>
  );
};
