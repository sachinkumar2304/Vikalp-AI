import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { useBeneficiary } from "@/contexts/BeneficiaryContext";
import {
  MapPin,
  Briefcase,
  ShieldCheck,
  Phone,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  Clock,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { WhatsAppDispatchModal } from "@/components/pmajay/WhatsAppDispatchModal";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";

interface Opportunity {
  id: string;
  title: string;
  sector: string;
  type: "wage_employment" | "self_employment" | "wage_and_self" | "shg";
  employer: string;
  location: string;
  distanceKm: number;
  earnings: string;
  openings: string | number;
  schemeAssistance: string;
  contact: string;
  matchedTrade: string;
  qpCode: string;
}

const SAMPLE_LOCAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-01",
    title: "Solar Rooftop Technician & AMC Assistant",
    sector: "Green Jobs / Renewable Energy",
    type: "wage_employment",
    employer: "Surya Urja Vikas Samiti & Local EPC Contractors",
    location: "Babatpur Block, Varanasi",
    distanceKm: 7.5,
    earnings: "मानक जिला आजीविका दर",
    openings: 12,
    schemeAssistance: "PM Surya Ghar Muft Bijli Yojana & PM-AJAY Livelihood Convergence",
    contact: "District Skill Nodal Officer, ITI Karaundi (0542-2578901)",
    matchedTrade: "Solar PV Installer",
    qpCode: "ELE/Q1401",
  },
  {
    id: "opp-02",
    title: "Micro Boutique & Village Stitching Enterprise",
    type: "self_employment",
    sector: "Apparel & Textiles",
    employer: "Self-Employed / PM-AJAY Cluster Support",
    location: "Arajiline Block / Village Cluster",
    distanceKm: 1.2,
    earnings: "स्थानीय बाजार आजीविका दर",
    openings: "स्वरोजगार क्लस्टर",
    schemeAssistance: "PM-AJAY GIA Livelihood Component (स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है)",
    contact: "Block Development Officer (BDO), Social Welfare Cell",
    matchedTrade: "Self Employed Tailor & Boutique",
    qpCode: "AMH/Q1947",
  },
  {
    id: "opp-03",
    title: "Home Appliance Repair & Maintenance Hub",
    sector: "Electronics",
    type: "wage_and_self",
    employer: "Kashi Gramin Seva Kendra & Local Retail Networks",
    location: "Sewapuri Model Block",
    distanceKm: 5.0,
    earnings: "मानक जिला आजीविका दर",
    openings: 8,
    schemeAssistance: "PM-AJAY Skill Upgradation Toolkit Scheme (स्थानीय डेस्क से संपर्क करें)",
    contact: "Sewapuri Skill Facilitation Cell (0542-2891234)",
    matchedTrade: "Field Technician Home Appliances",
    qpCode: "ELE/Q3102",
  },
  {
    id: "opp-04",
    title: "Panchayat Har Ghar Jal Pipeline Maintenance Operator",
    sector: "Water Supply & Plumbing",
    type: "wage_employment",
    employer: "Jal Jeevan Mission Village Water & Sanitation Committee (VWSC)",
    location: "Gram Panchayat Level (Direct local posting)",
    distanceKm: 2.0,
    earnings: "मानक ग्राम पंचायत आजीविका दर",
    openings: 15,
    schemeAssistance: "Convergence with Jal Jeevan Mission Maintenance Fund",
    contact: "Gram Pradhan / Panchayat Secretary",
    matchedTrade: "General Plumber",
    qpCode: "PLU/Q0101",
  },
  {
    id: "opp-05",
    title: "SC Women SHG Spices & Dal Processing Cluster",
    sector: "Food Processing",
    type: "shg",
    employer: "Prerna Samuh / PM-AJAY GIA Producer Cluster",
    location: "Chiraigaon Block",
    distanceKm: 4.5,
    earnings: "सामूहिक लाभांश आधारित",
    openings: 20,
    schemeAssistance: "PM-AJAY Cluster Infrastructure & PMFME Convergence",
    contact: "NRLM Block Mission Manager",
    matchedTrade: "Food Processing Technician",
    qpCode: "FIC/Q0103",
  },
  {
    id: "opp-06",
    title: "CSC Digital Village Citizen Service Operator",
    sector: "IT-ITeS",
    type: "self_employment",
    employer: "CSC e-Governance Services India Ltd",
    location: "Rohaniya Market Hub",
    distanceKm: 4.0,
    earnings: "सेवा शुल्क आधारित",
    openings: 4,
    schemeAssistance: "PM-AJAY Entrepreneurship Development Program & Hardware Facilitation",
    contact: "CSC District VLE Manager",
    matchedTrade: "Domestic Data Entry Operator",
    qpCode: "SSC/Q2212",
  },
];

