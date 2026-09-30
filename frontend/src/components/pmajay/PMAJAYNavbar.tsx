import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, SupportedLang } from "@/contexts/LanguageContext";
import { Mic, Volume2, VolumeX, PhoneCall, Menu, X } from "lucide-react";

export const PMAJAYNavbar: React.FC = () => {
  const location = useLocation();
  const { lang, setLang, t, playVoice, stopVoice, isSpeaking } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

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
    <header className="sticky top-0 z-50 font-sans shadow-lg" role="banner">

      {/* ── TOP STRIP: Government of India ── */}
      <div className="bg-[#003366] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Government identity */}
          <div className="flex items-center gap-2">
            {/* Ashoka Chakra placeholder emblem */}
            <div className="w-7 h-7 rounded-full border-2 border-[#FF9933] bg-white flex items-center justify-center shrink-0">
              <span className="text-[#003366] text-[8px] font-black">🇮🇳</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white">{t("gov_title")}</span>
              <span className="text-blue-300 hidden sm:inline">|</span>
              <span className="text-blue-200 hidden sm:inline">{t("ministry_title")}</span>
            </div>
          </div>

          {/* Right: Helpline + Language selector */}
          <div className="flex items-center gap-3">
            {/* Helpline */}
            <div className="hidden sm:flex items-center gap-1.5 text-[#FFC107]">
              <PhoneCall className="w-3 h-3" />
              <span className="font-medium">{t("helpline")}</span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-0.5 bg-[#00245A] border border-[#1a5096] rounded-md p-0.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    lang === l.code
                      ? "bg-[#FF9933] text-white shadow"
                      : "text-blue-200 hover:text-white hover:bg-[#00367a]"
                  }`}
                  aria-pressed={lang === l.code}
                  aria-label={`Switch to ${l.label}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Audio toggle */}
            <button
              type="button"
              onClick={() => (isSpeaking ? stopVoice() : playVoice(t("welcome_speech")))}
              title={isSpeaking ? t("stop_audio") : t("play_audio")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                isSpeaking
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-[#00367a] text-blue-200 hover:bg-[#004499] hover:text-white border border-[#1a5096]"
              }`}
            >
              {isSpeaking
                ? <VolumeX className="w-3.5 h-3.5" />
                : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSpeaking ? t("audio_stop") : t("audio_badge")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <div className="bg-white border-b-4 border-[#FF9933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo + Portal Identity */}
          <Link to="/pmajay" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#003366] to-[#00245A] flex items-center justify-center border border-blue-800 shrink-0">
              <span className="text-white text-sm font-black leading-none">वाणी</span>
            </div>
            <div className="leading-tight">
              <div className="font-black text-base sm:text-lg text-[#003366] group-hover:text-[#CC5500] transition-colors">
                {t("portal_name")}
              </div>
              <div className="text-[10px] text-gray-500 font-medium hidden sm:block">
                {t("scheme_tag")} · MoSJE · GoI
              </div>
            </div>
          </Link>

          {/* Center Nav — desktop only */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#003366] text-white shadow-sm"
                      : "text-[#003366] hover:bg-blue-50 hover:text-[#CC5500]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              to="/pmajay/interview"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#138808] hover:bg-[#0d6606] text-white text-sm font-bold shadow transition-all"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>{t("btn_speak_nav")}</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-[#003366] hover:bg-blue-50 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 pb-4">
            <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile navigation">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold rounded-md transition-all ${
                      isActive
                        ? "bg-[#003366] text-white"
                        : "text-[#003366] hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/pmajay/interview"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#138808] text-white text-sm font-bold shadow"
              >
                <Mic className="w-4 h-4" />
                {t("btn_speak_nav")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
