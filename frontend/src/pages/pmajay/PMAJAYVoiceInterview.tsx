import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData } from "@/services/pmajayService";
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Clock,
  Radio,
  FileText
} from "lucide-react";

interface TurnMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  turn: number;
  timestamp: string;
}

const SAMPLE_BENEFICIARY_RESPONSES = [
  // Turn 1
  [
    "Mera naam Ramesh Kumar hai, aur main Varanasi ke Sewapuri gaon me rehta hoon.",
    "Sunita Devi, Chandauli zila gaon Sakaldiha.",
    "My name is Amit Paswan from Babatpur cluster."
  ],
  // Turn 2
  [
    "Maine 10th pass kiya hai gaon ke school se.",
    "Aathvi tak padhai ki hai (8th pass).",
    "School nahi gaya hoon, thoda bahut naam likh leta hoon (Below 8th)."
  ],
  // Turn 3
  [
    "Abhi main gaon me bijli ke taar aur motor repair me helper ka kaam karta hoon.",
    "Ghar par kapde silne ka kaam karti hoon haath se.",
    "Khet me mazdoori karta hoon dihadi par."
  ],
  // Turn 4
  [
    "Mujhe solar panel aur nayi bijli wiring ka kaam sikhna hai jisse gaon me kaam mile.",
    "Silai aur boutique ka naya design sikhna chahti hoon.",
    "Gaadi chalana aur commercial driving sikhna chahta hoon."
  ],
  // Turn 5
  [
    "Main apna khud ka solar repair center ya dukan shuru karna chahta hoon.",
    "Apna khud ka boutique ya silai kendra chalana hai (Self-employment).",
    "Mujhe kisi company me pakki naukri chahiye har mahine salary wali (Wage employment)."
  ],
  // Turn 6
  [
    "Main block aur tehsil tak ja sakta hoon, lekin gaon se bahar dusre rajya nahi ja sakta.",
    "Sirf gaon ke andar hi kaam kar sakti hoon, bahar travel nahi ho payega.",
    "Main shahar ya dusre zila me bhi ja sakta hoon kaam ke liye."
  ]
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
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser Speech Recognition Fallback / Sarvam integration
  const toggleListening = () => {
    // If assistant is speaking, stop it so beneficiary can talk
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input via microphone is supported in Chrome, Edge, and Android browsers. You can also type or click the quick voice responses below!");
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

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");

    // 2. Call backend interview engine
    const res = await pmajayService.processTurn(sessionId, currentTurn, textToSend);

    if (res && res.profile) {
      setProfile(res.profile);

      // Save to localStorage for profile & recommendation views
      localStorage.setItem("pmajay_active_profile", JSON.stringify(res.profile));

      if (res.is_completed) {
        // Concluding turn
        const finalMsg: TurnMessage = {
          id: "assistant-" + Date.now(),
          sender: "assistant",
          text: res.next_prompt,
          turn: currentTurn,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, nextMsg]);
        speakAloud(res.next_prompt, selectedLang);
      }
    } else {
      // Local client fallback
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
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7E4DE] mb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider">
              <span>चरण 2 / Step 2</span>
              <span>•</span>
              <span>मौखिक संवाद / Voice Interview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#142A20]">
              आजीविका एवं कौशल साक्षात्कार (Livelihood Mapping)
            </h1>
          </div>

          {/* Turn progress pill & Direct Voice Action */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Listen / Replay Assistant Question */}
            <button
              type="button"
              onClick={() => {
                const lastQuestion = messages.filter((m) => m.sender === "assistant").slice(-1)[0]?.text;
                if (lastQuestion) speakAloud(lastQuestion, selectedLang);
              }}
              className="px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-[#1b4332] border border-[#CCDCD4] shadow-sm transition-all"
              title="सहायक का सवाल सुनें"
            >
              <Volume2 className="w-4 h-4 text-[#2D6A4F]" />
              <span>सवाल सुनें (Play Audio)</span>
            </button>

            {/* Beneficiary Speak Mic */}
            <button
              type="button"
              onClick={toggleListening}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                isListening
                  ? "bg-red-600 text-white animate-pulse ring-4 ring-red-300"
                  : "bg-[#138808] hover:bg-[#0f6b06] text-white ring-2 ring-emerald-400/40"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-bounce" />
                  <span>सुन रहा हूँ... बोलिए (Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>माइक दबाकर उत्तर दें (Speak)</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center space-x-3 bg-white border border-[#CDDDD5] px-3.5 py-1.5 rounded-lg shadow-sm">
              <div className="flex items-center space-x-1.5 text-xs text-[#325243]">
                <Clock className="w-3.5 h-3.5 text-[#417B60]" />
                <span>Turn {currentTurn} of {totalTurns}</span>
              </div>
              <div className="w-20 bg-[#E2ECE7] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#31634D] h-full transition-all duration-300"
                  style={{ width: `${(currentTurn / totalTurns) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Left Chat & Voice, Right Live Structured Profile State */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Voice Conversation */}
          <div className="lg:col-span-7 flex flex-col bg-white border border-[#D5E2DB] rounded-xl shadow-sm overflow-hidden h-[580px]">
            {/* Live Audio Status Bar */}
            <div className="bg-[#183327] text-white px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isListening
                      ? "bg-[#FF5555] animate-ping"
                      : isSpeaking
                      ? "bg-[#FBBF24] animate-pulse"
                      : "bg-[#52D1A1]"
                  }`}
                ></span>
                <span className="font-medium">
                  {isListening
                    ? "सुन रहे हैं (Listening to beneficiary...)"
                    : isSpeaking
                    ? "बोल रहे हैं (Assistant speaking...)"
                    : "सक्रिय (Ready for speech)"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#A6CDBA]">
                <span>Sarvam / Bhashini Audio Pipeline</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAFBFB]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#254A3A] text-white shadow-sm"
                        : "bg-[#EBF2EE] text-[#162D22] border border-[#D3E1D9]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-75 mb-1">
                      <span>{m.sender === "user" ? "Beneficiary (आवेदक)" : "PM-AJAY Kaushal Mitra"}</span>
                      <div className="flex items-center gap-2">
                        <span>{m.timestamp}</span>
                        {m.sender === "assistant" && (
                          <button
                            type="button"
                            onClick={() => speakAloud(m.text, selectedLang)}
                            title="सवाल दोबारा सुनें"
                            className="p-1 hover:bg-black/10 rounded text-emerald-800 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
              {isListening && (
                <div className="flex items-center space-x-2 text-xs text-[#2A5743] italic animate-pulse">
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  <span>Beneficiary is speaking... "{userInput}"</span>
                </div>
              )}
            </div>

            {/* Quick Answer Demo Buttons (For fast judge walkthroughs) */}
            <div className="bg-[#F0F5F2] border-t border-[#D5E2DB] p-2.5">
              <div className="text-[11px] font-semibold text-[#486B5A] mb-1.5 flex items-center justify-between">
                <span>त्वरित नमूना उत्तर (Quick Voice Presets for Turn {currentTurn}):</span>
                <span className="text-[10px] text-[#698578]">Tap to simulate live speech</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleResponsesForTurn.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSubmitTurn(sample)}
                    className="text-xs bg-white hover:bg-[#E2EEE7] text-[#224536] border border-[#CCDCD4] px-2.5 py-1 rounded text-left transition-colors truncate max-w-full"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Voice & Input Bar */}
            <div className="p-3 bg-white border-t border-[#D5E2DB] flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-[#D93838] text-white shadow-md animate-pulse ring-4 ring-red-200"
                    : "bg-[#2B5643] hover:bg-[#366852] text-white shadow-sm"
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitTurn()}
                placeholder={
                  isListening ? "Listening... (बोले जा रहे शब्द यहाँ दिखेंगे)" : "Speak or type your answer..."
                }
                className="flex-1 bg-[#F5F8F6] border border-[#CCDCD4] rounded-lg px-3 py-2 text-sm text-[#193226] focus:outline-none focus:ring-1 focus:ring-[#31634D]"
              />

              <button
                type="button"
                disabled={!userInput.trim() || isSubmitting}
                onClick={() => handleSubmitTurn()}
                className="p-2.5 rounded-lg bg-[#274B3C] hover:bg-[#34624F] disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Building Structured Profile (Transparent Field Tracking) */}
          <div className="lg:col-span-5 flex flex-col bg-white border border-[#D5E2DB] rounded-xl shadow-sm p-4 h-[580px] overflow-hidden">
            <div className="pb-3 border-b border-[#E1ECE6] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#142A20]">Beneficiary Profile State</h2>
                <p className="text-xs text-[#526D61]">Turn-by-turn structured JSON with confidence</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#254E3C] bg-[#E2EEE7] px-2 py-0.5 rounded">
                  {Math.round((profile?.metadata.profile_completeness || 0) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Profile Fields List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {/* Basic Info */}
              <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E3ECE7]">
                <div className="font-semibold text-[#1C362A] mb-1.5 flex justify-between">
                  <span>1. Basic Information</span>
                  <span className="text-[10px] text-[#557767]">Source: {profile?.basic_info.name.source}</span>
                </div>
                <div className="space-y-1 text-[#3B574A]">
                  <div>
                    Name:{" "}
                    <strong className="text-[#13281E]">
                      {profile?.basic_info.name.value || "—"}
                    </strong>{" "}
                    {profile?.basic_info.name.confidence ? (
                      <span className="text-[10px] text-[#417B60]">
                        ({Math.round(profile.basic_info.name.confidence * 100)}% conf)
                      </span>
                    ) : null}
                  </div>
                  <div>
                    Location:{" "}
                    <strong className="text-[#13281E]">
                      {profile?.basic_info.location.value || "—"}
                    </strong>
                  </div>
                  <div>
                    Category:{" "}
                    <span className="bg-[#E4ECE7] px-1.5 py-0.5 rounded font-mono text-[11px] text-[#1B3A2C]">
                      {profile?.basic_info.category.value || "SC (PM-AJAY Eligible)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E3ECE7]">
                <div className="font-semibold text-[#1C362A] mb-1.5 flex justify-between">
                  <span>2. Education Level</span>
                  <span className="text-[10px] text-[#557767]">
                    Conf: {Math.round((profile?.education.highest_level.confidence || 0) * 100)}%
                  </span>
                </div>
                <div className="text-[#1B362A] font-medium">
                  {profile?.education.highest_level.value ? (
                    <span className="bg-[#E2EEE7] text-[#224536] px-2 py-0.5 rounded text-xs font-mono uppercase">
                      {profile.education.highest_level.value.replace("_", " ")}
                    </span>
                  ) : (
                    <span className="text-[#87A195] italic">Awaiting voice response...</span>
                  )}
                </div>
              </div>

              {/* Current Livelihood & Skills */}
              <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E3ECE7]">
                <div className="font-semibold text-[#1C362A] mb-1.5">3. Current Livelihood & Skills</div>
                <div className="space-y-1 text-[#3B574A]">
                  <div>
                    Occupation:{" "}
                    <strong className="text-[#13281E]">
                      {profile?.current_livelihood.occupation.value || "—"}
                    </strong>
                  </div>
                  <div>
                    Extracted Skills:{" "}
                    {profile?.current_livelihood.skills && profile.current_livelihood.skills.length > 0 ? (
                      <span className="text-[#254E3C] font-mono">
                        {profile.current_livelihood.skills.join(", ")}
                      </span>
                    ) : (
                      <span className="text-[#87A195] italic">None mapped yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aspirations */}
              <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E3ECE7]">
                <div className="font-semibold text-[#1C362A] mb-1.5">4. Aspirations & Preference</div>
                <div className="space-y-1 text-[#3B574A]">
                  <div>
                    Interest:{" "}
                    <strong className="text-[#13281E]">
                      {profile?.aspirations.interest.value || "—"}
                    </strong>
                  </div>
                  <div>
                    Employment Mode:{" "}
                    {profile?.aspirations.employment_preference.value ? (
                      <span className="bg-[#D9E9E0] text-[#1B3E2F] px-1.5 py-0.5 rounded font-medium">
                        {profile.aspirations.employment_preference.value.replace("_", " ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="bg-[#F8FAF9] p-3 rounded-lg border border-[#E3ECE7]">
                <div className="font-semibold text-[#1C362A] mb-1.5">5. Mobility Constraints</div>
                <div className="text-[#3B574A]">
                  Mobility Range:{" "}
                  <strong className="text-[#13281E]">
                    {profile?.constraints.mobility.value || "—"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Direct Link to Profile Summary */}
            <div className="pt-3 border-t border-[#E1ECE6]">
              <button
                type="button"
                onClick={() => navigate("/pmajay/profile")}
                className="w-full text-center py-2 px-3 rounded-lg bg-[#274B3C] hover:bg-[#34624F] text-white font-medium text-xs shadow-sm transition-colors"
              >
                Proceed to Profile Summary & Scoring
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
