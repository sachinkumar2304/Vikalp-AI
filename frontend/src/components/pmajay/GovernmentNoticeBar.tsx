import React, { useState } from "react";
import { Bell, ChevronRight, FileText, X } from "lucide-react";

export const GovernmentNoticeBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  return (
    <div
      className="bg-[#fffbeb] border-b border-[#fde68a] text-slate-800 text-[11px] sm:text-xs py-1.5 px-4 font-sans relative overflow-hidden"
      role="region"
      aria-label="Government Announcements"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="inline-flex items-center gap-1 bg-[#b45309] text-white text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider">
            <Bell className="w-3 h-3" />
            <span>अधिसूचना / Circular</span>
          </span>

          <div className="truncate flex items-center gap-2 font-medium text-slate-700">
            <span className="font-semibold text-[#b45309] shrink-0 hidden sm:inline">
              फा. सं. 11014/03/2023-SCD-V:
            </span>
            <span className="truncate">
              पीएम-अजय GIA घटक के अंतर्गत SC लाभार्थियों हेतु टूलकिट सब्सिडी ₹50,000 स्वीकृत। राष्ट्रीय टोल-फ्री हेल्पलाइन: 1800-11-2026 (24x7)
            </span>
            <span className="text-slate-400 hidden md:inline">•</span>
            <span className="hidden md:inline text-slate-600 truncate">
              PM-AJAY GIA Component guidelines for FY 2026-27 active. No physical form required.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-700 p-0.5 shrink-0 transition-colors"
          title="Dismiss notification"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
