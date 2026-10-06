import React, { useState, useEffect } from "react";
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
  Type,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";
import { IVRSimulatorModal } from "./IVRSimulatorModal";
import { LivelihoodPassportModal } from "./LivelihoodPassportModal";
import { GovernmentNoticeBar } from "./GovernmentNoticeBar";

export const PMAJAYNavbar: React.FC = () => {
  const location = useLocation();
  const { lang, setLang, t, playVoice, stopVoice, isSpeaking } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [ivrOpen, setIvrOpen] = useState<boolean>(false);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Apply font size adjustment to document root
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

  // Toggle high contrast mode
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
      {/* ── SKIP TO MAIN CONTENT ACCESSIBILITY LINK ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-[#002147] text-white px-4 py-2 rounded font-bold text-xs shadow-lg ring-2 ring-amber-400"
      >
        Skip to main content / मुख्य सामग्री पर जाएं
      </a>

      {/* ── OFFICIAL NATIONAL TRICOLOR RIBBON ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <header className="sticky top-0 z-40 font-sans shadow-md" role="banner">
        {/* ── TOP UTILITY STRIP: Government of India & Accessibility Toolbar ── */}
        <div className="bg-[#002147] text-slate-100 text-[11px] py-1.5 px-3 sm:px-6 border-b border-[#003366]">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            {/* Left: Official State Emblem & Ministry Title */}
            <div className="flex items-center gap-2.5">
              <EmblemOfIndia size={24} variant="gold" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white tracking-wide">
                  भारत सरकार • Government of India
                </span>
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="text-amber-200/90 hidden md:inline font-medium">
                  सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE)
                </span>
              </div>
            </div>

            {/* Right: Accessibility Controls, Helpline, Language, Audio */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Accessibility Font Size Controls */}
              <div
                className="hidden sm:flex items-center gap-0.5 bg-[#001733] border border-blue-900 rounded px-1 py-0.5 text-[10px]"
                aria-label="Text size adjustment"
              >
                <button
                  type="button"
                  onClick={() => adjustFontSize(-1)}
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    fontSizeLevel === -1 ? "bg-amber-500 text-slate-900" : "text-slate-300 hover:text-white"
                  }`}
                  title="Decrease font size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => adjustFontSize(0)}
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    fontSizeLevel === 0 ? "bg-amber-500 text-slate-900" : "text-slate-300 hover:text-white"
                  }`}
                  title="Default font size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => adjustFontSize(1)}
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    fontSizeLevel === 1 ? "bg-amber-500 text-slate-900" : "text-slate-300 hover:text-white"
                  }`}
                  title="Increase font size"
                >
                  A+
                </button>
              </div>

              {/* High Contrast Toggle */}
              <button
                type="button"
                onClick={toggleHighContrast}
                className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#001733] hover:bg-blue-900 text-slate-300 border border-blue-900 transition-colors"
                title="Toggle High Contrast"
              >
                <Eye className="w-3 h-3 text-amber-400" />
                <span>{highContrast ? "Normal" : "उच्च कंट्रास्ट"}</span>
              </button>

              {/* National Helpline */}
              <div className="hidden lg:flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span className="font-semibold font-mono">1800-11-2026 (टोल-फ्री)</span>
              </div>

              {/* Language Selector */}
              <div
                className="flex items-center gap-0.5 bg-[#001733] border border-blue-800 rounded p-0.5"
                role="group"
                aria-label="Language selection"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all ${
                      lang === l.code
                        ? "bg-[#b45309] text-white shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-blue-950"
                    }`}
                    aria-pressed={lang === l.code}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Audio assistance button */}
              <button
                type="button"
                onClick={() => (isSpeaking ? stopVoice() : playVoice(t("welcome_speech")))}
                title={isSpeaking ? t("stop_audio") : t("play_audio")}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold transition-all ${
                  isSpeaking
                    ? "bg-rose-700 text-white animate-pulse"
                    : "bg-[#003366] text-blue-200 hover:bg-[#004080] hover:text-white border border-blue-800"
                }`}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3 text-amber-300" />
                )}
                <span className="hidden sm:inline">
                  {isSpeaking ? t("audio_stop") : t("audio_badge")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── OFFICIAL NOTIFICATION TICKER / CIRCULAR ── */}
        <GovernmentNoticeBar />

        {/* ── MAIN PORTAL NAVBAR ── */}
        <div className="bg-white border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
            {/* Left: Ministry Emblem + Portal Brand Identity */}
            <Link
              to="/pmajay"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded-md"
            >
              <EmblemOfIndia size={42} variant="navy" className="hidden xs:flex shrink-0" />
              <img
                src="/favicon.svg"
                alt="Vikalp AI Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-xs hidden sm:block border border-slate-200 shrink-0"
              />

              <div className="border-l-2 border-slate-300 pl-2.5 sm:pl-3 leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl text-[#002147] group-hover:text-[#b45309] transition-colors tracking-tight">
                    विकल्प AI
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    PM-AJAY GIA
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 hidden sm:block">
                  प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना • कौशल एवं आजीविका मिशन
                </div>
                <div className="text-[10px] text-slate-500 font-medium hidden md:block">
                  Ministry of Social Justice & Empowerment • Govt of India | NCVET NSQF Aligned
                </div>
              </div>
            </Link>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-[#002147] text-white shadow-xs"
                        : "text-[#002147] hover:bg-slate-100 hover:text-[#b45309]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Feature Phone IVR Simulator + Passport + Speak CTA */}
            <div className="flex items-center gap-2">
              {/* Feature Phone IVR Simulator Button (Key Competitor Advantage!) */}
              <button
                type="button"
                onClick={() => setIvrOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#002147] border border-slate-300 text-xs font-bold transition-all shadow-xs"
                title="फीचर फोन IVR हेल्पलाइन 1800-11-2026 सिम्युलेटर चलाएं"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>IVR डायल (1800-11-2026)</span>
              </button>

              {/* Livelihood Passport Modal Button */}
              <button
                type="button"
                onClick={() => setPassportOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                title="आधिकारिक आजीविका पासपोर्ट एवं अनुदान कार्ड देखें"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>आजीविका पासपोर्ट</span>
              </button>

              {/* Primary Voice CTA Button */}
              <Link
                to="/pmajay/interview"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <Mic className="w-4 h-4 text-emerald-100 animate-pulse" />
                <span>{t("btn_speak_nav")}</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-md text-[#002147] hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-white px-4 pb-4 animate-in slide-in-from-top-2 duration-150">
              <nav className="flex flex-col gap-1.5 pt-3" aria-label="Mobile navigation">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-md transition-all ${
                        isActive ? "bg-[#002147] text-white" : "text-[#002147] hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setIvrOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>IVR सिम्युलेटर</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setPassportOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>आजीविका कार्ड</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ── MODALS (IVR FEATURE PHONE & LIVELIHOOD PASSPORT) ── */}
      <IVRSimulatorModal isOpen={ivrOpen} onClose={() => setIvrOpen(false)} />
      <LivelihoodPassportModal isOpen={passportOpen} onClose={() => setPassportOpen(false)} />
    </>
  );
};
