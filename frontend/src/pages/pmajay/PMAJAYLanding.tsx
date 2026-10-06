import React, { useState, useEffect } from "react";
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
  Clock,
  ChevronRight,
  Award,
  Phone,
  Landmark,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { IVRSimulatorModal } from "@/components/pmajay/IVRSimulatorModal";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";
import { useBeneficiary } from "@/contexts/BeneficiaryContext";

export const PMAJAYLanding: React.FC = () => {
  const { lang, setLang, t, playVoice } = useLanguage();
  const { profile, primaryMatch } = useBeneficiary();
  const [ivrModalOpen, setIvrModalOpen] = useState<boolean>(false);
  const [passportModalOpen, setPassportModalOpen] = useState<boolean>(false);

  // Auto welcome audio on initial visit if not yet heard
  useEffect(() => {
    const key = `pmajay_welcome_played_${lang}`;
    if (!sessionStorage.getItem(key)) {
      const timer = setTimeout(() => {
        playVoice(t("welcome_speech"));
        sessionStorage.setItem(key, "1");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lang]);

  const pathways = [
    {
      id: "self",
      icon: <Award className="w-6 h-6 text-amber-700" />,
      tag: lang === "en" ? "Self-Employment Track" : lang === "mr" ? "सरकारी योजना सहाय्य" : "सरकारी योजना सहयोग",
      tagBg: "bg-amber-100 text-amber-900 border-amber-300",
      title: t("pathway_self_title"),
      subtitle: t("pathway_self_sub"),
      desc: t("pathway_self_desc"),
      highlight: t("pathway_self_highlight"),
      link: "/pmajay/recommendations?pathway=self",
    },
    {
      id: "wage",
      icon: <Briefcase className="w-6 h-6 text-blue-700" />,
      tag: lang === "en" ? "Steady Employment" : lang === "mr" ? "नियमित उपजीविका" : "नियमित आजीविका",
      tagBg: "bg-blue-100 text-blue-900 border-blue-300",
      title: t("pathway_wage_title"),
      subtitle: t("pathway_wage_sub"),
      desc: t("pathway_wage_desc"),
      highlight: t("pathway_wage_highlight"),
      link: "/pmajay/recommendations?pathway=wage",
    },
    {
      id: "shg",
      icon: <Users className="w-6 h-6 text-emerald-700" />,
      tag: lang === "en" ? "Women Empowerment" : lang === "mr" ? "महिला सक्षमीकरण" : "महिला सशक्तिकरण",
      tagBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: t("pathway_shg_title"),
      subtitle: t("pathway_shg_sub"),
      desc: t("pathway_shg_desc"),
      highlight: t("pathway_shg_highlight"),
      link: "/pmajay/recommendations?pathway=shg",
    },
  ];

  const popularTrades = [
    {
      qpCode: "ELE/Q1401",
      title: "Solar PV Installer (Suryamitra)",
      displayTitle: lang === "en" ? "Solar PV Installer (Suryamitra)" : lang === "mr" ? "सोलर पीव्ही इन्स्टॉलर (सूर्यमित्र)" : "सोलर पीवी इंस्टॉलर (सूर्यमित्र)",
      sector: lang === "en" ? "Green Energy / Power" : lang === "mr" ? "हरित ऊर्जा / विद्युत" : "Green Energy / Power",
      nsqf: "NSQF Level 4",
      duration: lang === "en" ? "40 hrs RPL / 300 hrs Class" : lang === "mr" ? "४० तास RPL / ३०० तास वर्ग" : "40 घंटे RPL / 300 घंटे क्लास",
      wage: lang === "en" ? "Standard District Scale" : lang === "mr" ? "मानक जिल्हा उपजीविका दर" : "मानक जिला आजीविका दर",
      desc: lang === "en" ? "Rooftop solar panel installation, inverter testing, and solar pump maintenance." : lang === "mr" ? "रूफटॉप सोलर पॅनेल बसवणे, इन्व्हर्टर चाचणी आणि कृषी पंप देखभाल." : "रूफटॉप सोलर पैनल फिटिंग, इन्वर्टर टेस्टिंग व कृषि सोलर पंप रखरखाव।",
      rpl: true,
      accent: "border-l-4 border-amber-500",
    },
    {
      qpCode: "AMH/Q1947",
      title: "Self Employed Tailor & Boutique",
      displayTitle: lang === "en" ? "Self Employed Tailor & Boutique" : lang === "mr" ? "शिलाई, कटिंग व बुटीक स्वयंरोजगार" : "सिलाई, कटिंग एवं बुटीक स्वरोजगार",
      sector: lang === "en" ? "Apparel & Textiles" : lang === "mr" ? "वस्त्रोद्योग आणि फॅशन" : "Apparel & Textiles",
      nsqf: "NSQF Level 4",
      duration: lang === "en" ? "40 hrs RPL Assessment" : lang === "mr" ? "४० तास RPL मूल्यांकन" : "40 घंटे RPL मूल्यांकन",
      wage: lang === "en" ? "Local Market Livelihood Rate" : lang === "mr" ? "स्थानिक बाजार उपजीविका दर" : "स्थानीय बाजार आजीविका दर",
      desc: lang === "en" ? "Garment stitching, cutting, suit designing, and rural micro-boutique enterprise." : lang === "mr" ? "कपडे शिवणे, कटिंग, ड्रेस डिझायनिंग आणि गावात स्वतंत्र बुटीक व्यवसाय." : "वस्त्र सिलाई, ब्लाउज व सूट डिजाइनिंग व गांव में ही स्वतंत्र बुटीक स्वरोजगार।",
      rpl: true,
      accent: "border-l-4 border-emerald-600",
    },
    {
      qpCode: "ELE/Q3102",
      title: "Field Technician Home Appliances",
      displayTitle: lang === "en" ? "Field Technician Home Appliances" : lang === "mr" ? "घरगुती उपकरणे व मोटर दुरुस्ती तंत्रज्ञ" : "घरेलू उपकरण एवं मोटर मरम्मत तकनीशियन",
      sector: lang === "en" ? "Electronics" : lang === "mr" ? "इलेक्ट्रॉनिक्स" : "Electronics",
      nsqf: "NSQF Level 4",
      duration: lang === "en" ? "360 hrs Practical" : lang === "mr" ? "३६० तास (प्रात्यक्षिक)" : "360 घंटे (प्रैक्टिकल)",
      wage: lang === "en" ? "Standard District Scale" : lang === "mr" ? "मानक जिल्हा उपजीविका दर" : "मानक जिला आजीविका दर",
      desc: lang === "en" ? "Domestic fan, cooler, motor, and mixer grinder repair and electronic servicing." : lang === "mr" ? "पंखा, कुलर, मोटर आणि मिक्सर दुरुस्ती आणि इलेक्ट्रॉनिक सर्व्हिसिंग." : "घरेलू पंखा, कूलर, मोटर व मिक्सर ग्राइंडर रिपेयर व इलेक्ट्रॉनिक सर्विसिंग।",
      rpl: true,
      accent: "border-l-4 border-blue-600",
    },
    {
      qpCode: "PLU/Q0101",
      title: "Plumber (Jal Jeevan Mission)",
      displayTitle: lang === "en" ? "Rural Plumber & Pump Technician" : lang === "mr" ? "नळ-पाणीपुरवठा प्लंबर व पंप तंत्रज्ञ" : "नल-जल योजना प्लंबर एवं पंप तकनीशियन",
      sector: lang === "en" ? "Plumbing" : lang === "mr" ? "प्लंबिंग" : "Plumbing",
      nsqf: "NSQF Level 3",
      duration: lang === "en" ? "240 hrs" : lang === "mr" ? "२४० तास" : "240 घंटे",
      wage: lang === "en" ? "Standard District Scale" : lang === "mr" ? "मानक जिल्हा उपजीविका दर" : "मानक जिला आजीविका दर",
      desc: lang === "en" ? "Drinking water pipeline fitting, pipe leakage repair, and village water operator." : lang === "mr" ? "पिण्याच्या पाण्याची पाईपलाईन, गळती दुरुस्ती आणि ग्राम पाणी समिती पंप चालक." : "ग्रामीण पेयजल पाइपलाइन फिटिंग, नल लीकेज मरम्मत व ग्राम जल समिति पंप ऑपरेटर।",
      rpl: true,
      accent: "border-l-4 border-sky-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main id="main-content" className="flex-1 w-full flex flex-col">
        {/* ════ HERO SECTION: Warm, Humane, Reassuring ════ */}
        <section className="bg-gradient-to-b from-[#002147] via-[#002754] to-[#001733] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 relative overflow-hidden">
          {/* Subtle National Emblem background watermark */}
          <div className="absolute right-4 top-10 opacity-5 pointer-events-none hidden lg:block">
            <EmblemOfIndia size={440} variant="white" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Reassurance Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-amber-300 font-medium backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                <span>{t("hero_gov_tag")}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("hero_badge")}</span>
              </span>
            </div>

            {/* Main Headline & Voice Console Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Empathetic Message */}
              <div className="lg:col-span-7 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                  {t("hero_h1_main")}
                  <br />
                  <span className="text-amber-400">{t("hero_h1_sub")}</span>
                </h1>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                  {t("hero_desc")}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to={`/pmajay/interview?lang=${lang === "en" ? "en-IN" : lang === "mr" ? "mr-IN" : "hi-IN"}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 hover:shadow-emerald-900/40"
                  >
                    <Mic className="w-5 h-5 text-emerald-200 animate-pulse" />
                    <span>{t("btn_mic_start")}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIvrModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-300 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
                    title="कीपैड फोन से कॉल करने का सिम्युलेटर"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>{t("btn_ivr_dial")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPassportModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3.5 rounded-xl font-medium text-xs sm:text-sm transition-all"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>{t("btn_passport")}</span>
                  </button>
                </div>

                {/* Guarantees */}
                <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t("guarantee_no_forms")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t("guarantee_toolkit")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t("guarantee_cert")}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Humane Voice Assistant Preview Card */}
              <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      {t("assistant_ready")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playVoice(t("welcome_speech"))}
                    className="p-1 rounded text-slate-500 hover:text-emerald-700 transition-colors"
                    title={t("play_audio")}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">{t("assistant_greeting_title")}</p>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
                    "{t("assistant_greeting_quote")}"
                  </p>
                </div>

                {/* Quick language selection chips */}
                <div className="space-y-2 mb-5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {t("dialect_heading")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLang("hi")}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        lang === "hi"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{t("dialect_hindi_title")}</div>
                      <div className="text-[10px] text-slate-500">{t("dialect_hindi_desc")}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("hi")}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        lang === "hi" && localStorage.getItem("pmajay_selected_lang") === "bho-IN"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{t("dialect_bhojpuri_title")}</div>
                      <div className="text-[10px] text-slate-500">{t("dialect_bhojpuri_desc")}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("mr")}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        lang === "mr"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{t("dialect_marathi_title")}</div>
                      <div className="text-[10px] text-slate-500">{t("dialect_marathi_desc")}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        lang === "en"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{t("dialect_english_title")}</div>
                      <div className="text-[10px] text-slate-500">{t("dialect_english_desc")}</div>
                    </button>
                  </div>
                </div>

                {/* Bottom Card CTA */}
                <Link
                  to={`/pmajay/interview?lang=${lang === "en" ? "en-IN" : lang === "mr" ? "mr-IN" : "hi-IN"}`}
                  className="w-full py-3 rounded-xl bg-[#002147] hover:bg-[#002b5c] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>{t("btn_start_interview")}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════ 3 DISTINCT LIVELIHOOD PATHWAYS ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {t("pathways_badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-2">
                {t("pathways_heading")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {t("pathways_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pathways.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagBg}`}>
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 mb-3">{item.subtitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-bold text-[#002147] mb-3">{item.highlight}</div>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>{t("btn_explore_track")}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ 40-HOUR RPL FAST-TRACK BANNER ════ */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-amber-50/60 border-b border-amber-200">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t("rpl_banner_tag")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                  {t("rpl_banner_title")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t("rpl_banner_desc")}
                </p>
              </div>

              <Link
                to={`/pmajay/interview?lang=${lang === "en" ? "en-IN" : lang === "mr" ? "mr-IN" : "hi-IN"}`}
                className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                {t("btn_rpl_record")}
              </Link>
            </div>
          </div>
        </section>

        {/* ════ POPULAR NSQF TRADES ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("trades_section_tag")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-1">
                  {t("trades_section_title")}
                </h2>
              </div>
              <Link
                to="/pmajay/recommendations"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002147] hover:text-emerald-700"
              >
                <span>{t("btn_browse_all_trades")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularTrades.map((tradeItem, i) => (
                <div
                  key={i}
                  className={`bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between ${tradeItem.accent}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                      <span>{tradeItem.qpCode}</span>
                      <span className="font-semibold text-slate-700">{tradeItem.nsqf}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                      {tradeItem.displayTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-2">{tradeItem.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{tradeItem.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 text-[11px]">{tradeItem.duration}</span>
                      <span className="font-bold text-emerald-700">{tradeItem.wage}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      {t("trade_toolkit_tag")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ 4 SIMPLE STEPS JOURNEY ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">
                {t("steps_section_title")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {t("steps_section_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">{t("step1_num")}</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{t("step1_title")}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t("step1_desc")}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">{t("step2_num")}</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{t("step2_title")}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t("step2_desc")}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">{t("step3_num")}</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{t("step3_title")}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t("step3_desc")}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">{t("step4_num")}</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{t("step4_title")}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t("step4_desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════ LOCAL CLUSTER HIGHLIGHT (Varanasi & Chandauli) ════ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("cluster_tag")}</span>
                </div>
                <h3 className="text-xl font-bold text-[#002147]">
                  {t("cluster_title")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t("cluster_desc")}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/pmajay/opportunities"
                  className="px-5 py-3 rounded-xl bg-[#002147] hover:bg-[#002b5c] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  {t("btn_view_local_opps")}
                </Link>
                <Link
                  to="/pmajay/admin"
                  className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all"
                >
                  {t("btn_officer_login")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER: Clean, GIGW 3.0 / NIC Standards ── */}
      <footer className="bg-[#001733] text-slate-300 py-10 px-4 sm:px-6 lg:px-8 font-sans border-t-2 border-amber-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex items-center gap-3">
            <EmblemOfIndia size={28} variant="gold" />
            <div>
              <div className="font-bold text-white text-sm">{t("portal_name")}</div>
              <div className="text-slate-400 text-[11px]">
                {t("footer_tagline")}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <Link to="/pmajay" className="hover:text-white">{t("nav_home")}</Link>
            <span>•</span>
            <Link to="/pmajay/interview" className="hover:text-white">{t("nav_voice")}</Link>
            <span>•</span>
            <Link to="/pmajay/recommendations" className="hover:text-white">{t("nav_recommendations")}</Link>
            <span>•</span>
            <Link to="/pmajay/opportunities" className="hover:text-white">{t("nav_jobs")}</Link>
            <span>•</span>
            <Link to="/pmajay/admin" className="hover:text-white">{t("nav_admin")}</Link>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <div>{t("footer_helpline")}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{t("footer_compliance")}</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IVRSimulatorModal isOpen={ivrModalOpen} onClose={() => setIvrModalOpen(false)} />
      <LivelihoodPassportModal
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        beneficiaryName={profile?.basic_info?.name?.value || "Ramesh Kumar"}
        district={`${profile?.basic_info?.location?.value || "Varanasi"}, Uttar Pradesh`}
        education={profile?.education?.highest_level?.value?.replace("_", " ") || "10th Pass"}
        matchedTrade={primaryMatch?.course_name || "Solar PV Installer (Suryamitra)"}
        qpCode={primaryMatch?.qp_code || "ELE/Q1401"}
        nsqfLevel={primaryMatch?.nsqf_level || 4}
        trainingCentre={primaryMatch?.training_centre_name || "PM Kaushal Kendra (PMKK) & ITI Karaundi Campus, Varanasi"}
        isRPL={primaryMatch?.is_rpl ?? ((profile?.current_livelihood?.skills?.length ?? 0) > 0)}
      />
    </div>
  );
};
