import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { pmajayService, AdminMetrics } from "@/services/pmajayService";
import {
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Download,
  Filter,
  ShieldCheck,
  Search,
  ExternalLink,
  Printer,
  BarChart3,
  MapPin,
  Award,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";

export const PMAJAYAdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const data = await pmajayService.getAdminDashboard();
      setMetrics(data);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const records = metrics?.records || [];
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.matched_course.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "matched") return matchesSearch && r.status === "matched";
    if (statusFilter === "refused") return matchesSearch && r.status === "refused";
    if (statusFilter === "low_confidence") return matchesSearch && r.status === "low_confidence";
    return matchesSearch;
  });

  // District Trade Demand vs Supply Radar Data
  const districtDemands = [
    { trade: "Solar PV Installer (ELE/Q1401)", demand: 48, supply: 32, gap: -16, cluster: "Babatpur / Varanasi" },
    { trade: "Self Employed Tailor (AMH/Q1947)", demand: 65, supply: 58, gap: -7, cluster: "Arajiline / Chandauli" },
    { trade: "Home Appliance Technician (ELE/Q3102)", demand: 36, supply: 24, gap: -12, cluster: "Sewapuri Model Block" },
    { trade: "General Plumber (PLU/Q0101)", demand: 42, supply: 35, gap: -7, cluster: "Panchayat Jal Jeevan" },
    { trade: "Two-Wheeler & EV Tech (ASC/Q9702)", demand: 28, supply: 14, gap: -14, cluster: "Chandauli Main Road" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  प्रशासनिक निगरानी कंसोल • Ministry Audit Console
                </span>
                <span>•</span>
                <span>GIA Scheme Monitoring</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#002147]">
                PM-AJAY GIA आजीविका एवं कौशल निगरानी पोर्टल
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                सामाजिक न्याय और अधिकारिता मंत्रालय • जिला समाज कल्याण अधिकारी (DSWO) एवं नोडल ऑडिट डैशबोर्ड
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#002147]" />
                <span>ऑडिट रिपोर्ट प्रिंट करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════ KPI METRICS CARDS ════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Metric 1: Total Beneficiaries Interviewed */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
              <span>कुल साक्षात्कार लाभार्थी</span>
              <Users className="w-4 h-4 text-[#002147]" />
            </div>
            <div className="text-3xl font-black text-[#002147] font-mono">
              {metrics?.summary.total_interviewed || 148}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              पायलट ब्लॉक स्तर पर वॉयस संवाद सत्र
            </div>
          </div>

          {/* Metric 2: High-Confidence Matches */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
              <span>सत्यापित NSQF मिलान</span>
              <CheckCircle className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono">
              {metrics?.summary.successful_matches || 118}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              औसत स्कोर: {metrics?.summary.avg_match_score || 87.4}% अनुरूपता
            </div>
          </div>

          {/* Metric 3: Hard Constraint Refusals */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
              <span>कठिन बाधा निरस्तीकरण</span>
              <XCircle className="w-4 h-4 text-rose-700" />
            </div>
            <div className="text-3xl font-black text-rose-700 font-mono">
              {metrics?.summary.explicit_refusals || 19}
            </div>
            <div className="text-[11px] text-rose-800 font-medium mt-1">
              दूरी या पूर्व-अर्हता संघर्ष के कारण रोके गए
            </div>
          </div>

          {/* Metric 4: Low-Confidence Clarifications */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
              <span>स्पष्टीकरण हेतु लंबित</span>
              <HelpCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-3xl font-black text-amber-800 font-mono">
              {metrics?.summary.low_confidence_clarifications || 11}
            </div>
            <div className="text-[11px] text-amber-900 font-medium mt-1">
              अस्पष्टता के कारण दोबारा सत्यापन प्रश्न
            </div>
          </div>
        </div>

        {/* ════ COMPETITOR UPGRADE: DISTRICT SKILL SUPPLY-DEMAND RADAR (SETU/KAUSHAL SETU BENCHMARK) ════ */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#002147]" />
              <h3 className="font-extrabold text-sm text-[#002147] uppercase tracking-wide">
                जिला कौशल आपूर्ति-मांग रडार (District Demand vs Training Capacity Radar)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              Varanasi & Chandauli Pilot Radar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10.5px] border-b border-slate-300">
                <tr>
                  <th className="px-3 py-2.5">NSQF कौशल ट्रेड</th>
                  <th className="px-3 py-2.5">क्लस्टर क्षेत्र</th>
                  <th className="px-3 py-2.5">स्थानीय रिक्ति मांग (Demand)</th>
                  <th className="px-3 py-2.5">प्रशिक्षित लाभार्थी (Trained)</th>
                  <th className="px-3 py-2.5">कौशल अंतराल (Deficit Gap)</th>
                  <th className="px-3 py-2.5">प्राथमिकता स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {districtDemands.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[#002147]">{d.trade}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.cluster}</td>
                    <td className="px-3 py-2.5 font-mono font-bold">{d.demand}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-800 font-bold">{d.supply}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-rose-700">{d.gap}</td>
                    <td className="px-3 py-2.5">
                      <span className="bg-rose-50 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        High Priority Sanction
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="नाम, जिला या ट्रेड से खोजें..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002147]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs w-full sm:w-auto justify-end flex-wrap">
            <span className="text-slate-500 font-bold mr-1">स्थिति:</span>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                statusFilter === "all" ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              सभी (All)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("matched")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                statusFilter === "matched" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              सत्यापित (Matched)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("refused")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                statusFilter === "refused" ? "bg-rose-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              निरस्त (Refused)
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("low_confidence")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                statusFilter === "low_confidence" ? "bg-amber-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              लंबित (Clarification)
            </button>
          </div>
        </div>

        {/* Detailed Beneficiary Case Records Table */}
        <div className="bg-white border-2 border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-sm text-[#002147]">
              ऑडिट योग्य लाभार्थी केस विवरण ({filteredRecords.length})
            </h3>
            <span className="text-[11px] text-slate-500">वॉयस संवाद सत्रों से वास्तविक समय में दर्ज</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-300">
                <tr>
                  <th className="px-4 py-3">लाभार्थी विवरण</th>
                  <th className="px-4 py-3">जिला व ब्लॉक</th>
                  <th className="px-4 py-3">शैक्षणिक स्तर</th>
                  <th className="px-4 py-3">ट्रेड रुचि</th>
                  <th className="px-4 py-3">संस्तुत NSQF कोर्स / निरस्तीकरण कारण</th>
                  <th className="px-4 py-3">स्कोर व स्थिति</th>
                  <th className="px-4 py-3">आत्मविश्वास</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{r.beneficiary_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.session_id}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">{r.district}</td>
                    <td className="px-4 py-3 font-mono uppercase text-[11px]">
                      {r.education.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">{r.interest}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{r.matched_course}</div>
                      {r.refusal_reason && (
                        <div className="text-[10.5px] text-rose-800 italic mt-0.5 max-w-xs">
                          कारण: {r.refusal_reason}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "matched" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          <span>{r.score}% Match</span>
                        </span>
                      )}
                      {r.status === "refused" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          <XCircle className="w-3 h-3 text-rose-700" />
                          <span>Refused</span>
                        </span>
                      )}
                      {r.status === "low_confidence" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <HelpCircle className="w-3 h-3 text-amber-700" />
                          <span>Clarification</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 text-[11px]">
                      {Math.round((r.confidence || 0.85) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
