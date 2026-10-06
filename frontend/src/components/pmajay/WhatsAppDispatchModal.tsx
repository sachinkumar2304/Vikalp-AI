import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare, Phone, X, ShieldCheck, Copy, Check } from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";

interface WhatsAppProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaryName?: string;
  mobileNumber?: string;
  matchedTrade?: string;
  centreName?: string;
  sanctionId?: string;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppProps> = ({
  isOpen,
  onClose,
  beneficiaryName = "Ramesh Kumar",
  mobileNumber = "+91 98765 43210",
  matchedTrade = "Solar PV Installer (ELE/Q1401)",
  centreName = "PMKK ITI Karaundi Campus, Varanasi",
  sanctionId = "VKL-UP-2026-8942",
}) => {
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const messageText = `[भारत सरकार] सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)
योजना: PM-AJAY GIA आजीविका एवं कौशल घटक

नमस्ते ${beneficiaryName} जी,
आपकी वॉयस प्रोफाइल के आधार पर आपको निम्नलिखित योजना से जोड़ा गया है:

- संस्वीकृति क्रमांक: ${sanctionId}
- चयनित ट्रेड: ${matchedTrade}
- आवंटित केंद्र: ${centreName}
- टूलकिट अनुदान: ₹50,000/- (100% निःशुल्क सरकारी सहायता)
- हेल्पलाइन: 1800-11-2026 (टोल-फ्री)

कृपया यह संदेश अपने नजदीकी कौशल केंद्र या जिला समाज कल्याण अधिकारी को दिखाएं।
प्रमाणीकरण लिंक: https://pmajay.dosje.gov.in/verify/${sanctionId}`;

  const handleSend = () => {
    setIsDispatched(true);
    setTimeout(() => {
      // simulated dispatch
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 border-2 border-slate-300 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#002147] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <EmblemOfIndia size={30} variant="gold" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                नागरिक सूचना प्रेषण (Multi-Channel Dispatch)
              </h3>
              <p className="text-[10px] text-amber-300">
                Government SMS & WhatsApp Gateway Simulator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Toggle */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveChannel("whatsapp");
                setIsDispatched(false);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                activeChannel === "whatsapp"
                  ? "bg-[#128C7E] text-white border-[#075E54] shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp वॉयस/टेक्स्ट अलर्ट</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveChannel("sms");
                setIsDispatched(false);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                activeChannel === "sms"
                  ? "bg-[#002147] text-white border-blue-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>NIC सरकारी SMS गेटवे</span>
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>प्राप्तकर्ता मोबाइल: <strong className="text-slate-900 font-mono">{mobileNumber}</strong></span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Aadhaar Linked SIM
            </span>
          </div>

          {/* Realistic WhatsApp / SMS Bubble */}
          <div
            className={`rounded-2xl p-4 text-xs font-sans border shadow-xs leading-relaxed ${
              activeChannel === "whatsapp"
                ? "bg-[#DCF8C6]/50 border-[#b2e29f] text-slate-900"
                : "bg-blue-50/60 border-blue-200 text-slate-900 font-mono text-[11px]"
            }`}
          >
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-300/60 pb-1">
              {activeChannel === "whatsapp"
                ? "WhatsApp Verified Business Account • PM-AJAY MoSJE"
                : "SMS from: GOV-PMAJAY (NIC SMS Service)"}
            </div>

            <pre className="font-sans whitespace-pre-wrap text-slate-800 text-[11.5px] leading-relaxed">
              {messageText}
            </pre>

            <div className="text-right text-[10px] text-slate-500 mt-2 font-mono">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓ Delivered
            </div>
          </div>

          {isDispatched && (
            <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong>प्रेषित किया गया! (Successfully Dispatched):</strong> सूचना लाभार्थी के मोबाइल नंबर पर भेज दी गई है।
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "कॉपी हो गया" : "संदेश कॉपी करें"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 text-xs font-semibold"
            >
              रद्द करें
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isDispatched}
              className={`px-4 py-2 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                activeChannel === "whatsapp"
                  ? "bg-[#128C7E] hover:bg-[#075E54]"
                  : "bg-[#002147] hover:bg-[#003366]"
              } disabled:opacity-60`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatched ? "प्रेषित (Sent)" : "संदेश भेजें (Dispatch Alert)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
