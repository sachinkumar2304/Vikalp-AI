import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData } from "@/services/pmajayService";
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Bot,
  HelpCircle,
  Phone,
  Sparkles,
  Trash2,
} from "lucide-react";
import { IVRSimulatorModal } from "@/components/pmajay/IVRSimulatorModal";

interface TurnMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  turn: number;
  timestamp: string;
}

const SAMPLE_BENEFICIARY_RESPONSES: Record<number, string[]> = {
  0: [
    "मेरा नाम रामेश्वर कुमार है, मैं सेवापुरी ब्लॉक, वाराणसी का रहने वाला हूँ।",
    "मेरा नाम सुनीता देवी है, चिरईगांव, जिला वाराणसी।",
    "मेरा नाम अजय कुमार भारती है, मुगलसराय, चंदौली।",
  ],
  1: [
    "मैं कक्षा 8 तक पढ़ा हूँ, ज्यादा पढ़ाई नहीं कर पाया।",
    "मैंने 10वीं पास की है सरकारी स्कूल से।",
    "कक्षा 5 तक पढ़ी हूँ, हस्ताक्षर कर लेती हूँ।",
  ],
  2: [
    "मैं 2 साल से गांव में हाथ से सिलाई और कपड़ों की मरम्मत का काम करती हूँ।",
    "बिजली वायरिंग और पंखे की मरम्मत में सहायक के रूप में 3 साल काम किया है।",
    "खेत में दैनिक मजदूरी और कभी-कभी पाइपलाइन का काम करता हूँ।",
  ],
  3: [
    "मुझे सोलर बिजली में रुचि है पर बाबतपुर दूर है, मैं सिलाई भी 1.5 साल से जानती हूँ।",
    "मुझे सोलर रूफटॉप पैनल और बिजली का काम सीखना है जिससे अपनी दुकान खोल सकूँ।",
    "सिलाई और आधुनिक बुटीक का काम सीखना चाहती हूँ।",
  ],
  4: [
    "मैं अपना खुद का काम शुरू करना चाहता हूँ सरकारी सहायता से।",
    "अपना स्वयं का सिलाई केंद्र और बुटीक चलाना चाहती हूँ (स्वरोजगार)।",
    "मुझे किसी कंपनी या प्रोजेक्ट में निश्चित मासिक वेतन वाली नौकरी चाहिए।",
  ],
  5: [
    "बाबतपुर 35 किमी दूर है, मैं 5 किमी से ज्यादा दूर नहीं जा सकती।",
    "मैं ब्लॉक और तहसील तक जा सकता हूँ, लेकिन बाहर दूसरे राज्य नहीं जा सकता।",
    "गांव के भीतर ही काम कर सकती हूँ, बाहर जाना संभव नहीं है।",
  ],
};

