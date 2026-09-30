import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { MapPin, Briefcase, IndianRupee, ShieldCheck, Phone, CheckCircle, ExternalLink } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  sector: string;
  type: "wage_employment" | "self_employment" | "wage_and_self";
  employer: string;
  location: string;
  distanceKm: number;
  earnings: string;
  openings: string | number;
  schemeAssistance: string;
  contact: string;
  matchedTrade: string;
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
    earnings: "₹16,000 / month + travel allowance",
    openings: 12,
    schemeAssistance: "PM Surya Ghar Muft Bijli Yojana & PM-AJAY Apprenticeship Grant",
    contact: "District Skill Nodal Officer, ITI Karaundi (0542-2578901)",
    matchedTrade: "Solar PV Installer (ELE/Q1401)",
  },
  {
    id: "opp-02",
    title: "Micro Boutique & Village Stitching Enterprise",
    type: "self_employment",
    sector: "Apparel & Textiles",
    employer: "Self-Employed / PM-AJAY Cluster Support",
    location: "Arajiline Block / Village Cluster",
    distanceKm: 1.2,
    earnings: "₹12,000 - ₹20,000 / month net income",
    openings: "Self-employment (No limit)",
    schemeAssistance: "PM-AJAY GIA Capital Subsidy up to ₹50,000 for Sewing Machinery",
    contact: "Block Development Officer (BDO), Social Welfare Cell",
    matchedTrade: "Self Employed Tailor (AMH/Q1947)",
  },
  {
    id: "opp-03",
    title: "Home Appliance Repair & Maintenance Hub",
    sector: "Electronics",
    type: "wage_and_self",
    employer: "Kashi Gramin Seva Kendra & Local Retail Networks",
    location: "Sewapuri Model Block",
    distanceKm: 5.0,
    earnings: "₹14,000 - ₹19,000 / month",
    openings: 8,
    schemeAssistance: "PM-AJAY Skill Upgradation Toolkit Scheme (Free Toolbag & Multimeter)",
    contact: "Sewapuri Skill Facilitation Cell (0542-2891234)",
    matchedTrade: "Field Technician Home Appliances (ELE/Q3102)",
  },
  {
    id: "opp-04",
    title: "Panchayat Har Ghar Jal Pipeline Maintenance Operator",
    sector: "Water Supply & Plumbing",
    type: "wage_employment",
    employer: "Jal Jeevan Mission Village Water & Sanitation Committee (VWSC)",
    location: "Gram Panchayat Level (Direct local posting)",
    distanceKm: 2.0,
    earnings: "₹9,500 - ₹12,000 / month + emergency service fees",
    openings: 15,
    schemeAssistance: "Convergence with Jal Jeevan Mission Maintenance Fund",
    contact: "Gram Pradhan / Panchayat Secretary",
    matchedTrade: "General Plumber (PLU/Q0101)",
  },
  {
    id: "opp-05",
    title: "SC Women SHG Spices & Dal Processing Cluster",
    sector: "Food Processing",
    type: "self_employment",
    employer: "Prerna Samuh / PM-AJAY GIA Producer Cluster",
    location: "Chiraigaon Block",
    distanceKm: 4.5,
    earnings: "₹11,000 - ₹18,000 / month profit share",
    openings: 20,
    schemeAssistance: "PM-AJAY Cluster Infrastructure Grant & PMFME Seed Capital",
    contact: "NRLM Block Mission Manager",
    matchedTrade: "Food Processing Technician (FIC/Q0103)",
  },
  {
    id: "opp-06",
    title: "CSC Digital Village Citizen Service Operator",
    sector: "IT-ITeS",
    type: "self_employment",
    employer: "CSC e-Governance Services India Ltd",
    location: "Rohaniya Market Hub",
    distanceKm: 4.0,
    earnings: "Commission based, avg ₹12,000 - ₹18,000 / month",
    openings: 4,
    schemeAssistance: "PM-AJAY Entrepreneurship Development Program & Hardware Grant",
    contact: "CSC District VLE Manager",
    matchedTrade: "Domestic Data Entry Operator (SSC/Q2212)",
  },
];

