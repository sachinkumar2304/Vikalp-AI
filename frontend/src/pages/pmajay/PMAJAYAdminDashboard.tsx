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
  FileSpreadsheet,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7E4DE] mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider">
              <span>प्रशासनिक डैशबोर्ड / Ministry Admin Dashboard</span>
              <span>•</span>
              <span>GIA Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142A20]">
              PM-AJAY GIA आजीविका एवं कौशल निगरानी पोर्टल
            </h1>
            <p className="text-xs text-[#526D61] mt-0.5">
              Auditable evaluation metrics: interviews conducted, algorithmic matches, constraint refusals, and confidence gaps.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-[#CCDCD4] bg-white hover:bg-[#EEF4F0] text-xs font-medium text-[#254B3B] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Interviewed */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#526D61] mb-2 font-medium">
              <span>Total Beneficiaries Interviewed</span>
              <Users className="w-4 h-4 text-[#2E5E4A]" />
            </div>
            <div className="text-3xl font-extrabold text-[#142A20]">
              {metrics?.summary.total_interviewed || 0}
            </div>
            <div className="text-[11px] text-[#426052] mt-1">
              Spoken voice sessions across pilot blocks
            </div>
          </div>

          {/* Card 2: Successful NSQF Matches */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#526D61] mb-2 font-medium">
              <span>High-Confidence Matches</span>
              <CheckCircle className="w-4 h-4 text-[#22774C]" />
            </div>
            <div className="text-3xl font-extrabold text-[#1D5E3B]">
              {metrics?.summary.successful_matches || 0}
            </div>
            <div className="text-[11px] text-[#426052] mt-1">
              Avg score: {metrics?.summary.avg_match_score || 88.5}% fit
            </div>
          </div>

          {/* Card 3: Explicit Constraint Refusals */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#526D61] mb-2 font-medium">
              <span>Hard Constraint Refusals</span>
              <XCircle className="w-4 h-4 text-[#C53030]" />
            </div>
            <div className="text-3xl font-extrabold text-[#962A2A]">
              {metrics?.summary.explicit_refusals || 0}
            </div>
            <div className="text-[11px] text-[#7E4343] mt-1">
              Blocked due to mobility or prerequisite conflict
            </div>
          </div>

          {/* Card 4: Low-Confidence Clarifications */}
          <div className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#526D61] mb-2 font-medium">
              <span>Clarification Triggers</span>
              <HelpCircle className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="text-3xl font-extrabold text-[#92400E]">
              {metrics?.summary.low_confidence_clarifications || 0}
            </div>
            <div className="text-[11px] text-[#694828] mt-1">
              Engine paused guessing to verify details
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#D5E2DB] rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6D8A7D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, district, course..."
              className="w-full bg-[#F5F8F6] border border-[#CCDCD4] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#193226] focus:outline-none focus:ring-1 focus:ring-[#31634D]"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-xs w-full sm:w-auto justify-end">
            <span className="text-[#597769] font-medium mr-1">Status:</span>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "all" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("matched")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "matched" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              Matched
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("refused")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "refused" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              Refused
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("low_confidence")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "low_confidence" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              Needs Clarification
            </button>
          </div>
        </div>

        {/* Detailed Beneficiary Case Records Table */}
        <div className="bg-white border border-[#D5E2DB] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#EDF3EF] flex justify-between items-center bg-[#FAFBFB]">
            <h3 className="font-bold text-sm text-[#142A20]">
              Auditable Beneficiary Case Records ({filteredRecords.length})
            </h3>
            <span className="text-[11px] text-[#526D61]">Live records logged from voice interviews</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EEF4F0] text-[#335344] uppercase font-semibold text-[10px] tracking-wider border-b border-[#DCE8E1]">
                <tr>
                  <th className="px-4 py-3">Beneficiary</th>
                  <th className="px-4 py-3">District / Block</th>
                  <th className="px-4 py-3">Education</th>
                  <th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">Matched NSQF Recommendation</th>
                  <th className="px-4 py-3">Score / Status</th>
                  <th className="px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF3EF] text-[#2F4A3D]">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#F7FAF8] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#142A20]">{r.beneficiary_name}</div>
                      <div className="text-[10px] text-[#6E8F81] font-mono">{r.session_id}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">{r.district}</td>
                    <td className="px-4 py-3 font-mono uppercase text-[11px]">
                      {r.education.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">{r.interest}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#183629]">{r.matched_course}</div>
                      {r.refusal_reason && (
                        <div className="text-[10px] text-[#962A2A] italic mt-0.5 max-w-xs">
                          Reason: {r.refusal_reason}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "matched" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded font-bold bg-[#E2EEE7] text-[#1E5237]">
                          <CheckCircle className="w-3 h-3" />
                          <span>{r.score}% Match</span>
                        </span>
                      )}
                      {r.status === "refused" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded font-bold bg-[#FDEAEA] text-[#962A2A]">
                          <XCircle className="w-3 h-3" />
                          <span>Refused</span>
                        </span>
                      )}
                      {r.status === "low_confidence" && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded font-bold bg-[#FEF3C7] text-[#92400E]">
                          <HelpCircle className="w-3 h-3" />
                          <span>Clarification</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
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