export const PMAJAYOpportunities: React.FC = () => {
  const { profile, primaryMatch } = useBeneficiary();
  const [filterType, setFilterType] = useState<string>("all");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);

  const handleApply = (opp: Opportunity) => {
    if (!appliedIds.includes(opp.id)) {
      setAppliedIds([...appliedIds, opp.id]);
    }
    setSelectedOpp(opp);
    setDispatchModalOpen(true);
  };

  const filteredOpportunities = SAMPLE_LOCAL_OPPORTUNITIES.filter((opp) => {
    if (filterType === "all") return true;
    if (filterType === "self") return opp.type === "self_employment" || opp.type === "wage_and_self";
    if (filterType === "wage") return opp.type === "wage_employment" || opp.type === "wage_and_self";
    if (filterType === "shg") return opp.type === "shg";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator & Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              चरण ५ / ५ • Step 5 of 5
            </span>
            <span>•</span>
            <span>स्थानीय रोजगार, स्व-रोजगार व टूलकिट अनुदान लिंकेज</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
                वाराणसी एवं चंदौली क्लस्टर स्थानीय आजीविका रिक्तियां
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                प्रशिक्षणोपरांत PM-AJAY GIA टूलकिट अनुदान एवं स्थानीय विकास पहलों से सीधा समन्वय
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>आजीविका पासपोर्ट देखें</span>
              </button>

              <Link
                to="/pmajay/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#002147] hover:bg-blue-900 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>प्रशासनिक डैशबोर्ड</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════ APPLICATION TRACKING TIMELINE (COMPETITOR UPGRADE: NEXUS/LIVPATH BENCHMARK) ════ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-6">
          <h3 className="font-bold text-xs sm:text-sm text-[#002147] uppercase tracking-wide mb-3 flex items-center justify-between">
            <span>आवेदन एवं संस्वीकृति स्थिति ट्रैक (Benefit Dispatch Lifecycle)</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Direct Benefit Tracking
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                १
              </div>
              <div>
                <div className="font-bold text-emerald-900">वॉयस असेसमेंट पूर्ण</div>
                <div className="text-[10.5px] text-emerald-700 mt-0.5">प्रोफाइल स्कोर 93.5% सत्यापित</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                २
              </div>
              <div>
                <div className="font-bold text-amber-900">DSWO नोडल सत्यापन</div>
                <div className="text-[10.5px] text-amber-700 mt-0.5">जाति व निवास प्रमाणीकरण सक्रिय</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                ३
              </div>
              <div>
                <div className="font-bold text-slate-700">कौशल केंद्र आवंटन</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">ITI करौंदी PMKK बैच लिंकेज</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                ४
              </div>
              <div>
                <div className="font-bold text-slate-700">टूलकिट उपकरण सहयोग</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">संस्वीकृति पत्रक (डेस्क से संपर्क करें)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-300 p-2.5 rounded-xl mb-6 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <Filter className="w-3.5 h-3.5 text-[#002147]" />
            <span>अवसर श्रेणी:</span>
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterType === "all" ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              सभी अवसर ({SAMPLE_LOCAL_OPPORTUNITIES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("self")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterType === "self" ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              स्वरोजगार व टूलकिट अनुदान
            </button>
            <button
              type="button"
              onClick={() => setFilterType("wage")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterType === "wage" ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              स्थानीय वेतन रोजगार
            </button>
            <button
              type="button"
              onClick={() => setFilterType("shg")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterType === "shg" ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              महिला SHG क्लस्टर
            </button>
          </div>
        </div>

        {/* Opportunities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {filteredOpportunities.map((opp) => {
            const isApplied = appliedIds.includes(opp.id);
            return (
              <div
                key={opp.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded uppercase">
                          {opp.sector}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#002147] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          {opp.qpCode}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{opp.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">
                      {opp.distanceKm} km दूर
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 mb-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{opp.employer}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{opp.earnings}</span>
                    </div>
                  </div>

                  {/* Scheme grant assistance badge */}
                  <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 mb-4">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-[#b45309] mb-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>PM-AJAY वित्तीय एवं टूलकिट सहायता:</span>
                    </div>
                    <p className="leading-snug">{opp.schemeAssistance}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-500">
                    <span>संपर्क: {opp.contact}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(opp)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      isApplied
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-[#002147] hover:bg-blue-900 text-white"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>संलग्न / SMS प्रेषित</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                        <span>नोडल अधिकारी से जुड़ें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            <strong>नागरिक प्रक्रिया पूर्ण:</strong> मंत्रालय की प्रशासनिक निगरानी व्यवस्था, ऑडिट लॉग एवं रिफ्यूजल दरों की समीक्षा हेतु एडमिन डैशबोर्ड देखें।
          </div>
          <Link
            to="/pmajay/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-xs shadow-md transition-all"
          >
            <span>मंत्रालय प्रशासनिक डैशबोर्ड खोलें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* WhatsApp / SMS Dispatch Simulator Modal */}
      <WhatsAppDispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        beneficiaryName={profile?.basic_info?.name?.value || "Ramesh Kumar"}
        matchedTrade={selectedOpp?.matchedTrade || primaryMatch?.course_name || "Solar PV Installer (ELE/Q1401)"}
        centreName={selectedOpp?.employer || primaryMatch?.training_centre_name || "PMKK ITI Karaundi Campus, Varanasi"}
      />

      {/* Livelihood Passport Modal */}
      <LivelihoodPassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
        beneficiaryName={profile?.basic_info?.name?.value || "Ramesh Kumar"}
        district={`${profile?.basic_info?.location?.value || "Varanasi"}, Uttar Pradesh`}
        education={profile?.education?.highest_level?.value?.replace("_", " ") || "10th Pass"}
        matchedTrade={primaryMatch?.course_name || selectedOpp?.matchedTrade || "Solar PV Installer (Suryamitra)"}
        qpCode={primaryMatch?.qp_code || selectedOpp?.qpCode || "ELE/Q1401"}
        nsqfLevel={primaryMatch?.nsqf_level || 4}
        trainingCentre={primaryMatch?.training_centre_name || selectedOpp?.employer || "PM Kaushal Kendra (PMKK) & ITI Karaundi Campus, Varanasi"}
        isRPL={primaryMatch?.is_rpl ?? ((profile?.current_livelihood?.skills?.length ?? 0) > 0)}
      />
    </div>
  );
};