const TURN_TITLES: Record<number, string> = {
  1: "नाम व निवास स्थान (Identity & Location)",
  2: "शिक्षा स्तर (Educational Qualification)",
  3: "पूर्व कार्य अनुभव (Work Experience & Prior Skills)",
  4: "कौशल रुचि (Trade & Sector Aspiration)",
  5: "रोजगार प्राथमिकता (Self-Employment or Wage Job)",
  6: "यात्रा व मोबिलिटी सीमा (Mobility & Distance Limits)",
};

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
        speakAloud(data.question_prompt, selectedLang);
      }
    };
    initSession();
  }, [selectedLang]);

  // Speech Synthesis
  const speakAloud = (text: string, langCode: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.92;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser Web Speech API setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("आपके ब्राउज़र में वाक् पहचान (Speech Recognition) उपलब्ध नहीं है। कृपया टाइप करें।");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setUserInput(transcript);
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

  // Submit Answer
  const handleSubmitTurn = async (overrideText?: string) => {
    const textToSend = (overrideText || userInput).trim();
    if (!textToSend || isSubmitting) return;

    setIsSubmitting(true);
    setUserInput("");

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: TurnMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      turn: currentTurn,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    const res = await pmajayService.submitTurn(sessionId, textToSend, currentTurn);

    if (res) {
      setProfile(res.updated_profile);

      if (res.is_complete) {
        localStorage.setItem("pmajay_current_profile", JSON.stringify(res.updated_profile));
        const finishMsg: TurnMessage = {
          id: "assistant-finish",
          sender: "assistant",
          text: "धन्यवाद! आपका साक्षात्कार पूर्ण हो चुका है। अब पारदर्शी एल्गोरिथ्म आपके लिए उपयुक्त NSQF कौशल और प्रशिक्षण केंद्र का मिलान कर रहा है...",
          turn: totalTurns,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, finishMsg]);
        speakAloud(finishMsg.text, selectedLang);

        setTimeout(() => {
          navigate("/pmajay/recommendations");
        }, 1800);
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col space-y-5">
        {/* Step Header Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                चरण 2 / 5 • Step 2 of 5
              </span>
              <span>•</span>
              <span>{TURN_TITLES[currentTurn] || "मौखिक संवाद"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
              आजीविका एवं कौशल साक्षात्कार (Voice Intake)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              अपनी मातृभाषा में बोलें — 6 आसान प्रश्नों में आपकी प्रोफाइल तैयार होगी।
            </p>
          </div>

          {/* Progress & Tools */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                if (sessionId) {
                  await pmajayService.eraseSession(sessionId);
                }
                localStorage.removeItem("pmajay_current_profile");
                navigate("/pmajay");
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="सत्र डेटा मिटाएं"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-700" />
              <span>सत्र मिटाएं (Erase Session)</span>
            </button>

            <button
              type="button"
              onClick={() => setIvrModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="कीपैड फोन से कॉल करने का सिम्युलेटर"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>साधारण फोन IVR</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-[#002147]" />
              <span>प्रश्न {currentTurn} / {totalTurns}</span>
              <div className="w-16 bg-slate-300 h-2 rounded-full overflow-hidden ml-1">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Humane Conversation Box */}
          <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden h-[580px]">
            {/* Live Audio Status Strip */}
            <div className="bg-[#002147] text-white px-4 py-2.5 flex items-center justify-between text-xs">
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
                <span className="font-semibold text-xs">
                  {isListening
                    ? "आपकी आवाज सुनी जा रही है... बोलिए"
                    : isSpeaking
                    ? "सहायक बोल रहा है..."
                    : "संवाद के लिए तैयार"}
                </span>
              </div>
              <span className="text-[11px] text-amber-300 font-mono">
                Sarvam AI / Bhashini
              </span>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      m.sender === "user"
                        ? "bg-[#002147] text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-75 mb-1 pb-1 border-b border-current/15">
                      <span className="font-bold">
                        {m.sender === "user" ? "लाभार्थी (आप)" : "पीएम-अजय सहायक"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span>{m.timestamp}</span>
                        {m.sender === "assistant" && (
                          <button
                            type="button"
                            onClick={() => speakAloud(m.text, selectedLang)}
                            title="दोबारा सुनें"
                            className="p-0.5 hover:bg-black/10 rounded transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-slate-900">{m.text}</p>
                  </div>
                </div>
              ))}

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-emerald-800 italic bg-emerald-50 p-3 rounded-xl border border-emerald-200 animate-pulse">
                  <Radio className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>आपकी आवाज दर्ज हो रही है: "{userInput || "बोलिए..."}"</span>
                </div>
              )}
            </div>

            {/* Conversational Presets / One-Tap Suggestion Chips */}
            <div className="bg-slate-100/80 border-t border-slate-200 p-3">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>त्वरित उत्तर विकल्प (Quick Tap):</span>
                <span className="text-[10px] text-slate-400">माइक न होने पर दबाएं</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleResponsesForTurn.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSubmitTurn(sample)}
                    className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg text-left transition-colors font-medium shadow-2xs truncate max-w-full"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Microphone Console */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3.5 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-rose-600 text-white shadow-md animate-pulse ring-4 ring-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-105"
                }`}
                title={isListening ? "सुनना बंद करें" : "माइक से बोलें"}
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
                    ? "सुन रहा हूँ... बोलिए..."
                    : "माइक दबाकर बोलें या उत्तर यहाँ लिखें..."
                }
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <button
                type="button"
                disabled={!userInput.trim() || isSubmitting}
                onClick={() => handleSubmitTurn()}
                className="p-3 rounded-xl bg-[#002147] hover:bg-blue-900 disabled:opacity-30 text-white transition-colors"
                title="उत्तर भेजें"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Clean Beneficiary Profile Summary Card */}
          <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xs p-5 h-[580px] overflow-hidden">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#002147]">
                  नागरिक प्रोफाइल सारांश (Live Profile)
                </h2>
                <p className="text-[11px] text-slate-500">
                  वॉयस संवाद से स्वतः दर्ज विवरण
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-mono">
                {Math.round((profile?.metadata.profile_completeness || 0) * 100)}% पूर्ण
              </span>
            </div>

            {/* Profile Fields List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {/* Field 1: Basic Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex justify-between">
                  <span>१. आधार व मूल विवरण</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    SC सत्यापित
                  </span>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div>नाम: <strong className="text-slate-900">{profile?.basic_info.name.value || "—"}</strong></div>
                  <div>स्थान: <strong className="text-slate-900">{profile?.basic_info.location.value || "—"}</strong></div>
                </div>
              </div>

              {/* Field 2: Education */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">२. शैक्षणिक स्तर</div>
                <div>
                  {profile?.education.highest_level.value ? (
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {profile.education.highest_level.value.replace("_", " ")}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">उत्तर की प्रतीक्षा...</span>
                  )}
                </div>
              </div>

              {/* Field 3: Prior Skills */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex justify-between">
                  <span>३. पूर्व कार्य अनुभव</span>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    RPL पात्र
                  </span>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div>कार्य: <strong className="text-slate-900">{profile?.current_livelihood.occupation.value || "—"}</strong></div>
                  <div>
                    हुनर:{" "}
                    {profile?.current_livelihood.skills && profile.current_livelihood.skills.length > 0 ? (
                      <span className="text-[#002147] font-semibold">
                        {profile.current_livelihood.skills.join(", ")}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">दर्ज हो रहा है...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Field 4: Aspirations */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">४. रुचि व रोजगार प्रकार</div>
                <div className="space-y-0.5 text-slate-600">
                  <div>ट्रेड रुचि: <strong className="text-slate-900">{profile?.aspirations.interest.value || "—"}</strong></div>
                </div>
              </div>

              {/* Field 5: Mobility */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">५. यात्रा सीमा (Mobility)</div>
                <div className="text-slate-700">
                  अधिकतम दूरी:{" "}
                  <strong className="text-emerald-800">
                    {profile?.constraints.mobility.value
                      ? profile.constraints.mobility.value.replace("_", " ")
                      : "—"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Bottom Proceed Action */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/pmajay/profile")}
                className="w-full py-2.5 px-3 rounded-xl bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>प्रोफाइल सारांश व स्कोरिंग देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <IVRSimulatorModal isOpen={ivrModalOpen} onClose={() => setIvrModalOpen(false)} />
    </div>
  );
};
