import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, SupportedLang } from "@/contexts/LanguageContext";
import {
  Mic,
  Volume2,
  VolumeX,
  PhoneCall,
  Menu,
  X,
  Award,
  Phone,
  Eye,
  ChevronRight,
} from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";
import { IVRSimulatorModal } from "./IVRSimulatorModal";
import { LivelihoodPassportModal } from "./LivelihoodPassportModal";

export const PMAJAYNavbar: React.FC = () => {
  const location = useLocation();
  const { lang, setLang, t, playVoice, stopVoice, isSpeaking } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [ivrOpen, setIvrOpen] = useState<boolean>(false);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const adjustFontSize = (level: number) => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === -1) {
      root.style.fontSize = "92%";
    } else if (level === 1) {
      root.style.fontSize = "108%";
    } else {
      root.style.fontSize = "100%";
    }
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const navLinks = [
    { to: "/pmajay", label: t("nav_home") },
    { to: "/pmajay/interview", label: t("nav_voice") },
    { to: "/pmajay/recommendations", label: t("nav_recommendations") },
    { to: "/pmajay/opportunities", label: t("nav_jobs") },
    { to: "/pmajay/admin", label: t("nav_admin") },
  ];

  const languages: { code: SupportedLang; label: string }[] = [
    { code: "hi", label: "हिन्दी" },
    { code: "en", label: "English" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <>
      {/* ── ACCESSIBILITY SKIP LINK ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-[#002147] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg ring-2 ring-amber-400"
      >
        Skip to main content / मुख्य सामग्री पर जाएं
      </a>

      {/* ── NATIONAL TRICOLOR MICRO-STRIP ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <header className="sticky top-0 z-40 font-sans shadow-xs bg-white" role="banner">
        {/* ── TOP UTILITY STRIP: Clean, Dignified Government Identity ── */}
        <div className="bg-[#002147] text-slate-100 text-[11px] py-1 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
            {/* Left: Ministry identity */}
            <div className="flex items-center gap-2">
              <EmblemOfIndia size={18} variant="gold" />
              <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
                भारत सरकार • Government of India
              </span>
              <span className="text-slate-400 hidden md:inline">|</span>
              <span className="text-amber-200/90 hidden md:inline text-[11px]">
                सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)
              </span>
            </div>

            {/* Right: Helpline & Controls */}
            <div className="flex items-center gap-3">
              {/* National Helpline */}
              <div className="hidden sm:flex items-center gap-1.5 text-amber-300 text-[11px] font-medium">
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span className="font-mono font-semibold">1800-11-2026 (टोल-फ्री)</span>
              </div>

              {/* Text Sizing */}
              <div className="hidden md:flex items-center gap-0.5 bg-black/20 rounded px-1 py-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => adjustFontSize(-1)}
                  className={`px-1 rounded ${fontSizeLevel === -1 ? "bg-amber-500 text-slate-900 font-bold" : "text-slate-300"}`}
                  title="Smaller font"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => adjustFontSize(0)}
                  className={`px-1 rounded ${fontSizeLevel === 0 ? "bg-amber-500 text-slate-900 font-bold" : "text-slate-300"}`}
                  title="Normal font"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => adjustFontSize(1)}
                  className={`px-1 rounded ${fontSizeLevel === 1 ? "bg-amber-500 text-slate-900 font-bold" : "text-slate-300"}`}
                  title="Larger font"
                >
                  A+
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-black/25 rounded p-0.5 text-[10.5px]">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`px-2 py-0.5 rounded font-medium transition-all ${
                      lang === l.code
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Audio Listen */}
              <button
                type="button"
                onClick={() => (isSpeaking ? stopVoice() : playVoice(t("welcome_speech")))}
                title={isSpeaking ? "आवाज रोकें" : "बोलकर सुनाएं"}
                className={`p-1 rounded transition-colors ${
                  isSpeaking ? "bg-rose-600 text-white animate-pulse" : "text-amber-300 hover:text-white"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN HUMANE NAVBAR ── */}
        <div className="border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <Link
              to="/pmajay"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none rounded-md"
            >
              <EmblemOfIndia size={36} variant="navy" className="shrink-0 hidden xs:block" />
              <img
                src="/favicon.svg"
                alt="Vikalp AI Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200 shrink-0"
              />

              <div className="border-l border-slate-200 pl-2.5 sm:pl-3 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-[#002147] tracking-tight">
                    विकल्प AI
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-300">
                    PM-AJAY GIA
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium hidden sm:block">
                  आवाज-आधारित आजीविका एवं कौशल सहायक • MoSJE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? "bg-[#002147] text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#002147]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Quick Tools & Voice CTA */}
            <div className="flex items-center gap-2">
              {/* Feature Phone IVR Button */}
              <button
                type="button"
                onClick={() => setIvrOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all"
                title="फीचर फोन IVR हेल्पलाइन 1800-11-2026 सिम्युलेटर"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>IVR डायल (1800-11-2026)</span>
              </button>

              {/* Livelihood Passport Button */}
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-all"
                title="आधिकारिक आजीविका पासपोर्ट कार्ड"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>आजीविका पासपोर्ट</span>
              </button>

              {/* Primary Voice Action Button */}
              <Link
                to="/pmajay/interview"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
              >
                <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span>बोलकर बताएं</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
              <nav className="flex flex-col gap-1">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg ${
                        isActive ? "bg-[#002147] text-white" : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIvrOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-700" />
                  <span>फीचर फोन IVR डायल (1800-11-2026)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassportOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>आजीविका पासपोर्ट एवं अनुदान कार्ड</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <IVRSimulatorModal isOpen={ivrOpen} onClose={() => setIvrOpen(false)} />
      <LivelihoodPassportModal isOpen={passportOpen} onClose={() => setPassportOpen(false)} />
    </>
  );
};