export const PMAJAYOpportunities: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  const filteredOpportunities = SAMPLE_LOCAL_OPPORTUNITIES.filter((opp) => {
    if (filterType === "all") return true;
    if (filterType === "self") return opp.type === "self_employment" || opp.type === "wage_and_self";
    if (filterType === "wage") return opp.type === "wage_employment" || opp.type === "wage_and_self";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#193226] flex flex-col font-sans">
      <PMAJAYNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#3B6552] uppercase tracking-wider mb-2">
          <span>चरण 5 / Step 5</span>
          <span>•</span>
          <span>स्थानीय अवसर एवं अनुदान / Local Livelihood Opportunities</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142A20]">
              स्थानीय रोजगार एवं स्व-रोजगार अवसर
            </h1>
            <p className="text-xs text-[#526D61] mt-1">
              Sample district opportunities (Varanasi / Chandauli cluster) with PM-AJAY GIA toolkit and subsidy linkage.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-white border border-[#CDDDD5] p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === "all" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              All Roles ({SAMPLE_LOCAL_OPPORTUNITIES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("self")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === "self" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              Self-Employment / Grants
            </button>
            <button
              type="button"
              onClick={() => setFilterType("wage")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === "wage" ? "bg-[#284C3D] text-white font-semibold" : "text-[#476657] hover:bg-[#EEF4F0]"
              }`}
            >
              Wage Jobs
            </button>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {filteredOpportunities.map((opp) => {
            const isApplied = appliedIds.includes(opp.id);
            return (
              <div
                key={opp.id}
                className="bg-white border border-[#D5E2DB] rounded-xl p-5 shadow-sm hover:border-[#A6C4B7] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#436E5A] bg-[#E8F2EC] px-2 py-0.5 rounded uppercase">
                        {opp.sector}
                      </span>
                      <h3 className="font-bold text-base text-[#142A20] mt-1">{opp.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-[#1C4634] bg-[#E1EDE6] px-2 py-0.5 rounded">
                      {opp.distanceKm} km away
                    </span>
                  </div>

                  <div className="text-xs text-[#4F685B] space-y-1.5 mb-4">
                    <div className="flex items-center space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#376550]" />
                      <span>{opp.employer}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#376550]" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-bold text-[#143B2A]">
                      <IndianRupee className="w-3.5 h-3.5 text-[#2C5E47]" />
                      <span>{opp.earnings}</span>
                    </div>
                  </div>

                  {/* Scheme grant assistance badge */}
                  <div className="bg-[#F3F8F5] border border-[#D0E2D8] p-2.5 rounded-lg text-xs text-[#2A5240] mb-4">
                    <div className="font-semibold text-[11px] uppercase tracking-wider text-[#1B4432] mb-0.5 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PM-AJAY Financial & Tool Assistance:</span>
                    </div>
                    <p>{opp.schemeAssistance}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDF3EF] flex items-center justify-between">
                  <div className="text-[11px] text-[#5A7769]">
                    <span>Contact: {opp.contact}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(opp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isApplied
                        ? "bg-[#D8E8DF] text-[#1E4333]"
                        : "bg-[#274B3C] hover:bg-[#34624F] text-white shadow-sm"
                    }`}
                  >
                    {isApplied ? "Applied / Linked ✓" : "Connect with Nodal Officer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#E7F0EB] border border-[#CCDCD4] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#426052]">
            <strong>Administrative Round Complete:</strong> Check the Ministry Admin Dashboard to view aggregates, 
            auditable scoring records, and refusal rates.
          </div>
          <Link
            to="/pmajay/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#2D5A46] hover:bg-[#396E56] text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition-all"
          >
            <span>Open Ministry Admin Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
