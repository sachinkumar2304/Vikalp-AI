import React from "react";
import { Printer, Download, X, ShieldCheck, CheckCircle2, Award, Landmark, MapPin, Phone, QrCode } from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";

interface PassportProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaryName?: string;
  district?: string;
  education?: string;
  matchedTrade?: string;
  qpCode?: string;
  nsqfLevel?: number | string;
  trainingCentre?: string;
  isRPL?: boolean;
}

export const LivelihoodPassportModal: React.FC<PassportProps> = ({
  isOpen,
  onClose,
  beneficiaryName = "Ramesh Kumar",
  district = "Varanasi (Sewapuri Block), Uttar Pradesh",
  education = "10th Pass",
  matchedTrade = "Solar PV Installer (Suryamitra)",
  qpCode = "ELE/Q1401",
  nsqfLevel = 4,
  trainingCentre = "PM Kaushal Kendra (PMKK) & ITI Karaundi Campus, Varanasi",
  isRPL = true,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const sanctionId = "VKL-UP-2026-8942";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-slate-900 border-2 border-slate-300 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Modal Controls (Hidden in print) */}
        <div className="bg-[#002147] text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm sm:text-base">
              PM-AJAY Livelihood Passport & Grant Sanction Dossier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट / Print Dossier</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Passport Document */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-serif print:p-4 print:text-black">
          {/* Official Document Border */}
          <div className="border-4 border-double border-[#002147] p-5 sm:p-7 rounded-xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 relative shadow-xs">
            {/* National Header */}
            <div className="text-center pb-4 border-b-2 border-[#002147] mb-5">
              <div className="flex justify-center mb-1">
                <EmblemOfIndia size={48} variant="navy" />
              </div>
              <div className="font-sans font-bold text-xs uppercase tracking-widest text-[#002147]">
                भारत सरकार • GOVERNMENT OF INDIA
              </div>
              <div className="font-sans text-sm font-extrabold text-slate-900 mt-0.5">
                सामाजिक न्याय और अधिकारिता मंत्रालय
              </div>
              <div className="font-sans text-[11px] font-semibold text-slate-600">
                MINISTRY OF SOCIAL JUSTICE AND EMPOWERMENT
              </div>
              <div className="font-sans text-xs font-bold text-[#b45309] mt-1 uppercase tracking-wide">
                प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) • GIA घटक
              </div>
              <div className="mt-2 inline-block bg-[#002147] text-white font-sans text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                आधिकारिक आजीविका पासपोर्ट एवं कौशल अनुदान संस्वीकृति पत्रक
              </div>
            </div>

            {/* Verification Watermark & ID Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 font-sans text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-lg mb-5">
              <div>
                <span className="text-slate-500">लाभार्थी संस्वीकृति क्रमांक / Sanction ID: </span>
                <strong className="text-[#002147] font-mono text-sm">{sanctionId}</strong>
              </div>
              <div>
                <span className="text-slate-500">जारी दिनांक / Date: </span>
                <strong className="text-slate-800">{dateStr}</strong>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PFMS / MoSJE सत्यापित</span>
              </div>
            </div>

            {/* Section 1: Beneficiary Profile Grid */}
            <div className="font-sans mb-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002147] pb-1 border-b border-slate-300 mb-3 flex items-center justify-between">
                <span>१. प्रमाणित लाभार्थी विवरण (Beneficiary Demographics)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  GIA Sub-Component Eligible
                </span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500">आवेदक का नाम (Name)</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{beneficiaryName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">सामाजिक श्रेणी (Category)</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 text-blue-900">
                    Scheduled Caste (SC)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">शैक्षणिक योग्यता (Education)</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{education}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">पता / जिला (District & Block)</div>
                  <div className="font-bold text-slate-900 mt-0.5">{district}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">पहचान प्रमाणीकरण (Aadhaar Token)</div>
                  <div className="font-mono text-slate-700 font-bold mt-0.5">XXXX-XXXX-4819</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">संवाद माध्यम (Intake Channel)</div>
                  <div className="font-bold text-slate-900 mt-0.5 text-emerald-700">
                    Voice Assistant (Dialect Aware)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Matched NSQF Course & Pathway */}
            <div className="font-sans mb-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002147] pb-1 border-b border-slate-300 mb-3">
                २. संस्तुत NSQF कौशल योग्यता (National Qualifications Register)
              </h4>
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-amber-200/80 mb-2.5">
                  <div>
                    <span className="bg-[#002147] text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      QP Code: {qpCode}
                    </span>
                    <span className="ml-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      NSQF Level {nsqfLevel}
                    </span>
                    {isRPL && (
                      <span className="ml-2 bg-[#b45309] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        RPL Fast-Track Assessment (40 hrs)
                      </span>
                    )}
                    <h3 className="font-bold text-base text-slate-900 mt-1">
                      {matchedTrade}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">अपेक्षित मासिक आय (Est. Income)</div>
                    <div className="font-bold text-emerald-700 text-sm">₹15,000 – ₹22,000 / माह</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">प्रशिक्षण केंद्र: </span>
                    <span>{trainingCentre}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">प्रमाणन निकाय: </span>
                    <span>NCVET / Sector Skill Council (SSC)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Financial Entitlements under PM-AJAY GIA */}
            <div className="font-sans mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002147] pb-1 border-b border-slate-300 mb-3">
                ३. पीएम-अजय वित्तीय अनुदान एवं टूलकिट सहायता (Sanctioned Grant Checklist)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white border-2 border-emerald-600 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">टूलकिट पूंजी अनुदान</div>
                  <div className="text-xl font-extrabold text-emerald-700 my-0.5">₹50,000/-</div>
                  <div className="text-[10px] text-emerald-800 font-semibold">100% निःशुल्क सरकारी ग्रांट</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">कौशल प्रशिक्षण शुल्क</div>
                  <div className="text-xl font-extrabold text-[#002147] my-0.5">₹0 (पूर्णतः मुफ्त)</div>
                  <div className="text-[10px] text-slate-600">केंद्र सरकार द्वारा शत-प्रतिशत वित्तपोषित</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">ऋण सहायता लिंकेज</div>
                  <div className="text-sm font-extrabold text-amber-800 my-1">Mudra / NSFDC Linkage</div>
                  <div className="text-[10px] text-slate-600">रियायती ब्याज दर पर सूक्ष्म उद्यम ऋण</div>
                </div>
              </div>
            </div>

            {/* Official Authentication & QR Strip */}
            <div className="font-sans pt-4 border-t-2 border-[#002147] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 text-white rounded p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-14 h-14" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-500">QR VERIFICATION SEAL</div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Scan to verify on pmajay.dosje.gov.in
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Digital Hash: 8f9b2a1c0d4e5f67a8b9
                  </div>
                </div>
              </div>

              {/* Official Seal / Signature Stamp */}
              <div className="text-center sm:text-right">
                <div className="inline-block border-2 border-[#b45309] text-[#b45309] rounded-lg p-2 font-serif text-[10px] font-bold leading-tight uppercase tracking-wider text-center">
                  <div>जिला समाज कल्याण अधिकारी</div>
                  <div>DISTRICT WELFARE OFFICER</div>
                  <div className="text-[8px] text-emerald-800 mt-0.5">ELECTRONICALLY VALIDATED</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Hidden in print) */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-sans print:hidden">
          <span>
            प्रमाणपत्र ले जाकर सीधे नजदीकी PMKK या जिला समाज कल्याण कार्यालय में प्रस्तुत करें।
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
