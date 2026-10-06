import React, { useState } from "react";
import { SlidersHorizontal, MapPin, Clock, RotateCcw, Award, ShieldAlert } from "lucide-react";

export interface WhatIfParams {
  travelRadiusKm: number; // 3, 10, 25, 50
  dailyHours: number; // 2 to 8
  pathwayFilter: "all" | "self" | "wage" | "shg";
}

interface WhatIfSimulatorProps {
  initialParams?: Partial<WhatIfParams>;
  onChange: (params: WhatIfParams) => void;
  className?: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialParams,
  onChange,
  className = "",
}) => {
  const [params, setParams] = useState<WhatIfParams>({
    travelRadiusKm: initialParams?.travelRadiusKm ?? 5,
    dailyHours: initialParams?.dailyHours ?? 6,
    pathwayFilter: initialParams?.pathwayFilter ?? "all",
  });

  const handleUpdate = (updates: Partial<WhatIfParams>) => {
    const next = { ...params, ...updates };
    setParams(next);
    onChange(next);
  };

  const handleReset = () => {
    const resetVals: WhatIfParams = {
      travelRadiusKm: 5,
      dailyHours: 6,
      pathwayFilter: "all",
    };
    setParams(resetVals);
    onChange(resetVals);
  };

  const getMobilityLabel = (km: number) => {
    if (km <= 3) return "गांव के भीतर ही (Village Level - 0 to 3 km)";
    if (km <= 10) return "ब्लॉक / तहसील स्तर (Block Level - up to 10 km)";
    if (km <= 25) return "जिला मुख्यालय तक (District HQ - up to 25 km)";
    return "राज्य स्तर (State Level - > 25 km)";
  };

  return (
    <div
      className={`bg-white border-2 border-[#133b5c]/20 rounded-xl p-4 sm:p-5 shadow-sm text-slate-900 ${className}`}
    >
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#002147] text-amber-300">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#002147]">
              परिस्थिति सिम्युलेटर (Dynamic Constraint Re-Ranker)
            </h3>
            <p className="text-[11px] text-slate-500">
              दूरी व समय की सीमाएं बदलें और देखें कि अनुशंसाएं तुरंत कैसे पुनर्गठित होती हैं
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#002147] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>डिफ़ॉल्ट रीसेट</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slider 1: Mobility Radius */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span>यात्रा की सीमा (Radius):</span>
            </span>
            <span className="font-mono text-[#002147] font-extrabold">{params.travelRadiusKm} km</span>
          </div>

          <input
            type="range"
            min="2"
            max="35"
            step="1"
            value={params.travelRadiusKm}
            onChange={(e) => handleUpdate({ travelRadiusKm: Number(e.target.value) })}
            className="w-full accent-[#002147] h-2 bg-slate-200 rounded-lg cursor-pointer my-2"
          />

          <div className="text-[10.5px] font-medium text-slate-600 leading-tight">
            {getMobilityLabel(params.travelRadiusKm)}
          </div>
        </div>

        {/* Slider 2: Daily Hours Available */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>दैनिक समय (Hours/Day):</span>
            </span>
            <span className="font-mono text-[#002147] font-extrabold">{params.dailyHours} hrs/day</span>
          </div>

          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={params.dailyHours}
            onChange={(e) => handleUpdate({ dailyHours: Number(e.target.value) })}
            className="w-full accent-[#b45309] h-2 bg-slate-200 rounded-lg cursor-pointer my-2"
          />

          <div className="text-[10.5px] font-medium text-slate-600 leading-tight">
            {params.dailyHours <= 3
              ? "अंशकालिक / घरेलू जिम्मेदारी अनुकूल (Part-Time)"
              : "पूर्णकालिक गहन प्रशिक्षण (Full-Time Training)"}
          </div>
        </div>
      </div>

      {/* Pathway Model Selector Pills */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 text-[11px]">
          आजीविका मॉडल फिल्टर (Livelihood Pathway Filter):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "सभी 3 मॉडल (All Pathways)" },
            { id: "self", label: "स्वरोजगार क्लस्टर (Self-Employment)" },
            { id: "wage", label: "स्थानीय वेतन रोजगार (Wage Jobs)" },
            { id: "shg", label: "महिला SHG क्लस्टर (SHG Enterprise)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleUpdate({ pathwayFilter: item.id as any })}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                params.pathwayFilter === item.id
                  ? "bg-[#002147] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Official Funding Notice */}
      <div className="mt-3 text-[11px] text-slate-600 bg-amber-50/80 border border-amber-200 rounded-lg p-2 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है। (Consult the local desk; this screen does not grant funds.)</span>
      </div>
    </div>
  );
};
