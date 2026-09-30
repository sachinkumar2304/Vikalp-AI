import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Briefcase,
  Users,
  GraduationCap,
  MapPin,
  Star,
  Clock,
  IndianRupee,
  ChevronRight,
  Award
} from "lucide-react";

export const PMAJAYLanding: React.FC = () => {
  const { lang, t, playVoice } = useLanguage();
  const audioPlayedRef = useRef<boolean>(false);

  // Auto welcome audio on first load or language change
  useEffect(() => {
    const key = `pmajay_welcome_${lang}`;
    if (!sessionStorage.getItem(key)) {
      const timer = setTimeout(() => {
        playVoice(t("welcome_speech"));
        sessionStorage.setItem(key, "1");
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [lang]);

  const steps = [
    {
      num: "01",
      icon: <Mic className="w-5 h-5 text-[#003366]" />,
      title: t("step1_title"),
      desc: t("step1_desc"),
    },
    {
      num: "02",
      icon: <Users className="w-5 h-5 text-[#003366]" />,
      title: t("step2_title"),
      desc: t("step2_desc"),
    },
    {
      num: "03",
      icon: <GraduationCap className="w-5 h-5 text-[#003366]" />,
      title: t("step3_title"),
      desc: t("step3_desc"),
    },
    {
      num: "04",
      icon: <Award className="w-5 h-5 text-[#003366]" />,
      title: t("step4_title"),
      desc: t("step4_desc"),
    },
  ];

  const popularTrades = [
    {
      title: t("solar_title"),
      desc: t("solar_desc"),
      hours: "300 hrs",
      wage: "₹15,000 – ₹22,000",
      nsqf: "NSQF L4",
      color: "#FF9933",
    },
    {
      title: t("tailor_title"),
      desc: t("tailor_desc"),
      hours: "340 hrs",
      wage: "₹12,000 – ₹25,000",
      nsqf: "NSQF L4",
      color: "#138808",
    },
    {
      title: t("appliance_title"),
      desc: t("appliance_desc"),
      hours: "360 hrs",
      wage: "₹14,000 – ₹20,000",
      nsqf: "NSQF L4",
      color: "#003366",
    },
    {
      title: t("plumber_title"),
      desc: t("plumber_desc"),
      hours: "240 hrs",
      wage: "₹10,000 – ₹16,000",
      nsqf: "NSQF L3",
      color: "#6B21A8",
    },
  ];

  const stats = [
    { value: "18+", label: t("stat_courses"), icon: <GraduationCap className="w-6 h-6" /> },
    { value: "₹50,000", label: t("stat_toolkit"), icon: <IndianRupee className="w-6 h-6" /> },
    { value: "3", label: t("stat_languages"), icon: <Volume2 className="w-6 h-6" /> },
    { value: "100%", label: t("stat_free"), icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      {/* ════ HERO SECTION ════ */}
      <section id="hero-section" className="bg-gradient-to-br from-[#003366] via-[#00245A] to-[#001A40] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Scheme badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs text-[#FFC107] mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse shrink-0" />
            <span className="font-semibold">{t("hero_badge")}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Headline */}
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                {t("hero_h1_1")}
                <br />
                <span className="text-[#FF9933]">{t("hero_h1_2")}</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                {t("hero_desc")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/pmajay/interview"
                  className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#e68a00] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
                >
                  <Mic className="w-4 h-4" />
                  {t("btn_start_voice")}
                </Link>

                <Link
                  to="/pmajay/opportunities"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-5 py-3 rounded-lg font-semibold text-sm transition-all"
                >
                  <Briefcase className="w-4 h-4 text-[#FF9933]" />
                  {t("btn_view_jobs")}
                </Link>

                <button
                  type="button"
                  onClick={() => playVoice(t("welcome_speech"))}
                  className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-xs underline underline-offset-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  {t("audio_badge")}
                </button>
              </div>

              {/* Trust highlights */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF9933]" />
                  <span>100% Free Government Grant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF9933]" />
                  <span>₹50,000 Toolkit Subsidy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF9933]" />
                  <span>NSQF Certified Training</span>
                </div>
              </div>
            </div>

            {/* Right: How it works card */}
            <div className="bg-white/5 border border-white/15 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FFC107] mb-4">
                {t("quick_box_title")}
              </h2>
              <ul className="space-y-3">
                {[t("q1"), t("q2"), t("q3"), t("q4")].map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF9933] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-blue-100 leading-snug">{q}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/pmajay/interview"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#138808] hover:bg-[#0d6606] text-white text-sm font-bold transition-all shadow-lg"
              >
                <Mic className="w-4 h-4" />
                {t("quick_btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════ STATISTICS BAR ════ */}
      <section className="bg-[#FF9933] text-white py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-white/80">{s.icon}</div>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs font-medium text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ 4 STEPS SECTION ════ */}
      <section id="steps-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366]">
              {t("steps_heading")}
            </h2>
            <div className="mt-2 w-16 h-1 bg-[#FF9933] rounded mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="relative bg-white border-2 border-gray-100 hover:border-[#003366] rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-[#003366] flex items-center justify-center transition-colors">
                    <div className="group-hover:[&_svg]:text-white">{st.icon}</div>
                  </div>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-[#FF9933] transition-colors">
                    {st.num}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#003366] mb-1.5">{st.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ POPULAR NSQF TRADES ════ */}
      <section id="trades-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366]">
                {t("popular_heading")}
              </h2>
              <div className="mt-2 w-16 h-1 bg-[#138808] rounded" />
            </div>
            <Link
              to="/pmajay/recommendations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#003366] hover:text-[#CC5500] transition-colors"
            >
              {lang === "hi" ? "सभी देखें" : lang === "mr" ? "सर्व पहा" : "View All"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularTrades.map((trade, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Color accent top bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: trade.color }} />
                <div className="p-5 flex flex-col flex-1">
                  {/* Header badges */}
                  <div className="flex justify-between items-center text-[11px] font-bold mb-3">
                    <span
                      className="px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: trade.color }}
                    >
                      {trade.nsqf}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{trade.hours}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-gray-800 leading-snug mb-2">
                    {trade.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{trade.desc}</p>

                  {/* Earning footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {lang === "hi" ? "मासिक आय" : lang === "mr" ? "मासिक उत्पन्न" : "Monthly Earning"}
                    </span>
                    <span className="font-bold text-sm text-[#138808]">{trade.wage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SCHEME HIGHLIGHTS ════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366]">
              {lang === "hi"
                ? "PM-AJAY GIA क्यों चुनें?"
                : lang === "mr"
                ? "PM-AJAY GIA का निवडावे?"
                : "Why PM-AJAY GIA?"}
            </h2>
            <div className="mt-2 w-16 h-1 bg-[#003366] rounded mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#003366]" />,
                title: lang === "hi" ? "सरकारी गारंटी" : lang === "mr" ? "सरकारी हमी" : "Government Guaranteed",
                desc: lang === "hi"
                  ? "100% केंद्र सरकार द्वारा वित्त पोषित — कोई पैसा नहीं देना।"
                  : lang === "mr"
                  ? "100% केंद्र सरकारकडून अनुदानित — कोणताही खर्च नाही."
                  : "100% centrally funded by Government of India — absolutely no cost to the beneficiary.",
              },
              {
                icon: <Volume2 className="w-8 h-8 text-[#138808]" />,
                title: lang === "hi" ? "आपकी भाषा में" : lang === "mr" ? "तुमच्या भाषेत" : "In Your Own Language",
                desc: lang === "hi"
                  ? "हिन्दी, मराठी और English — बोलकर जानकारी दें, कोई फॉर्म नहीं।"
                  : lang === "mr"
                  ? "हिंदी, मराठी आणि इंग्रजी — बोलून माहिती द्या, कोणताही फॉर्म नाही."
                  : "Hindi, Marathi, English — speak to give information, no forms to fill.",
              },
              {
                icon: <MapPin className="w-8 h-8 text-[#FF9933]" />,
                title: lang === "hi" ? "नजदीकी केंद्र" : lang === "mr" ? "जवळचे केंद्र" : "Nearest Training Centre",
                desc: lang === "hi"
                  ? "आपके जिले का सबसे नजदीकी PM-AJAY मान्यता प्राप्त प्रशिक्षण केंद्र खोजें।"
                  : lang === "mr"
                  ? "तुमच्या जिल्ह्यातील जवळचे PM-AJAY मान्यताप्राप्त प्रशिक्षण केंद्र शोधा."
                  : "Find the nearest PM-AJAY accredited training centre in your district.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-8 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#003366] text-base mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BANNER ════ */}
      <section id="cta-section" className="bg-[#003366] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {lang === "hi"
              ? "अभी शुरू करें — बिल्कुल मुफ्त"
              : lang === "mr"
              ? "आत्ताच सुरू करा — पूर्णपणे मोफत"
              : "Start Now — Completely Free"}
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            {lang === "hi"
              ? "माइक दबाएं और अपनी भाषा में बात करें। हम आपके लिए सही कोर्स और केंद्र खोजेंगे।"
              : lang === "mr"
              ? "माइक दाबा आणि तुमच्या भाषेत बोला. आम्ही तुमच्यासाठी योग्य कोर्स आणि केंद्र शोधू."
              : "Press the mic and speak in your language. We'll find the right course and centre for you."}
          </p>
          <Link
            to="/pmajay/interview"
            className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#e68a00] text-white px-8 py-4 rounded-xl font-black text-base shadow-lg transition-all"
          >
            <Mic className="w-5 h-5" />
            {t("btn_start_voice")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="bg-[#001A40] text-blue-200 text-xs py-8 px-4 sm:px-6 lg:px-8 border-t border-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center sm:text-left">
            <div>
              <div className="font-bold text-white text-sm mb-2">
                {t("portal_name")}
              </div>
              <p className="text-[11px] leading-relaxed text-blue-300">
                {t("portal_sub")}
              </p>
              <p className="text-[11px] mt-1 text-blue-400">
                SIH 2026 · Problem Statement 26097
              </p>
            </div>
            <div>
              <div className="font-semibold text-white text-xs mb-2 uppercase tracking-wider">
                {lang === "hi" ? "मंत्रालय" : lang === "mr" ? "मंत्रालय" : "Ministry"}
              </div>
              <p className="text-[11px] leading-relaxed text-blue-300">
                {t("ministry_title")}
              </p>
              <p className="text-[11px] mt-1 text-blue-300">{t("gov_title")}</p>
            </div>
            <div>
              <div className="font-semibold text-white text-xs mb-2 uppercase tracking-wider">
                {lang === "hi" ? "सहायता" : lang === "mr" ? "सहाय्य" : "Support"}
              </div>
              <div className="text-[11px] text-[#FFC107] font-medium">{t("helpline")}</div>
              <div className="mt-2">
                <Link to="/pmajay/admin" className="text-blue-300 hover:text-white underline text-[11px]">
                  {t("nav_admin")} →
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-900 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-blue-400">
            <span>© 2026 Ministry of Social Justice and Empowerment, Government of India</span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-[#FF9933]" />
              PM-AJAY GIA Component
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
