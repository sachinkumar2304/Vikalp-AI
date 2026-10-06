import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, BeneficiaryProfileData } from "@/services/pmajayService";
import {
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Code,
  Award,
  FileText,
  MapPin,
  Clock,
  Printer,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";

export const PMAJAYProfileSummary: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BeneficiaryProfileData | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);

  useEffect(() => {
    const cached = localStorage.getItem("pmajay_active_profile");
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
        return;
      } catch {}
    }

    // Default sample for immediate rich demonstration
    const defaultSample = pmajayService.createDefaultProfile("sample-session-101", "hi-IN");
    defaultSample.basic_info.name.value = "Ramesh Kumar";
    defaultSample.basic_info.name.confidence = 0.94;
    defaultSample.basic_info.location.value = "Varanasi (Sewapuri Block)";
    defaultSample.basic_info.location.confidence = 0.92;
    defaultSample.education.highest_level.value = "10th_pass";
    defaultSample.education.highest_level.confidence = 0.90;
    defaultSample.current_livelihood.occupation.value = "Electrician Helper (Informal)";
    defaultSample.current_livelihood.occupation.confidence = 0.88;
    defaultSample.current_livelihood.skills = ["basic_wiring", "motor_repair_assist", "tools_handling"];
    defaultSample.aspirations.interest.value = "Solar Rooftop & Renewable Electricity";
    defaultSample.aspirations.interest.confidence = 0.95;
    defaultSample.aspirations.employment_preference.value = "self_employment";
    defaultSample.aspirations.employment_preference.confidence = 0.91;
    defaultSample.constraints.mobility.value = "within_block";
    defaultSample.constraints.mobility.confidence = 0.89;
    defaultSample.metadata.profile_completeness = 0.95;

    setProfile(defaultSample);
    localStorage.setItem("pmajay_active_profile", JSON.stringify(defaultSample));
  }, []);

  const handleRunRecommendationEngine = () => {
    navigate("/pmajay/recommendations");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator & Header */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              चरण ३ / ५ • Step 3 of 5
            </span>
            <span>•</span>
            <span>संरचित लाभार्थी प्रोफाइल सारांश (Beneficiary Profile Dossier)</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
                प्रमाणित नागरिक प्रोफाइल एवं पात्रता विवरण
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                योजना: PM-AJAY GIA घटक • वॉयस संवाद द्वारा निष्कर्षित संरचित डेटा एवं आत्मविश्वास स्कोर
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>आजीविका पासपोर्ट जारी करें</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showRawJson ? "Hide JSON State" : "Inspect Raw JSON"}</span>
              </button>

              <button
                type="button"
                onClick={handleRunRecommendationEngine}
                className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all"
              >
                <span>पारदर्शी स्कोरिंग इंजन चलाएं</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Raw JSON State Inspector Toggle */}
        {showRawJson && (
          <div className="mb-6 bg-slate-900 text-emerald-300 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto shadow-inner">
            <div className="flex justify-between items-center text-white pb-2 mb-2 border-b border-slate-700 font-sans">
              <span className="font-bold flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>beneficiary_profile.json (Turn-by-turn Auditable State)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Session ID: {profile.session_id}
              </span>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}

        {/* Structured Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Identity & Scheme Eligibility */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="font-bold text-sm text-[#002147]">
                  १. आधार पहचान एवं सामाजिक पात्रता (Identity & Category)
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                  GIA Verified
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">लाभार्थी का नाम:</span>
                  <strong className="text-slate-900 font-mono">{profile.basic_info.name.value || "—"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">जिला व ब्लॉक:</span>
                  <strong className="text-slate-900">{profile.basic_info.location.value || "—"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">लक्षित सामाजिक श्रेणी:</span>
                  <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {profile.basic_info.category.value || "Scheduled Caste (SC)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">संवाद भाषा:</span>
                  <span className="font-mono text-slate-800">{profile.language}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>पहचान स्थिति: आधार लिंक्ड</span>
              <span className="text-emerald-700 font-bold">100% सब्सिडी पात्र</span>
            </div>
          </div>

          {/* Card 2: Education Level & NSQF Prerequisite */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="font-bold text-sm text-[#002147]">
                  २. शैक्षणिक स्तर व पूर्व-अर्हता (Education & Fit)
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {Math.round((profile.education.highest_level.confidence || 0.9) * 100)}% Confidence
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">उच्चतम शैक्षणिक स्तर:</span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded uppercase font-mono text-[11px]">
                    {profile.education.highest_level.value?.replace("_", " ") || "10th Pass"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NSQF स्तर पात्रता:</span>
                  <strong className="text-slate-900">NSQF Level 3 & Level 4 कोर्सेस हेतु पात्र</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">डेटा निष्कर्षण स्रोत:</span>
                  <span className="italic text-slate-600">
                    {profile.education.highest_level.source || "voice_interview"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>पूर्व-अर्हता स्थिति:</span>
              <span className="text-emerald-700 font-bold">नियम सम्मत (Compliant)</span>
            </div>
          </div>

          {/* Card 3: Existing Skills & RPL Fast-Track Assessment */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="font-bold text-sm text-[#002147]">
                  ३. वर्तमान कार्य व RPL पूर्व कौशल (Prior Experience)
                </h3>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                  RPL Fast-Track
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">वर्तमान व्यवसाय / पारिवारिक कार्य:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {profile.current_livelihood.occupation.value || "Electrician Helper (Informal)"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">पहचाने गए पूर्व कौशल (Prior Skills):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile.current_livelihood.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        {s.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">RPL मूल्यांकन अवधि:</span>
              <span className="font-bold text-amber-800">४० घंटे प्रमाणन (Fast-Track)</span>
            </div>
          </div>

          {/* Card 4: Aspirations, Capital Goals & Mobility Boundary */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h3 className="font-bold text-sm text-[#002147]">
                  ४. आकांक्षाएं एवं मोबिलिटी सीमा (Constraints)
                </h3>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  Hard Filter
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">ट्रेड रुचि:</span>
                  <strong className="text-slate-900">
                    {profile.aspirations.interest.value || "Solar & Electricity"}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">रोजगार मॉडल:</span>
                  <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold text-[11px]">
                    {profile.aspirations.employment_preference.value?.replace("_", " ") || "Self Employment"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">यात्रा सीमा (Mobility Range):</span>
                  <span className="text-rose-900 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                    {profile.constraints.mobility.value?.replace("_", " ") || "Within Block Only"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">कठिन बाधा नियम:</span>
              <span className="text-rose-700 font-bold">ब्लॉक के बाहर के ट्रेड निरस्त होंगे</span>
            </div>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            <strong>मूल्यांकन हेतु तैयार:</strong> स्कोरिंग इंजन ६ पारदर्शी गणितीय पैमानों (रुचि २५%, दूरी २०%, पूर्व कौशल १५%, शिक्षा १५%, स्थानीय मांग १५%, मोबिलिटी १०%) के आधार पर गणना करेगा।
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRunRecommendationEngine}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-xs shadow-md transition-all"
            >
              <span>NSQF अनुशंसाएं व स्कोर देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Livelihood Passport Modal */}
      <LivelihoodPassportModal isOpen={passportOpen} onClose={() => setPassportOpen(false)} />
    </div>
  );
};
